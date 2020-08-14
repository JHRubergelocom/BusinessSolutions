
describe("[function] sol.datev.accounting.ix.functions.CheckStatusPreCondition", function () {
  var originalTimeout, objRDId1, objRDId2;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckStatusPreCondition").then(function success(objTempId) {
        test.Utils.createSord(objTempId, "Receipt Document", "TestReceiptDocument1", { INVOICE_STATUS: 4 }).then(function success1(objRDId11) {
          objRDId1 = objRDId11;
          test.Utils.createSord(objTempId, "Receipt Document", "TestReceiptDocument2", { INVOICE_STATUS: 5 }).then(function success2(objRDId21) {
            objRDId2 = objRDId21;
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
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_accounting_function_CheckPostingProposalPreCondition", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_accounting_function_CheckPostingProposalPreCondition", {
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
      it("check posting proposal pre condition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_accounting_function_CheckPostingProposalPreCondition", {
            targetId: objRDId2
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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
    describe("RF_sol_accounting_function_CheckLockPreCondition", function () {
      it("should throw if executed without 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_accounting_function_CheckLockPreCondition", {
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
      it("check lock pre condition", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_accounting_function_CheckLockPreCondition", {
            targetId: objRDId1
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
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