
describe("[service] sol.common.ix.services.ScriptVersionReportCreate", function () {
  var originalTimeout, arcPath, sordsSubEntry, docs, 
      timeDateJava, val, len;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.ScriptVersionReportCreate", function () {
      it("findFileInfo", function (done) {
        expect(function () {
          arcPath = "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]";
          sordsSubEntry = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
            method: "findFileInfo",
            params: [arcPath, sordsSubEntry]
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
      it("getWorkVersion", function (done) {
        expect(function () {
          docs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
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
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
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
      it("isoFromDate", function (done) {
        expect(function () {
          timeDateJava = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
            method: "isoFromDate",
            params: [timeDateJava]
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
      it("pad", function (done) {
        expect(function () {
          val = "*";
          len = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
            method: "pad",
            params: [val, len]
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
            className: "sol.common.ix.services.ScriptVersionReportCreate",
            classConfig: { arcPath: "ARCPATH[1]:\\Administration\\Business Solutions\\common [unit tests]" },
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
  describe("test scriptversionreportcreate", function () {
    it("should throw if executed without 'arcPath'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ScriptVersionReportCreate", {
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