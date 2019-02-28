
describe("[function] sol.common.ix.functions.CheckMandatoryFields", function () {
  var originalTimeout, objId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      objId = test.Utils.createTempSord("CheckMandatoryFields", {
        UNITTEST_FIELD1: "Nils",
        UNITTEST_FIELD2: "Armstrong"
      }).then(function success(objId1) {
        objId = objId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'objId' and 'mandatory'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
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
  it("should throw if executed without 'mandatory'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
        objId: objId
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
  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
        mandatory: [{ key: "UNITTEST_FIELD1", type: "GRP" }]
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
  describe("test cases check mandatory fields", function () {
    it("UNITTEST_FIELD1, UNITTEST_FIELD2 defined should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "UNITTEST_FIELD1", type: "GRP" }, { key: "UNITTEST_FIELD2", type: "GRP" }]
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
    it("UNITTEST_REFERENCE, not defined should throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "UNITTEST_REFERENCE", type: "GRP" }]
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
    it("sord.name, defined should not throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "name", type: "SORD" }]
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
    it("sord.xyz, not defined should throw", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_CheckMandatoryFields", {
          objId: objId,
          mandatory: [{ key: "xyz", type: "SORD" }]
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