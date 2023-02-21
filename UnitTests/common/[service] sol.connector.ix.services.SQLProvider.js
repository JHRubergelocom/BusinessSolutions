
describe("[service] sol.connector.ix.services.SQLProvider", function () {
  var originalTimeout, Result, config, JDBC, Query, MaxRows;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SQLProvider", null, null).then(function success(objTempId) {
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
    describe("sol.connector.ix.services.SQLProvider", function () {
      it("convertToStandardformat", function (done) {
        expect(function () {
          Result = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
            method: "convertToStandardformat",
            params: [Result]
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
      it("createHtmlReport", function (done) {
        expect(function () {
          Result = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
            method: "createHtmlReport",
            params: [Result]
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
          config = { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
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
      it("selectData", function (done) {
        expect(function () {
          JDBC = "jdbc/sol.invoice.dx";
          Query = "select * from SFI_COUNTRY";
          MaxRows = 100;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
            method: "selectData",
            params: [JDBC, Query, MaxRows]
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
      it("validateDatasource", function (done) {
        expect(function () {
          JDBC = "jdbc/sol.invoice.dx";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.connector.ix.services.SQLProvider",
            classConfig: { jdbc: "jdbc/sol.invoice.dx", query: "select * from SFI_COUNTRY", maxRows: 100 },
            method: "validateDatasource",
            params: [JDBC]
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
  describe("test SQLProvider", function () {
    it("should not throw if executed without 'jdbc'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_service_SQLProvider", {
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
    it("SQLProvider connect to database", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_service_SQLProvider", {
          jdbc: "jdbc/sol.invoice.dx"
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
    it("SQLProvider connect to database and query", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_service_SQLProvider", {
          jdbc: "jdbc/sol.invoice.dx",
          query: "select * from SFI_COUNTRY",
          maxRows: 100
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