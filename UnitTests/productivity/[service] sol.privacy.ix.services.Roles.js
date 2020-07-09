
describe("[service] sol.privacy.ix.services.Roles", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_privacy_service_Roles_CheckGdprRoles", function () {
      it("should not throw without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_Roles_CheckGdprRoles", {
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});