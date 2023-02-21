
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.AsUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.FileUtils.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.Map
 * @requires sol.common.IxUtils
 * @requires sol.common.AsUtils
 * @requires sol.common.HttpUtils
 * @requires sol.common.Config
 * @requires sol.common.UserUtils
 * @requires sol.common.FileUtils
 *
 *
 * This function can transfer multiple MAP-field values to the WFMAP and the other way around.
 *
 * Using the deleteMovedValue flag, you can define, if a field is moved (true) or copied (false)
 *
 * MergeTables is useful for form tables. You can merge all values of a form table field ("x"+1, "x"+2, "x"+3)
 * into a single string, which will be saved into "x"
 * ### Example
 *
 *     {
 *       "WfMap2Map": ["FLOW_ID", "ABC"],
 *       "MergeTables": {
 *         "WFMAP": ["ITEMS"],
 *         "unique": true
 *       },
 *       deleteMovedValue: true
 *     }
 *
 * WfMap fields FLOW_ID and ABC will be moved to the Map
 *
 * WFMAP table ITEMS will be merged.
 * e.g.
 *
 *     ITEMS1  = test
 *     ITEMS2  = abc
 *     ITEMS3  = xyz
 *     --> WfMap.ITEM = "test, abc, xyz"
 */
sol.define("sol.hr.ix.functions.MapToMap", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {Array} WfMap2Map (optional) Array containing fieldnames. These fields will be written to the Map-table
   */

  /**
   * @cfg {Array} Map2WfMap (optional) Array containing fieldnames. These fields will be written to the WfMap-table
   */

  /**
   * @cfg {Boolean} deleteMovedValue (optional) original values are delete from the source-Map after writing to the target-Map
   */

  /**
   * @cfg {Object} MergeTables (optional) see description
   */
  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.config = config;
  },

  mergeTable: function (mapField, map, unique) {
    var me = this, i = 0, prep = [], result, emptyValues = 0;
    while (true) {
      var value = map.getValue(mapField + i++);
      // stop trying to receive table values after no results for 10 tries
      if (!value && emptyValues++ > 10) {
        break;
      } else if (value) {
        prep.push(value);
        emptyValues = 0;
      }
    }
    result = (
      (unique && prep.filter(function (item, pos) {
        return prep.indexOf(item) == pos;
      }))
      || prep).toString();

    map.setValue(mapField, result);
  },

  mergeTables: function (cfg, wfMap, sordMap, unique) {
    var me = this;
    // table == MAPFIELD with counting ID
    Array.isArray(cfg.WFMAP) && cfg.WFMAP.forEach(function (tableName) {
      me.mergeTable(tableName, wfMap, unique);
    });
    Array.isArray(cfg.MAP) && cfg.MAP.forEach(function (tableName) {
      me.mergeTable(tableName, sordMap, unique);
    });
  },

  /**
   * Writes mapfields to wfmap and wfmapfields to sordmap
   */
  process: function () {
    var me = this, sordMap, wfMap, wfMapValuesBackup = {};

    wfMap = sol.create("sol.common.WfMap", {
      flowId: me.flowId,
      objId: me.objId
    });
    wfMap.read();

    sordMap = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    sordMap.read();


    me.config.Map2WfMap && me.config.Map2WfMap.forEach(function (fieldName) {
      wfMapValuesBackup[fieldName] = wfMap.getValue(fieldName);
      wfMap.setValue(fieldName, sordMap.getValue(fieldName));
      me.config.deleteMovedValue && sordMap.setValue(fieldName, "");
    });

    me.config.WfMap2Map && me.config.WfMap2Map.forEach(function (fieldName) {
      sordMap.setValue(fieldName, wfMapValuesBackup[fieldName] || wfMap.getValue(fieldName));
      me.config.deleteMovedValue && wfMap.setValue(fieldName, "");
    });

    me.config.MergeTables && me.mergeTables(me.config.MergeTables, wfMap, sordMap, me.config.MergeTables.unique);

    wfMap.write();
    sordMap.write();
  }
});

/**
 * @member sol.common.ix.functions.MapToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  module = sol.create("sol.hr.ix.functions.MapToMap", params);

  module.process();
}

/**
 * @member sol.common.ix.functions.MapToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module, wfmeta;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  wfmeta = sol.common.IxUtils.execute("RF_sol_common_service_GetWorkflowMetadata", {
    flowId: wfDiagram.id
  });
  params.wfOwnerUserId = wfmeta.ownerId;

  module = sol.create("sol.hr.ix.functions.MapToMap", params);

  module.process();
}


/**
 * @member sol.common.ix.functions.MapToMap
 * @method RF_sol_hr_function_MapToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_MapToMap(iXSEContext, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.hr.ix.functions.MapToMap", params);

  module.process();

}
