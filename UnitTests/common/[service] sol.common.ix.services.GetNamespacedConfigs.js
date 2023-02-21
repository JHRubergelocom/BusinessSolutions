
describe("[service] sol.common.ix.services.GetNamespacedConfigs", function () {
  var originalTimeout,
      config, path, configContainer, acc, arr;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetNamespacedConfigs").then(function success(obGetNamespacedConfigsId) {
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
    describe("sol.common.ix.services.GetNamespacedConfigs", function () {
      it("checkNamespace", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "checkNamespace",
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
      it("filterInvalidPaths", function (done) {
        expect(function () {
          path = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "filterInvalidPaths",
            params: [path]
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
      it("getAllSolutionsPaths", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getAllSolutionsPaths",
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
      it("getBusinessSolutionBaseFolder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getBusinessSolutionBaseFolder",
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
      it("getBusinessSolutionBaseFolderNames", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getBusinessSolutionBaseFolderNames",
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
      it("getBusinessSolutionBasePath", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getBusinessSolutionBasePath",
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
      it("getComposedConfig", function (done) {
        expect(function () {
          path = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getComposedConfig",
            params: [path]
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
      it("getConfigs", function (done) {
        expect(function () {
          configContainer = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "getConfigs",
            params: [configContainer]
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
      it("groupByIdAndNamespace", function (done) {
        expect(function () {
          acc = {};
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "groupByIdAndNamespace",
            params: [acc, config]
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
          config = { allSolutions: true };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
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
      it("isEmpty", function (done) {
        expect(function () {
          configContainer = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "isEmpty",
            params: [configContainer]
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
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
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
      it("removeDuplicats", function (done) {
        expect(function () {
          arr = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib9", {
            className: "sol.common.ix.services.GetNamespacedConfigs",
            classConfig: { allSolutions: true },
            method: "removeDuplicats",
            params: [arr]
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
    describe("RF_sol_common_service_GetNamespacedConfigs", function () {
      it("should throw if executed without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetNamespacedConfigs", {
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
      it("should not throw if executed with 'allSolutions'set to true", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetNamespacedConfigs", {
            allSolutions: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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