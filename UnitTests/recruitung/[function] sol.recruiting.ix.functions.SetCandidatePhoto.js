
describe("[function] sol.recruiting.ix.functions.SetCandidatePhoto", function () {
  var objIdR, objIdP, objIdC,
      objSmileyBase64Id, base64Content,
      maskName, pictureName, pictureGuid,
      objTempId, requisitionId, requisitionGuid, postingGuid,
      originalTimeout,
      photo, candidate, guid, photoguid;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetCandidatePhoto").then(function success(objTempId1) {
        objTempId = objTempId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Test data/SmileyBase64").then(function success1(sordSmileyBase64) {
          objSmileyBase64Id = sordSmileyBase64.id;
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
    describe("sol.recruiting.ix.functions.SetCandidatePhoto", function () {
      it("copyPhotoToCandidate", function (done) {
        expect(function () {
          photo = {};
          candidate = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
            classConfig: {},
            method: "copyPhotoToCandidate",
            params: [photo, candidate]
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
      it("getObjIdFromGuid", function (done) {
        expect(function () {
          guid = objSmileyBase64Id.guid;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
            classConfig: {},
            method: "getObjIdFromGuid",
            params: [guid]
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
      it("getPhotoFromUserProfile", function (done) {
        expect(function () {
          candidate = {};
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
            classConfig: {},
            method: "getPhotoFromUserProfile",
            params: [candidate]
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
      it("jobportalInstalled", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
            classConfig: {},
            method: "jobportalInstalled",
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
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
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
      it("setCandidatePhoto", function (done) {
        expect(function () {
          candidate = {};
          photoguid = objSmileyBase64Id.guid;
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetCandidatePhoto",
            classConfig: {},
            method: "setCandidatePhoto",
            params: [candidate, photoguid]
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
    it("get requisitionGuid and requisitionId", function (done) {
      expect(function () {
        test.Utils.getSord(objIdR).then(function success(sordR) {
          requisitionGuid = sordR.guid;
          requisitionId = sordR.id;
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
  describe("Get Photo", function () {
    it("load candidate picture", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_DownloadFileContent", {
          objId: objSmileyBase64Id
        }).then(function success1(jsonData) {
          base64Content = jsonData.content;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("get maskname, pictureName form recruiting.config", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_GetConfig", {
          objId: "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting/Configuration/recruiting.config"
        }).then(function success(configResult) {
          maskName = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoConfig.maskName;
          pictureName = configResult.config.entities.candidate.workflowMixins.capturepicture.set.scriptProperties.entries[0].value.photoConfig.pictureName;
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("upload candidate picture", function (done) {
      expect(function () {
        base64Content = base64Content.replace(/^data:image\/(jpeg|png|gif|bmp);base64,/, "");
        test.Utils.execute("RF_sol_common_document_service_UploadFile", {
          objId: objIdC,
          base64Content: base64Content,
          cfg: { maskName: maskName, pictureName: pictureName }
        }).then(function success(jsonResult) {
          pictureGuid = jsonResult.guid;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_function_SetCandidatePhoto", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SetCandidatePhoto", {
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
      it("Set Photo Guid to Candidate", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SetCandidatePhoto", {
            candidate: objIdC,
            photoguid: pictureGuid
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
              test.Utils.deleteSord(objIdR).then(function success4(deleteResult3) {
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
    }).not.toThrow();
  });
});