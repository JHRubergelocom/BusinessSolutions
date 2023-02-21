
describe("[function] sol.meeting.ix.functions.ApplyRuleEngine", function () {
  var originalTimeout, rule, context, ruleKeys, sords, options,
      element, result, node, templateData, elementService,
      config, elementServiceCfg;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ApplyRuleEngine").then(function success(objTempId) {
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
    describe("sol.meeting.ix.functions.RuleEngineProcessor", function () {
      it("applyRule", function (done) {
        expect(function () {
          rule = { when: { searchParams: [] }, then: {} };
          context = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "applyRule",
            params: [rule, context]
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
      it("applyRules", function (done) {
        expect(function () {
          ruleKeys = [];
          context = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "applyRules",
            params: [ruleKeys, context]
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
      it("buildContextAndApplyRules", function (done) {
        expect(function () {
          sords = [];
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "buildContextAndApplyRules",
            params: [sords, options]
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
      it("createContext", function (done) {
        expect(function () {
          options = {};
          element = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "createContext",
            params: [options, element]
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
      it("createResultSet", function (done) {
        expect(function () {
          context = {};
          result = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "createResultSet",
            params: [context, result]
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
      it("execute", function (done) {
        expect(function () {
          node = { then: { callback: { name: "RF_sol_unittest_meeting_service_Test", args: {}, mapping: [{}] } }, options: {} };
          context = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "execute",
            params: [node, context]
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
      it("executeOnEmptyElements", function (done) {
        expect(function () {
          templateData = {};
          options = { onEmptyElements: { name: "RF_sol_unittest_meeting_service_Test", args: {} } };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "executeOnEmptyElements",
            params: [templateData, options]
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
      it("getExecutionProcessor", function (done) {
        expect(function () {
          context = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "getExecutionProcessor",
            params: [context]
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
      it("getSords", function (done) {
        expect(function () {
          elementService = null;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "getSords",
            params: [elementService]
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
      it("hasRules", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "hasRules",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
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
      it("performComparison", function (done) {
        expect(function () {
          rule = { when: { searchParams: [] }, then: {} };
          context = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "performComparison",
            params: [rule, context]
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
      it("performElementService", function (done) {
        expect(function () {
          elementServiceCfg = null;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "performElementService",
            params: [elementServiceCfg]
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
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
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
      it("shouldExecuteOnEmptyElement", function (done) {
        expect(function () {
          sords = [];
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.RuleEngineProcessor",
            classConfig: { ruleKeys: [] },
            method: "shouldExecuteOnEmptyElement",
            params: [sords, options]
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_function_ApplyRuleEngine", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_ApplyRuleEngine", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("apply rule engine", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_ApplyRuleEngine", {
            ruleKeys: []      
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