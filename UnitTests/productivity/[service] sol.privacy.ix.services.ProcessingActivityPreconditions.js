
describe("[service] sol.privacy.ix.services.ProcessingActivityPreconditions", function () {
  var ProcessActivitySord, originalTimeout;

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
    describe("sol.privacy.ix.services.ProcessingActivityPreconditions", function () {
      it("checkApproval", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ProcessingActivityPreconditions",
            classConfig: { targetId: ProcessActivitySord.id },
            method: "checkApproval",
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
      it("checkDelegation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.privacy.ix.services.ProcessingActivityPreconditions",
            classConfig: { targetId: ProcessActivitySord.id },
            method: "checkDelegation",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_privacy_service_ApproveProcessingActivityPreconditions", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_ApproveProcessingActivityPreconditions", {
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
      it("with 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_ApproveProcessingActivityPreconditions", {
            targetId: ProcessActivitySord.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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
    describe("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", {
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
      it("with 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_privacy_service_DelegateProcessingActivityPreconditions", {
            targetId: ProcessActivitySord.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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