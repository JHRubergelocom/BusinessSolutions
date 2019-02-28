
describe("[function] sol.common.ix.functions.Subscription", function () {
  var originalTimeout, objSubscriptionId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Subscription").then(function success(objSubscriptionId1) {
        objSubscriptionId = objSubscriptionId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'objId' ", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Subscription", {
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
  describe("test cases subscription", function () {
    it("should not throw if executed with 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Subscription", {
          objId: objSubscriptionId
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
    it("subscribe", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Subscription", {
          objId: objSubscriptionId,
          subscribe: true
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
    it("unsubscribe", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Subscription", {
          objId: objSubscriptionId,
          subscribe: false
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
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
});