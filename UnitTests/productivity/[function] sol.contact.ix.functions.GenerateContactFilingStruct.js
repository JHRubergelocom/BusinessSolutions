/* eslint-disable linebreak-style */

describe("[function] sol.contact.ix.functions.GenerateContactFilingStruct", function () {
  var originalTimeout, sordContact, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateContactFilingStruct").then(function success(objGenerateContactFilingStructId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/productivity [unit tests]/Test data/ContactList/Contact").then(function success2(sordContact1) {
          sordContact = sordContact1;
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
    describe("sol.contact.ix.functions.generators.GenerateContactFilingStruct", function () {
      it("getTemplateId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib1", {
            className: "sol.contact.ix.functions.generators.GenerateContactFilingStruct",
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
            className: "sol.contact.ix.functions.generators.GenerateContactFilingStruct",
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
    describe("RF_sol_contact_function_GenerateContactFilingStruct", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_function_GenerateContactFilingStruct", {
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
      it("generate contact filingstructure", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contact_function_GenerateContactFilingStruct", {
            objId: sordContact.id,
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