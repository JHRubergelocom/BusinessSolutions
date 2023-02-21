/* eslint-disable linebreak-style */

describe("[function] sol.learning.ix.functions.ForEach", function () {
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
  describe("Test Lib Functions", function () {
    describe("sol.learning.ix.functions.ForEach", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.functions.ForEach",
            classConfig: {},
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
  describe("test cases foreach", function () {
    it("should throw if executed without 'objId' ", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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
    it("option dryRun true, test filter without callback function", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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
        test.Utils.execute("RF_sol_learning_function_ForEach", {
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