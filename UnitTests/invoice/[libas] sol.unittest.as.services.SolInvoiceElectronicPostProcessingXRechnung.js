
describe("[libas] sol.unittest.as.services.SolInvoiceElectronicPostProcessingXRechnung", function () {
  var originalTimeout, content, sord, tplSord, keyValues, invoiceConfig, entryFolder, targetId,
      intrayDocumentSord, containerMode, invoiceMask, maskId, archiveTargetId, dstMaskId, 
      addToFullTextDatabase, sourceId, i, objIncomingInvoiceId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceElectronicPostProcessingXRechnung").then(function success(obSolInvoiceElectronicPostProcessingXRechnungId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("prepare incoming invoice", function () {
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
            test.Utils.getSord("ARCPATH:" + entryFolder).then(function success1(targetSord1) {
              if (!targetSord1) {
                test.Utils.createPath("ARCPATH:" + entryFolder, "Folder").then(function success2(createPathResult) {
                  test.Utils.getSord("ARCPATH:" + entryFolder).then(function success3(targetSord2) {
                    targetId = targetSord2.id;
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
                targetId = targetSord1.id;
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
          containerMode = (invoiceConfig.config.useInvoiceContainer.value === true);
          invoiceMask = invoiceConfig.config.invoiceMaskName.value;
          test.Utils.getDocMask(invoiceMask).then(function success(docMask) {
            maskId = docMask.id;
            archiveTargetId = targetId;
            if (containerMode) {
              test.Utils.createSord(targetId, invoiceMask, intrayDocumentSord.name, null, null, {
                sortOrder: "MANUAL",
                documentContainer: true
              }).then(function success1(archiveTargetId1) {
                archiveTargetId = archiveTargetId1;
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
      it("create incoming invoice document", function (done) {
        expect(function () {
          dstMaskId = containerMode ? 0 : maskId;
          addToFullTextDatabase = (invoiceConfig.config.addToFullTextDatabase && invoiceConfig.config.addToFullTextDatabase.value) ? invoiceConfig.config.addToFullTextDatabase.value : false;
          test.Utils.changeMask(intrayDocumentSord, dstMaskId).then(function success(intrayDocumentSord1) {
            intrayDocumentSord1.details.documentContainer = containerMode;
            test.Utils.checkinSord(intrayDocumentSord1).then(function success1(checkinSordResult) {
              sourceId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/invoice [unit tests]/Resources/ZugferdInvoiceUnittest";
              test.Utils.execute("RF_sol_function_CopyFolderContents", {
                objId: archiveTargetId,
                source: sourceId,
                copySourceAcl: false,
                inheritDestinationAcl: true
              }).then(function success2(jsonResult) {
                test.Utils.findChildren("ARCPATH:" + entryFolder).then(function success3(sords) {
                  for (i = 0; i < sords.length; i++) {
                    if ((sords[i].name == intrayDocumentSord1.name) && (sords[i].mask == maskId)) {
                      objIncomingInvoiceId = sords[i].id;
                    }
                  }
                  test.Utils.getSord(objIncomingInvoiceId).then(function success4(IncomingInvoiceSord) {
                    IncomingInvoiceSord.details.fulltext = addToFullTextDatabase;
                    test.Utils.checkinSord(IncomingInvoiceSord).then(function success5(checkinSordResult1) {
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
    describe("sol.invoice_electronic.as.postProcessing.XRechnung", function () {
      it("process", function (done) {
        expect(function () {
          sord = objIncomingInvoiceId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_electronic.as.postProcessing.XRechnung",
              classConfig: {},
              method: "process",
              params: [sord]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setPaymentTerms", function (done) {
        expect(function () {
          tplSord = objIncomingInvoiceId;
          keyValues = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.invoice.as.services.ExecuteLib",
            config: {
              className: "sol.invoice_electronic.as.postProcessing.XRechnung",
              classConfig: {},
              method: "setPaymentTerms",
              params: [tplSord, keyValues]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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
          test.Utils.deleteSord(objIncomingInvoiceId).then(function success2(deleteResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
    });
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