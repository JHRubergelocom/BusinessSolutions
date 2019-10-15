
describe("[lib] sol.unittest.ix.services.SolCommonSordProvider", function () {
  var SordProviderSord, userName, userInfo, originalTimeout, instanceScope,
      instructions, target, source, converterConfig, type, key, prop, maxGroups,
      supplementaryFindInfo, query, criterion, idContainer, allCollectedData, ofMask,
      ids, sords, filter, cacheName, mbs, index, length, multipleOptsDefined, outputInstruction,
      arr, wc, lonelyDef, masks, searchfields, searchCriteria, queryOpts, inputIds, values,
      tokenized, acc, result, config, searchId, name, resultArr, isValidTarget, custom, findInfo,
      maxResults, pageSize, sordZ, searchFields, options, fieldMapping, accessors, formatterConfig,
      configKeys, maskName, ignoreCase, optimization, groupingTerm, constantCriteriaFindInfo, store,
      fuzzy, objId, srdC, findResult, outputDefinition, initOptimizationCache, searchInfo, mapDomain,
      _accessors, pagingId, props, infos, desiredResults, i, cache;

  beforeAll(function (done) {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    expect(function () {
      test.Utils.createTempSord("SolCommonSordProvider").then(function success(obSolCommonSordProviderId) {
        test.Utils.getSord("ARCPATH:/Administration/Business Solutions/common [unit tests]/Resources/SordProvider").then(function success1(SordProviderSord1) {
          SordProviderSord = SordProviderSord1;
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
    describe("sol.common.SordProvider", function () {
      it("addAsDirectValueInstruction", function (done) {
        expect(function () {
          instanceScope = {};
          instructions = { directValues: {}, targetProps: [] };
          target = { value: "value1", prop: "prop1" };
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "addOutputInstruction",
            params: [multipleOptsDefined, instructions, outputInstruction, i]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual({ directValues: { prop1: "value1"}, targetProps: ["prop1"] });
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindByIndex",
            params: [masks, searchfields]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[,maskIds=[0, 1],okeys=#2[[0,key1=value1],[0,key2=value2]]]");
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildFindInfoForFindByIndex",
            params: [masks, searchfields]
          }).then(function success(jsonResult) {
            expect(jsonResult).toEqual("[findByIndex:[,maskIds=[mask1, mask2],okeys=#2[[0,key1=value1],[0,key2=value2]]]]");
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("buildValueQuery", function (done) {
        expect(function () {
          key = PVALUE;
          value = PVALUE;
          tokenized = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "buildValueQuery",
            params: [key, value, tokenized]
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
      xit("calcFlags", function (done) {
        expect(function () {
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("castThenAddResults", function (done) {
        expect(function () {
          acc = PVALUE;
          result = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "castThenAddResults",
            params: [acc, result]
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
      xit("cleanConfig", function (done) {
        expect(function () {
          config = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "cleanConfig",
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
      xit("closeFind", function (done) {
        expect(function () {
          searchId = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("collectDataFromId", function (done) {
        expect(function () {
          id = PVALUE;
          instructions = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "collectDataFromId",
            params: [id, instructions, mask]
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
      xit("contains", function (done) {
        expect(function () {
          val = PVALUE;
          s = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "contains",
            params: [val, s]
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
      xit("createObjKey", function (done) {
        expect(function () {
          name = PVALUE;
          value = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "createObjKey",
            params: [name, value]
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
      xit("createObjKeys", function (done) {
        expect(function () {
          searchfields = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "createObjKeys",
            params: [searchfields]
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
      xit("createSordZ", function (done) {
        expect(function () {
          mbs = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "createSordZ",
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
      xit("defaultDataCollection", function (done) {
        expect(function () {
          resultArr = PVALUE;
          ids = PVALUE;
          instructions = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("definesDirectValue", function (done) {
        expect(function () {
          isValidTarget = PVALUE;
          target = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "definesDirectValue",
            params: [isValidTarget, target]
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
      xit("escapeOrRemoveInvalidCharacters", function (done) {
        expect(function () {
          val = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "escapeOrRemoveInvalidCharacters",
            params: [val]
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
      xit("extendQueryByCustomQuery", function (done) {
        expect(function () {
          query = PVALUE;
          custom = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "extendQueryByCustomQuery",
            params: [query, custom]
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
      xit("extendQueryByWildCard", function (done) {
        expect(function () {
          query = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "extendQueryByWildCard",
            params: [query]
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
      xit("fastFilter", function (done) {
        expect(function () {
          sords = PVALUE;
          filter = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("filterSords", function (done) {
        expect(function () {
          sords = PVALUE;
          filter = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("finalizeCollector", function (done) {
        expect(function () {
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("find", function (done) {
        expect(function () {
          findInfo = PVALUE;
          maxResults = PVALUE;
          pageSize = PVALUE;
          sordZ = PVALUE;
          searchId = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("findAll", function (done) {
        expect(function () {
          findInfo = PVALUE;
          maxResults = PVALUE;
          sordZ = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("findIds", function (done) {
        expect(function () {
          masks = PVALUE;
          searchFields = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("formBlobsExtractor", function (done) {
        expect(function () {
          result = PVALUE;
          sord = PVALUE;
          fieldMapping = PVALUE;
          accessors = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("formatSord", function (done) {
        expect(function () {
          sord = PVALUE;
          formatterConfig = PVALUE;
          configKeys = PVALUE;
          accessors = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("formatSordAsTemplateSord", function (done) {
        expect(function () {
          sord = PVALUE;
          formatterConfig = PVALUE;
          configKeys = PVALUE;
          accessors = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("formatterIsRequired", function (done) {
        expect(function () {
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "formatterIsRequired",
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
      xit("generateInstructions", function (done) {
        expect(function () {
          output = PVALUE;
          filter = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("generateMbsFromOptions", function (done) {
        expect(function () {
          mbs = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("generateObjKeyLineMapping", function (done) {
        expect(function () {
          maskName = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getAvailableTerms", function (done) {
        expect(function () {
          key = PVALUE;
          value = PVALUE;
          ignoreCase = PVALUE;
          findInfo = PVALUE;
          maxGroups = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getCachedInstructions", function (done) {
        expect(function () {
          cacheName = PVALUE;
          optimization = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getCachedInstructions",
            params: [cacheName, optimization]
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
      xit("getContextTerms", function (done) {
        expect(function () {
          findInfo = PVALUE;
          groupingTerm = PVALUE;
          maxGroups = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getCriterionQuery", function (done) {
        expect(function () {
          key = PVALUE;
          value = PVALUE;
          ignoreCase = PVALUE;
          tokenized = PVALUE;
          constantCriteriaFindInfo = PVALUE;
          maxGroups = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getCriterionQuery",
            params: [key, value, ignoreCase, tokenized, constantCriteriaFindInfo, maxGroups]
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
      xit("getFindInfoBuilder", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getFindInfoForConstantSearchValues", function (done) {
        expect(function () {
          masks = PVALUE;
          searchCriteria = PVALUE;
          maxGroups = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getFindInfoForConstantSearchValues",
            params: [masks, searchCriteria, maxGroups]
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
      xit("getFromOptimizationCache", function (done) {
        expect(function () {
          cache = PVALUE;
          id = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
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
      xit("getFromSearchCache", function (done) {
        expect(function () {
          store = PVALUE;
          searchId = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getGroupingTerm", function (done) {
        expect(function () {
          fuzzy = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "getGroupingTerm",
            params: [fuzzy]
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
      xit("getIdsOfIds", function (done) {
        expect(function () {
          resultArr = PVALUE;
          ids = PVALUE;
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getInstructionsFromCache", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("getSearchCriteriaQuery", function (done) {
        expect(function () {
          searchCriteria = PVALUE;
          maxGroups = PVALUE;
          supplementaryFindInfo = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
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
      xit("getSord", function (done) {
        expect(function () {
          objId = PVALUE;
          srdC = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("idsOf", function (done) {
        expect(function () {
          findResult = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("impureConcat", function (done) {
        expect(function () {
          target = PVALUE;
          source = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("initSearchAndProcessingInstructions", function (done) {
        expect(function () {
          outputDefinition = PVALUE;
          filter = PVALUE;
          options = PVALUE;
          result = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "initSearchAndProcessingInstructions",
            params: [outputDefinition, filter, options, result]
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
      xit("initializeCaching", function (done) {
        expect(function () {
          initOptimizationCache = PVALUE;
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("isValidSourceDefinition", function (done) {
        expect(function () {
          sDef = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "isValidSourceDefinition",
            params: [sDef]
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
      xit("maintainSearchInfo", function (done) {
        expect(function () {
          searchInfo = PVALUE;
          findResult = PVALUE;
          maxResults = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("mapExtractor", function (done) {
        expect(function () {
          sord = PVALUE;
          mapDomain = PVALUE;
          fields = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("mapKeysExtractor", function (done) {
        expect(function () {
          result = PVALUE;
          sord = PVALUE;
          fieldMapping = PVALUE;
          accessors = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("objKeysExtractor", function (done) {
        expect(function () {
          result = PVALUE;
          sord = PVALUE;
          fieldMapping = PVALUE;
          _accessors = PVALUE;
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("optimizationIdDefined", function (done) {
        expect(function () {
          optimization = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "optimizationIdDefined",
            params: [optimization]
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
      xit("optimizeObjectAccessors", function (done) {
        expect(function () {
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("pageFind", function (done) {
        expect(function () {
          findInfo = PVALUE;
          maxResults = PVALUE;
          pageSize = PVALUE;
          sordZ = PVALUE;
          searchId = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("pagingIdDefined", function (done) {
        expect(function () {
          pagingId = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "pagingIdDefined",
            params: [pagingId]
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
      xit("parens", function (done) {
        expect(function () {
          s = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parens",
            params: [s]
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
      xit("parseOutputDefinition", function (done) {
        expect(function () {
          outputDef = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parseOutputDefinition",
            params: [outputDef]
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
      xit("parseSearchValue", function (done) {
        expect(function () {
          value = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "parseSearchValue",
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
      xit("performSearch", function (done) {
        expect(function () {
          masks = PVALUE;
          searchCriteria = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("prepareMask", function (done) {
        expect(function () {
          mask = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("prepareSearchInfo", function (done) {
        expect(function () {
          searchInfo = PVALUE;
          searchId = PVALUE;
          maxResults = PVALUE;
          pageSize = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("process", function (done) {
        expect(function () {
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("processIdContainer", function (done) {
        expect(function () {
          idContainer = PVALUE;
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processIdContainer",
            params: [idContainer, instructions]
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
      xit("processIds", function (done) {
        expect(function () {
          inputIds = PVALUE;
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processIds",
            params: [inputIds, instructions]
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
      xit("processResult", function (done) {
        expect(function () {
          findResult = PVALUE;
          ids = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "processResult",
            params: [findResult, ids]
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
      xit("propsToArrays", function (done) {
        expect(function () {
          sords = PVALUE;
          props = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("reinitializeFormatterSettingsIfRequired", function (done) {
        expect(function () {
          instructions = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("removeEmptyFields", function (done) {
        expect(function () {
          sords = PVALUE;
          props = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("sanitizeQueryValue", function (done) {
        expect(function () {
          val = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "sanitizeQueryValue",
            params: [val]
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
      xit("searchFor", function (done) {
        expect(function () {
          infos = PVALUE;
          searchCriteria = PVALUE;
          options = PVALUE;
          masks = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("searchViaContextTerms", function (done) {
        expect(function () {
          masks = PVALUE;
          searchCriteria = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("searchViaIndex", function (done) {
        expect(function () {
          masks = PVALUE;
          searchCriteria = PVALUE;
          options = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("setUnchangedIdsAsResult", function (done) {
        expect(function () {
          resultArr = PVALUE;
          ids = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("sordKeysExtractor", function (done) {
        expect(function () {
          result = PVALUE;
          sord = PVALUE;
          fields = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("stringToRegExp", function (done) {
        expect(function () {
          str = PVALUE;
          wc = PVALUE;
          ignoreCase = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "stringToRegExp",
            params: [str, wc, ignoreCase]
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
      xit("templateSordFilter", function (done) {
        expect(function () {
          sords = PVALUE;
          filter = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("updateSearchCache", function (done) {
        expect(function () {
          findResult = PVALUE;
          desiredResults = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
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
      xit("valuesWithoutWildcard", function (done) {
        expect(function () {
          criterion = PVALUE;
          test.Utils.execute("RF_sol_unittest_service_ExecuteLib", {
            className: "sol.common.SordProvider",
            classConfig: {},
            method: "valuesWithoutWildcard",
            params: [criterion]
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