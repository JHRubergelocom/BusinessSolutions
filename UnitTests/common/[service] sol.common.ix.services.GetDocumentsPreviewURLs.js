
describe("[service] sol.common.ix.services.GetDocumentsPreviewURLs", function () {
  var originalTimeout, objId1, objId2;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetDocumentsPreviewURLs").then(function success(obGetDocumentsPreviewURLsId) {
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
    describe("RF_sol_common_service_GetDocumentsPreviewURLs", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
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
      it("get objId smiley1", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley1"
          ).then(function success(sordSmiley1) {
            objId1 = sordSmiley1.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get objId smiley2", function (done) {
        expect(function () {
          test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/Smiley2"
          ).then(function success(sordSmiley2) {
            objId2 = sordSmiley2.id;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Get a document's URL", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
            objId: objId1
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("Get URLs for multiple documents", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_common_service_GetDocumentsPreviewURLs", {
            objIds: [objId1, objId2],
            previewSize: "tiny",
            startPage: 1,
            endPage: 2,
            flatten: true
          }).then(function success(jsonResult) {
            expect(jsonResult).toBeDefined();
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