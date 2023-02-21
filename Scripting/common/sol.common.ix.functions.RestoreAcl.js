
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.RestoreAcl" });

/**
 * Restore ACL from whole folder structure.
 *
 * The ACL will be restored from a map field. The ACL can e.g. be saved to a map field by the {@link sol.common.ix.functions.RemoveAcl RemoveAcl} function.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration has to be applied to the comments field.
 *
 *     {
 *       "mapKey": "REMOVED_ACL",
 *       "recursive": true
 *     }
 *
 * The recursive flag is optional and the default will be `false`.
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute("RF_sol_function_RestoreAcl", {
 *       objId: "4711",
 *       mapKey: "REMOVED_ACL"
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.RestoreAcl", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "mapKey"],

  /**
   * @cfg {String} objId (required)
   * ObjectId of folder structure
   */

  /**
   * @cfg {String} mapKey (required)
   * Name of Mapfield which contains the ACL string
   */

  /** @cfg {Boolean} [recursive=false] (optional) */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.recursive = config.recursive || false;
  },

  /**
   * Restores the ACL to whole folder structure.
   */
  process: function () {
    var me = this;

    sol.common.AclUtils.restoreRights(me.objId, { recursive: me.recursive, asAdmin: me.asAdmin, storeAcl: { type: "MAP", key: me.mapKey } });
  }

});


/**
 * @member sol.common.ix.functions.RestoreAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_RestoreAcl", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "mapKey");
  params.objId = wFDiagram.objId;

  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }

  module = sol.create("sol.common.ix.functions.RestoreAcl", params);
  module.process();

  logger.exit("onEnterNode_RestoreAcl");
}

/**
 * @member sol.common.ix.functions.RestoreAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_RestoreAcl", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "mapKey");
  params.objId = wFDiagram.objId;

  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }

  module = sol.create("sol.common.ix.functions.RestoreAcl", params);
  module.process();

  logger.exit("onExitNode_RestoreAcl");
}

/**
 * @member sol.common.ix.functions.RestoreAcl
 * @method RF_sol_function_RestoreAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_RestoreAcl(ec, args) {
  logger.enter("RF_sol_function_RestoreAcl", args);
  var params, module;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "mapKey");
  if (params.asAdmin) {
    sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);
  }

  module = sol.create("sol.common.ix.functions.RestoreAcl", params);
  module.process();

  logger.exit("RF_sol_function_RestoreAcl");
}