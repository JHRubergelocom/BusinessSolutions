
describe("[service] sol.common.ix.services.ScriptVersionReportValidate", function () {
  var originalTimeout, arcPath, jsonScriptVersionList, docs;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.ScriptVersionReportValidate", function () {
      it("getWorkVersion", function (done) {
        expect(function () {
          docs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportValidate",
            classConfig: { jsonScriptVersionList: [] },
            method: "getWorkVersion",
            params: [docs]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportValidate",
            classConfig: { jsonScriptVersionList: [] },
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportValidate",
            classConfig: { jsonScriptVersionList: [] },
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
    });
  });
  describe("test scriptversionreportvalidate", function () {
    it("should throw if executed without 'jsonScriptVersionList'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ScriptVersionReportValidate", {
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
    it("scriptversionreportcreate should return defined result", function (done) {
      expect(function () {
        arcPath = "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]";
        test.Utils.execute("RF_sol_common_service_ScriptVersionReportCreate", {
          arcPath: arcPath
        }).then(function success(jsonScriptVersionList1) {
          jsonScriptVersionList = jsonScriptVersionList1;
          expect(jsonScriptVersionList).toBeDefined();
          expect(jsonScriptVersionList).not.toBeNull();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("scriptversionreportvalidate should return defined result", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ScriptVersionReportValidate", {
          jsonScriptVersionList: jsonScriptVersionList
        }).then(function success(jsonConfig) {
          expect(jsonConfig).toBeDefined();
          expect(jsonConfig).not.toBeNull();
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});