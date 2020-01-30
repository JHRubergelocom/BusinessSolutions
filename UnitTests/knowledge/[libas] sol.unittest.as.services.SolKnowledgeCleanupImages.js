
describe("[libas] sol.unittest.as.services.SolKnowledgeCleanupImages", function () {
  var obSolKnowledgeCleanupImagesId, originalTimeout, content, objId, documents, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolKnowledgeCleanupImages").then(function success(obSolKnowledgeCleanupImagesId1) {
        obSolKnowledgeCleanupImagesId = obSolKnowledgeCleanupImagesId1;
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
    describe("sol.knowledge.as.CleanupImages", function () {
      it("collectDocuments", function (done) {
        expect(function () {
          objId = obSolKnowledgeCleanupImagesId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "collectDocuments",
              params: [objId]
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
      it("deleteObsolete", function (done) {
        expect(function () {
          documents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "deleteObsolete",
              params: [documents]
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "initialize",
              params: [config]
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
      it("retrieveFileDocuments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "retrieveFileDocuments",
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
      it("retrieveImageDocuments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "retrieveImageDocuments",
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
      it("run", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.knowledge.as.services.ExecuteLib",
            config: {
              className: "sol.knowledge.as.CleanupImages",
              classConfig: {},
              method: "run",
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