
describe("[service] sol.common.ix.services.GetBusinessSolutionConfigs", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_GetBusinessSolutionConfigs", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetBusinessSolutionConfigs", {
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
      it("result should return configs", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetBusinessSolutionConfigs", {
            objId: "1"
          }).then(function success(result) {
            expect(result.configs[0]).toBeDefined();
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