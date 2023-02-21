
describe("[function] sol.recruiting.ix.functions.CreateCommunicationHeadless", function () {
  var postingGuid, requisitionGuid, objIdC, objIdCo,
      configTypes, communicationTemplates,
      candidateGuid, candidateState, candidatePrivateMail, candidatePrivateMobile,
      candidateStreetAddress, candidatePrivatePhone, candidateFirstName,
      candidateLastName, candidateCity, nowDateTime,
      candidateCountry, originalTimeout, interval,
      objId, flowId, templateConfig, templateName, serviceName, serviceArgs;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateCommunicationHeadless").then(function success(objTempId) {
        interval = 4000;
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
    describe("sol.recruiting.ix.functions.CreateCommunicationHeadless", function () {
      it("getSord", function (done) {
        expect(function () {
          objId = 1;
          flowId = 1;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
            className: "sol.recruiting.ix.functions.CreateCommunicationHeadless",
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
    describe("Create Candidate", function () {
      it("create Candidate", function (done) {
        expect(function () {
          candidateState = "Baden-Württemberg";
          candidatePrivateMail = "b.stromberg@elo.com";
          candidatePrivateMobile = "0150672310";
          candidateStreetAddress = "Weingasse 99";
          candidatePrivatePhone = "0799235523";
          candidateFirstName = "Bernd";
          candidateLastName = "Stromberg";
          candidateCity = "Neustadt";
          candidateCountry = "DE";
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadless", {
            template: {
              name: "Default"
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_STATE: candidateState,
                RECRUITING_CANDIDATE_PRIVATEEMAIL: candidatePrivateMail,
                RECRUITING_CANDIDATE_PRIVATEMOBILE: candidatePrivateMobile,
                RECRUITING_CANDIDATE_STREETADDRESS: candidateStreetAddress,
                RECRUITING_CANDIDATE_PRIVATEPHONE: candidatePrivatePhone,
                RECRUITING_POSTING_GUID: postingGuid,
                RECRUITING_REQUISITION_GUID: requisitionGuid
              },
              objKeys: {
                SOL_TYPE: "RECRUITING_CANDIDATE",
                RECRUITING_CANDIDATE_FIRSTNAME: candidateFirstName,
                RECRUITING_CANDIDATE_LASTNAME: candidateLastName,
                RECRUITING_CANDIDATE_CITY: candidateCity,
                RECRUITING_CANDIDATE_COUNTRY: candidateCountry
              }
            }
          }).then(function success(jsonResult) {
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
      it("get candidate guid", function (done) {
        expect(function () {
          test.Utils.getSord(objIdC).then(function success(sordC) {
            candidateGuid = sordC.guid;
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
    });
    describe("RF_sol_recruiting_function_CreateCommunicationHeadless", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCommunicationHeadless", {
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
      it("Communication Templates/Rejection must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Rejection"
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
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("create Communication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCommunicationHeadless", {
            objId: objIdC,
            template: {
              name: communicationTemplates[0].name
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_OBJID: objIdC,
                RECRUITING_CANDIDATE_GUID: candidateGuid,
                RECRUITING_CANDIDATE_STATE: candidateState,
                RECRUITING_CANDIDATE_PRIVATEEMAIL: candidatePrivateMail,
                RECRUITING_CANDIDATE_PRIVATEMOBILE: candidatePrivateMobile,
                RECRUITING_CANDIDATE_STREETADDRESS: candidateStreetAddress,
                RECRUITING_CANDIDATE_PRIVATEPHONE: candidatePrivatePhone,
                RECRUITING_COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                RECRUITING_COMMUNICATION_SENDER: "Administrator"
              },
              objKeys: {
                RECRUITING_CANDIDATE_FIRSTNAME: candidateFirstName,
                RECRUITING_CANDIDATE_LASTNAME: candidateLastName,
                RECRUITING_COMMUNICATION_DATEOFDISPATCH: nowDateTime.date
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
            expect(jsonResult.info).toEqual("Communication created successfully");
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
    describe("Create Candidate", function () {
      it("create Candidate", function (done) {
        expect(function () {
          candidateState = "Baden-Württemberg";
          candidatePrivateMail = "b.stromberg@elo.com";
          candidatePrivateMobile = "0150672310";
          candidateStreetAddress = "Weingasse 99";
          candidatePrivatePhone = "0799235523";
          candidateFirstName = "Bernd";
          candidateLastName = "Stromberg";
          candidateCity = "Neustadt";
          candidateCountry = "DE";
          test.Utils.execute("RF_sol_recruiting_function_CreateCandidateHeadless", {
            template: {
              name: "Default"
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_STATE: candidateState,
                RECRUITING_CANDIDATE_PRIVATEEMAIL: candidatePrivateMail,
                RECRUITING_CANDIDATE_PRIVATEMOBILE: candidatePrivateMobile,
                RECRUITING_CANDIDATE_STREETADDRESS: candidateStreetAddress,
                RECRUITING_CANDIDATE_PRIVATEPHONE: candidatePrivatePhone,
                RECRUITING_POSTING_GUID: postingGuid,
                RECRUITING_REQUISITION_GUID: requisitionGuid
              },
              objKeys: {
                SOL_TYPE: "RECRUITING_CANDIDATE",
                RECRUITING_CANDIDATE_FIRSTNAME: candidateFirstName,
                RECRUITING_CANDIDATE_LASTNAME: candidateLastName,
                RECRUITING_CANDIDATE_CITY: candidateCity,
                RECRUITING_CANDIDATE_COUNTRY: candidateCountry
              }
            }
          }).then(function success(jsonResult) {
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
      it("get candidate guid", function (done) {
        expect(function () {
          test.Utils.getSord(objIdC).then(function success(sordC) {
            candidateGuid = sordC.guid;
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
    });
    describe("RF_sol_recruiting_function_CreateCommunicationHeadlessStrict", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCommunicationHeadlessStrict", {
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
      it("Communication Templates/Rejection must be available", function (done) {
        configTypes = {
          $types: {
            path: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/Communication Templates/Rejection"
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
      it("get current date, time", function () {
        expect(function () {
          nowDateTime = test.Utils.getNowDateTime();
        }).not.toThrow();
      });
      it("create Communication", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreateCommunicationHeadlessStrict", {
            objId: objIdC,
            template: {
              name: communicationTemplates[0].name
            },
            sordMetadata: {
              mapKeys: {
                RECRUITING_CANDIDATE_OBJID: objIdC,
                RECRUITING_CANDIDATE_GUID: candidateGuid,
                RECRUITING_CANDIDATE_STATE: candidateState,
                RECRUITING_CANDIDATE_PRIVATEEMAIL: candidatePrivateMail,
                RECRUITING_CANDIDATE_PRIVATEMOBILE: candidatePrivateMobile,
                RECRUITING_CANDIDATE_STREETADDRESS: candidateStreetAddress,
                RECRUITING_CANDIDATE_PRIVATEPHONE: candidatePrivatePhone,
                RECRUITING_COMMUNICATION_RECIPIENT: "test-business-solutions@elo.local",
                RECRUITING_COMMUNICATION_SENDER: "Administrator"
              },
              objKeys: {
                RECRUITING_CANDIDATE_FIRSTNAME: candidateFirstName,
                RECRUITING_CANDIDATE_LASTNAME: candidateLastName,
                RECRUITING_COMMUNICATION_DATEOFDISPATCH: nowDateTime.date
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
            expect(jsonResult.info).toEqual("Communication created successfully");
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
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("setTimeout (wait for elo as)", function (done) {
        expect(function () {
          test.Utils.setTimeout(interval).then(function success(timeoutResult) {
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
          test.Utils.getActiveWorkflows().then(function success2(wfs) {
            test.Utils.removeActiveWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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