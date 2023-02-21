importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * @author ELO Digital Office GmbH
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.mixins.Configuration
 *
 */
sol.define("sol.meeting.ix.services.GetCurrentUserRoles", {
  extend: "sol.common.ix.ServiceBase",
  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    roles: { config: "meeting", prop: "entities.meeting.roles.availableRoles" }
  },

  process: function () {
    var me = this, currentUser, roles;

    currentUser = sol.common.UserUtils.getCurrentUserInfo();

    if (Array.isArray(me.roles)) {
      roles = me.roles
        .filter(function (role) {
          return sol.common.UserUtils.isInGroup(role.name);
        });
    }

    return {
      currentUser: {
        userId: String(currentUser.id),
        userName: String(currentUser.name),
        roles: roles
      }
    };

    // 1. Current User holen (UserInfo (userId, userName))
    // 2. Iteration über availableRoles
    // 3. Prüfen ist der aktuelle User in der Rolle x
    // 4. Rückgabe
    /*
    Request
    {
      checkRoles: [{name: "sol.meeting."}]
    }
    Response
    *  currentUser: {
          userId: 0,
          userName: "Administration",
          roles: [{name: "sol.meeting.roles.Organizer"}]
       }
    */
  }
});

/**
* @member sol.meeting.ix.services.GetCurrentUserRoles
* @method RF_sol_meeting_service_GetCurrentUserRoles
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetCurrentUserRoles(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service = sol.create("sol.meeting.ix.services.GetCurrentUserRoles", rfParams),
   result = service.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}