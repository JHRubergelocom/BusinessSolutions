
describe("[libix] sol.unittest.ix.services.SolPubsecFileUtils", function () {
  var originalTimeout, sord, params, obSolPubsecFileUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecFileUtils").then(function success(obSolPubsecFileUtilsId1) {
        obSolPubsecFileUtilsId = obSolPubsecFileUtilsId1;
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
    describe("sol.pubsec.ix.FileUtils", function () {
      it("findLegalParent", function (done) {
        expect(function () {
          sord = obSolPubsecFileUtilsId;
          params = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.FileUtils",
            classConfig: {},
            method: "findLegalParent",
            params: [sord, params]
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
      it("isClosed", function (done) {
        expect(function () {
          sord = obSolPubsecFileUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.FileUtils",
            classConfig: {},
            method: "isClosed",
            params: [sord]
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
      it("isOpen", function (done) {
        expect(function () {
          sord = obSolPubsecFileUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.ix.FileUtils",
            classConfig: {},
            method: "isOpen",
            params: [sord]
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