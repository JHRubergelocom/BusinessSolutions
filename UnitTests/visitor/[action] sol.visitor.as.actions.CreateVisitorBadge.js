
describe("[action] sol.visitor.as.actions.CreateVisitorBadge", function () {

  var objTempId, checkResult, visitorTypes, config,
      objIdVs, objIdGr, succNodes, succNodesIds,
      content,
      visitorBadgeTypes, evInfo, dvReport,
      repTemplateId, targetId, params,
      objSmileyBase64Id, base64Content,
      setWebcamConfig, maskName, pictureName,
      pictureGuid, nowDateTime, wfInfo,
      keywording, mapdata, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("As.Actions.CreateVisitorBadge", null, null).then(function success(objTempId1) {
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
  describe("register visitor", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorPreconditions", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordVs) {
          objIdVs = wfInfo.objId;
          keywording = {
            VISITOR_FIRSTNAME: "Bernd", VISITOR_LASTNAME: "Stromberg",
            VISITOR_COMPANYNAME: "Capitol Versicherungen",
            VISITOR_STARTDATE: nowDateTime.date,
            VISITOR_STARTTIME: nowDateTime.time,
            VISITOR_ARRIVALDATE: nowDateTime.date,
            VISITOR_ARRIVALTIME: nowDateTime.time
          };
          test.Utils.updateKeywording(sordVs, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordVs, [{ key: "desc", value: "Unittest desc1" }]).then(function success2(updateSordResult) {
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
        test.Utils.updateMapData(objIdVs, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
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
  describe("capture picture visitor", function () {
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
          visitorObjId: objIdVs
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
          objId: objIdVs,
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
        test.Utils.getSord(objIdVs).then(function success(sordV) {
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
        test.Utils.getFinishedWorkflows(objIdVs).then(function success(wfs) {
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
  describe("test create visitorbadge visitor", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", { targetId: objIdVs }).then(function success(checkResult1) {
          checkResult = checkResult1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkResult.valid equal true", function () {
      expect(checkResult.valid).toEqual(true);
    });
    it("visitorBadgeTypes must be available", function () {
      visitorBadgeTypes = checkResult.types;
      expect(visitorBadgeTypes).toBeDefined();
    });
    it("visitorBadgeTypes.length must greater than zero", function () {
      expect(visitorBadgeTypes.length).toBeGreaterThan(0);
    });
    it("start as action create visitorbadge", function (done) {
      expect(function () {
        repTemplateId = visitorBadgeTypes[0].objId;
        targetId = objIdVs;
        params = { templateId: repTemplateId, parentId: targetId, targetId: targetId };
        test.Utils.executeASActionHandler("visitor", "sol.visitor.as.actions.CreateVisitorBadge", params, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(evInfo1) {
            evInfo = evInfo1;
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
    it("evInfo.objId must be available", function () {
      expect(evInfo.objId).toBeDefined();
    });
    it("report must be available", function (done) {
      test.Utils.getSord(evInfo.objId).then(function success(sordReport) {
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
      test.Utils.getCurrentWorkVersion(evInfo.objId).then(function success(dvReport1) {
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
  });
  describe("register group", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorGroupPreconditions", { targetId: objTempId }).then(function success(checkResult1) {
          checkResult = checkResult1;
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
        test.Utils.getSord(wfInfo.objId).then(function success(sordGr) {
          objIdGr = wfInfo.objId;
          keywording = {
            VISITOR_GROUP_NAME: "Bremer Stadtmusikanten",
            VISITOR_ARRIVALDATE: nowDateTime.date
          };
          test.Utils.updateKeywording(sordGr, keywording, true).then(function success1(updateKeywordingResult) {
            test.Utils.updateSord(sordGr, [{ key: "desc", value: "Unittest desc2" }]).then(function success2(updateSordResult) {
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
        test.Utils.updateMapData(objIdGr, mapdata).then(function success(updateMapDataResult) {
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
  describe("test create visitorbadge group", function () {
    it("check preconditions should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", { targetId: objIdGr }).then(function success(checkResult1) {
          checkResult = checkResult1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("checkResult.valid equal true", function () {
      expect(checkResult.valid).toEqual(true);
    });
    it("visitorBadgeTypes must be available", function () {
      visitorBadgeTypes = checkResult.types;
      expect(visitorBadgeTypes).toBeDefined();
    });
    it("visitorBadgeTypes.length must greater than zero", function () {
      expect(visitorBadgeTypes.length).toBeGreaterThan(0);
    });
    it("start as action create visitorbadge", function (done) {
      expect(function () {
        repTemplateId = visitorBadgeTypes[0].objId;
        targetId = objIdGr;
        params = { templateId: repTemplateId, parentId: targetId, targetId: targetId };
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          action: "sol.visitor.as.actions.CreateVisitorBadge",
          config: params
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdVs).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdGr).then(function success3(deleteResult2) {
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