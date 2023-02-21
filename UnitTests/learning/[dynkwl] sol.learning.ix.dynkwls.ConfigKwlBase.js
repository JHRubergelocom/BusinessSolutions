
describe("[dynkwl] sol.learning.ix.dynkwls.ConfigKwlBase", function () {
  var originalTimeout, objConfigKwlBaseId,
      searchIn, search, field, config, m1, 
      searchValue, data, ec, sord, fieldName, map, focusName,
      value, parentParam, n1;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ConfigKwlBase").then(function success(objConfigKwlBaseId1) {
        objConfigKwlBaseId = objConfigKwlBaseId1;
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
    describe("sol.learning.ix.configKwl.Base", function () {
      it("CONTAINS", function (done) {
        expect(function () {
          searchIn = "";
          search = "";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "CONTAINS",
            params: [searchIn, search]
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
      it("ENDS_WITH", function (done) {
        expect(function () {
          searchIn = "";
          search = "";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "ENDS_WITH",
            params: [searchIn, search]
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
      it("STARTS_WITH", function (done) {
        expect(function () {
          searchIn = "";
          search = "";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "STARTS_WITH",
            params: [searchIn, search]
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
      it("_open", function (done) {
        expect(function () {
          field = { name: "name1", value: "value1" };
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "_open",
            params: [field]
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
      it("close", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "close",
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
      it("compare", function (done) {
        expect(function () {
          m1 = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "compare",
            params: [m1]
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
      it("default", function (done) {
        expect(function () {
          searchIn = "";
          search = "";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "default",
            params: [searchIn, search]
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
      it("getHeader", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getHeader",
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
      it("getIndexFromName", function (done) {
        expect(function () {
          n1 = "name1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getIndexFromName",
            params: [n1]
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
      it("getIterator", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getIterator",
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
      it("getKeyNames", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getKeyNames",
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
      it("getMessage", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getMessage",
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
      it("getNextRow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getNextRow",
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
      it("getResults", function (done) {
        expect(function () {
          searchValue = "searchValue1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getResults",
            params: [searchValue]
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
      it("getRowData", function (done) {
        expect(function () {
          data = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getRowData",
            params: [data]
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
      it("getTitle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "getTitle",
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
      it("hasMoreRows", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "hasMoreRows",
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
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "initialize",
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
      it("open", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          fieldName = "fieldname1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "open",
            params: [ec, sord, fieldName]
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
      it("openMap", function (done) {
        expect(function () {
          ec = {};
          map = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "openMap",
            params: [ec, map, focusName]
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
      it("useOperator", function (done) {
        expect(function () {
          value = "value1";
          config = {};
          parentParam = {};
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteLib1", {
            className: "sol.learning.ix.configKwl.Base",
            classConfig: {},
            method: "useOperator",
            params: [value, config, parentParam]
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
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.learning.ix.configKwl.Base", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objConfigKwlBaseId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objConfigKwlBaseId,
            dynKwl: "sol.learning.ix.configKwl.Base"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objConfigKwlBaseId,
            dynKwl: "sol.learning.ix.configKwl.Base",
            providerConfig: {}
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_learning_service_ExecuteDynKwl1", {
            objId: objConfigKwlBaseId,
            dynKwl: "sol.learning.ix.configKwl.Base",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.header).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
            }
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