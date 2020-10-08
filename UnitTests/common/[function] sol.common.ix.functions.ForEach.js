
describe("[function] sol.common.ix.functions.ForEach", function () {
  var originalTimeout, objForEachId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ForEach", { UNITTEST_FIELD1: "UnittestForEach" }, { COL1: "Value1", COL2: "Value2" }).then(function success(objForEachId1) {
        objForEachId = objForEachId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  it("should throw if executed without 'objId' ", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_function_ForEach", {
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
  it("should throw if executed without 'columns'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_function_ForEach", {
        objId: objForEachId
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
  it("should throw if executed without 'callback'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_function_ForEach", {
        objId: objForEachId,
        columns: { map: ["COL"] }
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
  describe("test cases foreach", function () {
    it("option dryRun true, test filter without callback function", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          objId: objForEachId,
          columns: { map: ["COL"] },
          options: {
            elementArg: "sordMetadata",
            elementAsTemplateSord: true,
            filter: [{ prop: "sordMetadata.mapKeys.COL", value: "*2" }],
            deleteAfterUse: true,
            dryRun: true
          },
          callback: {
            name: "RF_"
          }      
        }).then(function success(jsonResult) {
          expect(jsonResult.deleteInstructions[0].type).toEqual("MAP");
          expect(jsonResult.deleteInstructions[0].key).toEqual("COL2");
          expect(jsonResult.deleteInstructions[0].value).toEqual("");
          expect(jsonResult.args.length).toEqual(1);
          expect(jsonResult.args[0].sordMetadata.mapKeys.COL).toEqual("Value2");
          expect(jsonResult.args[0].sordMetadata.wfMapKeys).toEqual({});
          expect(jsonResult.args[0].$rowIndex).toEqual(1);
          expect(jsonResult.excluded).toEqual(1);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("option dryRun true, test callback function parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          objId: objForEachId,
          columns: { map: ["COL"] },
          options: {
            elementArg: "sordMetadata",
            elementAsTemplateSord: true,
            filter: [{ prop: "sordMetadata.mapKeys.COL", value: "*2" }],
            deleteAfterUse: true,
            dryRun: true
          },
          callback: {
            name: "RF_sol_function_Set",
            args: { objId: objForEachId, entries: [{ type: "MAP", key: "MAP_VALUE1", value: "{{sord.mapKeys.COL2}}" }] }
          }      
        }).then(function success(jsonResult) {
          expect(jsonResult.deleteInstructions[0].type).toEqual("MAP");
          expect(jsonResult.deleteInstructions[0].key).toEqual("COL2");
          expect(jsonResult.deleteInstructions[0].value).toEqual("");
          expect(jsonResult.args.length).toEqual(1);
          expect(jsonResult.args[0].sordMetadata.mapKeys.COL).toEqual("Value2");
          expect(jsonResult.args[0].sordMetadata.wfMapKeys).toEqual({});
          expect(jsonResult.args[0].$rowIndex).toEqual(1);
          expect(jsonResult.args[0].entries[0].type).toEqual("MAP");
          expect(jsonResult.args[0].entries[0].key).toEqual("MAP_VALUE1");
          expect(jsonResult.args[0].entries[0].value).toEqual("Value2");
          expect(jsonResult.excluded).toEqual(1);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("option dryRun false", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          objId: objForEachId,
          columns: { map: ["COL"] },
          options: {
            elementArg: "sordMetadata",
            elementAsTemplateSord: true,
            filter: [{ prop: "sordMetadata.mapKeys.COL", value: "*2" }],
            deleteAfterUse: true,
            dryRun: false
          },
          callback: {
            name: "RF_sol_function_Set",
            args: { objId: objForEachId, entries: [{ type: "MAP", key: "MAP_VALUE1", value: "{{sord.mapKeys.COL2}}" }] }
          }      
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
    it("Compare Values", function (done) {
      test.Utils.getSord(objForEachId).then(function success(sordForEach) {
        test.Utils.getMapValue(objForEachId, "MAP_VALUE1").then(function success1(mapValue1) {
          expect("Value2").toEqual(mapValue1);
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
    });
    it("option dryRun true, test elementService parameter", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          elementService: {
            name: "RF_sol_common_service_SordProvider",
            args: {
              masks: ["UnitTest"],
              search: [{ key: "UNITTEST_FIELD1", value: ["UnittestForEach"] }],
              output: [
                { source: { type: "SORD", key: "id" }, target: { prop: "id" } },
                { source: { type: "GRP", key: "UNITTEST_FIELD1" }, target: { prop: "field1" } },
                { source: { type: "MAP", key: "COL1" }, target: { prop: "col1" } }
              ]
            }
          },
          options: {
            elementArg: "data",
            elementAsTemplateSord: true,
            moveValues: { id: "objId" },
            renderArgsWithElement: true,
            dryRun: true
          },
          callback: {
            name: "RF_sol_function_Set",
            args: { entries: [{ type: "MAP", key: "MAP_VALUE1", value: "XXXX" }] }
          }      
        }).then(function success(jsonResult) {          
          expect(jsonResult.args.length).toEqual(1);
          expect(jsonResult.args[0].data.col1).toEqual("Value1");
          expect(jsonResult.args[0].data.field1).toEqual("UnittestForEach");
          expect(jsonResult.args[0].objId).toEqual(objForEachId + "");
          expect(jsonResult.args[0].entries[0].type).toEqual("MAP");
          expect(jsonResult.args[0].entries[0].key).toEqual("MAP_VALUE1");
          expect(jsonResult.args[0].entries[0].value).toEqual("XXXX");
          expect(jsonResult.excluded).toEqual(0);
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("option dryRun false", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          elementService: {
            name: "RF_sol_common_service_SordProvider",
            args: {
              masks: ["UnitTest"],
              search: [{ key: "UNITTEST_FIELD1", value: ["UnittestForEach"] }],
              output: [
                { source: { type: "SORD", key: "id" }, target: { prop: "id" } },
                { source: { type: "GRP", key: "UNITTEST_FIELD1" }, target: { prop: "field1" } },
                { source: { type: "MAP", key: "COL1" }, target: { prop: "col1" } }
              ]
            }
          },
          options: {
            elementArg: "data",
            elementAsTemplateSord: true,
            moveValues: { id: "objId" },
            renderArgsWithElement: true,
            dryRun: false
          },
          callback: {
            name: "RF_sol_function_Set",
            args: { entries: [{ type: "MAP", key: "MAP_VALUE1", value: "XXXX" }] }
          }      
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
    it("Compare Values", function (done) {
      test.Utils.getSord(objForEachId).then(function success(sordForEach) {
        test.Utils.getMapValue(objForEachId, "MAP_VALUE1").then(function success1(mapValue1) {
          expect("XXXX").toEqual(mapValue1);
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