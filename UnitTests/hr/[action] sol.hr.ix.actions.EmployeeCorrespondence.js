
describe("[action] sol.hr.ix.actions.EmployeeCorrespondence", function () {
  var personnelFileTypes, objIdHr,
      configAction, wfInfo,
      succNodes, succNodesIds, originalTimeout, interval;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.EmployeeCorrespondence", null, null).then(function success(objTempId1) {
        interval = 4000;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("test employee correspondence", function () {
    it("should not throw if executed without 'objId'", function (done) {
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
    describe("'OK'", function () {
      describe("create personnelfile hr1", function () {
        it("personnelFileTypes must be available", function (done) {
          test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
            personnelFileTypes = personnelFileTypes1;
            expect(personnelFileTypes).toBeDefined();
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
              typeName: personnelFileTypes[0].name,
              typeObjId: personnelFileTypes[0].objId,
              typeSource: personnelFileTypes[0].source,
              typeSourceName: personnelFileTypes[0].sourceName
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
        it("fill personnelfile sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordHr1) {
              objIdHr = wfInfo.objId;
              test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Bernd", HR_PERSONNEL_LASTNAME: "Stromberg", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
        it("setTimeout (wait for background job change rights)", function (done) {
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
      describe("test finish employeecorrespondence", function () {
        it("start action employeecorrespondence workflow", function (done) {
          expect(function () {
            configAction = {
              $name: "EmployeeCorrespondence",
              objId: objIdHr,
              $metadata: {
                solType: "HR_COMMUNICATION",
                owner: {
                  fromConnection: true
                },
                objKeys: [],
                mapItems: [
                  {
                    key: "HR_COMMUNICATION_RECIPIENT",
                    value: "{{sord.objKeys.RECRUITING_CANDIDATE_PRIVATEEMAIL}}"
                  },
                  {
                    key: "HR_PERSONNEL_FILE",
                    value: "{{sord.guid}}"
                  }
                ]
              },
              $wf: {
                template: {
                  name: "sol.hr.personnel.correspondence"
                },
                name: "{{translate 'sol.hr.personnel.workflow.employeecorrespondence.message'}}"
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: ""
                },
                {
                  id: "GOTO",
                  onWfStatus: ""
                },
                {
                  id: "FEEDBACK",
                  onWfStatus: "SENT",
                  message: "{{translate 'sol.hr.personnel.workflow.employeecorrespondence.feedback'}}"
                }
              ],
              $new: {
                target: {
                  mode: "SELECTED"
                },
                name: "Correspondence",
                template: {
                  objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr/Configuration/Communication Templates/Base"
                }
              },
              $permissions: {
                mode: "SET",
                copySource: false,
                inherit: {
                  fromDirectParent: true
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
        it("wfInfo.objId must be available", function () {
          expect(wfInfo.objId).toBeDefined();
        });
        it("fill corrospondence sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordCo) {
              test.Utils.updateKeywording(sordCo, {
                COMMUNICATION_SENDER: "test-business-solutions@elo.local",
                COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                COMMUNICATION_SUBJECT: "Subject Employee Correspondence"
              }, true).then(function success1(updateKeywordingResult) {
                test.Utils.updateSord(sordCo, [{ key: "desc", value: "Content Employee Correspondence" }]).then(function success2(updateSordResult) {
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
              succNodes = test.Utils.getSuccessorNodes(workflow, wfInfo.nodeId, null, "sol.common.wf.node.ok");
              succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
              test.Utils.forwardWorkflowTask(wfInfo.flowId, wfInfo.nodeId, succNodesIds, "Unittest finish input").then(function success1(forwardWorkflowTaskResult) {
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
        it("remove hr object", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
    describe("'Cancel'", function () {
      describe("create personnelfile hr2", function () {
        it("personnelFileTypes must be available", function (done) {
          test.Utils.execute("RF_sol_hr_service_GetPersonnelFileTypes", {}).then(function success(personnelFileTypes1) {
            personnelFileTypes = personnelFileTypes1;
            expect(personnelFileTypes).toBeDefined();
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
              typeName: personnelFileTypes[0].name,
              typeObjId: personnelFileTypes[0].objId,
              typeSource: personnelFileTypes[0].source,
              typeSourceName: personnelFileTypes[0].sourceName
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_hr_personnel_action_CreateFile", configAction, []).then(function success(jsonResults) {
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
        it("fill personnelfile sord", function (done) {
          expect(function () {
            test.Utils.getSord(wfInfo.objId).then(function success(sordHr2) {
              objIdHr = wfInfo.objId;
              test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Nils", HR_PERSONNEL_LASTNAME: "Armstrong", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
        it("setTimeout (wait for background job change rights)", function (done) {
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
      describe("test cancel employeecorrespondence", function () {
        it("start action employeecorrespondence workflow", function (done) {
          expect(function () {
            configAction = {
              $name: "EmployeeCorrespondence",
              objId: objIdHr,
              $metadata: {
                solType: "HR_COMMUNICATION",
                owner: {
                  fromConnection: true
                },
                objKeys: [],
                mapItems: [
                  {
                    key: "HR_COMMUNICATION_RECIPIENT",
                    value: "{{sord.objKeys.RECRUITING_CANDIDATE_PRIVATEEMAIL}}"
                  },
                  {
                    key: "HR_PERSONNEL_FILE",
                    value: "{{sord.guid}}"
                  }
                ]
              },
              $wf: {
                template: {
                  name: "sol.hr.personnel.correspondence"
                },
                name: "{{translate 'sol.hr.personnel.workflow.employeecorrespondence.message'}}"
              },
              $events: [
                {
                  id: "DIALOG",
                  onWfStatus: ""
                },
                {
                  id: "GOTO",
                  onWfStatus: ""
                },
                {
                  id: "FEEDBACK",
                  onWfStatus: "SENT",
                  message: "{{translate 'sol.hr.personnel.workflow.employeecorrespondence.feedback'}}"
                }
              ],
              $new: {
                target: {
                  mode: "SELECTED"
                },
                name: "Correspondence",
                template: {
                  objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr/Configuration/Communication Templates/Base"
                }
              },
              $permissions: {
                mode: "SET",
                copySource: false,
                inherit: {
                  fromDirectParent: true
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
        it("wfInfo.objId must be available", function () {
          expect(wfInfo.objId).toBeDefined();
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
        it("remove hr object", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr).then(function success(deleteResult) {
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
        it("remove workflows", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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