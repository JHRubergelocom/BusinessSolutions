
describe("[service] sol.meeting.ix.services.GetMeetingItemTypes", function () {
  var originalTimeout, keys, src, translate, path, objIds,
      infos, search, type, obj, s, x;

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
  describe("Test Lib Functions", function () {
    describe("sol.meeting.ix.services.GetMeetingItemTypes", function () {
      it("buildObj", function (done) {
        keys = [];
        src = {};
        translate = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "buildObj",
            params: [keys, src, translate]
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
      it("getStandardTypes", function (done) {
        expect(function () {
          path = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/meeting/Configuration/Meeting item types";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "getStandardTypes",
            params: [path]
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
      it("getTypes", function (done) {
        expect(function () {
          objIds = [];
          infos = [];
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "getTypes",
            params: [objIds, infos]
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
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
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
      it("startsWith", function (done) {
        expect(function () {
          search = "text1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "startsWith",
            params: [search]
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
      it("toInfo", function (done) {
        expect(function () {
          type = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "toInfo",
            params: [type]
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
      it("toLocalizedType", function (done) {
        expect(function () {
          type = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "toLocalizedType",
            params: [type]
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
      it("toObjId", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "toObjId",
            params: [obj]
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
      it("translate", function (done) {
        expect(function () {
          s = "text1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "translate",
            params: [s]
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
      it("truthy", function (done) {
        expect(function () {
          x = "x1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetMeetingItemTypes",
            classConfig: {},
            method: "truthy",
            params: [x]
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