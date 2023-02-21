
describe("[lib] sol.unittest.ix.services.SolCommonSordUtils", function () {
  var SordUtilsSord, objSordUtilsId, originalTimeout, sord, params, newMask, key,
      srcSord, keyName, maskName, conn, language, country, name, fieldName, objId,
      config, fieldDef, timeZoneString, numberString, value, values, indexData, 
      mapEntry, data, isoDate, constantName;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordUtils").then(function success(obSolCommonSordUtilsId) {
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
    describe("sol.common.SordUtils", function () {
      it("copysord", function (done) {
        expect(function () {
          test.Utils.copySord("ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common [unit tests]/Resources/FileUtils").then(function success(objSordUtilsId1) {
            objSordUtilsId = objSordUtilsId1;
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
          test.Utils.getSord(objSordUtilsId).then(function success(SordUtilsSord1) {
            SordUtilsSord = SordUtilsSord1;
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("set UNITTEST_FIELD1 to numeric value", function (done) {
        expect(function () {
          test.Utils.updateKeywording(SordUtilsSord, {
            UNITTEST_FIELD1: 5
          }, true).then(function success(updateKeywordingResult) {
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
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
      it("createStringMapBlob", function (done) {
        expect(function () {
          key = "key1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "createStringMapBlob",
            params: [key, value]
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
      it("decObjKeyValue", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("docMaskExists", function (done) {
        expect(function () {
          maskName = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "docMaskExists",
            params: [maskName]
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
      it("getBlobDataFromMapEntry", function (done) {
        expect(function () {
          mapEntry = {};
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getBlobDataFromMapEntry",
            params: [mapEntry, params]
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
      it("getDecimalSeparatorForIx", function (done) {
        expect(function () {
          conn = "ixConnect";
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
      it("getDecimalSeparatorForLanguage", function (done) {
        expect(function () {
          language = "en";
          country = "";
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
      it("getDisplayRepoPath", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          params = {};
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
      it("getDocMask", function (done) {
        expect(function () {
          name = "UnitTest";
          language = "de";
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
      it("getDocMaskGuid", function (done) {
        expect(function () {
          name = "UnitTest";
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
      it("getDocMaskLine", function (done) {
        expect(function () {
          maskName = "UnitTest";
          fieldName = "UNITTEST_FIELD1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getDocMaskLine",
            params: [maskName, fieldName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[UNITTEST_FIELD1, type=TYPE_TEXT]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getDocMaskNames", function (done) {
        expect(function () {
          params = {};
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
      it("getDynamicKeywordlistValue", function (done) {
        expect(function () {
          maskName = "UnitTest";
          key = "UNITTEST_STATUS3";
          params = {};
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
      it("getEsw", function (done) {
        expect(function () {
          objId = SordUtilsSord.id;
          params = {};
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
      it("getFieldNameIndex", function (done) {
        expect(function () {
          fieldName = "UNITTEST_FIELD1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getFieldNameIndex",
            params: [fieldName]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(1);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getHiddenLine", function (done) {
        expect(function () {
          keyName = "UNITTEST_FIELD1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getHiddenLine",
            params: [keyName]
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
      it("getInternalDate", function (done) {
        expect(function () {
          isoDate = "";
          params = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getInternalDate",
            params: [isoDate, params]
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
      it("getLinks", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("getLocalizedKwlEntry", function (done) {
        expect(function () {
          key = "UNITTEST_STATUS3";
          config = { localizedKwlScript: "sol.dev.ix.dynkwl.FindUnitTestIterator" };
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
      it("getLocalizedKwlKey", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          fieldDef = { key: "UNITTEST_STATUS3", type: "GRP" };
          config = {};
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
      it("getMapEntriesAsObject", function (done) {
        expect(function () {
          config = { objId: SordUtilsSord.id };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getMapEntriesAsObject",
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
      it("getObjKey", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("getObjKeyValue", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("getObjKeyValueAsNumber", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
          params = {};
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
      it("getObjKeyValues", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("getObjectMapBlob", function (done) {
        expect(function () {
          params = { mapId: SordUtilsSord.id, key: "MapValue" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getObjectMapBlob",
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
      it("getStatisticSord", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("getStringMapBlob", function (done) {
        expect(function () {
          params = { mapId: SordUtilsSord.id, key: "MapValue" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "getStringMapBlob",
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
      it("getTemplateSord", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("getTimeZoneOffset", function (done) {
        expect(function () {
          timeZoneString = "Europe/Berlin";
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
      it("getValue", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          params = { key: "UNITTEST_FIELD1", type: "GRP" };
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
      it("getValues", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          params = { key: "UNITTEST_FIELD1", type: "GRP" };
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
      it("hasDocMask", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          maskName = "UnitTest";
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
      it("hiddenLineExists", function (done) {
        expect(function () {
          constantName = "UNITTEST_FIELD1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "hiddenLineExists",
            params: [constantName]
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
      it("incObjKeyValue", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("initialize", function (done) {
        expect(function () {
          config = {};
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
      it("isDocument", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("isDynamicFolder", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("isFolder", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("isIndexdataLoaded", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("isSord", function (done) {
        expect(function () {
          sord = SordUtilsSord;
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
      it("isValidNumberFormat", function (done) {
        expect(function () {
          numberString = "12345";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "isValidNumberFormat",
            params: [numberString]
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
      it("normalizeNumber", function (done) {
        expect(function () {
          value = "123,45";
          language = "en";
          conn = "ixConnect";
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
      it("nowIsoForConnection", function (done) {
        expect(function () {
          conn = "ixConnect";
          params = {};
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
      it("objKeyExists", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
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
      it("setObjKeyValue", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
          value = "5";
          params = {};
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
      it("setObjKeyValueAsNumber", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
          value = 5;
          params = {};
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
      it("setObjKeyValues", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          keyName = "UNITTEST_FIELD1";
          values = [5, 6, 7];
          params = {};
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
      it("setObjectMapBlob", function (done) {
        expect(function () {
          params = { mapId: SordUtilsSord.id, key: "MapValue" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "setObjectMapBlob",
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
      it("setStringMapBlob", function (done) {
        expect(function () {
          params = { mapId: SordUtilsSord.id, key: "MapValue" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordUtils",
            classConfig: {},
            method: "setStringMapBlob",
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
      it("updateKeywording", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          indexData = { UNITTEST_FIELD1: "5" };
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
      it("updateSord", function (done) {
        expect(function () {
          sord = SordUtilsSord;
          data = [{ key: "UNITTEST_FIELD1", type: "GRP", value: 5 }, { key: "name", type: "SORD", value: "SordUtilsName" }];
          params = {};
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