
describe("[libix] sol.unittest.ix.services.SolDevActionUtils", function () {
  var obSolDevActionUtilsId, obSolDevActionUtilsId2, UnittestImportWF, originalTimeout, wfName, templateId,
      tempSord, sordf, sord, type, oldDocuments, objId, folder, mode, references,
      objSord, wftemplate, parentId, folderId, ext, obj1, obj2, targetId, classLogger, classObjId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDevActionUtils").then(function success(obSolDevActionUtilsId1) {
        obSolDevActionUtilsId = obSolDevActionUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/UnittestImportWF").then(function success1(UnittestImportWF1) {
          UnittestImportWF = UnittestImportWF1;
          test.Utils.createTempSord("SolDevActionUtils2").then(function success2(obSolDevActionUtilsId21) {
            obSolDevActionUtilsId2 = obSolDevActionUtilsId21;
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
  describe("Test Lib Functions", function () {
    describe("sol.dev.ix.ActionUtils", function () {
      it("createWorkflowName", function (done) {
        expect(function () {
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "createWorkflowName",
            params: [wfName]
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
      it("createWorkflowTemplate", function (done) {
        expect(function () {
          wfName = "wfName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "createWorkflowTemplate",
            params: [wfName]
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
      it("existPathFullNameSpace", function (done) {
        expect(function () {
          templateId = "1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "existPathFullNameSpace",
            params: [templateId]
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
      it("existWorkflowTemplate", function (done) {
        expect(function () {
          wfName = "UnittestStandardWF";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "existWorkflowTemplate",
            params: [wfName]
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
      it("generateDocumentContent", function (done) {
        expect(function () {
          tempSord = {};
          sordf = {};
          type = "type1";
          oldDocuments = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "generateDocumentContent",
            params: [tempSord, sordf, type, oldDocuments]
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
      it("generateEntry", function (done) {
        expect(function () {
          objId = obSolDevActionUtilsId;
          tempSord = {};
          folder = "";
          mode = "mode1";
          type = "type1";
          references = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: { objId: obSolDevActionUtilsId },
            method: "generateEntry",
            params: [objId, tempSord, folder, mode, type, references]
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
      it("generateReferences", function (done) {
        expect(function () {
          objSord = {};
          references = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "generateReferences",
            params: [objSord, references]
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
      it("generateSordNameDesc", function (done) {
        expect(function () {
          tempSord = {};
          sordf = obSolDevActionUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "generateSordNameDesc",
            params: [tempSord, sordf]
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
      it("generateWfTemplate", function (done) {
        expect(function () {
          tempSord = {};
          wftemplate = {};
          type = "type1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "generateWfTemplate",
            params: [tempSord, wftemplate, type]
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
      it("getOldDocuments", function (done) {
        expect(function () {
          objId = obSolDevActionUtilsId;
          folder = {};
          type = "type1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: { objId: obSolDevActionUtilsId },
            method: "getOldDocuments",
            params: [objId, folder, type]
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
      it("getRelPath", function (done) {
        expect(function () {
          parentId = 1;
          folderId = obSolDevActionUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "getRelPath",
            params: [parentId, folderId]
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
      it("getSolutionSord", function (done) {
        expect(function () {
          objSord = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "getSolutionSord",
            params: [objSord]
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
      it("getSubFolderId", function (done) {
        expect(function () {
          parentId = "1";
          folder = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "getSubFolderId",
            params: [parentId, folder]
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
      it("getcomponentSord", function (done) {
        expect(function () {
          objId = obSolDevActionUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "getcomponentSord",
            params: [objId]
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
      it("importWorkflow", function (done) {
        expect(function () {
          sordf = UnittestImportWF.id;
          wfName = UnittestImportWF.name;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "importWorkflow",
            params: [sordf, wfName]
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
      it("isJsonConfig", function (done) {
        expect(function () {
          sord = UnittestImportWF.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "isJsonConfig",
            params: [sord]
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
      it("isOfficeDocument", function (done) {
        expect(function () {
          ext = "doc";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "isOfficeDocument",
            params: [ext]
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
      it("loadConfigDev", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "loadConfigDev",
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
      it("loadConfigDevInternal", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "loadConfigDevInternal",
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
      it("loadTemplateConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: { objId: obSolDevActionUtilsId },
            method: "loadTemplateConfig",
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
      it("mergeRecursive", function (done) {
        expect(function () {
          obj1 = { val1: "1", val2: "2" };
          obj2 = { val2: "21", val3: "31", val4: { x1: "x1" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "mergeRecursive",
            params: [obj1, obj2]
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
      it("moveSord", function (done) {
        expect(function () {
          objId = obSolDevActionUtilsId2;
          targetId = obSolDevActionUtilsId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "moveSord",
            params: [objId, targetId]
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
      it("processComponent", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "processComponent",
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
      it("processOldDocuments", function (done) {
        expect(function () {
          oldDocuments = [];
          folderId = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "processOldDocuments",
            params: [oldDocuments, folderId]
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
      it("setLogger", function (done) {
        expect(function () {
          classLogger = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "setLogger",
            params: [classLogger]
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
      it("setObjId", function (done) {
        expect(function () {
          classObjId = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "setObjId",
            params: [classObjId]
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
      it("startCreateActionWorkflow", function (done) {
        expect(function () {
          objId = "objId1";
          wfName = "wfNane1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.dev.ix.ActionUtils",
            classConfig: {},
            method: "startCreateActionWorkflow",
            params: [objId, wfName]
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