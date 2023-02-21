
describe("[function] sol.teamroom.ix.functions.ManageUsers", function () {
  var originalTimeout,
      currentGroups, acc, users, tgtGroup, modifiedUser, groupsOfUser,
      user, arr;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ManageUsers").then(function success(objTempId) {
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
    describe("sol.teamroom.ix.functions.ManageUsers", function () {
      it("addCurrentGroups", function (done) {
        expect(function () {
          currentGroups = [];
          acc = [];
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "addCurrentGroups",
            params: [currentGroups, acc]
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
      it("addUsers", function (done) {
        expect(function () {
          users = [];
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "addUsers",
            params: [users, tgtGroup]
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
      it("getCurrentGroups", function (done) {
        expect(function () {
          modifiedUser = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "getCurrentGroups",
            params: [modifiedUser]
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
      it("getGroups", function (done) {
        expect(function () {
          modifiedUser = {};
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "getGroups",
            params: [modifiedUser, tgtGroup]
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
      it("getRemovalGroups", function (done) {
        expect(function () {
          groupsOfUser = [];
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "getRemovalGroups",
            params: [groupsOfUser, tgtGroup]
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
      it("prepareUser", function (done) {
        expect(function () {
          user = { name: "Administrator" };
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "prepareUser",
            params: [user, tgtGroup]
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
      it("prepareUserRemoval", function (done) {
        expect(function () {
          user = { name: "Test" };
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "prepareUserRemoval",
            params: [user, tgtGroup]
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
            className: "sol.teamroom.ix.functions.ManageUsers",
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
      it("removeUsers", function (done) {
        expect(function () {
          users = [];
          tgtGroup = {};
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "removeUsers",
            params: [users, tgtGroup]
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
      it("toJavaArray", function (done) {
        expect(function () {
          arr = [];
          test.Utils.execute("RF_sol_unittest_teamroom_service_ExecuteLib1", {
            className: "sol.teamroom.ix.functions.ManageUsers",
            classConfig: {},
            method: "toJavaArray",
            params: [arr]
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
    describe("RF_sol_teamroom_function_ManageUsers", function () {
      it("should not throw if executed without paramter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_teamroom_function_ManageUsers", {
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