
describe("[lib] sol.unittest.ix.services.SolConnectorXmlDocumentImporter", function () {
  var DocumentImporterSord, userName, userInfo, originalTimeout, config, xmlFile, fileData, parentId, successAction, errorAction, timestamp, mask, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorXmlDocumentImporter").then(function success(obSolConnectorXmlDocumentImporterId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/DocumentImporter").then(function success1(DocumentImporterSord1) {
          DocumentImporterSord = DocumentImporterSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.connector_xml.DocumentImporter", function () {
      it("getInstance", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: {},
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
      xit("initialize", function (done) {
        expect(function () {
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
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
      xit("preprocessFilePaths", function (done) {
        expect(function () {
          xmlFile = PVALUE;
          fileData = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: {},
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
      xit("process", function (done) {
        expect(function () {
          parentId = PVALUE;
          fileData = PVALUE;
          successAction = PVALUE;
          errorAction = PVALUE;
          timestamp = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: {},
            method: "process",
            params: [parentId, fileData, successAction, errorAction, timestamp, mask]
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
      xit("readXmlData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: {},
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
      xit("validate", function (done) {
        expect(function () {
          xml = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
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
      xit("writeMetadata", function (done) {
        expect(function () {
          xml = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.DocumentImporter",
            classConfig: {},
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