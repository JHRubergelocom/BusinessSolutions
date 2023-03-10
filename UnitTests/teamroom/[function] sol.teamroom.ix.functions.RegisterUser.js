
describe("[function] sol.teamroom.ix.functions.RegisterUser", function () {
  var originalTimeout, token;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RegisterUser").then(function success(objTempId) {
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
    describe("RF_sol_teamroom_function_RegisterUser", function () {
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
          test.Utils.execute("RF_sol_teamroom_function_RegisterUser", {
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
      it("'mode':'register'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_RegisterUser", {
            apiToken: token, 
            mode: "register", 
            user: "Administrator"
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
      it("'mode':'sendregistration'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_RegisterUser", {
            apiToken: token, 
            mode: "sendregistration", 
            user: "Administrator"
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