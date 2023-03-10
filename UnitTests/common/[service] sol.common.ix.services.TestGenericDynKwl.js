
describe("[service] sol.common.ix.services.TestGenericDynKwl", function () {
  var originalTimeout, parameters;

  beforeAll(function (done) {
    expect(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      test.Utils.createTempSord("objTestGenericDynKwl1", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objTestGenericDynKwl1Id) {
        test.Utils.createTempSord("objTestGenericDynKwl2", { UNITTEST_STATUS3: "XX", UNITTEST_STATUS4: "14" }).then(function success1(objTestGenericDynKwl2Id) {
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_service_TestGenericDynKwl", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_service_TestGenericDynKwl", {
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
      it("should not throw if executed with Parameter", function (done) {
        expect(function () {
          parameters = {
            type: "SEARCH",
            title: "sol.dev.ix.dynkwl.FindUnitTestIterator",
            dataFields: ["UNITTEST_STATUS3", "UNITTEST_STATUS4"],
            searchParams: [{ mode: "STARTS_WITH" }]
          };
          test.Utils.execute("RF_sol_service_TestGenericDynKwl", parameters).then(function success(jsonResult) {
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