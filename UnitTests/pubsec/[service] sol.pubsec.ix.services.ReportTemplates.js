
describe("[service] sol.pubsec.ix.services.ReportTemplates", function () {
  var originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ReportTemplates").then(function success(objTempId) {
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
    describe("RF_sol_pubsec_service_ReportTemplates", function () {
      it("should not throw if executed without Parameter ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ReportTemplates", {
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toEqual(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should throw if executed with invalide Parameter {'filter': { 'type': 'xxx' } }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ReportTemplates", {
            filter: { type: "xxx" }
          }).then(function success(jsonResult) {
            fail(jsonResult);
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should receive report templates if executed with Parameter {'filter': { 'type': 'filingplan' } }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ReportTemplates", {
            filter: { type: "filingplan" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should receive report templates if executed with Parameter {'filter': { 'type': 'files' } }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ReportTemplates", {
            filter: { type: "files" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("should receive report templates if executed with Parameter {'filter': { 'type': 'file' } }", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_pubsec_service_ReportTemplates", {
            filter: { type: "file" }
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            expect(jsonResult.length).toBeGreaterThan(0);
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