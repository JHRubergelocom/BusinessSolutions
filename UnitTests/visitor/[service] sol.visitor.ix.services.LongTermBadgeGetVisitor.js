/* eslint-disable linebreak-style */

describe("[service] sol.visitor.ix.services.GetVisitor", function () {
  var originalTimeout,
      self, params, _params, visitor,
      config, requestParameters, template, templateData,
      search, arr, objectsOrOtherwise;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetVisitor").then(function success(objTempId) {
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
    describe("sol.visitor.ix.services.LongTermBadge.GetVisitor", function () {
      it("checkRequired", function (done) {
        expect(function () {
          self = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
      it("getCurrentUser", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getCurrentUser",
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
      it("getDefaultTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getDefaultTemplate",
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
      it("getParams", function (done) {
        expect(function () {
          self = {};
          _params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
      it("getTemplate", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getTemplate",
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
      it("getTemplateDirectly", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getTemplateDirectly",
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
      it("getTemplateFromPath", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getTemplateFromPath",
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
      it("getVisitorFromLongTermBadgeTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getVisitorFromLongTermBadgeTemplate",
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
      it("getVisitorStatus", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "getVisitorStatus",
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
          config = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
      it("optimizedExecute", function (done) {
        expect(function () {
          requestParameters = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
      it("prepareTemplatesFromPath", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "prepareTemplatesFromPath",
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
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
      it("render", function (done) {
        expect(function () {
          template = {};
          templateData = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "render",
            params: [template, templateData]
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
      it("search", function (done) {
        expect(function () {
          search = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "search",
            params: [search]
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
      it("setVisitorStatus", function (done) {
        expect(function () {
          visitor = {};
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib1", {
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
            classConfig: {},
            method: "setVisitorStatus",
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
            className: "sol.visitor.ix.services.LongTermBadge.GetVisitor",
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
    describe("RF_sol_visitor_service_LongTermBadge_GetVisitor", function () {
      it("should throw if executed without Parameter 'searchTemplate'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_LongTermBadge_GetVisitor", {
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
      it("should throw if executed without Parameter 'longTermBadge'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_LongTermBadge_GetVisitor", {
            searchTemplate: "templates.visitorfromlongtermbadge"
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
      it("should not throw if executed with Parameter 'longTermBadge", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_LongTermBadge_GetVisitor", {
            searchTemplate: "templates.visitorfromlongtermbadge",
            longTermBadge: { id: "1" }
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