
describe("[action] sol.visitor.ix.actions.CheckOutVisitor", function () {
  var objTempId, objIdVs1, objIdVs2,
      visitorTypes, config, objIdConfigVisitor, configVisitor,
      checkoutVisitorWithoutDialogOld,
      wfInfo, keywording, nowDateTime,
      succNodes, succNodesIds,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.CheckOutVisitor", null, null).then(function success(objTempId1) {
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
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.actions.CheckOutVisitor", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.CheckOutVisitor",
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
            className: "sol.visitor.ix.actions.CheckOutVisitor",
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
            className: "sol.visitor.ix.actions.CheckOutVisitor",
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
  describe("set 'checkoutVisitorWithoutDialog to false in visitor.config", function () {
    it("load visitor.config", function (done) {
      expect(function () {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/visitor.config").then(function success(configSord) {
          objIdConfigVisitor = configSord.id;
          test.Utils.loadConfig(objIdConfigVisitor).then(function success2(configVisitor1) {
            configVisitor = configVisitor1;
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
    it("set checkoutVisitorWithoutDialog to false and restore old value", function (done) {
      expect(function () {
        checkoutVisitorWithoutDialogOld = configVisitor.visitor.checkoutVisitorWithoutDialog;
        configVisitor.visitor.checkoutVisitorWithoutDialog = false;
        test.Utils.saveConfig(objIdConfigVisitor, configVisitor).then(function success(jsonResult) {
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
  describe("test checkout visitor", function () {
    it("should throw if executed without 'user' and 'visitorObjId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_CheckOutVisitor", {
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
  describe("test single visitor", function () {
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
    describe("test finish checkoutvisitor", function () {
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("start action checkout workflow", function (done) {
        expect(function () {
          config = {
            visitorObjId: objIdVs1
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckOutVisitor", config, []).then(function success(jsonResults) {
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
      it("set departure date/time in visitor sord", function (done) {
        expect(function () {
          test.Utils.getSord(objIdVs1).then(function success(sordVs1) {
            keywording = {
              VISITOR_DEPARTUREDATE: nowDateTime.date,
              VISITOR_DEPARTURETIME: nowDateTime.time
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
    describe("test cancel checkoutvisitor", function () {
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("start action checkout workflow", function (done) {
        expect(function () {
          config = {
            visitorObjId: objIdVs2
          };
          wfInfo = {};
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_CheckOutVisitor", config, []).then(function success(jsonResults) {
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
      it("set departure date/time in visitor sord", function (done) {
        expect(function () {
          test.Utils.getSord(objIdVs2).then(function success(sordVs2) {
            keywording = {
              VISITOR_DEPARTUREDATE: nowDateTime.date,
              VISITOR_DEPARTURETIME: nowDateTime.time
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
  describe("restore 'checkoutVisitorWithoutDialog to old value in visitor.config", function () {
    it("set checkoutVisitorWithoutDialog to old value", function (done) {
      expect(function () {
        configVisitor.visitor.checkoutVisitorWithoutDialog = checkoutVisitorWithoutDialogOld;
        test.Utils.saveConfig(objIdConfigVisitor, configVisitor).then(function success(jsonResult) {
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