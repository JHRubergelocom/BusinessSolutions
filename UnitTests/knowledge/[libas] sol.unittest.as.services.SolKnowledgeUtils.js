
describe("[libas] sol.unittest.as.services.SolKnowledgeUtils", function () {
  var userName, originalTimeout, content, array1, array2, reps, rep,
      userId, type, categoryType, cfgBadge, badges, count, cfgCategoryBadge;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolKnowledgeUtils").then(function success(obSolKnowledgeUtilsId) {
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
    describe("sol.knowledge.as.Utils", function () {
      it("loadKnowledgeConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "loadKnowledgeConfig",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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
          array1 = ["elem1", "elem2"];
          array2 = ["elem2", "elem3"];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "mergeArrays",
              params: [array1, array2]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processAllUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "processAllUsers",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processGenerateBadges", function (done) {
        expect(function () {
          reps = [];
          userId = 0;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "processGenerateBadges",
              params: [reps, userId]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processUserItems", function (done) {
        expect(function () {
          reps = [];
          userId = 0;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "processUserItems",
              params: [reps, userId]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("readStatistics", function (done) {
        expect(function () {
          type = "type1";
          userName = "userName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "readStatistics",
              params: [type, userName]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setBadge", function (done) {
        expect(function () {
          categoryType = "categoryType1";
          cfgBadge = { conditions: [] };
          badges = [];
          rep = "rep1";
          count = 0;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "setBadge",
              params: [categoryType, cfgBadge, badges, rep, count]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setBadges", function (done) {
        expect(function () {
          cfgCategoryBadge = { type: "type1", badges: [] };
          badges = [];
          rep = "rep1";
          count = 0;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "setBadges",
              params: [cfgCategoryBadge, badges, rep, count]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setCategoryBadges", function (done) {
        expect(function () {
          rep = "rep1";
          count = 0;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.Utils",
              classConfig: {},
              method: "setCategoryBadges",
              params: [rep, count]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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