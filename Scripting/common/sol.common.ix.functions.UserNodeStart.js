
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.UserNodeStart" });

/**
 * Adds rights for the current user and writes the current user to an index field
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.Template
 * @requires  sol.common.UserUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 * @requires sol.common.ix.DynAdHocFlowUtils
 *
 * Node configuration example:
 *
 *     {
 *       "fieldName": "CURRENTUSER",
 *         "rightsConfig": {
 *           "rights": {
 *             "r": true,
 *             "w": true,
 *             "d": false,
 *             "e": true,
 *             "l": true
 *           }
 *         }
 *     }
 *
 */
sol.define("sol.common.ix.functions.UserNodeStart", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "wfDiagram"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {String} fieldName (optional)
   * Destination field name for the user name
   */

  /**
   * @cfg {Object} rightsConfig (optional)
   * Rights configuration
   * See {@link sol.common.AclUtils#changeRightsInBackground ACL utilities}
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        userName, users, rightsConfig;

    userName = sol.common.WfUtils.getNodeUser(me.wfDiagram, me.nodeId, { useSessionUserAlternatively: true }) + "";

    sol.common.ix.DynAdHocFlowUtils.setCurrentUser(me.wfDiagram.objId, me.wfDiagram.id, userName);

    if (me.fieldName) {
      sol.common.IxUtils.execute("RF_sol_function_UserToIndex", { objId: me.objId, fieldName: me.fieldName, userName: userName });
    }

    me.rightsConfig = me.rightsConfig || {};
    rightsConfig = sol.common.ObjectUtils.clone(me.rightsConfig);

    me.logger.debug(["clonedRightsConfig={0}", sol.common.JsonUtils.stringifyAll(rightsConfig)]);

    rightsConfig.objId = me.objId;

    users = rightsConfig.users || [];
    users.push(userName);

    rightsConfig.users = users;
    rightsConfig.rights = rightsConfig.rights || { r: true, w: true, d: true, e: true, l: true, p: true };
    rightsConfig.dontWait = true;

    if (!sol.common.AclUtils.containsSessionUserAndhasEffectiveRights(rightsConfig)) {
      me.logger.debug(["appliedRightsConfig={0}", sol.common.JsonUtils.stringifyAll(rightsConfig)]);
      sol.common.IxUtils.execute("RF_sol_function_ChangeRights", rightsConfig);
    }
  }
});

/**
 * @member sol.common.ix.functions.UserNodeStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_UserNodeStart", { flowId: wfDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  module = sol.create("sol.common.ix.functions.UserNodeStart", params);
  module.process();

  logger.exit("onEnterNode_UserNodeStart");
}


/**
 * @member sol.common.ix.functions.UserNodeStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_UserNodeStart", { flowId: wfDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  module = sol.create("sol.common.ix.functions.UserNodeStart", params);
  module.process();

  logger.exit("onExitNode_UserNodeStart");
}
