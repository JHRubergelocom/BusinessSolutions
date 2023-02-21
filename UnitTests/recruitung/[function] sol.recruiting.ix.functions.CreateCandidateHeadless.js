
describe("[function] sol.recruiting.ix.functions.CreateCandidateHeadless", function () {
  var objIdC, postingGuid, requisitionGuid, originalTimeout,
      objId, flowId, templateConfig, templateName, serviceName, serviceArgs;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateCandidateHeadless").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Test data/Requisition/Posting").then(function success1(sordPosting) {
          postingGuid = sordPosting.guid;
          test.Utils.getMapValue(sordPosting.id, "RECRUITING_REQUISITION_GUID").then(function success2(requisitionGuid1) {
            requisitionGuid = requisitionGuid1;
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
    describe("sol.recruiting.ix.functions.CreateCandidateHeadless", function () {
      it("getSord", function (done) {
        expect(function () {
          objId = 1;
          flowId = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCandidateHeadless",
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
    describe("RF_sol_recruiting_function_CreateCandidateHeadless", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadless", {
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
      it("create Candidate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadless", {
            template: {
              name: "Default"
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_STATE: "Baden-Württemberg",
                RECRUITING_CANDIDATE_PRIVATEEMAIL: "b.stromberg@elo.com",
                RECRUITING_CANDIDATE_PRIVATEMOBILE: "0150672310",
                RECRUITING_CANDIDATE_STREETADDRESS: "Weingasse 99",
                RECRUITING_CANDIDATE_PRIVATEPHONE: "0799235523",
                RECRUITING_POSTING_GUID: postingGuid,
                RECRUITING_REQUISITION_GUID: requisitionGuid
              },
              objKeys: {
                SOL_TYPE: "RECRUITING_CANDIDATE",
                RECRUITING_CANDIDATE_FIRSTNAME: "Bernd",
                RECRUITING_CANDIDATE_LASTNAME: "Stromberg",
                RECRUITING_CANDIDATE_CITY: "Neustadt",
                RECRUITING_CANDIDATE_COUNTRY: "DE"
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
            expect(jsonResult.info).toEqual("Candidate created successfully");
            objIdC = jsonResult.data.objId;
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
          test.Utils.getFinishedWorkflows(objIdC).then(function success(wfs) {
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
      it("remove candidate object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdC).then(function success(deleteResult) {
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
    describe("RF_sol_recruiting_function_CreateCandidateHeadlessStrict", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadlessStrict", {
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
      it("create Candidate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadlessStrict", {
            template: {
              name: "Default"
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_STATE: "Baden-Württemberg",
                RECRUITING_CANDIDATE_PRIVATEEMAIL: "n.armstrong@elo.com",
                RECRUITING_CANDIDATE_PRIVATEMOBILE: "0156672310",
                RECRUITING_CANDIDATE_STREETADDRESS: "Mondgasse 99",
                RECRUITING_CANDIDATE_PRIVATEPHONE: "0555235523",
                RECRUITING_POSTING_GUID: postingGuid,
                RECRUITING_REQUISITION_GUID: requisitionGuid
              },
              objKeys: {
                SOL_TYPE: "RECRUITING_CANDIDATE",
                RECRUITING_CANDIDATE_FIRSTNAME: "Nils",
                RECRUITING_CANDIDATE_LASTNAME: "Armstrong",
                RECRUITING_CANDIDATE_CITY: "Mondstadt",
                RECRUITING_CANDIDATE_COUNTRY: "DE"
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
            expect(jsonResult.info).toEqual("Candidate created successfully");
            objIdC = jsonResult.data.objId;
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
      it("remove candidate object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdC).then(function success(deleteResult) {
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