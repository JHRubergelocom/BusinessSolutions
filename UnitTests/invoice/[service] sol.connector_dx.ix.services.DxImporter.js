
describe("[service] sol.connector_dx.ix.services.DxImporter", function () {
  var originalTimeout, objTempId,
      value, config;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DxImporter", null, null).then(function success(objTempId1) {
        objTempId = objTempId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Test Lib Functions", function () {
    describe("sol.connector_dx.ix.normalizeGrpNumber", function () {
      it("convert", function (done) {
        expect(function () {
          value = 12345;
          config = {};
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib1", {
            className: "sol.connector_dx.ix.normalizeGrpNumber",
            classConfig: {},
            method: "convert",
            params: [value, config]
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
    describe("sol.connector_dx.ix.normalizeMapNumber", function () {
      it("convert", function (done) {
        expect(function () {
          value = 12345;
          config = {};
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib1", {
            className: "sol.connector_dx.ix.normalizeMapNumber",
            classConfig: {},
            method: "convert",
            params: [value, config]
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
    describe("sol.connector_dx.ix.services.DxImporter", function () {
      it("initialize", function (done) {
        expect(function () {
          config = {};
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib1", {
            className: "sol.connector_dx.ix.services.DxImporter",
            classConfig: { subsystem: "Invoice", docClass: "Invoice/Default", objId: objTempId, xmlContent: "<?xml version='1.0' encoding='UTF-8' standalone='no'?><import></import>" },
            method: "initialize",
            params: [config]
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
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_invoice_service_ExecuteLib1", {
            className: "sol.connector_dx.ix.services.DxImporter",
            classConfig: { subsystem: "Invoice", docClass: "Invoice/Default", objId: objTempId, xmlContent: "<?xml version='1.0' encoding='UTF-8' standalone='no'?><import></import>" },
            method: "process",
            params: []
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
  describe("test DxImporter", function () {
    it("should throw if executed without 'subsystem'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_DxImporter", {
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
    it("should throw if executed without 'docClass'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_DxImporter", {
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
    it("should throw if executed without 'objId'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_DxImporter", {
          subsystem: "Invoice",
          docClass: "Invoice/Default"
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
    it("should throw if executed without 'xmlContent'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_connector_dx_service_DxImporter", {
          subsystem: "Invoice",
          docClass: "Invoice/Default",
          objId: objTempId
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
        test.Utils.execute("RF_sol_connector_dx_service_DxImporter", {
          subsystem: "Invoice",
          docClass: "Invoice/Default",
          objId: objTempId,
          xmlContent: "<?xml version='1.0' encoding='UTF-8' standalone='no'?><import></import>"
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