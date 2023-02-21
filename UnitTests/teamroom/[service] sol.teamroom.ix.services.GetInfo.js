
describe("[service] sol.teamroom.ix.services.GetInfo", function () {
  var originalTimeout, objTempId, id;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetInfo").then(function success(objTempId1) {
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
    describe("sol.teamroom.ix.services.GetInfo", function () {
      it("getTeamroomChildren", function (done) {
        id = objTempId;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.services.GetInfo",
            classConfig: {},
            method: "getTeamroomChildren",
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
      it("getTeamroomFeed", function (done) {
        id = objTempId;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.services.GetInfo",
            classConfig: {},
            method: "getTeamroomFeed",
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
      it("getTeamroomRelation", function (done) {
        id = objTempId;
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.services.GetInfo",
            classConfig: {},
            method: "getTeamroomRelation",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.services.GetInfo",
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
    describe("RF_sol_teamroom_service_GetInfo", function () {
      it("should throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_service_GetInfo", {
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
      it("'mode':'feed'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_service_GetInfo", {
            objId: objTempId,
            mode: "feed"
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
      it("'mode':'relation'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_service_GetInfo", {
            objId: objTempId,
            mode: "relation"
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
      it("'mode':'children'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_service_GetInfo", {
            objId: objTempId,
            mode: "children"
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