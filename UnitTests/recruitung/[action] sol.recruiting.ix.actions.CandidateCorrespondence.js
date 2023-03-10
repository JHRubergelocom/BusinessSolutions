
describe("[action] sol.recruiting.ix.actions.CandidateCorrespondence", function () {
  var objTempId, candidateTypes,
      configTypes, configAction, wfInfo, succNodes, succNodesIds, objIdC1, objIdC2,
      privateEmail, objIdR, requisitionTypes, correspondenceTypes,
      requisitionNo, requisitionName, requisitionGuid,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CandidateCorrespondence", null, null).then(function success(objTempId1) {
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
  describe("test candidate correspondence", function () {
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
            test.Utils.updateKeywording(sordC1, { RECRUITING_CANDIDATE_FIRSTNAME: "Bernd", RECRUITING_CANDIDATE_LASTNAME: "Stromberg", RECRUITING_CANDIDATE_PRIVATEEMAIL: "test-business-solutions@elo.local" }, true).then(function success1(updateKeywordingResult) {
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
    describe("test finish candidatecorrespondence", function () {
      it("correspondenceTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Correspondence"
          },
          shortenDesc: true,
          maxDescLength: 1
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(correspondenceTypes1) {
          correspondenceTypes = correspondenceTypes1;
          expect(correspondenceTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("correspondenceTypes.length must greater than zero", function () {
        expect(correspondenceTypes.length).toBeGreaterThan(0);
      });
      it("get privateEmail", function (done) {
        expect(function () {
          test.Utils.getSord(objIdC1).then(function success(sordC1) {
            privateEmail = test.Utils.getObjKeyValue(sordC1, "RECRUITING_CANDIDATE_PRIVATEEMAIL");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action candidate correspondence workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "CandidateCorrespondence",
            objId: objIdC1,
            $metadata: {
              solType: "RECRUITING_COMMUNICATION",
              owner: {
                fromConnection: true
              },
              objKeys: [],
              mapItems: [
                {
                  key: "RECRUITING_COMMUNICATION_RECIPIENT",
                  value: privateEmail
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.recruiting.Candidate.Correspond"
              },
              name: "sol.recruiting.candidate.workflow.candidatecorrespondence.message"
            },
            $events: [
              {
                id: "DIALOG"
              },
              {
                id: "FEEDBACK",
                onWfStatus: "SENT",
                message: "sol.recruiting.candidate.workflow.candidatecorrespondence.feedback"
              }
            ],
            $new: {
              target: {
                mode: "SELECTED"
              },
              name: "Correspondence",
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Correspondence",
                name: correspondenceTypes[0].name
              }
            },
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
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
      it("wfInfo.flowId must be available", function () {
        expect(wfInfo.flowId).toBeDefined();
      });
      it("wfInfo.nodeId must be available", function () {
        expect(wfInfo.nodeId).toBeDefined();
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
            test.Utils.updateKeywording(sordC2, { RECRUITING_CANDIDATE_FIRSTNAME: "Nils", RECRUITING_CANDIDATE_LASTNAME: "Armstrong", RECRUITING_CANDIDATE_PRIVATEEMAIL: "test-business-solutions@elo.local" }, true).then(function success1(updateKeywordingResult) {
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
    describe("test cancel candidatecorrespondence", function () {
      it("correspondenceTypes must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Correspondence"
          },
          shortenDesc: true,
          maxDescLength: 1
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(correspondenceTypes1) {
          correspondenceTypes = correspondenceTypes1;
          expect(correspondenceTypes).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("correspondenceTypes.length must greater than zero", function () {
        expect(correspondenceTypes.length).toBeGreaterThan(0);
      });
      it("get privateEmail", function (done) {
        expect(function () {
          test.Utils.getSord(objIdC2).then(function success(sordC2) {
            privateEmail = test.Utils.getObjKeyValue(sordC2, "RECRUITING_CANDIDATE_PRIVATEEMAIL");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action candidate correspondence workflow", function (done) {
        expect(function () {
          configAction = {
            $name: "CandidateCorrespondence",
            objId: objIdC2,
            $metadata: {
              solType: "RECRUITING_COMMUNICATION",
              owner: {
                fromConnection: true
              },
              objKeys: [],
              mapItems: [
                {
                  key: "RECRUITING_COMMUNICATION_RECIPIENT",
                  value: privateEmail
                }
              ]
            },
            $wf: {
              template: {
                name: "sol.recruiting.Candidate.Correspond"
              },
              name: "sol.recruiting.candidate.workflow.candidatecorrespondence.message"
            },
            $events: [
              {
                id: "DIALOG"
              },
              {
                id: "FEEDBACK",
                onWfStatus: "SENT",
                message: "sol.recruiting.candidate.workflow.candidatecorrespondence.feedback"
              }
            ],
            $new: {
              target: {
                mode: "SELECTED"
              },
              name: "Correspondence",
              template: {
                base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Correspondence",
                name: correspondenceTypes[0].name
              }
            },
            $permissions: {
              mode: "SET",
              copySource: false,
              inherit: {
                fromDirectParent: false
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