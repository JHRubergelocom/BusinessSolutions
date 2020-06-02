
describe("[lib] sol.unittest.ix.services.SolCommonUserUtils", function () {
  var userName, userInfo, originalTimeout, userNames, level,
      groupNames, flagNames, params, ticket, user, users, config, group;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonUserUtils").then(function success(obSolCommonUserUtilsId) {
        userName = test.Utils.getCurrentUserName();
        test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
          userInfo = userInfo1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.UserUtils", function () {
      it("addUsersToGroups", function (done) {
        expect(function () {
          userNames = ["Administrator"];
          groupNames = ["Administrators"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "addUsersToGroups",
            params: [userNames, groupNames]
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
      it("checkCurrentPermissions", function (done) {
        expect(function () {
          flagNames = ["FLAG_IMPORT", "FLAG_ALL"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "checkCurrentPermissions",
            params: [flagNames]
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
      it("createUser", function (done) {
        expect(function () {
          userName = "Administrator";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "createUser",
            params: [userName, params]
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
      it("getCurrentUserInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getCurrentUserInfo",
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
      it("getFolderUserNameData", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getFolderUserNameData",
            params: [user]
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
      it("getFolderUserNameDataEloProfile", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getFolderUserNameDataEloProfile",
            params: [user]
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
      it("getFolderUserNameInbox", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getFolderUserNameInbox",
            params: [user]
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
      it("getFolderUserNamePrivate", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getFolderUserNamePrivate",
            params: [user]
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
      it("getMailAddress", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getMailAddress",
            params: [user]
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
      it("getSupervisor", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getSupervisor",
            params: [user]
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
      it("getSupervisorHierarchy", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getSupervisorHierarchy",
            params: [user]
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
      it("getSupervisorOfLevel", function (done) {
        expect(function () {
          userName = "Administrator";
          level = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getSupervisorOfLevel",
            params: [userName, level]
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
      it("getUserFolder", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserFolder",
            params: [user]
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
      it("getUserIdFromTicket", function (done) {
        expect(function () {
          ticket = "ticket";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserIdFromTicket",
            params: [ticket]
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
      it("getUserInfo", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserInfo",
            params: [user]
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
      it("getUserInfoFromCache", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserInfoFromCache",
            params: [user]
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
      it("getUserInfoFromTicket", function (done) {
        expect(function () {
          ticket = "ticket";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserInfoFromTicket",
            params: [ticket]
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
      it("getUserInfos", function (done) {
        expect(function () {
          user = ["Administrator"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserInfos",
            params: [users]
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
      it("getUserNames", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "getUserNames",
            params: [config]
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "initialize",
            params: [config]
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
      it("initializeSpecialUserCaches", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "initializeSpecialUserCaches",
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
      it("isInGroup", function (done) {
        expect(function () {
          group = "Administrators";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isInGroup",
            params: [group, params]
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
      it("isMainAdmin", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isMainAdmin",
            params: [user]
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
      it("isMainAdminTicket", function (done) {
        expect(function () {
          ticket = "ticket";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isMainAdminTicket",
            params: [ticket]
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
      it("isServiceUser", function (done) {
        expect(function () {
          user = "ELO Service";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isServiceUser",
            params: [user]
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
      it("isUserGuid", function (done) {
        expect(function () {
          user = "(E10E1000-E100-E100-E100-E10E10E10E40)";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isUserGuid",
            params: [user]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isUserId", function (done) {
        expect(function () {
          user = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "isUserId",
            params: [user]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("removeUsersFromGroups", function (done) {
        expect(function () {
          userNames = [];
          groupNames = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "removeUsersFromGroups",
            params: [userNames, groupNames]
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
      it("requireUserInfos", function (done) {
        expect(function () {
          users = ["Administrator"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "requireUserInfos",
            params: [users]
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
      it("useSpecialCaches", function (done) {
        expect(function () {
          user = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "useSpecialCaches",
            params: [user]
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
      it("userExists", function (done) {
        expect(function () {
          userName = "Administrator";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "userExists",
            params: [userName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("writeUserInfoToCache", function (done) {
        expect(function () {
          userInfo = userInfo;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserUtils",
            classConfig: {},
            method: "writeUserInfoToCache",
            params: [userInfo]
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