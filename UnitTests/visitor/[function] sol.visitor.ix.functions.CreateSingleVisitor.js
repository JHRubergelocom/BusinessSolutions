
describe("[function] sol.visitor.ix.functions.CreateSingleVisitor", function () {
  var objGroupId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateSingleVisitor").then(function success(objCreateSingleVisitorId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/Group").then(function success1(sordGroup) {
          objGroupId = sordGroup.id;
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
    describe("RF_sol_visitor_function_CreateSingleVisitor", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_CreateSingleVisitor", {
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
      it("create single visitor1 and visitor2", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_CreateSingleVisitor", {
            objId: objGroupId
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
      it("delete single visitor1 in group sord", function (done) {
        expect(function () {
          test.Utils.getMapValue(objGroupId, "VISITOR_GUID1").then(function success(objIdSingleVs1) {
            test.Utils.deleteSord(objIdSingleVs1).then(function success1(deleteResult) {
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
      it("delete single visitor2 in group sord", function (done) {
        expect(function () {
          test.Utils.getMapValue(objGroupId, "VISITOR_GUID2").then(function success(objIdSingleVs2) {
            test.Utils.deleteSord(objIdSingleVs2).then(function success1(deleteResult) {
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
      it("reset visitor guids in group sord", function (done) {
        expect(function () {
          test.Utils.updateMapData(objGroupId, { VISITOR_GUID1: "", VISITOR_GUID2: "" }).then(function success(updateMapDataResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("rename group sord", function (done) {
        expect(function () {
          test.Utils.getSord(objGroupId).then(function success(sordGroup) {
            test.Utils.updateSord(sordGroup, [{ key: "name", value: "Group" }]).then(function success1(updateResult) {
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
          test.Utils.getFinishedWorkflows().then(function success8(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success9(removeFinishedWorkflowsResult) {
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