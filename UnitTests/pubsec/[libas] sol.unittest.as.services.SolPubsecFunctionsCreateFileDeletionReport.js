
describe("[libas] sol.unittest.as.services.SolPubsecFunctionsCreateFileDeletionReport", function () {
  var originalTimeout, content, targetId, templateId, name, config, reportId, obSolPubsecFunctionsCreateFileDeletionReportId, objFileId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecFunctionsCreateFileDeletionReport").then(function success(obSolPubsecFunctionsCreateFileDeletionReportId1) {
        obSolPubsecFunctionsCreateFileDeletionReportId = obSolPubsecFunctionsCreateFileDeletionReportId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Fileplan/File").then(function success1(sordFile) {
          objFileId = sordFile.id;
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
    describe("sol.pubsec.as.functions.CreateFileDeletionReport", function () {
      it("generateDeletionReport", function (done) {
        expect(function () {
          targetId = obSolPubsecFunctionsCreateFileDeletionReportId;
          templateId = obSolPubsecFunctionsCreateFileDeletionReportId;
          name = "name1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
              method: "generateDeletionReport",
              params: [targetId, templateId, name]
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
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
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
      it("getTargetId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
              method: "getTargetId",
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
      it("getTemplateId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
              method: "getTemplateId",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
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
      xit("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
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
      xit("setReportRights", function (done) {
        expect(function () {
          reportId = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib1",
            config: {
              className: "sol.pubsec.as.functions.CreateFileDeletionReport",
              classConfig: { objId: objFileId },
              method: "setReportRights",
              params: [reportId]
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