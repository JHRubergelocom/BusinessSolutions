
describe("[lib] sol.unittest.ix.services.SolPubsecUtils", function () {
  var objTempId, originalTimeout, parentObjId, objIds,
      mappings, target, mask, name, params, sord, type, targetId,
      refObjIds, requestType, obSolPubsecUtilsId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolPubsecUtils").then(function success(obSolPubsecUtilsId1) {
        obSolPubsecUtilsId = obSolPubsecUtilsId1;
        test.Utils.createSord(obSolPubsecUtilsId).then(function success1(objTempId1) {
          objTempId = objTempId1;
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
    describe("sol.pubsec.Utils", function () {
      it("copyMetadataToMap", function (done) {
        expect(function () {
          parentObjId = obSolPubsecUtilsId;
          objIds = [obSolPubsecUtilsId];
          mappings = [{ from: { type: "SORD", key: "maskName" }, to: "SOL_UNITTEST_TYPE" }];
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "copyMetadataToMap",
            params: [parentObjId, objIds, mappings]
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
      it("createFolder", function (done) {
        expect(function () {
          target = obSolPubsecUtilsId;
          mask = "UnitTest";
          name = "name1";
          params = {};
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "createFolder",
            params: [target, mask, name, params]
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
      it("determineType", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "determineType",
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
      it("isDocument", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isDocument",
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
      it("isFile", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isFile",
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
      it("isFilingPlan", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isFilingPlan",
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
      it("isFilingPlanStructure", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isFilingPlanStructure",
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
      it("isOfType", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          type = "UNITTEST";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isOfType",
            params: [sord, type]
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
      it("isProcess", function (done) {
        expect(function () {
          sord = obSolPubsecUtilsId;
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "isProcess",
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
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
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
      it("referenceElements", function (done) {
        expect(function () {
          targetId = obSolPubsecUtilsId;
          refObjIds = [objTempId];
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "referenceElements",
            params: [targetId, refObjIds]
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
      it("retrieveRequestMask", function (done) {
        expect(function () {
          requestType = "open";
          test.Utils.execute("RF_sol_unittest_pubsec_service_ExecuteLib", {
            className: "sol.pubsec.Utils",
            classConfig: {},
            method: "retrieveRequestMask",
            params: [requestType]
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