
describe("[action] sol.pubsec.ix.actions.CreateSubFile", function () {
  var originalTimeout, objTempId, objFPId,
      fileTypes,
      configAction, wfInfo,
      succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateSubFile", null, null).then(function success(objTempId1) {
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
  describe("test create file", function () {
    describe("create filingplan", function () {
      it("create filingplan should not throw", function (done) {
        expect(function () {
          test.Utils.createSord(objTempId, "Filing Plan", "4713 Unittest", null, null).then(function success(objFPId1) {
            objFPId = objFPId1;
            test.Utils.getSord(objFPId).then(function success1(sordFP) {
              test.Utils.updateKeywording(sordFP, {
                FILING_PLAN_NAME: "Unittest",
                FILING_PLAN_REFERENCE: "4713",
                ORGANISATIONAL_UNIT: "PubSec.Sachbearbeiter",
                FILE_RIGHTS_READ: "Everyone",
                FILE_RIGHTS_WRITE: "PubSec.Registratur",
                FILE_RIGHTS_CREATEFILE: "*",
                FILING_PLAN_ALLOWED_FILES: "*"
              }, true).then(function success2(updateKeywordingResult) {
                test.Utils.updateSord(sordFP, [{ key: "name", value: "4713 Unittest" }]).then(function success3(updateSordResult) {
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
    describe("test finish createfile", function () {
      it("should throw if executed without 'user' and 'fileType'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_action_CreateFile", {
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
      it("check preconditions should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_PrepareCreateFile", { targetId: objFPId }).then(function success(checkResult) {
            fileTypes = checkResult.types;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("fileTypes must be available", function () {
        expect(fileTypes).toBeDefined();
      });
      it("fileTypes.length must greater than zero", function () {
        expect(fileTypes.length).toBeGreaterThan(0);
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            parentId: objFPId,
            fileType: fileTypes[0].name,
            templateId: fileTypes[0].objId,
            isSubfile: true
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
              wfInfo = wfInfo1;
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
      it("wfInfo.flowId must be available", function () {
        expect(wfInfo.flowId).toBeDefined();
      });
      it("wfInfo.nodeId must be available", function () {
        expect(wfInfo.nodeId).toBeDefined();
      });
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("fill file sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordFile) {
            test.Utils.updateKeywording(sordFile, { FILE_NAME: "Unittest FILE_NAME" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordFile, [{ key: "desc", value: "Unittest desc" }]).then(function success2(updateSordResult) {
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
      it("finish input forwarding workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Create file");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(wfInfo.objId).then(function success(wfs) {
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
    describe("test cancel createfile", function () {
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            parentId: objFPId,
            fileType: fileTypes[0].name,
            templateId: fileTypes[0].objId,
            isSubfile: true
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_pubsec_action_CreateFile", configAction, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo1) {
              wfInfo = wfInfo1;
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
      it("wfInfo.flowId must be available", function () {
        expect(wfInfo.flowId).toBeDefined();
      });
      it("wfInfo.nodeId must be available", function () {
        expect(wfInfo.nodeId).toBeDefined();
      });
      it("wfInfo.objId must be available", function () {
        expect(wfInfo.objId).toBeDefined();
      });
      it("fill file sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordFile) {
            test.Utils.updateKeywording(sordFile, { FILE_NAME: "Unittest FILE_NAME" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordFile, [{ key: "desc", value: "Unittest desc" }]).then(function success2(updateSordResult) {
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
      it("cancel input forwarding workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "Cancel");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest cancel input").then(function success1(forwardWorkflowTaskResult) {
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
      it("remove workflows", function (done) {
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