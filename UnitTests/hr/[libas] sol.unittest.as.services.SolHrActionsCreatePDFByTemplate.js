
describe("[libas] sol.unittest.as.services.SolHrActionsCreatePDFByTemplate", function () {
  var obSolHrActionsCreatePDFByTemplateId, originalTimeout, content,
      folderId, name, mask, ext, mbs, overwrite, rendererOptions, templateId, targetFolderId, pdfName, pdfMaskId, objId, key, value;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolHrActionsCreatePDFByTemplate").then(function success(obSolHrActionsCreatePDFByTemplateId1) {
        obSolHrActionsCreatePDFByTemplateId = obSolHrActionsCreatePDFByTemplateId1;
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
    describe("sol.hr.as.actions.CreatePDFByTemplate", function () {
      it("docExists", function (done) {
        expect(function () {
          folderId = "folderId1";
          name = "name1";
          mask = "mask1";
          ext = "ext1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: {},
              method: "docExists",
              params: [folderId, name, mask, ext]
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
      it("genSordZ", function (done) {
        expect(function () {
          name = "name1";
          mbs = [];
          overwrite = "overwrite1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: {},
              method: "genSordZ",
              params: [name, mbs, overwrite]
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
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: {},
              method: "getName",
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
      it("getPdfGenerator", function (done) {
        expect(function () {
          rendererOptions = { targetId: obSolHrActionsCreatePDFByTemplateId };
          templateId = "templateId1";
          targetFolderId = obSolHrActionsCreatePDFByTemplateId;
          pdfName = "pdfName1";
          pdfMaskId = "pdfMaskId1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: {},
              method: "getPdfGenerator",
              params: [rendererOptions, templateId, targetFolderId, pdfName, pdfMaskId]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: { pdfName: "pdfName1", templateId: "templateId1", targetFolderId: obSolHrActionsCreatePDFByTemplateId },
              method: "process",
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
      it("setObjKey", function (done) {
        expect(function () {
          objId = obSolHrActionsCreatePDFByTemplateId;
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.hr.as.services.ExecuteLib",
            config: {
              className: "sol.hr.as.actions.CreatePDFByTemplate",
              classConfig: {},
              method: "setObjKey",
              params: [objId, key, value]
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