
describe("[function] sol.common.ix.functions.FillSord", function () {
  var originalTimeout, objFillSordId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FillSord").then(function success(objFillSordId1) {
        objFillSordId = objFillSordId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'source' ", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_FillSord", {
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
  it("should throw if executed without 'target'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_FillSord", {
        source: { objId: objFillSordId }
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
  describe("test cases fillsord", function () {
    it("should not throw if executed with 'source' and 'target'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_FillSord", {
          source: { objId: objFillSordId },
          target: { objId: objFillSordId }
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