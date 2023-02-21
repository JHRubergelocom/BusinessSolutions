
describe("[lib] sol.unittest.ix.services.SolCommonMap", function () {
  var MapSord, mapData, originalTimeout, endOfTableIndicatorColumnName, key, separator, config, keynames, value, map;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonMap").then(function success(obSolCommonMapId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success1(MapSord1) {
          MapSord = MapSord1;
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
          test.Utils.updateMapData(MapSord.id, mapData).then(function success2(updateMapDataResult) {
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
    describe("sol.common.Map", function () {
      it("forEachRow", function (done) {
        expect(function () {
          endOfTableIndicatorColumnName = "UNITTEST_MAPFIELDA";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
          config = { objId: MapSord.id };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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
            className: "sol.unittest.Map",
            classConfig: { objId: MapSord.id },
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