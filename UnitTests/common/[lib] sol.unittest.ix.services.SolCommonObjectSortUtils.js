/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonObjectSortUtils", function () {
  var originalTimeout, a, b, arr, sortCriterias, options, sorts;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonObjectSortUtils").then(function success(obSolCommonObjectSortUtilsId) {
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
    describe("sol.common.ObjectSortUtils", function () {
      it("date", function (done) {
        expect(function () {
          a = "20210713";
          b = "20210302";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.ObjectSortUtils",
            classConfig: {},
            method: "date",
            params: [a, b]
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
          a = 10;
          b = 12;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.ObjectSortUtils",
            classConfig: {},
            method: "default",
            params: [a, b]
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
      it("number", function (done) {
        expect(function () {
          a = 11.3;
          b = 27.56;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.ObjectSortUtils",
            classConfig: {},
            method: "number",
            params: [a, b]
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
    describe("sol.common.mixins.ObjectSort", function () {
      it("sortArray", function (done) {
        expect(function () {
          arr = [];
          sortCriterias = [];
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ObjectSort",
            classConfig: {},
            method: "sortArray",
            params: [arr, sortCriterias, options]
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
      it("hasSortCriteria", function (done) {
        expect(function () {
          sortCriterias = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ObjectSort",
            classConfig: {},
            method: "hasSortCriteria",
            params: [sortCriterias]
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
      it("generateSort", function (done) {
        expect(function () {
          sorts = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib6", {
            className: "sol.common.mixins.ObjectSort",
            classConfig: {},
            method: "generateSort",
            params: [sorts]
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