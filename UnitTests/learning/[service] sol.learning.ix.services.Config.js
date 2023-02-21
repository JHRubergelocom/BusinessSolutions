
describe("[service] sol.learning.ix.services.Config", function () {
  var originalTimeout,
      lang, options, config, requiredProps, packageName,
      locales, fallback;

  beforeAll(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.services.GetConfig", function () {
      it("extendSelectedLanguagesOptions", function (done) {
        expect(function () {
          lang = "de";
          options = {
            startImage: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/learning/Configuration/Resources/Start page header image",
            startContent: "<h1>Willkommen bei ELO Learning</h1><br/>Für Fragen zu laufenden Kursen oder Schulungen wenden Sie sich bitte an die Personalabteilung.",
            startHeadline: "Schlaue Köpfe für unseren Erfolg!",
            startSubheadline: "Nutzen Sie die gebotenen Möglichkeiten zur Weiterbildung und erweitern Sie so Ihren Horizont mit ELO Learning."
          };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "extendSelectedLanguagesOptions",
            params: [lang, options]
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
      it("getCleanedConfig", function (done) {
        expect(function () {
          config = {};
          requiredProps = [];
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "getCleanedConfig",
            params: [config, requiredProps]
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
      it("getEnvironment", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "getEnvironment",
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
      it("getKwls", function (done) {
        expect(function () {
          lang = "DE";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "getKwls",
            params: [lang]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "getTypes",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "initialize",
            params: [config]
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
      it("isPackageInstalled", function (done) {
        expect(function () {
          packageName = "notify";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "isPackageInstalled",
            params: [packageName]
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
      it("prepareCourseLocales", function (done) {
        expect(function () {
          locales = {
            active: true,
            defaultLocale: "en",
            supportedLocales: [
              {
                locale: "de",
                text: "{{translate 'sol.learning.lang.de'}}",
                options: {
                  startImage: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/learning/Configuration/Resources/Start page header image",
                  startContent: "<h1>Willkommen bei ELO Learning</h1><br/>Für Fragen zu laufenden Kursen oder Schulungen wenden Sie sich bitte an die Personalabteilung.",
                  startHeadline: "Schlaue Köpfe für unseren Erfolg!",
                  startSubheadline: "Nutzen Sie die gebotenen Möglichkeiten zur Weiterbildung und erweitern Sie so Ihren Horizont mit ELO Learning."
                }
              },
              {
                locale: "en",
                text: "{{translate 'sol.learning.lang.en'}}",
                options: {
                  startImage: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions Custom/learning/Configuration/Resources/Start page header image",
                  startContent: "<h1>Welcome to ELO Learning</h1><br/>For questions about current courses or trainings, please contact the personnel department.",
                  startHeadline: "Smart minds make for success!",
                  startSubheadline: "Take advantage of the opportunities offered for further training and broaden your horizons with ELO Learning."
                }
              }
            ]
          };
          fallback = "de";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
            classConfig: {},
            method: "prepareCourseLocales",
            params: [locales, fallback]
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.services.GetConfig",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_learning_service_GetConfig", function () {
      it("result should return courseTypes, learningPathTypes, courseLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetConfig", {
          }).then(function success(result) {
            expect(result.environment.knowledge.installed).toEqual(true);
            expect(result.courseTypes).toBeDefined();
            expect(result.courseLocales).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("result should return requiredConfigProperties, pageStyle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_learning_service_GetConfig", {
            requiredConfigProperties: [],
            pageStyle: "standalone",
            lang: "DE"
          }).then(function success(result) {
            expect(result.environment.knowledge.installed).toEqual(true);
            expect(result.courseTypes).toBeDefined();
            expect(result.courseLocales).toBeDefined();
            expect(result.pageStyle).toBeDefined();
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
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});