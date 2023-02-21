
describe("[dynkwl] sol.recruiting.ix.dynkwls.BulkMailingTemplates", function () {
  var originalTimeout, objBulkMailingTemplatesId, kwlConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("BulkMailingTemplates").then(function success(objBulkMailingTemplatesId1) {
        objBulkMailingTemplatesId = objBulkMailingTemplatesId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.recruiting.ix.dynkwl.BulkMailingTemplates", function () {
      it("get 'Bulk Mailing Templates' configuration from kwl.config", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetConfig", {
            objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/kwl.config"
          }).then(function success(configResult) {
            kwlConfig = configResult.config["Bulk Mailing Templates"];
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("kwlConfig must be available", function () {
        expect(kwlConfig).toBeDefined();
      });
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteDynKwl", {
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteDynKwl", {
            objId: objBulkMailingTemplatesId
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteDynKwl", {
            objId: objBulkMailingTemplatesId,
            dynKwl: "sol.common.ix.GenericDynKwl"
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteDynKwl", {
            objId: objBulkMailingTemplatesId,
            dynKwl: "sol.common.ix.GenericDynKwl",
            providerConfig: kwlConfig
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteDynKwl", {
            objId: objBulkMailingTemplatesId,
            dynKwl: "sol.common.ix.GenericDynKwl",
            providerConfig: kwlConfig,
            inputFieldName: "UNITTEST_FIELD2"
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