
describe("[action] sol.hr.ix.actions.ChangeSuperiorFile", function () {
  var personnelFileTypes, objIdHrA, objIdHr1, objIdHr2, objIdHr3,
      s1UserId, s1ObjId, s1Guid, s1Name,
      s2UserId, s2ObjId, s2Guid, s2Name, s2EloUserId,
      configAction, wfInfo,
      succNodes, succNodesIds, originalTimeout, interval;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    s1UserId = "Administrator";
    s2UserId = "Jasmin Stamm";
    expect(function () {
      test.Utils.createTempSord("Actions.ChangeSuperiorFile", null, null).then(function success(objTempId1) {
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
  describe("test start change superior file", function () {
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
    describe("create personnelfile Administrator", function () {
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
          test.Utils.getSord(wfInfo.objId).then(function success(sordHrA) {
            objIdHrA = wfInfo.objId;
            test.Utils.updateKeywording(sordHrA, { HR_PERSONNEL_FIRSTNAME: "Administrator", HR_PERSONNEL_LASTNAME: "Administrator", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
      it("get personalfile with userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s1UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s1ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s1ObjId).then(function success(sordS1) {
            s1Guid = sordS1.guid;
            s1Name = sordS1.name;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get personalfile with userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s2UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s2ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s2ObjId).then(function success(sordS2) {
            s2Guid = sordS2.guid;
            s2Name = sordS2.name;
            s2EloUserId = test.Utils.getObjKeyValue(sordS2, "HR_PERSONNEL_ELOUSERID");
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
            objIdHr1 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Hr1", HR_PERSONNEL_LASTNAME: "Hr1", HR_PERSONNEL_SUPERIOR_GUID: s1Guid, HR_PERSONNEL_SUPERIOR: s1Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr1, { HR_PERSONNEL_SUPERIORUSERID: s1UserId }).then(function success3(updateMapDataResult) {
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
            objIdHr2 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Hr2", HR_PERSONNEL_LASTNAME: "Hr2", HR_PERSONNEL_SUPERIOR_GUID: s1Guid, HR_PERSONNEL_SUPERIOR: s1Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr2, { HR_PERSONNEL_SUPERIORUSERID: s1UserId }).then(function success3(updateMapDataResult) {
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
    describe("create personnelfile hr3", function () {
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
          test.Utils.getSord(wfInfo.objId).then(function success(sordHr3) {
            objIdHr3 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr3, { HR_PERSONNEL_FIRSTNAME: "Hr3", HR_PERSONNEL_LASTNAME: "Hr3", HR_PERSONNEL_SUPERIOR_GUID: s2Guid, HR_PERSONNEL_SUPERIOR: s2Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr3, { HR_PERSONNEL_SUPERIORUSERID: s2UserId }).then(function success3(updateMapDataResult) {
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
    describe("'OK'", function () {
      describe("test finish changesuperiorfile", function () {
        it("start action changesuperiorfile workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objIdHr1,
              $name: "ChangeSuperiorFile",
              $wf: {
                name: "{{translate 'sol.hr.personnelfile.workflow.file.changesuperior.message'}}",
                template: {
                  name: "sol.hr.personnel.ChangeSuperiorFile"
                }
              },
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                mask: "Personnel File",
                type: "sol.Personnel File",
                name: "temp"
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
        it("fill personnelfile sord", function (done) {
          expect(function () {
            test.Utils.updateWfMapData(wfInfo.flowId, wfInfo.objId, { HR_PERSONNEL_SUPERIORNEWUSERID: s2EloUserId, HR_PERSONNEL_SUPERIORNEW_GUID: s2Guid, IX_MAP_HR_PERSONNEL_SUPERIORNEW: s2Name }).then(function success1(updateMapDataResult) {
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
      });
      describe("Remove personal file test data", function () {
        it("remove workflow personnnel file hr1", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr1).then(function success(wfs) {
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
        it("remove object personnnel file hr1", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file hr2", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr2).then(function success(wfs) {
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
        it("remove object personnnel file hr2", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr2).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file hr3", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr3).then(function success(wfs) {
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
        it("remove object personnnel file hr3", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr3).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file Administrator", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHrA).then(function success(wfs) {
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
        it("remove object personnnel file Administrator", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHrA).then(function success2(deleteResult1) {
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
    describe("create personnelfile Administrator", function () {
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
          test.Utils.getSord(wfInfo.objId).then(function success(sordHrA) {
            objIdHrA = wfInfo.objId;
            test.Utils.updateKeywording(sordHrA, { HR_PERSONNEL_FIRSTNAME: "Administrator", HR_PERSONNEL_LASTNAME: "Administrator", HR_PERSONNEL_ELOUSERID: "Administrator", HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
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
      it("get personalfile with userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s1UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s1ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s1UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s1ObjId).then(function success(sordS1) {
            s1Guid = sordS1.guid;
            s1Name = sordS1.name;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get personalfile with userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetUsersPersonnelFile", {
            userId: s2UserId
          }).then(function success(jsonResult) {
            expect(jsonResult.objId).toBeDefined();
            s2ObjId = jsonResult.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid, name userId: s2UserId ", function (done) {
        expect(function () {
          test.Utils.getSord(s2ObjId).then(function success(sordS2) {
            s2Guid = sordS2.guid;
            s2Name = sordS2.name;
            s2EloUserId = test.Utils.getObjKeyValue(sordS2, "HR_PERSONNEL_ELOUSERID");
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
            objIdHr1 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr1, { HR_PERSONNEL_FIRSTNAME: "Hr1", HR_PERSONNEL_LASTNAME: "Hr1", HR_PERSONNEL_SUPERIOR_GUID: s1Guid, HR_PERSONNEL_SUPERIOR: s1Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr1, { HR_PERSONNEL_SUPERIORUSERID: s1UserId }).then(function success3(updateMapDataResult) {
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
            objIdHr2 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr2, { HR_PERSONNEL_FIRSTNAME: "Hr2", HR_PERSONNEL_LASTNAME: "Hr2", HR_PERSONNEL_SUPERIOR_GUID: s1Guid, HR_PERSONNEL_SUPERIOR: s1Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr2, { HR_PERSONNEL_SUPERIORUSERID: s1UserId }).then(function success3(updateMapDataResult) {
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
    describe("create personnelfile hr3", function () {
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
          test.Utils.getSord(wfInfo.objId).then(function success(sordHr3) {
            objIdHr3 = wfInfo.objId;
            test.Utils.updateKeywording(sordHr3, { HR_PERSONNEL_FIRSTNAME: "Hr3", HR_PERSONNEL_LASTNAME: "Hr3", HR_PERSONNEL_SUPERIOR_GUID: s2Guid, HR_PERSONNEL_SUPERIOR: s2Name, HR_PERSONNEL_RESPONSIBLE: "HR" }, true).then(function success1(updateKeywordingResult) {
              test.Utils.updateMapData(objIdHr3, { HR_PERSONNEL_SUPERIORUSERID: s2UserId }).then(function success3(updateMapDataResult) {
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
    describe("'Cancel'", function () {
      describe("test cancel changesuperiorfile", function () {
        it("start action changesuperiorfile workflow", function (done) {
          expect(function () {
            configAction = {
              objId: objIdHr1,
              $name: "ChangeSuperiorFile",
              $wf: {
                name: "{{translate 'sol.hr.personnelfile.workflow.file.changesuperior.message'}}",
                template: {
                  name: "sol.hr.personnel.ChangeSuperiorFile"
                }
              },
              $new: {
                target: {
                  mode: "DEFAULT"
                },
                mask: "Personnel File",
                type: "sol.Personnel File",
                name: "temp"
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
      });
      describe("Remove personal file test data", function () {
        it("remove workflow personnnel file hr1", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr1).then(function success(wfs) {
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
        it("remove object personnnel file hr1", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file hr2", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr2).then(function success(wfs) {
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
        it("remove object personnnel file hr2", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr2).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file hr3", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHr3).then(function success(wfs) {
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
        it("remove object personnnel file hr3", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHr3).then(function success2(deleteResult1) {
              done();
            }, function error(err) {
              fail(err);
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow personnnel file Administrator", function (done) {
          expect(function () {
            test.Utils.getFinishedWorkflows(objIdHrA).then(function success(wfs) {
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
        it("remove object personnnel file Administrator", function (done) {
          expect(function () {
            test.Utils.deleteSord(objIdHrA).then(function success2(deleteResult1) {
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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