
describe("[function] sol.common.ix.functions.Notify", function () {
  var originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  it("should not throw if executed without parameters", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Notify", {
      }).then(function success(jsonResult) {
        done();
      }, function error(err) {
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("Notification type. Default is 'e-mail'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Notify", {
        objId: "ARCPATH:/Administration/Business Solutions/dev_internal/Notify",
        mode: "run",
        from: "test-business-solutions@elo.local",
        to: {
          type: "CURRENT"
        },
        subject: "Neue Aufgabe",
        body: {
          type: "html",
          tplObjId: "ARCPATH:/Administration/Business Solutions/development/Configuration/Mail templates/Notification"
        }
      }).then(function success(jsonResult) {
        done();
      }, function error(err) {
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});