/* eslint-disable linebreak-style */

describe("[libas] sol.unittest.as.services.SolNotifyUtils", function () {
  var originalTimeout, content, templateNotification, titleReport,
      notifyTasks, notifyPosts, notifyEmpty, emptyIcon, userId, userPictures,
      users, objGuid, sordMaps, text, type, sordInfo, node, notifyConfig, reportConfig,
      task, sordMap, notifyReminder, reminder;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolNotifyUtils").then(function success(obSolNotifyUtilsId) {
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
    describe("sol.notify.as.Utils", function () {
      it("createMailNotifyBody", function (done) {
        expect(function () {
          templateNotification = "templateNotification1";
          titleReport = "titleReport1";
          notifyTasks = ["notifyTask1", "notifyTask2"];
          notifyPosts = ["notifyPost1", "notifyPost2"];
          notifyEmpty = true;
          emptyIcon = "emptyIcon1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "createMailNotifyBody",
              params: [templateNotification, titleReport, notifyTasks, notifyPosts, notifyEmpty, emptyIcon]
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
      it("getFeedAggregation", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getFeedAggregation",
              params: [userId]
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
      it("getMailAddress", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getMailAddress",
              params: [userId]
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
      it("getNotifyPublicWfBaseUrl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getNotifyPublicWfBaseUrl",
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
      it("getNotifyWfBaseUrl", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getNotifyWfBaseUrl",
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
      it("getPictureUrl", function (done) {
        expect(function () {
          userId = "0";
          userPictures = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getPictureUrl",
              params: [userId, userPictures]
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
      it("getPictureUserName", function (done) {
        expect(function () {
          userId = "0";
          userPictures = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getPictureUserName",
              params: [userId, userPictures]
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
      it("getPictures", function (done) {
        expect(function () {
          users = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getPictures",
              params: [users]
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
      it("getSordInfo", function (done) {
        expect(function () {
          objGuid = "objGuid1";
          sordMaps = [];
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getSordInfo",
              params: [objGuid, sordMaps]
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
      it("getSordMap", function (done) {
        expect(function () {
          sordMap = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getSordMap",
              params: [sordMap]
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
      it("getTemplateSordInstance", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getTemplateSordInstance",
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
      it("getTemplateTaskInstance", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getTemplateTaskInstance",
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
      it("getText", function (done) {
        expect(function () {
          text = "text1";
          type = "SordCreated";
          sordInfo = { Type: "FOLDER" };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getText",
              params: [text, type, sordInfo]
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
      it("getUserName", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "getUserName",
              params: [userId]
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
      it("isOverPromptDate", function (done) {
        expect(function () {
          reminder = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "isOverPromptDate",
              params: [reminder]
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
      it("isOverTimeLimit", function (done) {
        expect(function () {
          node = "node1";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "isOverTimeLimit",
              params: [node]
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
      it("prepareFindTasksInfo", function (done) {
        expect(function () {
          userId = "0";
          notifyConfig = {};
          reportConfig = { reportEndDays: 1, withDeputies: true, withGroups: true };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "prepareFindTasksInfo",
              params: [userId, notifyConfig, reportConfig]
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
      it("prepareTask", function (done) {
        expect(function () {
          userId = "0";
          task = {};
          reportConfig = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "prepareTask",
              params: [userId, task, reportConfig]
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
      it("processAllUsers", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processAllUsers",
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
      it("processNotifyMail", function (done) {
        expect(function () {
          userId = "0";
          reportConfig = { reportEndDays: 1, withDeputies: true, withGroups: true };
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processNotifyMail",
              params: [userId, reportConfig]
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
      it("processTask", function (done) {
        expect(function () {
          task = {};
          userId = "0";
          reportConfig = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processTask",
              params: [task, userId, reportConfig]
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
      it("processUser", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processUser",
              params: [userId]
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
      it("sendNotifyMail", function (done) {
        expect(function () {
          userId = "0";
          notifyTasks = [];
          notifyPosts = [];
          notifyReminder = [];
          reportConfig = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "sendNotifyMail",
              params: [userId, notifyTasks, notifyPosts, notifyReminder, reportConfig]
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