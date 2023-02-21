/* eslint-disable linebreak-style */

describe("[function] sol.recruiting.ix.functions.GeneratePostingNo", function () {
  var originalTimeout, sordPosting,
      No;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GeneratePostingNo").then(function success(objGeneratePostingNoId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Test data/Requisition/Posting").then(function success2(sordPosting1) {
          sordPosting = sordPosting1;
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
    describe("sol.recruiting.ix.functions.generators.GeneratePostingNo", function () {
      it("getIdentifier", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.generators.GeneratePostingNo",
            classConfig: {},
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.generators.GeneratePostingNo",
            classConfig: {},
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
      it("setIdentifier", function (done) {
        expect(function () {
          No = "No1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.generators.GeneratePostingNo",
            classConfig: {},
            method: "setIdentifier",
            params: [No]
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
    describe("RF_sol_recruiting_function_generatePostingNo", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_generatePostingNo", {
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
      it("generate posting no", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_generatePostingNo", {
            objId: sordPosting.id,
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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