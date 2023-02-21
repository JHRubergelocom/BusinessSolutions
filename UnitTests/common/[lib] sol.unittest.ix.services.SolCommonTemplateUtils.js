
describe("[lib] sol.unittest.ix.services.TemplateUtils", function () {
  var templateSord, originalTimeout,
      tpl, tplData, options, source;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("TemplateUtils").then(function success(obTemplateUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Template").then(function success1(templateSord1) {
          templateSord = templateSord1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.TemplateUtils", function () {
      it("compileUsingCache", function (done) {
        expect(function () {
          source = "Hello {{name}}.";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "compileUsingCache",
            params: [source]
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
      it("compileWithRetries", function (done) {
        expect(function () {
          source = "Hello {{name}}.";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "compileWithRetries",
            params: [source]
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

      it("render", function (done) {
        expect(function () {
          tpl = "{{formatDate 'DD.MM.YYYY HH:mm:ss' 20001015120030}}";
          tplData = { name: "Hans" };
          options = { emptyNonRendered: true, stringifyResults: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "render",
            params: [tpl, tplData, options]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("15.10.2000 12:00:30");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("render", function (done) {
        expect(function () {
          tpl = {
            sordId: "{{sord.id}}",
            sordGuid: "{{sord.guid}}",
            sordName: "{{sord.name}}",
            sordDescription: "{{sord.desc}}",
            sordMask: "{{sord.mask}}"
          };
          tplData = { sord: templateSord };
          options = { emptyNonRendered: true, stringifyResults: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "render",
            params: [tpl, tplData, options]
          }).then(function success(jsonResult) {
            expect(jsonResult.sordId).toBeDefined();
            expect(jsonResult.sordGuid).toBeDefined();
            expect(jsonResult.sordName).toBeDefined();
            expect(jsonResult.sordDescription).toBeDefined();
            expect(jsonResult.sordMask).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("render", function (done) {
        expect(function () {
          tpl = {
            sordId: "{{sord.id}}",
            sordGuid: "{{sord.guid}}",
            sordName: "{{sord.name}}",
            sordDescription: "{{sord.desc}}",
            sordMask: "{{sord.mask}}"
          };
          tplData = { sord: templateSord };
          options = { emptyNonRendered: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "render",
            params: [tpl, tplData, options]
          }).then(function success(jsonResult) {
            expect(jsonResult.sordId).toBeDefined();
            expect(jsonResult.sordGuid).toBeDefined();
            expect(jsonResult.sordName).toBeDefined();
            expect(jsonResult.sordDescription).toBeDefined();
            expect(jsonResult.sordMask).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("render", function (done) {
        expect(function () {
          tpl = {
            sordId: "{{sord.id}}",
            sordGuid: "{{sord.guid}}",
            sordName: "{{sord.name}}",
            sordDescription: "{{sord.desc}}",
            sordMask: "{{sord.mask}}"
          };
          tplData = { sord: templateSord };
          options = { stringifyResults: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "render",
            params: [tpl, tplData, options]
          }).then(function success(jsonResult) {
            expect(jsonResult.sordId).toBeDefined();
            expect(jsonResult.sordGuid).toBeDefined();
            expect(jsonResult.sordName).toBeDefined();
            expect(jsonResult.sordDescription).toBeDefined();
            expect(jsonResult.sordMask).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("render", function (done) {
        expect(function () {
          tpl = {
            sordId: "{{sord.id}}",
            sordGuid: "{{sord.guid}}",
            sordName: "{{sord.name}}",
            sordDescription: "{{sord.desc}}",
            sordMask: "{{sord.mask}}"
          };
          tplData = { sord: templateSord };
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.TemplateUtils",
            classConfig: {},
            method: "render",
            params: [tpl, tplData, options]
          }).then(function success(jsonResult) {
            expect(jsonResult.sordId).toBeDefined();
            expect(jsonResult.sordGuid).toBeDefined();
            expect(jsonResult.sordName).toBeDefined();
            expect(jsonResult.sordDescription).toBeDefined();
            expect(jsonResult.sordMask).toBeDefined();
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