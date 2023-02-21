
describe("[lib] sol.unittest.ix.services.SolConnectorXmlDocumentImporter", function () {
  var XmlDocumentImporterSord, originalTimeout, config,
      xmlFile, fileData, parentId,
      params, xml, obSolConnectorXmlDocumentImporterId, xmlImportConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorXmlDocumentImporter").then(function success(obSolConnectorXmlDocumentImporterId1) {
        obSolConnectorXmlDocumentImporterId = obSolConnectorXmlDocumentImporterId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/XmlImporter").then(function success1(XmlDocumentImporterSord1) {
          XmlDocumentImporterSord = XmlDocumentImporterSord1;
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
    describe("sol.connector_xml.DocumentImporter", function () {
      it("getInstance", function (done) {
        expect(function () {
          xmlImportConfig = {
            sord: {
              mask: "UnitTest"
            },
            importSuccessAction: "move:imported",
            importErrorAction: "move:error",
            files: {
              xpath: "/import/file",
              importSuccessAction: "move:imported",
              importErrorAction: "move:error",
              values: {
                FILE_PATH: {
                  xpath: "path"
                },
                FILE_MASK: {
                  xpath: "mask",
                  converter: "defaultMask"
                },
                FILE_NAME: {
                  xpath: "name"
                },
                FILE_COMMENT: {
                  xpath: "comment",
                  converter: "defaultComment"
                },
                FILE_VERSION: {
                  xpath: "version",
                  converter: "defaultVersion"
                }
              }
            },
            converter: [
              {
                name: "defaultMask",
                type: "DefaultConverter",
                defaultValue: "UnitTest"
              },
              {
                name: "defaultComment",
                type: "DefaultConverter",
                defaultValue: "standard import"
              },
              {
                name: "defaultVersion",
                type: "DefaultConverter",
                defaultValue: "1.0"
              }
            ]
          };
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
            method: "getInstance",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
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
      it("preprocessFilePaths", function (done) {
        expect(function () {
          xmlFile = "xmlFile1";
          fileData = "fileData1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: { files: {} },
            method: "preprocessFilePaths",
            params: [xmlFile, fileData]
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
          xml = XmlDocumentImporterSord.id;
          parentId = obSolConnectorXmlDocumentImporterId;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
            method: "process",
            params: [xml, parentId]
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
      it("readXmlData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
            method: "readXmlData",
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
          xml = XmlDocumentImporterSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
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
      it("writeMetadata", function (done) {
        expect(function () {
          xml = XmlDocumentImporterSord.id;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: xmlImportConfig,
            method: "writeMetadata",
            params: [xml, params]
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