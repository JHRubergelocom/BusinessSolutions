
describe("[lib] sol.unittest.ix.services.SolCommonTranslateTerms", function () {
  var originalTimeout, language, prefixes, additionalLanguage, key, requestedTerm;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTranslateTerms").then(function success(obSolCommonTranslateTermsId) {
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
    describe("sol.common.TranslateTerms", function () {
      it("addLang", function (done) {
        expect(function () {
          language = "de";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: { languages: [] },
            method: "addLang",
            params: [language]
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
      it("filterPrefixes", function (done) {
        expect(function () {
          prefixes = ["de", "en"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "filterPrefixes",
            params: [prefixes]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(["de", "en"]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getLangs", function (done) {
        expect(function () {
          additionalLanguage = "de";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "getLangs",
            params: [additionalLanguage]
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
      it("getTerm", function (done) {
        expect(function () {
          language = "de";
          key = "sol.common.wf.node.cancel";
          requestedTerm = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "getTerm",
            params: [language, key, requestedTerm]
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
      it("rememberPrefixes", function (done) {
        expect(function () {
          prefixes = ["de", "en"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "rememberPrefixes",
            params: [prefixes]
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
      it("require", function (done) {
        expect(function () {
          prefixes = ["de", "en"];
          additionalLanguage = "fr";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "require",
            params: [prefixes, additionalLanguage]
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
          key = "sol.common.wf.node.cancel";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TranslateTerms",
            classConfig: {},
            method: "translate",
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