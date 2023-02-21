
describe("[action] sol.recruiting.ix.actions.CaptureCandidatePicture", function () {
  var objTempId, candidateTypes, objSmileyBase64Id, base64Content,
      configTypes, configAction, wfInfo, succNodes, succNodesIds, objIdC1, objIdC2,
      maskName, pictureName, photoReferenceField, photoReferenceFieldObjId,
      pictureGuid, pictureId, objIdR, requisitionTypes,
      requisitionNo, requisitionName, requisitionGuid,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CaptureCandidatePicture", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Test data/SmileyBase64").then(function success1(sordSmileyBase64) {
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
  describe("test capture candidate picture", function () {
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
    describe("create requisition", function () {
      it("requisitionTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Requisition types"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(requisitionTypes1) {
          requisitionTypes = requisitionTypes1;
          expect(requisitionTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "CreateRequisition",
            objId: objTempId,
            $metadata: {
              solType: "RECRUITING_REQUISITION",
              owner: {
                fromConnection: true
              },
              objKeys: []
            },
            $wf: {
              template: {
                key: "RECRUITING_WF"
              },
              name: "sol.recruiting.requisition.workflow.create.message"
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              }
            ],
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
              }
            },
            $new: {
              target: {
                mode: "DEFAULT"
              },
              template: {
                base: "ARCPATH:/Administration/Business Solutions/recruiting/Configuration/Requisition types",
                name: requisitionTypes[0].name
              },
              name: "Temporary Requisition"
            }
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
      it("fill requisition sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordR) {
            objIdR = wfInfo.objId;
            test.Utils.updateKeywording(sordR, { RECRUITING_REQUISITION_NO: "R1", RECRUITING_REQUISITION_NAME: "MSD", RECRUITING_REQUISITION_DESC: "Master of Desaster" }, true).then(function success1(updateKeywordingResult) {
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
      it("get requisitionNo", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionNo = test.Utils.getObjKeyValue(sordR, "RECRUITING_REQUISITION_NO");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get requisitionName", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionName = test.Utils.getObjKeyValue(sordR, "RECRUITING_REQUISITION_NAME");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get requisitionGuid", function (done) {
        expect(function () {
          test.Utils.getSord(objIdR).then(function success(sordR) {
            requisitionGuid = sordR.guid;
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
    describe("create candidate1", function () {
      it("candidateTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Candidate types"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(candidateTypes1) {
          candidateTypes = candidateTypes1;
          expect(candidateTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "CreateCandidate",
            objId: objTempId,
            $wf: {
              template: {
                key: "RECRUITING_WF"
              },
              name: "sol.recruiting.candidate.workflow.create.message"
            },
            $metadata: {
              solType: "RECRUITING_CANDIDATE",
              owner: {
                fromConnection: true
              },
              objKeys: [
                {
                  key: "RECRUITING_REQUISITION_NO",
                  value: requisitionNo
                },
                {
                  key: "RECRUITING_REQUISITION_NAME",
                  value: requisitionName
                }
              ],
              mapItems: [
                {
                  key: "RECRUITING_REQUISITION_GUID",
                  value: requisitionGuid
                }
              ]
            },
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
              }
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              }
            ],
            $new: {
              target: {
                mode: "DEFAULT"
              },
              name: "Temporary Candidate",
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Candidate types",
                name: candidateTypes[0].name
              }
            }
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
      it("fill candidate sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordC1) {
            objIdC1 = wfInfo.objId;
            test.Utils.updateKeywording(sordC1, { RECRUITING_CANDIDATE_FIRSTNAME: "Bernd", RECRUITING_CANDIDATE_LASTNAME: "Stromberg" }, true).then(function success1(updateKeywordingResult) {
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
    describe("test 'Save picture' capturecandidatepicture", function () {
      it("load candidate picture", function (done) {
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
      it("start action capture candidate picture workflow", function (done) {
        expect(function () {
          configAction = {
            objId: objIdC1,
            $name: "CaptureCandidatePicture",
            $wf: {
              name: "sol.recruiting.requisition.workflow.create.message",
              template: {
                name: "sol.recruiting.capturepicture"
              }
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "REFRESH",
                onWfStatus: "CREATED"
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
      it("get maskname, pictureName form recruiting.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/recruiting.config"
          }).then(function success(configResult) {
            maskName = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoConfig.maskName;
            pictureName = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoConfig.pictureName;
            photoReferenceField = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoReferenceField;
            photoReferenceFieldObjId = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoReferenceFieldObjId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
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
      it("photoReferenceFieldObjId must be available", function () {
        expect(photoReferenceFieldObjId).toBeDefined();
      });
      it("upload candidate picture", function (done) {
        expect(function () {
          base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
          test.Utils.execute("RF_sol_common_document_service_UploadFile", {
            objId: objIdC1,
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
          test.Utils.getSord(objIdC1).then(function success(sordC1) {
            test.Utils.updateKeywording(sordC1, { RECRUITING_CANDIDATE_PHOTO_GUID: pictureGuid }, true).then(function success1(updateKeywordingResult) {
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
      it("set photoReferenceFieldObjId", function (done) {
        expect(function () {
          test.Utils.updateMapData(objIdC1, { RECRUITING_CANDIDATE_PHOTO_OBJID: pictureId }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Save picture' forwarding workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest save picture").then(function success1(forwardWorkflowTaskResult) {
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
    describe("create candidate2", function () {
      it("candidateTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Candidate types"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(candidateTypes1) {
          candidateTypes = candidateTypes1;
          expect(candidateTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action create workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "CreateCandidate",
            objId: objTempId,
            $wf: {
              template: {
                key: "RECRUITING_WF"
              },
              name: "sol.recruiting.candidate.workflow.create.message"
            },
            $metadata: {
              solType: "RECRUITING_CANDIDATE",
              owner: {
                fromConnection: true
              },
              objKeys: [
                {
                  key: "RECRUITING_REQUISITION_NO",
                  value: requisitionNo
                },
                {
                  key: "RECRUITING_REQUISITION_NAME",
                  value: requisitionName
                }
              ],
              mapItems: [
                {
                  key: "RECRUITING_REQUISITION_GUID",
                  value: requisitionGuid
                }
              ]
            },
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
              }
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "GOTO",
                onWfStatus: "CREATED"
              }
            ],
            $new: {
              target: {
                mode: "DEFAULT"
              },
              name: "Temporary Candidate",
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Candidate types",
                name: candidateTypes[0].name
              }
            }
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
      it("fill candidate sord", function (done) {
        expect(function () {
          test.Utils.getSord(wfInfo.objId).then(function success(sordC2) {
            objIdC2 = wfInfo.objId;
            test.Utils.updateKeywording(sordC2, { RECRUITING_CANDIDATE_FIRSTNAME: "Nils", RECRUITING_CANDIDATE_LASTNAME: "Armstrong" }, true).then(function success1(updateKeywordingResult) {
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
    describe("test cancel capturecandidatepicture", function () {
      it("start action capture candidate picture workflow", function (done) {
        expect(function () {
          configAction = {
            objId: objIdC2,
            $name: "CaptureCandidatePicture",
            $wf: {
              name: "sol.recruiting.requisition.workflow.create.message",
              template: {
                name: "sol.recruiting.capturepicture"
              }
            },
            $events: [
              {
                id: "DIALOG",
                onWfStatus: ""
              },
              {
                id: "REFRESH",
                onWfStatus: "CREATED"
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdC1).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdC2).then(function success3(deleteResult2) {
              test.Utils.deleteSord(objIdR).then(function success4(deleteResult3) {
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