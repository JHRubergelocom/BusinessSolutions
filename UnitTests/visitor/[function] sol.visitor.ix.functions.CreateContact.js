/* eslint-disable linebreak-style */

describe("[function] sol.visitor.ix.functions.CreateContact", function () {
  var objTempId, objIdVs, objIdCo,
      pictureGuid,
      visitorTypes, config, objSmileyBase64Id, base64Content,
      setWebcamConfig, maskName, pictureName,
      wfRegisterInfo, wfCapturePictureInfo, nowDateTime, keywording,
      succNodes, succNodesIds, originalTimeout,
      sord, mappings, fieldCfg, createResult;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateContact", null, null).then(function success(objTempId1) {
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
    describe("sol.visitor.ix.functions.CreateContact", function () {
      it("buildData", function (done) {
        expect(function () {
          sord = { id: objTempId };
          mappings = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateContact",
            classConfig: {},
            method: "buildData",
            params: [sord, mappings]
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
      it("checkAutomaticCreation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateContact",
            classConfig: {},
            method: "checkAutomaticCreation",
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
            className: "sol.visitor.ix.functions.CreateContact",
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
      it("isEmpty", function (done) {
        expect(function () {
          sord = { id: objTempId };
          fieldCfg = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateContact",
            classConfig: {},
            method: "isEmpty",
            params: [sord, fieldCfg]
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
            className: "sol.visitor.ix.functions.CreateContact",
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
      it("updateContactRef", function (done) {
        expect(function () {
          sord = { id: objTempId };
          createResult = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.functions.CreateContact",
            classConfig: {},
            method: "updateContactRef",
            params: [sord, createResult]
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
  describe("test create visitor contact", function () {
    describe("register visitor", function () {
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
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo) {
              wfRegisterInfo = wfInfo;
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
          test.Utils.getSord(wfRegisterInfo.objId).then(function success(sordVs) {
            objIdVs = wfRegisterInfo.objId;
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
      it("set create contact flag in visitor sord", function (done) {
        expect(function () {
          test.Utils.updateMapData(objIdVs, { VISITOR_CREATE_CONTACT: "1" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("load visitor picture", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
            objId: objSmileyBase64Id
          }).then(function success(jsonData) {
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
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_CaptureVisitorPicture", config, []).then(function success(jsonResults) {
            test.Utils.handleAllEvents(jsonResults).then(function success1(wfInfo) {
              wfCapturePictureInfo = wfInfo;
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
          test.Utils.getSord(objIdVs).then(function success(sordVs) {
            test.Utils.updateKeywording(sordVs, { VISITOR_PHOTO_GUID: pictureGuid }, true).then(function success1(updateKeywordingResult) {
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
      it("finish capture picture workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfCapturePictureInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfCapturePictureInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfCapturePictureInfo.flowId, wfCapturePictureInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
      it("finish register workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfRegisterInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfRegisterInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfRegisterInfo.flowId, wfRegisterInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
      it("get visitor contact reference", function (done) {
        expect(function () {
          test.Utils.getMapValue(objIdVs, "VISITOR_CONTACT_REFERENCE").then(function success(visitorContactReference) {
            test.Utils.findSords({ objKeysObj: { CONTACT_REFERENCE: visitorContactReference } }).then(function success1(sords) {
              expect(sords).toBeDefined();
              expect(sords.length).toBeGreaterThan(0);
              objIdCo = sords[0].id;
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
            done();
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
          test.Utils.deleteSord(objIdVs).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdCo).then(function success3(deleteResult2) {
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