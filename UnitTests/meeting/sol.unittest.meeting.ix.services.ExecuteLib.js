
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.Utils.js
//@include lib_sol.meeting.note.ix.NoteUtils.js
//@include lib_sol.meeting.ix.AgendaScheduler.js
//@include lib_sol.meeting.ix.ExecutionProcessor.js
//@include lib_sol.meeting.ix.Meeting.js
//@include lib_sol.meeting.ix.MeetingBoardUtils.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js
//@include lib_sol.meeting.ix.MeetingRepository.js
//@include lib_sol.meeting.ix.ProposalTypeActions.js
//@include lib_sol.meeting.ix.ProposalUtils.js
//@include lib_sol.meeting.ix.RuleEngineExecutionProcessor.js
//@include lib_sol.meeting.ix.RuleEngineJsonParser.js
//@include lib_sol.meeting.ix.RuleEngineNode.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.meeting.ix.services.ExecuteLib" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_meeting_service_ExecuteLib', {
 *       className: 'sol.meeting.Utils',
 *       classConfig: {}
 *       method: 'getPathOfUsersPersonnelFile',
 *       params: [["Administrator", {}]]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.meeting.ix.services.ExecuteLib", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        cls, func;

    switch (me.className) {
      case "sol.meeting.ix.Meeting":
        switch (me.method) {
          case "initialize":
          case "validateAndGet":
          case "getReference":
          case "getItemsFolder":
          case "getTasksFolder":
          case "getFormattedSord":
          case "getAccessRights":
            return result;
          default:
        }
        break;
      case "sol.meeting.task.ix.Task":
      case "sol.meeting.voting.ix.Voting":
        switch (me.method) {
          case "initialize":
          case "validateAndGet":
          case "checkPermissions":
            return result;
          default:
        }
        break;
      case "sol.meeting.task.ix.Tasks":
      case "sol.meeting.voting.ix.Votings":
        switch (me.method) {
          case "get":
          case "updateDesc":
            return result;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.meeting.ix.AgendaScheduler":
        switch (me.method) {
          case "calculateItem":
          case "calculateEndTime":
            me.params[0] = sol.common.DateUtils.isoToMoment(me.params[0]);
            break;
          default:
        }
        break;
      case "sol.meeting.ix.ExecutionProcessor":
      case "sol.meeting.ix.RuleEngineExecutionProcessor":
      case "sol.meeting.ruleengine.PropertyExistNode":
      case "sol.meeting.ruleengine.PropertyNotExistNode":
      case "sol.meeting.ruleengine.EqualsOperatorNode":
      case "sol.meeting.ruleengine.NotEqualsOperatorNode":
      case "sol.meeting.ruleengine.StartsWithsOperatorNode":
        switch (me.method) {
          case "process":
          case "executeCallback":
            return result;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

/**
 * @member sol.unittest.meeting.ix.services.ExecuteLib
 * @method RF_sol_unittest_meeting_service_ExecuteLib
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_meeting_service_ExecuteLib(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_meeting_service_ExecuteLib", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.meeting.ix.services.ExecuteLib", params);
  result = service.process();
  logger.exit("RF_sol_unittest_meeting_service_ExecuteLib", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

function RF_sol_unittest_meeting_service_Test(ec, args) {
  return "{}";
}