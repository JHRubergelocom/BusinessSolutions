
describe("[function] sol.common.ix.functions.CreateSord", function () {
  var originalTimeout, parentId,
      flowId, succNodes, succNodesIds,
      cfg, element, rights, src, tgt,
      sord, colorName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateSord").then(function success(parentId1) {
        parentId = parentId1;
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
    describe("sol.common.ix.functions.CreateSord", function () {
      it("copyElement", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "copyElement",
            params: [cfg]
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
      it("createSordFromScratch", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "createSordFromScratch",
            params: [cfg]
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
      it("finalizeCreatedElement", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "finalizeCreatedElement",
            params: [cfg]
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
      it("getServiceResult", function (done) {
        expect(function () {
          element = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "getServiceResult",
            params: [element]
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
      it("getTargetForCreatedSord", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "getTargetForCreatedSord",
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
      it("moveElement", function (done) {
        expect(function () {
          rights = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "moveElement",
            params: [rights]
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
      it("prepareSourceElement", function (done) {
        expect(function () {
          src = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "prepareSourceElement",
            params: [src]
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
      it("prepareTargetFolder", function (done) {
        expect(function () {
          tgt = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "prepareTargetFolder",
            params: [tgt]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
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
      it("setElementPermissions", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "setElementPermissions",
            params: [cfg]
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
      it("startWorkflowOnElement", function (done) {
        expect(function () {
          cfg = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "startWorkflowOnElement",
            params: [cfg]
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
      it("useColor", function (done) {
        expect(function () {
          sord = {};
          colorName = "GUID_BLUE";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.CreateSord",
            classConfig: {},
            method: "useColor",
            params: [sord, colorName]
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
  describe("test cases create sord", function () {
    it("should throw if executed without Parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
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
    it("Creating a sord using a template", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
          sourceElement: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/GetTemplates/Template 1" },
          targetFolder: { objId: parentId },
          onCreatedElement: {}
        }).then(function success(jsonResult) {
          expect(jsonResult.objId).toBeDefined();
          done();
        }, function error(err) {
          // fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Optionally, the templates permissions (acl) can be applied to the created sord", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
          sourceElement: { objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/GetTemplates/Template 1" },
          options: { copySourceAcl: true },
          targetFolder: { objId: parentId },
          onCreatedElement: {}
        }).then(function success(jsonResult) {
          expect(jsonResult.objId).toBeDefined();
          done();
        }, function error(err) {
          // fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Creating a sord from scratch", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
          sourceElement: { fromScratch: { mask: "Basic Entry" } },
          options: { copySourceAcl: true },
          targetFolder: { objId: parentId },
          onCreatedElement: {}
        }).then(function success(jsonResult) {
          expect(jsonResult.objId).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Retrieving an objId from a service", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
          sourceElement: { fromService: { name: "RF_sol_common_functions_CreateFromTemplate", params: { templateString: "The first with string {{testcase}} generates {{result}}",
            data: { testcase: "TestA", result: "ResultA" },
            saveToRepoConfig: { parentId: parentId, name: "SordA" } } } },
          options: { copySourceAcl: true },
          targetFolder: { objId: parentId },
          onCreatedElement: {}
        }).then(function success(jsonResult) {
          expect(jsonResult.objId).toBeDefined();
          done();
        }, function error(err) {
          // fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("Starting a workflow", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CreateSord", {
          sourceElement: { fromScratch: { mask: "Basic Entry" } },
          targetFolder: { objId: parentId },
          onCreatedElement: { setName: "Unittest", startWorkflow: { name: "Unittest", title: "A workflow title" } }
        }).then(function success(jsonResult) {
          expect(jsonResult.objId).toBeDefined();
          expect(jsonResult.flowId).toBeDefined();
          flowId = jsonResult.flowId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("finish workflow 'Workflow Unittest ", function (done) {
      expect(function () {
        test.Utils.getWorkflow(flowId).then(function success1(workflow) {
          succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
          succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
          test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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
      test.Utils.getFinishedWorkflows().then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
          test.Utils.getTempfolder().then(function success2(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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