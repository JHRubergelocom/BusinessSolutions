
describe("[lib] sol.unittest.ix.services.SolConnectorDxDXUtils", function () {
  var originalTimeout, subsystem, tplName, docClass;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorDxDXUtils").then(function success(obSolConnectorDxDXUtilsId) {
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
    describe("sol.connector_dx.DXUtils", function () {
      it("getDxConfig", function (done) {
        expect(function () {
          subsystem = "Invoice";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.connector_dx.DXUtils",
            classConfig: {},
            method: "getDxConfig",
            params: [subsystem]
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
      it("getDxExportTemplateId", function (done) {
        expect(function () {
          subsystem = "Invoice";
          tplName = "Default";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.connector_dx.DXUtils",
            classConfig: {},
            method: "getDxExportTemplateId",
            params: [subsystem, tplName]
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
      it("getDxImportMapping", function (done) {
        expect(function () {
          subsystem = "Invoice";
          docClass = "Invoice/Default";
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib", {
            className: "sol.connector_dx.DXUtils",
            classConfig: {},
            method: "getDxImportMapping",
            params: [subsystem, docClass]
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