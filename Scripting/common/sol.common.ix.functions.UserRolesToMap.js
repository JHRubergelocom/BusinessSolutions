
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.DynAdHocFlowUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.UserRolesToMap" }); // eslint-disable-line one-var

/**
 * Analyze the user roles config and writes the user list to a map field
 *
 * @author MW, ELO Digital Office GmbH
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
sol.define("sol.common.ix.functions.UserRolesToMap", {
  extend: "sol.common.ix.FunctionBase",

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
    var me = this,
        conn, userEntries;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    if (me.objId && !me.wfDiagram) {
      me.wfDiagram = sol.common.WfUtils.getLastActiveWorkflow(me.objId);
    }

    if (!me.wfDiagram) {
      throw "The workflow diagram is empty";
    }

    if (!me.userRolesConfigObjId) {
      throw "The object ID for the user roles configuration is empty";
    }

    if (!me.role) {
      throw "The role name is empty";
    }

    me.rolesConfig = sol.create("sol.common.Config", { compose: me.userRolesConfigObjId }).config;

    if (!me.rolesConfig.roles) {
      throw "In the workflow user roles configuration are no roles defined";
    }

    me.objId = me.wfDiagram.objId;
    me.sord = conn.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    if (((me.role.type && me.role.key) || (me.role.template)) && !sol.common.Roles.retrieveRole(me.role, me.rolesConfig.roles, me.sord) && me.defaultRole) { // 'defaultRole' just used if role should be read from sord
      me.role = me.defaultRole;
    }

    if (!sol.common.Roles.retrieveRole(me.role, me.rolesConfig.roles, me.sord)) {
      throw "Role '" + me.role + "' is not defined in the configuration";
    }

    userEntries = sol.common.Roles.getUsers2(me.role, me.sord, me.rolesConfig.roles);

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

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.common.ix.functions.UserRolesToMap", params);

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

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  module = sol.create("sol.common.ix.functions.UserRolesToMap", params);

  module.process();

  logger.exit("onExitNode_UserRolesToMap");
}


/**
 * @member sol.common.ix.functions.UserRolesToMap
 * @method RF_sol_common_function_UserRoleToMap
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_function_UserRoleToMap(iXSEContext, args) {
  var params, module;
  logger.enter("RF_sol_common_function_UserRoleToMap", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "userRolesConfigObjId", "role");

  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);

  module = sol.create("sol.common.ix.functions.UserRolesToMap", params);
  module.process();

  logger.exit("RF_sol_common_function_UserRoleToMap");
}

