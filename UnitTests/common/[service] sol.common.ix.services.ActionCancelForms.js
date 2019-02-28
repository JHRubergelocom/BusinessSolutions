
describe("[service] sol.common.ix.services.ActionCancelForms", function () {
  var originalTimeout, objActionCancelFormsId, flowId;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("objActionCancelForms", { UNITTEST_STATUS3: "13", UNITTEST_STATUS4: "14" }).then(function success(objActionCancelFormsId1) {
        objActionCancelFormsId = objActionCancelFormsId1;
        test.Utils.startWorkflow("Unittest", "Unittest", objActionCancelFormsId).then(function success1(flowId1) {
          flowId = flowId1;
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
  it("should throw if executed without 'flowId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_service_ActionCancelForm", {
        objId: objActionCancelFormsId
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
  it("should throw if executed without 'nodeId'", function (done) {
    expect(function () {
      test.Utils.execute("RF_sol_common_service_ActionCancelForm", {
        flowId: flowId
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
  describe("test ActionCancelForms", function () {
    it("ActionCancelForms", function (done) {
      expect(function () {
        test.Utils.execute("RF_sol_common_service_ActionCancelForm", {
          flowId: flowId,
          nodeId: "1"
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
      test.Utils.getFinishedWorkflows(objActionCancelFormsId).then(function success(wfs) {
        test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeResult) {
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