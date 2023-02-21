
describe("[function] sol.contract.ix.functions.GenerateContractShortDesc", function () {
  var originalTimeout, sordPContractTemplate,
      config, shortDescription;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateContractShortDesc").then(function success(objGenerateContractShortDescId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/contract [unit tests]/Resources/ContractTemplate").then(function success2(sordPContractTemplate1) {
          sordPContractTemplate = sordPContractTemplate1;
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
    describe("sol.contract.ix.functions.generators.GenerateContractShortDesc", function () {
      it("getIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.generators.GenerateContractShortDesc",
            classConfig: { objId: sordPContractTemplate.id, updateExisting: true },
            method: "getIdentifier",
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
      it("getIdentifierTemplateId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.generators.GenerateContractShortDesc",
            classConfig: { objId: sordPContractTemplate.id, updateExisting: true },
            method: "getIdentifierTemplateId",
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.generators.GenerateContractShortDesc",
            classConfig: { objId: sordPContractTemplate.id, updateExisting: true },
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
      it("setIdentifier", function (done) {
        expect(function () {
          shortDescription = "shortDescription1";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.generators.GenerateContractShortDesc",
            classConfig: { objId: sordPContractTemplate.id, updateExisting: true },
            method: "setIdentifier",
            params: [shortDescription]
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
    describe("RF_sol_contract_function_generateContractShortDesc", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contract_function_generateContractShortDesc", {
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
      it("generate contract shortdesc", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contract_function_generateContractShortDesc", {
            objId: sordPContractTemplate.id,
            updateExisting: true
          }).then(function success(jsonResult) {
            expect(jsonResult.identifier).toBeDefined();
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