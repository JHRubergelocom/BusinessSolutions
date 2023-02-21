/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolInvoiceLineApprovalMixin", function () {
  var invoiceConfig, entryFolder, targetId, intrayDocumentSord, sourceId, i,
      objIncomingInvoiceId, params,
      containerMode, invoiceMask, maskId, archiveTargetId, dstMaskId, addToFullTextDatabase,
      originalTimeout, currentValue, condition, conditions, value, lineNo,
      text, objId, flowId, rule, wfMap, approvalId, approver;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceLineApprovalMixin").then(function success(obSolInvoiceLineApprovalMixinId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
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
    it("Start Electronic Extract Data", function (done) {
      expect(function () {
        params = {
          objId: objIncomingInvoiceId,
          statusFieldName: "INVOICE_DATACOLLECTION",
          statusFieldValue: "Electronic invoice",
          timestampMapFieldName: "ELECTRONIC_INVOICE_IMPORTED"
        };
        test.Utils.executeASActionHandler("invoice", "sol.invoice_electronic.ExtractData", params, []).then(function success(jsonResults) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        });
      }).not.toThrow();
    });
  });
  describe("Test Lib Functions", function () {
    describe("sol.invoice.ix.LineApprovalMixin", function () {
      it("BETWEEN", function (done) {
        expect(function () {
          currentValue = 100;
          condition = { valueStart: 10, valueEnd: 200 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "BETWEEN",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("EMPTY", function (done) {
        expect(function () {
          currentValue = "";
          condition = {};
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "EMPTY",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("EQUALS", function (done) {
        expect(function () {
          currentValue = 100;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "EQUALS",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("GE", function (done) {
        expect(function () {
          currentValue = 100;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "GE",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("GT", function (done) {
        expect(function () {
          currentValue = 101;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "GT",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LE", function (done) {
        expect(function () {
          currentValue = 100;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "LE",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("LT", function (done) {
        expect(function () {
          currentValue = 99;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "LT",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("NOT", function (done) {
        expect(function () {
          currentValue = 200;
          condition = { value: 100 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "NOT",
            params: [currentValue, condition]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkConditions", function (done) {
        expect(function () {
          conditions = [];
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "checkConditions",
            params: [conditions]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertToNumber", function (done) {
        expect(function () {
          value = 100;
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "convertToNumber",
            params: [value]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findLineApproverNames", function (done) {
        expect(function () {
          lineNo = 1;
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "findLineApproverNames",
            params: [lineNo]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getApproverSet", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "getApproverSet",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getMaxApprovalId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "getMaxApprovalId",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          condition = { type: "MAP", key: "key1" };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "getValue",
            params: [condition]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "loadConfig",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("logInvoiceData", function (done) {
        expect(function () {
          text = "text1";
          objId = objIncomingInvoiceId;
          flowId = 9999;
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "logInvoiceData",
            params: [text, objId, flowId]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processRule", function (done) {
        expect(function () {
          rule = {};
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "processRule",
            params: [rule]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setApprovalIds", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "setApprovalIds",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setLineApproved", function (done) {
        expect(function () {
          wfMap = {};
          approvalId = "approvalId1";
          approver = "approver1";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: objIncomingInvoiceId },
            method: "setLineApproved",
            params: [wfMap, approvalId, approver]
          }).then(function success(jsonResult) {
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