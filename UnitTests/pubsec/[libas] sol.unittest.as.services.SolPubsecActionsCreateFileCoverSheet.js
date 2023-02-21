
describe("[libas] sol.unittest.as.services.SolPubsecActionsCreateFileCoverSheet", function () {
  var originalTimeout, content, config, obSolPubsecActionsCreateFileCoverSheetId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecActionsCreateFileCoverSheet").then(function success(obSolPubsecActionsCreateFileCoverSheetId1) {
        obSolPubsecActionsCreateFileCoverSheetId = obSolPubsecActionsCreateFileCoverSheetId1;
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
    describe("sol.pubsec.as.actions.CreateFileCoverSheet", function () {
      it("getName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.pubsec.as.services.ExecuteLib",
            config: {
              className: "sol.pubsec.as.actions.CreateFileCoverSheet",
              classConfig: { templateId: obSolPubsecActionsCreateFileCoverSheetId, parentId: obSolPubsecActionsCreateFileCoverSheetId, targetId: obSolPubsecActionsCreateFileCoverSheetId },
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
              className: "sol.pubsec.as.actions.CreateFileCoverSheet",
              classConfig: { templateId: obSolPubsecActionsCreateFileCoverSheetId, parentId: obSolPubsecActionsCreateFileCoverSheetId, targetId: obSolPubsecActionsCreateFileCoverSheetId },
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
              className: "sol.pubsec.as.actions.CreateFileCoverSheet",
              classConfig: { templateId: obSolPubsecActionsCreateFileCoverSheetId, parentId: obSolPubsecActionsCreateFileCoverSheetId, targetId: obSolPubsecActionsCreateFileCoverSheetId },
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