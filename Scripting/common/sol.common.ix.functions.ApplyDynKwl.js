
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ApplyDynKwl" });

/**
 * Applies data from a dynamic keywordlist using a lookup field.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following additional configuration can be applied to the comments field.
 *
 *     {
 *       "lookupFields": [ "MY_INDEX_FIELD" ]
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ApplyDynKwl", {
 *       objId: "4712",
 *       lookupFields: [ "MY_INDEX_FIELD" ]
 *     });
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.ApplyDynKwl", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "lookupFields"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {String} lookupFields (required)
   * Field from which the keywordlist will be user and which contains the lookup value
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Performes the lookup.
   */
  process: function () {
    var me = this,
        dirty = false,
        sord, name;
    try {
      me.logger.info(["apply dynamic keywordlist to sord: objId={0}; lookupFields={1}", me.objId, me.lookupFields]);
      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

      me.lookupFields.forEach(function (lookupField) {
        dirty = sol.common.ix.DynKwlUtils.fillSord(sord, lookupField, { ignoreMissingFields: true }) || dirty;
      });

      if (dirty === true) {
        ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
      } else {
        me.logger.debug("no changes applied");
      }
    } catch (ex) {
      name = (sord) ? sord.name : "--no_sord--";
      me.logger.error(["error applying values from dynamic keywordlist to sord: objId={0}; name={1}; lookupFields={2}", me.objId, name, me.lookupFields], ex);
    }
  }
});


/**
 * @member sol.common.ix.functions.ApplyDynKwl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_ApplyDynKwl", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.ApplyDynKwl", params);

  module.process();

  logger.exit("onEnterNode_ApplyDynKwl");
}


/**
 * @member sol.common.ix.functions.ApplyDynKwl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_ApplyDynKwl", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.ApplyDynKwl", params);

  module.process();

  logger.exit("onExitNode_ApplyDynKwl");
}


/**
 * @member sol.common.ix.functions.ApplyDynKwl
 * @method RF_sol_function_ApplyDynKwl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_ApplyDynKwl(iXSEContext, args) {
  logger.enter("RF_sol_function_ApplyDynKwl", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "lookupFields"),
      module = sol.create("sol.common.ix.functions.ApplyDynKwl", params);

  module.process();

  logger.exit("RF_sol_function_ApplyDynKwl");
}

