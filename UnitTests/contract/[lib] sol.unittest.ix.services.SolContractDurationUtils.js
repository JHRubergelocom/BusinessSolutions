/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolContractDurationUtils", function () {
  var originalTimeout, tplSord, updates,
      mom, endOf, additionalShiftCounter, startDateIso, endDateIso, unit, amount,
      exchangeRate, singleAmount, str, separator, unitStrings, isoDate, update,
      date, contractStart, contractEnd, unitKey;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolContractDurationUtils").then(function success(obSolContractDurationUtilsId) {
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
    describe("sol.contract.DurationUtils", function () {
      it("addUpdate", function (done) {
        expect(function () {
          tplSord = { objKeys: {} };
          updates = { objKeys: {}, mapKeys: {} };
          update = { type: "GRP", value: "value1" };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "addUpdate",
            params: [tplSord, updates, update]
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
      it("adjustToRealMonthEnd", function (done) {
        expect(function () {
          mom = "20190217";
          endOf = "M";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "adjustToRealMonthEnd",
            params: [mom, endOf]
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
      it("calcContract", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_END: "20210101" }, mapKeys: { DURATION_TYPE: "sol.contract.form.permanent", REMINDER_PERIOD: 5, REMINDER_PERIOD_UNIT: "y" } };
          updates = { objKeys: {}, mapKeys: {} };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcContract",
            params: [tplSord, updates]
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
      it("calcContractEnd", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_START: "20190101" }, mapKeys: { CONTRACT_DURATION: "1", CONTRACT_DURATION_UNIT: "y" } };
          updates = { objKeys: {}, mapKeys: {} };
          additionalShiftCounter = 0;
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcContractEnd",
            params: [tplSord, updates, additionalShiftCounter]
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
      it("calcDuration", function (done) {
        expect(function () {
          startDateIso = "20190101";
          endDateIso = "20220302";
          unit = "d";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcDuration",
            params: [startDateIso, endDateIso, unit]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(1156);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calcLocalCurrencyAmount", function (done) {
        expect(function () {
          amount = 5;
          exchangeRate = 2;
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcLocalCurrencyAmount",
            params: [amount, exchangeRate]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(2.5);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calcNextPossibleContractEnd", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_END: "20210101" }, mapKeys: { DURATION_TYPE: "" } };
          updates = { objKeys: {}, mapKeys: {} };
          additionalShiftCounter = 0;
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcNextPossibleContractEnd",
            params: [tplSord, updates, additionalShiftCounter]
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
      it("calcReminderDate", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_START: "20190101" }, mapKeys: { CONTRACT_DURATION: "1", CONTRACT_DURATION_UNIT: "y", NEXT_POSSIBLE_CONTRACT_END: "" } };
          updates = { objKeys: {}, mapKeys: {} };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcReminderDate",
            params: [tplSord, updates]
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
      it("calcRowTotal", function (done) {
        expect(function () {
          startDateIso = "20190101";
          endDateIso = "20220302";
          singleAmount = 2;
          unit = "d";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcRowTotal",
            params: [startDateIso, endDateIso, singleAmount, unit]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("2312");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calcTerminationDateFixed", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_END: "20210101" }, mapKeys: { NOTICE_PERIOD: 5, NOTICE_PERIOD_UNIT: "y" } };
          updates = { objKeys: {}, mapKeys: {} };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcTerminationDateFixed",
            params: [tplSord, updates]
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
      it("calcTerminationDateFromNow", function (done) {
        expect(function () {
          tplSord = { objKeys: { NEXT_POSSIBLE_TERMINATION: "20190101" }, mapKeys: { CONTRACT_DURATION: "1", CONTRACT_DURATION_UNIT: "M", NOTICE_PERIOD: 5, NOTICE_PERIOD_UNIT: "y", NEXT_POSSIBLE_CONTRACT_END: "20210101" } };
          updates = { objKeys: {}, mapKeys: {} };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "calcTerminationDateFromNow",
            params: [tplSord, updates]
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
      it("clearContractEnd", function (done) {
        expect(function () {
          tplSord = { objKeys: { CONTRACT_START: "20190101" } };
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "clearContractEnd",
            params: [tplSord]
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
      it("correctContractEndByOneDay", function (done) {
        expect(function () {
          contractStart = "20190306";
          contractEnd = "20190306";
          unitKey = "d";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "correctContractEndByOneDay",
            params: [contractStart, contractEnd, unitKey]
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
      it("getBaseCurrency", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "getBaseCurrency",
            params: []
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("EUR");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getEndOfDate", function (done) {
        expect(function () {
          date = new Date();
          unit = "d";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "getEndOfDate",
            params: [date, unit]
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
      it("getKwlKey", function (done) {
        expect(function () {
          str = "2019#0203";
          separator = "#";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "getKwlKey",
            params: [str, separator]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("2019");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getSmallestUnitString", function (done) {
        expect(function () {
          unitStrings = ["y-2019", "M-05"];
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "getSmallestUnitString",
            params: [unitStrings]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("M-05");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getStartOfDay", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "getStartOfDay",
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
      it("isoToMoment", function (done) {
        expect(function () {
          isoDate = "20190306";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "isoToMoment",
            params: [isoDate]
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
      it("momentToIso", function (done) {
        expect(function () {
          mom = "20190306";
          test.Utils.execute("RF_sol_unittest_contract_service_ExecuteLib", {
            className: "sol.contract.DurationUtils",
            classConfig: {},
            method: "momentToIso",
            params: [mom]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("20190306000000");
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