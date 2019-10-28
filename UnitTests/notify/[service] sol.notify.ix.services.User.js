
describe("[service] sol.notify.ix.services.User", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_notify_service_GetUsers", function () {
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_notify_service_GetUsers", {
          }).then(function success(result) {
            expect(result.data.length).toBeDefined();
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