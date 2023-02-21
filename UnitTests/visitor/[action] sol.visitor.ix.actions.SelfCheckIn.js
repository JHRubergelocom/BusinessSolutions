
describe("[action] sol.visitor.ix.actions.SelfCheckIn", function () {
  var objTempId, longTermBadgeTypes,
      objIdLTB, objIdVs, objId, name, desc, config, valid,
      configTypes, configAction, wfInfo, succNodes, succNodesIds,
      keywording, nowDateTime,
      originalTimeout,
      visitorSord, mask, intermediateSord, visitorTemplateSord,
      longTermBadgeSord, params, longTermBadgeId, sordId, sordC,
      lockC, visitorType, ids, visitorObjId, flowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.SelfCheckIn", null, null).then(function success(objTempId1) {
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
  describe("test self checkin", function () {
    it("should not throw if executed without Parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_SelfCheckIn", {
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
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.actions.SelfCheckIn", function () {
      it("changeVisitorMask", function (done) {
        expect(function () {
          visitorSord = { id: objTempId };
          mask = "0";
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "changeVisitorMask",
            params: [visitorSord, mask]
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
      it("checkInVisitorSord", function (done) {
        expect(function () {
          visitorSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "checkInVisitorSord",
            params: [visitorSord]
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
      it("convertIntermediateSordToVisitor", function (done) {
        expect(function () {
          intermediateSord = { id: objTempId };
          visitorTemplateSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "convertIntermediateSordToVisitor",
            params: [intermediateSord, visitorTemplateSord]
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
      it("copyLongTermBadge", function (done) {
        expect(function () {
          longTermBadgeSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "copyLongTermBadge",
            params: [longTermBadgeSord]
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
      it("createAndReturnIntermediateSord", function (done) {
        expect(function () {
          longTermBadgeSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "createAndReturnIntermediateSord",
            params: [longTermBadgeSord]
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
      it("createAndReturnVisitorFromLongTermBadge", function (done) {
        expect(function () {
          longTermBadgeSord = { id: objTempId };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "createAndReturnVisitorFromLongTermBadge",
            params: [longTermBadgeSord, params]
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
      it("createAndReturnVisitorSord", function (done) {
        expect(function () {
          intermediateSord = { id: objTempId };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "createAndReturnVisitorSord",
            params: [intermediateSord, params]
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
      it("getLongTermBadgeSord", function (done) {
        expect(function () {
          longTermBadgeId = objTempId;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "getLongTermBadgeSord",
            params: [longTermBadgeId]
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
            className: "sol.visitor.ix.actions.SelfCheckIn",
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
      it("getSord", function (done) {
        expect(function () {
          sordId = objTempId;
          sordC = 0;
          lockC = 0;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "getSord",
            params: [sordId, sordC, lockC]
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
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "getTemplateArcPath",
            params: [visitorType, params]
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
      it("getVisitorTemplateSord", function (done) {
        expect(function () {
          visitorSord = { id: objTempId };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "getVisitorTemplateSord",
            params: [visitorSord, params]
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
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "initialize",
            params: [params]
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
      it("linkLongTermBadgeWithNewlyCreatedVisitor", function (done) {
        expect(function () {
          ids = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "linkLongTermBadgeWithNewlyCreatedVisitor",
            params: [ids]
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
      it("mayCheckIn", function (done) {
        expect(function () {
          longTermBadgeSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "mayCheckIn",
            params: [longTermBadgeSord]
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
            className: "sol.visitor.ix.actions.SelfCheckIn",
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
      it("showWorkflowFormular", function (done) {
        expect(function () {
          visitorObjId = objTempId;
          flowId = 1;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "showWorkflowFormular",
            params: [visitorObjId, flowId]
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
      it("startCheckIn", function (done) {
        expect(function () {
          longTermBadgeSord = { id: objTempId };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "startCheckIn",
            params: [longTermBadgeSord, params]
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
      it("startSelfCheckInWorkflow", function (done) {
        expect(function () {
          visitorObjId = objTempId;
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckIn",
            classConfig: {},
            method: "startSelfCheckInWorkflow",
            params: [visitorObjId, params]
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
  describe("Create long term badge", function () {
    it("get current date, time", function () {
      expect(function () {
        nowDateTime = test.Utils.getNowDateTime();
      }).not.toThrow();
    });
    it("longTermBadgeTypes must be available", function (done) {
      configTypes = {
        $types: {
          path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Long term badge types"
        }
      };
      test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(longTermBadgeTypes1) {
        longTermBadgeTypes = longTermBadgeTypes1;
        expect(longTermBadgeTypes).toBeDefined();
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
          objId: objTempId,
          $new: {
            target: {
              mode: "DEFAULT"
            },
            template: {
              base: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Long term badge types",
              name: longTermBadgeTypes[0].name
            }
          },
          $name: "sol.visitor.CreateLongTermBadge",
          $wf: {
            template: {
              name: "sol.visitor.longtermbadge.create"
            },
            name: "{{translate 'sol.visitor.workflow.longtermbadge.create.name'}}"
          },
          $metadata: {
            owner: {
              fromConnection: true
            },
            solType: "LONG_TERM_BADGE"
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
    it("fill longTermBadge sord", function (done) {
      expect(function () {
        test.Utils.getSord(wfInfo.objId).then(function success(sordLTB) {
          objIdLTB = wfInfo.objId;
          keywording = {
            VISITOR_LASTNAME: "Administrator",
            VISITOR_USERNAME: "Administrator",
            LONGTERM_BADGE_VALID_FROM: nowDateTime.date,
            LONGTERM_BADGE_VALID_UNTIL: nowDateTime.date,
            LONGTERM_BADGE_STATUS: "ACTIVE"
          };
          test.Utils.updateKeywording(sordLTB, keywording, true).then(function success1(updateKeywordingResult) {
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
            fail(err);
            console.error(err);
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
  describe("test self checkin", function () {
    describe("test finish selfcheckin", function () {
      it("check self checkin precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_SelfCheckInPreparation", {}).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            expect(jsonResult.types[0].objId).toBeDefined();
            expect(jsonResult.types[0].name).toBeDefined();
            expect(jsonResult.types[0].desc).toBeDefined();
            valid = jsonResult.valid;
            objId = jsonResult.types[0].objId;
            name = jsonResult.types[0].name;
            desc = jsonResult.types[0].desc;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action self checkin workflow", function (done) {
        expect(function () {
          wfInfo = {};
          config = {
            $templating: {
              $type: {
                objId: objId,
                name: name,
                desc: desc
              },
              $preconditions: {
                valid: valid,
                types: [
                  {
                    objId: objId,
                    name: name,
                    desc: desc
                  }
                ]
              }
            }
          };
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_SelfCheckIn", config, []).then(function success(jsonResults) {
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
        objIdVs = wfInfo.objId;
        expect(wfInfo.objId).toBeDefined();
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
      it("remove visitor object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdVs).then(function success2(deleteResult1) {
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
    describe("test cancel selfcheckin", function () {
      it("check self checkin precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_SelfCheckInPreparation", {}).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            expect(jsonResult.types[0].objId).toBeDefined();
            expect(jsonResult.types[0].name).toBeDefined();
            expect(jsonResult.types[0].desc).toBeDefined();
            valid = jsonResult.valid;
            objId = jsonResult.types[0].objId;
            name = jsonResult.types[0].name;
            desc = jsonResult.types[0].desc;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start action self checkin workflow", function (done) {
        expect(function () {
          wfInfo = {};
          config = {
            $templating: {
              $type: {
                objId: objId,
                name: name,
                desc: desc
              },
              $preconditions: {
                valid: valid,
                types: [
                  {
                    objId: objId,
                    name: name,
                    desc: desc
                  }
                ]
              }
            }
          };
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_SelfCheckIn", config, []).then(function success(jsonResults) {
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
    });
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.deleteSord(objIdLTB).then(function success2(deleteResult1) {
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
});