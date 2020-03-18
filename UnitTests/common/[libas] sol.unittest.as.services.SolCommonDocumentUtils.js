
describe("[libas] sol.unittest.as.services.SolCommonDocumentUtils", function () {
  var originalTimeout, content, outputStream, sord, folderName,
      dstDirPath, pdfName, templateId, ext, folderId, baseDstDirPath, 
      config, obSolCommonDocumentUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentUtils").then(function success(obSolCommonDocumentUtilsId1) {
        obSolCommonDocumentUtilsId = obSolCommonDocumentUtilsId1;
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
    describe("sol.common_document.as.Utils", function () {
      it("convertOutputStreamToInputStream", function (done) {
        expect(function () {
          outputStream = "outputStream1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertOutputStreamToInputStream",
              params: [outputStream]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertToPdf",
              params: [sord]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createContent", function (done) {
        expect(function () {
          folderName = "folderName1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
              method: "createContent",
              params: [folderName, dstDirPath]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createCoverSheetSord", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          pdfName = "pdfName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
              method: "createCoverSheetSord",
              params: [sord, dstDirPath, pdfName]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("createErrorConversionPdf", function (done) {
        expect(function () {
          sord = PVALUE;
          dstDirPath = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createErrorConversionPdf",
              params: [sord, dstDirPath]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("createPdfDocument", function (done) {
        expect(function () {
          sord = PVALUE;
          dstDirPath = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createPdfDocument",
              params: [sord, dstDirPath]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("createPdfFromSord", function (done) {
        expect(function () {
          sord = PVALUE;
          templateId = PVALUE;
          dstDirPath = PVALUE;
          ext = PVALUE;
          pdfName = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createPdfFromSord",
              params: [sord, templateId, dstDirPath, ext, pdfName]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("exportFolder", function (done) {
        expect(function () {
          folderId = PVALUE;
          baseDstDirPath = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "exportFolder",
              params: [folderId, baseDstDirPath, config]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getExportFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getExportFolder",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getOffsetSumPages", function (done) {
        expect(function () {
          folderName = PVALUE;
          dstDirPath = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getOffsetSumPages",
              params: [folderName, dstDirPath]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getRefPath", function (done) {
        expect(function () {
          sord = PVALUE;
          ext = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getRefPath",
              params: [sord, ext]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getTemplateContents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateContents",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getTemplateCoverSheetSord", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateCoverSheetSord",
              params: [sord]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      xit("getTemplateErrorConversionPdf", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateErrorConversionPdf",
              params: []
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
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