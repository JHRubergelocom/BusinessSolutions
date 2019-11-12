
describe("[lib] sol.unittest.ix.services.SolConnectorXmlUtils", function () {
  var XmlUtilsSord, userName, userInfo, originalTimeout, pattern,
      prefix, field, number, key, value, xsdObjects, config, name,
      documentBuilder, xml, xmlDoc, xPath, mapObj, converterConfig,
      fieldMap, file, actionString, timestamp, filePath, objId,
      maskId, comment, version, newVersion, parentId, errors;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolConnectorXmlUtils").then(function success(obSolConnectorXmlUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/XmlUtils").then(function success1(XmlUtilsSord1) {
          XmlUtilsSord = XmlUtilsSord1;
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
    describe("sol.connector_xml.Utils", function () {
      it("buildMapKey", function (done) {
        expect(function () {
          pattern = "{PREFIX}{FIELD}{i}";
          prefix = "prefix1";
          field = "field1";
          number = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "buildMapKey",
            params: [pattern, prefix, field, number]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("prefix1field11");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createMapEntry", function (done) {
        expect(function () {
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "createMapEntry",
            params: [key, value]
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
      it("createValidator", function (done) {
        expect(function () {
          xsdObjects = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "createValidator",
            params: [xsdObjects]
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
      it("getConverterConfig", function (done) {
        expect(function () {
          config = { converter: [{ name: "dateToIso", type: "DateConverter", fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" }] };
          name = "dateToIso";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getConverterConfig",
            params: [config, name]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ name: "dateToIso", type: "DateConverter", fromPattern: "yyyy-MM-dd", toPattern: "yyyyMMdd" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getDocument", function (done) {
        expect(function () {
          documentBuilder = "documentBuilder1";
          xml = "<?xml version='1.0'?><import></import>";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getDocument",
            params: [documentBuilder, xml]
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
      it("getDocumentBuilder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getDocumentBuilder",
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
      it("getElementString", function (done) {
        expect(function () {
          xmlDoc = "xmlDoc1";
          xPath = "/";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getElementString",
            params: [xmlDoc, xPath]
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
      xit("getElements", function (done) {
        expect(function () {
          xmlDoc = PVALUE;
          xPath = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getElements",
            params: [xmlDoc, xPath]
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
      xit("getStreamSource", function (done) {
        expect(function () {
          xml = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getStreamSource",
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
      xit("getValue", function (done) {
        expect(function () {
          xmlDoc = PVALUE;
          mapObj = PVALUE;
          converterConfig = PVALUE;
          fieldMap = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "getValue",
            params: [xmlDoc, mapObj, converterConfig, fieldMap]
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
      xit("handleImportAction", function (done) {
        expect(function () {
          file = PVALUE;
          actionString = PVALUE;
          timestamp = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "handleImportAction",
            params: [file, actionString, timestamp]
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
      xit("importDocument", function (done) {
        expect(function () {
          filePath = PVALUE;
          objId = PVALUE;
          maskId = PVALUE;
          name = PVALUE;
          comment = PVALUE;
          version = PVALUE;
          newVersion = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "importDocument",
            params: [filePath, objId, maskId, name, comment, version, newVersion]
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
      xit("importNewDocument", function (done) {
        expect(function () {
          file = PVALUE;
          parentId = PVALUE;
          maskId = PVALUE;
          name = PVALUE;
          comment = PVALUE;
          version = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "importNewDocument",
            params: [file, parentId, maskId, name, comment, version]
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
      xit("importNewVersion", function (done) {
        expect(function () {
          file = PVALUE;
          objId = PVALUE;
          comment = PVALUE;
          version = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "importNewVersion",
            params: [file, objId, comment, version]
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
      xit("writeErrorLog", function (done) {
        expect(function () {
          file = PVALUE;
          errors = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "writeErrorLog",
            params: [file, errors]
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
      xit("xmlToString", function (done) {
        expect(function () {
          xmlDoc = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.connector_xml.Utils",
            classConfig: {},
            method: "xmlToString",
            params: [xmlDoc]
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