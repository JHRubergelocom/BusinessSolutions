
describe("[libas] sol.unittest.as.services.SolContractActionsPrepareDocument", function () {
  var obSolContractActionsPrepareDocumentId, sordDocumentTemplate, originalTimeout, content, name, sord, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContractActionsPrepareDocument").then(function success(obSolContractActionsPrepareDocumentId1) {
        obSolContractActionsPrepareDocumentId = obSolContractActionsPrepareDocumentId1;
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
    describe("sol.contract.as.actions.PrepareDocument", function () {
      it("createEmptyDocument", function (done) {
        expect(function () {
          name = "name1";
          sord = obSolContractActionsPrepareDocumentId;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.PrepareDocument",
              classConfig: { parentId: obSolContractActionsPrepareDocumentId },
              method: "createEmptyDocument",
              params: [name, sord]
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
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.PrepareDocument",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.PrepareDocument",
              classConfig: {},
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
      it("get DocumentTemplate", function (done) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/contract [unit tests]/Resources/DocumentTemplate").then(function success(sordDocumentTemplate1) {
          sordDocumentTemplate = sordDocumentTemplate1;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.contract.as.services.ExecuteLib",
            config: {
              className: "sol.contract.as.actions.PrepareDocument",
              classConfig: { templateId: sordDocumentTemplate.id, parentId: obSolContractActionsPrepareDocumentId },
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
      it("remove active workflows", function (done) {
        expect(function () {
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success1(removeActiveWorkflowsResult) {
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