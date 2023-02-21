
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * ELOas workflow controller.
 *
 * This class handles ELO AS functions. Functions must be a subclass of sol.common.as.FunctionBase.
 *
 * ELO AS functions can be used as workflow nodes. Compared to Index Server functions, there's no script that can be called.
 * Therefore a direct rule is called by this controller. The required rule must be passed as a param in the workflows node description field.
 *
 * # Sample node configuration:
 *
 *     {
 *       "$directRule": "sol.common.as.functions.MyFunction",
 *       "doSth": "like this"
 *     }
 *
 * # Controller functions
 * Instead of a direct rule, the `WfController` can use a `$controllerFunction`.
 * Currently only  {@link #wait} is supported.
 *
 * # Forwarding behavior
 * If the controller calls a direct function, the return value of this function will affect the forwarding behavior.
 *
 * To forward to the next node (if there are more than one that will be the first one) the direct rule has to return
 *
 *     { passOn: true }
 *
 * To prevent the forwarding the direct rule has to return
 *
 *     { passOn: false }
 *
 * If all successor nodes should be activated the result has to be
 *
 *     { passOn: { all: true } }
 *
 * If the forwarding should happen to specific successor nodes this could be defined by the following result
 *
 *     { passOn: { nodes: [] } }
 *
 * The nodes list has to contain strings. Those could be node translation keys, names or ids.
 *
 * If the controller uses a `$controllerFunction` check the specific function for forwarding configuration (e.g. {@link #wait}).
 *
 * # Delay workflows (since 1.05.000)
 * To take some load of the `WfController` (in systems with a lot of active workflows) those wokflows could be delayed, and therefore the `WfController` ignores them.
 *
 * To activate this in general the node has do define a `useDelay` property and set that to `true`.
 *
 * There are several ways do specify the delay:
 *
 * - The controller function `wait` can define a check intervall (see {@link #wait})
 * - The controller function `wait` can delay until the check date is reached (see {@link #wait})
 * - A direct rule can define a return property `delayDateIso` to delay the next execution until that date
 *
 * **Delay the workflow with direct rule result**
 *
 * Node configuration:
 *
 *     {
 *       "$directRule": "sol.common.as.functions.MyFunction",
 *       "useDelay": true
 *     }
 *
 * Result of `sol.common.as.functions.MyFunction`:
 *
 *     { passOn: false, delayDateIso: "20181231120000" }
 *
 * This will delay the next execution until 12 o'clock on December, 31 2018.
 * The delay is just applied if `passOn` is not `true` and if the node configuration defines `useDelay=true`.
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloas
 *
 * @requires sol.common.Config
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.as.Utils
 *
 */
sol.define("sol.common.as.WfController", {
  singleton: true,

  requiredAsVersion: "9.03.006",

  solutionAsConfigs: [],

  /**
   * Runs workflow rules
   */
  run: function () {

    var me = this,
        currentVersion, versionCheckResult,
        nodeConfig, resultObj, tplSord;

    if (!me.logger) {
      me.logger = sol.create("sol.Logger", { scope: "sol.common.as.WfController" });
    }

    if (!me.versionChecked) {
      if (!sol.common.as.Utils.isDebugger()) {
        currentVersion = sol.common.as.Utils.getAsVersion();
        versionCheckResult = sol.common.RepoUtils.checkVersion(currentVersion, me.requiredAsVersion);
        if (!versionCheckResult) {
          me.logger.warn("ELOas version " + me.requiredAsVersion + " or higher is required.");
          return;
        }
      }
      me.versionChecked = true;
    }

    me.logger.enter("WfController.run", { flowName: EM_WF_NODE.flowName + "", flowId: EM_WF_NODE.flowId + "", nodeName: EM_WF_NODE.nodeName + "" });

    nodeConfig = me.getNodeConfig();
    if (!nodeConfig) {
      me.logger.info(["Skipping node \"{0}\" (flowName={1}, flowId={2}). No configuration given.", EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId]);
      me.logger.exit("WfController.run");
      return;
    }

    if (!nodeConfig.$directRule && !nodeConfig.$controllerFunction) {
      me.logger.info(["Skipping node \"{0}\" (flowName={1}, flowId={2}). Node has no direct rule or controller function configuration.", EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId]);
      me.logger.exit("WfController.run");
      return;
    }

    if (nodeConfig.$directRule) {
      resultObj = me.handleDirectRule(nodeConfig);
    }

    if (me.logger.debugEnabled) {
      tplSord = sol.common.SordUtils.getTemplateSord(EM_ACT_SORD).sord;
      me.logger.debug("tplSord=" + JSON.stringify(tplSord));
    }

    if (nodeConfig.$controllerFunction) {
      resultObj = me.handleControllerFunction(nodeConfig);
    }

    if (resultObj) {
      if (nodeConfig.debug) {
        EM_WF_NEXT = "";
        me.logger.debug(["Debug mode - don't pass on: EM_WF_NODE = \"\""]);
      } else {
        me.dispatch(resultObj, nodeConfig);
        me.writeWfChanges(resultObj, nodeConfig);
      }
    }

    me.logger.exit("WfController.run");
  },

  /**
   * @private
   * Handle execution of direct rules
   * @param {Object} nodeConfig
   * @return {Object}
   */
  handleDirectRule: function (nodeConfig) {
    var me = this,
        executionParams = {},
        logExecutionParams = {},
        wfDiagram, result, resultObj;

    if (!ruleExecutor.hasDirectRule(nodeConfig.$directRule)) {
      me.handleException("Direct rule '" + nodeConfig.$directRule + "' not found.");
      return;
    }

    wfDiagram = ixConnect.ix().checkoutWorkFlow(String(EM_WF_NODE.flowId), WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.NO);
    sol.common.WfUtils.checkMainAdminWf(wfDiagram);

    me.logger.debug(["Execute direct rule: directRule={0}, nodeName={1}, flowName={2}, flowId={3}", nodeConfig.$directRule, EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId], nodeConfig);

    nodeConfig.EM_WF_NODE = {
      nodeName: String(EM_WF_NODE.nodeName),
      flowName: String(EM_WF_NODE.flowName),
      flowId: String(EM_WF_NODE.flowId),
      objId: String(EM_WF_NODE.objId),
      workflowOwnerName: String(EM_WF_NODE.workflowOwnerName)
    };

    executionParams.ticket = ixConnect.loginResult.clientInfo.ticket + "";
    logExecutionParams.ticket = executionParams.ticket.substr(0, 10) + "...";
    executionParams.language = ixConnect.loginResult.clientInfo.language + "";
    executionParams.timeZone = ixConnect.loginResult.clientInfo.timeZone + "";

    if (!executionParams.timeZone) {
      executionParams.timeZone = java.time.ZoneId.systemDefault().toString() + "";
    }

    result = ruleExecutor.runDirectRule(nodeConfig.$directRule, EM_ACT_SORD.id, JSON.stringify(nodeConfig), JSON.stringify(executionParams));

    me.logger.debug(["Direct rule result: {0}", result]);

    if (!result || result == "undefined") {
      me.handleException("Direct rule result is empty");
      return;
    }

    if (result) {
      if (result.indexOf("Ruleset not found") == 0) {
        me.handleException("Direct rule not found");
        return;
      }
      try {
        resultObj = JSON.parse(result);
      } catch (ex) {
        me.handleException("Can't parse direct rule result");
        return;
      }
      if (resultObj && resultObj.exception) {
        me.handleException("Direct rule exception: " + resultObj.exception);
        return;
      }

      return resultObj;
    }
  },

  /**
   * @private
   * Handle execution of controller function
   * @param {Object} nodeConfig
   * @return {Object}
   */
  handleControllerFunction: function (nodeConfig) {
    var me = this,
        controllerFunctionName, controllerFunction, resultObj;

    controllerFunctionName = nodeConfig.$controllerFunction;
    controllerFunction = me[controllerFunctionName];
    if (!controllerFunction) {
      me.handleException("Controller function '" + controllerFunctionName + "' not found.");
      return;
    }

    me.logger.debug(["Execute controller function: controllerFunction={0}, nodeName={1}, flowName={2}, flowId={3}", controllerFunctionName, EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId], nodeConfig);
    try {
      resultObj = controllerFunction.call(me, nodeConfig);
    } catch (ex) {
      me.handleException("Exception in controller function: " + sol.common.ExceptionUtils.parseException(ex));
      return;
    }

    if (!resultObj) {
      me.handleException("Controller function '" + controllerFunctionName + "' must provide a result.");
      return;
    }
    me.logger.debug(["Controller function result: {0}", JSON.stringify(resultObj)]);

    return resultObj;
  },

  /**
   * @private
   * Get node configuration
   * @return {Object} Node configuration
   */
  getNodeConfig: function () {
    var me = this,
        nodeConfigString, nodeConfig, jsonEndPos, properties, comment;

    properties = EM_WF_NODE.properties + "";
    comment = EM_WF_NODE.nodeComment + "";

    nodeConfigString = properties || comment;
    try {
      if (nodeConfigString) {
        if ((nodeConfigString.length > 1) && (nodeConfigString.charAt(0) == "{")) {
          jsonEndPos = nodeConfigString.lastIndexOf("}");
          nodeConfigString = nodeConfigString.substring(0, jsonEndPos + 1);
        }
        nodeConfig = sol.common.ConfigMixin.mergeConfiguration(nodeConfigString);
        nodeConfig.objId = EM_ACT_SORD.id;
        nodeConfig.flowId = EM_WF_NODE.flowId;
        nodeConfig.nodeId = EM_WF_NODE.nodeId;
      } else {
        me.logger.info(["Node configuration is empty: nodeName={0}, flowName={1}, flowId={2}", EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId]);
        me.logger.debug(["wfNode.properties={0}", properties]);
        me.logger.debug(["wfNode.comment={0}", comment]);
      }
    } catch (ex) {
      me.logger.info(["Can't parse node configuration: nodeName={0}, flowName={1}, flowId={2} exception={3})", EM_WF_NODE.nodeName, EM_WF_NODE.flowName, EM_WF_NODE.flowId, ex]);
      me.logger.debug(["wfNode.properties={0}", properties]);
      me.logger.debug(["wfNode.comment={0}", comment]);
    }

    return nodeConfig;
  },

  /**
   * @private
   * Handles the workflow forwarding.
   * @param {Object} resultObj The result of either the controller function or the direct rule
   * @param {Object} nodeConfig The configuration of the current node
   */
  dispatch: function (resultObj, nodeConfig) {
    var me = this,
        nextNodes;

    if (resultObj.passOn === true) {
      nextNodes = nodeConfig.nextNode || "0";
    } else if (resultObj.passOn && (resultObj.passOn.all === true)) {
      nextNodes = me.getNextNodes();
    } else if (resultObj.passOn && resultObj.passOn.nodes) {
      nextNodes = me.getNextNodes({ nodes: resultObj.passOn.nodes });
    }

    if (nextNodes) {
      EM_WF_NEXT = nextNodes;
    }

  },

  /**
   * @private
   * Writes changes to the workflow. Currently only `delayDateIso` is supported.
   * @param {Object} resultObj The result of either the controller function or the direct rule
   * @param {String} resultObj.delayDateIso The date till wich the workflow should be delayed.
   * @param {Object} nodeConfig The configuration of the current node
   */
  writeWfChanges: function (resultObj, nodeConfig) {
    var wf, idx, currentNode;
    if (resultObj && resultObj.delayDateIso && nodeConfig.useDelay) {
      wf = ixConnect.ix().checkoutWorkFlow(String(EM_WF_NODE.flowId), WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.NO);
      for (idx = 0; idx < wf.nodes.length; idx++) {
        currentNode = wf.nodes[idx];
        if (EM_WF_NODE.nodeId === currentNode.id) {
          currentNode.userDelayDateIso = resultObj.delayDateIso;
        }
      }
      ixConnect.ix().checkinWorkFlow(wf, WFDiagramC.mbAll, LockC.NO);
    }
  },

  /**
   * @private
   * Determines the follow up nodes.
   * @param {Object} params (optional)
   * @param {String[]} params.nodes (optional) If set, it will be used to determine the following node IDs. This array could contain node names, translation keys or IDs.
   * If the parameter is not set, all successor nodes will be returned.
   * @return {String} Comma separated list of node IDs
   */
  getNextNodes: function (params) {
    var me = this,
        wfEditNode, successorNodes, idx, successorNodeIndexes, currentSuccNode, i, nodeFilter, successorNodeIndexesString;

    wfEditNode = ixConnect.ix().beginForwardWorkflowNode(EM_WF_NODE.flowId, EM_WF_NODE.nodeId, new BeginForwardWorkflowNodeInfo(), LockC.NO);
    successorNodes = wfEditNode.succNodes;

    if (successorNodes && (successorNodes.length > 0)) {
      successorNodeIndexes = [];
      for (idx = 0; idx < successorNodes.length; idx++) {
        if (!params || !params.nodes || (params.nodes.length <= 0)) {
          successorNodeIndexes.push(idx);
        } else { // filter for specific nodes
          currentSuccNode = successorNodes[idx];
          for (i = 0; i < params.nodes.length; i++) {
            nodeFilter = params.nodes[i];
            if (nodeFilter == currentSuccNode.nameTranslationKey || nodeFilter == currentSuccNode.name || nodeFilter == currentSuccNode.id) {
              successorNodeIndexes.push(idx);
            }
          }
        }
      }
    }

    if (successorNodeIndexes && (successorNodeIndexes.length > 0)) {
      successorNodeIndexesString = successorNodeIndexes.join(sol.common.RepoUtils.pilcrow);
    } else {
      me.logger.warn("No successor nodes found. Forward to first node.");
      successorNodeIndexesString = "0";
    }

    return successorNodeIndexesString;
  },

  /**
   * @private
   * Handle an exception
   * @param {String|Exception} ex
   */
  handleException: function (ex) {
    var me = this,
        errorUser = "",
        nodeConfig, errorMessage, wfDiagram, wfNode;

    nodeConfig = me.getNodeConfig() || {};

    errorMessage = sol.common.ExceptionUtils.parseException(ex);

    if (nodeConfig.debug) {
      me.logger.debug(["Debug mode - don't change user"]);
    } else if (nodeConfig.errorNode) {
      EM_WF_NEXT = nodeConfig.errorNode;
    } else {
      errorUser = nodeConfig.errorUser || "0";
    }

    if (errorUser) {
      wfDiagram = sol.common.WfUtils.getWorkflow(EM_WF_NODE.flowId);
      wfNode = sol.common.WfUtils.getNodeById(wfDiagram, EM_WF_NODE.nodeId);
      sol.common.WfUtils.changeNodeUser(wfNode, errorUser);
      ixConnect.ix().checkinWorkFlow(wfDiagram, WFDiagramC.mbAll, LockC.NO);
    }

    me.logger.warn(["Error: " + errorMessage + ": objId={0}, flowName={1}, flowId={2}, nodeName={3}, directRule={4}, nodeConfig={5}, errorUser={6}",
      EM_ACT_SORD.id, EM_WF_NODE.flowName, EM_WF_NODE.flowId, EM_WF_NODE.nodeName, nodeConfig.$directRule || "", JSON.stringify(nodeConfig), errorUser]);
  },

  /**
   * Wait
   *
   * Node configuration examples:
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "INVOICE_DATACOLLECTION",
   *       "fieldValue": "DocXtractor"
   *     }
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "INVOICE_STATUS",
   *       "fieldValueStartsWith": "7"
   *     }
   *
   * Only forwards an entry when the date defined in GRP-field "FORWARDING_DATE" is reached.
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "FORWARDING_DATE",
   *       "waitUntil": true
   *     }
   *
   * Instead of a boolean value, `waitUntil` also accepts an integer. This integer is an offset in hours from the date which was
   * read from the GRP field. (days start at 00:00)
   *
   * The default forwarding behavior, in case of more then one successor node, is to forward to the first one.
   * To forward to all successor nodes, an additionall parameter `forwardToAll` has to be defined
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "INVOICE_DATACOLLECTION",
   *       "fieldValue": "DocXtractor",
   *       "forwardToAll": true
   *     }
   *
   * Instead of forwarding to the first or all nodes there could be a configuration to forward to specific nodes depending on a field value.
   * The `forwardToNodes` parameter has an array with node configurations
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "INVOICE_STATUS",
   *       "forwardToNodes": [
   *         { "node": "Error", "fieldValue": "DECLINED" },
   *         { "node": "Exported", "fieldValueStartsWith": "7" },
   *         { "node": "ExportedConditionally", "fieldValueStartsWith": "8" }
   *       ]
   *     }
   *
   * This configuration shows the following cases:
   *
   * - value of the field 'INVOICE_STATUS' is 'DECLINED' the workflow gets forwarded to the successor node 'Error' => `{ passOn: { nodes: ["Error"] } }`
   * - value of the field 'INVOICE_STATUS' starts with '7' the workflow gets forwarded to the successor node 'Exported' => `{ passOn: { nodes: ["Exported"] } }`
   * - value of the field 'INVOICE_STATUS' starts with '8' the workflow gets forwarded to the successor node 'ExportedConditionally' => `{ passOn: { nodes: ["ExportedConditionally"] } }`
   *
   * The property 'node' could either be the translation key, the name or the id of the successor node.
   *
   * The `wait` function supports the delay of workflows. This can be used to take some load of the `WfController`, if there are a lot of active workflows in the system.
   * There are several ways to delay a workflow.
   *
   * If `waitUntil` is used the workflow can be delayed to the specified date.
   * *Use carefully: if the date field changes to an earlier date, the workflow stays suspended till the former specified date.*
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "FORWARDING_DATE",
   *       "waitUntil": true,
   *       "useDelay": true
   *     }
   *
   * This will delay the workflow till the date specified in FORWARDING_DATE.
   *
   * `useDelay` can also be used to specify a new check intervall. If specified, the WfController will check this specific workflow in longer intervalls as usual.
   * *Use carefully: if you specify a relative short intervall (like e.g. 1 minute) the overhead of delaying the workflow over and over again will be greater then the time the actual check would take.*
   *
   *     {
   *       "$controllerFunction": "wait",
   *       "fieldName": "INVOICE_DATACOLLECTION",
   *       "fieldValue": "DocXtractor",
   *       "useDelay": true,
   *       "intervall": { "hours": 1 }
   *     }
   *
   * This will delay each next check for one hour.
   * For syntax of `intervall` see [moment.js/add (object literal)](https://momentjs.com/docs/#/manipulating/add/).
   *
   * @param {Object} nodeConfig Node configuration
   * @return {Object} result
   */
  wait: function (nodeConfig) {
    var me = this,
        forwardingCfg = { passOn: false },
        value, succNodes;

    if (nodeConfig.fieldName) {
      value = sol.common.SordUtils.getObjKeyValue(EM_ACT_SORD, nodeConfig.fieldName);

      if (nodeConfig && (nodeConfig.forwardToAll === true) && me.checkCondition(value, nodeConfig)) {
        // forward to all successor nodes
        forwardingCfg.passOn = { all: true };
      } else if (nodeConfig && nodeConfig.forwardToNodes) {
        // forward to specific successor nodes
        succNodes = me.determinePassOnNodes(value, nodeConfig);
        forwardingCfg.passOn = (succNodes && (succNodes.length > 0)) ? { nodes: succNodes } : false;
      } else if (me.checkCondition(value, nodeConfig)) {
        // forward to first successor node
        forwardingCfg.passOn = true;
      }
    }

    // only set possible delay the workflow if passOn is not true yet
    if (!forwardingCfg.passOn && nodeConfig.useDelay) {
      if (nodeConfig.waitUntil) {
        forwardingCfg.delayDateIso = me.waitUntil(value, nodeConfig.waitUntil).waitUntilIso;
      } else if (nodeConfig.intervall) {
        forwardingCfg.delayDateIso = sol.common.DateUtils.dateToIso(moment().add(nodeConfig.intervall));
      }
    }

    return forwardingCfg;
  },

  /**
   * @private
   * @param {String} value Value to check
   * @param {Object} nodeConfig Node configuration
   * @return {String []}
   */
  determinePassOnNodes: function (value, nodeConfig) {
    var me = this,
        succNodes = [];

    if (nodeConfig && nodeConfig.forwardToNodes && (nodeConfig.forwardToNodes.length > 0)) {
      nodeConfig.forwardToNodes.forEach(function (nodeCondition) {
        if (me.checkCondition(value, nodeCondition)) {
          succNodes.push(nodeCondition.node);
        }
      });
    }

    return succNodes;
  },

   /**
   * Forward
   *
   * Immediately forwards a workflow. Best used to transfer service user rights to the following node.
   * 
   * Node configuration example:
   *
   *     {
   *       "$controllerFunction": "forward"
   *     }
   *
   * @return {Object} result
   */
  forward: function () {
    return { passOn: true };
  },

  waitUntil: function (value, waitDef) {
    var targetDate = sol.common.DateUtils.isoToDate(sol.common.DateUtils.dateToIso(sol.common.DateUtils.isoToDate(value), { startOfDay: true })),
        hours, waitUntilIso, nowIso, waitingTimeExceeded;

    if (sol.common.ObjectUtils.type((hours = +(waitDef)), "number")) {
      waitUntilIso = sol.common.DateUtils.dateToIso(moment(targetDate).add(hours, "hours"));
      nowIso = sol.common.DateUtils.nowIso();
    } else {
      waitUntilIso = sol.common.DateUtils.dateToIso(targetDate);
      nowIso = sol.common.DateUtils.nowIso({ startOfDay: true });
    }

    waitingTimeExceeded = (waitUntilIso <= nowIso);

    return {
      waitingTimeExceeded: waitingTimeExceeded,
      waitUntilIso: waitUntilIso
    };
  },

  /**
   * @private
   * @param {String} value Value to check
   * @param {Object} nodeConfig Node configuration
   * @return {Boolean}
   */
  checkCondition: function (value, nodeConfig) {
    var me = this;
    if (nodeConfig) {
      if (nodeConfig.fieldValue && (nodeConfig.fieldValue == value)) {
        return true;
      }
      if (nodeConfig.fieldValueStartsWith && value && (value.indexOf(nodeConfig.fieldValueStartsWith) == 0)) {
        return true;
      }
      if (nodeConfig.waitUntil && value) {
        return me.waitUntil(value, nodeConfig.waitUntil).waitingTimeExceeded;
      }
    }
    return false;
  }

});

var EM_WF_WITH_GROUP = true; // eslint-disable-line no-redeclare

/**
 * Patch for the ELOas standard library function ´doWorkflow´ to include tasks for groups
 */
bt.doWorkflow = function () {
  var idx = 0,
      result, fti, timeZone;

  timeZone = ixConnect.loginResult.clientInfo.timeZone + "";

  if (!timeZone) {
    timeZone = java.time.ZoneId.systemDefault().toString() + "";
    ixConnect.loginResult.clientInfo.timeZone = timeZone;
  }

  log.info("WfController: doWorkflow(): timeZone=" + ixConnect.loginResult.clientInfo.timeZone + ", callId=" + ixConnect.loginResult.clientInfo.callId);

  try {
    fti = new FindTasksInfo();
    fti.inclWorkflows = true;
    fti.lowestPriority = 2;
    fti.highestPriority = 0;

    fti.sordZ = (typeof EM_WF_SELECTOR !== "undefined") ? EM_WF_SELECTOR : null;
    fti.inclDeleted = (typeof EM_WF_WITH_DELETED !== "undefined") ? EM_WF_WITH_DELETED : false;
    fti.inclGroup = (typeof EM_WF_WITH_GROUP !== "undefined") ? EM_WF_WITH_GROUP : false;

    result = ixConnect.ix().findFirstTasks(fti, EM_SEARCHCOUNT);
    for (;;) {
      if (ruleset.getStop && ruleset.getStop()) {
        log.info("doWorkflow interrupted");
        return;
      }

      EM_TASKLIST = result.tasks;

      try {
        bt.processTaskList();
      } catch (ex2) {
        log.error("Error processing task list: " + ex2);
      }

      if (!result.moreResults) {
        break;
      }

      idx += EM_TASKLIST.length;
      result = ixConnect.ix().findNextTasks(result.searchId, idx, EM_SEARCHCOUNT);
    }
  } catch (ex) {
    log.error("Error collection task list: " + ex);
    return;
  } finally {
    if (result) {
      ixConnect.ix().findClose(result.searchId);
    }
  }
};
