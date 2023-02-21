/* eslint-disable linebreak-style */

describe("[libas] sol.unittest.as.services.SolCommonDocumentUtils", function () {
  var originalTimeout, content, outputStream, sord, folderName,
      dstDirPath, pdfName, templateId, ext, folderId, baseDstDirPath,
      config, obSolCommonDocumentUtilsId, PdfExportSord, objId,
      objConvertPdfToPdfAId, pdfContents, dstPdfFile, isCover,
      pdfInputStream, pdfOutputStream, contents, filePath,
      refPath, contentName, pdfPages, hint, inputStream, fileName, fileFormat,
      jsonObject, noteRGB, setAlpha, page, pWidth, pHeight,
      pdfDocument, note, repoPath, textWatermark, dstFile, jsonKeyValuePairs,
      maskName, sourceFile, excludeKeys, excludeMaskTabs, includeKeys,
      maskTabs, text, col;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentUtils").then(function success(obSolCommonDocumentUtilsId1) {
        obSolCommonDocumentUtilsId = obSolCommonDocumentUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Test data/PdfExport").then(function success1(PdfExportSord1) {
          PdfExportSord = PdfExportSord1;
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
    describe("sol.common_document.as.Utils", function () {
      it("adjustContent", function (done) {
        expect(function () {
          contents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "adjustContent",
              params: [contents]
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
      it("convertEmlFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertEmlFileToPdf",
              params: [filePath, dstDirPath]
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
      it("convertEmlWithAttchmentToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertEmlWithAttchmentToPdf",
              params: [sord, dstDirPath, config]
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
      it("convertFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertFileToPdf",
              params: [filePath]
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
      it("convertGraphicFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertGraphicFileToPdf",
              params: [filePath, dstDirPath, config]
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
      it("convertGraphicToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertGraphicToPdf",
              params: [sord, ext, dstDirPath, config]
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
      it("convertHtmlFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertHtmlFileToPdf",
              params: [filePath, dstDirPath]
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
      it("convertHtmlToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertHtmlToPdf",
              params: [sord, ext, dstDirPath]
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
      it("convertJsonToJsonKeyValuePairs", function (done) {
        expect(function () {
          jsonObject = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertJsonToJsonKeyValuePairs",
              params: [jsonObject]
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
      it("convertMsgWithAttchmentToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertMsgWithAttchmentToPdf",
              params: [sord, dstDirPath, config]
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
      it("create ConvertPdfToPdfA", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Test data/ConvertPdfToPdfA").then(function success(objConvertPdfToPdfAId1) {
            objConvertPdfToPdfAId = objConvertPdfToPdfAId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertPDFtoPDFA", function (done) {
        expect(function () {
          dstPdfFile = objConvertPdfToPdfAId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertPDFtoPDFA",
              params: [dstPdfFile]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            }
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertTextFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertTextFileToPdf",
              params: [filePath, dstDirPath, config]
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
      it("convertTextToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          dstDirPath = "dstDirPath1";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertTextToPdf",
              params: [sord, ext, dstDirPath, config]
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
      it("convertTiffFileToPdf", function (done) {
        expect(function () {
          filePath = "filePath1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertTiffFileToPdf",
              params: [filePath, dstDirPath]
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
      it("convertTiffToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertTiffToPdf",
              params: [sord, ext, dstDirPath]
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
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertToPdf",
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
      it("createContent", function (done) {
        expect(function () {
          folderName = "folderName1";
          dstDirPath = "dstDirPath1";
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createContent",
              params: [folderName, dstDirPath, config, pdfContents]
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
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createCoverSheetSord",
              params: [sord, dstDirPath, pdfName, config, pdfContents]
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
      it("createErrorConversionPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          dstDirPath = "dstDirPath1";
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createErrorConversionPdf",
              params: [sord, ext, dstDirPath, config, pdfContents]
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
      it("createPdfDocument", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createPdfDocument",
              params: [sord, dstDirPath, config, pdfContents]
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
      it("createPdfFromSord", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          templateId = "templateId1";
          dstDirPath = "dstDirPath1";
          ext = "ext1";
          pdfName = "pdfName1";
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createPdfFromSord",
              params: [sord, templateId, dstDirPath, ext, pdfName, config, pdfContents]
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
      it("createPdfStreamFromHtml", function (done) {
        expect(function () {
          dstDirPath = "dstDirPath1";
          fileName = "fileName1";
          sourceFile = "sourceFile1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "createPdfStreamFromHtml",
              params: [dstDirPath, fileName, sourceFile]
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
      it("filterExcludeKeys", function (done) {
        expect(function () {
          jsonKeyValuePairs = [];
          excludeKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "filterExcludeKeys",
              params: [jsonKeyValuePairs, excludeKeys]
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
      it("filterExcludeMaskTabs", function (done) {
        expect(function () {
          jsonKeyValuePairs = [];
          maskName = "UnitTest";
          excludeMaskTabs = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "filterExcludeMaskTabs",
              params: [jsonKeyValuePairs, maskName, excludeMaskTabs]
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
      it("filterIncludeKeys", function (done) {
        expect(function () {
          jsonKeyValuePairs = [];
          includeKeys = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "filterIncludeKeys",
              params: [jsonKeyValuePairs, includeKeys]
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
      it("getActions", function (done) {
        expect(function () {
          objId = obSolCommonDocumentUtilsId;
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getActions",
              params: [objId, config]
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
      it("getColor", function (done) {
        expect(function () {
          noteRGB = 0;
          setAlpha = true;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getColor",
              params: [noteRGB, setAlpha]
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
      it("getExportFolder", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getExportFolder",
              params: [config]
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
      it("getFeedUrl", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getFeedUrl",
              params: [sord, config]
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
      it("getGraph", function (done) {
        expect(function () {
          page = 1;
          pWidth = 100;
          pHeight = 100;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getGraph",
              params: [page, pWidth, pHeight]
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
      it("getKeysMaskTabs", function (done) {
        expect(function () {
          maskName = "UnitTest";
          maskTabs = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getKeysMaskTabs",
              params: [maskName, maskTabs]
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
      it("getMarginNotes", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getMarginNotes",
              params: [sord, config]
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
      it("getOffsetSumPages", function (done) {
        expect(function () {
          folderName = "folderName1";
          dstDirPath = "dstDirPath1";
          config = {};
          pdfContents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getOffsetSumPages",
              params: [folderName, dstDirPath, config, pdfContents]
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
      it("getPdfName", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getPdfName",
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
      it("getRefPath", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          isCover = true;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getRefPath",
              params: [sord, isCover]
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
      it("getTemplateContents", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateContents",
              params: [config]
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
      it("getTemplateCoverSheetSord", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateCoverSheetSord",
              params: [sord, config]
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
      it("getTemplateErrorConversionPdf", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateErrorConversionPdf",
              params: [config]
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
      it("getTemplateGraphic", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateGraphic",
              params: [config]
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
      it("getTemplateText", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "getTemplateText",
              params: [config]
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
      it("pdfExport", function (done) {
        expect(function () {
          folderId = PdfExportSord.id;
          baseDstDirPath = "baseDstDirPath";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "pdfExport",
              params: [folderId, baseDstDirPath, config]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              fail(jsonResult.content);
            } else {
              content = JSON.parse(content);
              objId = content.objId;
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
      it("pushContent", function (done) {
        expect(function () {
          sord = { maskName: "Folder" };
          pdfContents = [];
          pdfInputStream = "pdfInputStream1";
          refPath = "refPath1";
          contentName = "contentName1";
          pdfPages = 1;
          hint = "hint1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "pushContent",
              params: [sord, pdfContents, pdfInputStream, refPath, contentName, pdfPages, hint]
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
      it("setAnnotationNotes", function (done) {
        expect(function () {
          dstPdfFile = "dstPdfFile1";
          sord = obSolCommonDocumentUtilsId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setAnnotationNotes",
              params: [dstPdfFile, sord]
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
      it("setAnnotationStamp", function (done) {
        expect(function () {
          pdfDocument = "pdfDocument1";
          note = "note1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setAnnotationStamp",
              params: [pdfDocument, note]
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
      it("setHyperlinks", function (done) {
        expect(function () {
          dstPdfFile = "dstPdfFile1";
          contents = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setHyperlinks",
              params: [dstPdfFile, contents]
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
      it("setLineMarker", function (done) {
        expect(function () {
          pdfDocument = "pdfDocument1";
          note = "note1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setLineMarker",
              params: [pdfDocument, note]
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
      it("setPagination", function (done) {
        expect(function () {
          dstPdfFile = "dstPdfFile1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setPagination",
              params: [dstPdfFile]
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
      it("setRectangleMarker", function (done) {
        expect(function () {
          pdfDocument = "pdfDocument1";
          note = "note1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setRectangleMarker",
              params: [pdfDocument, note]
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
      it("setStickyNote", function (done) {
        expect(function () {
          pdfDocument = "pdfDocument1";
          note = "note1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setStickyNote",
              params: [pdfDocument, note]
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
      it("setWatermarkImage", function (done) {
        expect(function () {
          dstPdfFile = "dstPdfFile1";
          dstDirPath = "dstDirPath1";
          repoPath = "repoPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setWatermarkImage",
              params: [dstPdfFile, dstDirPath, repoPath]
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
      it("setWatermarkText", function (done) {
        expect(function () {
          dstPdfFile = "dstPdfFile1";
          textWatermark = "textWatermark1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "setWatermarkText",
              params: [dstPdfFile, textWatermark]
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
      it("splitString", function (done) {
        expect(function () {
          text = "Langer Text";
          col = 10;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "splitString",
              params: [text, col]
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
      it("translateIndexfields", function (done) {
        expect(function () {
          jsonKeyValuePairs = [];
          maskName = "UnitTest";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "translateIndexfields",
              params: [jsonKeyValuePairs, maskName]
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
      it("writeFileToPdfOutputStream", function (done) {
        expect(function () {
          dstFile = "dstFile1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "writeFileToPdfOutputStream",
              params: [dstFile]
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
      it("writeInputStreamToFile", function (done) {
        expect(function () {
          inputStream = objConvertPdfToPdfAId;
          dstDirPath = "dstDirPath1";
          fileName = "fileName1";
          fileFormat = "pdf";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "writeInputStreamToFile",
              params: [inputStream, dstDirPath, fileName, fileFormat]
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
      it("writePdfInputStreamToFile", function (done) {
        expect(function () {
          pdfInputStream = objConvertPdfToPdfAId;
          dstDirPath = "dstDirPath1";
          pdfName = "pdfName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "writePdfInputStreamToFile",
              params: [pdfInputStream, dstDirPath, pdfName]
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
      it("writePdfOutputStreamToFile", function (done) {
        expect(function () {
          pdfOutputStream = "pdfOutputStream1";
          dstDirPath = "dstDirPath1";
          pdfName = "pdfName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "writePdfOutputStreamToFile",
              params: [pdfOutputStream, dstDirPath, pdfName]
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
      it("remove objId", function (done) {
        expect(function () {
          test.Utils.deleteSord(objId).then(function success(deleteResult) {
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