
describe("[function] sol.meeting.ix.functions.ProcessEvent", function () {
  var originalTimeout, objMeetingId, isoDate, time,
      params, day, plugin;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ProcessEvent").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Meeting").then(function success1(objMeetingId1) {
          objMeetingId = objMeetingId1;
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
    describe("sol.meeting_groupware.ix.functions.ProcessEvent", function () {
      it("convertToLocalDateTime", function (done) {
        expect(function () {
          isoDate = "20200505";
          time = "1300";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "convertToLocalDateTime",
            params: [isoDate, time]
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
      it("getTplParams", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "getTplParams",
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
      it("prepareEventParameters", function (done) {
        expect(function () {
          params = {};
          day = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "prepareEventParameters",
            params: [params, day]
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
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
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
      it("processCancel", function (done) {
        expect(function () {
          params = {};
          plugin = {};
          day = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "processCancel",
            params: [params, plugin, day]
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
      it("processCreate", function (done) {
        expect(function () {
          params = {};
          plugin = {};
          day = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "processCreate",
            params: [params, plugin, day]
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
      it("processEvent", function (done) {
        expect(function () {
          params = {};
          day = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "processEvent",
            params: [params, day]
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
      it("processUpdate", function (done) {
        expect(function () {
          params = {};
          plugin = {};
          day = 1;
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "processUpdate",
            params: [params, plugin, day]
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
      it("setExecutionParams", function (done) {
        expect(function () {
          params = {};
          plugin = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting_groupware.ix.functions.ProcessEvent",
            classConfig: { objId: objMeetingId },
            method: "setExecutionParams",
            params: [params, plugin]
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