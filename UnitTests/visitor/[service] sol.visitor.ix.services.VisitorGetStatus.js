/* eslint-disable linebreak-style */

describe("[service] sol.visitor.ix.services.VisitorGetStatus", function () {
  var originalTimeout,
      visitor, params, self, _params, date,
      requestParameters, arr, objectsOrOtherwise;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("VisitorGetStatus").then(function success(objTempId) {
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
    describe("sol.visitor.ix.services.Visitor.GetStatus", function () {
      it("checkIfVisitorDateIsToday", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "checkIfVisitorDateIsToday",
            params: [visitor]
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
      it("checkIfVisitorIsAlreadyCheckedOut", function (done) {
        expect(function () {
          visitor = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "checkIfVisitorIsAlreadyCheckedOut",
            params: [visitor, params]
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
      it("checkIfVisitorIsCheckedIn", function (done) {
        visitor = {};
        params = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "checkIfVisitorIsCheckedIn",
            params: [visitor, params]
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
      it("checkRequired", function (done) {
        expect(function () {
          self = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "checkRequired",
            params: [self, params]
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
      it("getParams", function (done) {
        expect(function () {
          self = {};
          _params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "getParams",
            params: [self, _params]
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
      it("getStartOrArrivalDate", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "getStartOrArrivalDate",
            params: [visitor]
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
      it("getStatusOfVisitor", function (done) {
        expect(function () {
          visitor = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "getStatusOfVisitor",
            params: [visitor, params]
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
      it("getToday", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "getToday",
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
      it("hasStartOrArrivalDate", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "hasStartOrArrivalDate",
            params: [visitor]
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
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "initialize",
            params: [params]
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
      it("isToday", function (done) {
        expect(function () {
          date = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "isToday",
            params: [date]
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
      it("optimizedExecute", function (done) {
        expect(function () {
          requestParameters = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "optimizedExecute",
            params: [requestParameters]
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
          _params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "process",
            params: [_params]
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
      it("withDefault", function (done) {
        expect(function () {
          arr = [];
          objectsOrOtherwise = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetStatus",
            classConfig: {},
            method: "checkRequired",
            params: [arr, objectsOrOtherwise]
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
    describe("RF_sol_visitor_service_Visitor_GetStatus", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_Visitor_GetStatus", {
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
      it("should not throw if executed with Parameter 'visitor", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_Visitor_GetStatus", {
            visitor: { id: "1" }
          }).then(function success(jsonResult) {
            expect(jsonResult.isCheckedIn).toBeDefined();
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