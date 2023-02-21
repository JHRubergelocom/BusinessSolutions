
describe("[action] sol.visitor.ix.actions.CaptureVisitorPicture", function () {
  var objTempId, objIdVs1, objIdVs2,
      pictureGuid, pictureId,
      visitorTypes, config, objSmileyBase64Id, base64Content,
      setWebcamConfig, maskName, pictureName, photoReferenceField,
      wfInfo, nowDateTime, keywording,
      succNodes, succNodesIds, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CaptureVisitorPicture", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SmileyBase64").then(function success1(sordSmileyBase64) {
          objSmileyBase64Id = sordSmileyBase64.id;
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
    describe("sol.visitor.ix.actions.CaptureVisitorPicture", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.CaptureVisitorPicture",
            classConfig: {},
            method: "getName",
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
            className: "sol.visitor.ix.actions.CaptureVisitorPicture",
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
            className: "sol.visitor.ix.actions.CaptureVisitorPicture",
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
  describe("test capture visitor picture", function () {
    it("should throw if executed without 'user' and 'visitorObjId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_CaptureVisitorPicture", {
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
    describe("register visitor1", function () {
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("check preconditions should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorPreconditions", { targetId: objTempId }).then(function success(checkResult) {
            visitorTypes = checkResult.types;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start workflow register visitor", function (done) {
        expect(function () {
          config = {
            parentId: objTempId,
            visitorType: visitorTypes[0].name,
            templateId: visitorTypes[0].objId
          };
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterVisitor", config, []).then(function success(jsonResults) {
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
      it("fill visitor sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordVs1) {
            objIdVs1 = wfInfo.objId;
            keywording = {
              VISITOR_FIRSTNAME: "Bernd", VISITOR_LASTNAME: "Stromberg",
              VISITOR_COMPANYNAME: "Capitol Versicherungen",
              VISITOR_STARTDATE: nowDateTime.date,
              VISITOR_STARTTIME: nowDateTime.time,
              VISITOR_ARRIVALDATE: nowDateTime.date,
              VISITOR_ARRIVALTIME: nowDateTime.time
            };
            test.Utils.updateKeywording(sordVs1, keywording, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordVs1, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
      it("set total visitors in visitor sord", function (done) {
        expect(function () {
          test.Utils.updateMapData(objIdVs1, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
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
      it("remove workflow", function (done) {
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
    describe("test finish capturevisitorpicture", function () {
      it("load visitor picture", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
            objId: objSmileyBase64Id
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
      it("start action capturepicture workflow", function (done) {
        expect(function () {
          config = {
            visitorObjId: objIdVs1
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_CaptureVisitorPicture", config, []).then(function success(jsonResults) {
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
      it("get maskname, pictureName form visitor.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/visitor.config"
          }).then(function success(configResult) {
            setWebcamConfig = JSON.parse(configResult.config.visitor.pictureUpload.setWebcamConfig.entries[0].value);
            maskName = setWebcamConfig.photoConfig.maskName;
            pictureName = setWebcamConfig.photoConfig.pictureName;
            photoReferenceField = setWebcamConfig.photoReferenceField;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setWebcamConfig must be available", function () {
        expect(setWebcamConfig).toBeDefined();
      });
      it("maskName must be available", function () {
        expect(maskName).toBeDefined();
      });
      it("pictureName must be available", function () {
        expect(pictureName).toBeDefined();
      });
      it("photoReferenceField must be available", function () {
        expect(photoReferenceField).toBeDefined();
      });
      it("upload visitor picture", function (done) {
        expect(function () {
          base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
            objId: objIdVs1,
            base64Content: base64Content,
            cfg: { maskName: maskName, pictureName: pictureName }
          }).then(function success(jsonResult) {
            pictureGuid = jsonResult.guid;
            pictureId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("pictureGuid must be available", function () {
        expect(pictureGuid).toBeDefined();
      });
      it("pictureId must be available", function () {
        expect(pictureId).toBeDefined();
      });
      it("set photoReferenceField", function (done) {
        expect(function () {
          test.Utils.getSord(objIdVs1).then(function success(sordV) {
            test.Utils.updateKeywording(sordV, { VISITOR_PHOTO_GUID: pictureGuid }, true).then(function success1(updateKeywordingResult) {
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
      it("finish input forwarding workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
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
          test.Utils.getFinishedWorkflows(objIdVs1).then(function success(wfs) {
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
    describe("register visitor2", function () {
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("check preconditions should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorPreconditions", { targetId: objTempId }).then(function success(checkResult) {
            visitorTypes = checkResult.types;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start workflow register visitor", function (done) {
        expect(function () {
          config = {
            parentId: objTempId,
            visitorType: visitorTypes[0].name,
            templateId: visitorTypes[0].objId
          };
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterVisitor", config, []).then(function success(jsonResults) {
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
      it("fill visitor sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordVs2) {
            objIdVs2 = wfInfo.objId;
            keywording = {
              VISITOR_FIRSTNAME: "Nils", VISITOR_LASTNAME: "Armstrong",
              VISITOR_COMPANYNAME: "Freier Astronaut",
              VISITOR_STARTDATE: nowDateTime.date,
              VISITOR_STARTTIME: nowDateTime.time,
              VISITOR_ARRIVALDATE: nowDateTime.date,
              VISITOR_ARRIVALTIME: nowDateTime.time
            };
            test.Utils.updateKeywording(sordVs2, keywording, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateSord(sordVs2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
      it("set total visitors in visitor sord", function (done) {
        expect(function () {
          test.Utils.updateMapData(objIdVs2, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
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
      it("remove workflow", function (done) {
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
    describe("test cancel capturevisitorpicture", function () {
      it("start action capturepicture workflow", function (done) {
        expect(function () {
          config = {
            visitorObjId: objIdVs2
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_CaptureVisitorPicture", config, []).then(function success(jsonResults) {
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
          test.Utils.getFinishedWorkflows(objIdVs2).then(function success(wfs) {
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
          test.Utils.deleteSord(objIdVs1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdVs2).then(function success3(deleteResult2) {
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