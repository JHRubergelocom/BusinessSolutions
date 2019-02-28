
describe("[service] sol.common.ix.services.ParentDataCollector", function () {
  var originalTimeout, objTempId;

  it("should throw if executed without 'objId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_service_ParentDataCollector", {
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
  describe("test parentdatacollector", function () {
    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
      expect(function () {
        test.Utils.createTempSord("As.Actions.ParentDataCollector", null, null).then(function success(objTempId1) {
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
    it("parentdatacollector should return defined result", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ParentDataCollector", {
          objId: objTempId,
          returnDataDefinition: true
        }).then(function success(jsonResult) {
          expect(jsonResult).toBeDefined();
          expect(jsonResult).not.toBeNull();
          done();
        }, function error(err) {
          fail(err);
          console.error(err);
          done();
        }
        );
      }).not.toThrow();
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
});