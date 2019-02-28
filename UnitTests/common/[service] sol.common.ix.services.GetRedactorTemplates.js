
describe("[service] sol.common.ix.services.GetRedactorTemplates", function () {
  var originalTimeout, templates, render, load, objUnittestId,
      objKeysObj, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    templates = [
      { desc: "{{translate 'sol.common.form.unittest.field1'}}", value: "{{UNITTEST.objKeys.UNITTEST_FIELD1}}" },
      { desc: "{{translate 'sol.common.form.unittest.field2'}}", value: "{{UNITTEST.objKeys.UNITTEST_FIELD2}}" }
    ];
    load = {
      config: "/common [unit tests]/Test data/redactorTemplates.config",
      jsonPath: "commonServiceConfig.templates"
    };
    render = {};
    expect(function () {
      test.Utils.createTempSord("GetRedactorTemplates").then(function success(obGetRedactorTemplatesId) {
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
    describe("RF_sol_common_service_GetRedactorTemplates", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
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
      it("Get UnitTest sord", function (done) {
        expect(function () {
          objKeysObj = { UNITTEST_FIELD1: "Unittest" };
          params = { objKeysObj: objKeysObj };
          test.Utils.findSords(params).then(function success1(sords) {
            expect(sords).toBeDefined();
            expect(sords.length).toBeGreaterThan(0);
            objUnittestId = sords[0].id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Only render description text", function (done) {
        expect(function () {
          render = {
            onlyDescription: true
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Use data from sords in templating", function (done) {
        expect(function () {
          render = {
            searchAdditionalData: [
              {
                targetProp: "UNITTEST",
                doubleAsSord: true,
                masks: [],
                criteria: [
                   { key: "UNITTEST_FIELD1", value: "*" },
                   { key: "UNITTEST_FIELD2", value: "*" }
                ]
              }
            ]
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Use data from id in templating", function (done) {
        expect(function () {
          render = {
            searchAdditionalData: [
              {
                targetProp: "UNITTEST",
                doubleAsSord: true,
                id: objUnittestId
              }
            ]
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            templates: templates,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Loading templates from a configuration", function (done) {
        expect(function () {
          render = {
            onlyDescription: true
          };
          test.Utils.execute("RF_sol_common_service_GetRedactorTemplates", {
            load: load,
            render: render
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            expect(jsonResult.templates.length).toBeGreaterThan(0);
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