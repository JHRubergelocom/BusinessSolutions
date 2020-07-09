
describe("[libas] sol.unittest.as.services.SolContractFunctionsCreateCashflowReportBackground", function () {
  var obSolContractFunctionsCreateCashflowReportBackgroundId, repTemplates, originalTimeout, content, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContractFunctionsCreateCashflowReportBackground").then(function success(obSolContractFunctionsCreateCashflowReportBackgroundId1) {
        obSolContractFunctionsCreateCashflowReportBackgroundId = obSolContractFunctionsCreateCashflowReportBackgroundId1;
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
    describe("sol.contract.as.functions.CreateCashflowReportBackground", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.functions.CreateCashflowReportBackground",
              classConfig: {},
              method: "initialize",
              params: [config]
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
      it("get ReportTemplates should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contract_service_ReportTemplates", { filter: { type: "cashflow" } }).then(function success(repTemplates1) {
            repTemplates = repTemplates1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("repTemplates.length must greater than zero", function () {
        expect(repTemplates.length).toBeGreaterThan(0);
      });
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.functions.CreateCashflowReportBackground",
              classConfig: { templateId: repTemplates[0].objId, parentId: obSolContractFunctionsCreateCashflowReportBackgroundId },
              method: "process",
              params: []
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