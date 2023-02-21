
describe("[service] sol.hr.ix.services.GetOnboardingTypes", function () {
  var sordTemplatesFolder, originalTimeout,
      params, status, forbidden;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetOnboardingTypes").then(function success(obGetOnboardingTypesId) {
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
    describe("sol.hr.ix.services.GetOnboardingTypes", function () {
      it("initialize", function (done) {
        expect(function () {
          params = { targetId: sordTemplatesFolder.id };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetOnboardingTypes",
            classConfig: { targetId: sordTemplatesFolder.id },
            method: "initialize",
            params: [params]
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
      it("isStatusAllowed", function (done) {
        expect(function () {
          status = [];
          forbidden = "forbidden1";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetOnboardingTypes",
            classConfig: { targetId: sordTemplatesFolder.id },
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
            className: "sol.hr.ix.services.GetOnboardingTypes",
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
    describe("RF_sol_hr_service_GetOnboardingTypes", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetOnboardingTypes", {
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
          test.Utils.execute("RF_sol_hr_service_GetOnboardingTypes", {
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