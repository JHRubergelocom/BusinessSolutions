
describe("[service] sol.common.ix.services.KwlDataCollector", function () {
  var originalTimeout, parameters;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objKwlDataCollector1", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objKwlDataCollector1Id) {
        test.Utils.createTempSord("objKwlDataCollector2", { UNITTEST_STATUS3: "XX", UNITTEST_STATUS4: "14" }).then(function success1(objKwlDataCollector2Id) {
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
    describe("RF_sol_common_services_KwlDataCollector", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", {
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
      it("should throw if executed with invalid Parameter", function (done) {
        expect(function () {
          parameters = {
            kwlConfig: [
              {
                id: "UNITTEST_FIELD2"
              },
              {
                id: "UNITTEST_STATUS1"
              }
            ],
            dynKwlConfig: [
              {
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator1",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4"
              }
            ]
          };
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", parameters).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter", function (done) {
        expect(function () {
          parameters = {
            kwlConfig: [
              {
                id: "UNITTEST_FIELD1"
              },
              {
                id: "UNITTEST_STATUS2"
              }
            ],
            dynKwlConfig: [
              {
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4"
              }
            ]
          };
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", parameters).then(function success(jsonResult) {
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