
describe("[function] sol.recruiting.ix.functions.ChangeUserStatus", function () {
  var userGuid, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChangeUserStatus").then(function success(objTempId) {
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
    describe("RF_sol_recruiting_function_ChangeUserStatus", function () {
      it("should throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_ChangeUserStatus", {
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
      it("register jobportal user", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_RegisterUser", {
            email: "test-business-solutions@elo.local",
            password: "elo",
            agreed: "yes",
            firstname: "Unittest",
            lastname: "Unittest",
            confirmationurl: "http:/Unittest.de"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.guid).toBeDefined();
            userGuid = jsonResult.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("change userstatus to 'active'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_ChangeUserStatus", {
            guid: userGuid,
            status: "active"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
/*
      it("change userstatus to 'inactive'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_ChangeUserStatus", {
            guid: userGuid,
            status: "inactive"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
*/
      it("remove parentfolder", function (done) {
        expect(function () {
          test.Utils.getSord(userGuid).then(function success(sord) {
            test.Utils.deleteSord(sord.parentId).then(function success1(deleteResult) {
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
      it("delete sord user", function (done) {
        expect(function () {
          test.Utils.deleteSord(userGuid).then(function success(deleteResult) {
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