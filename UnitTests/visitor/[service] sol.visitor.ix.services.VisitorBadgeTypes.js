
describe("[service] sol.visitor.ix.services.VisitorBadgeTypes", function () {
  var objSingleVisitorId, objGroupId,
      sordSingleVisitor, sordGroup,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("VisitorBadgeTypes").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor1) {
          sordSingleVisitor = sordSingleVisitor1;
          objSingleVisitorId = sordSingleVisitor.id;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/Group").then(function success2(sordGroup1) {
            sordGroup = sordGroup1;
            objGroupId = sordGroup.id;
            test.Utils.updateKeywording(sordSingleVisitor, { SOL_TYPE: "VISITOR" }, true).then(function success3(updateResult) {
              test.Utils.updateKeywording(sordGroup, { SOL_TYPE: "VISITOR_GROUP" }, true).then(function success4(updateResult1) {
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_service_GetVisitorBadgeTypes", function () {
      it("should not throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_GetVisitorBadgeTypes", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            expect(jsonResult[0].objId).toBeDefined();
            expect(jsonResult[0].name).toBeDefined();
            expect(jsonResult[0].desc).toBeDefined();
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
    describe("RF_sol_visitor_service_CheckVisitorBadgePreconditions", function () {
      it("should throw if executed without Parameter 'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", {
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
      it("should not throw if executed Parameter {'targetId': 1 }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", {
            targetId: 1
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(false);
            expect(jsonResult.msg).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': objSingleVisitorId }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", {
            targetId: objSingleVisitorId
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            expect(jsonResult.types[0].objId).toBeDefined();
            expect(jsonResult.types[0].name).toBeDefined();
            expect(jsonResult.types[0].desc).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'targetId': objGroupId }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_CheckVisitorBadgePreconditions", {
            targetId: objGroupId
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            expect(jsonResult.types).toBeDefined();
            expect(jsonResult.types.length).toBeGreaterThan(0);
            expect(jsonResult.types[0].objId).toBeDefined();
            expect(jsonResult.types[0].name).toBeDefined();
            expect(jsonResult.types[0].desc).toBeDefined();
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
          test.Utils.updateKeywording(sordSingleVisitor, { SOL_TYPE: "" }, true).then(function success2(updateResult) {
            test.Utils.updateKeywording(sordGroup, { SOL_TYPE: "" }, true).then(function success3(updateResult1) {
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