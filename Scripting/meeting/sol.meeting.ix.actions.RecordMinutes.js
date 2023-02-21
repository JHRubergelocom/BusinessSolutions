importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ConnectionUtils.js
//@include lib_sol.common.ix.ActionBase.js
/**
 *
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.ActionBase
 */
sol.define("sol.meeting.ix.actions.RecordMinutes", {
  extend: "sol.common.ix.ActionBase",

  requiredConfig: ["objId", "minutes"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
    me.userConnection = sol.common.IxConnectionUtils.getConnection();
  },

  process: function () {
    var me = this,
      language = me.userConnection.loginResult.clientInfo.language;

    try {

      me.requireUserRights(me.objId, { rights: { w: true } });

      me.writeMinutes();
      me.storeTimestamp();

      me.addFeedbackEvent("sol.meeting.item.feedback.recordminutes", language);
    } catch (ex) {
      me.logger.error(["Could not record minutes for item objId={0}", me.objId], ex);
      throw ex;
    }
  },

  storeTimestamp: function () {
    var me = this;

    sol.common.IxUtils.execute("RF_sol_function_IsoDate", {
      objId: me.objId,
      group: "MEETING_ITEM_MINUTES_LASTEDITED",
      adjustToConnectionTimeZone: true
    });

  },

  writeMinutes: function () {
    var me = this, blobMapValue;
    blobMapValue = new MapValue((new java.lang.String("MEETING_ITEM_MINUTES")), (new FileData("text/plain", (new java.lang.String(me.minutes)).getBytes(java.nio.charset.StandardCharsets.UTF_8))));
    me.userConnection.ix().checkinMap("formdata", me.objId, me.objId, [blobMapValue], LockC.NO);
  },

  getName: function () {
   return "RecordMinutes";
  }

});

/**
 * @member sol.meeting.ix.actions.RecordMinutes
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_RecordMinutes(iXSEContext, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      action, result;

  action = sol.create("sol.meeting.ix.actions.RecordMinutes", params);
  result = action.execute();
  return result;
}
