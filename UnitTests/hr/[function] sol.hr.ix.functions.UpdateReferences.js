
describe("[function] sol.hr.ix.functions.UpdateReferences", function () {
  var objUpdateReferencesId, originalTimeout,
      opts;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("UpdateReferences").then(function success(objUpdateReferencesId1) {
        objUpdateReferencesId = objUpdateReferencesId1;
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
    describe("sol.hr.ix.functions.UpdateReferences", function () {
      it("genericFind", function (done) {
        expect(function () {
          opts = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.UpdateReferences",
            classConfig: { objId: objUpdateReferencesId },
            method: "genericFind",
            params: [opts]
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
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.functions.UpdateReferences",
            classConfig: { objId: objUpdateReferencesId },
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
    describe("RF_sol_hr_function_UpdateReferences", function () {
      it("should throw if executed without 'objId'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdateReferences", {
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
      it("should not throw with 'objId", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdateReferences", {
            objId: objUpdateReferencesId
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
      it("should not throw with 'configs", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_UpdateReferences", {
            objId: objUpdateReferencesId,
            configs: [
              {
                search: {
                  mask: "Personnel file",
                  keys: {
                    SOL_TYPE: "PERSONNELFILE",
                    HR_PERSONNEL_MENTOR_GUID: "{{sord.guid}}"
                  }
                },
                update: {
                  byProp: {
                    superior: {
                      id: "HR_PERSONNEL_SUPERIOR",
                      type: "GRP"
                    }
                  },
                  mappings: [
                    {
                      source: {
                        id: "HR_PERSONNEL_ELOUSERID",
                        type: "GRP"
                      },
                      target: {
                        id: "HR_PERSONNEL_SUPERIORUSERID",
                        type: "MAP"
                      }
                    }
                  ]
                }
              }
            ]
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