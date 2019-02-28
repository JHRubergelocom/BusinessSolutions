
describe("[service] sol.common.ix.services.GenerateSetInstructions", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateSetInstructions").then(function success(obGenerateSetInstructionsId) {
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
    describe("RF_sol_common_service_GenerateSetInstructions", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GenerateSetInstructions", {
          }).then(function success(jsonResult) {
            expect(jsonResult.instructions).toBeDefined();
            expect(jsonResult.instructions.length).toEqual(0);
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
          test.Utils.execute("RF_sol_common_service_GenerateSetInstructions", {
            dataSource: {
              objKeys: {
                MY_FIELD: "myvalue"
              },
              mapKeys: {
                NO_FIELD: "xyz",
                MY_CUSTOM_FIELD: "this is"
              }
            },
            mapping: [
              { source: { id: "MY_FIELD", type: "GRP" }, target: { id: "YOUR_FIELD", type: "GRP" } },
              { target: { id: "Y_FIELD", type: "MAP", value: "{{sord.mapKeys.MY_CUSTOM_FIELD}} fixed text" } },
              { source: { id: "NO_FIELD", type: "MAP" } },
              { target: { id: "OLD_DATAHISTORY", type: "FORMBLOB", value: "{{sord.formBlobs.DATAHISTORY}}" } }
            ],
            returnRendered: true,
            renderOptions: {
              emptyNonRendered: true
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.instructions).toBeDefined();
            expect(jsonResult.instructions.length).toBeGreaterThan(0);
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