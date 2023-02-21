/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonTemplateXslUtils", function () {
  var originalTimeout, html, xmlString, inputString, xslPath;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplateXslUtils").then(function success(obSolCommonTemplateXslUtilsId) {
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
    describe("sol.common.TemplateXslUtils", function () {
      it("formatHtml", function (done) {
        expect(function () {
          html = "<html><p>Dies ist ein Text</p></html>";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateXslUtils",
            classConfig: {},
            method: "formatHtml",
            params: [html]
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
      it("normalizeHtml", function (done) {
        expect(function () {
          html = "<html><p>Dies ist ein Text</p></html>";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateXslUtils",
            classConfig: {},
            method: "normalizeHtml",
            params: [html]
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
      it("replaceXmlProlog", function (done) {
        expect(function () {
          xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"></xsl:stylesheet>";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateXslUtils",
            classConfig: {},
            method: "replaceXmlProlog",
            params: [xmlString]
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
      it("transform", function (done) {
        expect(function () {
          inputString = "<html><p>Dies ist ein Text</p></html>";
          xslPath = "ARCPATH:/Administration/Business Solutions/common/Configuration/XSLT/htmlToFo";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateXslUtils",
            classConfig: {},
            method: "transform",
            params: [inputString, xslPath]
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