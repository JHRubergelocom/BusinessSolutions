
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.Utils.js


var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.UserRolesToMap" }); // eslint-disable-line one-var




/**
 * Analyze the user roles config and writes the user list to a map field
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.Roles
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.datev.accounting.ix.functions.UserRolesToMap", {
  extend: 'sol.common.ix.FunctionBase',

  mixins: [
    "sol.datev.accounting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    useConfigResolver: { config: "accounting", prop: "useConfigResolver", template: false },
    workflowSets: { config: "accounting" , prop: "workflowSets"}
  },

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram
   * Workflow diagram
   */

  /**
   * @cfg {String} userRolesConfigObjId
   * Repository path of the user roles configuration
   */

  /**
   * @cfg {String|Object} role
   * Role name. If this is defined as an object, a `type` and a `key` has to be defined to load the role from the sords metadata (see {@link sol.common.SordUtils#getValue}).
   * It's also possible to define an object with a `template` property which contains a Handlebars template string.
   */

  /**
   * @cfg {String} defaultRole (optional)
   * If `role` is defined as an object with a `type` and a `key` property, but there is no role definition for the read value, this will be used.
   */

  /**
   * @cfg {String} userNamekey (optional)
   * Workflow map key name of the user name
   */

  /**
   * @cfg {String} userNamekey (optional)
   * Workflow map key name of the user ID
   */

  /**
   * @cfg {String} mandatoryKey (optional)
   * Workflow map key name of the "mandatory" flag
   */

  /**
   * @cfg {Boolean} [mandatory=true] (optional)
   * Users should be mandatory
   */

  initialize: function (config) {
    var me = this;
    me.params = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this, userConfig, workflowConfig,
        conn, userEntries;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    if (me.objId && !me.wfDiagram) {
      me.wfDiagram = sol.common.WfUtils.getLastActiveWorkflow(me.objId);
    }

    if (!me.wfDiagram) {
      throw "The workflow diagram is empty";
    }

    if (!me.role) {
      throw "The role name is empty";
    }

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    me.sord = conn.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    try {
      var workflowProcess = sol.datev.accounting.Utils.getWorkflowConfig(me.sord, {
        resolverTemplates: me.useConfigResolver,
        basePath : me.workflowSets.basePath
      });
    } catch (ex) {
      me.logger.error("process file couldn't read", ex);
      sol.datev.accounting.Utils.handleMissingDocumentConfig(me.objId, me.workflowSets.feed.missingConfig);
      return;
    }
    
    if (me.wfDiagram){
      sol.common.WfUtils.setWfMapValue( me.objId, me.wfDiagram.id, "ACCOUNTING_USER_SOURCE", workflowProcess.configFile );
    }

    userConfig = workflowProcess.config.roles;
    me.logger.info(["workflowConfig={0}", JSON.stringify(userConfig)]);
    if (!userConfig) {
      throw "In the workflow user roles configuration are no roles defined";
    }

    if (((me.role.type && me.role.key) || (me.role.template)) && !sol.common.Roles.retrieveRole(me.role, userConfig, me.sord) && me.defaultRole) { // 'defaultRole' just used if role should be read from sord
      me.role = me.defaultRole;
    }

    if (!sol.common.Roles.retrieveRole(me.role, userConfig, me.sord)) {
      throw "Role '" + me.role + "' is not defined in the configuration";
    }

    userEntries = sol.common.Roles.getUsers2(me.role, me.sord, userConfig);

    sol.common.ix.DynAdHocFlowUtils.clearCurrentUser(me.wfDiagram.id, me.objId, me.params);
    sol.common.ix.DynAdHocFlowUtils.createDynAdHocFlow(me.wfDiagram.id, me.objId, userEntries, me.params);
  }
});


/**
 * @member sol.common.ix.functions.UserRolesToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;
  logger.enter("onEnterNode_UserRolesToMap", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.datev.accounting.ix.functions.UserRolesToMap", params);

  module.process();

  logger.exit("onEnterNode_UserRolesToMap");
}


/**
 * @member sol.common.ix.functions.UserRolesToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;
  logger.enter("onExitNode_UserRolesToMap", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.datev.accounting.ix.functions.UserRolesToMap", params);

  module.process();

  logger.exit("onExitNode_UserRolesToMap");
}


