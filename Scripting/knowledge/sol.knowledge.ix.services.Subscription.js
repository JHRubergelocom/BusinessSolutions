importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.SubscriptionUtils.js

var logger = sol.create("sol.Logger", {
  scope: "sol.knowledge.ix.services.Subscription"
});

sol.define("sol.knowledge.ix.services.GetSubscription", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * gets subscription info of given objId
   * @return {Object} Result subscription
   */
  subscription: function () {
    var me = this;

    return { subscribed: sol.common.ix.SubscriptionUtils.hasSubscription(me.objId) };
  }

});

sol.define("sol.knowledge.ix.services.GetSubscriptions", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * get all subscriptions
   * @return {Object} Result subscription
   */
  subscriptions: function () {
    var i, sord, subscriptionSord, subscriptions = {}, spaceList = [], postList = [];

    subscriptions = { subscribed: sol.common.ix.SubscriptionUtils.getAllSubscriptions() };
    for (i = 0; i < subscriptions.subscribed.length; i++) {
      sord = subscriptions.subscribed[i];
      subscriptionSord = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.StatisticSord",
          data: sord,
          config: {
            sordKeys: ["name", "ownerName", "maskName", "guid"],
            objKeys: ["KNOWLEDGE_CONTENT_TYPE", "KNOWLEDGE_POST_TYPE", "KNOWLEDGE_POST_SUBJECT",
              "KNOWLEDGE_SCORE", "KNOWLEDGE_SPACE_REFERENCE", "KNOWLEDGE_BOARD_REFERENCE"]
          }
        }
      });
      if (subscriptionSord.sord.maskName === 'Knowledge Space') {
        spaceList.push(subscriptionSord);
      } else if (subscriptionSord.sord.maskName === 'Knowledge Post') {
        postList.push(subscriptionSord);
      }

    }

    return { space: spaceList, post: postList };

  }
});

/**
 * @member sol.knowledge.ix.services.GetSubscription
 * @method RF_sol_knowledge_service_GetSubscription
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_GetSubscription(iXSEContext, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_knowledge_service_GetSubscription", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.knowledge.ix.services.GetSubscription", config);
  result = rfUtils.stringify(service.subscription());

  logger.exit("RF_sol_knowledge_service_GetSubscription", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.GetSubscriptions
 * @method RF_sol_knowledge_service_GetSubscriptions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_GetSubscriptions(iXSEContext, args) {
  var rfUtils, config, service, result, resultString;

  logger.enter("RF_sol_knowledge_service_GetSubscriptions", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.knowledge.ix.services.GetSubscriptions", config);
  result = { subscribed: service.subscriptions() };
  resultString = rfUtils.stringify(result);

  logger.exit("RF_sol_knowledge_service_GetSubscriptions", resultString);

  return resultString;
}