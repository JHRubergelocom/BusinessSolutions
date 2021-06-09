
describe("[dynkwl] sol.common.ix.dynkwls.DynKwlMultiIndexIterator", function () {
  var originalTimeout, objDynKwlMultiIndexIteratorId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DynKwlMultiIndexIterator").then(function success(objDynKwlMultiIndexIteratorId1) {
        objDynKwlMultiIndexIteratorId = objDynKwlMultiIndexIteratorId1;
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Dynamic Keyword lists", function () {
    describe("sol.common.ix.DynKwlMultiIndexIterator", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
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
      it("should throw if executed without 'dynkwl'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId
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
      it("should throw if executed without 'providerConfig'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator"
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
      it("should throw if executed without 'inputFieldName'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator",
            providerConfig: {}
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
      it("should not throw", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_meeting_service_ExecuteDynKwl", {
            objId: objDynKwlMultiIndexIteratorId,
            dynKwl: "sol.common.ix.DynKwlMultiIndexIterator",
            providerConfig: { multiIndexField: { type: "GRP", key: "MEETING_PROVIDED_PROPOSALTYPES" } },
            inputFieldName: "UNITTEST_FIELD2"
          }).then(function success(jsonResult) {   
            if (jsonResult.error) {
              fail(jsonResult.error);
            } else {
              expect(jsonResult.keynames).toBeDefined();
              expect(jsonResult.title).toBeDefined();
              expect(jsonResult.data).toBeDefined();  
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