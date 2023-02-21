importPackage(Packages.de.elo.ix.client);


//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js

/**
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.TemplateSordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.RepoUtils
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.ix.RfUtils
 * @requires sol.meeting.ix.MeetingItemRepository
 */
sol.define("sol.meeting.ix.services.WithdrawMeetingItem", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["objId"],

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    sord: { sordIdFromProp: "objId", optional: false },
    itemOutput: { config: "meetingItem", prop: "meetingItem.outputs.itemWithdraw", template: false }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = config;
  },

  process: function () {
    var me = this, link, actionResult;
    link = me.getLink();
    if (link) {
      if (!sol.common.RepoUtils.isRepoId(link)) {
        throw Error("Withdraw Meeting Item: link is invalid");
      }
      if (sol.common.RepoUtils.isGuid(link)) {
        me.config = me.setObjIdToLinkedItem(link);
      }
    }
    actionResult = sol.common.IxUtils.execute('RF_sol_common_action_Standard', me.config);
    return actionResult;
  },
  
  getLink: function () {
    var me = this;
    return sol.common.TemplateSordUtils.getObjKey(me.sord, "MEETING_ITEM_LINK");
  },

  setObjIdToLinkedItem: function (link) {
    var me = this, linkedSordObjId;
    me.config = me.config || {};
    linkedSordObjId = me.getMeetingItemIDByLink(link);
    if (!linkedSordObjId) {
      throw Error("Missing meeting item id");
    }
    me.config.objId = linkedSordObjId;
    return me.config;
  },

  getMeetingItemIDByLink: function (link) {
    var me = this, meetingItem;
    meetingItem = sol.meeting.ix.MeetingItemRepository.findMeetingItem(link, me.itemOutput, "meeting-item-withdraw");
    if (meetingItem.get("deleted") === "true") {
      me.logger.warn(["Linked meeting item has been deleted= '{0}'", link]);
    }
    return meetingItem.get("id");
  }

});

/**
 * @member sol.meeting.ix.service.WithdrawMeetingItem
 * @method
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_meeting_service_WithdrawMeetingItem(ec, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId"),
      service, result;
  service = sol.create("sol.meeting.ix.services.WithdrawMeetingItem", params);
  result = service.process();
  return sol.common.JsonUtils.stringifyAll(result);
}
