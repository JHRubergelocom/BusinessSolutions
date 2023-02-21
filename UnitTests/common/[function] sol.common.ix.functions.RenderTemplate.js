
describe("[function] sol.common.ix.functions.RenderTemplate", function () {
  var originalTimeout, config, objRenderTemplateId,
      flowId, succNodes, succNodesIds,
      templateFields, templatingData, targetBlob, clips, sordNames,
      paths, optional, search, field, fields, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RenderTemplate").then(function success(objRenderTemplateId1) {
        objRenderTemplateId = objRenderTemplateId1;
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
    describe("sol.common.ix.functions.RenderTemplate", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objRenderTemplateId).then(function success(flowId1) {
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
      it("get Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success(workflow) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addRedactorTemplates", function (done) {
        expect(function () {
          templateFields = [];
          templatingData = {};
          targetBlob = {};
          clips = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "addRedactorTemplates",
            params: [templateFields, templatingData, targetBlob, clips]
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
      it("addSordsToTemplatingData", function (done) {
        expect(function () {
          templatingData = {};
          sordNames = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "addSordsToTemplatingData",
            params: [templatingData, sordNames]
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
      it("checkSordValues", function (done) {
        expect(function () {
          sord = {};
          paths = [];
          optional = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "checkSordValues",
            params: [sord, paths, optional]
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
      it("finalizeSearchValues", function (done) {
        expect(function () {
          search = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "finalizeSearchValues",
            params: [search]
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
      it("getObjIdOf", function (done) {
        expect(function () {
          config = { const: { checkSordValues: [] }, search: [{ key: "UNITTEST_FIELD1", value: "Unittest" }], masks: [""] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "getObjIdOf",
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
      it("getTplPath", function (done) {
        expect(function () {
          field = "field1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "getTplPath",
            params: [field]
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
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [{ type: "SORD", key: "desc", rerenderValue: true }], searches: {}, redactor: { storeInBlob: {}, clips: [] } },
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
      it("renderTemplateFields", function (done) {
        expect(function () {
          fields = [];
          templatingData = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "renderTemplateFields",
            params: [fields, templatingData]
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
      it("renderValue", function (done) {
        expect(function () {
          field = "field1";
          templatingData = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "renderValue",
            params: [field, templatingData]
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
      it("shouldRerenderValue", function (done) {
        expect(function () {
          field = "field1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.RenderTemplate",
            classConfig: { objId: objRenderTemplateId, flowId: flowId, templateFields: [], searches: {}, redactor: {} },
            method: "shouldRerenderValue",
            params: [field]
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
            succNodes = test.Utils.getSuccessorNodes(workflow1, "1", null, "node 2");
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