
describe("[lib] sol.unittest.ix.services.SolCommonSordUtils", function () {
  var SordUtilsSord, userName, userInfo, originalTimeout, sord, params, newMask,
      srcSord, keyName, maskName, conn, language, country, name, fieldName, objId,
      config, fieldDef, timeZoneString, numberString, value, values, indexData, data;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordUtils").then(function success(obSolCommonSordUtilsId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/SordUtils").then(function success1(SordUtilsSord1) {
          SordUtilsSord = SordUtilsSord1;
          userName = test.Utils.getCurrentUserName();
          test.Utils.getUserInfo(userName).then(function success3(userInfo1) {
            userInfo = userInfo1;
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
  describe("Test Lib Functions", function () {
    describe("sol.common.SordUtils", function () {
// TODO CopySord
/*
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/RepoUtils").then(function success(objCopyRepoUtilsId1) {
            objCopyRepoUtilsId = objCopyRepoUtilsId1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
      it("getsord", function (done) {
        expect(function () {
          test.Utils.getSord(objCopyRepoUtilsId).then(function success(copyRepoUtilsSord1) {
            copyRepoUtilsSord = copyRepoUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );

        }).not.toThrow();
      });
*/
// TODO CopySord

      it("addRights", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          params = { users: ["Administrator"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "addRights",
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
      it("changeMask", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          newMask = "1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "changeMask",
            params: [sord, newMask]
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
      it("cloneSord", function (done) {
        expect(function () {
          srcSord = SordUtilsSord;
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "cloneSord",
            params: [srcSord, params]
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
      it("createSord", function (done) {
        expect(function () {
          params = { mask: "1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "createSord",
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

      xit("decObjKeyValue", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "decObjKeyValue",
            params: [sord, keyName]
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
      xit("docMaskExists", function (done) {
        expect(function () {
          maskName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "docMaskExists",
            params: [maskName]
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
      xit("getDecimalSeparatorForIx", function (done) {
        expect(function () {
          conn = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDecimalSeparatorForIx",
            params: [conn]
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
      xit("getDecimalSeparatorForLanguage", function (done) {
        expect(function () {
          language = PVALUE;
          country = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDecimalSeparatorForLanguage",
            params: [language, country]
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
      xit("getDisplayRepoPath", function (done) {
        expect(function () {
          sord = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDisplayRepoPath",
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
      xit("getDocMask", function (done) {
        expect(function () {
          name = PVALUE;
          language = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDocMask",
            params: [name, language]
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
      xit("getDocMaskGuid", function (done) {
        expect(function () {
          name = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDocMaskGuid",
            params: [name]
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
      xit("getDocMaskLine", function (done) {
        expect(function () {
          maskName = PVALUE;
          fieldName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDocMaskLine",
            params: [maskName, fieldName]
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
      xit("getDocMaskNames", function (done) {
        expect(function () {
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDocMaskNames",
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
      xit("getDynamicKeywordlistValue", function (done) {
        expect(function () {
          maskName = PVALUE;
          key = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDynamicKeywordlistValue",
            params: [maskName, key, params]
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
      xit("getEsw", function (done) {
        expect(function () {
          objId = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getEsw",
            params: [objId, params]
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
      xit("getFieldNameIndex", function (done) {
        expect(function () {
          fieldName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getFieldNameIndex",
            params: [fieldName]
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
      xit("getLinks", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getLinks",
            params: [sord]
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
      xit("getLocalizedKwlEntry", function (done) {
        expect(function () {
          key = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getLocalizedKwlEntry",
            params: [key, config]
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
      xit("getLocalizedKwlKey", function (done) {
        expect(function () {
          sord = PVALUE;
          fieldDef = PVALUE;
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getLocalizedKwlKey",
            params: [sord, fieldDef, config]
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
      xit("getObjKey", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getObjKey",
            params: [sord, keyName]
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
      xit("getObjKeyValue", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getObjKeyValue",
            params: [sord, keyName]
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
      xit("getObjKeyValueAsNumber", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getObjKeyValueAsNumber",
            params: [sord, keyName, params]
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
      xit("getObjKeyValues", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getObjKeyValues",
            params: [sord, keyName]
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
      xit("getStatisticSord", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getStatisticSord",
            params: [sord]
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
      xit("getTemplateSord", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getTemplateSord",
            params: [sord]
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
      xit("getTimeZoneOffset", function (done) {
        expect(function () {
          timeZoneString = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getTimeZoneOffset",
            params: [timeZoneString]
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
      xit("getValue", function (done) {
        expect(function () {
          sord = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getValue",
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
      xit("getValues", function (done) {
        expect(function () {
          sord = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getValues",
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
      xit("hasDocMask", function (done) {
        expect(function () {
          sord = PVALUE;
          maskName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "hasDocMask",
            params: [sord, maskName]
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
      xit("incObjKeyValue", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "incObjKeyValue",
            params: [sord, keyName]
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
      xit("initialize", function (done) {
        expect(function () {
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "initialize",
            params: [config]
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
      xit("isDocument", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isDocument",
            params: [sord]
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
      xit("isDynamicFolder", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isDynamicFolder",
            params: [sord]
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
      xit("isFolder", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isFolder",
            params: [sord]
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
      xit("isIndexdataLoaded", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isIndexdataLoaded",
            params: [sord]
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
      xit("isSord", function (done) {
        expect(function () {
          sord = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isSord",
            params: [sord]
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
      xit("isValidNumberFormat", function (done) {
        expect(function () {
          numberString = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isValidNumberFormat",
            params: [numberString]
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
      xit("normalizeNumber", function (done) {
        expect(function () {
          value = PVALUE;
          language = PVALUE;
          conn = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "normalizeNumber",
            params: [value, language, conn]
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
      xit("nowIsoForConnection", function (done) {
        expect(function () {
          conn = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "nowIsoForConnection",
            params: [conn, params]
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
      xit("objKeyExists", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "objKeyExists",
            params: [sord, keyName]
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
      xit("setObjKeyValue", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          value = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "setObjKeyValue",
            params: [sord, keyName, value, params]
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
      xit("setObjKeyValueAsNumber", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          value = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "setObjKeyValueAsNumber",
            params: [sord, keyName, value, params]
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
      xit("setObjKeyValues", function (done) {
        expect(function () {
          sord = PVALUE;
          keyName = PVALUE;
          values = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "setObjKeyValues",
            params: [sord, keyName, values, params]
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
      xit("updateKeywording", function (done) {
        expect(function () {
          sord = PVALUE;
          indexData = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "updateKeywording",
            params: [sord, indexData]
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
      xit("updateSord", function (done) {
        expect(function () {
          sord = PVALUE;
          data = PVALUE;
          params = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "updateSord",
            params: [sord, data, params]
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