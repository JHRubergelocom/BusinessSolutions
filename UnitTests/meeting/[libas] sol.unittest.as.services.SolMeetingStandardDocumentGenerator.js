/* eslint-disable linebreak-style */

describe("[libas] sol.unittest.as.services.SolMeetingStandardDocumentGenerator", function () {
  var originalTimeout, content, objMeetingId, folderId,
      n1, mask, ext, fileName, documentGeneratorConfig,
      settingKey, createPartial, config, flowId,
      succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeetingStandardDocumentGenerator").then(function success(obSolMeetingStandardDocumentGeneratorId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
          documentGeneratorConfig = {
            fields: {
              versionComment: "MEETING_FILE_VERSION_COMMENT",
              documentName: "MEETING_MINUTES_DOCUMENTNAME"
            },
            solType: "MEETING_MINUTES_DOCUMENT",
            template: "/meeting_premium/Configuration/Meeting file templates/Default",
            subFolder: "{{translate 'sol.meeting_premium.meetingFile.document.subFolderName' settings.language}}"
          };
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
    describe("sol.meeting.as.functions.StandardDocumentGenerator", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", objMeetingId).then(function success(flowId1) {
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
      it("checkWfMapSetting", function (done) {
        expect(function () {
          settingKey = documentGeneratorConfig.fields.settingPartial;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "checkWfMapSetting",
              params: [settingKey]
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
      it("createDocument", function (done) {
        expect(function () {
          createPartial = true;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "createDocument",
              params: [createPartial]
            }
          }).then(function success(jsonResult) {
            content = jsonResult.content;
            if (content.indexOf("exception") != -1) {
              console.error(jsonResult.content);
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
      it("createDocuments", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "createDocuments",
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
      it("docExists", function (done) {
        expect(function () {
          folderId = objMeetingId;
          n1 = "Meeting Minutes";
          mask = "Meeting Document";
          ext = "pdf";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "docExists",
              params: [folderId, n1, mask, ext]
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
      it("getAdditionalSordData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getAdditionalSordData",
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
      it("getDataCollector", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getDataCollector",
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
      it("getFileName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getFileName",
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
      it("getLanguage", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getLanguage",
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
      it("getOwnerId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getOwnerId",
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
      it("getRenderer", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getRenderer",
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
      it("getRendererConfig", function (done) {
        expect(function () {
          fileName = "Meeting Minutes";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getRendererConfig",
              params: [fileName]
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
      it("getTargetMask", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getTargetMask",
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
      it("getVersionComment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "getVersionComment",
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
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
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
      it("isPartial", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "isPartial",
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
      it("isTotal", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig, flowId: flowId },
              method: "isTotal",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.meeting.as.services.ExecuteLib",
            config: {
              className: "sol.meeting.as.functions.StandardDocumentGenerator",
              classConfig: { flowId: flowId, objId: objMeetingId, documentGeneratorConfig: documentGeneratorConfig },
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow1) {
            succNodes = test.Utils.getSuccessorNodes(workflow1, "1", null, "node 2");
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