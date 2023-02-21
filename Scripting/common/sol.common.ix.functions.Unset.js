
importPackage(Packages.de.elo.ix.client);


//@include lib_Class.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.IxUtils.js
//@inlcude lib_sol.common.ObjectUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Unset" });


/**
 * Edits an existing object by setting empty values.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 *
 *
 * Following configuration should be applied to the comments field. It will clear the field "COMPANY_NAME".
 *
 *     {
 *       "entries": [{
 *         "type": "GRP",
 *         "key": "COMPANY_NAME"
 *        }]
 *     }
 *
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Unset", {
 *       objId: "6095",
 *       entries: [{
 *         type: "GRP",
 *         key: "COMPANY_NAME"
 *       }]
 *     });
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.Logger
 * @requires sol.common.ObjectUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Unset", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "entries"],


  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {Object[]} entries (required)
   * Entries to Unset
   */

  /**
   * Unsets a field
   */
  process: function () {
    var me = this, params;

    if(!sol.common.ObjectUtils.isArray(me.entries)){
      throw Error("Entries is not an array");
    } else if(sol.common.ObjectUtils.isEmpty(me.entries)){
      return;
    }

    for(var i = 0; i < me.entries.length; i++){
      me.entries[i].value = "";
    }

    var params = {
      objId: me.objId,
      entries: me.entries
    }
    sol.common.IxUtils.execute("RF_sol_function_Set", params);
  }
});


/**
 * @member sol.common.ix.functions.Unset
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_Unset", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "entries");

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  module = sol.create("sol.common.ix.functions.Unset", params);

  module.process();

  logger.exit("onEnterNode_Unset");
}

/**
 * @member sol.common.ix.functions.Unset
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Unset", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "entries");

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.common.ix.functions.Unset", params);

  module.process();

  logger.exit("onExitNode_Unset");
}

/**
 * @member sol.common.ix.functions.Unset
 * @method RF_sol_function_Unset
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Unset(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_Unset", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "entries");
  module = sol.create("sol.common.ix.functions.Unset", params);

  module.process();

  logger.exit("RF_sol_function_Unset");
}
