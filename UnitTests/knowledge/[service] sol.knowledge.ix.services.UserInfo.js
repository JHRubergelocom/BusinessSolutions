
describe("[service] sol.knowledge.ix.services.UserInfo", function () {
  var userName, userGuid, originalTimeout, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.getCurrentUserId().then(function success(userId) {
        test.Utils.getUserInfo(userId).then(function success1(userInfo) {
          userName = userInfo.name;
          userGuid = userInfo.guid;
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
    describe("sol.knowledge.ix.services.UserInfo", function () {
      it("getBadges", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserInfo",
            classConfig: { user: userName },
            method: "getBadges",
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
      it("getType", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserInfo",
            classConfig: { user: userName },
            method: "getType",
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
      it("getUserInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserInfo",
            classConfig: { user: userName },
            method: "getUserInfo",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserInfo",
            classConfig: { user: userName },
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
      it("setUserInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserInfo",
            classConfig: { user: userName },
            method: "setUserInfo",
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
    describe("RF_sol_knowledge_services_UserInfo_Get", function () {
      it("get userinfo with name", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Get", {
            user: userName
          }).then(function success(result) {
            expect(result.success).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get userinfo unknown user", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Get", {
            user: "XXX"
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
      it("get userinfo with guid", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Get", {
            user: userGuid
          }).then(function success(result) {
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
    describe("RF_sol_knowledge_services_UserInfo_Set", function () {
      it("set userinfo with name", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Set", {
            user: userName,
            fields: { 
              jobTitle: "CEO",
              department: "Business Solution",
              company: "ELO" 
            }
          }).then(function success(result) {
            expect(result.success).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("set userinfo with unknown user", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Set", {
            user: "XXX",
            fields: { 
              jobTitle: "CEO",
              department: "Business Solution",
              company: "ELO" 
            }
          }).then(function success(result) {
            fail(result);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("set userinfo with guid", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_Set", {
            user: userGuid,
            fields: { 
              jobTitle: "CEO",
              department: "Business Solution",
              company: "ELO" 
            }
          }).then(function success(result) {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});