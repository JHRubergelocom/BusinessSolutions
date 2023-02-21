
describe("[action] sol.visitor.ix.actions.CreateVisitorList", function () {
  var objTempId, visitorTypes, config, objSmileyBase64Id, base64Content,
      setWebcamConfig, maskName, pictureName,
      pictureGuid,
      objIdVs1, objIdVs2,
      objIdGr1, objIdGr2,
      succNodes, succNodesIds, 
      dvReport, configAction,
      wfInfo, keywording, mapdata, visitorListTemplate,
      objIdVL, interval,
      nowDateTime, kwlConfig, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CreateVisitorList", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        interval = 4000;
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
  describe("capture picture visitor1", function () {
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
    it("get maskname, pictureName form visitor.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/visitor.config"
        }).then(function success(configResult) {
          setWebcamConfig = JSON.parse(configResult.config.visitor.pictureUpload.setWebcamConfig.entries[0].value);
          maskName = setWebcamConfig.photoConfig.maskName;
          pictureName = setWebcamConfig.photoConfig.pictureName;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
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
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
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
  describe("capture picture visitor2", function () {
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
    it("get maskname, pictureName form visitor.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/visitor.config"
        }).then(function success(configResult) {
          setWebcamConfig = JSON.parse(configResult.config.visitor.pictureUpload.setWebcamConfig.entries[0].value);
          maskName = setWebcamConfig.photoConfig.maskName;
          pictureName = setWebcamConfig.photoConfig.pictureName;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("upload visitor picture", function (done) {
      expect(function () {
        base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objIdVs2,
          base64Content: base64Content,
          cfg: { maskName: maskName, pictureName: pictureName }
        }).then(function success(jsonResult) {
          pictureGuid = jsonResult.guid;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("set photoReferenceField", function (done) {
      expect(function () {
        test.Utils.getSord(objIdVs2).then(function success(sordV) {
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
  describe("register group1", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorGroupPreconditions", { targetId: objTempId }).then(function success(checkResult) {
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
    it("start workflow register group", function (done) {
      expect(function () {
        config = {
          parentId: objTempId,
          visitorType: visitorTypes[0].name,
          templateId: visitorTypes[0].objId
        };
        test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterGroup", config, []).then(function success(jsonResults) {
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
    it("fill group sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordGr1) {
          objIdGr1 = wfInfo.objId;
          keywording = {
            VISITOR_GROUP_NAME: "Einzelkämpfer",
            VISITOR_ARRIVALDATE: nowDateTime.date
          };
          test.Utils.updateKeywording(sordGr1, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordGr1, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
    it("set single visitor1 in group sord", function (done) {
      expect(function () {
        mapdata = {
          VISITOR_ARRIVALTIME1: nowDateTime.time,
          VISITOR_CHECKEDIN1:	1,
          VISITOR_CHECKINVISITOR1: 1,
          VISITOR_GROUPRESPONSIBLE1: 1,
          VISITOR_COMPANYNAME1:	"Mustefirma",
          VISITOR_FIRSTNAME1:	"Max",
          VISITOR_LASTNAME1: "Mustermann",
          VISITOR_TOTALVISITORS: 1
        };
        test.Utils.updateMapData(objIdGr1, mapdata).then(function success(updateMapDataResult) {
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
  describe("register group2", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorGroupPreconditions", { targetId: objTempId }).then(function success(checkResult) {
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
    it("start workflow register group", function (done) {
      expect(function () {
        config = {
          parentId: objTempId,
          visitorType: visitorTypes[0].name,
          templateId: visitorTypes[0].objId
        };
        test.Utils.executeIxActionHandler("RF_sol_visitor_action_RegisterGroup", config, []).then(function success(jsonResults) {
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
    it("fill group sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordGr2) {
          objIdGr2 = wfInfo.objId;
          keywording = {
            VISITOR_GROUP_NAME: "Bremer Stadtmusikanten",
            VISITOR_ARRIVALDATE: nowDateTime.date
          };
          test.Utils.updateKeywording(sordGr2, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordGr2, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
    it("set single visitor1 und visitor2 in group sord", function (done) {
      expect(function () {
        mapdata = {
          VISITOR_ARRIVALTIME1: nowDateTime.time,
          VISITOR_ARRIVALTIME2: nowDateTime.time,
          VISITOR_CHECKEDIN1:	1,
          VISITOR_CHECKEDIN2:	1,
          VISITOR_CHECKINVISITOR1: 1,
          VISITOR_CHECKINVISITOR2: 1,
          VISITOR_GROUPRESPONSIBLE1: 0,
          VISITOR_GROUPRESPONSIBLE2: 1,
          VISITOR_COMPANYNAME1:	"Hasenstall",
          VISITOR_COMPANYNAME2:	"Fuchsbau",
          VISITOR_FIRSTNAME1:	"Hans",
          VISITOR_FIRSTNAME2:	"Hugo",
          VISITOR_LASTNAME1: "Lampe",
          VISITOR_LASTNAME2: "Reinicke",
          VISITOR_TOTALVISITORS: 2
        };
        test.Utils.updateMapData(objIdGr2, mapdata).then(function success(updateMapDataResult) {
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
  describe("get visitor list template", function () {
    it("get 'Visitor list templates' configuration from kwl.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/kwl.config"
        }).then(function success(configResult) {
          kwlConfig = configResult.config["Visitor list templates"];
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteDynKwl", {
          objId: objTempId,
          dynKwl: "sol.common.ix.GenericDynKwl",
          providerConfig: kwlConfig,
          inputFieldName: "UNITTEST_FIELD2"
        }).then(function success(jsonResult) {   
          if (jsonResult.error) {
            fail(jsonResult.error);
          } else {
            expect(jsonResult.keynames).toBeDefined();
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.title).toBeDefined();
            expect(jsonResult.data).toBeDefined();  
            visitorListTemplate = jsonResult.data[0][0]; 
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
  describe("test create visitorList", function () {
    it("should not throw if executed without parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_action_Standard", {
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
  describe("test finish visitorList", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "{{translate 'sol.visitor.as.actions.CreateVisitorList.name'}} {{formatDate 'YYYY-MM-DD' date}}",
            mask: "Visitor document",
            type: "PDF"
          },
          $name: "sol.visitor.actions.CreateVisitorList",
          $wf: {
            name: "{{translate 'sol.visitor.form.createVisitorList'}}",
            template: {
              name: "sol.visitor.createvisitorlist"
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ]
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
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
    it("set visitor list template", function (done) {
      expect(function () {
        objIdVL = wfInfo.objId;
        test.Utils.updateMapData(objIdVL, { VISITORLIST_TEMPLATE: visitorListTemplate }).then(function success(updateMapDataResult) {
          done();
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
    it("report must be available", function (done) {
      test.Utils.getSord(objIdVL).then(function success(sordReport) {
        expect(sordReport).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("doc.size report must be available", function (done) {
      test.Utils.getCurrentWorkVersion(objIdVL).then(function success(dvReport1) {
        dvReport = dvReport1;
        expect(dvReport.size).toBeDefined();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("doc.size report must greater than zero", function () {
      expect(dvReport.size).toBeGreaterThan(0);
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
  describe("test cancel createvisitorList", function () {
    it("start action create workflow", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            name: "{{translate 'sol.visitor.as.actions.CreateVisitorList.name'}} {{formatDate 'YYYY-MM-DD' date}}",
            mask: "Visitor document",
            type: "PDF"
          },
          $name: "sol.visitor.actions.CreateVisitorList",
          $wf: {
            name: "{{translate 'sol.visitor.form.createVisitorList'}}",
            template: {
              name: "sol.visitor.createvisitorlist"
            }
          },
          $events: [
            {
              id: "DIALOG",
              onWfStatus: ""
            },
            {
              id: "GOTO",
              onWfStatus: "CREATE"
            }
          ]
        };
        wfInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_common_action_Standard", configAction, []).then(function success(jsonResults) {
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
    it("set visitor list template", function (done) {
      expect(function () {
        test.Utils.updateMapData(wfInfo.objId, { VISITORLIST_TEMPLATE: visitorListTemplate }).then(function success(updateMapDataResult) {
          done();
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
          succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.cancel");
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdVs1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdVs2).then(function success3(deleteResult2) {
              test.Utils.deleteSord(objIdGr1).then(function success4(deleteResult3) {
                test.Utils.deleteSord(objIdGr2).then(function success5(deleteResult4) {
                  test.Utils.deleteSord(objIdVL).then(function success6(deleteResult5) {
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