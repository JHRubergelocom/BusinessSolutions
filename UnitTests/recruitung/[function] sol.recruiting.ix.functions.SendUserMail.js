
describe("[function] sol.recruiting.ix.functions.SendUserMail", function () {
  var objIdCo, configTypes, communicationTemplates,
      originalTimeout,
      objId, flowId, templateConfig, templateName, serviceName, serviceArgs;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SendUserMail").then(function success(objTempId) {
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
    describe("sol.recruiting.ix.functions.SendUserMail", function () {
      it("getSord", function (done) {
        expect(function () {
          objId = 1;
          flowId = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
            classConfig: {},
            method: "getSord",
            params: [objId, flowId]
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
            classConfig: {},
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
      it("getTemplateObjId", function (done) {
        expect(function () {
          templateConfig = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
            classConfig: {},
            method: "getTemplateObjId",
            params: [templateConfig]
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
      it("getTemplateObjIdByName", function (done) {
        expect(function () {
          templateName = "templateName1";
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
            classConfig: {},
            method: "getTemplateObjIdByName",
            params: [templateName]
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
      it("getTemplates", function (done) {
        expect(function () {
          serviceName = "serviceName1";
          serviceArgs = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
            classConfig: {},
            method: "getTemplates",
            params: [serviceName, serviceArgs]
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SendUserMail",
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
    });
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_recruiting_function_SendUserMail", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SendUserMail", {
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
      it("Communication Templates must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting_jobportal/Configuration/Communication Templates"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(communicationTemplates1) {
          communicationTemplates = communicationTemplates1;
          expect(communicationTemplates).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("communicationTemplates.length must greater than zero", function () {
        expect(communicationTemplates.length).toBeGreaterThan(0);
      });
      it("create Communication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SendUserMail", {
            template: {
              name: communicationTemplates[0].name
            },
            sordMetadata: {
              objKeys: {
                RECRUITING_CANDIDATE_LASTNAME: "Unittest"
              },
              formBlobs: {
                RECRUITING_JOBPORTALUSER_CONFIRMATIONURL: "http://confirm.me/1wf93ewf"
              },
              mapKeys: {
                RECRUITING_COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                RECRUITING_JOBPORTAL_COMPANY: "ELO"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            expect(jsonResult.info).toBeDefined();
            expect(jsonResult.info).toEqual("Communication piece created successfully");
            objIdCo = jsonResult.data.objId;
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
          test.Utils.getFinishedWorkflows(objIdCo).then(function success(wfs) {
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
      it("remove communication object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdCo).then(function success(deleteResult) {
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
    describe("RF_sol_recruiting_function_SendUserMailStrict", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SendUserMailStrict", {
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
      it("Communication Templates must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting_jobportal/Configuration/Communication Templates"
          }
        };
        test.Utils.execute("RF_sol_common_service_StandardTypes", configTypes).then(function success(communicationTemplates1) {
          communicationTemplates = communicationTemplates1;
          expect(communicationTemplates).toBeDefined();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      });
      it("communicationTemplates.length must greater than zero", function () {
        expect(communicationTemplates.length).toBeGreaterThan(0);
      });
      it("create Communication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SendUserMail", {
            template: {
              name: communicationTemplates[0].name
            },
            sordMetadata: {
              objKeys: {
                RECRUITING_CANDIDATE_LASTNAME: "Unittest"
              },
              formBlobs: {
                RECRUITING_JOBPORTALUSER_CONFIRMATIONURL: "http://confirm.me/1wf93ewf"
              },
              mapKeys: {
                RECRUITING_COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                RECRUITING_JOBPORTAL_COMPANY: "ELO"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            expect(jsonResult.info).toBeDefined();
            expect(jsonResult.info).toEqual("Communication piece created successfully");
            objIdCo = jsonResult.data.objId;
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
      it("remove communication object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdCo).then(function success(deleteResult) {
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