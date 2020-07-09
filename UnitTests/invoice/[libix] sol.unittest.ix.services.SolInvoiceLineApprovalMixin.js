
describe("[libix] sol.unittest.ix.services.SolInvoiceLineApprovalMixin", function () {
  var originalTimeout, currentValue, condition, conditions, value, lineNo,
      text, objId, flowId, rule, wfMap, approvalId, approver, obTempIncomingInvoiceId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolInvoiceLineApprovalMixin").then(function success(obSolInvoiceLineApprovalMixinId) {
        test.Utils.createSord(obSolInvoiceLineApprovalMixinId, "Incoming Invoice", "TempIncomingInvoice").then(function success1(obTempIncomingInvoiceId1) {
          obTempIncomingInvoiceId = obTempIncomingInvoiceId1;
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
  describe("Test Lib Functions", function () {
    describe("sol.invoice.ix.LineApprovalMixin", function () {
      it("BETWEEN", function (done) {
        expect(function () {
          currentValue = 100;
          condition = { valueStart: 10, valueEnd: 200 };
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
      it("checkConditions", function (done) {
        expect(function () {
          conditions = [];
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
          objId = obTempIncomingInvoiceId;
          flowId = 9999;
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.invoice.ix.LineApprovalMixin",
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
            classConfig: { objId: obTempIncomingInvoiceId },
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
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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
    }).not.toThrow();
  });
});