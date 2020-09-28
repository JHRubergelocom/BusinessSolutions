
describe("[function] sol.common.ix.functions.ForEach", function () {
  var originalTimeout, objForEachId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ForEach", null, { COL1: "Value1", COL2: "Value2" }).then(function success(objForEachId1) {
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
    it("option dryRun true", function (done) {
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
            args: { objId: objForEachId, entries: [{ type: "MAP", key: "MAP_VALUE1", value: "mapValue1" }] }
          }      
        }).then(function success(jsonResult) {
          expect(jsonResult.data[0].sordMetadata.mapKeys.COL).toEqual("Value2");
          expect(jsonResult.data[0].$rowIndex).toEqual(2);
          expect(jsonResult.data[0].entries[0].type).toEqual("MAP");
          expect(jsonResult.data[0].entries[0].key).toEqual("MAP_VALUE1");
          expect(jsonResult.data[0].entries[0].value).toEqual("mapValue1");
          expect(jsonResult.deleteInstructions[0].type).toEqual("MAP");
          expect(jsonResult.deleteInstructions[0].key).toEqual("COL2");
          expect(jsonResult.deleteInstructions[0].value).toEqual("");
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("option dryRun omitted", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_function_ForEach", {
          objId: objForEachId,
          columns: { map: ["COL"] },
          options: {
            elementArg: "sordMetadata",
            elementAsTemplateSord: true,
            filter: [{ prop: "sordMetadata.mapKeys.COL", value: "*2" }],
            deleteAfterUse: true
          },
          callback: {
            name: "RF_sol_function_Set",
            args: { objId: objForEachId, entries: [{ type: "MAP", key: "MAP_VALUE1", value: "mapValue1" }] }
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
          expect("mapValue1").toEqual(mapValue1);
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