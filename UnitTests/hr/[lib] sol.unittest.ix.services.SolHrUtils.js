
describe("[lib] sol.unittest.ix.services.SolHrUtils", function () {
  var originalTimeout, userId, request, guid;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolHrUtils").then(function success(obSolHrUtilsId) {
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
    describe("sol.hr.Utils", function () {
      it("getPathOfUsersPersonnelFile", function (done) {
        expect(function () {
          userId = "Administrator";
          request = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.Utils",
            classConfig: {},
            method: "getPathOfUsersPersonnelFile",
            params: [userId, request]
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
      it("getPathOfUsersPersonnelFileByGuid", function (done) {
        expect(function () {
          guid = "(E10E1000-E100-E100-E100-E10E10E10E00)";
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib", {
            className: "sol.hr.Utils",
            classConfig: {},
            method: "getPathOfUsersPersonnelFileByGuid",
            params: [guid]
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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