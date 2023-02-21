
describe("[libix] sol.unittest.ix.services.SolKnowledgeQueryUtils", function () {
  var originalTimeout, fields, operant, queryParts, type, key, value, values, config, boostFactor, str, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolKnowledgeQueryUtils").then(function success(obSolKnowledgeQueryUtilsId) {
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
    describe("sol.knowledge.ix.QueryUtils", function () {
      it("addTerms", function (done) {
        expect(function () {
          fields = [];
          operant = "OR";
          queryParts = [];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "addTerms",
            params: [fields, operant, queryParts]
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
      it("buildOrValues", function (done) {
        expect(function () {
          type = "FIELD_OBJ_KEY";
          key = "key1";
          values = ["value1", "value2"];
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "buildOrValues",
            params: [type, key, values]
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
      it("buildQuery", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "buildQuery",
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
      it("buildTerm", function (done) {
        expect(function () {
          type = "FIELD_OBJ_KEY_TOKENIZED";
          key = "key1";
          value = "value1";
          boostFactor = "boostFactor1";
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "buildTerm",
            params: [type, key, value, boostFactor]
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
      it("executeContextTerms", function (done) {
        expect(function () {
          config = {
            filter: [{
              type: "FIELD_OBJ_KEY",
              key: "SOL_TYPE",
              values: ["KNOWLEDGE_POST"]
            }],
            should: [{
              type: "FIELD_OBJ_KEY",
              key: "KNOWLEDGE_TOPICS",
              values: ["TopicA", "TopicB", "TopicC"],
              startBoostFactor: 2,
              boostFactorDecrement: 0.1
            }, {
              type: "FIELD_OBJ_KEY_TOKENIZED",
              key: "KNOWLEDGE_SUBJECT",
              values: ["Problem", "iSearch"],
              startBoostFactor: 1,
              boostFactorDecrement: 0.1
            }],
            max: 5,
            sordKeys: [],
            objKeys: [],
            fieldName: "LINE_KNOWLEDGE_TOPICS"
          };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "executeContextTerms",
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
      it("executeQuery", function (done) {
        expect(function () {
          config = config;
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "executeQuery",
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
      it("filterStopWords", function (done) {
        expect(function () {
          str = "str1";
          params = { stopWordDefaultListRepoPath: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/knowledge/Configuration/Stop words/Stop words" };
          test.Utils.execute("RF_sol_unittest_knowledge_service_ExecuteLib", {
            className: "sol.knowledge.ix.QueryUtils",
            classConfig: {},
            method: "filterStopWords",
            params: [str, params]
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