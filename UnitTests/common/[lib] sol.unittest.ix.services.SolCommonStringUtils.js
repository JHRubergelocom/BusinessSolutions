/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonStringUtils", function () {
  var StringUtilsSord, originalTimeout, str,
      pattern, length, padString, iniString,
      target, replacement, config, text,
      maxLength, options;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonStringUtils").then(function success(obSolCommonStringUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/IniFile").then(function success1(StringUtilsSord1) {
          StringUtilsSord = StringUtilsSord1;
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
    describe("sol.common.StringUtils", function () {
      it("contains", function (done) {
        expect(function () {
          str = "Mein Text";
          pattern = "Text";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "contains",
            params: [str, pattern]
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
      it("endsWith", function (done) {
        expect(function () {
          str = "Mein Text";
          pattern = "Text";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "endsWith",
            params: [str, pattern]
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
      it("format", function (done) {
        expect(function () {
          str = "Value of {0} updated: {1} -> {2}";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "format",
            params: [str, "key", "oldValue", "newValue"]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Value of key updated: oldValue -> newValue");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getTrailingNumber", function (done) {
        expect(function () {
          str = "Text1 und 2 und 345";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "getTrailingNumber",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(345);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("isBlank", function (done) {
        expect(function () {
          str = "   ";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "isBlank",
            params: [str]
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
      it("isEmpty", function (done) {
        expect(function () {
          str = "";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "isEmpty",
            params: [str]
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
      it("isNumeric", function (done) {
        expect(function () {
          str = "33.56";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "isNumeric",
            params: [str]
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
      it("padLeft", function (done) {
        expect(function () {
          str = "Ein Text";
          length = 20;
          padString = "*";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "padLeft",
            params: [str, length, padString]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("************Ein Text");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("padRight", function (done) {
        expect(function () {
          str = "Ein Text";
          length = 20;
          padString = "*";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "padRight",
            params: [str, length, padString]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Ein Text************");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("downloadToString", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.RepoUtils",
            classConfig: {},
            method: "downloadToString",
            params: [StringUtilsSord.id, null, {}]
          }).then(function success(jsonResult) {
            iniString = jsonResult;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("parseIniString", function (done) {
        expect(function () {
          str = iniString;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "parseIniString",
            params: [str]
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
      it("removeQuotes", function (done) {
        expect(function () {
          str = "'Ein Text'";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "removeQuotes",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Ein Text");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("removeTrailingNumber", function (done) {
        expect(function () {
          str = "Text1 und 2 und 345";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "removeTrailingNumber",
            params: [str]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Text1 und 2 und ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("replaceAll", function (done) {
        expect(function () {
          str = iniString;
          target = ",";
          replacement = ";";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "replaceAll",
            params: [str, target, replacement]
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
      it("replaceLineBreaks", function (done) {
        expect(function () {
          str = iniString;
          config = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "replaceLineBreaks",
            params: [str, config]
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
      it("splitLines", function (done) {
        expect(function () {
          text = iniString;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "splitLines",
            params: [text]
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
      it("startsWith", function (done) {
        expect(function () {
          str = "Mein Text";
          pattern = "Mein";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "startsWith",
            params: [str, pattern]
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
      it("truncate", function (done) {
        expect(function () {
          str = "Hello World";
          maxLength = 5;
          options = { suffix: "" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib1", {
            className: "sol.common.StringUtils",
            classConfig: {},
            method: "truncate",
            params: [str, maxLength, options]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("Hello");
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