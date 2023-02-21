/* eslint-disable linebreak-style */

describe("[function] sol.contact.ix.functions.GenerateCompanyFilingStruct", function () {
  var originalTimeout, sordCompany, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateCompanyFilingStruct").then(function success(objGenerateCompanyFilingStructId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/productivity [unit tests]/Test data/ContactList/Company").then(function success2(sordCompany1) {
          sordCompany = sordCompany1;
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
    describe("sol.contact.ix.functions.generators.GenerateCompanyFilingStruct", function () {
      it("getTemplateId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.functions.generators.GenerateCompanyFilingStruct",
            classConfig: {},
            method: "getTemplateId",
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
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.functions.generators.GenerateCompanyFilingStruct",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_contact_function_GenerateCompanyFilingStruct", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_function_GenerateCompanyFilingStruct", {
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
      it("generate company filingstructure", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_function_GenerateCompanyFilingStruct", {
            objId: sordCompany.id,
            updateExisting: true
          }).then(function success(jsonResult) {
            expect(jsonResult.filingstructure).toBeDefined();
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