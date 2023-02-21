
describe("[function] sol.recruiting.ix.functions.SetPostingFields", function () {
  var objIdR, objIdP, objTempId, requisitionId, requisitionGuid, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetPostingFields").then(function success(objTempId1) {
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
    describe("sol.recruiting.ix.functions.SetPostingFields", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.functions.SetPostingFields",
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
          requisitionId = sordR.id;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_recruiting_function_SetPostingFields", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SetPostingFields", {
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
      it("Set Posting Fields", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_SetPostingFields", {
            objId: objIdP
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
          test.Utils.deleteSord(objIdP).then(function success2(deleteResult1) {
            test.Utils.deleteSord(objIdR).then(function success3(deleteResult2) {
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