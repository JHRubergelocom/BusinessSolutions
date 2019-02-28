
describe("[service] sol.learning.ix.services.GetCourses", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetCourses").then(function success(objTempId) {
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
    describe("RF_sol_learning_service_GetCourses", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCourses", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
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
    describe("RF_sol_learning_service_GetCatalogFilters", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetCatalogFilters", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.sords).toBeDefined();
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