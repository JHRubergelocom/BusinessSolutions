
describe("PerformanceTestInvoice", function () {
  var entryFolder, entryFolderId,
      containerMode, invoiceConfig, maskId, intrayDocumentSord,
      dstMaskId, addToFullTextDatabase,
      sourceId, i, j, invoiceMask, originalTimeout,
      numInvoices, promise, promises,
      invoiceContainertIds, IncomingInvoiceSord,
      templFlowId, flowName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    numInvoices = 5;
    expect(function () {
      test.Utils.createTempSord("PerformanceTestInvoice", null, null).then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Performance Test Invoice", function () {
    it("get entry folder", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice/Configuration/sol.invoice.config",
          forceReload: true
        }).then(function success(invoiceConfig1) {
          invoiceConfig = invoiceConfig1;
          expect(invoiceConfig.config).toBeDefined();
          expect(invoiceConfig.config.paths.entry.value).toBeDefined();
          entryFolder = invoiceConfig.config.paths.entry.value;
          test.Utils.getSord("ARCPATH:" + entryFolder).then(function success1(entryFolderSord) {
            if (!entryFolderSord) {
              test.Utils.createPath("ARCPATH:" + entryFolder, "Folder").then(function success2(createPathResult) {
                test.Utils.getSord("ARCPATH:" + entryFolder).then(function success3(entryFolderSord1) {
                  entryFolderId = entryFolderSord1.id;
                  done();
                }, function error(err) {
                  fail(err);
                  console.error(err);
                  done();
                }
                );
              }, function error(err) {
                fail(err);
                console.error(err);
                done();
              }
              );
            } else {
              entryFolderId = entryFolderSord.id;
              done();
            }
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get intray document", function (done) {
      expect(function () {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest").then(function success(intrayDocumentSord1) {
          intrayDocumentSord = intrayDocumentSord1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("create incoming invoice container", function (done) {
      expect(function () {
        promises = [];
        containerMode = (invoiceConfig.config.useInvoiceContainer.value === true);
// TODO Testen
        containerMode = null;
// TODO

        invoiceMask = invoiceConfig.config.invoiceMaskName.value;
        test.Utils.getDocMask(invoiceMask).then(function success(docMask) {
          maskId = docMask.id;
          if (containerMode) {
            for (i = 0; i < numInvoices; i++) {
              promise = new Promise (function (resolve, reject) {
                test.Utils.createSord(entryFolderId, invoiceMask, intrayDocumentSord.name + i, null, null, {
                  sortOrder: "MANUAL",
                  documentContainer: true
                }).then(function success1(invoiceContainertId) {
                  resolve();
                }, function error(err) {
                  reject(err);
                }
                );
              });
              promises.push(promise);
            }
            Promise.all(promises).then(function success1(deleteResult) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          } else {
            done();
          }
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get invoice container id", function (done) {
      expect(function () {
        invoiceContainertIds = [];
        if (containerMode) {
          test.Utils.findChildren("ARCPATH:" + entryFolder).then(function success3(sords) {
            for (i = 0; i < sords.length; i++) {
              for (j = 0; j < numInvoices; j++) {
                if ((sords[i].name == (intrayDocumentSord.name + j + "")) && (sords[i].mask == maskId)) {
                  invoiceContainertIds.push(sords[i].id);
                }
              }
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        } else {
          invoiceContainertIds.push(entryFolderId);
        }
      }).not.toThrow();
    });
    it("changeMask incoming invoice document", function (done) {
      expect(function () {
        promises = [];
        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            dstMaskId = containerMode ? 0 : maskId;
            addToFullTextDatabase = (invoiceConfig.config.addToFullTextDatabase && invoiceConfig.config.addToFullTextDatabase.value) ? invoiceConfig.config.addToFullTextDatabase.value : false;
            test.Utils.changeMask(intrayDocumentSord, dstMaskId).then(function success(intrayDocumentSord1) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkinsord incoming invoice document", function (done) {
      expect(function () {
        promises = [];
        for (i = 0; i < numInvoices; i++) {
          promise = new Promise (function (resolve, reject) {
            intrayDocumentSord.details.documentContainer = containerMode;
            test.Utils.checkinSord(intrayDocumentSord).then(function success1(checkinSordResult) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("copy folder contents", function (done) {
      expect(function () {
        promises = [];
        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest";
            test.Utils.execute("RF_sol_function_CopyFolderContents", {
              objId: invoiceContainertIds[i],
              source: sourceId,
              copySourceAcl: false,
              inheritDestinationAcl: true
            }).then(function success2(jsonResult) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get sord", function (done) {
      expect(function () {
        promises = [];

        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            test.Utils.getSord(invoiceContainertIds[i]).then(function success4(IncomingInvoiceSord1) {
              IncomingInvoiceSord = IncomingInvoiceSord1;
              resolve();
            }, function error(err) {
              reject(err);
            }
            );

          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkinsord", function (done) {
      expect(function () {
        promises = [];

        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            IncomingInvoiceSord.details.fulltext = addToFullTextDatabase;
            test.Utils.checkinSord(IncomingInvoiceSord).then(function success5(checkinSordResult1) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get sord invoice", function (done) {
      expect(function () {
        promises = [];
        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            test.Utils.getSord(invoiceContainertIds[i]).then(function success(IncomingInvoiceSord1) {
              IncomingInvoiceSord = IncomingInvoiceSord1;
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("start workflow incoming invoice", function (done) {
      expect(function () {
        promises = [];
        for (i = 0; i < invoiceContainertIds.length; i++) {
          promise = new Promise (function (resolve, reject) {
            templFlowId = "sol.invoice.Base";
            flowName = IncomingInvoiceSord.name;
            test.Utils.startWorkflow(templFlowId, flowName, invoiceContainertIds[i]).then(function success1(flowId) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });















// TODO Create entry invoices













// TODO Create Start invoice workflow


// TODO Create entry invoice workflow

  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});