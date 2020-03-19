
describe("[libas] sol.unittest.as.services.SolCommonDocumentUtils", function () {
  var originalTimeout, content, outputStream, sord, folderName,
      dstDirPath, pdfName, templateId, ext, folderId, baseDstDirPath, 
      config, obSolCommonDocumentUtilsId, ExportFolderSord, objId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDocumentUtils").then(function success(obSolCommonDocumentUtilsId1) {
        obSolCommonDocumentUtilsId = obSolCommonDocumentUtilsId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Test data/ExportFolder").then(function success1(ExportFolderSord1) {
          ExportFolderSord = ExportFolderSord1;
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
      it("convertOutputStreamToInputStream", function (done) {
        expect(function () {
          outputStream = "outputStream1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
              classConfig: { pdfContents: [] },
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
      it("createErrorConversionPdf", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("createPdfDocument", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("createPdfFromSord", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          templateId = "templateId1";
          dstDirPath = "dstDirPath1";
          ext = "ext1";
          pdfName = "pdfName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("exportFolder", function (done) {
        expect(function () {
          folderId = ExportFolderSord.id;
          baseDstDirPath = "baseDstDirPath";
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
              method: "exportFolder",
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
      it("getExportFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("getOffsetSumPages", function (done) {
        expect(function () {
          folderName = "folderName1";
          dstDirPath = "dstDirPath1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("getRefPath", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          ext = "ext1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("getTemplateContents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("getTemplateCoverSheetSord", function (done) {
        expect(function () {
          sord = obSolCommonDocumentUtilsId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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
      it("getTemplateErrorConversionPdf", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib2",
            config: {
              className: "sol.common_document.as.Utils",
              classConfig: { pdfContents: [] },
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