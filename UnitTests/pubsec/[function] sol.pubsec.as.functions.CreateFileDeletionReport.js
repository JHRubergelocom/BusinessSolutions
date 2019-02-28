
describe("[function] sol.pubsec.as.functions.CreateFileDeletionReport", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateFileDeletionReport").then(function success(objCreateFileDeletionReportId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests AS Action", function () {
    describe("sol.pubsec.as.functions.CreateFileDeletionReport", function () {
      it("should not throw with empty config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.pubsec.as.functions.CreateFileDeletionReport",
            config: {}
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
      it("should not throw with Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.pubsec.as.functions.CreateFileDeletionReport",
            config: {
              objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Fileplan/File"
            }
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