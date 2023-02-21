
describe("[libix] sol.unittest.ix.services.SolDatevAccountingUtils", function () {
  var originalTimeout, sord, options, objId, feedConfig, resolverTemplate,
      obSolDatevAccountingUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDatevAccountingUtils").then(function success(obSolDatevAccountingUtilsId1) {
        obSolDatevAccountingUtilsId = obSolDatevAccountingUtilsId1;
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
    describe("sol.datev.accounting.Utils", function () {
      it("getWorkflowConfig", function (done) {
        expect(function () {
          sord = obSolDatevAccountingUtilsId;
          options = { resolverTemplates: [{ source: "{{kwl:key sord.objKeys.INVOICE_TYPE}}" }] };
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.Utils",
            classConfig: {},
            method: "getWorkflowConfig",
            params: [sord, options]
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
      it("handleMissingDocumentConfig", function (done) {
        expect(function () {
          objId = obSolDatevAccountingUtilsId;
          feedConfig = {};
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.Utils",
            classConfig: {},
            method: "handleMissingDocumentConfig",
            params: [objId, feedConfig]
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
      it("resolveTemplate", function (done) {
        expect(function () {
          sord = obSolDatevAccountingUtilsId;
          resolverTemplate = { source: "{{kwl:key sord.objKeys.INVOICE_TYPE}}" };
          test.Utils.execute("RF_sol_unittest_datev_accounting_service_ExecuteLib", {
            className: "sol.datev.accounting.Utils",
            classConfig: {},
            method: "resolveTemplate",
            params: [sord, resolverTemplate]
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