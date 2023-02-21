
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Schedule a meeting
 *
 * # Example as a workflow node
 *
 *
 * # Example as a IX function call
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.ScheduleMeeting", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this, flowId, wfOptions = me.workflow || { prio: undefined },
      defaultWorkflow = "sol.meeting.ScheduleMeetingHeadless",
      workflowName = "Schedule Meeting";
    try {
      flowId = me.startWorkflow(wfOptions.name || defaultWorkflow,
        wfOptions.title || workflowName, me.objId, wfOptions.prio);
      return {
        code: "success",
        message: "schedule meeting workflow started",
        data: {
          objId: me.objId, flowId: flowId, workflow: wfOptions
        }
      };
    } catch (ex) {
      me.logger.error("could not start workflow", ex);
      throw ex;
    }
  },

  startWorkflow: function (workflowId, workflowName, objId, prio) {
    return sol.common.WfUtils.startWorkflow(workflowId, workflowName, objId, prio);
  }
});



/**
 * @member sol.meeting.ix.functions.ScheduleMeeting
 * @method RF_sol_meeting_function_ScheduleMeeting
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_ScheduleMeeting(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId");
  fun = sol.create("sol.meeting.ix.functions.ScheduleMeeting", rfArgs);
  return JSON.stringify(fun.process());
}
