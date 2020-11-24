
describe("[service] sol.teamroom.ix.services.GetInfo", function () {
  var originalTimeout, objTempId, token;

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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_teamroom_service_GetInfo", function () {
      it("get teamroom.remote.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/elo.teamroom.Remote/Configuration/teamroom.remote.config",
            forceReload: true
          }).then(function success(jsonConfig) {
            token = jsonConfig.config.entities.connection["API_TOKEN"];
            expect(jsonConfig.config).toBeDefined();
            expect(jsonConfig.config.entities).toBeDefined();
            expect(jsonConfig.config.entities.connection).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
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
            token: token, 
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
            token: token, 
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
            token: token, 
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