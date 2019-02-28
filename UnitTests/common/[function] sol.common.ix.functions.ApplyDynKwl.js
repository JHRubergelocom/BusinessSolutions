
describe("[function] sol.common.ix.functions.ApplyDynKwl", function () {
  var originalTimeout, objApplyDynKwl2Id;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objApplyDynKwl1", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objApplyDynKwl1Id1) {
        test.Utils.createTempSord("objApplyDynKwl2", { UNITTEST_STATUS3: "XX", UNITTEST_STATUS4: "14" }).then(function success1(objApplyDynKwl2Id1) {
          objApplyDynKwl2Id = objApplyDynKwl2Id1;
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
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_ApplyDynKwl", {
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
  it("should throw if executed without 'lookupFields'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_ApplyDynKwl", {
        objId: objApplyDynKwl2Id
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
  describe("test applydynkwl", function () {
    it("applydynkwl", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_ApplyDynKwl", {
          objId: objApplyDynKwl2Id,
          lookupFields: ["UNITTEST_STATUS4"]
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