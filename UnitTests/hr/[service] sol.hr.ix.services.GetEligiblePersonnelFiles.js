
describe("[service] sol.hr.ix.services.GetEligiblePersonnelFiles", function () {
  var originalTimeout, superiorUserGuid, superiorFieldNames;

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
  describe("Test Lib Functions", function () {
    describe("sol.hr.ix.services.GetEligiblePersonnelFiles", function () {
      it("getUsersBySuperior", function (done) {
        expect(function () {
          superiorUserGuid = "0";
          superiorFieldNames = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetEligiblePersonnelFiles",
            classConfig: {},
            method: "getUsersBySuperior",
            params: [superiorUserGuid, superiorFieldNames]
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
            className: "sol.hr.ix.services.GetEligiblePersonnelFiles",
            classConfig: {},
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
      it("userIsSuperiorOf", function (done) {
        expect(function () {
          superiorUserGuid = "0";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetEligiblePersonnelFiles",
            classConfig: {},
            method: "userIsSuperiorOf",
            params: [superiorUserGuid]
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