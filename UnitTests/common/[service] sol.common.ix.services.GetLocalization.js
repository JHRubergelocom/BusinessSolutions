/* eslint-disable linebreak-style */

describe("[service] sol.common.ix.services.GetLocalization", function () {
  var originalTimeout, path, config, content, lang,
      arcpath, basePath, relativePath;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetLocalization").then(function success(obGetLocalizationId) {
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
    describe("sol.common.ix.services.GetLocalization", function () {
      it("getBasePaths", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "getBasePaths",
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
      it("getContent", function (done) {
        expect(function () {
          path = "path1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "getContent",
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
      it("getLocales", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "getLocales",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
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
      it("loadLocalizationFile", function (done) {
        expect(function () {
          arcpath = "ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "loadLocalizationFile",
            params: [arcpath]
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
      it("loadProperties", function (done) {
        expect(function () {
          content = "content1";
          lang = "de";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "loadProperties",
            params: [content, lang]
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
      it("parseProperties", function (done) {
        expect(function () {
          content = "content1";
          lang = "de";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "parseProperties",
            params: [content, lang]
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
      it("prepareLanguagePath", function (done) {
        expect(function () {
          basePath = "basePath1";
          relativePath = "relativePath1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetLocalization",
            classConfig: { lang: "de", package: "common", relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"] },
            method: "prepareLanguagePath",
            params: [basePath, relativePath]
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
    describe("RF_sol_common_service_GetLocalization", function () {
      it("should throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetLocalization", {
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
      it("With parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetLocalization", {
            lang: "de",
            package: "common",
            relativePaths: ["sol.common.apps.Configuration", "sol.common.apps.DynKwlConfig"]
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.en).toBeDefined();
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