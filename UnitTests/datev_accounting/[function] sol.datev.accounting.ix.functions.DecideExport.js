
describe("[function] sol.datev.accounting.ix.functions.DecideExport", function () {
  var originalTimeout, objRDId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DecideExport").then(function success(objTempId) {
        test.Utils.createSord(objTempId, "Receipt Document", "TestReceiptDocument").then(function success1(objRDId1) {
          objRDId = objRDId1;
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
    describe("RF_datev_function_DecideExport", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_datev_function_DecideExport", {
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
      it("decide export", function (done) {
        expect(function () {
          test.Utils.execute("RF_datev_function_DecideExport", {
            wFDiagram: { 
              objId: objRDId, 
              nodes: [{ id: 0 }]
            },  
            documentTypeKey: "INVOICE_TYPE", 
            statusEnabled: "EXPORT_ENABLED", 
            statusDisabled: "EXPORT_DISABLED"
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