/* eslint-disable linebreak-style */

describe("[service] sol.visitor.ix.services.SelfCheckInPreparation", function () {
  var objTempId, longTermBadgeTypes, nowDateTime, keywording,
      configTypes, configAction, wfInfo, succNodes, succNodesIds, objIdLTB,
      originalTimeout,
      longTermBadge, longTermBadges, visitors, isCheckedIn, visitor,
      requestParameters, message, clientInfo;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SelfCheckInPreparation").then(function success(objTempId1) {
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
  describe("Test Lib Functions", function () {
    describe("sol.visitor.ix.services.SelfCheckInPreparation", function () {
      it("checkAndSetIfAnyVisitorIsCheckedIn", function (done) {
        expect(function () {
          longTermBadge = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "checkAndSetIfAnyVisitorIsCheckedIn",
            params: [longTermBadge]
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
      it("checkIfOneLongTermBadgeIsCheckedIn", function (done) {
        expect(function () {
          longTermBadges = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "checkIfOneLongTermBadgeIsCheckedIn",
            params: [longTermBadges]
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
      it("getLongTermBadgeVisitors", function (done) {
        longTermBadge = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getLongTermBadgeVisitors",
            params: [longTermBadge]
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
      it("getLongTermBadgesOfCurrentUser", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getLongTermBadgesOfCurrentUser",
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
      it("getLongTermBadgesOfCurrentUser", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getLongTermBadgesOfCurrentUser",
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
      it("getLongTermBadgesWithVisitors", function (done) {
        expect(function () {
          longTermBadges = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getLongTermBadgesWithVisitors",
            params: [longTermBadges]
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
      it("getSelectableChoices", function (done) {
        expect(function () {
          longTermBadges = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getSelectableChoices",
            params: [longTermBadges]
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
      it("getStatusOfLongTermBadge", function (done) {
        expect(function () {
          longTermBadge = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getStatusOfLongTermBadge",
            params: [longTermBadge]
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
      it("getValidLongTermBadgesOfCurrentUser", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "getValidLongTermBadgesOfCurrentUser",
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
      it("isAnyVisitorCheckedIn", function (done) {
        expect(function () {
          visitors = [];
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "isAnyVisitorCheckedIn",
            params: [visitors]
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
      it("isLongTermBadgeValid", function (done) {
        expect(function () {
          longTermBadge = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "isLongTermBadgeValid",
            params: [longTermBadge]
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
      it("isOneVisitorCheckedIn", function (done) {
        expect(function () {
          isCheckedIn = true;
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "isOneVisitorCheckedIn",
            params: [isCheckedIn, visitor]
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
      it("optimizedExecute", function (done) {
        expect(function () {
          requestParameters = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "optimizedExecute",
            params: [requestParameters]
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
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
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
      it("setLongTermBadgeVisitors", function (done) {
        longTermBadge = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "setLongTermBadgeVisitors",
            params: [longTermBadge]
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
      it("setStatusOfLongTermBadge", function (done) {
        longTermBadge = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "setStatusOfLongTermBadge",
            params: [longTermBadge]
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
      it("translate", function (done) {
        message = "message1";
        clientInfo = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.SelfCheckInPreparation",
            classConfig: {},
            method: "translate",
            params: [message, clientInfo]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_service_SelfCheckInPreparation", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_SelfCheckInPreparation", {
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            expect(jsonResult.types[0].objId).toBeDefined();
            expect(jsonResult.types[0].name).toBeDefined();
            expect(jsonResult.types[0].desc).toBeDefined();
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
            test.Utils.getFinishedWorkflows().then(function success3(wfs) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success4(removeFinishedWorkflowsResult) {
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