
describe("[service] sol.connector_dx.ix.services.SetDxStatus", function () {
  var originalTimeout, obTempIncomingInvoiceId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SetDxStatus", null, null).then(function success(obSolSetDxStatusId) {
        test.Utils.createSord(obSolSetDxStatusId, "Incoming Invoice", "TempIncomingInvoice", { INVOICE_CURRENCY_CODE: "EUR" }).then(function success1(obTempIncomingInvoiceId1) {
          obTempIncomingInvoiceId = obTempIncomingInvoiceId1;
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
  describe("test SetDxStatus", function () {
    it("should throw if executed without 'subsystem'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_SetDxStatus", {
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
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_SetDxStatus", {
          subsystem: "Invoice"
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
    it("should throw if executed without 'status'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_SetDxStatus", {
          subsystem: "Invoice",
          objId: obTempIncomingInvoiceId
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
    it("should not throw if executed", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_SetDxStatus", {
          subsystem: "Invoice",
          objId: obTempIncomingInvoiceId,
          status: "import"
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
  afterAll(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    expect(function () {
      test.Utils.getTempfolder().then(function success(tempfolder) {
        test.Utils.deleteSord(tempfolder).then(function success1(deleteResult) {
          test.Utils.getFinishedWorkflows().then(function success2(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success3(removeFinishedWorkflowsResult) {
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