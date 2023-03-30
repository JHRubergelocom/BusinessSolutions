
describe("[service] sol.knowledge.ix.services.UserGroup", function () {
  var originalTimeout, config, group, groups, arr1, arr2, members;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.UserGroup", function () {
      it("getCorrespondingFixedUsers", function (done) {
        expect(function () {
          group = "authors";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "getCorrespondingFixedUsers",
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
      it("getCorrespondingUserGroupsToResolve", function (done) {
        expect(function () {
          group = "authors";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "getCorrespondingUserGroupsToResolve",
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
      it("getMemberNames", function (done) {
        expect(function () {
          groups = ["authors"];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "getMemberNames",
            params: [groups]
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
            className: "sol.knowledge.ix.services.UserGroup",
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
      it("mergeArrays", function (done) {
        expect(function () {
          arr1 = ["authors"];
          arr2 = ["contactpersons"];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "mergeArrays",
            params: [arr1, arr2]
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
      it("mergeIdenticalMembers", function (done) {
        expect(function () {
          members = [];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "mergeIdenticalMembers",
            params: [members]
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
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
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
      it("resolveGroup", function (done) {
        expect(function () {
          group = "authors";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "resolveGroup",
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
      it("resolveGroups", function (done) {
        expect(function () {
          groups = ["authors"];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.UserGroup",
            classConfig: {},
            method: "resolveGroups",
            params: [groups]
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
    describe("RF_sol_knowledge_service_UserInfo_ResolveGroup", function () {
      it("resolve group with out parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_ResolveGroup", {
          }).then(function success(result) {
            expect(result.users).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("resolve group with group 'authors'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_ResolveGroup", {
            group: "authors"
          }).then(function success(result) {
            expect(result.users).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("resolve group with group 'contactpersons'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_UserInfo_ResolveGroup", {
            group: "contactpersons"
          }).then(function success(result) {
            expect(result.users).toBeDefined();
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