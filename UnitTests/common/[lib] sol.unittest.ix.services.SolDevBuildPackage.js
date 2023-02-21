/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolDevBuildPackage", function () {
  var BuildPackageSord, originalTimeout, aclItems,
      maskObj, arr, pluginName, id, startId, sord, config, maskName,
      workflowTemplateName, obSolDevBuildPackageId, forceMaskConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDevBuildPackage").then(function success(obSolDevBuildPackageId1) {
        obSolDevBuildPackageId = obSolDevBuildPackageId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(BuildPackageSord1) {
          BuildPackageSord = BuildPackageSord1;
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
    describe("sol.dev.BuildPackage", function () {
      it("adjustAcl", function (done) {
        expect(function () {
          aclItems = [{ name: "Administrator", id: 0 }, { name: "name2", id: 0 }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "adjustAcl",
            params: [aclItems]
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
      it("adjustMask", function (done) {
        expect(function () {
          maskObj = { aclItems: [{ name: "Administrator", id: 0 }, { name: "name2", id: 0 }], lines: [] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "adjustMask",
            params: [maskObj]
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
      it("clearIds", function (done) {
        expect(function () {
          arr = [{}, {}];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "clearIds",
            params: [arr]
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
      it("copyIxPlugins", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: {} },
            method: "copyIxPlugins",
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
      it("createManifestFile", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: { setupName: "setupName1" } },
            method: "createManifestFile",
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
      it("deleteLogFileSords", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: { packageName: "packageName1" }, eloInstRepoPath: 0 },
            method: "deleteLogFileSords",
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
      it("downloadIxPlugin", function (done) {
        expect(function () {
          pluginName = "private/activation.osgi-1.1.jar";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: {} },
            method: "downloadIxPlugin",
            params: [pluginName]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("downloadIxPlugins", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: { ixPlugins: ["private/activation.osgi-1.1.jar"] } },
            method: "downloadIxPlugins",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { objId: "ARCPATH:/Administration/Business Solutions/dev_internal", exportDirPath: "C:\\Temp" },
            method: "execute",
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
      it("forceMask", function (done) {
        expect(function () {
          forceMaskConfig = { findChildren: { objId: obSolDevBuildPackageId }, mask: "UnitTest" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "forceMask",
            params: [forceMaskConfig]
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
      it("getBuildConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "getBuildConfig",
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
      it("getUserName", function (done) {
        expect(function () {
          id = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: {},
            method: "getUserName",
            params: [id]
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
      it("prepareBranchForInstallExport", function (done) {
        expect(function () {
          startId = BuildPackageSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: {} },
            method: "prepareBranchForInstallExport",
            params: [startId]
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
      it("prepareSordForInstallExport", function (done) {
        expect(function () {
          sord = BuildPackageSord;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: {} },
            method: "prepareSordForInstallExport",
            params: [sord, config]
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
      it("processMaskExport", function (done) {
        expect(function () {
          maskName = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: { masksDirPath: "C:\\Temp" } },
            method: "processMaskExport",
            params: [maskName]
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
      it("processWorkflowTemplateExport", function (done) {
        expect(function () {
          workflowTemplateName = "Unittest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.BuildPackage",
            classConfig: { buildConfig: { workflowTemplatesDirPath: "C:\\Temp" } },
            method: "processWorkflowTemplateExport",
            params: [workflowTemplateName]
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