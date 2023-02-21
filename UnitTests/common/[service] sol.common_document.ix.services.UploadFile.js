/* eslint-disable linebreak-style */

describe("[service] sol.common_document.ix.services.UploadFile", function () {
  var originalTimeout, objTempId, base64Content,
      dataNode, flowId, succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UploadFile", null, null, elo.CONST.EDIT_INFO.mbSordDoc).then(function success(objTempId1) {
        objTempId = objTempId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("test uploadfile", function () {
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
          objId: objTempId
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
    it("start Workflow Unittest and get base64Content", function (done) {
      expect(function () {
        test.Utils.startWorkflow("Unittest", "Workflow Unittest", objTempId).then(function success(flowId1) {
          flowId = flowId1;
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
            dataNode = test.Utils.getNodeByName(workflow, "[data] signature");
            base64Content = dataNode.properties + "";
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
    it("should throw if executed without 'cfg'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objTempId,
          base64Content: base64Content
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
    it("uploadfile base64Content to signature.png", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objTempId,
          base64Content: base64Content,
          extension: "png",
          cfg: { maskName: "UnitTest", pictureName: "signature" }
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
    it("finish Workflow Unittest", function (done) {
      expect(function () {
        test.Utils.getWorkflow(flowId).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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