
describe("[lib] sol.unittest.ix.services.SolCommonAsUtils", function () {
  var asConfig, originalTimeout, params,
      config, url, message, lines, asBaseUrl;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonAsUtils").then(function success(obSolCommonAsUtilsId) {
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
    describe("sol.common.AsUtils", function () {
      it("get asConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common/Configuration/as.config",
            forceReload: true
          }).then(function success(jsonConfig) {
            asConfig = jsonConfig;
            expect(jsonConfig.config).toBeDefined();
            expect(jsonConfig.config.protocol).toBeDefined();
            expect(jsonConfig.config.serverName).toBeDefined();
            expect(jsonConfig.config.port).toBeDefined();
            expect(jsonConfig.config.serviceName).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildAsUrl", function (done) {
        expect(function () {
          params = asConfig.config;
          params.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "buildAsUrl",
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
      it("callAs", function (done) {
        expect(function () {
          config = {
            ruleName: "sol.common.as.SendMail",
            cmd: "run",
            from: "test-business-solutions@elo.local",
            to: "test-business-solutions@elo.local",
            subject: "Unittest",
            body: "Unittest"
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "callAs",
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
      it("checkParams", function (done) {
        expect(function () {
          params = asConfig.config;
          params.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "checkParams",
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
      it("convertAsUrlToConfigObject", function (done) {
        expect(function () {
          url = "http://elosrv01:8080/as-archive";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "convertAsUrlToConfigObject",
            params: [url]
          }).then(function success(jsonResult) {
            expect(jsonResult.protocol).toEqual("http");
            expect(jsonResult.serverName).toEqual("elosrv01");
            expect(jsonResult.port).toEqual("8080");
            expect(jsonResult.serviceName).toEqual("as-archive");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("formatErrorMessage", function (done) {
        expect(function () {
          message = "Nachricht";
          lines = ["Zeile1", "Zeile2", "Zeile3"];
          params = { format: "JC" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "formatErrorMessage",
            params: [message, lines, params]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("<h3>Nachricht</h3>Zeile1<br>Zeile2<br>Zeile3<br>");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getAsUrl", function (done) {
        expect(function () {
          config = { ruleName: "sol.common.as.SendMail" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "getAsUrl",
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
      it("guessAsBaseUrl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "guessAsBaseUrl",
            params: []
          }).then(function success(jsonResult) {
            asBaseUrl = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("obfuscateTicket", function (done) {
        expect(function () {
          config = asConfig.config;
          config.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "obfuscateTicket",
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
      it("prepareParam2", function (done) {
        expect(function () {
          params = asConfig.config;
          params.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "prepareParam2",
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
      it("prepareParameter", function (done) {
        expect(function () {
          params = asConfig.config;
          params.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "prepareParameter",
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
      it("prepareUrlParams", function (done) {
        expect(function () {
          params = asConfig.config;
          params.ruleName = "sol.common.as.SendMail";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "prepareUrlParams",
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
      it("testAsBaseUrl", function (done) {
        expect(function () {
          url = asBaseUrl;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.AsUtils",
            classConfig: {},
            method: "testAsBaseUrl",
            params: [url]
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