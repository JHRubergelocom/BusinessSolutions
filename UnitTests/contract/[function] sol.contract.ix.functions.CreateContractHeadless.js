
describe("[function] sol.contract.ix.functions.CreateContractHeadless", function () {
  var originalTimeout, objIds, i;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateContractHeadless").then(function success(objCreateContractHeadlessId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_contract_function_CreateContractHeadless", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contract_function_CreateContractHeadless", {
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
      it("create contract headless", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_contract_function_CreateContractHeadless", {
            template: { name: "Standard-Vertrag" },
            sordMetadata: {
              objKeys: {
                CONTRACT_NAME: "Mustervertrag",
                CONTRACT_NO: "C#0999",
                CONTRACT_RESPONSIBLE: "Eva Musterfrau",
                CONTACT_FIRSTNAME: "Max",
                CONTACT_LASTNAME: "Mustermann"
              },
              mapKeys: {
                PARTNER_EMAIL: "m.mustermann@musterfirma.de"
              }
            }
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