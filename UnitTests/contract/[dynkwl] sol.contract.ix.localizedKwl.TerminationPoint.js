
describe("[dynkwl] sol.contract.ix.localizedKwl.TerminationPoint", function () {
  var originalTimeout, objTerminationPointId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("TerminationPoint").then(function success(objTerminationPointId1) {
        objTerminationPointId = objTerminationPointId1;
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
    describe("sol.contract.ix.localizedKwl.TerminationPoint", function () {
      it("initialize", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.localizedKwl.TerminationPoint",
            classConfig: {},
            method: "initialize",
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
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.contract.ix.localizedKwl.TerminationPoint", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteDynKwl", {
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteDynKwl", {
            objId: objTerminationPointId
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteDynKwl", {
            objId: objTerminationPointId,
            dynKwl: "sol.contract.ix.localizedKwl.TerminationPoint"
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteDynKwl", {
            objId: objTerminationPointId,
            dynKwl: "sol.contract.ix.localizedKwl.TerminationPoint",
            providerConfig: {}
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteDynKwl", {
            objId: objTerminationPointId,
            dynKwl: "sol.contract.ix.localizedKwl.TerminationPoint",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.header).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
            }
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