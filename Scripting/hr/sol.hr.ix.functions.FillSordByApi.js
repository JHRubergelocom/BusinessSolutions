
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include sol.hr.ix.services.GetConvertedMetadata.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.hr.ix.services.GetConvertedMetadata
 *
 * Takes a mapping of source and target-fields and fills the sord specified by the `objId` accordingly.
 *
 * ## Example Config
 *
 * This config would fill the sord `target` having ObjId `target.value`, which is currently in workflow having `flowId`
 * with the sord-data of sord `api.dataSources.sordReferenceForTemplating` having ObjId `api.dataSources.sordReferenceForTemplating.value`
 * and FlowId `api.dataSources.sordReferenceForTemplating.flowId` by using:
 *
 * - the `mapping`
 * - `references`
 * - change history `writeDataHistory` of said changes
 *
 *     {
 *       flowId: 53,  // for set
 *       api: {
 *         dataSources: {
 *           sordReferenceForTemplating: {
 *             type: "objId",
 *             value: "3008"
 *             flowId: 22
 *           }
 *         },
 *         mapping: [
 *           { source: { id: "MY_FIELD_A", type: "GRP" }, target: { id: "MY_FIELD_B", type: "MAP" } },
 *           { source: { id: "MY_SECOND_FIELD", type: "WFMAP" }, target: { id: "MY_SECOND_FIELD_TEST", type: "GRP" } }
 *         ]
 *       },
 *       references: [
 *         { id: "MY_FIELD_TO_STORE_WHATEVER", type: "MAP", value: "myValue" }
 *       ],
 *       writeDataHistory: { id: "MY_CHANGE_HISTORY_FIELD", type: "FORMBLOB" },
 *       reverseMapping: false,
 *       target: { type: "objId", value: "3012" }
 *     }
 *
 * ## Mappings
 *
 * A mapping consists of a source field definition and a target field definition.
 * Specify, which field of the `sordReferenceForTemplating` should be written to the `target`
 *
 * ## References
 *
 * A reference provides a way to write any value to any field of `target`.
 * Note: these properties will be passed on to the SET-function
 *
 * ## Data History
 *
 * Before carrying out any changes on the `target`, all fields which will be changed by the Mappings/References will be stored in the field
 * `writeDataHistory.id` as JSON. This history is pretty big, so you should use a FORMBLOB-Field to store its value.
 *
 * ### Example History:
 *
 *     [
 *       { "IX_GRP_HR_PERSONNEL_PERSONNELNO": "0002" },
 *       { "IX_GRP_HR_PERSONNEL_FIRSTNAME": "Erik" }
 *     ]
 *
 * ## Reverse Mapping
 *
 * Reversing a mapping can be useful, if a sord is first used as a data-base for new sord and later, the data of the new sord should be saved
 * to the original sord. Basically, this means
 *
 *     Create new sord `target`
 *     fillSordByApi `source` -> `target`
 *     Do things with new sord, now having data of `source`
 *     fillSordByApi `target` -> `source` + reverseMapping
 *     `source` sord now has the changed data of `target`
 */
sol.define("sol.hr.ix.functions.FillSordByApi", {
  extend: "sol.common.ix.FunctionBase",

  determineTemplatingObjId: function (referenceConfig) {
    if (referenceConfig.type === "objId") {
      return referenceConfig.value;
    }
  },

  determineTemplatingFlowId: function (referenceConfig) {
    if (referenceConfig.type === "objId" && referenceConfig.flowId) {
      return referenceConfig.flowId;
    }
  },

  getSetConfig: function (api) {
    var me = this, mappingResult, params;
    params = {
      mapping: api.mapping,
      dataSourceObjId: me.determineTemplatingObjId(api.dataSources.sordReferenceForTemplating),
      dataSourceFlowId: me.determineTemplatingFlowId(api.dataSources.sordReferenceForTemplating),
      dataSourceAsAdmin: me.dataSourceAsAdmin || false,
      returnRendered: true,
      emptyNonRendered: true,  // this should be fine most of the time as you usually don't want template strings in sord-fields
      reverseMapping: me.reverseMapping,
      history: me.dataHistoryField,
      escapeHTML: false
    };

    mappingResult = (sol.create("sol.hr.ix.services.GetConvertedMetadata", params)).process();

    return (
      mappingResult && Array.isArray(mappingResult.dataMapping) && mappingResult.dataMapping.map(function (mapping) {
        mapping.key = mapping.id;
        return mapping;
      })
    ) || [];
  },

  addReferencesToSetConfig: function (setConfig, references) {
    Array.isArray(setConfig) && Array.isArray(references) && references.forEach(function (ref) {
      // maybe this gets more complex in the future
      if (!ref.key) {
        ref.key = ref.id;
      }
      setConfig.push(ref);
    });
  },

  addDataHistoryToSetConfig: function (setConfig) {
    var me = this, dataHistory = {
          type: me.writeDataHistory.type, key: me.writeDataHistory.id, value: "[ "
        };
    Object.keys(setConfig).forEach(function (prop) {
      dataHistory.value +=
        '{ "IX_'
          + setConfig[prop].type
          + "_" + setConfig[prop].key + '": '
          + (setConfig[prop].value ? JSON.stringify(setConfig[prop].value) : '""')
        + " },";
    });
    dataHistory.value += " ]";
    dataHistory.value = dataHistory.value.replace(" }, ]", " } ]"); //last run produces illegal comma
    setConfig.push(dataHistory);
  },

  getTargetId: function (targetConfig) {
    if (targetConfig.type === "objId") {
      return targetConfig.value;
    }
  },

  process: function () {
    var me = this, setConfig, api = me.api;

    api = api || sol.common.ObjectUtils.getProp(me, me.apiPath);
    setConfig = me.getSetConfig(api);
    me.addReferencesToSetConfig(setConfig, api.references);
    me.addReferencesToSetConfig(setConfig, me.references);

    me.writeDataHistory && me.addDataHistoryToSetConfig(setConfig);

    // assign data to target
    sol.common.IxUtils.execute("RF_sol_function_Set", {
      objId: me.getTargetId(me.target),
      flowId: me.flowId,
      entries: setConfig
    });
  }
});

/**
 * @member sol.common.ix.functions.FillSordByApi
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.hr.ix.functions.FillSordByApi", params);

  fun.process();
}

/**
 * @member sol.common.ix.functions.FillSordByApi
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.hr.ix.functions.FillSordByApi", params);

  fun.process();
}


/**
 * @member sol.common.ix.functions.FillSordByApi
 * @method RF_sol_hr_function_FillSordByApi
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_FillSordByApi(iXSEContext, args) {
  var rfParams, fun;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.hr.ix.functions.FillSordByApi", rfParams);

  fun.process();
}
