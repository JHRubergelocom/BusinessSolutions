
describe("[service] sol.common.ix.services.ActionDefinitionCollector", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("test ActionDefinitionCollector", function () {
    it("ActionDefinitionCollector", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_services_ActionDefinitionCollector", {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});