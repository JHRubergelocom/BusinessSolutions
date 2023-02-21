
describe("[lib] sol.unittest.ix.services.SolCommonConfigMixin", function () {
  var ConfigMixinSord, userName, userInfo, originalTimeout, config, property, configuration, allProps;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonConfigMixin").then(function success(obSolCommonConfigMixinId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ConfigMixin").then(function success1(ConfigMixinSord1) {
          ConfigMixinSord = ConfigMixinSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.common.ConfigMixin", function () {
      it("extractConfigPart", function (done) {
        expect(function () {
          config = { key1: "value1", key2: { xx: "yy" } };
          property = "key2";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "extractConfigPart",
            params: [config, property]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ xx: "yy" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("extractConfigPart", function (done) {
        expect(function () {
          config = { key1: "value1", key2: { xx: { aa: "bb" } } };
          property = "key2";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "extractConfigPart",
            params: [config, property]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ xx: { aa: "bb" } });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("extractConfigPart", function (done) {
        expect(function () {
          config = { key1: "value1", key2: { xx: { aa: "bb" } } };
          property = "key2.xx";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "extractConfigPart",
            params: [config, property]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ aa: "bb" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("mergeConfiguration", function (done) {
        expect(function () {
          configuration = { key1: "value1", key2: { xx: { aa: "bb" } } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "mergeConfiguration",
            params: [configuration]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ key1: "value1", key2: { xx: { aa: "bb" } } });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("parseConfiguration", function (done) {
        expect(function () {
          configuration = { key1: "value1", $key2: { xx: { aa: "bb" } } };
          allProps = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "parseConfiguration",
            params: [configuration, allProps]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ key1: "value1", $key2: { xx: { aa: "bb" } }, config: { key1: "value1", $key2: { xx: { aa: "bb" } } } });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("parseConfiguration", function (done) {
        expect(function () {
          configuration = { key1: "value1", $key2: { xx: { aa: "bb" } } };
          allProps = false;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.ConfigMixin",
            classConfig: {},
            method: "parseConfiguration",
            params: [configuration, allProps]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ key1: "value1", $key2: { xx: { aa: "bb" } }, config: { key1: "value1" } });
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