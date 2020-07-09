
describe("[libas] sol.unittest.as.services.SolContractActionsCreateContractCoverSheet", function () {
  var obSolContractActionsCreateContractCoverSheetId, contractCoversheetTypes, originalTimeout, content, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContractActionsCreateContractCoverSheet").then(function success(obSolContractActionsCreateContractCoverSheetId1) {
        obSolContractActionsCreateContractCoverSheetId = obSolContractActionsCreateContractCoverSheetId1;
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
    describe("sol.contract.as.actions.CreateContractCoverSheet", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.CreateContractCoverSheet",
              classConfig: {},
              method: "getName",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.CreateContractCoverSheet",
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
      it("contractCoversheetTypes must be available", function (done) {
        test.Utils.execute("RF_sol_contract_service_PrepareContractCoverSheet", { targetId: obSolContractActionsCreateContractCoverSheetId }).then(function success(prepareResult) {
          expect(prepareResult.valid).toBeDefined();
          expect(prepareResult.types).toBeDefined();
          contractCoversheetTypes = prepareResult.types;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.CreateContractCoverSheet",
              classConfig: { templateId: contractCoversheetTypes[0].objId, targetId: obSolContractActionsCreateContractCoverSheetId },
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