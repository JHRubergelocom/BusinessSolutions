
describe("[service] sol.learning.ix.services.GetUsers", function () {
  var originalTimeout,
      users, n1, group, requested, history;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetUsers").then(function success(objTempId) {
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
    describe("sol.learning.ix.services.GetUsers", function () {
      it("addUser", function (done) {
        expect(function () {
          users = [];
          n1 = "Administrator";
          group = "Administrators";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
            method: "addUser",
            params: [users, n1, group]
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
      it("collectUsers", function (done) {
        expect(function () {
          requested = [0];
          users = [];
          group = "Administrators";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
            method: "collectUsers",
            params: [requested, users, group]
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
      it("diffUsers", function (done) {
        expect(function () {
          users = [];
          history = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
            method: "diffUsers",
            params: [users, history]
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
      it("expandGroup", function (done) {
        expect(function () {
          group = "Administrators";
          users = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
            method: "expandGroup",
            params: [group, users]
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
      it("getGroupMembers", function (done) {
        expect(function () {
          group = "Administrators";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
            method: "getGroupMembers",
            params: [group]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetUsers",
            classConfig: { users: [0, 1] },
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
    describe("RF_sol_learning_service_GetUsers", function () {
      it("should throw if executed without 'users' ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetUsers", {
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetUsers", {
            users: [0, 1]
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