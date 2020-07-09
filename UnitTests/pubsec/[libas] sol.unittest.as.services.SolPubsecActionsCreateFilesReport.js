
describe("[libas] sol.unittest.as.services.SolPubsecActionsCreateFilesReport", function () {
  var originalTimeout, content, config, obSolPubsecActionsCreateFilesReportId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecActionsCreateFilesReport").then(function success(obSolPubsecActionsCreateFilesReportId1) {
        obSolPubsecActionsCreateFilesReportId = obSolPubsecActionsCreateFilesReportId1;
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
    describe("sol.pubsec.as.actions.CreateFilesReport", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.actions.CreateFilesReport",
              classConfig: { templateId: obSolPubsecActionsCreateFilesReportId, parentId: obSolPubsecActionsCreateFilesReportId, targetId: obSolPubsecActionsCreateFilesReportId },
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.actions.CreateFilesReport",
              classConfig: { templateId: obSolPubsecActionsCreateFilesReportId, parentId: obSolPubsecActionsCreateFilesReportId, targetId: obSolPubsecActionsCreateFilesReportId },
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.actions.CreateFilesReport",
              classConfig: { templateId: obSolPubsecActionsCreateFilesReportId, parentId: obSolPubsecActionsCreateFilesReportId, targetId: obSolPubsecActionsCreateFilesReportId },
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