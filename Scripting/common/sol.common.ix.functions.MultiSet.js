
importPackage(Packages.de.elo.ix.client);


//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.MultiSet" }); // eslint-disable-line one-var

/**
 * Edits existing objects by changing the mask or setting different values pro object.
 *
 * # As workflow node
 *
 * The configuration is defined in the following way:
 *
 *     {
 *         "objEntries: [
 *           { "objId" : 4711, "entries" : [ ... ]}, // The "entries" are configurated similar as in the "RF_sol_function_Set" RF. 
 *           { "objId" : 4713, "entries" : [ ... ]},
 *              .....
 *           { "objId" : 4720, "entries" : [ ... ]}
 *         ]
 *     }
 *
 * Following configuration should be applied to the comments field for a mask and field update:
 *
 * ## Example
 *   {
 *     "objEntries": [{
 *       "objId": 4711
 *       "entries": [{
 *         "type": "MASK",        // changes the mask of the sord, if defined more than once, the first one will be used
 *         "value": "Basic Entry"
 *       }, {
 *         "type": "SORD",
 *         "key": "name",
 *         "value": "Contract {{sord.objKeys.CONTRACT_NAME}} - {{count 'MY_CONTRACT_COUNTER'}}",
 *         "useTemplating": true
 *       }, {
 *         "type": "GRP",
 *         "key": "CONTRACT_STATUS",
 *         "value": "D",
 *         "useDynKwl": true,
 *         "dynKwlCfg": {
 *           "filterColumn": 0,
 *           "returnColumn": 2
 *         },
 *         "onlyIfEmpty": true
 *       }, {
 *         "type": "MAP",
 *         "key": "USER",
 *         "value": "Bill Gates",
 *       }, {
 *         "type": "WFMAP",
 *         "key": "USER",
 *         "value": "Steve Jobs"
 *       }]
 *     }]
 *   }
 *
 * Following configuration should be applied to the comments field and will multiset a value from the fields KWL starting with '3'
 *
 *     {
 *       "entries": [{
 *         "type": "GRP",
 *         "key": "INVOICE_STATUS",
 *         "value": "3",
 *         "useKwl": true
 *        }]
 *     }
 *
 * Following configuration will multiset a field from the fields dynamic KWL staring with 'M' (e.g. M - month) from a localized dynamic KWL
 *
 *     {
 *       "type": "GRP",
 *       "key": "REMINDER_PERIOD_UNIT",
 *       "value": "M",
 *       "useDynKwl": true,
 *       "dynKwlCfg": {
 *         "returnColumn": 2,
 *         "filterColumn": 0
 *       }
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_MultiSet", {
 *      objEntries: [{
 *       objId: "4711",
 *       entries: [{
 *         type: "GRP",
 *         key: "INVOICE_STATUS",
 *         value: "3",
 *         useKwl: true
 *       }]
 *     }]
 *    });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.01.001
 *
 * @eloix
 * @requires sol.Logger
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.MultiSet", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objEntries"],

  /**
   * @cfg {Object[]} objEntries (required)
   * It contains for every objid the entries values to set
   */

  /**
   * @cfg {String} timeZone
   * Time zone
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Sets a field value for every objId
   */
  process: function () {
    var me = this,
        savedTimeZone = null,
        i, objEntry;

    if (!me.objEntries) {
      return;
    }

    try {
      me.logger.debug(["sol.common.ix.functions.MultiSet: objEntries={0}", JSON.stringify(me.objEntries)]);

      if (me.timeZone) {
        savedTimeZone = ixConnect.loginResult.clientInfo.timeZone;
        ixConnect.loginResult.clientInfo.timeZone = me.timeZone;
        me.logger.debug(["user.name={0}, timeZone={1}", ixConnect.loginResult.user.name, ixConnect.loginResult.clientInfo.timeZone]);
      }

      for (i = 0; i < me.objEntries.length; i++) {
        objEntry = me.objEntries[i];
        sol.common.IxUtils.execute("RF_sol_function_Set", {
          objId: objEntry.objId,
          entries: objEntry.entries,
          asAdmin: objEntry.asAdmin || me.asAdmin || false
        });
      }
    } catch (ex) {
      me.logger.debug(["Exception", ex.message]);
    } finally {
      if (savedTimeZone) {
        ixConnect.loginResult.clientInfo.timeZone = savedTimeZone;
      }
    }
  }
});

/**
 * @member sol.common.ix.functions.MultiSet
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_MultiSet", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "objEntries");

  module = sol.create("sol.common.ix.functions.MultiSet", params);
  module.process();

  logger.exit("onEnterNode_MultiSet");
}

/**
 * @member sol.common.ix.functions.MultiSet
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_MultiSet", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "objEntries");

  module = sol.create("sol.common.ix.functions.MultiSet", params);
  module.process();

  logger.exit("onExitNode_MultiSet");
}


/**
 * @member sol.common.ix.functions.MultiSet
 * @method RF_sol_function_MultiSet
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_MultiSet(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_MultiSet", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objEntries");

  module = sol.create("sol.common.ix.functions.MultiSet", params);
  module.process();

  logger.exit("RF_sol_function_MultiSet");
}
