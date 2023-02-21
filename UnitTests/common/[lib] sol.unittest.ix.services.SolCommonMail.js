/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonMail", function () {
  var MailSord, obSolCommonMailId, originalTimeout,
      multiPart, to, from, attConfig, subj, def, config, repoPath,
      flowId, succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMail").then(function success(obSolCommonMailId1) {
        obSolCommonMailId = obSolCommonMailId1;
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/WordDocument").then(function success1(MailSord1) {
          MailSord = MailSord1;
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
    describe("sol.common.Mail", function () {
      it("addBody", function (done) {
        expect(function () {
          multiPart = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "addBody",
            params: [multiPart]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkKey", function (done) {
        expect(function () {
          to = { key: "to" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "checkKey",
            params: [to]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", obSolCommonMailId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("checkWorkflowProps", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: { flowId: flowId },
            method: "checkWorkflowProps",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getAttAsStream", function (done) {
        expect(function () {
          attConfig = { objId: MailSord.id };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getAttAsStream",
            params: [attConfig]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: { objId: obSolCommonMailId, flowId: flowId, nodeId: "1" },
            method: "getData",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getPasswordAuthentication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getPasswordAuthentication",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getRecipient", function (done) {
        expect(function () {
          to = "test-business-solutions@elo.local";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getRecipient",
            params: [to]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSender", function (done) {
        expect(function () {
          from = "test-business-solutions@elo.local";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getSender",
            params: [from]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSubject", function (done) {
        expect(function () {
          subj = "Subject1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getSubject",
            params: [subj]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getValue", function (done) {
        expect(function () {
          def = "def1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "getValue",
            params: [def]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getWorkflow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: { flowId: flowId, nodeId: "1" },
            method: "getWorkflow",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("initSession", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "initSession",
            params: []
          }).then(function success(jsonResult) {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "initialize",
            params: [config]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("loadMailConfig", function (done) {
        expect(function () {
          repoPath = "/Administration/Business Solutions/common/Configuration/mail.config";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "loadMailConfig",
            params: [repoPath]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("logJavaMailInfo", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "logJavaMailInfo",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("send", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: { from: "test-business-solutions@elo.local", to: "test-business-solutions@elo.local", subject: "subject1" },
            method: "send",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("transferConfigs", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.Mail",
            classConfig: {},
            method: "transferConfigs",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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