
describe("[service] sol.common.ix.services.DMSDesktop", function () {
  var originalTimeout, objDMSDesktopId, flowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objDMSDesktop", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objDMSDesktopId1) {
        objDMSDesktopId = objDMSDesktopId1;
        test.Utils.startWorkflow("Unittest", "Unittest", objDMSDesktopId).then(function success1(flowId1) {
          flowId = flowId1;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_common_service_DMSDesktopLoadAsConfig", function () {
      it("result should return serviceName", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopLoadAsConfig", {
          }).then(function success(result) {
            expect(result.serviceName).toBeDefined();
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
    describe("RF_sol_common_service_DMSDesktopGetWfStatus", function () {
      it("should throw if executed without 'flowId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopGetWfStatus", {
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
      it("result should return wfstatus", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopGetWfStatus", {
            flowId: flowId
          }).then(function success(result) {
            expect(result.wfstatus).toBeDefined();
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
    describe("RF_sol_common_service_DMSDesktopTranslate", function () {
      it("should throw if executed without 'keys'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopTranslate", {
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
      it("result should return text", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopTranslate", {
            keys: ["sol.contract.client.ribbon.tabContract"]
          }).then(function success(result) {
            expect(result[0].text).toBeDefined();
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
    describe("RF_sol_common_service_DMSDesktopHandlebars", function () {
      it("should throw if executed without 'transformations'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopHandlebars", {
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
      it("result should return text", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_DMSDesktopHandlebars", {
            transformations: [
              { source: "Hello {{name}}.", context: { name: "Max" } },
              { source: "Hello {{name}}.", context: { name: "Moritz" } }
            ]
          }).then(function success(result) {
            expect(result[0].text).toBeDefined();
            done();
          }, function error(err) {
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
      test.Utils.execute("RF_sol_common_service_ActionCancelForm", { flowId: flowId, nodeId: "1" }).then(function success(jsonResult) {
        test.Utils.getFinishedWorkflows(objDMSDesktopId).then(function success1(wfs) {
          test.Utils.removeFinishedWorkflows(wfs).then(function success2(removeResult) {
            test.Utils.getTempfolder().then(function success3(tempfolder) {
              test.Utils.deleteSord(tempfolder).then(function success4(deleteResult) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});