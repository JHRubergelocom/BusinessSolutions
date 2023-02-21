/* eslint-disable linebreak-style */

describe("[service] sol.common_sig.ix.services.UploadSignature", function () {
  var base64ContentSignature1, base64ContentSignature2, dataNode,
      flowSignature1Id, flowSignature2Id, succNodes, succNodesIds,
      originalTimeout, objSignature1Id, objSignature2Id,
      objTempTId, flowTempTId, base64ContentTempT, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UploadSignature").then(function success(objTempId) {
        test.Utils.createSord(objTempId, null, "Signature1").then(function success1(objSignature1Id1) {
          objSignature1Id = objSignature1Id1;
          test.Utils.createSord(objTempId, null, "Signature2").then(function success2(objSignature2Id1) {
            objSignature2Id = objSignature2Id1;
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
    describe("sol.common_sig.ix.services.UploadSignature", function () {
      it("create sord temp", function (done) {
        expect(function () {
          test.Utils.createTempSord("TempT").then(function success(objTempTId1) {
            objTempTId = objTempTId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest on TempT and get base64Content", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest on TempT", objTempTId).then(function success(flowId) {
            flowTempTId = flowId;
            test.Utils.getWorkflow(flowTempTId).then(function success1(workflow) {
              dataNode = test.Utils.getNodeByName(workflow, "[data] signature");
              base64ContentTempT = dataNode.properties + "";
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_sig.ix.services.UploadSignature",
            classConfig: { flowId: flowTempTId, base64Content: base64ContentTempT },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common_sig.ix.services.UploadSignature",
            classConfig: { flowId: flowTempTId, base64Content: base64ContentTempT },
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
      it("finish Workflow Unittest on TempT", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowTempTId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowTempTId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
  describe("test uploadsignature", function () {
    it("start Workflow Unittest on Signature1 and get base64Content", function (done) {
      expect(function () {
        test.Utils.startWorkflow("Unittest", "Workflow Unittest on Signature1", objSignature1Id).then(function success(flowId) {
          flowSignature1Id = flowId;
          test.Utils.getWorkflow(flowSignature1Id).then(function success1(workflow) {
            dataNode = test.Utils.getNodeByName(workflow, "[data] signature");
            base64ContentSignature1 = dataNode.properties + "";
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
    it("finish Workflow Unittest on Signature1", function (done) {
      expect(function () {
        test.Utils.getWorkflow(flowSignature1Id).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(flowSignature1Id, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
    it("should throw if executed without 'flowId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_sig_service_UploadSignature", {
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
    it("start Workflow Unittest on Signature2", function (done) {
      expect(function () {
        test.Utils.startWorkflow("Unittest", "Workflow Unittest on Signature2", objSignature2Id).then(function success(flowId) {
          flowSignature2Id = flowId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("should throw if executed without 'base64Content'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_sig_service_UploadSignature", {
          flowId: flowSignature2Id
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
    it("uploadsignature base64ContentSignature1 to Workflow on Signature2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_sig_service_UploadSignature", {
          flowId: flowSignature2Id,
          base64Content: base64ContentSignature1
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
    it("get base64ContentSignature2 from Workflow Unittest on Signature2", function (done) {
      expect(function () {
        test.Utils.getWorkflow(flowSignature2Id).then(function success1(workflow) {
          dataNode = test.Utils.getNodeByName(workflow, "[data] signature");
          base64ContentSignature2 = dataNode.properties + "";
          expect(base64ContentSignature1).toEqual(base64ContentSignature2);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish Workflow Unittest on Signature2", function (done) {
      expect(function () {
        test.Utils.getWorkflow(flowSignature2Id).then(function success(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(flowSignature2Id, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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