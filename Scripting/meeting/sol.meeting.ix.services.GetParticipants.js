importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.MeetingRepository.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetParticipants" });

/**
* Retrieves participants of a meeting
*
* ### Example
*
*   {
*     id: "BS-1"
*   }
*
* @eloix
* @requires sol.common.IxUtils
* @requires sol.common.Injection
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.meeting.mixins.Configuration
* @requires sol.meeting.ix.MeetingRepository
*/
sol.define("sol.meeting.ix.services.GetParticipants", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    outputCfg: { config: "meeting", prop: "entities.meeting.outputs.participant" }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    if (me.output && !me.optimizationName) {
      throw Error("If you use your output yourself you have to set `optimizationName` ");
    }
  },

  process: function () {
    var me = this;
    try {
      return sol.meeting.ix.MeetingRepository.findParticipants(
        me.getId(),
        me.getOutput(),
        me.getOptimizationName(),
        me.getOptions());
    } catch (ex) {
      me.logger.error("An error occured in service `GetParticipants`", ex);
      throw ex;
    }
  },

  getId: function () {
    var me = this;
    return me.id;
  },

  getOutput: function () {
    var me = this;
    return me.output || me.outputCfg;
  },

  getOptimizationName: function () {
    var me = this;
    return me.optimizationName || "participants";
  },

  getOptions: function () {
    var me = this;
    return me.options || {};
  }
});


/**
* @member sol.meeting.ix.services.GetParticipants
* @method RF_sol_meeting_service_GetParticipants
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetParticipants(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      getProposalTypesService = sol.create("sol.meeting.ix.services.GetParticipants", rfParams),
      result = getProposalTypesService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}