
describe("[service] sol.meeting.ix.services.GetLocalizedKeywordListValues", function () {
  var originalTimeout, keywordListEntry, composePath, str, keywordListsConfigs;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetLocalizedKeywordListValues").then(function success(objTempId) {
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
    describe("sol.meeting.ix.services.GetLocalizedKeywordListValues", function () {
      it("getTranslatedLocalizedKwl", function (done) {
        expect(function () {
          keywordListEntry = "keywordListEntry1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "getTranslatedLocalizedKwl",
            params: [keywordListEntry]
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
      it("isCacheDisabled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "isCacheDisabled",
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
      it("isCacheEnabled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "isCacheEnabled",
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
      it("loadConfig", function (done) {
        expect(function () {
          composePath = "/meeting/Configuration/localizedKwls.config";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "loadConfig",
            params: [composePath]
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
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
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
      it("processKeywordList", function (done) {
        expect(function () {
          composePath = "/meeting/Configuration/localizedKwls.config";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "processKeywordList",
            params: [composePath]
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
      it("resetCache", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "resetCache",
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
      it("translate", function (done) {
        expect(function () {
          str = "str1";
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "translate",
            params: [str]
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
      it("translateKeywordList", function (done) {
        expect(function () {
          keywordListsConfigs = {};
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteLib1", {
            className: "sol.meeting.ix.services.GetLocalizedKeywordListValues",
            classConfig: { lang: "de" },
            method: "translateKeywordList",
            params: [keywordListsConfigs]
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
    describe("RF_sol_meeting_service_GetLocalizedKeywordListValues", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetLocalizedKeywordListValues", {
          }).then(function success(jsonResult) {
            expect(jsonResult.config).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with profile", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_meeting_service_GetLocalizedKeywordListValues", {
            lang: "de"
          }).then(function success(jsonResult) {
            expect(jsonResult.config).toBeDefined();
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