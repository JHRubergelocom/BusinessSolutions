
describe("PerformanceTestInvoice", function () {
  var entryFolder, entryFolderId,
      containerMode, invoiceConfig, maskId, intrayDocumentSord,
      dstMaskId, addToFullTextDatabase,
      sourceId, i, invoiceMask, originalTimeout,
      numInvoices, promise, promises,
      invoiceContainertIds, IncomingInvoiceSords,
      IncomingInvoiceIds, IncomingInvoiceId,
      templFlowId, flowName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    numInvoices = 500;
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
        invoiceMask = invoiceConfig.config.invoiceMaskName.value;
        test.Utils.getDocMask(invoiceMask).then(function success(docMask) {
          maskId = docMask.id;
          if (containerMode) {
            invoiceContainertIds = [];
            for (i = 0; i < numInvoices; i++) {
              promise = new Promise (function (resolve, reject) {
                test.Utils.createSord(entryFolderId, invoiceMask, intrayDocumentSord.name + i, null, null, {
                  sortOrder: "MANUAL",
                  documentContainer: true
                }).then(function success1(invoiceContainertId) {
                  invoiceContainertIds.push(invoiceContainertId);
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
    it("changeMask incoming invoice document", function (done) {
      expect(function () {
        dstMaskId = containerMode ? 0 : maskId;
        addToFullTextDatabase = (invoiceConfig.config.addToFullTextDatabase && invoiceConfig.config.addToFullTextDatabase.value) ? invoiceConfig.config.addToFullTextDatabase.value : false;
        test.Utils.changeMask(intrayDocumentSord, dstMaskId).then(function success(intrayDocumentSord1) {
          intrayDocumentSord = intrayDocumentSord1;
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkinsord incoming invoice document", function (done) {
      expect(function () {
        intrayDocumentSord.details.documentContainer = containerMode;
        test.Utils.checkinSord(intrayDocumentSord).then(function success(checkinSordResult) {
          done();
        }, function error(err) {
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("copy folder contents", function (done) {
      expect(function () {
        promises = [];
        if (containerMode) {
          for (i = 0; i < invoiceContainertIds.length; i++) {
            promise = new Promise (function (resolve, reject) {
              sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest";
              test.Utils.execute("RF_sol_function_CopyFolderContents", {
                objId: invoiceContainertIds[i],
                source: sourceId,
                copySourceAcl: false,
                inheritDestinationAcl: true
              }).then(function success(jsonResult) {
                resolve();
              }, function error(err) {
                reject(err);
              }
              );
            });
            promises.push(promise);
          }
        } else {
          IncomingInvoiceIds = [];
          for (i = 0; i < numInvoices; i++) {
            promise = new Promise (function (resolve, reject) {
              sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest";
              test.Utils.execute("RF_sol_function_CopyFolderContents", {
                objId: entryFolderId,
                source: sourceId,
                copySourceAcl: false,
                inheritDestinationAcl: true
              }).then(function success(objId) {
                IncomingInvoiceIds.push(objId);
                resolve();
              }, function error(err) {
                reject(err);
              }
              );
            });
            promises.push(promise);
          }
        }
        Promise.all(promises).then(function success(deleteResult) {
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
        if (containerMode) {
          IncomingInvoiceSords = [];
          for (i = 0; i < invoiceContainertIds.length; i++) {
            promise = new Promise (function (resolve, reject) {
              test.Utils.getSord(invoiceContainertIds[i]).then(function success(IncomingInvoiceSord) {
                IncomingInvoiceSords.push(IncomingInvoiceSord);
                resolve();
              }, function error(err) {
                reject(err);
              }
              );

            });
            promises.push(promise);
          }
        } else {
          IncomingInvoiceSords = [];
          for (i = 0; i < IncomingInvoiceIds.length; i++) {
            promise = new Promise (function (resolve, reject) {
              test.Utils.getSord(IncomingInvoiceIds[i]).then(function success(IncomingInvoiceSord) {
                IncomingInvoiceSords.push(IncomingInvoiceSord);
                resolve();
              }, function error(err) {
                reject(err);
              }
              );

            });
            promises.push(promise);
          }
        }
        Promise.all(promises).then(function success(deleteResult) {
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
        for (i = 0; i < IncomingInvoiceSords.length; i++) {
          promise = new Promise (function (resolve, reject) {
            IncomingInvoiceSords[i].details.fulltext = addToFullTextDatabase;
            test.Utils.checkinSord(IncomingInvoiceSords[i]).then(function success(checkinSordResult1) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success(deleteResult) {
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
        for (i = 0; i < IncomingInvoiceSords.length; i++) {
          promise = new Promise (function (resolve, reject) {
            templFlowId = "sol.invoice.Base";
            flowName = IncomingInvoiceSords[i].name;
            IncomingInvoiceId = IncomingInvoiceSords[i].id;
            test.Utils.startWorkflow(templFlowId, flowName, IncomingInvoiceId).then(function success(flowId) {
              resolve();
            }, function error(err) {
              reject(err);
            }
            );
          });
          promises.push(promise);
        }
        Promise.all(promises).then(function success(deleteResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove incoming invoice", function (done) {
      expect(function () {
        if (containerMode) {
          test.Utils.deleteSords(invoiceContainertIds).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        } else {
          test.Utils.deleteSords(IncomingInvoiceIds).then(function success(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }
      }).not.toThrow();
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
              test.Utils.getActiveWorkflows().then(function success4(wfs1) {
                test.Utils.removeActiveWorkflows(wfs1).then(function success5(removeFinishedWorkflowsResult1) {
                  done();
                }, function error(err) {
                  console.error(err);
                  done();
                }
                );
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }, function error(err) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});