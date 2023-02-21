
describe("[lib] sol.unittest.ix.services.SolCommonObjectUtils", function () {
  var originalTimeout, arr, cb, a, custom, wc, str, ignoreCase,
      o, val, customProp, customCallback, callback, context, keyPropName,
      object, path, customPropName, include, exclude, base, log, assignCallback,
      recursionCheck, mergeList, preserveCustom, columnIndex, jsArray, params, should,
      value, overwrite, obj, func, element;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonObjectUtils").then(function success(obSolCommonObjectUtilsId) {
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
    describe("sol.common.ObjectUtils", function () {
      it("arrayFind", function (done) {
        expect(function () {
          arr = [{ key1: "value1" }, { key2: "value2" }];
          cb = "cb";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "arrayFind",
            params: [arr, cb]
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
      it("arrayToRegExp", function (done) {
        expect(function () {
          arr = ["value1", "value2"];
          wc = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "arrayToRegExp",
            params: [arr, wc]
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
      it("clone", function (done) {
        expect(function () {
          o = { key1: "value1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "clone",
            params: [o]
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
      it("findObjInArray", function (done) {
        expect(function () {
          a = [{ key1: "value1" }, { key2: "value2" }];
          val = "value2";
          customProp = "key2";
          customCallback = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "findObjInArray",
            params: [a, val, customProp, customCallback]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ key2: "value2" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("forEach", function (done) {
        expect(function () {
          arr = [{ key1: "value1" }, { key2: "value2" }];
          callback = "callback";
          context = "context";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "forEach",
            params: [arr, callback, context]
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
      it("getObjectFromArray", function (done) {
        expect(function () {
          arr = [{ id: "value1", text: "text1" }, { id: "value2", text2: "text2" }];
          keyPropName = "id";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "getObjectFromArray",
            params: [arr, keyPropName]
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
      it("getProp", function (done) {
        expect(function () {
          object = { x: [{ __ID: "test", myniceprop: 42 }] };
          path = "x.test.myniceprop";
          customPropName = "__ID";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "getProp",
            params: [object, path, customPropName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(42);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getPropsOfObj", function (done) {
        expect(function () {
          o = { x: [{ id: "test", myniceprop: 42 }] };
          include = [];
          exclude = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "getPropsOfObj",
            params: [o, include, exclude]
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
      it("getValues", function (done) {
        expect(function () {
          o = { x: [{ id: "test", myniceprop: 42 }] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "getValues",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([[{ id: "test", myniceprop: 42 }]]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isArray", function (done) {
        expect(function () {
          o = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isArray",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isBlank", function (done) {
        expect(function () {
          o = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isBlank",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isDate", function (done) {
        expect(function () {
          o = "Date";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isDate",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isEmpty", function (done) {
        expect(function () {
          o = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isEmpty",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isFunction", function (done) {
        expect(function () {
          o = "function";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isFunction",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isJavaObject", function (done) {
        expect(function () {
          o = "JavaObject";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isJavaObject",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isNumber", function (done) {
        expect(function () {
          o = 5;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isNumber",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isObject", function (done) {
        expect(function () {
          o = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isObject",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isRegExp", function (done) {
        expect(function () {
          o = "RegExp";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isRegExp",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isString", function (done) {
        expect(function () {
          o = "text";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isString",
            params: [o]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isTruthy", function (done) {
        expect(function () {
          o = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "isTruthy",
            params: [o]
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
      it("map", function (done) {
        expect(function () {
          arr = [{ id: "value1", text: "text1" }, { id: "value2", text2: "text2" }];
          callback = "callback";
          context = "context";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "map",
            params: [arr, callback, context]
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
      it("merge", function (done) {
        expect(function () {
          custom = { key: "value1" };
          base = { id: "id1" };
          log = null;
          path = null;
          assignCallback = null;
          recursionCheck = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "merge",
            params: [custom, base, log, path, assignCallback, recursionCheck]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ key: "value1", id: "id1" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mergeObjects", function (done) {
        expect(function () {
          base = { a: "hello", b: "world" };
          mergeList = [{ b: "developer", c: "foobar" }];
          preserveCustom = null;
          path = null;
          assignCallback = null;
          recursionCheck = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "mergeObjects",
            params: [base, mergeList, preserveCustom, path, assignCallback, recursionCheck]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ a: "hello", b: "developer", c: "foobar" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setProp", function (done) {
        expect(function () {
          object = { x: [{ __ID: "test", myniceprop: 42 }] };
          path = "x.test.myniceprop";
          value = 43;
          overwrite = true;
          customPropName = "__ID";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "setProp",
            params: [object, path, value, overwrite, customPropName]
          }).then(function success(jsonResult) {
            expect(jsonResult.myniceprop).toEqual(43);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("sortTableByColumn", function (done) {
        expect(function () {
          arr = [[7, 2], [3, 4], [2, 9]];
          columnIndex = 0;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "sortTableByColumn",
            params: [arr, columnIndex]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([[2, 9], [3, 4], [7, 2]]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("stringToRegExp", function (done) {
        expect(function () {
          str = "Text1";
          wc = 2;
          ignoreCase = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "stringToRegExp",
            params: [str, wc, ignoreCase]
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
      it("toArray", function (done) {
        expect(function () {
          o = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "toArray",
            params: [o]
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
      it("toJavaArray", function (done) {
        expect(function () {
          jsArray = [[7, 2], [3, 4], [2, 9]];
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "toJavaArray",
            params: [jsArray, params]
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
      it("toRegExp", function (done) {
        expect(function () {
          element = "";
          wc = 2;
          ignoreCase = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "toRegExp",
            params: [element, wc, ignoreCase]
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
      it("traverse", function (done) {
        expect(function () {
          obj = { key1: "value1", key2: { key3: "value3" } };
          func = "function1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "traverse",
            params: [obj, func]
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
      it("type", function (done) {
        expect(function () {
          val = [[7, 2], [3, 4], [2, 9]];
          should = "array";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "type",
            params: [val, should]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("type", function (done) {
        expect(function () {
          val = [[7, 2], [3, 4], [2, 9]];
          should = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.ObjectUtils",
            classConfig: {},
            method: "type",
            params: [val, should]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("array");
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