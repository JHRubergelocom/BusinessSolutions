
describe("[service] sol.pubsec.ix.services.Directives", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Directives").then(function success(objTempId) {
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
    describe("RF_sol_pubsec_service_GetDirectiveTypes", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_GetDirectiveTypes", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
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
    describe("RF_sol_pubsec_service_CheckDirectivePreconditions", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckDirectivePreconditions", {
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
      it("should not throw if executed Parameter {'targetId': 1 }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckDirectivePreconditions", {
            targetId: 1
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.unbound).toBeDefined();
            expect(jsonResult.unbound).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
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