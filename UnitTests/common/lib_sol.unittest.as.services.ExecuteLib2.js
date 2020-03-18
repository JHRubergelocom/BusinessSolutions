
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.as.services.ExecuteLib2",
 *       config: {
 *         className: "sol.common_document.as.functions.ReadExcelTable",
 *         classConfig: { objId: 4713 },
 *         method: "initialize",
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
sol.define("sol.unittest.as.services.ExecuteLib2", {
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
        cls, func, tempDirBasePath, timestamp, exportDirPath, exportDirPathFile;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common_document.as.actions.PrepareDocument":
        switch (me.method) {
          case "createEmptyDocument":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common.as.functions.CreateSignedPdf":
        switch (me.method) {
          case "convertOutputStreamToInputStream":
            me.params[0] = new ByteArrayOutputStream();
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.executors.SimpleExecutor":
        switch (me.method) {
          case "buildName":
          case "execute":
          case "executeAction":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "eveluateActionProperty":
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.common_document.as.Utils":
        cls.config = sol.common_document.Utils.loadConfigExport();
        switch (me.method) {
          case "convertOutputStreamToInputStream":
            me.params[0] = new ByteArrayOutputStream();
            break;
          case "convertToPdf":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "createContent":
            tempDirBasePath = sol.common.FileUtils.getTempDirPath(); 
            timestamp = sol.common.FileUtils.getTimeStampString();   
            exportDirPath = tempDirBasePath + File.separator + "temp" + "_" + timestamp + java.io.File.separator + me.params[0];        
            me.params[1] = exportDirPath;
            exportDirPathFile = new File(exportDirPath);
            if (!exportDirPathFile.exists()) {
              try {
                exportDirPathFile.mkdirs();
              } catch (e) {
                me.logger.error("error creating destination directory", e);
              }
            }        
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
      case "sol.common.as.functions.CreateSignedPdf":
        switch (me.method) {
          case "convertOutputStreamToInputStream":
            result.close();
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common_monitoring.as.executors.SimpleExecutor":
        switch (me.method) {
          case "buildName":
          case "getConnection":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common_document.as.Utils":
        switch (me.method) {
          case "convertOutputStreamToInputStream":
            result.close();
            result = String(result);
            break;
          case "createContent":
            sol.common.FileUtils.delete(exportDirPath, { quietly: true });
            result.close();
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

sol.define("sol.unittest.as.executors.SimpleExecutor", {
  process: function () {
    return {};
  }
});


