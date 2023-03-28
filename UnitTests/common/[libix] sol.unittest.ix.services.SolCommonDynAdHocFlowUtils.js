/* eslint-disable linebreak-style */

describe("[libix] sol.unittest.ix.services.SolCommonDynAdHocFlowUtils", function () {
  var obSolCommonDynAdHocFlowUtilsId, userName, originalTimeout, flowId, objId, config,
      userEntries, initEmpty, userInfo;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDynAdHocFlowUtils").then(function success(obSolCommonDynAdHocFlowUtilsId1) {
        obSolCommonDynAdHocFlowUtilsId = obSolCommonDynAdHocFlowUtilsId1;
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
    describe("sol.common.ix.DynAdHocFlowUtils", function () {
      it("addUserToApprovalHistory", function (done) {
        expect(function () {
          userInfo = "Administrator";
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "addUserToApprovalHistory",
            params: [userInfo, flowId, objId, config]
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
      it("backToPreviousUser", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "backToPreviousUser",
            params: [flowId, objId, config]
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
      it("buildConfig", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "buildConfig",
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
      it("clearCurrentUser", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "clearCurrentUser",
            params: [flowId, objId, config]
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
      it("clearPreviousUserFromApprovalHistory", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "clearPreviousUserFromApprovalHistory",
            params: [flowId, objId, config]
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
      it("createDynAdHocFlow", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          userEntries = [{ name: "Administrator" }];
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "createDynAdHocFlow",
            params: [flowId, objId, userEntries, config]
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
      it("getHistoryUserIds", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "getHistoryUserIds",
            params: [flowId, objId, config]
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
      it("getNextUserIds", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "getNextUserIds",
            params: [flowId, objId, config]
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
      it("hasCurrentUser", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "hasCurrentUser",
            params: [flowId, objId, config]
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
      it("hasLessThanApprovalCount", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "hasLessThanApprovalCount",
            params: [flowId, objId, config]
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
      it("hasNextUser", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "hasNextUser",
            params: [flowId, objId, config]
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
      it("loadApprovalHistoryTable", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          initEmpty = false;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "loadApprovalHistoryTable",
            params: [flowId, objId, initEmpty, config]
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
      it("loadTable", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          initEmpty = false;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "loadTable",
            params: [flowId, objId, initEmpty, config]
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
      it("setCurrentUser", function (done) {
        expect(function () {
          objId = obSolCommonDynAdHocFlowUtilsId;
          flowId = "0";
          userName = "Administrator";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "setCurrentUser",
            params: [objId, flowId, userName, config]
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
      it("shiftUser", function (done) {
        expect(function () {
          flowId = "flowId1";
          objId = obSolCommonDynAdHocFlowUtilsId;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynAdHocFlowUtils",
            classConfig: {},
            method: "shiftUser",
            params: [flowId, objId, config]
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