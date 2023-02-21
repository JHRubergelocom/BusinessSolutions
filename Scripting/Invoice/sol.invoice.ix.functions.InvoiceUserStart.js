
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
//@include lib_sol.common.Map.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.InvoiceUserStart" });

/**
 * Invoice user starts
 * Writes the current user to an index field and adds rights for the current user
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
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
 *
 */
sol.define("sol.invoice.ix.functions.InvoiceUserStart", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "wfDiagram"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {Boolean} [setCurrentUser=true]
   * Set current user
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        userConfig, userName, rightsConfig;

    me.setCurrentUser = (me.setCurrentUser == false) ? false : true;

    userConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;

    userName = sol.common.WfUtils.getNodeUser(me.wfDiagram, me.nodeId, { useSessionUserAlternatively: true });

    if (me.setCurrentUser) {
      sol.common.ix.DynAdHocFlowUtils.setCurrentUser(me.wfDiagram.objId, me.wfDiagram.id, userName);
      sol.common.IxUtils.execute("RF_sol_function_UserToIndex", { objId: me.objId, userName: userName });
    }

    userConfig.dontWait = (typeof userConfig.dontWait == "undefined") ? true : userConfig.dontWait;

    rightsConfig = {
      objId: me.objId,
      users: [userName],
      rights: userConfig.userRights,
      ignoreIfOwnEffectiveRightsExist: true,
      dontWait: userConfig.dontWait
    };

    if (!sol.common.AclUtils.containsSessionUserAndhasEffectiveRights(rightsConfig)) {
      sol.common.IxUtils.execute("RF_sol_function_ChangeRights", rightsConfig);
    }
  }
});


/**
 * @member sol.invoice.ix.functions.InvoiceUserStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_InvoiceUserStart", { flowId: wfDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  module = sol.create("sol.invoice.ix.functions.InvoiceUserStart", params);
  module.process();

  logger.exit("onEnterNode_InvoiceUserStart");
}


/**
 * @member sol.invoice.ix.functions.InvoiceUserStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_InvoiceUserStart", { flowId: wfDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  module = sol.create("sol.invoice.ix.functions.InvoiceUserStart", params);
  module.process();

  logger.exit("onExitNode_InvoiceUserStart");
}
