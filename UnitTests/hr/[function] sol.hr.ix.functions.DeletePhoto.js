/* eslint-disable linebreak-style */

describe("[function] sol.hr.ix.functions.DeletePhoto", function () {
  var objDeletePhotoId, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("DeletePhoto").then(function success(objDeletePhotoId1) {
        objDeletePhotoId = objDeletePhotoId1;
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
    describe("sol.hr.ix.functions.DeletePhoto", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.DeletePhoto",
            classConfig: { objId: objDeletePhotoId },
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
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_function_DeletePhoto", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_DeletePhoto", {
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
      it("should not throw ", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_DeletePhoto", {
            objId: objDeletePhotoId
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
      test.Utils.getFinishedWorkflows(objDeletePhotoId).then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
          test.Utils.getTempfolder().then(function success2(tempfolder) {
            test.Utils.deleteSord(tempfolder).then(function success3(deleteResult) {
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