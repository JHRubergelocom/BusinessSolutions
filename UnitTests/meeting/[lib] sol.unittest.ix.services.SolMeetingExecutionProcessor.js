
describe("[lib] sol.unittest.ix.services.SolMeetingExecutionProcessor", function () {
  var originalTimeout, config, cfg, callback, opts, args, templateData, functionName, s, o;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolmMetingUtils").then(function success(obSolMeetingExecutionProcessorId) {
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
    describe("sol.meeting.ix.ExecutionProcessor", function () {
      it("process", function (done) {
        expect(function () {
          config = { callback: { name: "RF_sol_unittest_meeting_service_Test" }, options: {} };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: { $templateData: {}, options: {} },
            method: "process",
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
      it("sanitizeConfig", function (done) {
        expect(function () {
          cfg = { callback: { name: "RF_sol_unittest_meeting_service_Test" }, options: {} };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: {},
            method: "sanitizeConfig",
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
      it("setupMapping", function (done) {
        expect(function () {
          config = { callback: { name: "RF_sol_unittest_meeting_service_Test" }, options: {} };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: {},
            method: "setupMapping",
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
      it("processExecutionStatement", function (done) {
        expect(function () {
          callback = { name: "RF_sol_unittest_meeting_service_Test" };
          opts = { dryRun: true };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: { $templateData: {}, options: { dryRun: true } },
            method: "processExecutionStatement",
            params: [callback, opts]
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
      it("prepareExecutionArgs", function (done) {
        expect(function () {
          args = {};
          templateData = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: { $templateData: {}, options: { dryRun: true } },
            method: "prepareExecutionArgs",
            params: [args, templateData]
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
      it("executeCallback", function (done) {
        expect(function () {
          functionName = {};
          args = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: {},
            method: "executeCallback",
            params: [functionName, args]
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
      it("validStr", function (done) {
        expect(function () {
          s = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: {},
            method: "validStr",
            params: [s]
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
      it("isObj", function (done) {
        expect(function () {
          o = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.ExecutionProcessor",
            classConfig: {},
            method: "isObj",
            params: [o]
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