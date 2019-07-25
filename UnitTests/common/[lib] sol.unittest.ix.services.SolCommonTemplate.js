
describe("[lib] sol.unittest.ix.services.SolCommonTemplate", function () {
  var objTemplateId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonTemplate").then(function success(obSolCommonTemplateId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Template").then(function success1(templateSord) {
          objTemplateId = templateSord.id;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_unittest_service_SolCommonTemplate", function () {
      it("should throw if executed without 'method'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "Hello {{name}}."
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
      it("should throw if executed without 'params'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "Hello {{name}}.",
            method: "apply"
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
      it("{ source: 'Hello {{name}}.', method: 'apply', params: { name: 'Marcus' } }    should receive 'Hello Marcus.'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            source: "Hello {{name}}.",
            method: "apply",
            params: { name: "Marcus" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Hello Marcus.");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("{ objId: objTemplateId, method: 'load', params: { name: 'Marcus' } }    should receive 'Hello Marcus.'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_SolCommonTemplate", {
            objId: objTemplateId,
            method: "load",
            params: { name: "Marcus" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Hello Marcus.");
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