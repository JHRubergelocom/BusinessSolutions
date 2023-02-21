
describe("[function] sol.meeting.as.functions.CreateMeetingMinutes", function () {
  var originalTimeout, content, objMeetingId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateMeetingMinutes").then(function success(objTempId) {
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
  describe("test CreateMeetingMinutes", function () {
    it("start as functions CreateMeetingMinutes", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          objId: objMeetingId,
          action: "sol.meeting.as.functions.CreateMeetingMinutes",
          config: {
            fields: {
              versionComment: "MEETING_MINUTES_VERSION_COMMENT",
              documentName: "MEETING_MINUTES_DOCUMENTNAME",
              settingPartial: "SETTING_MINUTES_CREATE_PARTIAL",
              settingTotal: "SETTING_MINUTES_CREATE_TOTAL"
            },
            solType: "MEETING_MINUTES_DOCUMENT",
            template: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/meeting/Configuration/Meeting minutes templates/Default",
            subFolder: "{{translate 'sol.meeting.meetingMinutes.document.subFolderName' settings.language}}",
            fileName: {
              partial: {
                prefix: "{{translate 'sol.meeting.meetingMinutes.document.partialPrefix' settings.language}} - "
              },
              prefix: "{{translate 'sol.meeting.meetingMinutes.document.prefix' settings.language}} - "
            }
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