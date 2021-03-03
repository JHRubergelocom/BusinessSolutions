
describe("[libas] sol.unittest.as.services.SolCommonDocumentUtils", function () {
  var originalTimeout, content, outputStream, sord, folderName,
      dstDirPath, pdfName, templateId, ext, folderId, baseDstDirPath, 
      config, obSolCommonDocumentUtilsId, PdfExportSord, objId,
      objConvertPdfToPdfAId, pdfContents, dstPdfFile, isCover, 
      pdfInputStream, pdfOutputStream, contents, filePath,
      refPath, contentName, pdfPages, hint, inputStream, fileName, fileFormat;

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
      it("convertMsgWithAttchmentToPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: {},
              method: "convertMsgWithAttchmentToPdf",
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