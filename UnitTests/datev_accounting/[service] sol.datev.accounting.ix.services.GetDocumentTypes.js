
describe("[service] sol.datev.accounting.ix.services.GetDocumentTypes", function () {
  var originalTimeout, documentTypes;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetDocumentTypes").then(function success(objTempId) {
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
    describe("RF_sol_datev_accounting_service_GetDocumentTypes", function () {
      it("get document types", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_datev_accounting_service_GetDocumentTypes", {
          }).then(function success(documentTypes1) {
            documentTypes = documentTypes1;
            expect(documentTypes).toBeDefined();
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
    describe("RF_sol_datev_accounting_service_GetDocumentTypeByTypeKey", function () {
      it("should throw if executed without 'documentTypeKey'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_datev_accounting_service_GetDocumentTypeByTypeKey", {
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
      it("get document type by key", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_datev_accounting_service_GetDocumentTypeByTypeKey", {
            documentTypeKey: documentTypes[0].key
          }).then(function success(jsonResult) {
            expect(jsonResult.key).toBeDefined();
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