/* eslint-disable linebreak-style */

describe("[function] sol.common.ix.functions.UserRolesToMap", function () {
  var originalTimeout, obUserRolesToMapId, userRolesConfigObjId, userRole, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UserRolesToMap").then(function success(obUserRolesToMapId1) {
        obUserRolesToMapId = obUserRolesToMapId1;
        userRolesConfigObjId = "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Test data/workflowUserRoles.config";
        userRole = { type: "SORD", key: "name" };
        test.Utils.startWorkflow("Unittest", "Unittest", obUserRolesToMapId).then(function success1(flowId) {
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
    describe("sol.common.ix.functions.UserRolesToMap", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.UserRolesToMap",
            classConfig: { objId: obUserRolesToMapId, userRolesConfigObjId: userRolesConfigObjId, role: userRole },
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.UserRolesToMap",
            classConfig: { objId: obUserRolesToMapId, userRolesConfigObjId: userRolesConfigObjId, role: userRole },
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
    describe("RF_sol_common_function_UserRoleToMap", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_function_UserRoleToMap", {
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
      it("should throw if executed without 'userRolesConfigObjId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_function_UserRoleToMap", {
            objId: obUserRolesToMapId
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
      it("should throw if executed without 'role'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_function_UserRoleToMap", {
            objId: obUserRolesToMapId,
            userRolesConfigObjId: userRolesConfigObjId
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_function_UserRoleToMap", {
            objId: obUserRolesToMapId,
            userRolesConfigObjId: userRolesConfigObjId,
            role: userRole
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
              test.Utils.getActiveWorkflows().then(function success4(wfs1) {
                test.Utils.removeActiveWorkflows(wfs1).then(function success5(removeFinishedWorkflowsResult1) {
                  done();
                }, function error(err) {
                  console.error(err);
                  done();
                }
                );
              }, function error(err) {
                console.error(err);
                done();
              }
              );
            }, function error(err) {
              console.error(err);
              done();
            }
            );
          }, function error(err) {
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