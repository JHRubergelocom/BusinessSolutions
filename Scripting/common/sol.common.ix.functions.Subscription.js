
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.SubscriptionUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Subscription" });
/**
 * Provides functions for subscriptions.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Subscribe", {
 *       objId: "4711"
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ix.SubscriptionUtils
 */
sol.define("sol.common.ix.functions.Subscription", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} objId Either `objId` or `feedGuid` has to be defined.
   */

  /**
   * @cfg {String} feedGuid Either `objId` or `feedGuid` has to be defined.
   */

  /**
   * @cfg {Boolean} [subscribe=false] If `true` the user will subscribe to the element, if `false` the user will unsubscribe.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Manages the subscription.
   */
  process: function () {
    var me = this;

    if (!me.objId && !me.feedGuid) {
      throw "IllegalStataException: either 'objId' or 'feedGuid' has to be defined";
    }

    if (me.subscribe === true) {
      me.feedGuid ? sol.common.ix.SubscriptionUtils.subscribe(me.feedGuid) : sol.common.ix.SubscriptionUtils.subscribeToElement(me.objId);
    } else {
      me.feedGuid ? sol.common.ix.SubscriptionUtils.unsubscribe(me.feedGuid) : sol.common.ix.SubscriptionUtils.unsubscribeFromElement(me.objId);
    }
  }

});


/**
 * @member sol.common.ix.functions.Subscription
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_Subscription", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Subscription", params);
  module.process();

  logger.exit("onEnterNode_Subscription");
}

/**
 * @member sol.common.ix.functions.Subscription
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Subscription", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Subscription", params);
  module.process();

  logger.exit("onExitNode_Subscription");
}

/**
 * @member sol.common.ix.functions.Subscription
 * @method RF_sol_function_Subscription
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Subscription(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_Subscription", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  module = sol.create("sol.common.ix.functions.Subscription", params);
  module.process();

  logger.exit("RF_sol_function_Subscription");

  return "{}"; // return empty JSON to avoid errors with older WF client libs
}

