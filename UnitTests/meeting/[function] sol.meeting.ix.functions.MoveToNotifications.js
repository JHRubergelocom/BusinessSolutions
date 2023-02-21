
describe("[function] sol.meeting.ix.functions.MoveToNotifications", function () {
  var originalTimeout, objNotificationId, meetingBoardTypes,
      objId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MoveToNotifications").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Notification").then(function success1(objNotificationId1) {
          objNotificationId = objNotificationId1;
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
    describe("sol.meeting.ix.functions.MoveToNotifications", function () {
      it("get meeting boards", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardTypes", {
            $types: { 
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
              maxDescLength: 255 
            } 
          }).then(function success(meetingBoardTypes1) {
            meetingBoardTypes = meetingBoardTypes1;
            expect(meetingBoardTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("set meeting board guid mapfield in notification", function (done) {
        expect(function () {
          test.Utils.updateMapData(objNotificationId, { MEETING_BOARD_GUID: meetingBoardTypes[0].guid }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTemplateSord", function (done) {
        expect(function () {
          objId = objNotificationId;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.functions.MoveToNotifications",
            classConfig: { objId: objNotificationId },
            method: "getTemplateSord",
            params: [objId]
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
            className: "sol.meeting.ix.functions.MoveToNotifications",
            classConfig: { objId: objNotificationId },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_function_MoveToNotifications", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_MoveToNotifications", {
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
      it("get meeting boards", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_StandardTypes", {
            $types: { 
              path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting Board types",
              maxDescLength: 255 
            } 
          }).then(function success(meetingBoardTypes1) {
            meetingBoardTypes = meetingBoardTypes1;
            expect(meetingBoardTypes).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("set meeting board guid mapfield in notification", function (done) {
        expect(function () {
          test.Utils.updateMapData(objNotificationId, { MEETING_BOARD_GUID: meetingBoardTypes[0].guid }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("move to notifications", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_function_MoveToNotifications", {
            objId: objNotificationId      
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
          test.Utils.deleteSord(objNotificationId).then(function success2(deleteResult1) {
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
});