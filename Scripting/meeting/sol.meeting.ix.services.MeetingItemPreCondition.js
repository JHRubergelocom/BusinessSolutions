
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.Utils.js

var logger = sol.create("sol.Logger", {
  scope: "RF_sol_meeting_service_MeetingItemPrecondition"
});


/**
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.Utils
 *
 * @author MHe (ELO Digital Office GmbH)
 */
sol.define("sol.meeting.services.MeetingItemPrecondition", {
  extend: "sol.common.ix.ServiceBase",
  mixins: ["sol.common.mixins.Inject"],
  inject: {
    sord: { sordIdFromProp: "targetId" }
  },

  process: function () {
    var me = this, preconditionResult,
        params = {
          targetId: me.targetId,
          conditions: [],
          notAllowedMessage: "sol.meeting.proposals.preconditions.createMeetingItem.notAllowed"
        };

    // Checks whether we have a meeting object
    // Only in this case we want to define special conditions
    // otherwise we call it with empty conditions and it should
    // always return true. We call it here anyway because of the
    // precondition result interface. So this class doesn't need
    // to handle precondition result interface
    if (sol.meeting.Utils.isMeeting(me.sord)) {
      // TODO:implement meeting context environment
      params.conditions = [
        { prop: "objKeys.MEETING_STATUS", value: "A -*" }
      ];
    } else {
      me.logger.info(["skip precondition, because agenda item is not registered to meeting directly"]);
    }

    try {
      //TODO: This call should be encapsulate in a common helper class
      me.logger.info(["preconditions params {0}", params]);
      preconditionResult = sol.common.IxUtils.execute(
        "RF_sol_common_service_StandardPreconditions",
        params
      );

      if (me.$debug) {
        // add params to debug easier
        // define props explicitly to hide critical props like adminTicket
        preconditionResult.params = {
          targetId: params.targetId,
          conditions: params.conditions
        };
      }
    } catch (ex) {
      logger.error("could not execute precondition function", ex);
      // we have some technical issues here, so elo doesn't work correctly properly
      // TODO: precondition object result should not be defined here
      preconditionResult = {
        valid: false,
        msg: "Could not execute precondition function"
      };

      if (me.$debug) {
        preconditionResult.detailMessage = ex;
      }
    }

    return preconditionResult;
  }
});


/**
* @method RF_sol_meeting_service_CreateMeetingItemPrecondition
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_CreateMeetingItemPrecondition(context, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "targetId"),
      result = sol.create("sol.meeting.services.MeetingItemPrecondition", params).process();
  return sol.common.JsonUtils.stringifyQuick(result);
}
