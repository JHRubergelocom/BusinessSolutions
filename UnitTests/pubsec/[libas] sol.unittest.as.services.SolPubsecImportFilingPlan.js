
describe("[libas] sol.unittest.as.services.SolPubsecImportFilingPlan", function () {
  var originalTimeout, content, srcRef, dstRefs, csvContent,
      element, index, strData, strDelimiter, reference, obSolPubsecImportFilingPlanId, objFilePlanExcelId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecImportFilingPlan").then(function success(obSolPubsecImportFilingPlanId1) {
        obSolPubsecImportFilingPlanId = obSolPubsecImportFilingPlanId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/FilePlanExcel").then(function success1(sordFilePlanExcel) {
          objFilePlanExcelId = sordFilePlanExcel.id;
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
    describe("sol.pubsec.as.ImportFilingPlan", function () {
      it("checkIfParent", function (done) {
        expect(function () {
          srcRef = "srcRef1";
          dstRefs = "dstRefs1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId },
              method: "checkIfParent",
              params: [srcRef, dstRefs]
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
      it("convertCsvToTable", function (done) {
        expect(function () {
          csvContent = "col1;col2\ncell1;cell2";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId },
              method: "convertCsvToTable",
              params: [csvContent]
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
      it("createElement", function (done) {
        expect(function () {
          element = { FILING_PLAN_NAME: "FilingPlan1", FILING_PLAN_REFERENCE: ["ref1", "ref2"] };
          index = 1;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId, data: [1, 2] },
              method: "createElement",
              params: [element, index]
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
      it("createInitialAclItems", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId },
              method: "createInitialAclItems",
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
      it("csvToArray", function (done) {
        expect(function () {
          strData = "col1;col2\ncell1;cell2";
          strDelimiter = ";";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId },
              method: "csvToArray",
              params: [strData, strDelimiter]
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId, userId: "0" },
              method: "execute",
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
      it("findParentId", function (done) {
        expect(function () {
          reference = "reference1";
          index = "index1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.ImportFilingPlan",
              classConfig: { templObjId: objFilePlanExcelId, startFolderId: obSolPubsecImportFilingPlanId },
              method: "findParentId",
              params: [reference, index]
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