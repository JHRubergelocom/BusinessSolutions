
//@include lib_Class.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceRegistry.js

var logger = sol.create("sol.Logger", { scope: "sol.common_monitoring.ix.events.Update" });

globalScope.$monitoring = globalScope.$monitoring || {};
globalScope.$monitoring.updateRegistry = globalScope.$monitoring.updateRegistry || {};
globalScope.$monitoring.updateRegistryWF = globalScope.$monitoring.updateRegistryWF || {};

/**
 * Event class for registering or executing an update.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceRegistry
 */
sol.define("sol.common_monitoring.ix.events.Update", {

  /**
   * Executes the update if one is registered for the element.
   */
  process: function () {
    var me = this,
        update;

    if (!me.sord) {
      throw "IllegalConfigurationException: no 'sord' defined.";
    }

    me.guid = me.sord.guid;

    if (!me.sordZ.isTrue(SordC.mbObjKeys)) {
      me.sordZ.add(SordC.mbObjKeys);
      me.sord = ixConnect.ix().checkoutSord(me.sord.id, me.sordZ, LockC.NO);
    }

    update = me.getUpdateCfg();

    if (update) {
      me.wfTemplate = update.templateId;
      me.wfUser = update.user;
      me.wfName = me.buildName(me.sord, update.nameTemplate);

      me.flowId = me.getConnection().ix().startWorkFlow(me.wfTemplate, me.wfName, me.guid);
      me.logger.debug(["workflow started: flowId={0}, flowName={1}, flowOwner={2}, objId={3}", me.flowId, me.wfName, me.wfUser, me.sord.id]);

      me.cleanUp();
    }
  },

  /**
   * Registers an update for an element by retrieving the configuration from the service registry.
   */
  register: function () {
    var me = this,
        sord, guid;

    if (!me.objId) {
      throw "IllegalConfigurationException: no 'objId' defined.";
    }

    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbMin, LockC.NO);
    guid = sord.guid;

    if ((me.registerFlowId > 0) && (me.registerNodeId > 0)) {
      me.getUpdateRegistryWF()[me.registerFlowId] = me.registerNodeId;
    } else {
      me.getUpdateRegistry()[guid] = true;
    }
  },

  /**
   * @private
   * Retrieves a connection for the specified user.
   * If no user is defined, it returns the standard connection.
   * @return {de.elo.ix.client.IXConnection}
   */
  getConnection: function () {
    var me = this;
    if (!me.wfUser || (me.wfUser == me.user)) {
      return ixConnect;
    }
    if (!me._internalConnection) {
      me._internalConnection = ixConnect.createConnectionForUser(me.wfUser);
    }
    return me._internalConnection;
  },

  /**
   * @private
   * Performs internal cleanup.
   */
  cleanUp: function () {
    var me = this;

    me.removeFinishedWf();

    if (me._internalConnection) {
      me._internalConnection.close();
    }
  },

  /**
   * @private
   * Retrieves an update configuration for an element.
   * @return {Object}
   */
  getUpdateCfg: function () {
    var me = this,
        solType, updateCfgs;

    solType = sol.common.SordUtils.getObjKeyValue(me.sord, "SOL_TYPE");

    updateCfgs = sol.common.ix.ServiceRegistry.query({
      type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
      functions: sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE,
      soltypes: String(solType)
    }, {
      evaluateConfig: true
    });

    return (updateCfgs && (updateCfgs.length > 0)) ? updateCfgs[0].serviceDescription.cfg : null;
  },

  getUpdateRegistry: function () {
    return globalScope.$monitoring.updateRegistry;
  },

  getUpdateRegistryWF: function () {
    return globalScope.$monitoring.updateRegistryWF;
  },

  /**
   * @private
   * Remove the update WF if it is already finished.
   */
  removeFinishedWf: function () {
    var me = this,
        activeWorkflows, flowFinished;

    activeWorkflows = sol.common.WfUtils.getActiveWorkflows(me.guid, { template: me.wfTemplate });
    flowFinished = !activeWorkflows.some(function (wf) {
      return wf.id === me.flowId;
    });
    if (flowFinished) {
      me.logger.debug(["delete finished workflow: flowId={0}, flowName={1}, flowOwner={2}", me.flowId, me.wfName, me.wfUser]);
      me.getConnection().ix().deleteWorkFlow(me.flowId, WFTypeC.FINISHED, LockC.NO);
    }
  },

  /**
   * @private
   * Builds the name from a template using the sord data. Fallback is `sord.name`.
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} nameTemplate (optional)
   * @return {String}
   */
  buildName: function (sord, nameTemplate) {
    var me = this,
        name;
    try {
      if (nameTemplate) {
        sord = me.getTemplateSord(sord).sord;
        name = sol.create("sol.common.Template", { source: nameTemplate }).apply({ sord: sord });
      } else {
        name = sord.name;
      }
    } catch (ex) {
      name = sord.name;
      me.logger.warn("error generating name, use 'sord.name'", ex);
    }
    return name;
  },

  /**
   * @private
   * Creates a template sord from a Sord (see {@link sol.common.ObjectFormatter.TemplateSord TemplateSord}).
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object}
   */
  getTemplateSord: function (sord) {
    var templateSord;

    templateSord = sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
          allMapFields: true
        }
      }
    });
    return templateSord;
  }

});

/**
 * This asynchronous event is raised after a Sord object has been written and executes an update if one is registered for the element.
 * @static
 * @member sol.common_monitoring.ix.events.Update
 * @method onAfterCheckinSord
 * @param {de.elo.ix.client.IXServerEventsContext} ec
 * @param {de.elo.ix.client.Sord} sord
 * @param {de.elo.ix.client.Sord} sordCurrent
 * @param {de.elo.ix.client.Sord} sordParent
 * @param {de.elo.ix.client.LockZ} sordZ
 * @param {de.elo.ix.client.SordZ} lockZ
 * @throws RemoteException Exception thrown by the script itself or scripting engine.
 */
function onAfterCheckinSord(ec, sord, sordCurrent, sordParent, sordZ, lockZ) {
  var event;

  if (!globalScope.$monitoring || !globalScope.$monitoring.updateRegistry || (globalScope.$monitoring.updateRegistry[sord.guid] !== true) || (sordZ == 0)) {
    return;
  }

  // Cleanup as first step to aviod concurrent access from competing events
  delete globalScope.$monitoring.updateRegistry[sord.guid];

  logger.enter("onAfterCheckinSord_ExecuteUpdate");
  try {
    event = sol.create("sol.common_monitoring.ix.events.Update", {
      sord: sord,
      sordZ: sordZ,
      user: ec.user.name
    });
    event.process();
  } catch (ex) {
    logger.error("Exception in 'onAfterCheckinSord_ExecuteUpdate'", ex);
  }
  logger.exit("onAfterCheckinSord_ExecuteUpdate");
}

/**
 * This asynchronous event is raised after a workflow has been forwarded and executes an update if one is registered for the workflow.
 * @static
 * @member sol.common_monitoring.ix.events.Update
 * @method onAfterEndEditWorkFlowNode
 * @param {de.elo.ix.client.IXServerEventsContext} ec
 * @param {de.elo.ix.client.WFDiagram} wfDiagram
 * @param {Number} nodeId
 * @param {de.elo.ix.client.Sord} sord
 * @param {de.elo.ix.client.LockZ} sordZ
 * @throws RemoteException Exception thrown by the script itself or scripting engine.
 */
function onAfterEndEditWorkFlowNode(ec, wfDiagram, nodeId, sord, sordZ) {
  var event;

  if (!globalScope.$monitoring || !globalScope.$monitoring.updateRegistryWF || (globalScope.$monitoring.updateRegistryWF[wfDiagram.id] != nodeId)) {
    return;
  }

  // Cleanup as first step to aviod concurrent access from competing events
  delete globalScope.$monitoring.updateRegistryWF[wfDiagram.id];

  logger.enter("onAfterEndEditWorkFlowNode_ExecuteUpdate");

  try {
    event = sol.create("sol.common_monitoring.ix.events.Update", {
      sord: sord,
      sordZ: sordZ,
      registerFlowId: wfDiagram.id,
      registerNodeId: nodeId,
      user: ec.user.name
    });
    event.process();
  } catch (ex) {
    logger.error("Exception in 'onAfterCheckinSord_ExecuteUpdate'", ex);
  }

  logger.exit("onAfterEndEditWorkFlowNode_ExecuteUpdate");
}

/**
 * Registers an update event.
 * @member sol.common_monitoring.ix.events.Update
 * @method RF_sol_common_monitoring_function_RegisterUpdate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_monitoring_function_RegisterUpdate(ec, args) {
  var params, module;

  logger.enter("RF_sol_common_monitoring_function_RegisterUpdate", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");

  module = sol.create("sol.common_monitoring.ix.events.Update", params);
  module.register();

  logger.exit("RF_sol_common_monitoring_function_RegisterUpdate");

  return "{}";
}

