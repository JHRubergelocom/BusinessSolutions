
describe("[service] sol.recruiting.ix.services.UpdateUser", function () {
  var userGuid, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateUser").then(function success(objTempId) {
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
    describe("RF_sol_recruiting_service_UpdateUser", function () {
      it("should throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateUser", {
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
      it("update jobportal user1 if executed with Parameter guid, deletionurl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateUser", {
            guid: userGuid,
            firstname: "Rick"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update jobportal user1 internals 1", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateUser", {
            guid: userGuid,
            internals: "%7B%22resetCounter%33%3A1%7D"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("update jobportal user1 internals 2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_UpdateUser", {
            guid: userGuid,
            internals: "%7B%22resetCounter%33%3A1%7D"
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
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