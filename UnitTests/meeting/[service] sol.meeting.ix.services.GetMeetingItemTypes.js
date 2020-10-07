
describe("[service] sol.meeting.ix.services.GetMeetingItemTypes", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetMeetingItemTypes").then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_meeting_service_GetMeetingItemTypes", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetMeetingItemTypes", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            expect(jsonResult[0].desc).toBeDefined();
            expect(jsonResult[0].name).toBeDefined();
            expect(jsonResult[0].objId).toBeDefined();
            expect(jsonResult[0].specificMeetingItemType).toBeDefined();
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
    describe("RF_sol_meeting_service_GetMeetingItemTypeInfos", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetMeetingItemTypeInfos", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            expect(jsonResult[0].id).toBeDefined();
            expect(jsonResult[0].guid).toBeDefined();
            expect(jsonResult[0].name).toBeDefined();
            expect(jsonResult[0].desc).toBeDefined();
            expect(jsonResult[0].specificMeetingItemType).toBeDefined();
            expect(jsonResult[0].locales).toBeDefined();
            expect(jsonResult[0].settings).toBeDefined();
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