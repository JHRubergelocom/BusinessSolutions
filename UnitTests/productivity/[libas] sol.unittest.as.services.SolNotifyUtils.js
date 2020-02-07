
describe("[libas] sol.unittest.as.services.SolNotifyUtils", function () {
  var originalTimeout, content, templateNotification, titleReport,
      notifyTasks, notifyPosts, notifyEmpty, emptyIcon, userId, userPictures,
      users, objGuid, sordMaps, text, type, sordInfo, node, withGroups, withDeputies,
      withIndex, task, configReport, sordMap;

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
      it("loadReportFlags", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "loadReportFlags",
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
      it("loadUserLanguage", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "loadUserLanguage",
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
      it("loadUserTimeZone", function (done) {
        expect(function () {
          userId = "0";
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "loadUserTimeZone",
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
      it("prepareFindTasksInfo", function (done) {
        expect(function () {
          userId = "0";
          withGroups = true;
          withDeputies = true;
          withIndex = true;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "prepareFindTasksInfo",
              params: [userId, withGroups, withDeputies, withIndex]
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
          configReport = {};
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "prepareTask",
              params: [userId, task, configReport]
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
      xit("processNotifyMail", function (done) {
        expect(function () {
          userId = PVALUE;
          configReport = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processNotifyMail",
              params: [userId, configReport]
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
      xit("processTask", function (done) {
        expect(function () {
          task = PVALUE;
          userId = PVALUE;
          configReport = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "processTask",
              params: [task, userId, configReport]
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
      xit("processUser", function (done) {
        expect(function () {
          userId = PVALUE;
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
      xit("sendNotifyMail", function (done) {
        expect(function () {
          userId = PVALUE;
          notifyTasks = PVALUE;
          notifyPosts = PVALUE;
          configReport = PVALUE;
          test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
            action: "sol.unittest.productivity.as.services.ExecuteLib",
            config: {
              className: "sol.notify.as.Utils",
              classConfig: {},
              method: "sendNotifyMail",
              params: [userId, notifyTasks, notifyPosts, configReport]
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