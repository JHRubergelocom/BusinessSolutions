
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeWfName" }); // eslint-disable-line one-var

/**
 * Changes the workflow name
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 *
 * Following configuration should be applied to the comments field for a field update:
 *
 * ## Examples
 * Workflow name based on the sord name and a counter:
 *
 *     {
 *       "name": "{{sord.name}} - {{count 'MY_WF_COUNTER'}}"
 *     }
 *
 * Workflow name based on an index, a map and a wf-map field
 *
 *     {
 *       "name": "{{{sord.objKeys.CUSTOMER_NAME}}} - {{{sord.mapKeys.REF_NO}}} - {{{sord.wfMapKeys.FLOW_ID}}}"
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ChangeWfName", {
 *       flowId: "222",
 *       name: "{{sord.name}} - {{count 'MY_WF_COUNTER'}}"
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.Logger
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.ChangeWfName", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],


  /**
   * @cfg {string} objId (required)
   * Object ID
   */

  /**
   * @cfg {string} flowId
   * Flow ID
   */

  /**
   * @cfg {string} name
   * Workflow name
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Changes the workflow name
   */
  process: function () {
    var me = this,
        wfName;

    me.sord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbAllIndex });
    me.tplSord = sol.common.WfUtils.getTemplateSord(me.sord, me.flowId);
    wfName = sol.create("sol.common.Template", { source: me.name }).apply(me.tplSord);

    if (!me.wfDiagram && me.flowId) {
      me.wfDiagram = sol.common.WfUtils.getWorkflow(me.flowId);
    }

    me.wfDiagram.name = wfName;
    me.wfDiagram.nameTranslationKey = "";
  }
});

/**
 * @member sol.common.ix.functions.ChangeWfName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeWfName", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "name"),

  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  module = sol.create("sol.common.ix.functions.ChangeWfName", params);

  module.process();

  logger.exit("onEnterNode_ChangeWfName");
}

/**
 * @member sol.common.ix.functions.ChangeWfName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeWfName", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "name");

  params.objId = wfDiagram.objId;
  params.wfDiagram = wfDiagram;
  module = sol.create("sol.common.ix.functions.ChangeWfName", params);

  module.process();

  logger.exit("onExitNode_ChangeWfName");
}


/**
 * @member sol.common.ix.functions.ChangeWfName
 * @method RF_sol_function_ChangeWfName
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_ChangeWfName(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_ChangeWfName", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "flowId", "name");

  module = sol.create("sol.common.ix.functions.ChangeWfName", params);
  module.process();

  ixConnect.ix().checkinWorkFlow(module.wfDiagram, WFDiagramC.mbAll, LockC.NO);

  logger.exit("RF_sol_function_ChangeWfName");
}

