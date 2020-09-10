
describe("[lib] sol.unittest.ix.services.SolCommonMapTable", function () {
  var MapTableSord, mapData, originalTimeout, columnName, value, classConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMapTable").then(function success(obSolCommonMapTableId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(MapTableSord1) {
          MapTableSord = MapTableSord1;
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
          classConfig = {
            objId: MapTableSord.id, columnNames: ["UNITTEST_MAPFIELDA", "UNITTEST_MAPFIELDB", "UNITTEST_MAPFIELDC"], read: true
          };
          test.Utils.updateMapData(MapTableSord.id, mapData).then(function success2(updateMapDataResult) {
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
    describe("sol.common.MapTable", function () {
      it("initialize", function (done) {
        expect(function () {
          config = classConfig;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
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
      it("appendRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "appendRow",
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
      it("getLength", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "getLength",
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
      it("checkState", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "checkState",
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
      it("getDisplayIndex", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "getDisplayIndex",
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
      it("getNumValue", function (done) {
        expect(function () {
          columnName = "UNITTEST_MAPFIELDA";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "getNumValue",
            params: [columnName]
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
          columnName = "UNITTEST_MAPFIELDB";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "getValue",
            params: [columnName]
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
      it("hasNextRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "hasNextRow",
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
      it("insertRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "insertRow",
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
      it("nextRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "nextRow",
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
      it("removeRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "removeRow",
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
      it("reset", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "reset",
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
      it("setNumValue", function (done) {
        expect(function () {
          columnName = "UNITTEST_MAPFIELDA";
          value = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "setNumValue",
            params: [columnName, value]
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
          columnName = "UNITTEST_MAPFIELDC";
          value = "CC";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "setValue",
            params: [columnName, value]
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
      it("shift", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "shift",
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
      it("write", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
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
      it("clear", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.MapTable",
            classConfig: classConfig,
            method: "clear",
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