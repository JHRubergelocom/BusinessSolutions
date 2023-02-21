
describe("[function] sol.common.ix.functions.MultiSet", function () {
  var originalTimeout, objMultiSetId, sordName, sordDesc, grpField1, grpField2, mapValue1, mapValue2,
      config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      sordName = "sordName";
      sordDesc = "sordDesc";
      grpField1 = "grpField1";
      grpField2 = "grpField2";
      mapValue1 = "mapValue1";
      mapValue2 = "mapValue2";
      test.Utils.createTempSord("objMultiSet").then(function success(objMultiSetId1) {
        objMultiSetId = objMultiSetId1;
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
    describe("sol.common.ix.functions.MultiSet", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib8", {
            className: "sol.common.ix.functions.MultiSet",
            classConfig: { objEntries: [] },
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
            className: "sol.common.ix.functions.MultiSet",
            classConfig: { objEntries: [] },
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
  describe("test MultiSet", function () {
    it("should throw if executed without 'objEntries'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_MultiSet", {
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
    it("MultiSet", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_MultiSet", {
          objEntries: [{
            objId: objMultiSetId,
            entries: [{
              type: "SORD",
              key: "name",
              value: sordName
            }, {
              type: "SORD",
              key: "desc",
              value: sordDesc
            }, {
              type: "GRP",
              key: "UNITTEST_FIELD1",
              value: grpField1
            }, {
              type: "GRP",
              key: "UNITTEST_FIELD2",
              value: grpField2
            }, {
              type: "MAP",
              key: "MAP_VALUE1",
              value: mapValue1
            }, {
              type: "MAP",
              key: "MAP_VALUE2",
              value: mapValue2
            }]
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
    it("MultiSet in admin context", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_function_MultiSet", {
          objEntries: [{
            objId: objMultiSetId,
            asAdmin: true,
            entries: [{
              type: "SORD",
              key: "name",
              value: sordName
            }, {
              type: "SORD",
              key: "desc",
              value: sordDesc
            }, {
              type: "GRP",
              key: "UNITTEST_FIELD1",
              value: grpField1
            }, {
              type: "GRP",
              key: "UNITTEST_FIELD2",
              value: grpField2
            }, {
              type: "MAP",
              key: "MAP_VALUE1",
              value: mapValue1
            }, {
              type: "MAP",
              key: "MAP_VALUE2",
              value: mapValue2
            }]
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
      test.Utils.getSord(objMultiSetId).then(function success(sordMultiSet) {
        expect(sordMultiSet.name).toEqual(sordName);
        expect(sordMultiSet.desc).toEqual(sordDesc);
        expect(test.Utils.getObjKeyValue(sordMultiSet, "UNITTEST_FIELD1")).toEqual(grpField1);
        expect(test.Utils.getObjKeyValue(sordMultiSet, "UNITTEST_FIELD2")).toEqual(grpField2);
        test.Utils.getMapValue(objMultiSetId, "MAP_VALUE1").then(function success1(mapValue11) {
          test.Utils.getMapValue(objMultiSetId, "MAP_VALUE2").then(function success2(mapValue21) {
            expect(mapValue11).toEqual(mapValue1);
            expect(mapValue21).toEqual(mapValue2);
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