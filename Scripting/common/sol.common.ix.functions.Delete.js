
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Delete" });

/**
 * Deletes an element logically.
 *
 * If just a reference (instead of the original) element should be deleted, the `parentId` parameter has to be set to the parentId of the reference.
 *
 * None empty folders will be deleted by default.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following additional configuration can be applied to the comments field.
 *
 *     {
 *       "parentId": "4711"
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Delete", {
 *       objId: "4712",
 *       parentId: "4711"
 *     });
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.01.002
 *
 * @eloix
 *
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Delete", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   * ID of the element which should be deleted
   */

  /**
   * @deprecated Will be ignored from version 1.01.002
   * @cfg {Boolean} [deleteFinally=false]
   * If true, the element will be deleted physically and not just marked for deletion. Only works if user is logged in as Administrator.
   */

  /**
   * @cfg {String} parentId
   * If a reference should be deleted instead of the main element, this has to be set.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Deletes the element
   */
  process: function () {
    var me = this,
        options, parentId, conn;

    options = new DeleteOptions(),
    parentId = me.parentId ? me.parentId : null;

    options.folderMustBeEmpty = false;

    conn = me.asAdmin ? ixConnectAdmin : ixConnect;

    conn.ix().deleteSord(parentId, me.objId, LockC.NO, options);

    if (me.hasOwnProperty("deleteFinally")) {
      me.logger.warn("'deleteFinally' flag is deprecated and will be ignored");
    }

    me.logger.info(["element deleted: objId={0}; parentId={1};", me.objId, parentId]);
  }
});

/**
 * @member sol.common.ix.functions.Delete
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;
  logger.enter("onEnterNode_Delete", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Delete", params);
  module.process();

  logger.exit("onEnterNode_Delete");
}

/**
 * @member sol.common.ix.functions.Delete
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Delete", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Delete", params);
  module.process();

  logger.exit("onExitNode_Delete");
}

/**
 * @member sol.common.ix.functions.Delete
 * @method RF_sol_function_Delete
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Delete(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_Delete", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  params.asAdmin = false;

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.common.ix.functions.Delete", params);
  module.process();

  logger.exit("RF_sol_function_Delete");
}

