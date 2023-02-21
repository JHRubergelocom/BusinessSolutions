
describe("[libas] sol.unittest.as.services.SolCommonSigFunctionsCreateDocumentToSign", function () {
  var objFunctionsCreateDocumentToSignId, originalTimeout,
      content, sord, documentType, basePath, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSigFunctionsCreateDocumentToSign").then(function success(obSolCommonSigFunctionsCreateDocumentToSignId) {
        test.Utils.copySord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/TemplateDocument").then(function success1(objFunctionsCreateDocumentToSignId1) {
          objFunctionsCreateDocumentToSignId = objFunctionsCreateDocumentToSignId1;
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
    describe("sol.common_sig.as.functions.CreateDocumentToSign", function () {
      it("convertToPdf", function (done) {
        expect(function () {
          sord = objFunctionsCreateDocumentToSignId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_sig.as.functions.CreateDocumentToSign",
              classConfig: {
                objId: objFunctionsCreateDocumentToSignId,
                wfTemplate: "Unittest",
                wfNameTemplate: "Workflow Unittest CreateDocumentToSign",
                userSource: { type: "GRP", key: "UNITTEST_FIELD2" }
              },
              method: "convertToPdf",
              params: [sord]
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
      it("getTemplateArcPath", function (done) {
        expect(function () {
          documentType = "TemplateDocument";
          basePath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_sig.as.functions.CreateDocumentToSign",
              classConfig: {
                objId: objFunctionsCreateDocumentToSignId,
                wfTemplate: "Unittest",
                wfNameTemplate: "Workflow Unittest CreateDocumentToSign",
                userSource: { type: "GRP", key: "UNITTEST_FIELD2" }
              },
              method: "getTemplateArcPath",
              params: [documentType, basePath]
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
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_sig.as.functions.CreateDocumentToSign",
              classConfig: {
                objId: objFunctionsCreateDocumentToSignId,
                wfTemplate: "Unittest",
                wfNameTemplate: "Workflow Unittest CreateDocumentToSign",
                userSource: { type: "GRP", key: "UNITTEST_FIELD2" }
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
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_sig.as.functions.CreateDocumentToSign",
              classConfig: {
                objId: objFunctionsCreateDocumentToSignId,
                wfTemplate: "Unittest",
                wfNameTemplate: "Workflow Unittest CreateDocumentToSign",
                userSource: { type: "GRP", key: "UNITTEST_FIELD2" }
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
      it("remove workflow", function (done) {
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