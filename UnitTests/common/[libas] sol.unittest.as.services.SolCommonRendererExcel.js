/* eslint-disable linebreak-style */

describe("[libas] sol.unittest.as.services.SolCommonRendererExcel", function () {
  var RendererExcelSord, obSolCommonRendererExcelId, originalTimeout, content, rowSord,
      excelDocument, data, fieldName, config, cell, sord, name, rowSords, rowIndex, rowData;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRendererExcel").then(function success(obSolCommonRendererExcelId1) {
        obSolCommonRendererExcelId = obSolCommonRendererExcelId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ReadExcelTable").then(function success1(RendererExcelSord1) {
          RendererExcelSord = RendererExcelSord1;
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
    describe("sol.common.as.renderer.Excel", function () {
      it("copyObject", function (done) {
        expect(function () {
          rowSord = RendererExcelSord.id;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "copyObject",
              params: [rowSord]
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
      it("expandRowSord", function (done) {
        expect(function () {
          rowSord = RendererExcelSord.id;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "expandRowSord",
              params: [rowSord]
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
      it("fillExcelSpreadsheet", function (done) {
        expect(function () {
          excelDocument = "excelDocument1";
          data = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "fillExcelSpreadsheet",
              params: [excelDocument, data]
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
      it("getIndexFromName", function (done) {
        expect(function () {
          fieldName = "fieldName123";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "getIndexFromName",
              params: [fieldName]
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "initialize",
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
      it("isDate", function (done) {
        expect(function () {
          cell = "cell1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "isDate",
              params: [cell]
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
      it("isNumber", function (done) {
        expect(function () {
          cell = "cell1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "isNumber",
              params: [cell]
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
      it("prepareColumnMapping", function (done) {
        expect(function () {
          sord = RendererExcelSord.id;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "prepareColumnMapping",
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
      it("prepareHeader", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "prepareHeader",
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
      it("readHeader", function (done) {
        expect(function () {
          sord = RendererExcelSord.id;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "readHeader",
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
      it("readHeaderFromSord", function (done) {
        expect(function () {
          sord = RendererExcelSord.id;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "readHeaderFromSord",
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
      it("readHeaderFromWorksheet", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "readHeaderFromWorksheet",
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
      it("render", function (done) {
        expect(function () {
          name = "name1";
          data = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "render",
              params: [name, data]
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
      it("renderExcel", function (done) {
        expect(function () {
          data = {};
          config = { parentId: obSolCommonRendererExcelId, format: "xlsx" };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id },
              method: "renderExcel",
              params: [data, config]
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
      it("writeData", function (done) {
        expect(function () {
          rowSords = [RendererExcelSord.id];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1"  },
              method: "writeData",
              params: [rowSords]
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
      it("writeLine", function (done) {
        expect(function () {
          rowIndex = 0;
          rowData = [0, 1];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.as.services.ExecuteLib",
            config: {
              className: "sol.common.as.renderer.Excel",
              classConfig: { targetId: obSolCommonRendererExcelId, templateId: RendererExcelSord.id, datasheet: "Tabelle1" },
              method: "writeLine",
              params: [rowIndex, rowData]
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