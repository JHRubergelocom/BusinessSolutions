
describe("[lib] sol.unittest.ix.services.SolChecklistUtils", function () {
  var ChecklistUtilsSord, originalTimeout, checklist, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolChecklistUtils").then(function success(obSolChecklistUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/productivity [unit tests]/Resources/ChecklistUtils").then(function success1(ChecklistUtilsSord1) {
          ChecklistUtilsSord = ChecklistUtilsSord1;
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
  describe("Test Lib Functions", function () {
    describe("sol.checklist.Utils", function () {
      it("getNextId", function (done) {
        expect(function () {
          checklist = { items: [{ id: 5 }, { id: 2 }] };
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.checklist.Utils",
            classConfig: {},
            method: "getNextId",
            params: [checklist]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(6);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isChecklist", function (done) {
        expect(function () {
          sord = ChecklistUtilsSord.id;
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.checklist.Utils",
            classConfig: {},
            method: "isChecklist",
            params: [sord]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(true);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("loadConfig", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_productivity_service_ExecuteLib", {
            className: "sol.checklist.Utils",
            classConfig: {},
            method: "loadConfig",
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