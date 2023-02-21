
describe("[function] sol.meeting.as.functions.CreateMeetingFile", function () {
  var originalTimeout, content, objMeetingId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateMeetingFile").then(function success(objTempId) {
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
  describe("test CreateMeetingFile", function () {
    it("start as functions CreateMeetingFile", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          objId: objMeetingId,
          action: "sol.meeting_premium.as.functions.CreateMeetingFile",
          config: {
            fields: {
              versionComment: "MEETING_FILE_VERSION_COMMENT",
              documentName: "MEETING_FILE_DOCUMENTNAME"
            },
            solType: "MEETING_FILE_DOCUMENT",
            template: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/meeting_premium/Configuration/Meeting file templates/Default",
            subFolder: "{{translate 'sol.meeting_premium.meetingFile.document.subFolderName' settings.language}}",
            fileName: {
              partial: {
                prefix: "{{translate 'sol.meeting_premium.meetingFile.document.partialPrefix' settings.language}} - "
              },
              prefix: "{{translate 'sol.meeting_premium.meetingFile.document.prefix' settings.language}} - "
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