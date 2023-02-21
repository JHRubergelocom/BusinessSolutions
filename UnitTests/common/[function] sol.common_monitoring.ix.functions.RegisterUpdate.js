/* eslint-disable linebreak-style */

describe("[function] sol.common_monitoring.ix.functions.RegisterUpdate", function () {
  var originalTimeout, objRegisterUpdateId, registerUpdateSord, sord, nameTemplate, flowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("RegisterUpdate").then(function success(obBatchImportId) {
        test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Unittest").then(function success1(objRegisterUpdateId1) {
          objRegisterUpdateId = objRegisterUpdateId1;
          test.Utils.getSord(objRegisterUpdateId).then(function success2(registerUpdateSord1) {
            registerUpdateSord = registerUpdateSord1;
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
    describe("sol.common_monitoring.ix.events.Update", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("UnittestStandardWF", "Workflow Unittest", objRegisterUpdateId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildName", function (done) {
        expect(function () {
          sord = registerUpdateSord;
          nameTemplate = "nameTemplate1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "buildName",
            params: [sord, nameTemplate]
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
      it("cleanUp", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: { flowId: flowId },
            method: "cleanUp",
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
      it("getConnection", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "getConnection",
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
      it("getTemplateSord", function (done) {
        expect(function () {
          sord = registerUpdateSord;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "getTemplateSord",
            params: [sord]
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
      it("getUpdateCfg", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "getUpdateCfg",
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
      it("getUpdateRegistry", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "getUpdateRegistry",
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
      it("getUpdateRegistryWF", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: {},
            method: "getUpdateRegistryWF",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: { sord: registerUpdateSord, objId: objRegisterUpdateId },
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
      it("register", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: { objId: objRegisterUpdateId },
            method: "register",
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
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("UnittestStandardWF", "Workflow Unittest", objRegisterUpdateId).then(function success(flowId1) {
            flowId = flowId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("removeFinishedWf", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common_monitoring.ix.events.Update",
            classConfig: { flowId: flowId },
            method: "removeFinishedWf",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_monitoring_function_RegisterUpdate", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_monitoring_function_RegisterUpdate", {
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
      it("should not throw if executed with sord batch import content", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_monitoring_function_RegisterUpdate", {
            objId: objRegisterUpdateId
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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
              test.Utils.getActiveWorkflows().then(function success2(wfs1) {
                test.Utils.removeActiveWorkflows(wfs1).then(function success3(removeFinishedWorkflowsResult1) {
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