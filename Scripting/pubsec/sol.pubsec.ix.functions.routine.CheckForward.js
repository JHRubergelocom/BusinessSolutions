
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.pubsec.Utils.js
//@include lib_sol.pubsec.ix.ProcessUtils.js
//@include lib_sol.pubsec.ix.Routines.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.routine.CheckForward" });

/**
 * Checks if all preconditions for forwarding the dynamic routine are meet.
 *
 * This can be used as a workflow function or as a registered function.
 * In a workflow, this will throw an exception if the workflow can not be forwarded.
 * Called as registered function it will return a status object by default (behavior can be altered by configuration):
 *
 *     { allowed: true }  // check succeeded
 *     { allowed: false, reasons: ["MISSING_MANDATORY_SIGNINGS"] }  // check failed, with reasons
 *
 * Available reasons:
 *
 * - MISSING_MANDATORY_SIGNINGS
 * - MISSING_MANDATORY_DIRECTIVES
 * - BLOCKING_ACTIVE_SIGNINGS
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.Map
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.UserProfile
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.pubsec.ix.ProcessUtils
 * @requires sol.pubsec.ix.Routines
 */
sol.define("sol.pubsec.ix.functions.routine.CheckForward", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "throwing"],

  /**
   * @cfg {String} objId The objId of the process
   */

  /**
   * @cfg {String} flowId (optional) Either this or `routineId` will be used to determine the current routine
   */

  /**
   * @cfg {String} routineId (optional) Either this or `flowId` will be used to determine the current routine
   */

  /**
   * @cfg {Boolean} throwing Specifies whether the {@link #process} function returns a status or throws an exception
   */

  /**
   * @private
   * @property {Object} REASONS The available reasons
   */
  REASONS: {
    MISSING_MANDATORY_SIGNINGS: "MISSING_MANDATORY_SIGNINGS",
    MISSING_MANDATORY_DIRECTIVES: "MISSING_MANDATORY_DIRECTIVES",
    BLOCKING_ACTIVE_SIGNINGS: "BLOCKING_ACTIVE_SIGNINGS"
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);

    if (!config.flowId && (typeof config.routineId === "undefined")) {
      throw "Either 'flowId' or 'routineId' has to be defined";
    }

    if (typeof config.routineId !== "undefined" && typeof config.routineId !== "number") {
      throw "'routineId' has to be a number";
    }

    me.routineId = (typeof config.routineId === "number") ? config.routineId : sol.pubsec.ix.ProcessUtils.retrieveCurrentRoutineIdFromWorkflow(config.objId, config.flowId);

    me.$routines = sol.create("sol.pubsec.ix.Routines", {
      objId: me.objId,
      isTemplate: false
    });
  },

  /**
   * Checks if all preconditions for forwarding the dynamic routine are meet.
   * @return {String}
   */
  process: function () {
    var me = this,
        result = { allowed: true, reasons: [] },
        processSord = sol.common.RepoUtils.getSord(me.objId),
        signingCount, activeStep, isBlocking;

    signingCount = sol.pubsec.ix.ProcessUtils.getSigningCount(processSord);
    activeStep = me.$routines.retrieveActiveStep(me.routineId);
    isBlocking = (activeStep && activeStep.signing && (activeStep.signing.stop === true)) ? true : false;

    if (!me.allMandatorySigningsStarted(activeStep)) {
      result.allowed = false;
      result.reasons.push(me.REASONS.MISSING_MANDATORY_SIGNINGS);
      if (me.throwing === true) {
        throw "can not forwarded routine -> not all mandatory signings had been started";
      }
    }

    if (!me.allMandatoryDirectivesStarted(activeStep)) {
      result.allowed = false;
      result.reasons.push(me.REASONS.MISSING_MANDATORY_DIRECTIVES);
      if (me.throwing === true) {
        throw "can not forwarded routine -> not all mandatory directives had been started";
      }
    }

    if ((signingCount > 0) && (isBlocking === true)) {
      result.allowed = false;
      result.reasons.push(me.REASONS.BLOCKING_ACTIVE_SIGNINGS);
      if (me.throwing === true) {
        throw "can not forwarded routine -> there are active signings";
      }
    }

    return JSON.stringify(result);

  },

  /**
   * @private
   * Checks, if in currently active step, all as mandatory marked signings have been started.
   * @param {Object} activeStep
   * @return {Boolean}
   */
  allMandatorySigningsStarted: function (activeStep) {
    var signingList, i, max, signing;
    if (activeStep && activeStep.signing && activeStep.signing.signings) {
      signingList = activeStep.signing.signings;
      for (i = 0, max = signingList.length; i < max; i++) {
        signing = signingList[i];
        if ((signing.mandatory === true) && (!signing.flowId)) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * @private
   * Checks, if in currently active step, all as mandatory marked directives have been started.
   * @param {Object} activeStep
   * @return {Boolean}
   */
  allMandatoryDirectivesStarted: function (activeStep) {
    var directiveList, i, max, directive;
    if (activeStep && activeStep.directive && activeStep.directive.directives) {
      directiveList = activeStep.directive.directives;
      for (i = 0, max = directiveList.length; i < max; i++) {
        directive = directiveList[i];
        if ((directive.mandatory === true) && (!directive.flowId)) {
          return false;
        }
      }
    }
    return true;
  }

});

/**
 * @member sol.pubsec.ix.functions.routine.CheckForward
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var config, module;

  logger.enter("onExitNode_CheckForward", { flowId: wfDiagram.id, nodeId: nodeId });

  config = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  config.objId = wfDiagram.objId;
  config.flowId = wfDiagram.id;
  config.throwing = true;

  module = sol.create("sol.pubsec.ix.functions.routine.CheckForward", config);
  module.process();

  logger.exit("onExitNode_CheckForward");
}

/**
 * @member sol.pubsec.ix.functions.routine.CheckForward
 * @method RF_sol_pubsec_function_routine_CheckForward
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_pubsec_function_routine_CheckForward(ec, configAny) {
  var config, module;

  logger.enter("RF_sol_pubsec_function_routine_CheckForward", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId", "routineId");
  config.throwing = (config.throwing === true) ? true : false;

  module = sol.create("sol.pubsec.ix.functions.routine.CheckForward", config);

  logger.exit("RF_sol_pubsec_function_routine_CheckForward");

  return module.process();
}
