
describe("[service] sol.common.ix.services.UploadFile", function () {
  var originalTimeout, objUploadFileId, flowUploadFileId,
      dataNode, base64ContentUploadFile, succNodes, succNodesIds,
      folderId, name, mask, ext;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UploadFile").then(function success(objUploadFileId1) {
        objUploadFileId = objUploadFileId1;
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
    describe("sol.common.ix.services.UploadFile", function () {
      it("start Workflow Unittest on UploadFile and get base64Content", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on UploadFile", objUploadFileId).then(function success(flowId) {
            flowUploadFileId = flowId;
            test.Utils.getWorkflow(flowUploadFileId).then(function success1(workflow) {
              dataNode = test.Utils.getNodeByName(workflow, "[data] signature");
              base64ContentUploadFile = dataNode.properties + "";
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
      it("finish Workflow Unittest on UploadFile", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowUploadFileId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowUploadFileId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
      it("docExists", function (done) {
        expect(function () {
          folderId = objUploadFileId;
          name = "name1";
          mask = "UnitTest";
          ext = "ext1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.UploadFile",
            classConfig: {},
            method: "docExists",
            params: [folderId, name, mask, ext]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.UploadFile",
            classConfig: {
              objId: objUploadFileId,
              base64Content: base64ContentUploadFile,
              cfg: { maskName: "UnitTest", fileName: "UnitTest" }
            },
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
    describe("RF_sol_common_service_UploadFile", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_UploadFile", {
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
      it("should throw if executed without 'base64Content'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_UploadFile", {
            objId: objUploadFileId
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
      it("should throw if executed without 'cfg'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_UploadFile", {
            objId: objUploadFileId,
            base64Content: base64ContentUploadFile
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
      it("test uploadfile", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_UploadFile", {
            objId: objUploadFileId,
            base64Content: base64ContentUploadFile,
            cfg: { maskName: "UnitTest", fileName: "UnitTest" }
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
    describe("RF_sol_common_document_service_UploadFile", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
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
      it("should throw if executed without 'base64Content'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
            objId: objUploadFileId
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
      it("should throw if executed without 'cfg'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
            objId: objUploadFileId,
            base64Content: base64ContentUploadFile
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
      it("test uploadfile", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
            objId: objUploadFileId,
            base64Content: base64ContentUploadFile,
            cfg: { maskName: "UnitTest", fileName: "UnitTest" }
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
      test.Utils.getFinishedWorkflows().then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
          test.Utils.getTempfolder().then(function success2(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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