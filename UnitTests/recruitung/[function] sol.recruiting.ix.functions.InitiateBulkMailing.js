
describe("[function] sol.recruiting.ix.functions.InitiateBulkMailing", function () {
  var objIdR, objTempId, metadataMapping, requisitionGuid, mapTable,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("InitiateBulkMailing").then(function success(objTempId1) {
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
  describe("Create Requisition", function () {
    it("create Requisition", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_recruiting_function_CreateRequisitionHeadless", {
          objId: objTempId,
          template: {
            name: "Default"
          },
          sordMetadata: {
            objKeys: {
              SOL_TYPE: "RECRUITING_REQUISITION",
              RECRUITING_REQUISITION_NAME: "MSD",
              RECRUITING_REQUISITION_DESC: "Master of Desaster"
            }
          }
        }).then(function success(jsonResult) {
          objIdR = jsonResult.data.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get requisitionGuid", function (done) {
      expect(function () {
        test.Utils.getSord(objIdR).then(function success(sordR) {
          requisitionGuid = sordR.guid;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("remove workflows", function (done) {
      expect(function () {
        test.Utils.getFinishedWorkflows(objIdR).then(function success(wfs) {
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
  describe("Set mappings communications", function () {
    it("set maptable communications", function (done) {
      expect(function () {
        mapTable = {
          RECRUITING_COMMUNICATION_DATEOFDISPATCH1: "20181115",
          RECRUITING_CANDIDATE_OBJID1: "4327",
          RECRUITING_COMMUNICATION_RECIPIENT1: "test-business-solutions@elo.local",
          RECRUITING_CANDIDATE_COMMUNICATION_TEMPLATE1: "4071",
          RECRUITING_CANDIDATE_MOVETOPOOL1: "4168",
          RECRUITING_CANDIDATE_NO1: "D0011"
        };
        test.Utils.updateMapData(objTempId, mapTable).then(function success(updateMapDataResult) {
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get metadataMapping from recruiting.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/recruiting.config"
        }).then(function success(configResult) {
          metadataMapping = configResult.config.entities.requisition.workflowMixins.conclude.initiatebulkmailing.scriptProperties.metadataMapping;
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
// TODO
  describe("Tests Registered Functions", function () {
    describe("RF_sol_recruiting_function_InitiateBulkMailing", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_InitiateBulkMailing", {
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
      it("Initiate Bulk Mailing", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_InitiateBulkMailing", {
            objId: objTempId,
            metadataMapping: metadataMapping
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
          test.Utils.deleteSord(objIdR).then(function success2(deleteResult1) {
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
});