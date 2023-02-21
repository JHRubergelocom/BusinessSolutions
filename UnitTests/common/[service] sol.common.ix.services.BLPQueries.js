
describe("[service] sol.common.ix.services.BLPQueries", function () {
  var originalTimeout, serverUrl, appToken, url, m1, data, projectId;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.BLPQueries", function () {
      it("getBLPQueries", function (done) {
        expect(function () {
          serverUrl = "";
          appToken = "";
          projectId = "X99";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.BLPQueries",
            classConfig: { serverUrl: "", appToken: "", projectId: "X99" },
            method: "getBLPQueries",
            params: [serverUrl, appToken, projectId]
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
            className: "sol.common.ix.services.BLPQueries",
            classConfig: { serverUrl: "", appToken: "", projectId: "X99" },
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
      it("sendBLPRequest", function (done) {
        expect(function () {
          url = "";
          appToken = "";
          m1 = "";
          data = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.BLPQueries",
            classConfig: { serverUrl: "", appToken: "", projectId: "X99" },
            method: "sendBLPRequest",
            params: [url, appToken, m1, data]
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
  describe("test BLPQueries", function () {
    it("BLPQueries", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_BLPQueries", {
          serverUrl: "", 
          appToken: "",
          projectId: "X99"
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
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});