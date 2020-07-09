
describe("[libix] sol.unittest.ix.services.SolCommonDynKwlUtils", function () {
  var obSolCommonDynKwlUtilsId, originalTimeout, map, sord, focusedFieldName, scriptName, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDynKwlUtils").then(function success(obSolCommonDynKwlUtilsId1) {
        obSolCommonDynKwlUtilsId = obSolCommonDynKwlUtilsId1;
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
    describe("sol.common.ix.DynKwlUtils", function () {
      it("fillMap", function (done) {
        expect(function () {
          map = {};
          sord = obSolCommonDynKwlUtilsId;
          focusedFieldName = "focusedFieldName1";
          scriptName = "sol.dev.ix.dynkwl.FindUnitTestIterator";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlUtils",
            classConfig: {},
            method: "fillMap",
            params: [map, sord, focusedFieldName, scriptName, params]
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
      it("fillSord", function (done) {
        expect(function () {
          sord = obSolCommonDynKwlUtilsId;
          focusedFieldName = "UNITTEST_STATUS3";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlUtils",
            classConfig: {},
            method: "fillSord",
            params: [sord, focusedFieldName, params]
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