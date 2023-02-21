
describe("[service] sol.hr.ix.services.GetGenericSearchFolderContent", function () {
  var sordChangeRequests, jsonParam1, jsonParam2,
      originalTimeout, config, startingPointId, returnOnlyOneResult,
      searchConfig, mbAll, objId, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("GetGenericSearchFolderContent").then(function success(obGetGenericSearchFolderContentId) {
        test.Utils.getSord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/hr [unit tests]/Test data/PersonalFile/Änderungsanträge").then(function success1(sordChangeRequests1) {
          sordChangeRequests = sordChangeRequests1;
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
    describe("sol.hr.ix.services.GetGenericSearchFolderContent", function () {
      it("find", function (done) {
        expect(function () {
          config = {};
          startingPointId = "1";
          returnOnlyOneResult = true;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
            classConfig: {},
            method: "find",
            params: [config, startingPointId, returnOnlyOneResult]
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
      it("findByIndexSearch", function (done) {
        expect(function () {
          searchConfig = {};
          returnOnlyOneResult = true;
          mbAll = true;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
            classConfig: {},
            method: "findByIndexSearch",
            params: [searchConfig, returnOnlyOneResult, mbAll]
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
      it("getObjKeys", function (done) {
        expect(function () {
          searchConfig = {};
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
            classConfig: {},
            method: "getObjKeys",
            params: [searchConfig]
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
      it("hierarchySearch", function (done) {
        expect(function () {
          searchConfig = { vals: [] };
          objId = 1;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
            classConfig: {},
            method: "hierarchySearch",
            params: [searchConfig, objId]
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
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
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
      it("renderAndFind", function (done) {
        expect(function () {
          config = {};
          sord = sordChangeRequests;
          returnOnlyOneResult = true;
          test.Utils.execute("RF_sol_unittest_hr_service_ExecuteLib1", {
            className: "sol.hr.ix.services.GetGenericSearchFolderContent",
            classConfig: { templateData: {} },
            method: "renderAndFind",
            params: [config, sord, returnOnlyOneResult]
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
    describe("RF_sol_hr_service_GetGenericSearchFolderContent", function () {
      it("should throw if executed without Paramter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_hr_service_GetGenericSearchFolderContent", {
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
      it("should not throw if executed with sord template folder", function (done) {
        expect(function () {
          jsonParam1 = {
            mode: "hierarchy",
            searchConfig: {
              vals: ["PERSONNELFILE"]
            }
          };
          jsonParam2 = {
            mode: "findByIndex",
            searchConfig: {
              objKeys: {
                SOL_TYPE: "HR_REQUEST",
                HR_PERSONNEL_ELOUSERID: "{{sord.objKeys.HR_PERSONNEL_ELOUSERID}}"
              }
            }
          };
          test.Utils.executeRFParams("RF_sol_hr_service_GetGenericSearchFolderContent", sordChangeRequests, jsonParam1, jsonParam2).then(function success(jsonResult) {
            done();
          }, function error(err) {
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