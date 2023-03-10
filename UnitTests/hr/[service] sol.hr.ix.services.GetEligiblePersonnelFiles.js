
describe("[service] sol.hr.ix.services.GetEligiblePersonnelFiles", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetEligiblePersonnelFiles").then(function success(objTempId) {
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
    describe("RF_sol_hr_service_GetEligiblePersonnelFiles", function () {
      it("should throw if executed with invalid userId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {
            userId: "Max Mustermann"
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
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toEqual(1);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with existing userId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetEligiblePersonnelFiles", {
            userId: "Gerd Baum"
          }).then(function success(jsonResult) {
            expect(jsonResult.length).toEqual(1);
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