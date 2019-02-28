
describe("[service] sol.common.ix.services.ScriptVersionReportCreate", function () {
  var originalTimeout, arcPath;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
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
  describe("test scriptversionreportcreate", function () {
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