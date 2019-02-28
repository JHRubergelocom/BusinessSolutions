
describe("[function] sol.common.ix.functions.UserToIndex", function () {
  var originalTimeout, obUserToIndexId, field1;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UserToIndex").then(function success(obUserToIndexId1) {
        obUserToIndexId = obUserToIndexId1;
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
      test.Utils.execute("RF_sol_function_UserToIndex", {
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
  it("UserToIndex(obUserToIndexId1, fieldName: 'UNITTEST_FIELD1', clear: true)", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_UserToIndex", {
        objId: obUserToIndexId,
        fieldName: "UNITTEST_FIELD1",
        clear: true
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
  it("objValue 'UNITTEST_FIELD1' should be null", function (done) {
    expect(function () {
      test.Utils.getSord(obUserToIndexId).then(function success(sordUserToIndex) {
        field1 = test.Utils.getObjKeyValue(sordUserToIndex, "UNITTEST_FIELD1");
        expect(field1).toBeNull();
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
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