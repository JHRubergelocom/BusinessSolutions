
describe("[service] sol.common.ix.services.Encrypt", function () {
  var originalTimeout, text, config;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    text = "Dies ist ein Text";
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ix.services.Encrypt", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.Encrypt",
            classConfig: { text: text },
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
      it("encrypt", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.Encrypt",
            classConfig: { text: text },
            method: "encrypt",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_services_Encrypt", function () {
      it("should throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_Encrypt", {
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
      it("encrypt text", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_Encrypt", {
            text: text
          }).then(function success(jsonResult) {
            expect(jsonResult.encrypted).toBeDefined();
            expect(jsonResult.encrypted).toEqual("185-106-46-93-233-36-251-195-206-98-247-59-215-247-166-116-83-51-36-94-29-49-2-148");
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});