
describe("[lib] sol.unittest.ix.services.SolVisitorUtils", function () {
  var UtilsSord, originalTimeout, objId, sord, longtermBadge;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolVisitorUtils").then(function success(obSolVisitorUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/visitor [unit tests]/Resources/Utils").then(function success1(UtilsSord1) {
          UtilsSord = UtilsSord1;
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
    describe("sol.visitor.Utils", function () {
      it("getParentVisitor", function (done) {
        expect(function () {
          objId = UtilsSord.id;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "getParentVisitor",
            params: [objId]
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
      it("isVisitor", function (done) {
        expect(function () {
          sord = UtilsSord.id;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "isVisitor",
            params: [sord]
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
      it("isLongtermBadge", function (done) {
        expect(function () {
          sord = UtilsSord.id;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "isLongtermBadge",
            params: [sord]
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
      it("isLongtermBadgeActive", function (done) {
        expect(function () {
          longtermBadge = UtilsSord.id;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "isLongtermBadgeActive",
            params: [longtermBadge]
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
      it("isLongtermBadgeInValidTimerange", function (done) {
        expect(function () {
          longtermBadge = UtilsSord.id;
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "isLongtermBadgeInValidTimerange",
            params: [longtermBadge]
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_visitor_service_ExecuteLib", {
            className: "sol.visitor.Utils",
            classConfig: {},
            method: "loadConfig",
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