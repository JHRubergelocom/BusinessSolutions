
describe("[dynkwl] sol.meeting.ix.localizedKwl.ResolutionStatus", function () {
  var originalTimeout, objResolutionStatusId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ResolutionStatus").then(function success(objResolutionStatusId1) {
        objResolutionStatusId = objResolutionStatusId1;
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
    describe("sol.meeting.ix.localizedKwl.ResolutionStatus", function () {
      it("initialize", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.localizedKwl.ResolutionStatus",
            classConfig: {},
            method: "initialize",
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
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.meeting.ix.localizedKwl.ResolutionStatus", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objResolutionStatusId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objResolutionStatusId,
            dynKwl: "sol.meeting.ix.localizedKwl.ResolutionStatus"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objResolutionStatusId,
            dynKwl: "sol.meeting.ix.localizedKwl.ResolutionStatus",
            providerConfig: {}
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objResolutionStatusId,
            dynKwl: "sol.meeting.ix.localizedKwl.ResolutionStatus",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.header).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
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