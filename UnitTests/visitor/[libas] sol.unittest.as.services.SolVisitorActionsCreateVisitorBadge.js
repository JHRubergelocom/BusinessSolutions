
describe("[libas] sol.unittest.as.services.SolVisitorActionsCreateVisitorBadge", function () {
  var originalTimeout, content, badgeTemplateName, config, visitorSords, obSolVisitorActionsCreateVisitorBadgeId, objSingleVisitorId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolVisitorActionsCreateVisitorBadge").then(function success(obSolVisitorActionsCreateVisitorBadgeId1) {
        obSolVisitorActionsCreateVisitorBadgeId = obSolVisitorActionsCreateVisitorBadgeId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          objSingleVisitorId = sordSingleVisitor.id;
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
    describe("sol.visitor.as.actions.CreateVisitorBadge", function () {
      it("getBadgeTemplateArcPath", function (done) {
        expect(function () {
          badgeTemplateName = "badgeTemplateName1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.visitor.as.services.ExecuteLib",
            config: {
              className: "sol.visitor.as.actions.CreateVisitorBadge",
              classConfig: { templateId: obSolVisitorActionsCreateVisitorBadgeId },
              method: "getBadgeTemplateArcPath",
              params: [badgeTemplateName]
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
            action: "sol.unittest.visitor.as.services.ExecuteLib",
            config: {
              className: "sol.visitor.as.actions.CreateVisitorBadge",
              classConfig: { templateId: obSolVisitorActionsCreateVisitorBadgeId },
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
          config = { templateId: obSolVisitorActionsCreateVisitorBadgeId };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.visitor.as.services.ExecuteLib",
            config: {
              className: "sol.visitor.as.actions.CreateVisitorBadge",
              classConfig: { templateId: obSolVisitorActionsCreateVisitorBadgeId },
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
      it("markAsPrinted", function (done) {
        expect(function () {
          visitorSords = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.visitor.as.services.ExecuteLib",
            config: {
              className: "sol.visitor.as.actions.CreateVisitorBadge",
              classConfig: { templateId: obSolVisitorActionsCreateVisitorBadgeId },
              method: "markAsPrinted",
              params: [visitorSords]
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
            action: "sol.unittest.visitor.as.services.ExecuteLib",
            config: {
              className: "sol.visitor.as.actions.CreateVisitorBadge",
              classConfig: { parentId: objSingleVisitorId, targetId: obSolVisitorActionsCreateVisitorBadgeId, templateId: obSolVisitorActionsCreateVisitorBadgeId },
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