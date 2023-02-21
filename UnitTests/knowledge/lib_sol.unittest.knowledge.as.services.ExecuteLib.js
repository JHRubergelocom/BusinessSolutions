
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.knowledge.as.services.ExecuteLib",
 *       config: {
 *         className: "ssol.knowledge.as.actions.PrepareDocument",
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
sol.define("sol.unittest.knowledge.as.services.ExecuteLib", {
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
        cls, func;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.knowledge.as.Utils":
        cls.cfgCategoryBadges = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/badges.config" }).config.category;
        cls.cfgReputation = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/reputation.config" }).config;
        break;
      default:
    }

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    switch (me.className) {
      case "sol.knowledge.as.CleanupImages":
        switch (me.method) {
          case "retrieveFileDocuments":
          case "retrieveImageDocuments":
          case "collectDocuments":
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
