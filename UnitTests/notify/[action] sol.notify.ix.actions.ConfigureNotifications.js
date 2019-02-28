
describe("[action] sol.notify.ix.actions.ConfigureNotifications", function () {
  var resultInfo, originalTimeout;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("test configurenotifications", function () {
    it("start execution ", function (done) {
      expect(function () {
        resultInfo = {};
        test.Utils.executeIxActionHandler("RF_sol_notify_action_ConfigureNotifications", {}, []).then(function success(jsonResults) {
          test.Utils.handleAllEvents(jsonResults).then(function success1(resultInfo1) {
            resultInfo = resultInfo1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("resultInfo.title must be available", function () {
      expect(resultInfo.title).toBeDefined();
    });
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});