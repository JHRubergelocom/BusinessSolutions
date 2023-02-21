
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CopySordData" });

/**
 * Copies index values and map data to another ELO object.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "source": "1234",
 *       "suppressedFields": ["FIELD1", "FIELD2"],
 *       "suppressedMapFields": ["MAPFIELD1", "MAPFIELD2"]
 *     }
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute("RF_sol_function_CopySordData", {
 *       source: "1111",
 *       objId: "2222",
 *       suppressedFields: ["FIELD1", "FIELD2"],
 *       suppressedMapFields: ["MAPFIELD1", "MAPFIELD2"],
 *       suppressedFieldsDelete: true
 *     });
 *
 * # Prerequisites
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 *
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.CopySordData", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["source", "objId"],

  /** @cfg {String} source (required)
   * Object ID of the source ELO object.
   */

  /** @cfg {String} objId (required)
   * Object ID of the destination ELO object.
   */

  /** @cfg {Array} suppressedFields
   * Field names of the fields that should not be copied.
   */

  /** @cfg {Array} suppressedMapFields
   * Map field names of map fields that should not be copied.
   */

  /** @cfg {boolean} suppressedFieldsDelete
   * If `true`, the suppressedFields will delete.
   */

  /**
   * @cfg {boolean} [overwriteWithEmptyString=false]
   * If `true`, the destination field will be overwritten with an empty string
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * @private
   * Converts a string array to an object
   * @param {Array} arr
   * @return {Object}
   */
  convertStringArrayToObject: function (arr) {
    var obj = {};
    if (arr) {
      arr.forEach(function (element) {
        obj[element] = true;
      }, this);
    }
    return obj;
  },

  /**
   * Performs copying Sord data
   */
  process: function () {
    var me = this,
        suppressedFieldsObj, suppressedMapFieldsObj, sordZ, srcSord, dstSord,
        srcKeyValues, i, objKey, value,
        dstKeyValues = [];

    suppressedFieldsObj = me.convertStringArrayToObject(me.suppressedFields);
    suppressedMapFieldsObj = me.convertStringArrayToObject(me.suppressedMapFields);

    sordZ = new SordZ(SordC.mbObjKeys);
    srcSord = ixConnect.ix().checkoutSord(me.source, new EditInfoZ(0, sordZ), LockC.NO).sord;
    dstSord = ixConnect.ix().checkoutSord(me.objId, new EditInfoZ(0, sordZ), LockC.NO).sord;

    for (i = 0; i < dstSord.objKeys.length; i++) {
      objKey = dstSord.objKeys[i];
      if ((objKey.id <= DocMaskLineC.MAX_ID_DOCMASK_LINE) && !suppressedFieldsObj[objKey.name]) {
        value = sol.common.SordUtils.getObjKeyValue(srcSord, objKey.name) || "";
        if (value || me.overwriteWithEmptyString) {
          objKey.data = [value];
        }
      } else {
        if (me.suppressedFieldsDelete && suppressedFieldsObj[objKey.name]) {
          objKey.data = [""];
        }
      }
    }
    ixConnect.ix().checkinSord(dstSord, sordZ, LockC.NO);

    srcKeyValues = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.source, null, LockC.NO).items;

    srcKeyValues.forEach(function (keyValue) {
      keyValue = me.prepareMapItem(keyValue);
      if (!suppressedMapFieldsObj[String(keyValue.key).replace(/\d+$/, "")]) {
        dstKeyValues.push(keyValue);
      } else {
        keyValue.value = null;
        dstKeyValues.push(keyValue);
      }
    }, this);
    ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, dstKeyValues, LockC.NO);
  },

  /**
   * Prepares a map item that should be copied to a new sord depending on the used IX version.
   * @param {de.elo.ix.client.KeyValue|de.elo.ix.client.MapValue} srcMapItem
   * @return {de.elo.ix.client.KeyValue|de.elo.ix.client.MapValue}
   */
  prepareMapItem: function (srcMapItem) {
    var me = this,
        dstMapItem;

    me.ixSupportsMapValue = (typeof me.ixSupportsMapValue === "undefined") ? sol.common.RepoUtils.checkVersion(ixConnect.clientVersion, "10.00.020.007") : me.ixSupportsMapValue;

    if (me.ixSupportsMapValue) {
      dstMapItem = srcMapItem;
    } else {
      dstMapItem = new KeyValue(srcMapItem.key, srcMapItem.value);
    }

    return dstMapItem;
  }

});

/**
 * @member sol.common.ix.functions.CopySordData
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_CopySordData", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.CopySordData", params);
  module.process();

  logger.exit("onEnterNode_CopySordData");
}

/**
 * @member sol.common.ix.functions.CopySordData
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CopySordData", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.CopySordData", params);

  module.process();

  logger.exit("onExitNode_CopySordData");
}

/**
 * @member sol.common.ix.functions.CopySordData
 * @method RF_sol_function_CopySordData
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_CopySordData(iXSEContext, args) {
  var params, module;

  logger.enter("RF_sol_function_CopySordData", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "source", "objId");
  module = sol.create("sol.common.ix.functions.CopySordData", params);
  module.process();
  logger.exit("RF_sol_function_CopySordData");
}
