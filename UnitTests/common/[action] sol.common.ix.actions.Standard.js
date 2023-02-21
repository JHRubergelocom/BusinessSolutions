
describe("[action] sol.common.ix.actions.Standard", function () {
  var originalTimeout, objTempId,
      configAction, wfInfo, succNodes, succNodesIds,
      objId, rights, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Actions.Standard", null, null).then(function success(objTempId1) {
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
    describe("sol.common.ix.actions.Standard", function () {
      it("addEvents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: {},
            method: "addEvents",
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
      it("applyPermissions", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: {},
            method: "applyPermissions",
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
      it("checkAccessRights", function (done) {
        expect(function () {
          objId = objTempId;
          rights = { r: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: {},
            method: "checkAccessRights",
            params: [objId, rights]
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
      it("createElementFromScratch", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { $new: { mask: "UnitTest" }, _state: {}, _ctx: {} },
            method: "createElementFromScratch",
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
      it("createElementFromTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { $new: { template: { objId: objTempId } }, _state: { fromTemplate: {} }, _ctx: { name: {} } },
            method: "createElementFromTemplate",
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
      it("createElementName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { _ctx: { name: {} } },
            method: "createElementName",
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
      it("createWorkflowName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { _ctx: { wfName: {} } },
            method: "createWorkflowName",
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
      it("editMetadata", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { _ctx: { objId: objTempId } },
            method: "editMetadata",
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
      it("getMask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { $new: { mask: "UnitTest" } },
            method: "getMask",
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
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
      it("getTargetId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: {},
            method: "getTargetId",
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
      it("getType", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { $new: { type: "TXT" } },
            method: "getType",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
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
      it("initializeElement", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { objId: objTempId, _ctx: {}, _state: {} },
            method: "initializeElement",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { objId: objTempId, _ctx: {}, _state: {}, $wf: { template: { key: "UnittestStandardWF" } } },
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
      it("saveChanges", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { _state: {} },
            method: "saveChanges",
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
      it("startWorkflow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common.ix.actions.Standard",
            classConfig: { $wf: { template: { key: "UnittestStandardWF" } }, _ctx: { objId: objTempId } },
            method: "startWorkflow",
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
  describe("test standard action", function () {
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
    it("start workflow 'Workflow Unittest'", function (done) {
      expect(function () {
        configAction = {
          objId: objTempId,
          $wf: {
            template: {
              name: "Unittest"
            }
          },
          $events: [
            {
              id: "DIALOG"
            },
            {
              id: "GOTO"
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
    it("finish workflow 'Workflow Unittest'", function (done) {
      expect(function () {
        test.Utils.getWorkflow(wfInfo.flowId).then(function success1(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(wfInfo.flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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