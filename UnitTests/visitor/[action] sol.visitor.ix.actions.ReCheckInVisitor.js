/* eslint-disable linebreak-style */

describe("[action] sol.visitor.ix.actions.ReCheckInVisitor", function () {
  var objTempId, objIdVs1a, objIdVs2a, objIdGr1a, objIdGr2a,
      objIdVs1b, objIdVs2b, objIdGr1b, objIdGr2b,
      visitorTypes, config,
      wfInfo,
      succNodes, succNodesIds,
      keywording, mapdata, nowDateTime,
      originalTimeout,
      visitorType, destinationID, sord, solType,
      parentId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.ReCheckInVisitor", null, null).then(function success(objTempId1) {
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
  describe("test recheckin visitor", function () {
    it("should throw if executed without 'user' and 'visitorObjId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_ReCheckInVisitor", {
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
  });
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.actions.ReCheckInVisitor", function () {
      it("buildElementName", function (done) {
        expect(function () {
          visitorType = "visitorType1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
            classConfig: {},
            method: "buildElementName",
            params: [visitorType]
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
      it("copySordData", function (done) {
        expect(function () {
          destinationID = objTempId;
          sord = { id: objTempId };
          solType = "LONG_TERM_BADGE";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
            classConfig: {},
            method: "copySordData",
            params: [destinationID, sord, solType]
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
      it("createClone", function (done) {
        expect(function () {
          parentId = objTempId;
          sord = { id: objTempId };
          solType = "LONG_TERM_BADGE";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
            classConfig: {},
            method: "createClone",
            params: [parentId, sord, solType]
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
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
      it("getTemplateArcPath", function (done) {
        expect(function () {
          visitorType = "visitorType1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
            classConfig: {},
            method: "getTemplateArcPath",
            params: [visitorType]
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
      it("getTemplateArcPathGroup", function (done) {
        expect(function () {
          visitorType = "visitorType1";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
            classConfig: {},
            method: "getTemplateArcPathGroup",
            params: [visitorType]
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
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
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
            className: "sol.visitor.ix.actions.ReCheckInVisitor",
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
  describe("test preregister -> cancel visitor registration -> checkin", function () {
    describe("test single visitor", function () {
      describe("preregister visitor1", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime(-3);
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
        it("start workflow preregister visitor", function (done) {
          expect(function () {
            config = {
              parentId: objTempId,
              visitorType: visitorTypes[0].name,
              templateId: visitorTypes[0].objId
            };
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_PreRegisterVisitor", config, []).then(function success(jsonResults) {
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
              objIdVs1a = wfInfo.objId;
              keywording = {
                VISITOR_FIRSTNAME: "Bernd", VISITOR_LASTNAME: "Stromberg",
                VISITOR_COMPANYNAME: "Capitol Versicherungen",
                VISITOR_VISITPURPOSE: "Hausratversicherung",
                VISITOR_STARTDATE: nowDateTime.date,
                VISITOR_STARTTIME: nowDateTime.time,
                VISITOR_SECURITY_CLEARANCE: "NC"
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
            test.Utils.updateMapData(objIdVs1a, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
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
                // fail(err);
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
            test.Utils.getFinishedWorkflows().then(function success(wfs) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                done();
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                done();
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("test finish recheckinvisitor", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime();
          }).not.toThrow();
        });
        it("start action checkin workflow", function (done) {
          expect(function () {
            config = {
              visitorObjId: objIdVs1a
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckInVisitor", config, []).then(function success(jsonResults) {
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
        it("set arrival date/time in visitor sord", function (done) {
          expect(function () {
            objIdVs1b = wfInfo.objId;
            test.Utils.getSord(objIdVs1b).then(function success(sordVs1) {
              keywording = {
                VISITOR_ARRIVALDATE: nowDateTime.date,
                VISITOR_ARRIVALTIME: nowDateTime.time
              };
              test.Utils.updateKeywording(sordVs1, keywording, true).then(function success1(updateKeywordingResult) {
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
            test.Utils.getFinishedWorkflows().then(function success(wfs) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                done();
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("preregister visitor2", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime(-3);
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
        it("start workflow preregister visitor", function (done) {
          expect(function () {
            config = {
              parentId: objTempId,
              visitorType: visitorTypes[0].name,
              templateId: visitorTypes[0].objId
            };
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_PreRegisterVisitor", config, []).then(function success(jsonResults) {
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
              objIdVs2a = wfInfo.objId;
              keywording = {
                VISITOR_FIRSTNAME: "Nils", VISITOR_LASTNAME: "Armstrong",
                VISITOR_COMPANYNAME: "Freier Astronaut",
                VISITOR_VISITPURPOSE: "Raumflug",
                VISITOR_STARTDATE: nowDateTime.date,
                VISITOR_STARTTIME: nowDateTime.time,
                VISITOR_SECURITY_CLEARANCE: "NC"
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
            test.Utils.updateMapData(objIdVs2a, { VISITOR_TOTALVISITORS: 1 }).then(function success(updateMapDataResult) {
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
                // fail(err);
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
            test.Utils.getFinishedWorkflows().then(function success(wfs) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                done();
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
        it("remove workflow", function (done) {
          expect(function () {
            test.Utils.getActiveWorkflows().then(function success(wfs) {
              test.Utils.removeActiveWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
                done();
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("test cancel recheckinvisitor", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime();
          }).not.toThrow();
        });
        it("start action checkin workflow", function (done) {
          expect(function () {
            config = {
              visitorObjId: objIdVs2a
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckInVisitor", config, []).then(function success(jsonResults) {
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
        it("set arrival date/time in visitor sord", function (done) {
          expect(function () {
            objIdVs2b = wfInfo.objId;
            test.Utils.getSord(objIdVs2b).then(function success(sordVs2) {
              keywording = {
                VISITOR_ARRIVALDATE: nowDateTime.date,
                VISITOR_ARRIVALTIME: nowDateTime.time
              };
              test.Utils.updateKeywording(sordVs2, keywording, true).then(function success1(updateKeywordingResult) {
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
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
    });
    describe("test group", function () {
      describe("preregister group1", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime(-3);
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
        it("start workflow preregister group", function (done) {
          expect(function () {
            config = {
              parentId: objTempId,
              visitorType: visitorTypes[0].name,
              templateId: visitorTypes[0].objId
            };
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_PreRegisterGroup", config, []).then(function success(jsonResults) {
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
              objIdGr1a = wfInfo.objId;
              keywording = {
                VISITOR_GROUP_NAME: "Einzelkämpfer",
                VISITOR_VISITPURPOSE: "Sport",
                VISITOR_STARTDATE: nowDateTime.date,
                VISITOR_STARTTIME: nowDateTime.time
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
              VISITOR_GROUPRESPONSIBLE1: 1,
              VISITOR_COMPANYNAME1:	"Mustefirma",
              VISITOR_FIRSTNAME1:	"Max",
              VISITOR_LASTNAME1: "Mustermann",
              VISITOR_TOTALVISITORS: 1
            };
            test.Utils.updateMapData(objIdGr1a, mapdata).then(function success(updateMapDataResult) {
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
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("test cancel recheckingroup", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime();
          }).not.toThrow();
        });
        it("start action checkin workflow", function (done) {
          expect(function () {
            config = {
              visitorObjId: objIdGr1a
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckInVisitor", config, []).then(function success(jsonResults) {
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
        it("set arrival date group sord", function (done) {
          expect(function () {
            objIdGr1b = wfInfo.objId;
            test.Utils.getSord(objIdGr1b).then(function success(sordGr1) {
              keywording = {
                VISITOR_ARRIVALDATE: nowDateTime.date
              };
              test.Utils.updateKeywording(sordGr1, keywording, true).then(function success1(updateKeywordingResult) {
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
        it("set checkin and arrival time single visitor1", function (done) {
          expect(function () {
            mapdata = {
              VISITOR_ARRIVALTIME1: nowDateTime.time,
              VISITOR_CHECKEDIN1:	1,
              VISITOR_CHECKINVISITOR1: 1
            };
            test.Utils.updateMapData(objIdGr1b, mapdata).then(function success(updateMapDataResult) {
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
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("preregister group2", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime(-3);
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
        it("start workflow preregister group", function (done) {
          expect(function () {
            config = {
              parentId: objTempId,
              visitorType: visitorTypes[0].name,
              templateId: visitorTypes[0].objId
            };
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_PreRegisterGroup", config, []).then(function success(jsonResults) {
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
              objIdGr2a = wfInfo.objId;
              keywording = {
                VISITOR_GROUP_NAME: "Bremer Stadtmusikanten",
                VISITOR_VISITPURPOSE: "Platzkonzert",
                VISITOR_STARTDATE: nowDateTime.date,
                VISITOR_STARTTIME: nowDateTime.time
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
            test.Utils.updateMapData(objIdGr2a, mapdata).then(function success(updateMapDataResult) {
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
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }).not.toThrow();
        });
      });
      describe("test finish recheckingroup", function () {
        it("get current date, time", function () {
          expect(function () {
            nowDateTime = test.Utils.getNowDateTime();
          }).not.toThrow();
        });
        it("start action checkin workflow", function (done) {
          expect(function () {
            config = {
              visitorObjId: objIdGr2a
            };
            wfInfo = {};
            test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckInVisitor", config, []).then(function success(jsonResults) {
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
        it("set arrival date group sord", function (done) {
          expect(function () {
            objIdGr2b = wfInfo.objId;
            test.Utils.getSord(objIdGr2a).then(function success(sordGr2) {
              keywording = {
                VISITOR_ARRIVALDATE: nowDateTime.date
              };
              test.Utils.updateKeywording(sordGr2, keywording, true).then(function success1(updateKeywordingResult) {
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
        it("set checkin and arrival time in single visitor1 and visitor2", function (done) {
          expect(function () {
            mapdata = {
              VISITOR_CHECKEDIN1:	1,
              VISITOR_CHECKEDIN2:	1,
              VISITOR_CHECKINVISITOR1: 1,
              VISITOR_CHECKINVISITOR2: 1,
              VISITOR_ARRIVALTIME1: nowDateTime.time,
              VISITOR_ARRIVALTIME2: nowDateTime.time
            };
            test.Utils.updateMapData(objIdGr2b, mapdata).then(function success(updateMapDataResult) {
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
          test.Utils.deleteSord(objIdVs1a).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdVs2a).then(function success3(deleteResult2) {
              test.Utils.deleteSord(objIdGr1a).then(function success4(deleteResult3) {
                test.Utils.deleteSord(objIdGr2a).then(function success5(deleteResult4) {
                  test.Utils.deleteSord(objIdVs1b).then(function success6(deleteResult5) {
                    test.Utils.deleteSord(objIdVs2b).then(function success7(deleteResult6) {
                      test.Utils.deleteSord(objIdGr1b).then(function success8(deleteResult7) {
                        test.Utils.deleteSord(objIdGr2b).then(function success9(deleteResult8) {
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