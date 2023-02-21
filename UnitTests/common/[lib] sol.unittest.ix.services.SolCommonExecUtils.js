/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonExecUtils", function () {
  var originalTimeout, timeZoneString, conn, path, args, params, config,
      cn;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonExecUtils").then(function success(obSolCommonExecUtilsId) {
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
    describe("sol.common.ExecUtils", function () {
      it("classExists", function (done) {
        expect(function () {
          cn = "cn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "classExists",
            params: [cn]
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
      it("getJavaMainVersionNumber", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getJavaMainVersionNumber",
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
      it("getJavaTimeZoneOffsetString", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getJavaTimeZoneOffsetString",
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
      it("getJavaTimeZoneString", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getJavaTimeZoneString",
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
      it("getJavaVersion", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getJavaVersion",
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
      it("getProgramFilesDir", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getProgramFilesDir",
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
      it("getProgramFilesX86Dir", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getProgramFilesX86Dir",
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
      it("getTimeZoneOffsetString", function (done) {
        expect(function () {
          timeZoneString = "UTC";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getTimeZoneOffsetString",
            params: [timeZoneString]
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
      it("getUserProfileDir", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "getUserProfileDir",
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
      it("insideTomcat", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "insideTomcat",
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
      it("logJarFilePath", function (done) {
        expect(function () {
          cn = "cn1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "logJarFilePath",
            params: [cn]
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
      it("logSystemInfo", function (done) {
        expect(function () {
          conn = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "logSystemInfo",
            params: [conn]
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
      it("open", function (done) {
        expect(function () {
          path = "text.txt";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "open",
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
      it("runBatchFileInWindow", function (done) {
        expect(function () {
          args = ["echo"];
          params = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "runBatchFileInWindow",
            params: [args, params]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("startProcess", function (done) {
        expect(function () {
          args = ["echo"];
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ExecUtils",
            classConfig: {},
            method: "startProcess",
            params: [args, config]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
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