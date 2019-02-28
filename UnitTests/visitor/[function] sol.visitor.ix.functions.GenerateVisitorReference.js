
describe("[function] sol.visitor.ix.functions.GenerateVisitorReference", function () {
  var originalTimeout, sordVisitor;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GenerateVisitorReference").then(function success(objGenerateVisitorReferenceId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor [unit tests]/Test data/SingleVisitor").then(function success2(sordVisitor1) {
          sordVisitor = sordVisitor1;
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
    describe("RF_sol_visitor_function_GenerateVisitorReference", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_GenerateVisitorReference", {
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
      it("generate visitor reference", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_visitor_function_GenerateVisitorReference", {
            objId: sordVisitor.id,
            updateExisting: true
          }).then(function success(jsonResult) {
            expect(jsonResult.identifier).toBeDefined();
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