
describe("[service] sol.knowledge.ix.services.Config", function () {
  var originalTimeout,
      config, reportTemplateSords, params, tplSord, solType,
      path, packageName;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.knowledge.ix.services.GetConfig", function () {
      it("convert", function (done) {
        expect(function () {
          reportTemplateSords = [];
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "convert",
            params: [reportTemplateSords, params]
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
      it("enrichTplSord", function (done) {
        expect(function () {
          tplSord = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "enrichTplSord",
            params: [tplSord, params]
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
      it("getAllSolTypes", function (done) {
        expect(function () {
          solType = "";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getAllSolTypes",
            params: [solType]
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
      it("getAllTemplates", function (done) {
        expect(function () {
          path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Post types";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getAllTemplates",
            params: [path]
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
      it("getCleanedConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getCleanedConfig",
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
      it("getEnvironment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getEnvironment",
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
      it("getLabels", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getLabels",
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
      it("getPageStyle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getPageStyle",
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
      it("getPostLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "getPostLocales",
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
            className: "sol.knowledge.ix.services.GetConfig",
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
      it("isPackageInstalled", function (done) {
        expect(function () {
          packageName = "";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib1", {
            className: "sol.knowledge.ix.services.GetConfig",
            classConfig: {},
            method: "isPackageInstalled",
            params: [packageName]
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
            className: "sol.knowledge.ix.services.GetConfig",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_knowledge_service_GetConfig", function () {
      it("result should return postTypes, replyTypes, spaces, boards, labels, postLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_GetConfig", {
          }).then(function success(result) {
            expect(result.postTypes).toBeDefined();
            expect(result.replyTypes).toBeDefined();
            expect(result.spaces).toBeDefined();
            expect(result.boards).toBeDefined();
            expect(result.labels).toBeDefined();
            expect(result.postLocales).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return requiredConfigProperties, pageStyle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_knowledge_service_GetConfig", {
            requiredConfigProperties: ["boardView", "updateXDateServices"],
            pageStyle: "standalone",
            lang: "DE"
          }).then(function success(result) {
            expect(result.postTypes).toBeDefined();
            expect(result.replyTypes).toBeDefined();
            expect(result.spaces).toBeDefined();
            expect(result.boards).toBeDefined();
            expect(result.labels).toBeDefined();
            expect(result.postLocales).toBeDefined();
            expect(result.config.boardView).toBeDefined();
            expect(result.config.updateXDateServices).toBeDefined();
            expect(result.pageStyle).toBeDefined();
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