
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js

/**
 * Given an array of user and groupnames, returns an object of users expanded from groups
 * { "Karl Tester": ["HR", "Management"] }
 *
 * If an object as returned by this service is passed to the service as `history` parameter, it will
 * return a new set containing all old users and new users combined.
 *
 * If the parameter `diff: true` is passed, only the diff from the object passed as `history` and
 * the new users objects will be returned.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 */
sol.define("sol.learning.ix.services.GetUsers", {
  extend: "sol.common.ix.ServiceBase",

  getGroupMembers: function (group) {
    var members;
    members = ixConnect.ix().getUserNames([group], CheckoutUsersC.MEMBERS_OF_GROUP);
    return Array.prototype.slice.call(members)
      .map(function (member) {
        return String((typeof member === "object" ? member : {}).name || "");
      });
  },

  expandGroup: function (group, users) {
    var me = this, members;
    members = me.getGroupMembers(group);
    me.collectUsers(members, users, group); // recursive
  },

  addUser: function (users, name, group) {
    var groups = users[name] || (users[name] = []);
    group && !~groups.indexOf(group) && groups.push(group);
  },

  collectUsers: function (requested, users, group) {
    var me = this, userInfos;
    userInfos = sol.common.UserUtils.getUserInfos(requested);
    (Array.prototype.slice.call(userInfos))
      .forEach(function (userInfo) {
        var info = typeof userInfo === "object" ? userInfo : {},
            name = String(info.name || ""),
            isGroup = info.type === UserInfoC.TYPE_GROUP;

        isGroup ? me.expandGroup(name, users) : me.addUser(users, name, group);
      });
  },

  diffUsers: function (users, history) {
    function arraysEqual(a, b) {
      function arrayElementPresent(el) {
        return ~b.indexOf(el);
      }
      return (a.length === b.length) && a.every(arrayElementPresent);
    }
    function combineArrays(a, b) {
      var small = (a.length > b.length ? b : a), big = (small === a ? b : a);
      small
        .forEach(function (el) {
          ~big.indexOf(el) || big.push(el);
        });
      return big;
    }
    var filtered = {};
    Object.keys(users)
      .forEach(function (user) {
        if (history[user]) {
          if (!arraysEqual(history[user], users[user]) && users[user].length) {
            filtered[user] = combineArrays(history[user], users[user]);
          }
        } else {
          filtered[user] = users[user];
        }
      });
    return filtered;
  },

  process: function () {
    var me = this, expandedUsers = JSON.parse(sol.common.JsonUtils.stringifyQuick(me.history || {}));
    me.collectUsers(Array.isArray(me.users) ? me.users : [me.users], expandedUsers);
    return me.diff ? me.diffUsers(expandedUsers, me.history) : expandedUsers;
  }
});

/**
 * @member sol.learning.ix.services.GetUsers
 * @method RF_sol_learning_service_GetUsers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetUsers(iXSEContext, args) {
  var rfParams, result;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  result = (sol.create("sol.learning.ix.services.GetUsers", rfParams)).process();
  return sol.common.JsonUtils.stringifyQuick(result);
}