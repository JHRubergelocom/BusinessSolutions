/* eslint-disable linebreak-style */

describe("[function] sol.visitor.ix.functions.CreateDocumentToSign", function () {
  var objSingleVisitorId, objSignedDocId, flowId, succNodes, succNodesIds,
      interval, objSignatureBase64Id, base64Content, visitorDocuments,
      objTemplateVisitorDocumentId, templateVisitorDocumentName,
      originalTimeout, i,
      documentType, basePath, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateDocumentToSign").then(function success(objCreateDocumentToSignId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          objSingleVisitorId = sordSingleVisitor.id;
          interval = 4000;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SignatureBase64").then(function success2(sordSignatureBase64) {
            objSignatureBase64Id = sordSignatureBase64.id;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.functions.CreateDocumentToSign", function () {
      it("getTemplateArcPath", function (done) {
        expect(function () {
          documentType = "documentType1";
          basePath = "";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateDocumentToSign",
            classConfig: {},
            method: "getTemplateArcPath",
            params: [documentType, basePath]
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
      it("hasDocumentToSign", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateDocumentToSign",
            classConfig: {},
            method: "hasDocumentToSign",
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
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateDocumentToSign",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateDocumentToSign",
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
    describe("RF_sol_visitor_function_CreateDocumentToSign", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_CreateDocumentToSign", {
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
      it("get template folder visitor documents from visitor.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/visitor.config"
          }).then(function success(configResult) {
            visitorDocuments = configResult.config.generators.templateFolderIds.visitorDocuments;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("visitorDocuments must be available", function () {
        expect(visitorDocuments).toBeDefined();
      });
      it("get visitor template document to sign", function (done) {
        expect(function () {
          test.Utils.getSord(visitorDocuments).then(function success(sordVisitorDocuments) {
            test.Utils.executeRF("RF_sol_common_service_GetTemplates", sordVisitorDocuments).then(function success1(templatesVisitorDocumentIds) {
              objTemplateVisitorDocumentId = templatesVisitorDocumentIds[0];
              test.Utils.getSord(objTemplateVisitorDocumentId).then(function success2(sordTemplateVisitorDocument) {
                templateVisitorDocumentName = sordTemplateVisitorDocument.name;
                expect(templateVisitorDocumentName).toBeDefined();
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
        }).not.toThrow();
      });
      it("set documents, docuser", function (done) {
        expect(function () {
          test.Utils.updateMapData(objSingleVisitorId, { VISITOR_DOCUMENTS: templateVisitorDocumentName, VISITOR_DOCUSER: "Administrator" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("create document to sign for single visitor ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_CreateDocumentToSign", {
            objId: objSingleVisitorId
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get signatureVisitorWF 'sol.visitor.visitor.signdocument'", function (done) {
        expect(function () {
          flowId = "-1";
          objSignedDocId = "-1";
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            for (i = 0; i < wfs.length; i++) {
              if (wfs[i].templateName == "sol.visitor.visitor.signdocument") {
                flowId = wfs[i].id;
                objSignedDocId = wfs[i].objId;
              }
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
      it("load signature", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
            objId: objSignatureBase64Id
          }).then(function success1(jsonData) {
            base64Content = jsonData.content;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("upload signature", function (done) {
        expect(function () {
          base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
          test.Utils.execute("RF_sol_common_sig_service_UploadSignature", {
            flowId: flowId,
            base64Content: base64Content
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Sign document", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Sign document").then(function success2(forwardWorkflowTaskResult) {
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("FEEDCOMMENT : attached signature", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "5", null, "FEEDCOMMENT : attached signature");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "5", succNodesIds, "SIGN: Sign document").then(function success2(forwardWorkflowTaskResult) {
              done();
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }, function error(err) {
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
              test.Utils.deleteSord(objSignedDocId).then(function success4(deleteResult1) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});