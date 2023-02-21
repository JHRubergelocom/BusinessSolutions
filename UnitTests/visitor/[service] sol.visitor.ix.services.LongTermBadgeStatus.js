
describe("[service] sol.visitor.ix.services.GetStatus", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetStatus").then(function success(objTempId) {
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
    describe("RF_sol_visitor_service_LongTermBadge_GetStatus", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_LongTermBadge_GetStatus", {
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
      it("should not throw if executed with Parameter 'longTermBadge", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_LongTermBadge_GetStatus", {
            longTermBadge: { id: "1" }
          }).then(function success(jsonResult) {
            expect(jsonResult.isActive).toBeDefined();
            expect(jsonResult.isValid).toBeDefined();
            expect(jsonResult.LONGTERM_BADGE_STATUS).toBeDefined();
            expect(jsonResult.LONGTERM_BADGE_VALID_FROM).toBeDefined();
            expect(jsonResult.LONGTERM_BADGE_VALID_TO).toBeDefined();
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