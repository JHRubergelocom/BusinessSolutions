/* eslint-disable linebreak-style */

describe("[service] sol.pubsec.ix.services.FilingPlanAcl", function () {
  var originalTimeout, objTempId,
      sord, jsonAclItems, visitorFct;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("FilingPlanAcl").then(function success(objTempId1) {
        objTempId = objTempId1;
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
    describe("sol.pubsec.ix.services.FilingPlanAcl", function () {
      it("checkAndRegister", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "checkAndRegister",
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
      it("checkPermission", function (done) {
        expect(function () {
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "checkPermission",
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
      it("deserializeAclArray", function (done) {
        expect(function () {
          jsonAclItems = [];
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "deserializeAclArray",
            params: [jsonAclItems]
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
      it("executeAclChanges", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "executeAclChanges",
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
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
      it("updateAcl", function (done) {
        expect(function () {
          sord = { id: objTempId };
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "updateAcl",
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
      it("walk", function (done) {
        expect(function () {
          visitorFct = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAcl",
            classConfig: {},
            method: "walk",
            params: [visitorFct]
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
    describe("sol.pubsec.ix.services.FilingPlanAclChecks", function () {
      it("isEnabled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib1", {
            className: "sol.pubsec.ix.services.FilingPlanAclChecks",
            classConfig: {},
            method: "isEnabled",
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_pubsec_service_FilingPlanAclChange_Enabled", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_FilingPlanAclChange_Enabled", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.enabled).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_FilingPlanAclChange_Enabled", {
            objId: objTempId
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.enabled).toBeDefined();
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
    describe("RF_sol_pubsec_service_RegisterFilingPlanAclChange", function () {
      it("should throw if executed without Parameter 'startObjId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_RegisterFilingPlanAclChange", {
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
      it("should throw if executed without Parameter 'aclChanges'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_RegisterFilingPlanAclChange", {
            startObjId: objTempId
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
      it("should not throw if executed Parameter {'aclChanges': {} }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_RegisterFilingPlanAclChange", {
            startObjId: objTempId,
            aclChanges: {}
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
      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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