
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.pubsec.ix.ProcessUtils.js
//@include lib_sol.pubsec.ix.Routines.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.services.Routines" });

/**
 * Reads / writes / updates the process from/to the description.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.routineReference|@deprecated The field which stores the reference to the routine (only if external routine elements are used)|
 * |fields.routineStatus|@deprecated The field with status of the routine (only if external routine elements are used)|
 *
 * # Example for AddRoutine
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_AddRoutine', {
 *       objId: "4711",
 *       name: "My new routine",
 *       routine: {
 *         templateName: "Mustergeschäftsgang"
 *       }
 *     });
 *
 * # Example for GetRoutine
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_GetRoutine', {
 *       objId: "4711",
 *       loadAdditionalInfo: true, // optional
 *       flowId: "123", // optional
 *       nodeId: "7" // optional
 *     });
 *
 * # Example for UpdateRoutine
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_UpdateRoutine', {
 *       objId: "4711",
 *       routine: {...}
 *     });
 *
 * # Result object for GetRoutine:
 *
 *     {
 *       "routine": {
 *         "status": "OPEN",
 *         "steps": [
 *           {
 *             "name": "First Node",
 *             "desc": "do your thing",
 *             "users": [ { "userName": "PubSec.Sachbearbeiter", "wfNodeId": 3 } ],
 *             "activated": "20150917135952"
 *           },
 *           {
 *             "name": "Second Node",
 *             "desc": "do another thing",
 *             "users": [ { "userName": "PubSec.Registratur", "wfNodeId": 10 } ]
 *           }
 *         ],
 *         "tasks": []
 *       },
 *       // only if `loadAdditionalInfo` is set to true
 *       "process": {
 *         "sord": {
 *           "objKeys": {
 *             "FILE_REFERENCE": "471100/1",
 *             "PROCESS_REFERENCE": "471100/1/4",
 *             "PROCESS_NAME": "test : V.",
 *             ...
 *           },
 *           "mapKeys": {},
 *           "id": "6659",
 *           "name": "471100/1/4 test : V.",
 *           "maskName": "Vorgang"
 *         }
 *       },
 *       // only if `loadAdditionalInfo` is set to true
 *       "activeNode": {
 *         "wfNode": {
 *           "userName": "PubSec.Sachbearbeiter",
 *           "id": 3
 *         },
 *         "step": {
 *           "name": "First Node",
 *           "desc": "do your thing",
 *           "users": [ { "userName": "PubSec.Sachbearbeiter", "wfNodeId": 3 } ],
 *           "activated": "20150917135952"
 *         }
 *       },
 *       // only if `loadAdditionalInfo` is set to true and `nodeId` is valid
 *       "successorNodes": [{id: 7, name: "forward"}, {id: 8, name: "cancel"}]
 *     }
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.IxUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.pubsec.ix.ProcessUtils
 * @requires sol.pubsec.ix.Routines
 */
sol.define("sol.pubsec.ix.services.Routines", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId (required) The objId or GUID of the process
   */

  /**
   * @cfg {Number} routineId (optional)
   * GetRoutine: to read a specific routine, this has to be defined. Otherwise a summary will be returned.
   * UpdateRoutine: to update a specific routine, this also has to be defined. Otherwise the first one will be updated.
   */

  /**
   * @cfg {Object} routine (optional)
   * If process steps are set, they will be written to the object, instead of read.
   *
   * Routine Object:
   *
   *     {
   *       definition: {
   *         steps: [
   *           {
   *             name: "First Node",
   *             desc: "do your thing",
   *             users: [ { userName: "PubSec.Sachbearbeiter" } ],
   *             activated: "20150701142400"
   *             done: "20150701142500" //optional
   *           },
   *           {
   *             name: "Second Node",
   *             desc: "do another thing",
   *             users: [ { userName: "PubSec.Clearing" } ],
   *             activated: "20150702142500" //optional
   *           },
   *           {
   *             name: "3rd",
   *             desc: "do the final thing",
   *             users: [ { userName: "zipfel" } ]
   *           }
   *         ]
   *       }
   *     }
   *
   * To add a new routine either this can be used or you just specify the name of a routine template
   *
   *     {
   *       templateName: "Mustergeschäftsgang"
   *     }
   */

  /**
   * @cfg {Boolean} [loadAdditionalInfo=false] (optional) Additional infos will be process sord data, active node and successor nodes
   */

  /**
   * @cfg {String} flowId (optional) If spezified, this will be used to load the workflow. If empty {@link #loadAdditionalInfo} only returns additional process and no workflow info.
   */

  /**
   * @cfg {String} nodeId (optional) Only if this is a valid ID, the successor nodes will be loaded
   */

  /**
   * @cfg {Boolean} [isTemplate=false] (optional)
   * If this is set to `true`, the routine will always be read from and written to the objects description.
   *
   * This is needed for the configuration app. This is the only way, the templates can be transported.
   */

  /**
   * @cfg {String} name (optional) If a new routine should be created, this has to be defined.
   */

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.pubsec.ix.ProcessUtils.loadConfig();
    me.isTemplate = (config.isTemplate === true) ? true : false;

    me.initProcessSord();
    me.$routines = sol.create("sol.pubsec.ix.Routines", {
      objId: me.processSord.id,
      isTemplate: me.isTemplate
    });
  },

  /**
   * Adds a new routine (if supported).
   * @returns {Object} see {@link sol.pubsec.ix.services.Routines}
   */
  addRoutine: function () {
    var me = this,
        id;

    if (!me.name || me.name == "") {
      throw "A new routine has to define a name";
    }

    id = me.$routines.addRoutine(me.name, me.routine);

    me.$routines.save();

    return me.$routines.getRoutine(id) || {};

  },

  /**
   * Retrieves routine data.
   * @returns {Object} see {@link sol.pubsec.ix.services.Routines}
   */
  readRoutines: function () {
    var me = this,
        returnObj;

    returnObj = {};

    if (typeof me.routineId !== "undefined") {
      returnObj.routine = me.$routines.getRoutine(me.routineId);
    } else {
      returnObj.routine = me.$routines.getRoutine();
      returnObj.routines = me.$routines.getMinimizedRoutineData();
      returnObj.routineTemplates = sol.common.IxUtils.execute("RF_sol_pubsec_service_GetRoutineTemplates", {}) || [];
    }

    returnObj.options = {
      multipleRoutinesSupported: me.$routines.isMultipleRoutinesSupported(),
      isTemplate: me.isTemplate
    };

    me.readSigningData(returnObj.routine);
    me.readDirectiveData(returnObj.routine);
    if (me.loadAdditionalInfo === true) {
      me.initWfDiagram();
      me.readAdditionalData(returnObj);
    }
    return returnObj;
  },

  /**
   * Writes routine data.
   */
  updateRoutine: function () {
    var me = this;

    if (me.routine && me.routine.definition) {
      me.$routines.updateRoutine(me.routine.definition, me.routineId);
      me.$routines.save();
    }
  },

  /**
   * @private
   */
  initProcessSord: function () {
    var me = this;
    me.processSord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
  },

  /**
   * @private
   */
  initWfDiagram: function () {
    var me = this;
    if (me.flowId) {
      me.wfDiagram = sol.common.WfUtils.getWorkflow(me.flowId);
    }
  },

  /**
   * @private
   * @return {Object}
   */
  readProcessData: function () {
    var me = this,
        templateSord = sol.create("sol.common.ObjectFormatter.TemplateSord", {});

    templateSord.sordKeys = ["id", "name", "maskName", "desc"];
    return templateSord.build(me.processSord);
  },

  /**
   * @private
   * @param {Object} obj
   */
  readSigningData: function (obj) {
    var wfUtils = sol.common.WfUtils,
        signingTemplateSord, wfDiagram;

    if (obj && obj.steps) {
      obj.steps.forEach(function (step) {
        if (step.signing && step.signing.signings) {
          step.signing.signings.forEach(function (signing) {

            if (signing.signingType) {
              signingTemplateSord = sol.common.RepoUtils.getSord(signing.signingType);
              signing.glyphClass = sol.common.SordUtils.getObjKeyValue(signingTemplateSord, "SIGNPROCESS_ICON");
            }

            if (signing.flowId) {
              wfDiagram = wfUtils.getWorkflow(signing.flowId, { inclFinished: true, connection: ixConnectAdmin });
              signing.documentTitle = wfDiagram.objName;
              signing.status = wfUtils.getWorkflowStatus(wfDiagram);

              //mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, signing.flowId, ["SOL_FLOW_SIGNING_STATUS_TIME"], LockC.NO);
            }
          });
        }
      });
    }
  },

  /**
   * @private
   * @param {Object} obj
   */
  readDirectiveData: function (obj) {
    var wfUtils = sol.common.WfUtils,
        directiveTemplateSord, wfDiagram;

    if (obj && obj.steps) {
      obj.steps.forEach(function (step) {
        if (step.directive && step.directive.directives) {
          step.directive.directives.forEach(function (directive) {

            if (directive.type) {
              directiveTemplateSord = sol.common.RepoUtils.getSord(directive.type);
              directive.glyphClass = sol.common.SordUtils.getObjKeyValue(directiveTemplateSord, "DIRECTIVE_ICON");
            }

            if (directive.flowId) {
              wfDiagram = wfUtils.getWorkflow(directive.flowId, { inclFinished: true, connection: ixConnectAdmin });
              directive.documentTitle = wfDiagram.objName;
              directive.status = wfUtils.getWorkflowStatus(wfDiagram);

              //mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, directive.flowId, ["SOL_FLOW_DIRECTIVE_STATUS_TIME"], LockC.NO);
            }
          });
        }
      });
    }
  },

  /**
   * @private
   * @param {Object} obj
   */
  readAdditionalData: function (obj) {
    var me = this;
    obj.process = me.readProcessData();
    obj.activeNode = me.getActiveNode(obj.routine);
    obj.successorNodes = me.getSuccessorNodes(obj.activeNode);
  },

  /**
   * @private
   * @param {Object} routine
   * @return {Object} node
   */
  getActiveNode: function (routine) {
    var me = this,
        activeNode = null,
        activeStep;

    if (me.wfDiagram) {
      me.wfDiagram.nodes.some(function (node) {
        if (node.isNext === 1) {
          activeNode = activeNode || {};
          activeNode.wfNode = {};
          activeNode.wfNode.userName = node.userName;
          activeNode.wfNode.id = node.id;
          return true;
        }
      });
    }

    activeStep = sol.pubsec.ix.ProcessUtils.retrieveActiveStep(routine);

    if (activeStep) {
      activeNode = activeNode || {};
      activeNode.step = activeStep;
    }

    return activeNode;
  },

  /**
   * @private
   * @param {Object} activeNode
   * @return {Object} node
   */
  getSuccessorNodes: function (activeNode) {
    var me = this,
        forwardCheckResult, successorNodes;
    if (me.wfDiagram && me.nodeId && activeNode && activeNode.wfNode && (activeNode.wfNode.id == me.nodeId)) {
      forwardCheckResult = sol.common.IxUtils.execute("RF_sol_pubsec_function_routine_CheckForward", { objId: me.objId });
      successorNodes = sol.common.WfUtils.getSuccessorNodes(me.wfDiagram, me.nodeId);
      return successorNodes.map(function (node) {
        var ignoreForwardRestrictions;
        try {
          ignoreForwardRestrictions = JSON.parse(node.comment).ignoreForwardRestrictions === true;
        } catch (ex) {
          ignoreForwardRestrictions = false;
        }
        if (ignoreForwardRestrictions === true) {
          return { id: node.id, name: node.name, forward: { allowed: true } };
        } else {
          return { id: node.id, name: node.name, forward: forwardCheckResult };
        }
      });
    }
    return null;
  }

});

/**
 * Starts the routine of a process.
 *
 * # Example for RF call
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_StartRoutine', {
 *       objId: "4711",
 *       routineId: 2
 *     });
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |routine.dynamicWorkflowTemplate|The name/id of workflow template which should be started|
 * |routine.status.open|The open status|
 * |fields.routineUrgentIndicator|If this field is set, the routine will be started with high priority|
 * |fields.routineReference|@deprecated The field which stores the reference to the routine (only if external routine elements are used)|
 * |fields.routineStatus|@deprecated Field containing the routine status (only if external routine elements are used)|
 * |mapFields.routineReference|@deprecated The workflow map field to save the reference to the routine object (only if external routine elements are used)|
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.ServiceBase
 * @requires sol.pubsec.ix.ProcessUtils
 */
sol.define("sol.pubsec.ix.services.StartRoutine", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["ci", "objId"],

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {Number} routineId (required) If not defined the first routine will be used
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.pubsec.ix.ProcessUtils.loadConfig();
  },

  /**
   * Starts the workflow.
   * @return {Object}
   */
  process: function () {
    var me = this,
        sord, routines, routine, urgentIndicator, prio, wfTemplate, flowId, routineObjId;

    if (!sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { r: true, w: true } })) {
      throw sol.common.TranslateTerms.getTerm(me.ci, "sol.pubsec.ix.services.Routines.errorStartRights");
    }

    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    routines = sol.create("sol.pubsec.ix.Routines", {
      objId: sord.id,
      isTemplate: false
    });

    routine = routines.getRoutine(me.routineId);

    if (!routine || !routine.steps || (routine.steps.length <= 0)) {
      throw sol.common.TranslateTerms.getTerm(me.ci, "sol.pubsec.ix.services.Routines.errorWfStartNoRoutineSteps");
    }

    urgentIndicator = sol.common.SordUtils.getObjKeyValue(sord, me.config.fields.routineUrgentIndicator);
    if (urgentIndicator && (urgentIndicator.length() > 0)) {
      prio = 0;
    }

    routine.status = me.config.routine.status.open;

    wfTemplate = me.config.routine.dynamicWorkflowTemplate;
    flowId = sol.common.WfUtils.startWorkflow(wfTemplate, me.buildWfName(sord, routine), sord.id, prio);

    routines.save();

    if (!routines.isMultipleRoutinesSupported()) {
      routineObjId = routines.getExternalRoutineObjId();
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, flowId, sord.id, [new KeyValue(me.config.mapFields.routineReference, routineObjId)], LockC.NO);
    }

    return { flowId: flowId };
  },

  buildWfName: function (processSord, routine) {
    return processSord.name + ((routine && routine.name) ? (": " + routine.name) : "");
  }

});

/**
 * Forwards a routine.
 *
 * # Example for RF call
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_ForwardRoutine', {
 *       flowId: "4711",
 *       currentNodeId: 7,
 *       successorNodeId: 8
 *     });
 *
 * # Example for ForwardRoutine
 *
 *     sol.common.IxUtils.execute('RF_sol_pubsec_service_ForwardRoutine', {
 *       flowId: "4711",
 *       currentNodeId: 3,
 *       successorNodeId: 4,
 *       comment: "this is a new comment" //optional
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.pubsec.ix.services.ForwardRoutine", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["flowId", "currentNodeId", "successorNodeId"],

  /**
   * @cfg {String} flowId (required)
   */

  /**
   * @cfg {Number} currentNodeId (required)
   */

  /**
   * @cfg {Number} successorNodeId (required)
   */

  /**
   * @cfg {String} comment (optional) Replaces the node comment of the current node
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Forwards the workflow.
   */
  process: function () {
    var me = this,
        editNode, comment;

    ixConnect.ix().takeWorkFlowNode(me.flowId, me.currentNodeId, null, WFTakeNodeC.DEFAULT, LockC.NO);

    editNode = ixConnect.ix().beginEditWorkFlowNode(me.flowId, me.currentNodeId, LockC.YES);
    comment = me.comment || editNode.node.comment;

    ixConnect.ix().endEditWorkFlowNode(
      me.flowId,
      me.currentNodeId,
      false,
      false,
      editNode.node.name,
      comment,
      [me.successorNodeId]
    );
  }

});


/**
 * @member sol.pubsec.ix.services.Routines
 * @method RF_sol_pubsec_service_AddRoutine
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_AddRoutine(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_pubsec_service_AddRoutine", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.pubsec.ix.services.Routines", config);
  result = sol.common.ix.RfUtils.stringify(service.addRoutine());

  logger.exit("RF_sol_pubsec_service_AddRoutine", result);

  return result;
}

/**
 * @member sol.pubsec.ix.services.Routines
 * @method RF_sol_pubsec_service_GetRoutine
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_GetRoutine(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_pubsec_service_GetRoutine", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.pubsec.ix.services.Routines", config);
  result = sol.common.ix.RfUtils.stringify(service.readRoutines());

  logger.exit("RF_sol_pubsec_service_GetRoutine", result);

  return result;
}

/**
 * @member sol.pubsec.ix.services.Routines
 * @method RF_sol_pubsec_service_UpdateRoutine
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_UpdateRoutine(ec, args) {
  var config, service;

  logger.enter("RF_sol_pubsec_service_UpdateRoutine", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "routine");
  service = sol.create("sol.pubsec.ix.services.Routines", config);
  service.updateRoutine();

  logger.exit("RF_sol_pubsec_service_UpdateRoutine");
}

/**
 * @member sol.pubsec.ix.services.StartRoutine
 * @method RF_sol_pubsec_service_StartRoutine
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_StartRoutine(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_pubsec_service_StartRoutine", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  config.ci = ec.ci;

  service = sol.create("sol.pubsec.ix.services.StartRoutine", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_pubsec_service_StartRoutine", result);

  return result;
}

/**
 * @member sol.pubsec.ix.services.ForwardRoutine
 * @method RF_sol_pubsec_service_ForwardRoutine
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_ForwardRoutine(ec, args) {
  var config, service;

  logger.enter("RF_sol_pubsec_service_ForwardRoutine", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "flowId", "currentNodeId", "successorNodeId");
  service = sol.create("sol.pubsec.ix.services.ForwardRoutine", config);
  service.process();

  logger.exit("RF_sol_pubsec_service_ForwardRoutine");
}
