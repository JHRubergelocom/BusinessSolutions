
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.TemplateUtils" });

/**
 * Unittests of Methods in 'sol.common.TemplateUtils'.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_TemplateUtils', {
 *       tpl: ....
 *       tplData: ...,
 *       options: { emptyNonRendered: true, stringifyResults:true }
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.as.BarcodeUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.Template
 */
sol.define("sol.unittest.ix.services.TemplateUtils", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["tpl", "tplData", "options"],

  /**
   * @cfg {String} tpl Template tpl as a string.
   */

  /**
   * @cfg {String} tplData JavaScript-Object to render.
   */

  /**
   * @cfg {Object} options. renderoptions { emptyNonRendered: true, stringifyResults:true }
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the render method and returns the result
   * @return {String} result of render method
   */
  process: function () {
    var me = this,
        result;

    result = sol.common.TemplateUtils.render(me.tpl, me.tplData, me.options);
    return result;
  }
});

/**
 * @member sol.unittest.ix.services.TemplateUtils
 * @method RF_sol_unittest_service_TemplateUtils
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_TemplateUtils(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_TemplateUtils", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "tpl", "tplData", "options");
  service = sol.create("sol.unittest.ix.services.TemplateUtils", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_TemplateUtils", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

