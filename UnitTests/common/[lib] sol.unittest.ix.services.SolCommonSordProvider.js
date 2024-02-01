/* eslint-disable linebreak-style */

describe("[lib] sol.unittest.ix.services.SolCommonSordProvider", function () {
  var SordProviderSord, originalTimeout, instanceScope,
      instructions, target, source, converterConfig, type, key, prop, maxGroups,
      supplementaryFindInfo, query, criterion, idContainer, allCollectedData, ofMask,
      ids, sords, filter, cacheName, mbs, index, length, multipleOptsDefined, outputInstruction,
      arr, wc, lonelyDef, masks, searchfields, searchCriteria, queryOpts, inputIds, values,
      tokenized, acc, result, config, searchId, name, resultArr, isValidTarget, custom, findInfo,
      maxResults, pageSize, sordZ, searchFields, options, fieldMapping, accessors, formatterConfig,
      configKeys, maskName, ignoreCase, optimization, groupingTerm, constantCriteriaFindInfo, store,
      fuzzy, objId, srdC, findResult, outputDefinition, initOptimizationCache, searchInfo, mapDomain,
      _accessors, pagingId, props, desiredResults, i, cache, value, id, mask, val, s, sord,
      output, sDef, fields, outputDef, str, infos, objIds, sordC, formattedSord, field;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordProvider").then(function success(obSolCommonSordProviderId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/SordProvider").then(function success1(SordProviderSord1) {
          SordProviderSord = SordProviderSord1;
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
    describe("sol.common.SordProvider", function () {
      it("ACCESS_CODE_CONVERTER", function (done) {
        expect(function () {
          sord = SordProviderSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "ACCESS_CODE_CONVERTER",
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
      it("ACCESS_RIGHTS_CONVERTER", function (done) {
        expect(function () {
          sord = SordProviderSord.id;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "ACCESS_RIGHTS_CONVERTER",
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
      it("addAsDirectValueInstruction", function (done) {
        expect(function () {
          instanceScope = {};
          instructions = { directValues: {}, targetProps: [] };
          target = { value: "value1", prop: "prop1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addAsDirectValueInstruction",
            params: [instanceScope, instructions, target]
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
      it("addAsSourceTargetInstruction", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: [] }, targetProps: [] };
          source = { type: "SORD", key: "key1" };
          target = { prop: "prop1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addAsSourceTargetInstruction",
            params: [instructions, source, target]
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
      it("addConverterKey", function (done) {
        expect(function () {
          converterConfig = { sordKeys: [] };
          type = "SORD";
          key = "key1";
          prop = { prop: "prop1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addConverterKey",
            params: [converterConfig, type, key, prop]
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
      it("addCriterionToQuery", function (done) {
        expect(function () {
          maxGroups = "maxGroups";
          supplementaryFindInfo = "supplementaryFindInfo";
          query = "query";
          criterion = { value: "value1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { FIND_DIRECT: { FIELD_OBJ_KEY: "key1" } },
            method: "addCriterionToQuery",
            params: [maxGroups, supplementaryFindInfo, query, criterion]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("query (key1undefined: \"value1\") ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addDataCollectedFromIdContainer", function (done) {
        expect(function () {
          idContainer = { ofMask: [0] };
          instructions = "instructions";
          allCollectedData = "allCollectedData";
          ofMask = "ofMask";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addDataCollectedFromIdContainer",
            params: [idContainer, instructions, allCollectedData, ofMask]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("allCollectedData");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addDirectValuesToIds", function (done) {
        expect(function () {
          ids = [0, 1];
          instructions = { fallbackIdProp: "fallbackIdProp1", dvKeys: ["key1", "key2"], directValues: { key1: "value1", key2: "value2" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addDirectValuesToIds",
            params: [ids, instructions]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ fallbackIdProp1: 0, key2: "value2", key1: "value1" }, { fallbackIdProp1: 1, key2: "value2", key1: "value1" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addDirectValuesToSords", function (done) {
        expect(function () {
          sords = [{}, {}];
          instructions = { dvKeys: ["key1", "key2"], directValues: { key1: "value1", key2: "value2" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addDirectValuesToSords",
            params: [sords, instructions]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ key2: "value2", key1: "value1" }, { key2: "value2", key1: "value1" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addFilterDefinition", function (done) {
        expect(function () {
          instructions = {};
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addFilterDefinition",
            params: [instructions, filter]
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
      it("addInstructionsToCache", function (done) {
        expect(function () {
          cacheName = "cache1";
          instructions = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { cache1OptimizationCache: [] },
            method: "addInstructionsToCache",
            params: [cacheName, instructions]
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
      it("addMb", function (done) {
        expect(function () {
          mbs = [];
          type = "SORD";
          key = "guid";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addMb",
            params: [mbs, type, key]
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
      it("addOR", function (done) {
        expect(function () {
          query = "query";
          index = 0;
          length = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addOR",
            params: [query, index, length]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("query OR ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addOR", function (done) {
        expect(function () {
          query = "query";
          index = 1;
          length = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addOR",
            params: [query, index, length]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("query");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addOutputInstruction", function (done) {
        expect(function () {
          multipleOptsDefined = {};
          instructions = { directValues: {}, targetProps: [] };
          outputInstruction = { target: { value: "value1", prop: "prop1" } };
          i = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addOutputInstruction",
            params: [multipleOptsDefined, instructions, outputInstruction, i]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ directValues: { prop1: "value1" }, targetProps: ["prop1"] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("addToOptimizationCache", function (done) {
        expect(function () {
          cache = "cache1";
          instructions = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { cache1: [] },
            method: "addToOptimizationCache",
            params: [cache, instructions]
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
      it("arrayToRegExp", function (done) {
        expect(function () {
          arr = ["text1", "text2", "text3"];
          wc = "*";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "arrayToRegExp",
            params: [arr, wc]
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
      it("assignFallbackIdProp", function (done) {
        expect(function () {
          instructions = {};
          lonelyDef = { source: { type: "SORD", key: "guid" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "assignFallbackIdProp",
            params: [instructions, lonelyDef]
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
      it("buildFindByIndex", function (done) {
        expect(function () {
          masks = [0, 1];
          searchfields = [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindByIndex",
            params: [masks, searchfields]
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
      it("buildFindDirect", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          queryOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindDirect",
            params: [masks, searchCriteria, queryOpts]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[query= (*) ( ( (sord_maskName:\"mask1\") OR (sord_maskName:\"mask2\") ) (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\") ( (LINE_DEPARTMENTS: \"Sales\") OR (LINE_DEPARTMENTS: \"Purchasing\") ) (LINE_ACTIVITYSTATUS: \"A - \") ) ,searchIn=index]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildFindInfoForContextTerms", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          queryOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindInfoForContextTerms",
            params: [masks, searchCriteria, queryOpts]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[findDirect:[query= (*) ( ( (sord_maskName:\"mask1\") OR (sord_maskName:\"mask2\") ) (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\") ( (LINE_DEPARTMENTS: \"Sales\") OR (LINE_DEPARTMENTS: \"Purchasing\") ) (LINE_ACTIVITYSTATUS: \"A - \") ) ,searchIn=index]]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildFindInfoForFindByIndex", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchfields = [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindInfoForFindByIndex",
            params: [masks, searchfields]
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
      it("buildFindInfoForFindDirect", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindInfoForFindDirect",
            params: [masks, searchCriteria]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[findDirect:[query= (*) ( ( (sord_maskName:\"mask1\") OR (sord_maskName:\"mask2\") ) (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\") ( (LINE_DEPARTMENTS: \"Sales\") OR (LINE_DEPARTMENTS: \"Purchasing\") ) (LINE_ACTIVITYSTATUS: \"A - \") ) ,searchIn=index]]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildIdContainer", function (done) {
        expect(function () {
          inputIds = [0, 1];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildIdContainer",
            params: [inputIds]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ __nomask: [0, 1] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildMasksQuery", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { FIND_DIRECT: { FIELD_MASKNAME: "maskname1" } },
            method: "buildMasksQuery",
            params: [masks]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(" (undefined:\"mask1\")  OR  (undefined:\"mask2\") ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildQuery", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          queryOpts = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildQuery",
            params: [masks, searchCriteria, queryOpts]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(" (*)  ( ( (sord_maskName:\"mask1\")  OR  (sord_maskName:\"mask2\") )  (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\")  ( (LINE_DEPARTMENTS: \"Sales\")  OR  (LINE_DEPARTMENTS: \"Purchasing\") )  (LINE_ACTIVITYSTATUS: \"A - \") ) ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildRegEx", function (done) {
        expect(function () {
          values = ["Value1", "Value2"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildRegEx",
            params: [values]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("/Value1|Value2/gi");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("buildValueQuery", function (done) {
        expect(function () {
          key = "key1";
          value = "Value1";
          tokenized = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { FIND_DIRECT: { FIELD_OBJ_KEY_TOKENOZED: "key1" } },
            method: "buildValueQuery",
            params: [key, value, tokenized]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("undefinedkey1: \"Value1\"");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("calcFlags", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: [] }, targetProps: [] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "calcFlags",
            params: [instructions]
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
      it("castThenAddResults", function (done) {
        expect(function () {
          acc = {};
          result = { docNum: 1, term: "term1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "castThenAddResults",
            params: [acc, result]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ term1: 1 });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("cleanConfig", function (done) {
        expect(function () {
          config = { sordKeys: ["s1", "s2"], objKeys: ["o1", "o2"], mapKeys: { m1: "value1", m2: "value2" }, formBlobs: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "cleanConfig",
            params: [config]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ sordKeys: ["s1", "s2"], objKeys: ["o1", "o2"], mapKeys: { m1: "value1", m2: "value2" } });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("closeFind", function (done) {
        expect(function () {
          searchId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "closeFind",
            params: [searchId]
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
      it("collectDataFromId", function (done) {
        expect(function () {
          id = 1;
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          mask = "mask1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "collectDataFromId",
            params: [id, instructions, mask]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ undefined: "" });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("contains", function (done) {
        expect(function () {
          val = ["s1", "s2", "s3"];
          s = "s2";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "contains",
            params: [val, s]
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
      it("contains", function (done) {
        expect(function () {
          val = ["s1", "s2", "s3"];
          s = "x2";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "contains",
            params: [val, s]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("convertMultiIndex", function (done) {
        expect(function () {
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "convertMultiIndex",
            params: [value]
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
      it("createObjKey", function (done) {
        expect(function () {
          name = "name1";
          value = "value1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "createObjKey",
            params: [name, value]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[0,name1=value1]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("createSordZ", function (done) {
        expect(function () {
          mbs = [3, 5];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "createSordZ",
            params: [mbs]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[0x7]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("defaultDataCollection", function (done) {
        expect(function () {
          resultArr = [];
          ids = [0, 1];
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          mask = "mask1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "defaultDataCollection",
            params: [resultArr, ids, instructions, mask]
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
      it("definesDirectValue", function (done) {
        expect(function () {
          isValidTarget = true;
          target = { value: "value1", prop: "prop1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "definesDirectValue",
            params: [isValidTarget, target]
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
      it("escapeOrRemoveInvalidCharacters", function (done) {
        expect(function () {
          val = "mein   'Text'  :";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "escapeOrRemoveInvalidCharacters",
            params: [val]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("mein 'Text'");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("extendQueryByCustomQuery", function (done) {
        expect(function () {
          query = "query1";
          custom = "custom1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "extendQueryByCustomQuery",
            params: [query, custom]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(" (custom1)  (query1) ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("extendQueryByWildCard", function (done) {
        expect(function () {
          query = "query1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "extendQueryByWildCard",
            params: [query]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(" (*)  (query1) ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("extractSearchOpts", function (done) {
        expect(function () {
          fields = [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }, { key: "XDATEISO", value: "20200101" }, { key: "IDATEISO", value: "20200202" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "extractSearchOpts",
            params: [fields]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ xDateIso: "20200101", iDateIso: "20200202", objKeys: ["[0,key1=value1]", "[0,key2=value2]"] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("fastFilter", function (done) {
        expect(function () {
          sords = [];
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "fastFilter",
            params: [sords, filter]
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
      it("filterSords", function (done) {
        expect(function () {
          sords = [];
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "filterSords",
            params: [sords, filter]
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
      it("finalizeCollector", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "finalizeCollector",
            params: [instructions]
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
      it("find", function (done) {
        expect(function () {
          findInfo = "findInfo";
          maxResults = 1000;
          pageSize = 100;
          sordZ = 0x7;
          searchId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "find",
            params: [findInfo, maxResults, pageSize, sordZ, searchId]
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
      it("findAll", function (done) {
        expect(function () {
          findInfo = "findInfo";
          maxResults = 1000;
          sordZ = 0x7;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "findAll",
            params: [findInfo, maxResults, sordZ]
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
      it("findIds", function (done) {
        expect(function () {
          masks = [];
          searchFields = [{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }];
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "findIds",
            params: [masks, searchFields, options]
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
      it("formBlobsExtractor", function (done) {
        expect(function () {
          result = {};
          sord = SordProviderSord;
          fieldMapping = {};
          accessors = { formBlobs: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "formBlobsExtractor",
            params: [result, sord, fieldMapping, accessors]
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
      it("formatSord", function (done) {
        expect(function () {
          sord = SordProviderSord;
          formatterConfig = {};
          configKeys = [];
          accessors = { formBlobs: {} };
          mask = "Mask1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "formatSord",
            params: [sord, formatterConfig, configKeys, accessors, mask]
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
      it("formatSordAsTemplateSord", function (done) {
        expect(function () {
          sord = SordProviderSord;
          formatterConfig = {};
          configKeys = [];
          accessors = { formBlobs: {} };
          mask = "Mask1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "formatSordAsTemplateSord",
            params: [sord, formatterConfig, configKeys, accessors, mask]
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
      it("formatterIsRequired", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "formatterIsRequired",
            params: [instructions]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(false);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("generateInstructions", function (done) {
        expect(function () {
          output = [{ source: { type: "SORD", key: "guid" }, target: { prop: "id" } }];
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "generateInstructions",
            params: [output, filter, options]
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
      it("generateMbsFromOptions", function (done) {
        expect(function () {
          mbs = ["ID", "GUID"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "generateMbsFromOptions",
            params: [mbs]
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
      it("generateObjKeyLineMapping", function (done) {
        expect(function () {
          maskName = ["UnitTest"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "generateObjKeyLineMapping",
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
      it("getAvailableTerms", function (done) {
        expect(function () {
          key = "key1";
          value = "Value1";
          ignoreCase = true;
          findInfo = "findInfo";
          maxGroups = 10;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getAvailableTerms",
            params: [key, value, ignoreCase, findInfo, maxGroups]
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
      it("getCachedInstructions", function (done) {
        expect(function () {
          cacheName = "cache1";
          optimization = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { cache1OptimizationCache: ["1e", "2e"] },
            method: "getCachedInstructions",
            params: [cacheName, optimization]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("2e");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getContextTerms", function (done) {
        expect(function () {
          findInfo = "findInfo";
          groupingTerm = "gterm";
          maxGroups = 10;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getContextTerms",
            params: [findInfo, groupingTerm, maxGroups]
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
      it("getCriterionQuery", function (done) {
        expect(function () {
          key = "key1";
          value = "Value1";
          ignoreCase = true;
          tokenized = {};
          constantCriteriaFindInfo = "constantCriteriaFindInf1";
          maxGroups = 10;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { FIND_DIRECT: { FIELD_OBJ_KEY_TOKENOZED: "key1" } },
            method: "getCriterionQuery",
            params: [key, value, ignoreCase, tokenized, constantCriteriaFindInfo, maxGroups]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("undefinedkey1: \"Value1\"");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getFindInfoBuilder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFindInfoBuilder",
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
      it("getFindInfoForConstantSearchValues", function (done) {
        expect(function () {
          masks = ["mask1", "mask2"];
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          maxGroups = 10;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFindInfoForConstantSearchValues",
            params: [masks, searchCriteria, maxGroups]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[findDirect:[query= (*) ( ( (sord_maskName:\"mask1\") OR (sord_maskName:\"mask2\") ) (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\") ( (LINE_DEPARTMENTS: \"Sales\") OR (LINE_DEPARTMENTS: \"Purchasing\") ) ) ,searchIn=index]]");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getFormattedDataCollectionFromObjectFormatter", function (done) {
        expect(function () {
          ids = [1];
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {}, objectFormatter: { formatter: "sol.common.ObjectFormatter.BaseSord" }, config: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFormattedDataCollectionFromObjectFormatter",
            params: [ids, instructions]
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
      it("getFormatter", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFormatter",
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
      it("getFromOptimizationCache", function (done) {
        expect(function () {
          cache = "cache1";
          id = 2;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { cache1: ["1e", "2e"] },
            method: "getFromOptimizationCache",
            params: [cache, id]
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
      it("getFromSearchCache", function (done) {
        expect(function () {
          store = {};
          searchId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFromSearchCache",
            params: [store, searchId]
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
      it("getGroupingTerm", function (done) {
        expect(function () {
          fuzzy = { groupBy: { type: "GRP", key: "key1" } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getGroupingTerm",
            params: [fuzzy]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("LINE.key1");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("getIdsOfIds", function (done) {
        expect(function () {
          resultArr = [];
          ids = [1, 2, 3];
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getIdsOfIds",
            params: [resultArr, ids, instructions]
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
      it("getInstructionsFromCache", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getInstructionsFromCache",
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
      it("getObjectFormatterInput", function (done) {
        expect(function () {
          ids = [1];
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {}, objectFormatter: { formatter: "sol.common.ObjectFormatter.BaseSord" }, config: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getObjectFormatterInput",
            params: [ids, instructions]
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
      it("getOutputConverterFunction", function (done) {
        expect(function () {
          field = { type: "SORD", key: "aclItems", converter: "ACCESS_RIGHTS_CONVERTER" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getOutputConverterFunction",
            params: [field]
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
      it("getSearchCriteriaQuery", function (done) {
        expect(function () {
          searchCriteria = [{ key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }, { key: "DEPARTMENTS", value: ["Sales", "Purchasing"] }, { key: "ACTIVITYSTATUS", value: "A - *" }];
          maxGroups = 10;
          supplementaryFindInfo = "supplementaryFindInfo";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: { FIND_DIRECT: { FIELD_OBJ_KEY: "key1" } },
            method: "getSearchCriteriaQuery",
            params: [searchCriteria, maxGroups, supplementaryFindInfo]
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
      it("getSord", function (done) {
        expect(function () {
          objId = SordProviderSord.id;
          srdC = 0x7;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getSord",
            params: [objId, srdC]
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
      it("getSords", function (done) {
        expect(function () {
          objIds = [];
          sordC = 0x7;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getSords",
            params: [objIds, sordC]
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
      it("idsOf", function (done) {
        expect(function () {
          findResult = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "idsOf",
            params: [findResult]
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
      it("impureConcat", function (done) {
        expect(function () {
          target = [];
          source = [1, 2, 3];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "impureConcat",
            params: [target, source]
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
      it("initSearchAndProcessingInstructions", function (done) {
        expect(function () {
          outputDefinition = [{ source: { type: "SORD", key: "guid" }, target: { prop: "id" } }];
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          options = {};
          result = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "initSearchAndProcessingInstructions",
            params: [outputDefinition, filter, options, result]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ mbs: ["GUID"], targetProps: ["id"], converterConfig: { sordKeys: [{ key: "guid", prop: "id" }] }, directValues: {}, anIdRequired: true, objKeysRequired: false, formatterRequired: false, idName: "guid", configKeys: ["sordKeys"], mapAccessors: {}, dvKeys: [], filter: [{ prop: "filter1" }, { prop: "filter2" }] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("initializeCaching", function (done) {
        expect(function () {
          initOptimizationCache = true;
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "initializeCaching",
            params: [initOptimizationCache, instructions]
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
      it("isValidSourceDefinition", function (done) {
        expect(function () {
          sDef = { type: "SORD", key: "GUID" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "isValidSourceDefinition",
            params: [sDef]
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
      it("maintainSearchInfo", function (done) {
        expect(function () {
          searchInfo = {};
          findResult = {};
          maxResults = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "maintainSearchInfo",
            params: [searchInfo, findResult, maxResults]
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
      it("mapExtractor", function (done) {
        expect(function () {
          sord = SordProviderSord;
          mapDomain = "objekte";
          fields = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "mapExtractor",
            params: [sord, mapDomain, fields]
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
      it("mapKeysExtractor", function (done) {
        expect(function () {
          result = {};
          sord = SordProviderSord;
          fieldMapping = [];
          accessors = { mapKeys: [] };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "mapKeysExtractor",
            params: [result, sord, fieldMapping, accessors]
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
      it("objKeysExtractor", function (done) {
        expect(function () {
          result = {};
          sord = SordProviderSord;
          fieldMapping = [];
          _accessors = { objKeys: [] };
          mask = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "objKeysExtractor",
            params: [result, sord, fieldMapping, _accessors, mask]
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
      it("optimizationIdDefined", function (done) {
        expect(function () {
          optimization = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "optimizationIdDefined",
            params: [optimization]
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
      it("optimizeObjectAccessors", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "optimizeObjectAccessors",
            params: [instructions]
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
      it("pageFind", function (done) {
        expect(function () {
          findInfo = "findInfo";
          maxResults = 1000;
          pageSize = 100;
          sordZ = 0x7;
          searchId = 1;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "pageFind",
            params: [findInfo, maxResults, pageSize, sordZ, searchId]
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
      it("pagingIdDefined", function (done) {
        expect(function () {
          pagingId = "1";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "pagingIdDefined",
            params: [pagingId]
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
      it("parens", function (done) {
        expect(function () {
          s = "s";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parens",
            params: [s]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual(" (s) ");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("parseOutputDefinition", function (done) {
        expect(function () {
          outputDef = [{ source: { type: "SORD", key: "guid" }, target: { prop: "id" } }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parseOutputDefinition",
            params: [outputDef]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ mbs: ["GUID"], targetProps: ["id"], converterConfig: { sordKeys: [{ key: "guid", prop: "id" }] }, directValues: {}, anIdRequired: true, objKeysRequired: false, formatterRequired: false, idName: "guid", configKeys: ["sordKeys"], mapAccessors: {}, dvKeys: [] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("parseSearchValue", function (done) {
        expect(function () {
          value = ["value1", "value2"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parseSearchValue",
            params: [value]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("\"value1\" OR \"value2\"");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("performSearch", function (done) {
        expect(function () {
          masks = ["UnitTest"];
          searchCriteria = [{ key: "SOL_TYPE", value: "UNITTEST" }];
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "performSearch",
            params: [masks, searchCriteria, options]
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
      it("prepareMask", function (done) {
        expect(function () {
          mask = "UnitTest";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "prepareMask",
            params: [mask]
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
      it("prepareSearchInfo", function (done) {
        expect(function () {
          searchInfo = {};
          searchId = 1;
          maxResults = 1000;
          pageSize = 100;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "prepareSearchInfo",
            params: [searchInfo, searchId, maxResults, pageSize]
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
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
      it("processIdContainer", function (done) {
        expect(function () {
          idContainer = { ofMask: [0] };
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processIdContainer",
            params: [idContainer, instructions]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ undefined: "" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processIds", function (done) {
        expect(function () {
          inputIds = [0, 1];
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {}, dvKeys: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processIds",
            params: [inputIds, instructions]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual([{ undefined: "" }, { undefined: "" }]);
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("processResult", function (done) {
        expect(function () {
          findResult = {};
          ids = [0, 1];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processResult",
            params: [findResult, ids]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ ids: [0, 1] });
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("propsToArrays", function (done) {
        expect(function () {
          sords = [];
          props = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "propsToArrays",
            params: [sords, props]
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
      it("pushToResults", function (done) {
        expect(function () {
          resultArr = [];
          formattedSord = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "pushToResults",
            params: [resultArr, formattedSord]
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
      it("reinitializeFormatterSettingsIfRequired", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "reinitializeFormatterSettingsIfRequired",
            params: [instructions]
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
      it("removeEmptyFields", function (done) {
        expect(function () {
          sords = [];
          props = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "removeEmptyFields",
            params: [sords, props]
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
      it("sanitizeQueryValue", function (done) {
        expect(function () {
          val = "mein   'Text'  :";
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "sanitizeQueryValue",
            params: [val]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("mein 'Text'");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("searchFor", function (done) {
        expect(function () {
          infos = {};
          searchCriteria = [{ key: "SOL_TYPE", value: "UNITTEST" }];
          options = {};
          masks = ["UnitTest"];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "searchFor",
            params: [infos, searchCriteria, options, masks]
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
      it("searchViaContextTerms", function (done) {
        expect(function () {
          masks = ["UnitTest"];
          searchCriteria = [{ key: "SOL_TYPE", value: "UNITTEST" }];
          options = { fuzzy: { groupBy: { type: "GRP", key: "SOL_TYPE" }, maxGroups: 100 } };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "searchViaContextTerms",
            params: [masks, searchCriteria, options]
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
      it("searchViaIndex", function (done) {
        expect(function () {
          masks = ["UnitTest"];
          searchCriteria = [{ key: "SOL_TYPE", value: "UNITTEST" }];
          options = {};
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "searchViaIndex",
            params: [masks, searchCriteria, options]
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
      it("setUnchangedIdsAsResult", function (done) {
        expect(function () {
          resultArr = [];
          ids = [0, 1];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "setUnchangedIdsAsResult",
            params: [resultArr, ids]
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
      it("shouldUseDefaultDataCollection", function (done) {
        expect(function () {
          instructions = { mbs: [], converterConfig: { sordKeys: ["ID", "GUID"] }, targetProps: [], formatterRequired: true, configKeys: ["sordKeys"], directValues: {}, objectFormatter: { formatter: "sol.common.ObjectFormatter.BaseSord" }, config: {} };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "shouldUseDefaultDataCollection",
            params: [instructions]
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
      it("sordKeysExtractor", function (done) {
        expect(function () {
          result = {};
          sord = SordProviderSord;
          fields = [];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "sordKeysExtractor",
            params: [result, sord, fields]
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
      it("stringToRegExp", function (done) {
        expect(function () {
          str = "Mein Text";
          wc = "*";
          ignoreCase = true;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "stringToRegExp",
            params: [str, wc, ignoreCase]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("/^Mein Text/i");
            done();
          }, function error(err) {
            fail(err);
            console.error(err);
            done();
          }
          );
        }).not.toThrow();
      });
      it("templateSordFilter", function (done) {
        expect(function () {
          sords = [];
          filter = [{ prop: "filter1", value: "value1" }, { prop: "filter2", value: "value2" }];
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "templateSordFilter",
            params: [sords, filter]
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
      it("updateSearchCache", function (done) {
        expect(function () {
          findResult = {};
          desiredResults = 1000;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "updateSearchCache",
            params: [findResult, desiredResults]
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
      it("valuesWithoutWildcard", function (done) {
        expect(function () {
          criterion = { value: "value1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib4", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "valuesWithoutWildcard",
            params: [criterion]
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