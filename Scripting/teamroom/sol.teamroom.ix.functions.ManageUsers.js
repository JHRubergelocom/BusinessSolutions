importPackage(Packages.de.elo.utils);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.teamroom.mixins.Configuration.js
//@include lib_sol.teamroom.Utils.js

/**
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.UserUtils
 * @requires sol.teamroom.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.teamroom.ix.functions.ManageUsers", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true }
  },

  getCurrentGroups: function (modifiedUser) {
    var groupsOfUser = modifiedUser.groupList, newGroups = [], i;
    for (i = 0; i < groupsOfUser.length; i++) {
      newGroups.push(groupsOfUser[i]);
    }
    return newGroups;
  },

  addCurrentGroups: function (currentGroups, acc) {
    for (var i = 0; i < currentGroups.length; i++) {
      acc.push(currentGroups[i]);
    }
    return acc;
  },

  toJavaArray: function (arr) {
    var i, jArr = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, arr.length);
    for (i = 0; i < arr.length; i++) {
      jArr[i] = arr[i];
    }
    return jArr;
  },

  getGroups: function (modifiedUser, tgtGroup) {
    var me = this;
    return me.toJavaArray([tgtGroup]
      .concat(me.getCurrentGroups(modifiedUser))
    );
  },

  prepareUser: function (user, tgtGroup) {
    var me = this, modifiedUser;
    me.logger.info("adding user: " + user.name);
    modifiedUser = new UserInfo(user);
    modifiedUser.groupList = me.getGroups(modifiedUser, tgtGroup);
    me.logger.info("num of modified groups: " + modifiedUser.groupList.length);
    return modifiedUser;
  },

  addUsers: function (users, tgtGroup) {
    var me = this, newUsers = ixConnectAdmin.ix().checkoutUsers(users, CheckoutUsersC.BY_IDS, LockC.NO),
        i, modifiedUsers = [];
    for (i = 0; i < newUsers.length; i++) {
      modifiedUsers.push(me.prepareUser(newUsers[i], tgtGroup));
    }
    ixConnectAdmin.ix().checkinUsers(modifiedUsers, CheckinUsersC.WRITE, LockC.YES);
    return { success: true };
  },

  getRemovalGroups: function (groupsOfUser, tgtGroup) {
    var groups = [], i;
    for (i = 0; i < groupsOfUser.length; i++) {
      if (groupsOfUser[i] !== tgtGroup) {
        groups.push(groupsOfUser[i]);
      }
    }
    return groups;
  },

  prepareUserRemoval: function (user, tgtGroup) {
    var me = this, modifiedUser;
    me.logger.info("removing user: " + user.name);
    modifiedUser = new UserInfo(user);
    modifiedUser.groupList = me.toJavaArray(me.getRemovalGroups(modifiedUser.groupList, tgtGroup));
    me.logger.info("num of modified groups: " + modifiedUser.groupList.length);
    return modifiedUser;
  },

  removeUsers: function (users, tgtGroup) {
    var me = this, obsoleteUsers = ixConnectAdmin.ix().checkoutUsers(users, CheckoutUsersC.BY_IDS, LockC.YES),
        modifiedUsers = [], i;
    // remove all users that are not longer in group
    for (i = 0; i < obsoleteUsers.length; i++) {
      modifiedUsers.push(me.prepareUserRemoval(obsoleteUsers[i], tgtGroup));
    }
    ixConnectAdmin.ix().checkinUsers(modifiedUsers, CheckinUsersC.WRITE, LockC.YES);
    return { success: true };
  },

  process: function () {
    var me = this, params = me._params,
        room = params.room, system = params.system, users = params.users,
        mode = params.cmd || params.mode, role = params.role, groups, targetGroup;

    return (!(room || system || mode || role || users) && msg(false, 400, "Wrong input.", params))
      || (!sol.teamroom.Utils.checkIfAdmin(me.ec, (groups = sol.teamroom.Utils.getRoleGroups(system, role))[0])
          && msg(false, 400, "Current user could not be found in admin group of given room."))
      || (((targetGroup = groups[groups.length > 1 ? 1 : 0].id), (mode === "add")) && me.addUsers(users, targetGroup))
      || ((mode === "remove") && me.removeUsers(users, targetGroup));
  }
});

/**
 * @member sol.teamroom.ix.functions.ManageUsers
 * @method RF_sol_teamroom_function_ManageUsers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionBaseName
 */
function RF_sol_teamroom_function_ManageUsers(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.teamroom.ix.functions.ManageUsers" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);
  rfParams.ec = iXSEContext;

  result = sol.common.JsonUtils.stringifyQuick(
    sol.create("sol.teamroom.ix.functions.ManageUsers", rfParams).process()
  );

  logger.info("Result ManageUsers:" + result);
  logger.exit("sol.teamroom.ix.functions.ManageUsers");
  return result;
}

function msg(success, code, message, input, existing) {
  return { success: success, code: code, message: message, input: input, existing: existing };
}

/**
 * This function checks if the current user is in the Admin Group of a given
 * team room (only admins can change users).
 * Afterwards the function will reset the members of the technical admin, member
 * or guest (role) group to the given user ids.
 *
 * @param {type} ec
 * @param {String} arg
 * A json data object string. The parsed object contains:
 *
 * @param {String} arg.room
 * The guid of the current teamroom data folder.
 * @param {String} arg.system
 * The guid of the current teamroom system folder.
 * @param {String} arg.cmd
 * The command string constant. One of 'add' or 'remove'.
 * @param {String} arg.role
 * The group role string. One of 'admin', 'member' or 'guest'.
 * @param {String[]} arg.users
 * The list of users to add|remove (cmd) from the given role group.
 *
 * @return Object A json object string containing success state of the remote function.
 */
function RF_TR_changeUsers(ec, args) {
  return RF_sol_teamroom_function_ManageUsers(ec, args);
}
