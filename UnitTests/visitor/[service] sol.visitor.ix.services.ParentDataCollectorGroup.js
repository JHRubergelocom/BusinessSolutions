
describe("[service] sol.visitor.ix.services.ParentDataCollectorGroup", function () {
  var objSingleVisitorId, objGroupId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ParentDataCollectorGroup").then(function success(objParentDataCollectorGroupId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success1(sordSingleVisitor) {
          objSingleVisitorId = sordSingleVisitor.id;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/Group").then(function success2(sordGroup) {
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
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_visitor_service_ParentDataCollectorGroup", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_ParentDataCollectorGroup", {
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
      it("ParentDataCollectorGroup with SingleVisitor", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_ParentDataCollectorGroup", {
            objId: objSingleVisitorId,
            returnDataDefinition: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult).not.toBeNull();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("ParentDataCollectorGroup with Group", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_service_ParentDataCollectorGroup", {
            objId: objGroupId,
            returnDataDefinition: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult).not.toBeNull();
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