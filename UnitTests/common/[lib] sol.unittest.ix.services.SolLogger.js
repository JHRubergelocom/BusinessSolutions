
describe("[lib] sol.unittest.ix.services.SolLogger", function () {
  var originalTimeout, msg, obj, func, funct, ex, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolLogger").then(function success(obSolLoggerId) {
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
    describe("sol.Logger", function () {
      it("debug", function (done) {
        expect(function () {
          msg = "message";
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "debug",
            params: [msg, obj]
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
      it("doTiming", function (done) {
        expect(function () {
          func = "funnc";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "doTiming",
            params: [func]
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
      it("enter", function (done) {
        expect(function () {
          funct = "func";
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "enter",
            params: [funct, obj]
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
      it("error", function (done) {
        expect(function () {
          msg = "message";
          ex = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "error",
            params: [msg, ex]
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
      it("exit", function (done) {
        expect(function () {
          funct = "funct";
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "exit",
            params: [funct, obj]
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
      it("format", function (done) {
        expect(function () {
          msg = "message";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "format",
            params: [msg]
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
      it("info", function (done) {
        expect(function () {
          msg = "message";
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "info",
            params: [msg, obj]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
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
      it("noop", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "noop",
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
      it("stringify", function (done) {
        expect(function () {
          obj = { key: "value" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "stringify",
            params: [obj]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("{\"key\":\"value\"}");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("warn", function (done) {
        expect(function () {
          msg = "message";
          ex = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.Logger",
            classConfig: {},
            method: "warn",
            params: [msg, ex]
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