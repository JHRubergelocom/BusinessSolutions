
describe("[lib] sol.unittest.ix.services.SolCommonInjection", function () {
  var InjectionSord, originalTimeout, obj, objId, flowId,
      asAdmin, formBlobs, log, any, classContext, injectId, json, configName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonInjection").then(function success(obSolCommonInjectionId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Injection").then(function success1(InjectionSord1) {
          InjectionSord = InjectionSord1;
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
    describe("sol.common.Injection", function () {
      it("copyConfig", function (done) {
        expect(function () {
          obj = { aa: "bb" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "copyConfig",
            params: [obj]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ aa: "bb" });
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
          objId = InjectionSord.id;
          flowId = null;
          asAdmin = true;
          formBlobs = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "getSordData",
            params: [objId, flowId, asAdmin, formBlobs]
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
      it("ifLog", function (done) {
        expect(function () {
          log = true;
          any = "Test";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "ifLog",
            params: [log, any]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(any);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ifLog", function (done) {
        expect(function () {
          log = false;
          any = "Test";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "ifLog",
            params: [log, any]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("N/A");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("initConfig", function (done) {
        expect(function () {
          configName = "as";
          classContext = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "initConfig",
            params: [configName, classContext]
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
      it("inject", function (done) {
        expect(function () {
          classContext = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "inject",
            params: [classContext]
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

      xit("injectConfig", function (done) {
        expect(function () {
          config = PVALUE;
          injectId = PVALUE;
          classContext = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "injectConfig",
            params: [config, injectId, classContext]
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
      xit("injectConfigProperty", function (done) {
        expect(function () {
          config = PVALUE;
          classContext = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "injectConfigProperty",
            params: [config, classContext]
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
      xit("injectFromThis", function (done) {
        expect(function () {
          prop = PVALUE;
          injectId = PVALUE;
          classContext = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "injectFromThis",
            params: [prop, injectId, classContext]
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

      xit("injectJSON", function (done) {
        expect(function () {
          json = {};
          injectId = "";
          classContext = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "injectJSON",
            params: [json, injectId, classContext]
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
      xit("injectSordById", function (done) {
        expect(function () {
          objId = InjectionSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "injectSordById",
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

      xit("performInjection", function (done) {
        expect(function () {
          injection = PVALUE;
          injectionId = PVALUE;
          classContext = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Injection",
            classConfig: {},
            method: "performInjection",
            params: [injection, injectionId, classContext]
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