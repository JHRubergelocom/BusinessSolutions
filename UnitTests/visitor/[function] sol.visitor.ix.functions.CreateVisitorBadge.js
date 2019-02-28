
describe("[function] sol.visitor.ix.functions.CreateVisitorBadge", function () {
  var objCreateVisitorBadgeId, objSingleVisitorId, objVisitorBadgeId,
      originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CreateVisitorBadge").then(function success(objCreateVisitorBadgeId1) {
        objCreateVisitorBadgeId = objCreateVisitorBadgeId1;
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          objSingleVisitorId = sordSingleVisitor.id;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/VisitorBadge").then(function success2(sordVisitorBadge) {
            objVisitorBadgeId = sordVisitorBadge.id;
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_function_CreateVisitorBadge", function () {
      it("should throw if executed without Parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_function_CreateVisitorBadge", {
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
      it("create VisitorBadge ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_function_CreateVisitorBadge", {
            objId: objSingleVisitorId,
            cmd: "get",
            param2Obj: { parentId: objSingleVisitorId, targetId: objCreateVisitorBadgeId, templateId: objVisitorBadgeId }
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