
describe("[lib] sol.unittest.ix.services.SolHrShared", function () {
  var SharedSord, userName, userInfo, originalTimeout, objId, flowId, asAdmin,
      templateFolders, contextSoltype, opts, workflowOpts, dataSourceAsAdm,
      targetId, targetMask, shortDescription, typeName, classContext, folders, term, lang,
      obSolHrSharedId, workflow, succNodes, succNodesIds, contextTypes;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolHrShared").then(function success(obSolHrSharedId1) {
        obSolHrSharedId = obSolHrSharedId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/hr [unit tests]/Resources/Shared").then(function success1(SharedSord1) {
          SharedSord = SharedSord1;
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
  describe("Test Lib Functions", function () {
    describe("sol.hr.shared", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolHrSharedId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSordData", function (done) {
        expect(function () {
          objId = SharedSord.id;
          flowId = flowId;
          asAdmin = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "getSordData",
            params: [objId, flowId, asAdmin]
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
      it("getTemplateFoldersAsWrappedSords", function (done) {
        expect(function () {
          templateFolders = [String(SharedSord.id)];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "getTemplateFoldersAsWrappedSords",
            params: [templateFolders]
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
      it("get contextTypes from hr.orgchart.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr_orgchart/Configuration/hr.orgchart.config"
          }).then(function success(configResult) {
            contextTypes = configResult.config.entities.chartelement.services.chartroottypes.contextTypes;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTypesByContext", function (done) {
        expect(function () {
          contextSoltype = "ORGCHART_COMPANY";
          opts = contextTypes;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "getTypesByContext",
            params: [contextSoltype, opts]
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
      it("inheritData", function (done) {
        expect(function () {
          opts = {};
          workflowOpts = {};
          dataSourceAsAdm = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "inheritData",
            params: [opts, workflowOpts, dataSourceAsAdm]
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
      it("prepareFolder", function (done) {
        expect(function () {
          targetId = obSolHrSharedId;
          targetMask = "UnitTest";
          shortDescription = "shortDescription";
          typeName = "Folder";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "prepareFolder",
            params: [targetId, targetMask, shortDescription, typeName]
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
      it("prepareFolderViaTemplate", function (done) {
        expect(function () {
          opts = { target: obSolHrSharedId };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "prepareFolderViaTemplate",
            params: [opts]
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
      it("startWorkflowAndEvents", function (done) {
        expect(function () {
          classContext = "classContext";
          objId = obSolHrSharedId;
          opts = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "startWorkflowAndEvents",
            params: [classContext, objId, opts]
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
      it("templateFoldersToTypes", function (done) {
        expect(function () {
          folders = [String(SharedSord.id)];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "templateFoldersToTypes",
            params: [folders]
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
        expect(function () {
          term = "sol.hr.client.solution.name";
          lang = "de";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.shared.Utils",
            classConfig: {},
            method: "translate",
            params: [term, lang]
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            workflow = workflow1;
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