
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_decimal-light.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.DecimalUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common_document.BatchImportData.js
//@include lib_sol.connector_xml.Converter.js
//@include lib_sol.connector_xml.DocumentImporter.js
//@include lib_sol.connector_xml.Importer.js
//@include lib_sol.connector_xml.Utils.js
//@include lib_sol.dev.BuildPackages.js
//@include lib_sol.dev.DateShiftUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib1', {
 *       className: 'sol.common.DecimalUtils',
 *       classConfig: {}
 *       method: 'configureDecimals',
 *       params: []
 *     });
 *
 * *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.ExecuteLib1", {
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
        cls, func, xml, dir;

    switch (me.className) {
      case "sol.common_document.BatchImportData":
        me.classConfig.parser = sol.create("sol.unittest.Parser");
        break;
      case "sol.connector_xml.Converter.DateConverter":
        return result;
      case "sol.dev.BuildPackage":
        switch (me.method) {
          case "downloadIxPlugin":
          case "downloadIxPlugins":
            dir = new File("pluginDirUnittest");
            if (dir.exists()) {
              dir.delete();
            }
            me.classConfig.buildConfig.ixPluginsDir = dir;
            me.classConfig.buildConfig.ixPluginsDirPath = "pluginDirUnittest";
            break;
          case "getBuildConfig":
            me.classConfig.packageSord = ixConnect.ix().checkoutSord("ARCPATH:/Administration/Business Solutions/dev_internal", new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.ObjectUtils":
        switch (me.method) {
          case "arrayFind":
          case "forEach":
          case "map":
            me.params[1] = function () {
              return true;
            };
            break;
          case "isDate":
            me.params[0] = new Date();
            break;
          case "isFunction":
            me.params[0] = function () {
              return true;
            };
            break;
          case "isJavaObject":
            me.params[0] = new File("File1");
            break;
          case "isRegExp":
            me.params[0] = new RegExp("ab+c", "i");
            break;
          case "traverse":
            me.params[1] = function (key, obj) {
            };
          default:
        }
        break;
      case "sol.common_document.BatchImportStatus":
        switch (me.method) {
          case "proceed":
            cls.start(0);
            break;
          case "start":
            cls.stop();
          default:
        }
        break;
      case "sol.connector_xml.Converter":
        switch (me.method) {
          case "register":
            me.params[0] = "UnittestConverter";
            me.params[1] = sol.unittest.Converter.DefaultConverter;
            break;
          default:
        }
        break;
      case "sol.connector_xml.DocumentImporter":
        switch (me.method) {
          case "getInstance":
            func = cls.impl[me.method];
            break;
          case "process":
          case "validate":
          case "writeMetadata":
          case "getStreamSource":
            me.params[0] = sol.common.FileUtils.downloadDocument(me.params[0], "");
            break;
          case "readXmlData":
            xml = "<?xml version='1.0\'?><import></import>";
            cls.doc = cls.utils.getDocument(cls.documentBuilder, xml);
            break;
          default:
        }
        break;
      case "sol.connector_xml.Importer":
        switch (me.method) {
          case "process":
            me.params[0] = sol.common.FileUtils.downloadDocument(me.params[0], "");
            break;
          case "processTable":
            xml = "<?xml version='1.0\'?><import></import>";
            cls.doc = cls.utils.getDocument(cls.documentBuilder, xml);
            break;
          case "validate":
            me.params[0] = sol.common.FileUtils.downloadDocument(me.params[0], "");
            break;
          default:
        }
        break;
      case "sol.connector_xml.Utils":
        switch (me.method) {
          case "getDocument":
            me.params[0] = cls.getDocumentBuilder();
            break;
          case "getElementString":
          case "getElements":
          case "getValue":
          case "xmlToString":
            xml = "<?xml version='1.0\'?><import>import1</import>";
            me.params[0] = cls.getDocumentBuilder();
            me.params[0] = cls.getDocument(me.params[0], xml);
            break;
          case "handleImportAction":
          case "importDocument":
          case "importNewDocument":
          case "importNewVersion":
          case "writeErrorLog":
            me.params[0] = sol.common.FileUtils.downloadDocument(me.params[0], "");
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
      case "sol.common.ObjectUtils":
        switch (me.method) {
          case "toJavaArray":
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

/**
 * @member sol.unittest.ix.services.ExecuteLib1
 * @method RF_sol_unittest_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

sol.define("sol.unittest.Parser", {

  supportsFileType: function (extension) {
    return true;
  },

  parse: function (objId) {
    return [];
  }

});

sol.define("sol.unittest.Converter.DefaultConverter", {
  singleton: true,

  convert: function (value) {
    return value;
  }
});

