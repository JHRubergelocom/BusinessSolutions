
describe("[function] sol.connector_dx.as.functions.Export", function () {
  var originalTimeout, content, obSolExportId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("Export", null, null).then(function success(obSolExportId1) {
        obSolExportId = obSolExportId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("test Export", function () {
    it("should throw if executed without 'subsystem'", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          action: "sol.connector_dx.Export",
          config: {
          }
        }).then(function success(jsonResult) {
          content = jsonResult.content;
          if (content.indexOf("exception") == -1) {
            fail(jsonResult.content);
          }
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
    });
    it("should not throw if executed", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ExecuteAsAction", {
          objId: obSolExportId,
          action: "sol.connector_dx.Export",
          config: {
            subsystem: "Invoice"
          }
        }).then(function success(jsonResult) {
          content = jsonResult.content;
          if (content.indexOf("exception") != -1) {
            fail(jsonResult.content);
          }
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