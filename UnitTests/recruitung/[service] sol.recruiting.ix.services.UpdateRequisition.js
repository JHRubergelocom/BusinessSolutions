
describe("[service] sol.recruiting.ix.services.UpdateRequisition", function () {
  var originalTimeout, objTempId,
      params, mappingTable, sord, m, mapping, guid;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateRequisition").then(function success(objTempId1) {
        objTempId = objTempId1;
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
    describe("sol.recruiting.ix.services.UpdateRequisition", function () {
      it("addMappingToSord", function (done) {
        expect(function () {
          params = {};
          mappingTable = {};
          sord = { id: objTempId };
          m = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.UpdateRequisition",
            classConfig: {},
            method: "addMappingToSord",
            params: [params, mappingTable, sord, m]
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
      it("convertParamsToSordData", function (done) {
        expect(function () {
          params = {};
          mapping = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.UpdateRequisition",
            classConfig: {},
            method: "convertParamsToSordData",
            params: [params, mapping]
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
      it("getEmptySord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.UpdateRequisition",
            classConfig: {},
            method: "getEmptySord",
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
      it("getTargetConfig", function (done) {
        expect(function () {
          guid = "(E10E1000-E100-E100-E100-E10E10E10E00)";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.UpdateRequisition",
            classConfig: {},
            method: "getTargetConfig",
            params: [guid]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.UpdateRequisition",
            classConfig: {},
            method: "process",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_recruiting_service_UpdateRequisition", function () {
      it("should throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateRequisition", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateRequisition", {
            requisitionByNo: "0077"
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            // fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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