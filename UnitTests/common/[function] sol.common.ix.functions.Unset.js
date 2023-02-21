
describe("[function] sol.common.ix.functions.Unset", function () {
  var originalTimeout, objUnsetId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objUnset").then(function success(objUnsetId1) {
        objUnsetId = objUnsetId1;
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
    describe("sol.common.ix.functions.Unset", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.Unset",
            classConfig: { objId: objUnsetId, entries: [] },
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
  describe("test Unset", function () {
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Unset", {
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
    it("should throw if executed without 'entries'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Unset", {
          objId: objUnsetId
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
    it("Unset", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_Unset", {
          objId: objUnsetId,
          entries: [{
            type: "SORD",
            key: "desc"
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD1"
          }, {
            type: "GRP",
            key: "UNITTEST_FIELD2"
          }, {
            type: "MAP",
            key: "MAP_VALUE1"
          }, {
            type: "MAP",
            key: "MAP_VALUE2"
          }]
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
      test.Utils.getSord(objUnsetId).then(function success(sordUnset) {
        expect(sordUnset.desc).toEqual("");
        expect(test.Utils.getObjKeyValue(sordUnset, "UNITTEST_FIELD1")).toEqual(null);
        expect(test.Utils.getObjKeyValue(sordUnset, "UNITTEST_FIELD2")).toEqual(null);
        test.Utils.getMapValue(objUnsetId, "MAP_VALUE1").then(function success1(mapValue11) {
          test.Utils.getMapValue(objUnsetId, "MAP_VALUE2").then(function success2(mapValue21) {
            expect(mapValue11).toEqual(undefined);
            expect(mapValue21).toEqual(undefined);
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