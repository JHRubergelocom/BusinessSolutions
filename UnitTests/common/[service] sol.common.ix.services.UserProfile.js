
describe("[service] sol.common.ix.services.UserProfile", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_services_ReadUserProfileOptions", function () {
      it("should not throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_ReadUserProfileOptions", {
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
      it("should return defined result", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_ReadUserProfileOptions", {
            keys: ["EloJ.S*"]
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
    describe("RF_sol_common_services_WriteUserProfileOptions", function () {
      it("should not throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_WriteUserProfileOptions", {
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
      it("should not throw if executed with parameter '{ options: { key1: 'value1', key2: 'value2' } }'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_WriteUserProfileOptions", {
            options: {
              key1: "value1",
              key2: "value2"
            }    
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