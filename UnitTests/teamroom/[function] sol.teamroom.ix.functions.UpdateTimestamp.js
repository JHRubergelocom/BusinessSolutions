
describe("[function] sol.teamroom.ix.functions.UpdateTimestamp", function () {
  var originalTimeout, objTempId,
      id, timestamp;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateTimestamp").then(function success(objTempId1) {
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
    describe("sol.teamroom.ix.functions.UpdateTimestamp", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.UpdateTimestamp",
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
      it("updateFeedTimestamp", function (done) {
        expect(function () {
          id = objTempId;
          timestamp = "20201212";
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.UpdateTimestamp",
            classConfig: {},
            method: "updateFeedTimestamp",
            params: [id, timestamp]
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
      it("updateTimestamp", function (done) {
        expect(function () {
          id = objTempId;
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.UpdateTimestamp",
            classConfig: {},
            method: "updateTimestamp",
            params: [id]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_teamroom_function_UpdateTimestamp", function () {
      it("should throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_UpdateTimestamp", {
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
      it("'mode':'updatets'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_UpdateTimestamp", {
            mode: "updatets",
            id: objTempId,
            timestamp: "20201212"
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
      it("'mode':'updatetsfeed'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_UpdateTimestamp", {
            mode: "updatetsfeed",
            id: objTempId,
            timestamp: "20201212"
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