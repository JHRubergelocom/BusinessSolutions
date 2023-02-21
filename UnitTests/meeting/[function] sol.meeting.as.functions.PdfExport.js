
describe("[function] sol.meeting.as.functions.PdfExport", function () {
  var originalTimeout, content, objMeetingProposalId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("PdfExport").then(function success(objTempId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting [unit tests]/Test data/Beschlussvorlage").then(function success1(objMeetingProposalId1) {
          objMeetingProposalId = objMeetingProposalId1;
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
  describe("test PdfExport", function () {
    it("start as functions PdfExport", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          objId: objMeetingProposalId,
          action: "sol.meeting.as.functions.PdfExport",
          config: {
            objId: objMeetingProposalId
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