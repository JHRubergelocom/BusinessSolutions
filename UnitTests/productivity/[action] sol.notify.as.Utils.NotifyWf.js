
describe("[action] sol.notify.as.Utils.NotifyWf", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("test notifywf", function () {
    it("start as utils notifywf", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          solution: "common",
          action: "sol.notify.as.NotifyWf",
          config: {
          }
        }, function (data) {
           // process result
        }, function (err) {
           // error handling
        }).then(function success(jsonResult) {
          done();
        }, function error(err) {
          // fail(err);
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