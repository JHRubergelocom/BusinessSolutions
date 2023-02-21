
describe("[action] sol.recruiting.ix.actions.RateCandidate", function () {
  var objTempId, candidateTypes,
      configTypes, configAction, wfInfo, succNodes, succNodesIds, objIdC1, objIdC2,
      userNode, nodes, userNodeId, subWfs, subWorkflows, key, i, j,
      subWf, subWfFlowId,
      objIdR, requisitionTypes, questionnairesTypes,
      requisitionNo, requisitionName, requisitionGuid,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.RateCandidate", null, null).then(function success(objTempId1) {
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
  describe("test rate candidate", function () {
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
    describe("test finish ratecandidate", function () {
      it("questionnairesTypes must be available", function (done) {
        test.Utils.execute("RF_sol_recruiting_service_GetQuestionnaires", {}).then(function success(questionnairesTypes1) {
          questionnairesTypes = questionnairesTypes1;
          expect(questionnairesTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action rate candidate workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "RateCandidate",
            objId: objIdC1,
            $metadata: {
              solType: "RECRUITING_CANDIDATE",
              owner: {
                fromConnection: true
              },
              objKeys: [],
              mapItems: [
                {
                  key: "RATING_CURRENT_QUESTIONNAIRE",
                  value: questionnairesTypes[0].id
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.recruiting.Candidate.Rating"
              },
              name: "sol.recruiting.candidate.workflow.rating.message"
            },
            $events: [
              {
                id: "DIALOG"
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
      it("Prepare Rating", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(wfInfo.flowId, objIdC1, { RATING_QUESTION1: "Administrator", USER1: "Administrator", USER_ID1: "0" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Start rating' forwarding Workflow", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest 'Start rating'").then(function success1(forwardWorkflowTaskResult) {
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
      it("get active node 'Rate candidate' (id = 4) of Subworkflow 'sol.recruiting.Candidate.Rating.Sub'", function (done) {
        expect(function () {
          test.Utils.getWorkflow(wfInfo.flowId).then(function success(workflow) {
            subWfs = [];
            subWorkflows = workflow.subWorkflows;
            for (key in subWorkflows) {
              subWfs.push(subWorkflows[key]);
            }
            for (i = 0; i < subWfs.length; i++) {
              if (subWfs[i].templateName == "sol.recruiting.Candidate.Rating.Sub") {
                subWf = subWfs[i];
                subWfFlowId = subWf.id;
                nodes = test.Utils.getActiveUserNodes(subWf);
                if (nodes.length > 0) {
                  for (j = 0; j < nodes.length; j++) {
                    if (nodes[j].nameTranslationKey == "sol.recruiting.wf.user.candidate.rating.sub.rate") {
                      userNode = nodes[j];
                      userNodeId = userNode.id;
                    }
                  }
                  // alert("(userNode.name, userNode.id) = (" + userNode.name + "," + userNode.id + ")");
                } else {
                  // alert("no userNodes available");
                }
              }
            }
            expect(userNodeId).toEqual(4);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Rate Candidate", function (done) {
        expect(function () {
          test.Utils.updateWfMapData(subWfFlowId, objIdC1, { RATING_SCORE1: 7 }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("'Submit rating' forwarding Subworkflow 'sol.recruiting.Candidate.Rating.Sub'", function (done) {
        expect(function () {
          test.Utils.getWorkflow(subWfFlowId).then(function success(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, userNodeId, null, "sol.common.wf.node.ok");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(subWfFlowId, userNodeId, succNodesIds, "Unittest 'Rating forward'", true).then(function success1(forwardWorkflowTaskResult) {
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
    describe("test cancel ratecandidate", function () {
      it("questionnairesTypes must be available", function (done) {
        test.Utils.execute("RF_sol_recruiting_service_GetQuestionnaires", {}).then(function success(questionnairesTypes1) {
          questionnairesTypes = questionnairesTypes1;
          expect(questionnairesTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("start action rate candidate workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "RateCandidate",
            objId: objIdC2,
            $metadata: {
              solType: "RECRUITING_CANDIDATE",
              owner: {
                fromConnection: true
              },
              objKeys: [],
              mapItems: [
                {
                  key: "RATING_CURRENT_QUESTIONNAIRE",
                  value: questionnairesTypes[0].id
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.recruiting.Candidate.Rating"
              },
              name: "sol.recruiting.candidate.workflow.rating.message"
            },
            $events: [
              {
                id: "DIALOG"
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