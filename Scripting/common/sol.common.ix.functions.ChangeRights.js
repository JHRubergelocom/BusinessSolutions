
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeRights" });

/**
 * Changes rights.
 *
 * Add rights based on a configuration. It can also perform a cleanup before setting the new rights.
 *
 * # Node configuration example:
 *
 *     {
 *       "users": ["user1"],      // user1 will get
 *       "rights": { "r": true }, // read access
 *       "mode": "SET"            // while all other rights will be removed
 *     }
 *
 *     {
 *       "users": ["group2"],     // group2 will get
 *       "rights": { "w": true }, // write access
 *       "mode": "ADD"            // in addition to the other (already existing) rights
 *     }
 *
 * Without configuration the current user will get full rights for the given
 * object and it's children.
 *
 * # Extended configuration:
 *
 *     {
 *       "users": [
 *         { "name": "Mustermann" },                                          // user 'Mustermann' gets the fallback rights
 *         { "name": "Haenschenklein", "rights": { "r": true, "w": true } },  // user 'Haenschenklein' gets read and write access
 *         { "type": "GRP", "key": "MY_USER" }                                // if there is a user configured in index field 'MY_USER', it gets the fallback rights
 *       ],
 *       "andGroups": [
 *         { "groups": ["GroupA", "GroupB", { "type": "GRP", "key": "CONTRACT_RESPONSIBLE" }] }, // and-group (containing three groups) with fallback rights
 *         { "groups": ["GroupX", "GroupY"], "rights": { "r": true, "w": true, "l": true } }         // and-group (containing two groups) with read, write and list access
 *       ],
 *       "rights": { "r": true }
 *     }
 *
 * # Cleanup
 * This function can also perform a cleanup (see {@link #cleanup}).
 * If new rights are configured, this cleanup step will be performed before the new rights will be set.
 *
 * The following example will remove the 'delete' permission for user 'kraft' and add 'read' permission for user 'renz':
 *
 *     {
 *       "users": [
 *         "renz"
 *       ],
 *       "cleanup": {
 *         "users": [
 *           { "name": "kraft", "rights": { "d": true } }
 *         ]
 *       },
 *       "rights": { "r": true }
 *     }
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Utils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.ChangeRights", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {String} objIds If the processing should be executed on more then one element. `objId` is still required, as base for the data.
   */

  /**
   * @cfg {String[]|Object[]} users
   * Specifies, which users rights will be altered (see {@link sol.common.AclUtils} and especially {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}).
   * Additionally the user object can have a `type` and a `key` property (see {@link sol.common.SordUtils#getValue}), which will be used to determine the user name.
   */

  /**
   * @cfg {Object[]} andGroups
   * An array with and-group definitions.
   * See {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}
   */

  /**
   * @cfg {Object} rights
   * Rights that will be set to the workflow object and it's children.
   * See {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}
   */

  /**
   * @cfg {String} mode See {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}
   */

  /**
   * @cfg {Boolean} dontWait See {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}
   */

  /**
   * @cfg {Boolean} recursive See {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}
   */

  /**
   * @cfg {String} wfOwner
   * This attribute will be used, if the cleanup specifies to remove rights of the `wfOwner`.
   * If this function is used in a workflow, this will be set automatically.
   */

  /**
   * @cfg {Object} cleanup Configuration of a cleanup, before the new rights will be applied
   * @cfg {String[]|Object[]} cleanup.users Specifies, which users rights will be removed (see {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}).
   * @cfg {Boolean} cleanup.revokeWfOwnerRights If `true` and the property `wfOwner` is set, `wfOwner` loses all access rights
   * @cfg {Object} cleanup.rights Specifies, which rights will be removed in case the user object does not state otherwise (see {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground}). If nothing is set, all rights will be removed.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Adds rights to an object or branch.
   */
  process: function () {
    var me = this,
        rightsConfig = {};

    me.performCleanup();

    if (me.inherit || me.users || me.andGroups) {
      rightsConfig.inherit = me.inherit;
      rightsConfig.users = me.users;
      rightsConfig.andGroups = me.andGroups;
      rightsConfig.rights = me.rights;
      rightsConfig.mode = me.mode;
      rightsConfig.dontWait = me.dontWait;
      rightsConfig.recursive = me.recursive;
      rightsConfig.flowId = me.flowId;

      me.performBackgroundAclJob(rightsConfig);
    }
  },

  /**
   * @private
   * Uses {@link sol.common.AclUtils#changeRightsInBackground changeRightsInBackground} to remove specific user rights.
   */
  performCleanup: function () {
    var me = this,
        removeRightsConfig = {},
        fullRemove = { r: true, w: true, d: true, e: true, l: true, p: true };

    if (me.cleanup && me.mode != "SET") { // cleanup is redundant, if mode is "SET", because all previous rights will be overriden anyway
      removeRightsConfig.users = (me.cleanup.users && (me.cleanup.users.length > 0)) ? me.cleanup.users : [];
      removeRightsConfig.rights = (me.cleanup.rights) || fullRemove;
      removeRightsConfig.mode = "REMOVE";
      removeRightsConfig.dontWait = me.dontWait;
      removeRightsConfig.recursive = me.recursive;

      if (me.wfOwner && (me.cleanup.revokeWfOwnerRights === true)) {
        removeRightsConfig.users.push({ name: me.wfOwner, rights: fullRemove });
      }

      if (removeRightsConfig.users.length > 0) {
        me.performBackgroundAclJob(removeRightsConfig);
      }
    }
  },

  /**
   * @private
   * Performs the background job to change the rights.
   * @param {Object} rightsConfig
   */
  performBackgroundAclJob: function (rightsConfig) {
    var me = this,
        objId;

    if (me.objIds) {
      objId = me.objIds;
      rightsConfig.srcObjId = rightsConfig.srcObjId || me.objId;
    } else {
      objId = me.objId;
    }

    sol.common.AclUtils.changeRightsInBackground(objId, rightsConfig);
  }

});

/**
 * This is a wrapper class for {@link sol.common.ix.functions.ChangeRights ChangeRights}.
 *
 * It supports the following modes:
 *
 * - single element
 * - children (permission groups)
 *
 * # Single element
 * The configuration will be passed to {@link sol.common.ix.functions.ChangeRights ChangeRights}.
 *
 * ## Node configuration example:
 * See {@link sol.common.ix.functions.ChangeRights ChangeRights}.
 *
 * # Children (permission groups)
 * Changes rights on the children (only first level) of an element.
 *
 * The script will read a permission group (or a list) from an index field of each individual child element.
 * If there is a configuration for that permission group(s), it will adjust the rights of the child element by handing that configuration over to {@link sol.common.ix.functions.ChangeRights ChangeRights}.
 *
 * ## Node configuration example:
 *
 *     {
 *       "processChildrenPermissions": true,
 *       "permissionGroupField": "RIGHT_GROUP",
 *       "permissionGroups": [
 *         { "name": "aclGroup1", "config": { ... } },
 *         { "name": "aclGroup1", "config": { ... } },
 *         ...
 *       ]
 *     }
 *
 * For the configuration of the single permission groups see {@link sol.common.ix.functions.ChangeRights ChangeRights}.
 * The name is used to determine which set of permissions should be applied on which child.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Utils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.ChangeRightsWrapper", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {Boolean} processChildrenPermissions
   */

  /**
   * @cfg {String} permissionGroupField The index field containing the permission group(s) for the child.
   */

  /**
   * @cfg {Object[]} permissionGroups
   * The configurations for the different permission groups. For configuration of each individual group see {@link sol.common.ix.functions.ChangeRights ChangeRights}.
   * `objId` (and `objIds`) do not have to be configured, the wrapper will take care of those.
   */

  MODES: {
    SINGLE: "SINGLE",
    CHILDREN: "CHILDREN"
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.$config = config;
    me.$config.objId = me.objId;
  },

  /**
   * Performs the processing.
   */
  process: function () {
    var me = this,
        mode;

    me.conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    mode = me.determineMode();

    switch (mode) {
      case me.MODES.CHILDREN:
        me.performChildrenRun();
        break;
      default:
        me.performSingleRun();
    }
  },

  /**
   * @private
   * Determines in which mode the function was executed.
   * @return {String}
   */
  determineMode: function () {
    var me = this;
    if ((me.processChildrenPermissions === true) && me.permissionGroupField && me.permissionGroups) {
      return me.MODES.CHILDREN;
    }
    return me.MODES.SINGLE;
  },

  /**
   * @private
   * Performs a standard change rights run.
   */
  performSingleRun: function () {
    var me = this,
        module;

    module = sol.create("sol.common.ix.functions.ChangeRights", me.$config);
    module.process();
  },

  /**
   * @private
   * Performs a change rights run on all the children depending on the configured permission group per children.
   */
  performChildrenRun: function () {
    var me = this,
        execBuckets = {},
        permissionGroup, startIds, permissionGrpCfg, module;

    me.processChildren(execBuckets);

    for (permissionGroup in execBuckets) {
      if (execBuckets.hasOwnProperty(permissionGroup) && execBuckets[permissionGroup] && (execBuckets[permissionGroup].length > 0)) {
        startIds = execBuckets[permissionGroup].map(function (child) {
          return child.id;
        });
        permissionGrpCfg = me.getPermissionConfig(permissionGroup);

        if (permissionGrpCfg) {
          permissionGrpCfg.objId = me.objId;
          permissionGrpCfg.objIds = startIds;

          module = sol.create("sol.common.ix.functions.ChangeRights", permissionGrpCfg);
          module.process();

          permissionGrpCfg = null;
          module = null;
        } else {
          me.logger.warn(["no config for permission group '{0}' found", permissionGroup]);
        }
      }
    }
  },

  /**
   * @private
   * Processes all child elements on the first level.
   * @param {Object} execBuckets
   */
  processChildren: function (execBuckets) {
    var me = this,
        children;

    me.logger.debug(["processChildren: conn.user.name={0}", me.conn.loginResult.user.name]);

    children = sol.common.RepoUtils.findChildren(me.objId, {
      includeFolders: true,
      includeDocuments: false,
      includeReferences: false,
      sordZ: SordC.mbAllIndex
    }, me.conn);

    if (children && (children.length > 0)) {
      children.forEach(function (child) {
        me.processChild(child, execBuckets);
      });
    }
  },

  /**
   * @private
   * Determines the right groups for a child element and adds them to the execution buckets.
   * @param {de.elo.ix.client.Sord} child
   * @param {Object} execBuckets
   */
  processChild: function (child, execBuckets) {
    var me = this,
        permissionGroups;

    permissionGroups = sol.common.SordUtils.getObjKeyValues(child, me.permissionGroupField);

    if (permissionGroups && (permissionGroups.length > 0)) {
      permissionGroups.forEach(function (permissionGroup) {
        if (execBuckets[permissionGroup]) {
          execBuckets[permissionGroup].push(child);
        } else {
          execBuckets[permissionGroup] = [child];
        }
      });
    }
  },

  /**
   * @private
   * Loads the permission config for a specified group.
   * @param {String} permissionGroup
   * @return {Object}
   */
  getPermissionConfig: function (permissionGroup) {
    var me = this,
        permissionCfg = null;

    if (me.permissionGroups && (me.permissionGroups.length > 0)) {
      me.permissionGroups.some(function (pg) {
        if (pg.name == permissionGroup) {
          permissionCfg = pg.config;
          return true;
        }
      });
    }

    return permissionCfg;
  }

});


/**
 * @member sol.common.ix.functions.ChangeRightsWrapper
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeRights", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  params.wfOwner = wFDiagram.ownerName;
  params.objIds = null;

  module = sol.create("sol.common.ix.functions.ChangeRightsWrapper", params);
  module.process();

  logger.exit("onEnterNode_ChangeRights");
}


/**
 * @member sol.common.ix.functions.ChangeRightsWrapper
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeRights", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  params.wfOwner = wFDiagram.ownerName;
  params.objIds = null;

  module = sol.create("sol.common.ix.functions.ChangeRightsWrapper", params);
  module.process();

  logger.exit("onExitNode_ChangeRights");
}


/**
 * @member sol.common.ix.functions.ChangeRightsWrapper
 * @method RF_sol_function_ChangeRights
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_ChangeRights(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_ChangeRights", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.common.ix.functions.ChangeRightsWrapper", params);
  module.process();

  logger.exit("RF_sol_function_ChangeRights");
}

