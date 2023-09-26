
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

  createExportDirPath: function (folderName) {
    var me = this,
        tempDirBasePath, timestamp, exportDirPath, exportDirPathFile;

    tempDirBasePath = sol.common.FileUtils.getTempDirPath();
    timestamp = sol.common.FileUtils.getTimeStampString();
    exportDirPath = tempDirBasePath + File.separator + "temp" + "_" + timestamp + java.io.File.separator + folderName;
    exportDirPathFile = new File(exportDirPath);
    if (!exportDirPathFile.exists()) {
      try {
        exportDirPathFile.mkdirs();
      } catch (e) {
        me.logger.error("error creating destination directory", e);
      }
    }
    return exportDirPath;
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {},
        cls, func, exportDirPath, sord, pdfInputStream, templateId, data,
        fopRenderer, fopResult, pdfOutputStream, config;

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
          case "disposeUserConnection":
            me.params[0] = ixConnect;
            break;
          case "FUNCTION":
          case "REMINDER":
          case "TECHNICAL_WORKFLOW":
          case "WORKFLOW":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            func = cls.ACTIONS[me.method];
            break;
          default:
        }
        break;
      case "sol.common_document.as.Utils":
        config = sol.common_document.Utils.loadConfigExport();
        switch (me.method) {
          case "convertEmlFileToPdf":
          case "convertGraphicFileToPdf":
          case "convertGraphicToPdf":
          case "convertHtmlFileToPdf":
          case "convertHtmlToPdf":
          case "convertTextFileToPdf":
          case "convertTextToPdf":
          case "createPdfStreamFromHtml":
          case "getActions":
          case "getGraph":
          case "setAnnotationStamp":
          case "setLineMarker":
          case "setRectangleMarker":
          case "setStickyNote":
            return result;
          case "convertOutputStreamToInputStream":
            me.params[0] = new ByteArrayOutputStream();
            break;
          case "convertPDFtoPDFA":
            exportDirPath = me.createExportDirPath("folderName1");
            sord = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            pdfInputStream = cls.convertToPdf(sord);
            me.params[0] = cls.writePdfInputStreamToFile(pdfInputStream, exportDirPath, "pdfName1");
            break;
          case "convertToPdf":
          case "getRefPath":
          case "getPdfName":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "convertEmlWithAttchmentToPdf":
          case "convertMsgWithAttchmentToPdf":
          case "setPagination":
            return result;
          case "getTemplateCoverSheetSord":
          case "getMarginNotes":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[1] = config;
            break;
          case "createContent":
          case "createContentFile":
            exportDirPath = me.createExportDirPath(me.params[0]);
            me.params[1] = exportDirPath;
            me.params[2] = config;
            break;
          case "createCoverSheetSord":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[1] = exportDirPath;
            me.params[3] = config;
            break;
          case "createErrorConversionPdf":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[2] = exportDirPath;
            me.params[3] = config;
            break;
          case "createPdfDocument":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[1] = exportDirPath;
            me.params[2] = config;
            break;
          case "createPdfFromSord":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[1] = cls.getTemplateCoverSheetSord(me.params[0], config);
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[2] = exportDirPath;
            me.params[5] = config;
            break;
          case "exportFolder":
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[1] = exportDirPath;
            me.params[2] = config;
            break;
          case "getExportFolder":
          case "getTemplateContents":
          case "getTemplateErrorConversionPdf":
            me.params[0] = config;
            break;
          case "getOffsetSumPages":
            exportDirPath = me.createExportDirPath("folderName1");
            me.params[1] = exportDirPath;
            me.params[2] = config;
            break;
          case "pdfExport":
            me.params[2] = config;
            break;
          case "writePdfInputStreamToFile":
          case "writeInputStreamToFile":
            exportDirPath = me.createExportDirPath("folderName1");
            sord = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            pdfInputStream = cls.convertToPdf(sord);
            me.params[0] = pdfInputStream;
            me.params[1] = exportDirPath;
            break;
          case "writePdfOutputStreamToFile":
            exportDirPath = me.createExportDirPath("folderName1");
            templateId = cls.getTemplateContents(config);
            data = {};
            data.header = { name: "folderName1" };
            data.contents = [];
            fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: templateId, toStream: true });
            fopResult = fopRenderer.render("Content", data);
            pdfOutputStream = fopResult.outputStream;
            me.params[0] = pdfOutputStream;
            me.params[1] = exportDirPath;
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
          case "getColor":
            result = String(result);
            break;
          case "convertOutputStreamToInputStream":
            result.close();
            result = String(result);
            break;
          case "createContent":
            sol.common.FileUtils.delete(exportDirPath, { quietly: true });
            result.close();
            result = String(result);
            break;
          case "createContentFile":
            sol.common.FileUtils.delete(exportDirPath, { quietly: true });
            result = String(result);
            break;
          case "convertPDFtoPDFA":
          case "writePdfInputStreamToFile":
          case "writeInputStreamToFile":
          case "writePdfOutputStreamToFile":
            sol.common.FileUtils.delete(exportDirPath, { quietly: true });
            result = String(result);
            break;
          case "createCoverSheetSord":
          case "createErrorConversionPdf":
          case "createPdfDocument":
          case "createPdfFromSord":
          case "exportFolder":
          case "getOffsetSumPages":
            sol.common.FileUtils.delete(exportDirPath, { quietly: true });
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


