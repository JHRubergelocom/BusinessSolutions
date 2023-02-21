
describe("[service] sol.recruiting.ix.services.GetCommunicationRedactorTemplates", function () {
  var originalTimeout, requisitionNo, candidateNo,
      objKeysObj, params;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetCommunicationRedactorTemplates").then(function success(objTempId) {
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
    describe("sol.recruiting.ix.services.GetCommunicationRedactorTemplates", function () {
      it("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_recruiting_service_ExecuteLib1", {
            className: "sol.recruiting.ix.services.GetCommunicationRedactorTemplates",
            classConfig: {},
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
    describe("RF_sol_recruiting_service_GetCommunicationRedactorTemplates", function () {
      it("should throw without parameter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_GetCommunicationRedactorTemplates", {
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
      it("get requisition sord", function (done) {
        expect(function () {
          objKeysObj = { SOL_TYPE: "RECRUITING_REQUISITION" };
          params = { objKeysObj: objKeysObj };
          test.Utils.findSords(params).then(function success1(sords) {
            expect(sords).toBeDefined();
            expect(sords.length).toBeGreaterThan(0);
            requisitionNo = test.Utils.getObjKeyValue(sords[0], "RECRUITING_REQUISITION_NO");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get candidate sord", function (done) {
        expect(function () {
          objKeysObj = { SOL_TYPE: "RECRUITING_CANDIDATE" };
          params = { objKeysObj: objKeysObj };
          test.Utils.findSords(params).then(function success1(sords) {
            expect(sords).toBeDefined();
            expect(sords.length).toBeGreaterThan(0);
            candidateNo = test.Utils.getObjKeyValue(sords[0], "RECRUITING_CANDIDATE_NO");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get communication templates  with parameter 'requisition' and 'candidate'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_recruiting_service_GetCommunicationRedactorTemplates", {
            requisition: requisitionNo,
            candidate: candidateNo
          }).then(function success(jsonResult) {
            expect(jsonResult.templates).toBeDefined();
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("remove workflows", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows().then(function success(wfs) {
            test.Utils.removeFinishedWorkflows(wfs).then(function success1(removeFinishedWorkflowsResult) {
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