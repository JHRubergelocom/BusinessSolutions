
describe("[function] sol.hr.ix.functions.FillSordByApi", function () {
  var objFillSordByApiId, objSordAId, objSordBId, originalTimeout,
      setConfig, references, referenceConfig, api, targetConfig;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FillSordByApi").then(function success(objFillSordByApiId1) {
        objFillSordByApiId = objFillSordByApiId1;
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
    describe("sol.hr.ix.functions.FillSordByApi", function () {
      it("addDataHistoryToSetConfig", function (done) {
        expect(function () {
          setConfig = [];
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: { writeDataHistory: { id: "MY_CHANGE_HISTORY_FIELD", type: "FORMBLOB" } },
            method: "addDataHistoryToSetConfig",
            params: [setConfig]
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
      it("addReferencesToSetConfig", function (done) {
        expect(function () {
          setConfig = [];
          references = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: {},
            method: "addReferencesToSetConfig",
            params: [setConfig, references]
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
      it("determineTemplatingFlowId", function (done) {
        expect(function () {
          referenceConfig = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: {},
            method: "determineTemplatingFlowId",
            params: [referenceConfig]
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
      it("determineTemplatingObjId", function (done) {
        expect(function () {
          referenceConfig = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: {},
            method: "determineTemplatingObjId",
            params: [referenceConfig]
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
      it("getSetConfig", function (done) {
        expect(function () {
          api = { mapping: [], dataSources: { sordReferenceForTemplating: {} } };
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: {},
            method: "getSetConfig",
            params: [api]
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
      it("getTargetId", function (done) {
        expect(function () {
          targetConfig = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: {},
            method: "getTargetId",
            params: [targetConfig]
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.FillSordByApi",
            classConfig: { api: { mapping: [], dataSources: { sordReferenceForTemplating: { type: "objId", value: objFillSordByApiId } } }, target: { type: "objId", value: objFillSordByApiId } },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_function_FillSordByApi", function () {
      it("Create SordA", function (done) {
        expect(function () {
          test.Utils.createSord(objFillSordByApiId, null, "SordA", {
            UNITTEST_FIELD1: "Bernd",
            UNITTEST_FIELD2: "Stromberg"
          }, {
            UNITTEST_MAP1: "Eintrag1A",
            UNITTEST_MAP2: "Eintrag2A"
          }).then(function success(objSordAId1) {
            objSordAId = objSordAId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Create SordB", function (done) {
        expect(function () {
          test.Utils.createSord(objFillSordByApiId, null, "SordB", {
            UNITTEST_FIELD1: "Nils",
            UNITTEST_FIELD2: "Armstrong"
          }, {
            UNITTEST_MAP1: "Eintrag1B",
            UNITTEST_MAP2: "Eintrag2B"
          }).then(function success(objSordBId1) {
            objSordBId = objSordBId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed without 'api'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_FillSordByApi", {
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
      it("should throw if executed without 'target'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_FillSordByApi", {
            api: {
              dataSources: {
                sordReferenceForTemplating: {
                  type: "objId",
                  value: objSordAId
                }
              },
              mapping: [{
                source: {
                  id: "UNITTEST_FIELD1",
                  type: "GRP"
                },
                target: {
                  id: "UNITTEST_FIELD2",
                  type: "GRP"
                }
              },
              {
                source: {
                  id: "UNITTEST_MAP1",
                  type: "MAP"
                },
                target: {
                  id: "UNITTEST_MAP2",
                  type: "MAP"
                }
              }
              ]
            }
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_FillSordByApi", {
            api: {
              dataSources: {
                sordReferenceForTemplating: {
                  type: "objId",
                  value: objSordAId
                }
              },
              mapping: [{
                source: {
                  id: "UNITTEST_FIELD1",
                  type: "GRP"
                },
                target: {
                  id: "UNITTEST_FIELD2",
                  type: "GRP"
                }
              },
              {
                source: {
                  id: "UNITTEST_MAP1",
                  type: "MAP"
                },
                target: {
                  id: "UNITTEST_MAP2",
                  type: "MAP"
                }
              }
              ]
            },
            target: {
              type: "objId",
              value: objSordBId
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
      it("mapValue 'UNITTEST_MAP1' in SordA should be equal with 'UNITTEST_MAP2' in SordB", function (done) {
        test.Utils.getMapValue(objSordAId, "UNITTEST_MAP1").then(function success(map1ValueSordA) {
          test.Utils.getMapValue(objSordBId, "UNITTEST_MAP2").then(function success1(map2ValueSordB) {
            expect(map1ValueSordA).toEqual(map2ValueSordB);
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
  });
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success2(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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