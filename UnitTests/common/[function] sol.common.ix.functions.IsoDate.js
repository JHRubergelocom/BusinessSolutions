
describe("[function] sol.common.ix.functions.IsoDate", function () {
  var originalTimeout, objIsoDateId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("IsoDate").then(function success(objIsoDateId1) {
        objIsoDateId = objIsoDateId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'objId' and 'group'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_IsoDate", {
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
  it("should throw if executed without 'group'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_IsoDate", {
        objId: objIsoDateId
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
  describe("test cases isodate", function () {
    it("simpledateformat", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_IsoDate", {
          objId: objIsoDateId,
          group: "UNITTEST_FIELD1"
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
    it("simpledateformat withouttime", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_IsoDate", {
          objId: objIsoDateId,
          group: "UNITTEST_FIELD2",
          withoutTime: true
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