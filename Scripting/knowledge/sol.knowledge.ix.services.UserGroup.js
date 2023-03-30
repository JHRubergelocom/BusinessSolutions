
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.UserGroup" });

/**
 * Provides service function to resolve a userGroup.
 *
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.UserUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.knowledge.ix.services.UserGroup", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  process: function () {
    var me = this,
      groups = me.getCorrespondingUserGroupsToResolve(me.group);

    me.loadedGroups = [];

    return {
      users: me.mergeIdenticalMembers(
        me.mergeArrays(
          me.resolveGroups(groups),
          me.getCorrespondingFixedUsers(me.group)
        )
      )
    }
  },

  getCorrespondingUserGroupsToResolve: function (group) {
    var me = this;

    return (me.knowledgeConfig.userGroups[group] || []).resolveGroups || [];
  },

  getCorrespondingFixedUsers: function (group) {
    var me = this;

    return ((me.knowledgeConfig.userGroups[group] || []).users || [])
      .map(function (user) {
        return typeof user == "string"
          ? sol.common.UserUtils.getUserInfos([user])
            .filter(function (userInfo) {
              return typeof userInfo == "object"
            })
            .map(function (userInfo) {
              return {
                id: Number(userInfo.id),
                name: String(userInfo.name)
              }
            })[0]
          : user;
      });
  },

  mergeArrays: function (arr1, arr2) {
    return arr1.concat(arr2);
  },

  resolveGroups: function (groups) {
    var me = this;

    return groups.map(me.resolveGroup.bind(me))
      .reduce(function (arr, users) {
        return arr.concat(Array.isArray(users) ? users : [users]);
      }, []);;
  },

  /**
   * Resolves a usergroup
   * @returns {Object}
   */
  resolveGroup: function (group) {
    var me = this,
      memberNames;

    // prevent loading a group twice
    if (me.loadedGroups.indexOf(group) == -1) {
      memberNames = me.getMemberNames(Array.isArray(group) ? group : [group]);
      me.loadedGroups.push(group);
    } else {
      return [];
    }

    return sol.common.UserUtils.getUserInfos(memberNames)
      .filter(function (member) {
        return typeof member === "object";
      })
      .filter(function(member) {
        // filter user which should not be shown in user list
        return ((member.getFlags2() || -1) & AccessC.FLAG2_VISIBLE_USER) != 0;
      })
      .reduce(function (acc, userInfo) {
        var userName = String(userInfo.name);
        return acc.concat(
          userInfo.type === UserInfoC.TYPE_GROUP
            ? me.resolveGroup(userName)
            : [{
              id: Number(userInfo.id),
              name: userName
            }]
        );
      }, []);
  },

  mergeIdenticalMembers: function (members) {
    var mergedMembers = members
      .reduce(function (acc, member) {
        if (!acc[member.id]) {
          acc[member.id] = member;
        }
        return acc;
      }, {})

    return Object.keys(mergedMembers)
      .map(function (key) {
        return mergedMembers[key];
      })
  },

  getMemberNames: function (groups) {
    var members = ixConnect.ix().getUserNames(groups, CheckoutUsersC.MEMBERS_OF_GROUP);

    return members
      .filter(function (member) {
        return typeof member === "object";
      })
      .map(function (member) {
        return String(member.name || "");
      });
  }
});

/**
 * @member sol.knowledge.ix.services.UserInfo
 * @method RF_sol_knowledge_service_UserInfo_ResolveGroup
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_UserInfo_ResolveGroup(iXSEContext, args) {
  var config, service, result;

  logger.enter("RF_sol_knowledge_service_UserInfo_ResolveGroup", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  service = sol.create("sol.knowledge.ix.services.UserGroup", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_knowledge_service_UserInfo_ResolveGroup", result);

  return result;
}