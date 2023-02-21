
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.productivity.as.services.ExecuteLib",
 *       config: {
 *         className: "ssol.productivity.as.actions.PrepareDocument",
 *         classConfig: {},
 *         method: "getName",
 *         params: []
 *       }
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */
sol.define("sol.unittest.productivity.as.services.ExecuteLib", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        cls, func, notifyConfig;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.notify.as.Utils":
        switch (me.method) {
          case "createMailNotifyBody":
            notifyConfig = sol.notify.Utils.loadNotifyConfig();
            me.params[0] = notifyConfig.mailTemplates.tasks;
            break;
          case "prepareTask":
            cls.cfgNotifyMail = sol.notify.Utils.loadNotifyConfig().email;
            me.params[1].wfNode = new WFCollectNode();
            me.params[1].wfNode.timeLimitEscalations = [];
            break;
          case "isOverTimeLimit":
            me.params[0] = new WFCollectNode();
            me.params[0].timeLimitEscalations = [];
            break;
          case "getFeedAggregation":
          case "getNotifyPublicWfBaseUrl":
          case "getNotifyWfBaseUrl":
          case "getPictureUrl":
          case "loadReportFlags":
          case "loadUserLanguage":
          case "loadUserTimeZone":
          case "processNotifyMail":
            cls.notifyConfig = sol.notify.Utils.loadNotifyConfig();
            cls.cfgNotifyMail = sol.notify.Utils.loadNotifyConfig().email;
            break;
          case "processTask":
            me.params[0].wfNode = new WFCollectNode();
            break;
          default:
        }
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    switch (me.className) {
      case "sol.notify.as.Utils":
        switch (me.method) {
          case "getMailAddress":
          case "getTemplateSordInstance":
          case "getUserName":
          case "loadUserTimeZone":
          case "prepareFindTasksInfo":
            result = String(result);
            break;
          default:
        }
        break;
      default:
    }

    return result;
  }
});
