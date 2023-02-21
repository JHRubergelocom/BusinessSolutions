
describe("[function] sol.contract.ix.functions.CreatePartner", function () {
  var originalTimeout, objIds, i,
      objCreatePartnerId, config, sord, mappings, fieldCfg, createResult;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreatePartner").then(function success(objCreatePartnerId1) {
        objCreatePartnerId = objCreatePartnerId1;
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
    describe("sol.contract.ix.functions.CreatePartner", function () {
      it("buildData", function (done) {
        expect(function () {
          sord = objCreatePartnerId;
          mappings = [];
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "buildData",
            params: [sord, mappings]
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
      it("checkAutomaticCreation", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "checkAutomaticCreation",
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
      it("checkCreateCompany", function (done) {
        expect(function () {
          sord = objCreatePartnerId;
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "checkCreateCompany",
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
      it("checkCreateContact", function (done) {
        expect(function () {
          sord = objCreatePartnerId;
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "checkCreateContact",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
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
          sord = objCreatePartnerId;
          fieldCfg = { type: "SORD", key: "id" };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "isEmpty",
            params: [sord, fieldCfg]
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
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
      it("updateContactRef", function (done) {
        expect(function () {
          sord = objCreatePartnerId;
          createResult = {};
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "updateContactRef",
            params: [sord, createResult]
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
      it("updatePartnerNo", function (done) {
        expect(function () {
          sord = objCreatePartnerId;
          createResult = {};
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreatePartner",
            classConfig: { objId: objCreatePartnerId },
            method: "updatePartnerNo",
            params: [sord, createResult]
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            objIds = [];
            for (i = 0; i < wfs.length; i++) {
              objIds.push(wfs[i].objId);
            }
            test.Utils.deleteSords(objIds).then(function success1(deleteResult) {
              test.Utils.removeFinishedWorkflows(wfs).then(function success2(removeFinishedWorkflowsResult) {
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
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getActiveWorkflows().then(function success(wfs) {
            objIds = [];
            for (i = 0; i < wfs.length; i++) {
              objIds.push(wfs[i].objId);
            }
            test.Utils.deleteSords(objIds).then(function success1(deleteResult) {
              test.Utils.removeActiveWorkflows(wfs).then(function success2(removeFinishedWorkflowsResult) {
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