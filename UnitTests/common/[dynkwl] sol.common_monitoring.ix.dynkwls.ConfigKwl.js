/* eslint-disable linebreak-style */

describe("[dynkwl] sol.common_monitoring.ix.dynkwls.ConfigKwl", function () {
  var originalTimeout, objConfigKwlId, searchIn, search, obj, cp,
      focusName, searchValue, data, config, ec, sord, fieldName, map,
      value, parentParam;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ConfigKwl").then(function success(objConfigKwlId1) {
        objConfigKwlId = objConfigKwlId1;
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
    describe("sol.common_monitoring.ix.dynkwl.ConfigKwl", function () {
      it("CONTAINS", function (done) {
        expect(function () {
          searchIn = [];
          search = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          searchIn = [];
          search = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          searchIn = [];
          search = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
      it("close", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          cp = "CONTAINS";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "compare",
            params: [cp]
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
          searchIn = [];
          search = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
      it("eachObjectKey", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "eachObjectKey",
            params: [obj]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "getIndexFromName",
            params: [focusName]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
      it("initializeInjections", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "initializeInjections",
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
      it("open", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
      it("prepareConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "prepareConfig",
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
      it("updateTableKeyNames", function (done) {
        expect(function () {
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            classConfig: {},
            method: "updateTableKeyNames",
            params: [focusName]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib7", {
            className: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
    describe("sol.common_monitoring.ix.dynkwl.ConfigKwl", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objConfigKwlId
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objConfigKwlId,
            dynKwl: "sol.common_monitoring.ix.dynkwl.ConfigKwl"
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objConfigKwlId,
            dynKwl: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteDynKwl", {
            objId: objConfigKwlId,
            dynKwl: "sol.common_monitoring.ix.dynkwl.ConfigKwl",
            providerConfig: {},
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {
            expect(jsonResult.keynames).toBeDefined();
            expect(jsonResult.header).toBeDefined();
            expect(jsonResult.data).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
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