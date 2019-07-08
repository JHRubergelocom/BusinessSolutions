
describe("[function] sol.hr.ix.functions.ChangeSuperiorFile", function () {
  var objIdHr1, objGuidHr1, originalTimeout;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("ChangeSuperiorFile").then(function success(objChangeSuperiorFileId) {
        done();
      }, function error(err) {
        fail(err);
        console.error(err);
        done();
      }
      );
    }).not.toThrow();
  });
  describe("Tests Registered Functions", function () {
    describe("RF_sol_hr_function_ChangeSuperiorFile", function () {
      it("should throw if executed without 'template'", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ChangeSuperiorFile", {
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
      it("create personnnel file hr1", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_CreatePersonnelFileHeadless", {
            template: { name: "Default" },
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_FIRSTNAME: "Max",
                HR_PERSONNEL_LASTNAME: "Mustermann"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Schwabstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.data.objId).toBeDefined();
            expect(jsonResult.data.flowId).toBeDefined();
            objIdHr1 = jsonResult.data.objId;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("get guid personnnel file", function (done) {
        expect(function () {
          test.Utils.getSord(objIdHr1).then(function success(sordHr1) {
            objGuidHr1 = sordHr1.guid;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });

      it("change superior file", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_function_ChangeSuperiorFile", {
            file: objGuidHr1,
            sordMetadata: {
              objKeys: {
                HR_PERSONNEL_POSTALCODE: "2222",
                HR_PERSONNEL_CITY: "Musterdorf"
              },
              mapKeys: {
                HR_PERSONNEL_STREETADDRESS: "Feinstrasse"
              }
            }
          }).then(function success(jsonResult) {
            expect(jsonResult.code).toBeDefined();
            expect(jsonResult.code).toEqual("success");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });

      it("remove workflow", function (done) {
        expect(function () {
          test.Utils.getFinishedWorkflows(objIdHr1).then(function success(wfs) {
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
          test.Utils.deleteSord(objIdHr1).then(function success2(deleteResult1) {
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
    }).not.toThrow();
  });
});