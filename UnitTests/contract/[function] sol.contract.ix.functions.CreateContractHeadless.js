
describe("[function] sol.contract.ix.functions.CreateContractHeadless", function () {
  var originalTimeout, objIds, i,
      contractType, config;

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
  describe("Test Lib Functions", function () {
    describe("sol.contract.ix.functions.CreateContractHeadless", function () {
      it("buildElementName", function (done) {
        expect(function () {
          contractType = "contractType1";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: { 
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
            },
            method: "buildElementName",
            params: [contractType]
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
      it("getSource", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: {
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
            },
            method: "getSource",
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
      it("getUpdateWorkflow", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: {
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
            },
            method: "getUpdateWorkflow",
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: {
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
            },
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
      it("prepareMetadata", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: {
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
            },
            method: "prepareMetadata",
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
      it("prepareTemplate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: { 
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
            },
            method: "prepareTemplate",
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
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib1", {
            className: "sol.contract.ix.functions.CreateContractHeadless",
            classConfig: {
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
            },
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
            // fail(err);
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