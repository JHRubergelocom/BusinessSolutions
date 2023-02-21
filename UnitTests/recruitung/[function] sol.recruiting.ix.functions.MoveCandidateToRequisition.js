
describe("[function] sol.recruiting.ix.functions.MoveCandidateToRequisition", function () {
  var objIdR1, objIdR2, requisition2No, objIdP, objIdC, candidateNo,
      objTempId, requisitionId, requisitionGuid, postingGuid,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("MoveCandidateToRequisition").then(function success(objTempId1) {
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
    describe("sol.recruiting.ix.functions.MoveCandidateToRequisition", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.MoveCandidateToRequisition",
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
  describe("Create Requisition1", function () {
    it("create Requisition1", function (done) {
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
          objIdR1 = jsonResult.data.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get requisitionGuid and requisitionId", function (done) {
      expect(function () {
        test.Utils.getSord(objIdR1).then(function success(sordR1) {
          requisitionGuid = sordR1.guid;
          requisitionId = sordR1.id;
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
        test.Utils.getFinishedWorkflows(objIdR1).then(function success(wfs) {
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
  describe("Create Posting", function () {
    it("create Posting", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_recruiting_function_CreatePostingHeadless", {
          objId: requisitionId,
          template: {
            name: "Neue Ausschreibung"
          },
          sordMetadata: {
            mapKeys: {
              RECRUITING_REQUISITION_GUID: requisitionGuid
            },
            objKeys: {
              SOL_TYPE: "RECRUITING_POSTING",
              RECRUITING_POSTING_NAME: "Chaostruppe"
            }
          }
        }).then(function success(jsonResult) {
          objIdP = jsonResult.data.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get postingGuid", function (done) {
      expect(function () {
        test.Utils.getSord(objIdP).then(function success(sordP) {
          postingGuid = sordP.guid;
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
        test.Utils.getFinishedWorkflows(objIdP).then(function success(wfs) {
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
  describe("Create Candidate", function () {
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
    it("get candidateNo", function (done) {
      expect(function () {
        test.Utils.getSord(objIdC).then(function success(sordC) {
          candidateNo = test.Utils.getObjKeyValue(sordC, "RECRUITING_CANDIDATE_NO");
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
  describe("Create Requisition2", function () {
    it("create Requisition2", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_recruiting_function_CreateRequisitionHeadless", {
          objId: objTempId,
          template: {
            name: "Default"
          },
          sordMetadata: {
            objKeys: {
              SOL_TYPE: "RECRUITING_REQUISITION",
              RECRUITING_REQUISITION_NAME: "EZ",
              RECRUITING_REQUISITION_DESC: "Erbsenzähler"
            }
          }
        }).then(function success(jsonResult) {
          objIdR2 = jsonResult.data.objId;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get requisition2No", function (done) {
      expect(function () {
        test.Utils.getSord(objIdR2).then(function success(sordR2) {
          requisition2No = test.Utils.getObjKeyValue(sordR2, "RECRUITING_REQUISITION_NO");
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
        test.Utils.getFinishedWorkflows(objIdR2).then(function success(wfs) {
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_function_MoveCandidateToRequisition", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_MoveCandidateToRequisition", {
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
      it("Move Candidate from Requisition1 to Requisition2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_MoveCandidateToRequisition", {
            candidate: candidateNo,
            requisition: requisition2No
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
          test.Utils.deleteSord(objIdC).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdP).then(function success3(deleteResult2) {
              test.Utils.deleteSord(objIdR1).then(function success4(deleteResult3) {
                test.Utils.deleteSord(objIdR2).then(function success5(deleteResult4) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
});