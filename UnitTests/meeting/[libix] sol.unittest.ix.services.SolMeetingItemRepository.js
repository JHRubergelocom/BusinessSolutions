/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolMeetingItemRepository", function () {
  var originalTimeout, objMeetingId, itemOutput, output,
      meetingRef, meetingReference, optimizationName,
      sordMeetingItem, config, key, id, ref, meetingItemId,
      itemSord, options, sordId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolMeetingItemRepository").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
          test.Utils.getSord(objMeetingId).then(function success2(sordMeeting) {
            meetingReference = test.Utils.getObjKeyValue(sordMeeting, "MEETING_REFERENCE");
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.MeetingItemRepository", function () {
      it("get 'itemOutput' configuration from meetingItem.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/meetingItem.config"
          }).then(function success(configResult) {
            itemOutput = configResult.config.meetingItem.outputs.itemFull;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("itemOutput must be available", function () {
        expect(itemOutput).toBeDefined();
      });
      it("findItemsByMeeting", function (done) {
        expect(function () {
          meetingRef = meetingReference;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findItemsByMeeting",
            params: [meetingRef]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("findItemsByMeeting", function (done) {
        expect(function () {
          meetingRef = meetingReference;
          output = itemOutput;
          optimizationName = "agenda";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findItemsByMeeting",
            params: [meetingRef, output, optimizationName]
          }).then(function success(jsonResult) {
            expect(jsonResult.sords).toBeDefined();
            sordMeetingItem = jsonResult.sords[0];
            meetingItemId = test.Utils.getObjKeyValue(sordMeetingItem, "MEETING_ITEM_ID");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertSpeakerTable", function (done) {
        expect(function () {
          itemSord = sordMeetingItem;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "convertSpeakerTable",
            params: [itemSord]
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
      it("createMeetingItem", function (done) {
        expect(function () {
          itemSord = sordMeetingItem;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "createMeetingItem",
            params: [itemSord]
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
      it("findAgendaPoolItemsByMeeting", function (done) {
        expect(function () {
          meetingRef = meetingReference;
          output = itemOutput;
          optimizationName = "agenda";
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findAgendaPoolItemsByMeeting",
            params: [meetingRef, output, optimizationName, options]
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
      it("findAttachmentsByItem", function (done) {
        expect(function () {
          id = sordMeetingItem.id;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findAttachmentsByItem",
            params: [id]
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
      it("findFirstItemInParentHierarchy", function (done) {
        expect(function () {
          sordId = objMeetingId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findFirstItemInParentHierarchy",
            params: [sordId]
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
      it("findMeetingItem", function (done) {
        expect(function () {
          id = sordMeetingItem.id;
          output = itemOutput;
          optimizationName = "meeting-item";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findMeetingItem",
            params: [id, output, optimizationName]
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
      it("findMeetingItemById", function (done) {
        expect(function () {
          id = sordMeetingItem.id;
          output = itemOutput;
          optimizationName = "meeting-item";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findMeetingItemById",
            params: [id, output, optimizationName]
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
      it("findMeetingItemByRef", function (done) {
        expect(function () {
          ref = meetingItemId;
          output = itemOutput;
          optimizationName = "meeting-item";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findMeetingItemByRef",
            params: [ref, output, optimizationName]
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
      it("findNormalItemsByMeeting", function (done) {
        expect(function () {
          meetingRef = meetingReference;
          output = itemOutput;
          optimizationName = "agenda";
          options = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.ix.MeetingItemRepository",
            classConfig: {},
            method: "findNormalItemsByMeeting",
            params: [meetingRef, output, optimizationName, options]
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
    describe("sol.meeting.entity.MeetingItem", function () {
      it("get", function (done) {
        expect(function () {
          key = "itemId";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: { data: sordMeetingItem },
            method: "get",
            params: [key]
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
      it("getDayIndex", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: {  data: sordMeetingItem },
            method: "getDayIndex",
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
      it("getReference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: { data: sordMeetingItem },
            method: "getReference",
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
          config = { data: sordMeetingItem };
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: { data: sordMeetingItem },
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
      it("isInAgendaPool", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: { data: sordMeetingItem },
            method: "isInAgendaPool",
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
      it("isMeetingItem", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib", {
            className: "sol.meeting.entity.MeetingItem",
            classConfig: { data: sordMeetingItem },
            method: "isMeetingItem",
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