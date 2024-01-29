
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.XmlUtils.js
//@include lib_sol.common.ZipUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib5" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib5', {
 *       className: 'sol.unittest.ix.ActionBase',
 *       classConfig: {}
 *       method: 'getName',
 *       params: []
 *     });
 *
 * *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.ExecuteLib5", {
  extend: "sol.common.ix.ServiceBase",

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
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        cls, func, dir;

    me.classConfig.ec = me.ec;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.XmlBuilder":
      case "sol.common.XmlUtils":
        return result;
      case "sol.common.ZipUtils":
        switch (me.method) {
          case "compressFolder":
            dir = new File(me.params[0]);
            if (dir.exists()) {
              dir.delete();
            }
            dir.mkdir();
            me.params[0] = dir;
            break;
          case "deleteFilesInZipFileFolder":
          case "existsFilePathInZip":
          case "readFileInZipToByteArray":
          case "readFileInZipToString":
          case "unzip":
          case "visitFile":
          case "zipFolder":
            return result;
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

    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib5
 * @method RF_sol_unittest_service_ExecuteLib5
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib5(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib5", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib5", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib5", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

