
describe("[service] sol.hr.ix.services.GetOffboardingTypes", function () {
  var sordTemplatesFolder, originalTimeout, status, forbidden;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetOffboardingTypes").then(function success(obGetOffboardingTypesId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr [unit tests]/Test data/PersonalFile").then(function success1(sordTemplatesFolder1) {
          sordTemplatesFolder = sordTemplatesFolder1;
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
  describe("Test Lib Functions", function () {
    describe("sol.hr.ix.services.GetOffboardingTypes", function () {
      it("isStatusAllowed", function (done) {
        expect(function () {
          status = [];
          forbidden = "forbidden1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetOffboardingTypes",
            classConfig: {},
            method: "isStatusAllowed",
            params: [status, forbidden]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetOffboardingTypes",
            classConfig: { targetId: sordTemplatesFolder.id },
            method: "process",
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
    describe("RF_sol_hr_service_GetOffboardingTypes", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetOffboardingTypes", {
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
      it("should not throw if executed with sord template folder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetOffboardingTypes", {
            targetId: sordTemplatesFolder.id
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