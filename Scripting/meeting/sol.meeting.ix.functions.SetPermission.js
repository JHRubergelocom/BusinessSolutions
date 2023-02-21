importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.SetPermission" });

/**
*
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.AclUtils
* @requires sol.common.Injection
* @requires sol.common.ObjectUtils
* @requires sol.common.ix.FunctionBase
* @requires sol.meeting.mixins.Configuration
*/
sol.define("sol.meeting.ix.functions.SetPermission", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    permissions: { config: "permissions", prop: "permissions", template: false },
    sord: { sordIdFromProp: "objId", optional: false }
  },

  UNKNOWN_USER_ERRORCODE: "[ELOIX:5023]",

  process: function () {
    var me = this,
        hasUserIds = function (permissionArgs) {
          return permissionArgs.userIds && permissionArgs.userIds.length > 0;
        },
        checkAndSetEloUsers = function (permissionArgs) {
          var getUserIds = function () {
                return Array.isArray(permissionArgs.userIds)
                  ? permissionArgs.userIds
                  : [permissionArgs.userIds];
              },
              exists = function (value) {
                return value != null;
              },
              getEloUserId = function (userId) {
                try {
                  var userInfo = sol.common.UserUtils.getUserInfo(userId);
                  return userInfo.id;
                } catch (error) {
                  return null;
                }
              };

          permissionArgs.userIds = getUserIds()
            .filter(exists)
            .map(getEloUserId)
            .filter(exists);

          return permissionArgs;
        },
        createPermissionArgsForEachUser = function (permissionArgsForEachUser, permissionArgs) {
          var createPermissionArgsForOneUser = function (userId) {
                var permissionArgsForOneUser = sol.common.ObjectUtils.clone(permissionArgs);
                permissionArgsForOneUser.userIds = undefined;
                permissionArgsForOneUser.name = userId;
                permissionArgsForOneUser.propKey = permissionArgsForOneUser.propKey || "STATUS";
                return permissionArgsForOneUser;
              },
              toPermission = function (userPermissionArgs) {
                userPermissionArgs.rights = (me.getPermission(
                  me.getSolType(),
                  me.getRole(userPermissionArgs),
                  userPermissionArgs.propKey,
                  me.getStatus(userPermissionArgs)
                ) || {}).rights;
                return userPermissionArgs;
              },
              isValidPermission = function (permission) {
                return permission.name && permission.rights;
              },
              splittedPermissionArgs;

          splittedPermissionArgs = permissionArgs.userIds
            .map(createPermissionArgsForOneUser)
            .map(toPermission)
            .filter(isValidPermission);

          return permissionArgsForEachUser.concat(splittedPermissionArgs);
        },
        config = me.getPermissionConfig(),
        permissions;

    permissions = me.getPermissionArgs()
      .filter(hasUserIds)
      .map(checkAndSetEloUsers)
      .filter(hasUserIds)
      .reduce(createPermissionArgsForEachUser, []);

    if (!me.dryRun && permissions.length > 0) {
      me.editRights(me.sord.id, permissions, config);
    }
    if (me.debug) {
      return {
        permissions: permissions,
        objId: me.sord.id,
        solType: me.getSolType(),
        config: config
      };
    }
  },

  getPermissionArgs: function () {
    var me = this;

    return me.combine
      ? me.combine
      : [{
        role: me.role,
        userIds: Array.isArray(me.userIds) ? me.userIds : [me.userIds],
        propKey: me.propKey,
        status: me.status
      }];
  },


  getSolType: function () {
    var me = this;

    return sol.common.ObjectUtils.getProp(me.sord, "objKeys.SOL_TYPE");
  },

  getRole: function (permissionArgs) {
    return permissionArgs.role;
  },

  getStatus: function (permissionArgs) {
    var me = this,
        status = permissionArgs.status || {},
        statusValue;

    if (status.key) {
      // TODO: use status.prop instead of status.key here?
      // Maybe we dont use status value but we can use another prop like  `type`?
      statusValue = sol.common.ObjectUtils.getProp(me.sord, status.key);
    } else if (status.value) {
      statusValue = status.value;
    } else if (sol.common.ObjectUtils.type(status, "string")
      && !sol.common.ObjectUtils.isEmpty(status)) {
      statusValue = status;
    }
    // TODO: use util function
    return (statusValue || "").split(" -")[0] || "DEFAULT";
  },

  getPermission: function (solType, role, propKey, key) {
    var me = this,
        permissions,
        defaultPermissions;

    if (me.checkParameter(solType, role)) {
      permissions = me.getRequestedPermssion(solType, role, propKey, key);
      defaultPermissions = me.getDefaultPermission(solType, role, propKey);
    }

    return permissions || defaultPermissions;
  },

  getRequestedPermssion: function (solType, role, propKey, key) {
    var me = this;

    return sol.common.ObjectUtils.getProp(me.permissions, me.getPropPath(solType, role, propKey, key));
  },

  getDefaultPermission: function (solType, role, propKey) {
    var me = this;

    return sol.common.ObjectUtils.getProp(me.permissions, me.getPropPath(solType, role, propKey, "DEFAULT"));
  },

  getPropPath: function (solType, role, propKey, key) {
    return solType + "." + role + "." + (propKey || "STATUS") + "." + key;
  },

  getPermissionConfig: function () {
    var me = this;

    return sol.common.ObjectUtils.getProp(me.permissions, me.getSolType() + ".$config");
  },

  checkParameter: function (solType, role) {
    var me = this;

    if (!solType) {
      throw Error("no SOL_TYPE to select permission set in sord " + (me.sord || {}).id);
    }
    if (!role) {
      throw Error("no role to select permission provided");
    }
    if (!me.permissions[solType]) {
      throw Error("no permission defined for SOL_TYPE " + solType);
    }
    if (!me.permissions[solType][role]) {
      throw Error("no permission defined for SOL_TYPE " + solType + " and role " + role);
    }

    return true;
  },

  getUserIds: function () {
    var me = this,
        userIds;

    try {
      userIds = (typeof me.userId !== 'undefined')
        ? [me.userId]
        : null;
      if (!userIds) {
        userIds = typeof me.userIds == "string"
          ? me.userIds.split(',')
          : me.userIds;
      }
      return userIds;
    } catch (error) {
      return null;
    }
  },

  editRights: function (sordId, permissions, config) {
    var me = this;
    try {
      me.logger.debug("permissions on " + sordId + " : " + JSON.stringify(permissions));
      me.getAclUtilsFunction(config)(sordId, permissions, {}, config || {});
    } catch (error) {
      if (String(error).indexOf(me.UNKNOWN_USER_ERRORCODE) > -1) {
        // Ignore if user is not found
        me.logger.warn(error);
      } else {
        // make sure unknown Exceptions do not get lost
        throw error;
      }
    }
  },

  getAclUtilsFunction: function (config) {
    return (config || {}).mode == "SET"
      ? sol.common.AclUtils.setRights.bind(sol.common.AclUtils)
      : (config || {}).mode == "REMOVE"
        ? sol.common.AclUtils.removeRights.bind(sol.common.AclUtils)
        : sol.common.AclUtils.addRights.bind(sol.common.AclUtils);
  }
});

/**
 * @member sol.meeting.ix.functions.SetPermission
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, diagram, nodeId) {
  logger.enter("onEnterNode_SetPermission", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.SetPermission", params);

  generator.process();

  logger.exit("onEnterNode_SetPermission");
}

/**
 * @member sol.meeting.ix.functions.SetPermission
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_SetPermission", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  generator = sol.create("sol.meeting.ix.functions.SetPermission", params);

  generator.process();

  logger.exit("onExitNode_SetPermission");
}

/**
* @member sol.meeting.ix.functions.SetPermission
* @method RF_sol_meeting_function_SetPermission
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionBaseName
*/
function RF_sol_meeting_function_SetPermission(iXSEContext, args) {
  var params,
      result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  params.config = params;

  result = sol.create("sol.meeting.ix.functions.SetPermission", params).process();
  return sol.common.JsonUtils.stringifyQuick(result);
}