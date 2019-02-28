
describe("[function] sol.common.ix.functions.CheckSolutionEnabled", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckSolutionEnabled").then(function success(objId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'solution'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_function_CheckSolutionEnabled", {
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
  describe("test cases check solution", function () {
    it("solution 'common' should return 'true'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_CheckSolutionEnabled", {
          solution: "common"
        }).then(function success(jsonResult) {
          expect(jsonResult.enabled).toBeDefined();
          expect(jsonResult.enabled).toEqual(true);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("solution 'test' should return 'false'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_CheckSolutionEnabled", {
          solution: "test"
        }).then(function success(jsonResult) {
          expect(jsonResult.enabled).toBeDefined();
          expect(jsonResult.enabled).toEqual(false);
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