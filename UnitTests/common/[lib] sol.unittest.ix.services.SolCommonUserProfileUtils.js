
describe("[lib] sol.unittest.ix.services.SolCommonUserProfileUtils", function () {
  var UserProfileUtilsSord, userName, userInfo, originalTimeout, optionValue, bitMask, flag;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonUserProfileUtils").then(function success(obSolCommonUserProfileUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/UserProfileUtils").then(function success1(UserProfileUtilsSord1) {
          UserProfileUtilsSord = UserProfileUtilsSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.UserProfileUtils", function () {
      xit("isOptionBitSet", function (done) {
        expect(function () {
          optionValue = PVALUE;
          bitMask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserProfileUtils",
            classConfig: {},
            method: "isOptionBitSet",
            params: [optionValue, bitMask]
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
      xit("setOptionBit", function (done) {
        expect(function () {
          optionValue = PVALUE;
          flag = PVALUE;
          bitMask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.UserProfileUtils",
            classConfig: {},
            method: "setOptionBit",
            params: [optionValue, flag, bitMask]
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