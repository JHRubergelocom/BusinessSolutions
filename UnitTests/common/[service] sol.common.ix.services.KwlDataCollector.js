
describe("[service] sol.common.ix.services.KwlDataCollector", function () {
  var originalTimeout, parameters, config, list,
      keyword, parentDataRef, keywordName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objKwlDataCollector1", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objKwlDataCollector1Id) {
        test.Utils.createTempSord("objKwlDataCollector2", { UNITTEST_STATUS3: "XX", UNITTEST_STATUS4: "14" }).then(function success1(objKwlDataCollector2Id) {
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
    describe("sol.common.ix.services.KwlDataCollector", function () {
      it("addDynKeywordListData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector",
            classConfig: { dynKwlConfig: [] },
            method: "addDynKeywordListData",
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
      it("addKeywordListData", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector",
            classConfig: { kwlConfig: [] },
            method: "addKeywordListData",
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
      it("execute", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector",
            classConfig: {},
            method: "execute",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector",
            classConfig: {},
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
    });
    describe("sol.common.ix.services.KwlDataCollector.BaseDynKwl", function () {
      it("getValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.BaseDynKwl",
            classConfig: { 
              config: { 
                id: "UNITTEST_FIELD1",
                formatter: "sol.common.ix.services.JsonDataCollector.FlatKwl", 
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4" } 
            },
            method: "getValues",
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
      it("listToJsArray", function (done) {
        expect(function () {
          list = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.BaseDynKwl",
            classConfig: {},
            method: "listToJsArray",
            params: [list]
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
    describe("sol.common.ix.services.KwlDataCollector.BaseKwl", function () {
      it("getValues", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.BaseKwl",
            classConfig: { 
              config: { 
                id: "UNITTEST_FIELD1",
                formatter: "sol.common.ix.services.JsonDataCollector.FlatKwl", 
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4" } 
            },
            method: "getValues",
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
      it("processChildren", function (done) {
        expect(function () {
          keyword = {};
          parentDataRef = {};
          keywordName = "keywordName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.BaseKwl",
            classConfig: {},
            method: "processChildren",
            params: [keyword, parentDataRef, keywordName]
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
    describe("sol.common.ix.services.KwlDataCollector.FlatKwl", function () {
      it("build", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.FlatKwl",
            classConfig: { 
              config: { 
                id: "UNITTEST_FIELD1",
                formatter: "sol.common.ix.services.JsonDataCollector.FlatKwl", 
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4" } 
            },
            method: "build",
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
    describe("sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl", function () {
      it("build", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.KwlDataCollector.SimpleKeyMapDynKwl",
            classConfig: {
              config: { 
                id: "UNITTEST_FIELD1",
                formatter: "sol.common.ix.services.JsonDataCollector.FlatKwl", 
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4" }              
            },
            method: "build",
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
    describe("RF_sol_common_services_KwlDataCollector", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", {
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
      it("should throw if executed with invalid Parameter", function (done) {
        expect(function () {
          parameters = {
            kwlConfig: [
              {
                id: "UNITTEST_FIELD2"
              },
              {
                id: "UNITTEST_STATUS1"
              }
            ],
            dynKwlConfig: [
              {
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator1",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4"
              }
            ]
          };
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", parameters).then(function success(jsonResult) {
            fail(jsonResult);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter", function (done) {
        expect(function () {
          parameters = {
            kwlConfig: [
              {
                id: "UNITTEST_FIELD1"
              },
              {
                id: "UNITTEST_STATUS2"
              }
            ],
            dynKwlConfig: [
              {
                scriptName: "sol.dev.ix.dynkwl.FindUnitTestIterator",
                focusFieldName: "UNITTEST_STATUS3",
                keyFieldName: "UNITTEST_STATUS3",
                valueFieldName: "UNITTEST_STATUS4"
              }
            ]
          };
          test.Utils.execute("RF_sol_common_services_KwlDataCollector", parameters).then(function success(jsonResult) {
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