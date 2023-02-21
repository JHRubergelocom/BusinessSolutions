
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.invoice.as.services.ExecuteLib",
 *       config: {
 *         className: "ssol.invoice.as.actions.PrepareDocument",
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
sol.define("sol.unittest.invoice.as.services.ExecuteLib", {
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
        cls, func, invoiceConfig, dir;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.connector_dx.as.functions.Export":
        switch (me.method) {
          case "createTemplateSord":
          case "createXml":
          case "hasDxMask":
          case "process":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "exportFiles":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.export.HtmlLog":
        switch (me.method) {
          case "saveExportLog":
            cls.HTMLSTYLES = sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES;
            me.params[1] = new java.util.Date();
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.functions.Export":
        switch (me.method) {
          case "exportInvoices":
          case "getKeyIndex":
          case "readInvoices":
          case "writeDatevExport":
            cls.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();
            break;
          case "writeDataSet":
            cls.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.Utils":
        switch (me.method) {
          case "getDateValue":
            cls.HTMLSTYLES = sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES;
            me.params[1] = new java.lang.String(me.params[1]);
            break;
          case "getDocument":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "getNumericValue":
            me.params[2] = new java.lang.String(me.params[2]);
            break;
          case "padding_left":
          case "padding_right":
            me.params[0] = new java.lang.String(me.params[0]);
            me.params[1] = new java.lang.String(me.params[1]);
            break;
          case "setContent":
            cls.invoiceDatevConfig = cls.getConfig();
            break;
          default:
        }
        break;
      case "sol.invoice_electronic.as.functions.ExtractData":
        switch (me.method) {
          case "getElectronicInvoiceType":
            new File(me.params[0]).createNewFile();
            sol.common.FileUtils.writeStringToFile(me.params[0], "<?xml version=\"1.0\"?><Items></Items>");
            break;
          case "getInvoiceXmlFilePath":
            me.params[0] = sol.common.FileUtils.createTempDir(me.params[0]);
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.invoice.as.InvoiceXmlImporter":
        switch (me.method) {
          case "run":
            invoiceConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;
            dir = new File(invoiceConfig.importXML.importDirectory.value);
            if (dir.exists()) {
              dir.delete();
            }
            dir.mkdirs();
            break;
          case "startInvoiceWorkflow":
            me.params[0] = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config;
            return result;
          default:
        }
        break;

      case "sol.invoice_electronic.as.ExtractDataTest":
        switch (me.method) {
          case "processSord":
            return result;
          default:
        }
        break;
      case "sol.invoice_electronic.as.postProcessing.XRechnung":
        switch (me.method) {
          case "process":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "setPaymentTerms":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[0] = sol.common.SordUtils.getTemplateSord(me.params[0]).sord;
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
      case "sol.connector_dx.as.functions.Export":
        switch (me.method) {
          case "exportFiles":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.functions.Export":
        switch (me.method) {
          case "process":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.invoice_datev.as.Utils":
        switch (me.method) {
          case "getDocument":
          case "getLanguageTextEscapeHTML":
          case "getNumericValue":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.invoice_electronic.as.functions.ExtractData":
        switch (me.method) {
          case "getInvoiceXmlFilePath":
            Packages.org.apache.commons.io.FileUtils.deleteQuietly(me.params[0]);
            break;
          default:
        }
        break;
      default:
    }

    return result;
  }
});
