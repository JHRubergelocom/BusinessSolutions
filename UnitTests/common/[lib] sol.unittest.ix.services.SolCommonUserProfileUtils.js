
describe("[lib] sol.unittest.ix.services.SolCommonUserProfileUtils", function () {
  var originalTimeout, optionValue, bitMask, flag;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonUserProfileUtils").then(function success(obSolCommonUserProfileUtilsId) {
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
    describe("sol.common.UserProfileUtils", function () {
      it("isOptionBitSet", function (done) {
        expect(function () {
          optionValue = 7;
          bitMask = 4;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserProfileUtils",
            classConfig: {},
            method: "isOptionBitSet",
            params: [optionValue, bitMask]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setOptionBit", function (done) {
        expect(function () {
          optionValue = 3;
          flag = true;
          bitMask = 4;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserProfileUtils",
            classConfig: {},
            method: "setOptionBit",
            params: [optionValue, flag, bitMask]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(7);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setOptionBit", function (done) {
        expect(function () {
          optionValue = 53;
          flag = false;
          bitMask = 4;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserProfileUtils",
            classConfig: {},
            method: "setOptionBit",
            params: [optionValue, flag, bitMask]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(49);
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