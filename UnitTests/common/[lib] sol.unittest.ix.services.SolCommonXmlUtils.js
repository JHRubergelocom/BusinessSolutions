/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonXmlUtils", function () {
  var originalTimeout, data, dataDefinition,
      xmlElement, xmlFilePath, params, xmlDoc,
      inputXmlStream, xsltInputStream;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonXmlUtils").then(function success(obSolCommonXmlUtilsId) {
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
    describe("sol.common.XmlUtils", function () {
      it("convertObjectToXml", function (done) {
        expect(function () {
          data = { ChildSordDataCollector: [{ name: "Sord1" }, { name: "Sord2" }] };
          dataDefinition = { ChildSordDataCollector: "Sord" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlUtils",
            classConfig: {},
            method: "convertObjectToXml",
            params: [data, dataDefinition]
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
      it("getAttributes", function (done) {
        expect(function () {
          xmlElement = "xmlElement1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlUtils",
            classConfig: {},
            method: "getAttributes",
            params: [xmlElement]
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
      it("readXmlFile", function (done) {
        expect(function () {
          xmlFilePath = "xmlFilePath1";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlUtils",
            classConfig: {},
            method: "readXmlFile",
            params: [xmlFilePath, params]
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
      it("toString", function (done) {
        expect(function () {
          xmlDoc = "xmlDoc1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlUtils",
            classConfig: {},
            method: "toString",
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
      it("transformByXslt", function (done) {
        expect(function () {
          inputXmlStream = "inputXmlStream1";
          xsltInputStream = "xsltInputStream1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib5", {
            className: "sol.common.XmlUtils",
            classConfig: {},
            method: "transformByXslt",
            params: [inputXmlStream, xsltInputStream]
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