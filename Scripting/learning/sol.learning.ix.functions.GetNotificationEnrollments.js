
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Based on the searchTemplateName selects a search defined in searchTemplates within injected config,
 * does the search with sordProviderArgs defined in sordProviderArgs within injected config and
 * returns the result from SordProvider.
 *
 * This function expects a localizedKey like the key provided by @see sol.learning.ix.localizedKwl.NotifyRecipientSearch
 * e.g. "E - Enrolled"  (With E as the key)
 *
 * The provided key insearchTemplateName must match with the key-Attribute within searchTemplates.
 *
 * if removeEmptyValues is defined in searchTemplate. Empty Values will be removed from search.
 *
 * ### Example
 *
 * #### Arguments
 *     {
 *        "objId": 4711,
 *        "flowId": 70178,
 *        "searchTemplateName": "E - Enrolled"
 *     }
 *
 *
 * #### Returns (SordProvider Results)
 *
 *     {
 *        sords: [ ... ]
 *     }
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.GetNotificationEnrolllments", {
  extend: "sol.common.ix.ServiceBase",
  logger: sol.create("sol.Logger", { scope: "sol.learning.ix.services.GetNotificationEnrolllments" }),

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  _optimize: {},

  inject: {
    searchTemplates: { config: "learning", prop: "entities.communication.workflowMixins.sendPreparedMail.searchTemplates", template: true },
    sordProviderArgs: { config: "learning", prop: "entities.communication.workflowMixins.sendPreparedMail.sordProviderArgs" },
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" }
  },

  emptyResult: {
    sords: []
  },

  process: function () {
    var me = this,
        template,
        sordProviderArgs;

    if (me.searchTemplateName) {
      template = me.getSearchTemplate(me.searchTemplateName);

      if (template) {
        sordProviderArgs = me.sordProviderArgs;
        sordProviderArgs.search = template.removeEmptyValues
          ? me.removeEmptyValuesFromSearchEntries(template.search)
          : template.search;

        return sol.common.IxUtils.optimizedExecute(
          "RF_sol_common_service_SordProvider",
          sordProviderArgs,
          me._optimize,
          "preparedNotificationSearch",
          ["output"]
        );
      }
    }
    me.logger.info("Could not determine search template", {
      template: template,
      sordProviderArgs: sordProviderArgs

    });
    return me.emptyResult;
  },

  getSearchTemplate: function (name) {
    var me = this,
        key = name.split(" - ")[0];

    return me.getSearchTemplatesAsArray()
      .filter(function (template) {
        return template.key == key;
      })
      .reduce(me.getFirstResult, null);
  },

  getSearchTemplatesAsArray: function () {
    var me = this;

    return Object.keys(me.searchTemplates || {})
      .map(function (key) {
        return me.searchTemplates[key];
      });
  },

  getFirstResult: function (acc, template) {
    return acc || template;
  },

  removeEmptyValuesFromSearchEntries: function (entries) {
    return (entries || [])
      .filter(function (entry) {
        return !!entry.value;
      });
  }
});

/**
 * @member sol.learning.ix.services.GetNotificationEnrolllments
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.services.GetNotificationEnrolllments", params);

  fun.process();
}

/**
 * @member sol.learning.ix.services.GetNotificationEnrolllments
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.services.GetNotificationEnrolllments", params);

  fun.process();
}


/**
 * @member sol.learning.ix.services.GetNotificationEnrolllments
 * @method RF_sol_learning_service_GetNotificationEnrolllments
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_learning_service_GetNotificationEnrolllments(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  rfArgs.protectFields = false; // writing to all fields is allowed

  fun = sol.create("sol.learning.ix.services.GetNotificationEnrolllments", rfArgs);

  return JSON.stringify(fun.process());
}
