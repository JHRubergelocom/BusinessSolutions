
describe("[lib] sol.unittest.ix.services.SolConnectorXmlImporter", function () {
  var XmlImporterSord, originalTimeout,
      config, xml, objId, table,
      obSolConnectorXmlImporterId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorXmlImporter").then(function success(obSolConnectorXmlImporterId1) {
        obSolConnectorXmlImporterId = obSolConnectorXmlImporterId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/XmlImporter").then(function success1(XmlImporterSord1) {
          XmlImporterSord = XmlImporterSord1;
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
  describe("Test Lib Functions", function () {
    describe("sol.connector_xml.Importer", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: {},
            method: "initialize",
            params: [config]
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
      it("process", function (done) {
        expect(function () {
          xml = XmlImporterSord.id;
          objId = obSolConnectorXmlImporterId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: { sord: { mask: "UnitTest" }, mapping: [] },
            method: "process",
            params: [xml, objId]
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
      it("processCreate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: {},
            method: "processCreate",
            params: []
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processMapping", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: { mapping: [] },
            method: "processMapping",
            params: []
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
      it("processTable", function (done) {
        expect(function () {
          table = {
            xpath: "/invoice/items/item",
            prefix: "ITEM",
            mapping: []
          };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: {},
            method: "processTable",
            params: [table]
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
      it("processTables", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: { tables: [] },
            method: "processTables",
            params: []
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
      it("save", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: {},
            method: "save",
            params: []
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
      it("validate", function (done) {
        expect(function () {
          xml = XmlImporterSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Importer",
            classConfig: {},
            method: "validate",
            params: [xml]
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