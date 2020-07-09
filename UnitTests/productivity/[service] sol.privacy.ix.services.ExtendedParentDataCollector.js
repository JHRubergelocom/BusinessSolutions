
describe("[service] sol.privacy.ix.services.ExtendedParentDataCollector", function () {
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