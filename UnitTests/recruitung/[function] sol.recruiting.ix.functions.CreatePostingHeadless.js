
describe("[function] sol.recruiting.ix.functions.CreatePostingHeadless", function () {
  var objIdP, requisitionGuid, requisitionId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreatePostingHeadless").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/recruiting [unit tests]/Test data/Requisition").then(function success1(sordRequisition) {
          requisitionGuid = sordRequisition.guid;
          requisitionId = sordRequisition.id;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_recruiting_function_CreatePostingHeadless", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreatePostingHeadless", {
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
                RECRUITING_POSTING_NAME: "Chaosclub"
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
            expect(jsonResult.info).toEqual("Posting created successfully");
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
      it("remove posting object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdP).then(function success(deleteResult) {
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
    describe("RF_sol_recruiting_function_CreatePostingHeadlessStrict", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreatePostingHeadlessStrict", {
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
      it("create Posting", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_function_CreatePostingHeadlessStrict", {
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
            expect(jsonResult).toBeDefined();
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            expect(jsonResult.data).toBeDefined();
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            expect(jsonResult.info).toBeDefined();
            expect(jsonResult.info).toEqual("Posting created successfully");
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
      it("remove posting object", function (done) {
        expect(function () {
          test.Utils.deleteSord(objIdP).then(function success(deleteResult) {
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