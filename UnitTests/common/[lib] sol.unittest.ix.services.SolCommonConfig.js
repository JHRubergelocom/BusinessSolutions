
describe("[lib] sol.unittest.ix.services.SolCommonConfig", function () {
  var ConfigSord, originalTimeout, config, path, solution, force, objId, extended, arcPath;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonConfig").then(function success(obSolCommonConfigId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Config").then(function success1(ConfigSord1) {
          ConfigSord = ConfigSord1;
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
    describe("sol.common.Config", function () {
      it("getBasePaths", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "getBasePaths",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(["Business Solutions", "Business Solutions Custom"]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getCompose", function (done) {
        expect(function () {
          config = { load: ConfigSord.id };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "getCompose",
            params: [config]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("¶common [unit tests]¶Resources¶Config");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getObjId", function (done) {
        expect(function () {
          path = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Config";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "getObjId",
            params: [path]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
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
      it("isRemote", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "isRemote",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("loadEloAsConfig", function (done) {
        expect(function () {
          solution = "common";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "loadEloAsConfig",
            params: [solution]
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
      it("reload", function (done) {
        expect(function () {
          force = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: { compose: "/common [unit tests]/Resources/Config" },
            method: "reload",
            params: [force]
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
      it("reloadRemote", function (done) {
        expect(function () {
          force = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: { compose: "/common [unit tests]/Resources/Config" },
            method: "reloadRemote",
            params: [force]
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
      it("retrieveComposePath", function (done) {
        expect(function () {
          objId = ConfigSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "retrieveComposePath",
            params: [objId]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("¶common [unit tests]¶Resources¶Config");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("retrieveMergeHierarchy", function (done) {
        expect(function () {
          extended = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: { load: ConfigSord.id },
            method: "retrieveMergeHierarchy",
            params: [extended]
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
      it("save", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: { load: ConfigSord.id, writable: true },
            method: "save",
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
      it("saveNew", function (done) {
        expect(function () {
          arcPath = test.Utils.TESTTEMPFOLDER + "/myNewExampleConfig";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: { config: { exampleConfigProperty: "a String", anotherProperty: 4711 } },
            method: "saveNew",
            params: [arcPath, config]
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
      it("validForMergeing", function (done) {
        expect(function () {
          objId = ConfigSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Config",
            classConfig: {},
            method: "validForMergeing",
            params: [objId]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
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