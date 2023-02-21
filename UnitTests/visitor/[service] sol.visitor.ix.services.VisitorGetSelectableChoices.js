/* eslint-disable linebreak-style */

describe("[service] sol.visitor.ix.services.VisitorGetSelectableChoices", function () {
  var originalTimeout,
      self, params, obj, _params, visitor,
      arr, objectsOrOtherwise;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("VisitorGetSelectableChoices").then(function success(objTempId) {
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
    describe("sol.visitor.ix.services.Visitor.GetSelectableChoices", function () {
      it("checkRequired", function (done) {
        expect(function () {
          self = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
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
      it("filterFalsy", function (done) {
        expect(function () {
          obj = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
            classConfig: {},
            method: "filterFalsy",
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
      it("getParams", function (done) {
        self = {};
        _params = {};
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
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
      it("initialize", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
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
      it("process", function (done) {
        expect(function () {
          _params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
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
      it("visitorToSelectionChoice", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
            classConfig: {},
            method: "visitorToSelectionChoice",
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
      it("withDefault", function (done) {
        expect(function () {
          arr = [];
          objectsOrOtherwise = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.Visitor.GetSelectableChoices",
            classConfig: {},
            method: "withDefault",
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
    describe("RF_sol_visitor_service_visitor_GetSelectableChoices", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_visitor_GetSelectableChoices", {
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
      it("should not throw if executed with Parameter 'visitors", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_visitor_GetSelectableChoices", {
            visitors: []
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