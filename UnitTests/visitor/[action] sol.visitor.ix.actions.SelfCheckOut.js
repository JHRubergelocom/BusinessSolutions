
describe("[action] sol.visitor.ix.actions.SelfCheckOut", function () {
  var objTempId, longTermBadgeTypes,
      objIdLTB, objIdVs, objId, name, desc, config, valid,
      configTypes, configAction, wfInfo, succNodes, succNodesIds,
      keywording, nowDateTime,
      originalTimeout,
      sordId, sordC, lockC, visitorId, params, visitorSord,
      visitorObjId, flowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.SelfCheckOut", null, null).then(function success(objTempId1) {
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
  describe("test self checkout", function () {
    it("should not throw if executed without Parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_visitor_action_SelfCheckOut", {
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
    describe("sol.visitor.ix.actions.SelfCheckOut", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
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
            className: "sol.visitor.ix.actions.SelfCheckOut",
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
      it("getVisitorSord", function (done) {
        expect(function () {
          visitorId = objTempId;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
            classConfig: {},
            method: "getVisitorSord",
            params: [visitorId]
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
            className: "sol.visitor.ix.actions.SelfCheckOut",
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
      it("mayCheckOut", function (done) {
        expect(function () {
          visitorSord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
            classConfig: {},
            method: "mayCheckOut",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
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
            className: "sol.visitor.ix.actions.SelfCheckOut",
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
      it("startCheckOut", function (done) {
        expect(function () {
          visitorSord = { id: objTempId };
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
            classConfig: {},
            method: "startCheckOut",
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
      it("startSelfCheckOutWorkflow", function (done) {
        expect(function () {
          visitorObjId = objTempId;
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.actions.SelfCheckOut",
            classConfig: {},
            method: "startSelfCheckOutWorkflow",
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
  describe("Self CheckIn", function () {
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
    it("finish input forwarding workflow", function (done) {
      expect(function () {
        objIdVs = wfInfo.objId;
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
  describe("test self checkout", function () {
    describe("test finish selfcheckout", function () {
      it("check self checkout precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_SelfCheckOutPreparation", {}).then(function success(jsonResult) {
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
      it("start action self checkout workflow", function (done) {
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
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_SelfCheckOut", config, []).then(function success(jsonResults) {
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
    describe("Self CheckIn", function () {
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
      it("finish input forwarding workflow", function (done) {
        expect(function () {
          objIdVs = wfInfo.objId;
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
    describe("test cancel selfcheckout", function () {
      it("check self checkout precondition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_SelfCheckOutPreparation", {}).then(function success(jsonResult) {
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
      it("start action self checkout workflow", function (done) {
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
          test.Utils.executeIxActionHandler("RF_sol_visitor_action_SelfCheckOut", config, []).then(function success(jsonResults) {
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