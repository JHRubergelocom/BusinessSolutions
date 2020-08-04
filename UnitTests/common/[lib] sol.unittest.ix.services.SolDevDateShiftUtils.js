
describe("[lib] sol.unittest.ix.services.SolDevDateShiftUtils", function () {
  var DateShiftUtilsSord, originalTimeout, keyValues,
      keyName, isoDate, oldDateIso, params, shift, sord;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolDevDateShiftUtils").then(function success(obSolDevDateShiftUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/ActionBase").then(function success1(DateShiftUtilsSord1) {
          DateShiftUtilsSord = DateShiftUtilsSord1;
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
    describe("sol.dev.DateShiftUtils", function () {
      it("getMapValue", function (done) {
        expect(function () {
          keyValues = [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }];
          keyName = "key1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.DateShiftUtils",
            classConfig: {},
            method: "getMapValue",
            params: [keyValues, keyName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("value1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isIsoDate", function (done) {
        expect(function () {
          isoDate = "20190101";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.DateShiftUtils",
            classConfig: {},
            method: "isIsoDate",
            params: [isoDate]
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
      it("shift", function (done) {
        expect(function () {
          oldDateIso = "20190101";
          params = { units: { d: { number: 7 } } };
          shift = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.DateShiftUtils",
            classConfig: {},
            method: "shift",
            params: [oldDateIso, params, shift]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("20190108");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("shiftDates", function (done) {
        expect(function () {
          params = { parentId: DateShiftUtilsSord.id, refDateIso: "20190101" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.DateShiftUtils",
            classConfig: {},
            method: "shiftDates",
            params: [params]
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
      it("shiftSordDates", function (done) {
        expect(function () {
          sord = DateShiftUtilsSord;
          params = { refDateIso: "20190101", shifts: [{ key: "UNITTEST_FIELD1", type: "GRP" }], units: { d: { number: 7 } } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.dev.DateShiftUtils",
            classConfig: {},
            method: "shiftSordDates",
            params: [sord, params]
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