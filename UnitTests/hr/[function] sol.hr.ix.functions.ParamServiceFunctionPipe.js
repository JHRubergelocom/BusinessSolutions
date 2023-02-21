
describe("[function] sol.hr.ix.functions.ParamServiceFunctionPipe", function () {
  var objParamServiceFunctionPipeId, originalTimeout,
      params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ParamServiceFunctionPipe").then(function success(objParamServiceFunctionPipeId1) {
        objParamServiceFunctionPipeId = objParamServiceFunctionPipeId1;
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
    describe("sol.hr.ix.functions.ParamServiceFunctionPipe", function () {
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.ParamServiceFunctionPipe",
            classConfig: {},
            method: "initialize",
            params: [params]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.ParamServiceFunctionPipe",
            classConfig: { paramService: "RF_sol_hr_service_GetPersonnelFileTypes", targetFunction: "RF_sol_hr_service_GetEmployeeBadgeTypes" },
            method: "process",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_function_ParamServiceFunctionPipe", function () {
      it("should throw if executed without 'paramService'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ParamServiceFunctionPipe", {
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
      it("should throw if executed without 'targetFunction'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ParamServiceFunctionPipe", {
            paramService: "RF_sol_hr_service_GetPersonnelFileTypes"
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
      it("should not throw if executed without 'registerUpdate'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ParamServiceFunctionPipe", {
            paramService: "RF_sol_hr_service_GetPersonnelFileTypes",
            targetFunction: "RF_sol_hr_service_GetEmployeeBadgeTypes"
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ParamServiceFunctionPipe", {
            objId: objParamServiceFunctionPipeId,
            paramService: "RF_sol_hr_service_GetPersonnelFileTypes",
            targetFunction: "RF_sol_hr_service_GetEmployeeBadgeTypes",
            registerUpdate: "sol.hr.as.functions.RegisterPersonnelFileUpdate"
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
      test.Utils.getTempfolder().then(function success2(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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