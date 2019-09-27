
describe("[lib] sol.unittest.ix.services.SolCommonRoles", function () {
  var RolesSord, userName, userInfo, originalTimeout, param1, param2, userDef, userName, sord, rule, role, config, originalConfig, sordMap, condition, rolesConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonRoles").then(function success(obSolCommonRolesId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/Roles").then(function success1(RolesSord1) {
          RolesSord = RolesSord1;
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
    describe("sol.common.Roles", function () {
      xit("EQUALS", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "EQUALS",
            params: [param1, param2]
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
      xit("GE", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GE",
            params: [param1, param2]
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
      xit("GT", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "GT",
            params: [param1, param2]
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
      xit("LE", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LE",
            params: [param1, param2]
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
      xit("LT", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "LT",
            params: [param1, param2]
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
      xit("STARTSWITH", function (done) {
        expect(function () {
          param1 = PVALUE;
          param2 = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "STARTSWITH",
            params: [param1, param2]
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
      xit("getSupervisor", function (done) {
        expect(function () {
          userDef = PVALUE;
          userName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getSupervisor",
            params: [userDef, userName]
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
      xit("getUserName", function (done) {
        expect(function () {
          sord = PVALUE;
          rule = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUserName",
            params: [sord, rule]
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
      xit("getUsers", function (done) {
        expect(function () {
          role = PVALUE;
          sord = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsers",
            params: [role, sord, config]
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
      xit("getUsers2", function (done) {
        expect(function () {
          role = PVALUE;
          sord = PVALUE;
          originalConfig = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsers2",
            params: [role, sord, originalConfig]
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
      xit("getUsersByRole", function (done) {
        expect(function () {
          role = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getUsersByRole",
            params: [role, config]
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
      xit("getValue", function (done) {
        expect(function () {
          sord = PVALUE;
          sordMap = PVALUE;
          condition = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "getValue",
            params: [sord, sordMap, condition]
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
      xit("retrieveRole", function (done) {
        expect(function () {
          role = PVALUE;
          rolesConfig = PVALUE;
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.Roles",
            classConfig: {},
            method: "retrieveRole",
            params: [role, rolesConfig, sord]
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