
describe("[service] sol.pubsec.ix.services.Close", function () {
  var originalTimeout, sordFile, sordProcess;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Close").then(function success(objTempId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Fileplan/File").then(function success2(sordFile1) {
          sordFile = sordFile1;
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/pubsec [unit tests]/Test data/Process").then(function success3(sordProcess1) {
            sordProcess = sordProcess1;
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
    describe("RF_sol_pubsec_service_CheckClosePreconditions", function () {
      it("should throw if executed without Parameter  'targetId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", {
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
      it("should not throw if executed with Parameter {'targetId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", {
            targetId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.valid).toBeDefined();
            expect(jsonResult.valid).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed with Parameter {'targetId': sordProcess.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_CheckClosePreconditions", {
            targetId: sordProcess.id
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
    });
    describe("RF_sol_pubsec_service_ContentClosedCheck", function () {
      it("should throw if executed without Parameter 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ContentClosedCheck", {
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
      it("should not throw if executed Parameter {'objId': sordFile.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ContentClosedCheck", {
            objId: sordFile.id
          }).then(function success(jsonResult) {
            expect(jsonResult.success).toBeDefined();
            expect(jsonResult.success).toEqual(true);
            expect(jsonResult.errors).toBeDefined();
            expect(jsonResult.errors.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'objId': sordProcess.id }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ContentClosedCheck", {
            objId: sordProcess.id
          }).then(function success(jsonResult) {
            expect(jsonResult.success).toBeDefined();
            expect(jsonResult.success).toEqual(true);
            expect(jsonResult.errors).toBeDefined();
            expect(jsonResult.errors.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should not throw if executed Parameter {'objId': 1 }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ContentClosedCheck", {
            objId: 1
          }).then(function success(jsonResult) {
            expect(jsonResult.success).toBeDefined();
            expect(jsonResult.success).toEqual(false);
            expect(jsonResult.errors).toBeDefined();
            expect(jsonResult.errors.length).toBeGreaterThan(0);
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