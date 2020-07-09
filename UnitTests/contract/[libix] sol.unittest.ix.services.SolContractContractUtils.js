
describe("[libix] sol.unittest.ix.services.SolContractContractUtils", function () {
  var originalTimeout, objId, wfName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContractContractUtils").then(function success(obSolContractContractUtilsId) {
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
    describe("sol.contract.ix.ContractUtils", function () {
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.ix.ContractUtils",
            classConfig: {},
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
      it("startCloseContractWorkflow", function (done) {
        expect(function () {
          objId = "objId1";
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.ix.ContractUtils",
            classConfig: {},
            method: "startCloseContractWorkflow",
            params: [objId, wfName]
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
      it("startDeleteContractWorkflow", function (done) {
        expect(function () {
          objId = "objId1";
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.ix.ContractUtils",
            classConfig: {},
            method: "startDeleteContractWorkflow",
            params: [objId, wfName]
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
      it("startOpenContractWorkflow", function (done) {
        expect(function () {
          objId = "objId1";
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.ix.ContractUtils",
            classConfig: {},
            method: "startOpenContractWorkflow",
            params: [objId, wfName]
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