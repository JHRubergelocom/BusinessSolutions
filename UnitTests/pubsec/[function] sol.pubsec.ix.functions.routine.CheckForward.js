
describe("[function] sol.pubsec.ix.functions.routine.CheckForward", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("CheckForward").then(function success(objTempId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_pubsec_function_routine_CheckForward", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_function_routine_CheckForward", {
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
      it("should receive result if executed with Parameter { objId: 1 }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_function_routine_CheckForward", {
            objId: 1
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.allowed).toBeDefined();
            expect(jsonResult.allowed).toEqual(true);
            expect(jsonResult.reasons).toBeDefined();
            expect(jsonResult.reasons.length).toEqual(0);
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