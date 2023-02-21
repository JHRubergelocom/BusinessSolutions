
describe("[service] sol.common.ix.services.BLPProjects", function () {
  var originalTimeout, serverUrl, appToken, url, m1, data;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.BLPProjects", function () {
      it("getBLPProjects", function (done) {
        expect(function () {
          serverUrl = "";
          appToken = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.BLPProjects",
            classConfig: { serverUrl: "", appToken: "" },
            method: "getBLPProjects",
            params: [serverUrl, appToken]
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
            className: "sol.common.ix.services.BLPProjects",
            classConfig: { serverUrl: "", appToken: "" },
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
            className: "sol.common.ix.services.BLPProjects",
            classConfig: { serverUrl: "", appToken: "" },
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
  describe("test BLPProjects", function () {
    it("BLPProjects", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_BLPProjects", {
          serverUrl: "", 
          appToken: ""
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