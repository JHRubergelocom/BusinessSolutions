
describe("[libas] sol.unittest.as.services.SolCommonDocumentGenerator", function () {
  var DocumentGeneratorSord, originalTimeout, content, config,
      obSolCommonDocumentGeneratorId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentGenerator").then(function success(obSolCommonDocumentGeneratorId1) {
        obSolCommonDocumentGeneratorId = obSolCommonDocumentGeneratorId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/DocumentGenerator").then(function success1(DocumentGeneratorSord1) {
          DocumentGeneratorSord = DocumentGeneratorSord1;
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
    describe("sol.common.as.DocumentGenerator", function () {
      it("initDataCollector", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.DocumentGenerator",
              classConfig: {
                dataCollector: "RF_sol_common_services_ChildrenDataCollector",
                renderer: "sol.common.as.renderer.Word",
                name: "Unittest",
                rendererConfig: {
                  templateId: DocumentGeneratorSord.id,
                  targetId: obSolCommonDocumentGeneratorId
                }
              },
              method: "initDataCollector",
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
      it("initRenderer", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.DocumentGenerator",
              classConfig: {
                dataCollector: "RF_sol_common_services_ChildrenDataCollector",
                renderer: "sol.common.as.renderer.Word",
                name: "Unittest",
                rendererConfig: {
                  templateId: DocumentGeneratorSord.id,
                  targetId: obSolCommonDocumentGeneratorId
                }
              },
              method: "initRenderer",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.DocumentGenerator",
              classConfig: {
                dataCollector: "RF_sol_common_services_ChildrenDataCollector",
                renderer: "sol.common.as.renderer.Word",
                name: "Unittest",
                rendererConfig: {
                  templateId: DocumentGeneratorSord.id,
                  targetId: obSolCommonDocumentGeneratorId
                }
              },
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.DocumentGenerator",
              classConfig: {
                dataCollector: "RF_sol_common_services_ChildrenDataCollector",
                renderer: "sol.common.as.renderer.Word",
                name: "Unittest",
                rendererConfig: {
                  templateId: DocumentGeneratorSord.id,
                  targetId: obSolCommonDocumentGeneratorId
                },
                collectorConfig: {
                  parentId: obSolCommonDocumentGeneratorId,
                  returnDataDefinition: true
                }
              },
              method: "process",
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