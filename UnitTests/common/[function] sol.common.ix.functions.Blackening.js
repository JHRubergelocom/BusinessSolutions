
describe("[function] sol.common.ix.functions.Blackening", function () {
  var originalTimeout, objBlackeningId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Blackening/Blackening").then(function success(objBlackeningId1) {
        if (objBlackeningId1) {
          objBlackeningId = objBlackeningId1.id;
        }
        done();
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
      test.Utils.execute("RF_sol_function_Blackening", {
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
  describe("test cases blackening", function () {
    it("objBlackeningId must exist", function () {
      expect(objBlackeningId).toBeDefined();
    });
    it("simple blackening", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Blackening", {
          objId: objBlackeningId,
          force: true
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});