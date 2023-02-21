
describe("[service] sol.privacy.ix.services.ExtendedParentDataCollector", function () {
  var ProcessActivitySord, originalTimeout, data, objId,
      formatter, user, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.getSord("ARCPATH:/Administration/Business Solutions/productivity [unit tests]/Test data/ProcessActivity").then(function success(ProcessActivitySord1) {
        ProcessActivitySord = ProcessActivitySord1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.privacy.ix.services.ExtendedParentDataCollector", function () {
      it("enhanceProcessingActivityData", function (done) {
        expect(function () {
          data = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "enhanceProcessingActivityData",
            params: [data]
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "execute",
            params: []
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
      it("expandUserData", function (done) {
        expect(function () {
          data = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "expandUserData",
            params: [data]
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
      it("getSordData", function (done) {
        expect(function () {
          objId = ProcessActivitySord.id;
          formatter = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "getSordData",
            params: [objId, formatter]
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
      it("getUserData", function (done) {
        expect(function () {
          user = "Administrator";
          formatter = {};
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "getUserData",
            params: [user, formatter]
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
      it("initialize", function (done) {
        expect(function () {
          config = { objId: ProcessActivitySord.id };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ExtendedParentDataCollector",
            classConfig: { objId: ProcessActivitySord.id },
            method: "initialize",
            params: [config]
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
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_privacy_service_ExtendedParentDataCollector", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_ExtendedParentDataCollector", {
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
      it("with 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_ExtendedParentDataCollector", {
            objId: ProcessActivitySord.id
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
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});