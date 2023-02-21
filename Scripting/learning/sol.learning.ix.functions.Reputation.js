
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.ix.ReputationUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.learning.ix.functions.Reputation" });
/**
 * Provides service functions for reputation.
 *
 * Change reputation data from user folder
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 * # As IX function call
 *
 *   sol.common.IxUtils.execute("RF_sol_learning_function_Reputation", {
 *     objId: 4713
 *     // pass type of reputation and the user, "CURRENT" or creator of the current sord "CREATOR"
 *     type: "GOT_UPVOTED",
 *     userId: "CURRENT"  (optional)
 *   });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 0.01.000
 *
 * @eloix
 * @requires handlebars
 * @requires sol.common.SordUtils
 * @requires sol.common.Map
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.SordUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.ix.ReputationUtils
 */
sol.define("sol.learning.ix.functions.Reputation", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["type", "objId"],

  /**
   * @cfg {String} type (required)
   */
  type: undefined,

  /**
   * @cfg {String} objId (required)
   */
  objId: undefined,

  /**
   * @cfg {String} userId identification of the user. [CURRENT or OWNER]
   */
  userId: "CURRENT",

  /**
   * @cfg {String} extendType name of the index field which value should be added as uppercase to the given type.
   *
   */
  extendType: undefined,

  /**
   * @cfg {Boolean} countDown (optional) If set the reputation counter is decremented and the repution points are subtracted
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   *  Grant repution to user folder.
   */
  process: function () {
    var me = this,
        sord, extendVal;

    if (me.extendType) {
      sord = sol.common.RepoUtils.getSord(me.objId);
      extendVal = sol.common.SordUtils.getObjKeyValue(sord, me.extendType);
      if (extendVal) {
        me.type += "_" + extendVal.toUpperCase();
      }
    }

    switch (me.userId) {
      case "OWNER":
        // get current sord owner
        sord = sord || sol.common.RepoUtils.getSord(me.objId);
        me.userId = sord.ownerId;
        break;
      default:
        break;
    }
    sol.learning.ix.ReputationUtils.grant(me.type, me.userId, me.countDown);
  }
});

/**
 * @member sol.learning.ix.functions.Reputation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_Reputation", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      grant;

  params.objId = wFDiagram.objId;
  grant = sol.create("sol.learning.ix.functions.Reputation", params);
  grant.process();
  logger.exit("onEnterNode_Reputation");
}


/**
 * @member sol.learning.ix.functions.Reputation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_Reputation", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      grant;

  params.objId = wFDiagram.objId;
  grant = sol.create("sol.learning.ix.functions.Reputation", params);
  grant.process();
  logger.exit("onExitNode_Reputation");
}


/**
 * @member sol.learning.ix.functions.Reputation
 * @method RF_sol_learning_function_Reputation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_Reputation(iXSEContext, args) {
  logger.enter("RF_sol_learning_function_Reputation", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "type", "objId"),
      grant = sol.create("sol.learning.ix.functions.Reputation", params),
      sord;

  // check if main administrator
  if (!grant.userId || grant.userId == "CURRENT") {
    grant.userId = sol.common.UserUtils.getCurrentUserInfo().id;
  }
  if (grant.userId == "OWNER") {
    // get current sord owner
    sord = sol.common.RepoUtils.getSord(grant.objId);
    grant.userId = sord.ownerId;
  }
  if (!sol.common.UserUtils.isMainAdmin(grant.userId)) {
    throw "User unauthorized";
  }
  grant.process();

  logger.exit("RF_sol_learning_function_Reputation");
}

