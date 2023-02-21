
describe("[service] sol.meeting.ix.services.CollectNotificationData", function () {
  var notificationId, meetingId, originalTimeout, params,
      recipient, attribute, value, obj, acc, template,
      timedEvent, sord, entries, args, optimizationKey;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CollectNotificationData").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/MG/Meetings/2021/Entwurf- MG-1. ME1 (27.10.2021)/NOTIFICATION 6052 - 1").then(function success1(sordNotification) {
          notificationId = sordNotification.id;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/MG/Meetings/2021/Entwurf- MG-1. ME1 (27.10.2021)").then(function success2(sordMeeting) {
            meetingId = sordMeeting.id;
            test.Utils.updateKeywording(sordNotification, { 
              TIMED_EVENT_SOURCE: meetingId
            }, true).then(function success3(updateKeywordingResult) {
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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.services.CollectNotificationData", function () {
      it("enhanceRecipient", function (done) {
        params = {};
        recipient = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "enhanceRecipient",
            params: [params, recipient]
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
      it("equals", function (done) {
        attribute = "attribute1";
        value = "value1";
        obj = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "equals",
            params: [attribute, value, obj]
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
      it("getFirstResult", function (done) {
        expect(function () {
          acc = {};
          template = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getFirstResult",
            params: [acc, template]
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
      it("getMapIndex", function (done) {
        params = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getMapIndex",
            params: [params]
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
      it("getMeetingFromTimedEvent", function (done) {
        timedEvent = { objKeys: { TIMED_EVENT_SOURCE: meetingId } };
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getMeetingFromTimedEvent",
            params: [timedEvent]
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
      it("getNotificationTemplate", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getNotificationTemplate",
            params: [params]
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
      it("getNotificationTemplateArcPath", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getNotificationTemplateArcPath",
            params: [params]
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
      it("getNotificationTemplateFolder", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getNotificationTemplateFolder",
            params: [params]
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
      it("getNotificationTemplateName", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getNotificationTemplateName",
            params: [params]
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
      it("getParameters", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getParameters",
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
      it("getRecipients", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getRecipients",
            params: [params]
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
      it("getSearchTemplate", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getSearchTemplate",
            params: [params]
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
      it("getSearchTemplateName", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getSearchTemplateName",
            params: [params]
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
      it("getSearchTemplatesAsArray", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getSearchTemplatesAsArray",
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
      it("getTimedEvent", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getTimedEvent",
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
      it("getTimedEventSourceId", function (done) {
        expect(function () {
          timedEvent = { objKeys: { TIMED_EVENT_SOURCE: meetingId } };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "getTimedEventSourceId",
            params: [timedEvent]
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
      it("isTimedEent", function (done) {
        expect(function () {
          sord = { objKeys: { SOL_TYPE: "TIMED_EVENT" } };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "isTimedEent",
            params: [sord]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "process",
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
      it("removeEmptyValuesFromSearchEntries", function (done) {
        expect(function () {
          entries = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "removeEmptyValuesFromSearchEntries",
            params: [entries]
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
      it("search", function (done) {
        expect(function () {
          args = {            
            masks: ["UnitTest"],
            search: [
              { key: "UNITTEST_FIELD1", value: "Unittest" },
              { key: "UNITTEST_FIELD2", value: "A*" }
            ],
            output: [
              { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
              { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
            ]
          };
          optimizationKey = null;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.CollectNotificationData",
            classConfig: { objId: notificationId },
            method: "search",
            params: [args, optimizationKey]
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_service_CollectNotificationData", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_CollectNotificationData", {
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("collect notification data", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_CollectNotificationData", {
            objId: notificationId
          }).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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