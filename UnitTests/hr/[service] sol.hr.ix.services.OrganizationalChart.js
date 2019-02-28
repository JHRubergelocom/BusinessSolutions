
describe("[service] sol.hr.ix.services.OrganizationalChart", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("OrganizationalChart").then(function success(objTempId) {
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
    describe("RF_sol_hr_service_OrganizationChart_Companies", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Companies", {
          }).then(function success(jsonResult) {
            expect(jsonResult.companies).toBeDefined();
            expect(jsonResult.companies.length).toBeGreaterThan(0);
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
    describe("RF_sol_hr_service_OrganizationChart_Get", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Get", {
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
      it("get organization chart", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_OrganizationChart_Get", {
            objId: "1"
          }).then(function success(jsonResult) {
            expect(jsonResult.organization).toBeDefined();
            expect(jsonResult.organization.length).toBeGreaterThan(0);
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