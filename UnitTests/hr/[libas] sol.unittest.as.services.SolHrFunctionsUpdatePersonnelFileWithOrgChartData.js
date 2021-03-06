
describe("[libas] sol.unittest.as.services.SolHrFunctionsUpdatePersonnelFileWithOrgChartData", function () {
  var obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId, originalTimeout, content, startElement, orgChartElement;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolHrFunctionsUpdatePersonnelFileWithOrgChartData").then(function success(obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId1) {
        obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId = obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId1;
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
    describe("sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData", function () {
      it("collectOrgChartElements", function (done) {
        expect(function () {
          startElement = obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData",
              classConfig: { orgChartGuid: obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId },
              method: "collectOrgChartElements",
              params: [startElement]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData",
              classConfig: { orgChartGuid: obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId },
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
      it("processOrgChartElement", function (done) {
        expect(function () {
          orgChartElement = obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.functions.UpdatePersonnelFileWithOrgChartData",
              classConfig: { orgChartGuid: obSolHrFunctionsUpdatePersonnelFileWithOrgChartDataId },
              method: "processOrgChartElement",
              params: [orgChartElement]
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