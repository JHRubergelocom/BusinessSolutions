
describe("[function] sol.common.ix.functions.Status", function () {
  var originalTimeout, objStatusId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Status").then(function success(objStatusId1) {
        objStatusId = objStatusId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'objId' and 'group' and 'status'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Status", {
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
  it("should throw if executed without 'group' and 'status'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Status", {
        objId: objStatusId
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
  it("should throw if executed without 'status'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Status", {
        objId: objStatusId,
        group: "UNITTEST_STATUS1"
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
  it("should not throw if executed with 'objId' and 'group' and 'status'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_Status", {
        objId: objStatusId,
        group: "UNITTEST_STATUS1",
        status: "1"
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
  describe("test cases status", function () {
    it("set status1 to 1", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS1",
          status: "1"
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
    it("objValue 'UNITTEST_STATUS1' should be equal to '1'", function (done) {
      test.Utils.getSord(objStatusId).then(function success(sordStatus) {
        expect(test.Utils.getObjKeyValue(sordStatus, "UNITTEST_STATUS1")).toEqual("1");
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    });
    it("set status2 to 3 with Kwl", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Status", {
          objId: objStatusId,
          group: "UNITTEST_STATUS2",
          status: "3",
          useKwl: true
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
    it("objValue 'UNITTEST_STATUS2' should be equal to '3 Zustand'", function (done) {
      test.Utils.getSord(objStatusId).then(function success(sordStatus) {
        expect(test.Utils.getObjKeyValue(sordStatus, "UNITTEST_STATUS2")).toEqual("3 Zustand");
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
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