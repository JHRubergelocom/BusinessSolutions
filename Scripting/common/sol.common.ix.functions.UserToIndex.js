
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.UserToIndex" });

/**
 * Writes a username into a index field directly.
 *
 * If used on a workflow user node the name of the user responsible for the node is set. All other cases will set the user name of the current session.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "fieldName": "INVOICE_USER"
 *     }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires  sol.Logger
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.UserToIndex", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {string} fieldName (required)
   * Index field for username
   */

  /**
   * @cfg {string} nodeId
   * If specified, the nodeId of the current workflow node
   */

  /**
   * @cfg {Boolean} [clear=false] optional
   * If true the field will be cleared
   */

  /**
   * @cfg {Boolean} [append=false] (optional)
   * If true the username will be appended
   */

  /**
   * @cfg {Boolean} [distinct=true] (optional)
   * If `true` a username will only be appended if it is not already in the field (prevents duplicates). Parameter is only used if `append = true`.
   */

  /**
   * @cfg {Boolean} [sort=true] (optional)
   * If `true` the usernames will be ordered alphabetically. In order to preserve the sequence of entry this has to be set to false. Parameter is only used if `append = true`.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Sets the username.
   */
  process: function () {
    var me = this,
        newUserNames = [],
        sord, conn, userNames, i;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect,

    me.fieldName = me.fieldName || "CURRENT_USER";

    sord = conn.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    if (!me.userName) {
      me.userName = sol.common.WfUtils.getNodeUser(me.wfDiagram, me.nodeId, { useSessionUserAlternatively: true }) + "";
    }

    if (me.clear) {
      sol.common.SordUtils.setObjKeyValues(sord, me.fieldName, null);
      me.logger.debug(["Clear users from index field '{0}'", me.fieldName]);
    } else if (me.append) {
      userNames = sol.common.SordUtils.getObjKeyValues(sord, me.fieldName) || [];
      for (i = 0; i < userNames.length; i++) {
        newUserNames.push(userNames[i] + "");
      }

      if ((me.distinct === false) || (newUserNames.indexOf(me.userName) < 0)) {
        newUserNames.push(me.userName);
        if (me.sort !== false) {
          newUserNames.sort();
        }
        sol.common.SordUtils.setObjKeyValues(sord, me.fieldName, newUserNames);
        me.logger.debug(["Add user name '{0}' to index field '{1}'", me.userName, me.fieldName]);
      }
    } else {
      sol.common.SordUtils.setObjKeyValue(sord, me.fieldName, me.userName);
      me.logger.debug(["Set index field '{0}' to user name '{1}'", me.fieldName, me.userName]);
    }

    conn.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
  }
});


/**
 * @member sol.common.ix.functions.UserToIndex
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_UserToIndex", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.common.ix.functions.UserToIndex", params);
  module.process();

  logger.exit("onEnterNode_UserToIndex");
}


/**
 * @member sol.common.ix.functions.UserToIndex
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_UserToIndex", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.common.ix.functions.UserToIndex", params);
  module.process();

  logger.exit("onExitNode_UserToIndex");
}

/**
 * @member sol.common.ix.functions.UserToIndex
 * @method RF_sol_function_UserToIndex
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_UserToIndex(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_UserToIndex", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);
  module = sol.create("sol.common.ix.functions.UserToIndex", params);
  module.process();

  logger.exit("RF_sol_function_UserToIndex");
}