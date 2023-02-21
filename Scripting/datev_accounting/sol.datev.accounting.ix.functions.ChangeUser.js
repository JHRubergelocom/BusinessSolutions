
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.ChangeUser" });

/**
 *
 * @author MH, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.SordUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.Roles
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.datev.accounting.ix.functions.ChangeUser", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wFDiagram", "currentNodeId", "defaultUser"],

  mixins: [
    "sol.datev.accounting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    useConfigResolver: { config: "accounting", prop: "useConfigResolver", template: false },
    workflowSets: { config: "accounting" , prop: "workflowSets"}
  },

  /** @cfg {de.elo.ix.client.WFDiagram} wFDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */
  wFDiagram: undefined,

  /** @cfg {Number} currentNodeId (required)
   * The ID of the current node.
   * It is used to find the successing person nodes if no ID or name is defined, or to change the user of the node itself, if changeCurrentNode is true
   */
  currentNodeId: undefined,

  /** @cfg {String} defaultUser (required)
   * the user that should be set if none is specified/found
   */
  defaultUser: undefined,

  /** @cfg {String} role (optional)
   * This role tht will be used, to lookup the users from the configuration.
   * If empty the node name will be used.
   */
  role: undefined,

  /** @cfg {Boolean} [changeCurrentNode=false]
   * if true, the user of the current node will be changed;
   * of course this is only supported on nodes with type = WFNodeC.TYPE_PERSONNODE
   */
  changeCurrentNode: false,

  /**
   * @cfg {Array} nodeEscalations
   * Node escalations
   *
   * @cfg {Object} nodeEscalations[].user Node escalation user
   * @cfg {String} nodeEscalations[].user.value Node escalation user name
   * @cfg {Number} nodeEscalations[].timeLimitMinutes Node escalation minutes
   *
   * If no user has been set, the determinated node user is used.
   *
   * Example:
   *     { "timeLimitMinutes": 1 }
   */
  nodeEscalations: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Change the node user.
   */
  process: function () {
    var me = this,
        wfUtils = sol.common.WfUtils,
        userNodes, role, user, oldUser, text, userConfig;

    me.sord = ixConnect.ix().checkoutSord(me.wFDiagram.objId, EditInfoC.mbSord, LockC.NO).sord;

    try {
      var workflowProcess = sol.datev.accounting.Utils.getWorkflowConfig(me.sord, {
        resolverTemplates: me.useConfigResolver,
        basePath : me.workflowSets.basePath
      });
    } catch (ex) {
      me.logger.error("process file couldn't read", ex);
      sol.datev.accounting.Utils.handleMissingDocumentConfig(me.wFDiagram.objId, me.workflowSets.feed.missingConfig);
      return;
    }
    
    if (me.wFDiagram){
      // writing debug info
      sol.common.WfUtils.setWfMapValue( me.wFDiagram.objId, me.wFDiagram.id, "ACCOUNTING_USER_SOURCE", workflowProcess.configFile );
    }

    userConfig = workflowProcess.config.roles;

    me.logger.info(["userConfig {0}" , userConfig]);
    if (me.changeCurrentNode) {
      userNodes = [wfUtils.getNode(me.wFDiagram, me.currentNodeId)];
    } else {
      userNodes = wfUtils.getSuccessorNodes(me.wFDiagram, me.currentNodeId, WFNodeC.TYPE_PERSONNODE);
    }

    userNodes.forEach(function (node) {
      role = me.role || node.name;
      user = sol.common.Roles.getUsers(role, me.sord, userConfig)[0];

      if (!user) {
        user = me.defaultUser;
      }

      oldUser = node.userName;
      wfUtils.changeNodeUser(node, user, { changeDesignDepartment: true });

      wfUtils.setNodeEscalations(node, me.nodeEscalations, user);
    

      text = me.logger.format(["Changed NodeUser from '{0}' to '{1}'", oldUser, user]);

      me.logger.info(text);
    });
  }
});


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");

  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.datev.accounting.ix.functions.ChangeUser", params);

  module.process();

  logger.exit("onEnterNode_ChangeUser");
}


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeUser", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "defaultUser");

  params.wFDiagram = wFDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.datev.accounting.ix.functions.ChangeUser", params);

  module.process();

  logger.exit("onExitNode_ChangeUser");
}
