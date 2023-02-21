
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.Utils.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 *
 *
 * # Example as a IX function call
 *    sol.common.IxUtils.execute("", {
 *      "objId": "4711"
 *   })
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ObjectUtils
 * @requires sol.common.Injection
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.Utils
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.services.CollectNotificationData", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {},

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    sord: { sordIdFromProp: "objId" },
    searchTemplates: { config: "notification", prop: "entries.notification.services.recepients.searchTemplates" },
    sordProviderArgs: { config: "notification", prop: "entries.notification.services.recepients.sordProviderArgs" }
  },

  process: function () {
    var me = this,
        params = me.getParameters();

    return {
      sords: me.getRecipients(params)
        .map(me.enhanceRecipient.bind(me, sol.common.ObjectUtils.clone(params)))
    };
  },

  getParameters: function () {
    var me = this,
        params = {};

    params.searchTemplates = me.searchTemplates;

    params.timedEvent = me.getTimedEvent();
    params.meeting = me.getMeetingFromTimedEvent(params.timedEvent);
    params.meetingBoard = sol.meeting.Utils.getMeetingBoardFromMeeting(params.meeting);

    params.mapIndex = me.getMapIndex(params);
    params.searchTemplate = me.getSearchTemplate(params);
    params.notificationTemplate = me.getNotificationTemplate(params);

    return params;
  },

  getTimedEvent: function () {
    var me = this;
    return me.isTimedEent(me.sord)
      ? me.sord
      : null;
  },

  isTimedEent: function (sord) {
    return sol.common.ObjectUtils.getProp(sord, "objKeys.SOL_TYPE") == "TIMED_EVENT";
  },

  getMeetingFromTimedEvent: function (timedEvent) {
    var me = this;

    return sol.meeting.Utils.getFormattedSord(
      sol.common.RepoUtils.getSord(
        me.getTimedEventSourceId(timedEvent)
      )
    );
  },

  getTimedEventSourceId: function (timedEvent) {
    return sol.common.ObjectUtils.getProp(timedEvent, "objKeys.TIMED_EVENT_SOURCE");
  },

  getMapIndex: function (params) {
    return sol.common.ObjectUtils.getProp(params, "timedEvent.mapKeys.MEETING_NOTIFICATION_MAP_INDEX");
  },

  getSearchTemplate: function (params) {
    var me = this,
        value = (me.getSearchTemplateName(params) || "").split(" -")[0];

    return me.getSearchTemplatesAsArray()
      .filter(me.utils.equals.bind(me, "key", value))
      .reduce(me.utils.getFirstResult, null);
  },

  getSearchTemplateName: function (params) {
    var me = this,
        key = "meeting.mapKeys.MEETING_NOTIFICATION_RECIPIENTS_" + me.getMapIndex(params);

    return sol.common.ObjectUtils.getProp(params, key);
  },

  getSearchTemplatesAsArray: function () {
    var me = this;

    return Object.keys(me.searchTemplates || {})
      .map(function (key) {
        return me.searchTemplates[key];
      });
  },

  getNotificationTemplate: function (params) {
    var me = this;

    return sol.meeting.Utils.getFormattedSord(
      sol.common.RepoUtils.getSord(
        me.getNotificationTemplateArcPath(params)
      )
    );
  },

  getNotificationTemplateArcPath: function (params) {
    var me = this;

    return me.getNotificationTemplateFolder(params) + "/" + me.getNotificationTemplateName(params);
  },

  getNotificationTemplateFolder: function (params) {
    var _params = params;
    _params.source = params.meetingBoard;

    return sol.common.TemplateUtils.render(
      sol.common.ObjectUtils.getProp(_params, "source.mapKeys.TARGET_PATH_NOTIFICATION_TEMPLATES"),
      _params
    );
  },

  getNotificationTemplateName: function (params) {
    var me = this,
        key = "meeting.mapKeys.MEETING_NOTIFICATION_TEMPLATE_" + me.getMapIndex(params);

    return sol.common.ObjectUtils.getProp(params, key);
  },

  getRecipients: function (params) {
    var me = this,
        sordProviderArgs = me.sordProviderArgs,
        searchResults;


    sordProviderArgs.search = params.searchTemplate.removeEmptyValues
      ? me.removeEmptyValuesFromSearchEntries(params.searchTemplate.search)
      : params.searchTemplate.search;

    sordProviderArgs.output = params.searchTemplate.output || sordProviderArgs.output;
    sordProviderArgs.optimizationKey = params.searchTemplate.output
      ? params.searchTemplate.optimizationKey
      : "notificationRecipientSearch";

    sordProviderArgs.options = params.searchTemplate.options || sordProviderArgs.options;

    sordProviderArgs.filter = params.searchTemplate.filter || sordProviderArgs.filter;

    searchResults = (me.search(
      sol.common.TemplateUtils.render(sordProviderArgs, params),
      sordProviderArgs.optimizationKey
    ) || {}).sords || [];

    return params.searchTemplate.mapping
      ? searchResults.map(function (searchResult) {
        return sol.common.TemplateUtils.render(
          params.searchTemplate.mapping,
          searchResult
        );
      })
      : searchResults;
  },

  search: function (args, optimizationKey) {
    var me = this;

    return optimizationKey
      ? sol.common.IxUtils.optimizedExecute(
        "RF_sol_common_service_SordProvider",
        args,
        me._optimize,
        optimizationKey,
        ["output"]
      )
      : sol.common.IxUtils.execute(
        "RF_sol_common_service_SordProvider",
        args
      );
  },

  removeEmptyValuesFromSearchEntries: function (entries) {
    return (entries || [])
      .filter(function (entry) {
        return !!entry.value;
      });
  },

  enhanceRecipient: function (params, recipient) {
    var _params = sol.common.ObjectUtils.clone(params);
    _params.recipient = recipient;

    return {
      recipient: _params.recipient,
      notificationTemplate: sol.common.TemplateUtils.render(
        _params.notificationTemplate,
        _params
      )
    };
  },

  utils: {
    equals: function (attribute, value, obj) {
      return obj[attribute] == value;
    },
    getFirstResult: function (acc, template) {
      return acc || template;
    }
  }
});



/**
 * @member sol.meeting.ix.services.CollectNotificationData
 * @method RF_sol_meeting_service_CollectNotificationData
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionName
 */
function RF_sol_meeting_service_CollectNotificationData(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  fun = sol.create("sol.meeting.ix.services.CollectNotificationData", rfArgs);
  return JSON.stringify(fun.process());
}
