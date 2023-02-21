
describe("[lib] sol.unittest.ix.services.SolCommonWfMap", function () {
  var WfMapSord, flowId, mapData, originalTimeout, config, endOfTableIndicatorColumnName,
      key, separator, value, map, keynames, succNodes, succNodesIds;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonWfMap").then(function success(obSolCommonWfMapId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(WfMapSord1) {
          WfMapSord = WfMapSord1;
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
    describe("sol.common.WfMap", function () {
      it("start Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.startWorkflow("Unittest", "Workflow Unittest", WfMapSord.id).then(function success(flowId1) {
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
      it("Set WfMap", function (done) {
        expect(function () {
          mapData = {
            UNITTEST_MAPFIELDA1: "A1",
            UNITTEST_MAPFIELDB1: "B1",
            UNITTEST_MAPFIELDC1: "C1",
            UNITTEST_MAPFIELDA2: "A2",
            UNITTEST_MAPFIELDB2: "B2",
            UNITTEST_MAPFIELDC2: "C2",
            UNITTEST_MAPFIELDA3: "A3",
            UNITTEST_MAPFIELDB3: "B3",
            UNITTEST_MAPFIELDC3: "C3"
          };
          test.Utils.updateWfMapData(flowId, WfMapSord.id, mapData).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("forEachRow", function (done) {
        expect(function () {
          endOfTableIndicatorColumnName = "UNITTEST_MAPFIELDA";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "forEachRow",
            params: [endOfTableIndicatorColumnName]
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
      it("getKwlKey", function (done) {
        expect(function () {
          key = "UNITTEST_MAPFIELDA1";
          separator = "-";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "getKwlKey",
            params: [key, separator]
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
      it("getNumValue", function (done) {
        expect(function () {
          key = "UNITTEST_MAPFIELDA1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "getNumValue",
            params: [key]
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
      it("getValue", function (done) {
        expect(function () {
          key = "UNITTEST_MAPFIELDA1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "getValue",
            params: [key]
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
      it("initialize", function (done) {
        expect(function () {
          config = { objId: WfMapSord.id, flowId: flowId };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
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
      it("keyAndValueExist", function (done) {
        expect(function () {
          key = "UNITTEST_MAPFIELDA1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "keyAndValueExist",
            params: [key]
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
      it("read", function (done) {
        expect(function () {
          keynames = ["UNITTEST_MAPFIELDA1", "UNITTEST_MAPFIELDC1"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "read",
            params: [keynames]
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
      it("setNumValue", function (done) {
        expect(function () {
          key = ["UNITTEST_MAPFIELDA1"];
          value = 100;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "setNumValue",
            params: [key, value]
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
      it("setValue", function (done) {
        expect(function () {
          key = ["UNITTEST_MAPFIELDA1"];
          value = "A1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "setValue",
            params: [key, value]
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
      it("setValues", function (done) {
        expect(function () {
          map = { a: "a", b: "b" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "setValues",
            params: [map]
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
      it("write", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.WfMap",
            classConfig: { objId: WfMapSord.id, flowId: flowId },
            method: "write",
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
      it("finish Workflow Unittest", function (done) {
        expect(function () {
          test.Utils.getWorkflow(flowId).then(function success1(workflow) {
            succNodes = test.Utils.getSuccessorNodes(workflow, "1", null, "node 2");
            succNodesIds = test.Utils.getSuccessorNodesIds(succNodes);
            test.Utils.forwardWorkflowTask(flowId, "1", succNodesIds, "Unittest finish input").then(function success2(forwardWorkflowTaskResult) {
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