
describe("[lib] sol.unittest.ix.services.SolCommonDateUtils", function () {
  var originalTimeout, date, params,
      startDate, endDate, unit, config, moment,
      mo, pattern, checkDate, isoDate,
      dateString, number, value, mom,
      time, hour, minute;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonDateUtils").then(function success(obSolCommonDateUtilsId) {
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
    describe("sol.common.DateUtils", function () {
      it("couldBeTime", function (done) {
        expect(function () {
          time = "10:00";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "couldBeTime",
            params: [time]
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
      it("createMoment", function (done) {
        expect(function () {
          dateString = "04.05.1977";
          pattern = "DD.MM.YYYY";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "createMoment",
            params: [dateString, pattern]
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
      it("dateToIso", function (done) {
        expect(function () {
          date = new Date(2008, 5, 23);
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "dateToIso",
            params: [date, params]
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
      it("diff", function (done) {
        expect(function () {
          startDate = new Date(2008, 5, 23);
          endDate = new Date(2010, 6, 13);
          unit = "D";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "diff",
            params: [startDate, endDate, unit, config]
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
      it("endOf", function (done) {
        expect(function () {
          moment = "20190305";
          unit = "M";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "endOf",
            params: [moment, unit]
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
      it("fillTime", function (done) {
        expect(function () {
          time = "10:00";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "fillTime",
            params: [time]
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
      it("format", function (done) {
        expect(function () {
          date = new Date();
          pattern = "YYYY.MM.DD HH:mm:ss.SSS";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "format",
            params: [date, pattern]
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
      it("isBetween", function (done) {
        expect(function () {
          startDate = new Date(2008, 5, 23);
          endDate = new Date(2010, 6, 13);
          checkDate = new Date(2009, 6, 13);
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "isBetween",
            params: [startDate, endDate, checkDate]
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
      it("isLastDayOfMonth", function (done) {
        expect(function () {
          mom = "20170731";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "isLastDayOfMonth",
            params: [mom, params]
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
      it("isValidTime", function (done) {
        expect(function () {
          hour = 10;
          minute = 00;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "isValidTime",
            params: [hour, minute]
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
      it("isoToDate", function (done) {
        expect(function () {
          isoDate = "20170713";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "isoToDate",
            params: [isoDate, config]
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
          isoDate = "20170713";
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "isoToMoment",
            params: [isoDate, config]
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
          mo = "20100211";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "momentToIso",
            params: [mo, params]
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
      it("nowIso", function (done) {
        expect(function () {
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "nowIso",
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
      it("of", function (done) {
        expect(function () {
          mom = "20170731";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "of",
            params: [mom]
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
      it("parse", function (done) {
        expect(function () {
          dateString = "04.05.2015";
          pattern = "DD.MM.YYYY";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "parse",
            params: [dateString, pattern]
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
      it("prepareDuration", function (done) {
        expect(function () {
          number = 33;
          unit = "y";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "prepareDuration",
            params: [number, unit]
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
      it("shift", function (done) {
        expect(function () {
          date = new Date(2008, 5, 23);
          value = -5;
          params = null;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "shift",
            params: [date, value, params]
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
      it("transformIsoDate", function (done) {
        expect(function () {
          isoDate = 20170713;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.DateUtils",
            classConfig: {},
            method: "transformIsoDate",
            params: [isoDate, config]
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