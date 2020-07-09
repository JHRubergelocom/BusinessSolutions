
describe("[libas] sol.unittest.as.services.SolCommonWordDocument", function () {
  var WordDocumentSord, obSolCommonWordDocumentId, originalTimeout, content,
      srcObj, dstObj, data, config, dataDefinition, inputStream, outputStream, saveParams;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonWordDocument").then(function success(obSolCommonWordDocumentId1) {
        obSolCommonWordDocumentId = obSolCommonWordDocumentId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/WordDocument").then(function success1(WordDocumentSord1) {
          WordDocumentSord = WordDocumentSord1;
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
    describe("sol.common.as.WordDocument", function () {
      it("copyProperties", function (done) {
        expect(function () {
          srcObj = "srcObj1";
          dstObj = "dstObj1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "copyProperties",
              params: [srcObj, dstObj]
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
      it("fillContentControls", function (done) {
        expect(function () {
          data = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "fillContentControls",
              params: [data]
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
      it("getSaveParamsDOCX", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "getSaveParamsDOCX",
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
      it("getSaveParamsHTML", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "getSaveParamsHTML",
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
      it("getSaveParamsPDF", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "getSaveParamsPDF",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
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
      it("mailMerge", function (done) {
        expect(function () {
          data = { ChildSordDataCollector: [{ name: "Sord1" }, { name: "Sord2" }] };
          dataDefinition = { ChildSordDataCollector: "Sord", arrayElementTagNames: { ChildSordDataCollector: "Sord" } };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "mailMerge",
              params: [data, dataDefinition]
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
      it("open", function (done) {
        expect(function () {
          inputStream = "inputstream1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id },
              method: "open",
              params: [inputStream]
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
      it("save", function (done) {
        expect(function () {
          outputStream = "outputstream1";
          saveParams = "saveParams1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.WordDocument",
              classConfig: { objId: WordDocumentSord.id, saveToRepoConfig: { format: "pdf", parentId: obSolCommonWordDocumentId } },
              method: "save",
              params: [outputStream, saveParams]
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