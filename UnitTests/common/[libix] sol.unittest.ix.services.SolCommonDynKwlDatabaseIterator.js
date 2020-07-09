
describe("[libix] sol.unittest.ix.services.SolCommonDynKwlDatabaseIterator", function () {
  var originalTimeout, ec, focusField, fieldIndex, map, sord, row, defs, name, fieldName, focusName, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDynKwlDatabaseIterator").then(function success(obSolCommonDynKwlDatabaseIteratorId) {
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
    describe("sol.common.ix.DynKwlDatabaseIterator", function () {
      it("close", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
      it("createDbParameterList", function (done) {
        expect(function () {
          ec = {};
          focusField = "focusField1";
          fieldIndex = "fieldIndex1";
          map = {};
          sord = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "createDbParameterList",
            params: [ec, focusField, fieldIndex, map, sord]
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
      it("formatDecimals", function (done) {
        expect(function () {
          row = [];
          defs = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "formatDecimals",
            params: [row, defs]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
          name = "name1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "getIndexFromName",
            params: [name]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "getNextRow",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTitle", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "hasMoreRows",
            params: []
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("initOpen", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "initOpen",
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
      it("initOpenMap", function (done) {
        expect(function () {
          ec = {};
          map = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "initOpenMap",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
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
      it("open", function (done) {
        expect(function () {
          ec = {};
          sord = {};
          fieldName = "fieldName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "open",
            params: [ec, sord, fieldName]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("openDbConnection", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "openDbConnection",
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
      it("openMap", function (done) {
        expect(function () {
          ec = {};
          map = {};
          focusName = "focusName1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "openMap",
            params: [ec, map, focusName]
          }).then(function success(jsonResult) {
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("prepareRow", function (done) {
        expect(function () {
          row = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib2", {
            className: "sol.common.ix.DynKwlDatabaseIterator",
            classConfig: {},
            method: "prepareRow",
            params: [row]
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