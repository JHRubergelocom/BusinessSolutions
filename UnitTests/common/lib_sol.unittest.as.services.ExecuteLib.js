
/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
 *       action: "sol.unittest.as.services.ExecuteLib",
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
sol.define("sol.unittest.as.services.ExecuteLib", {
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
        cls, func, bytes, byte, i, string, inputstream,
        excelDocument, cell, cells,
        pdfFilePath, pdfFile, pdfFileOutPutName,
        tempDir;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.as.BarcodeUtils":
        switch (me.method) {
          case "convertByteArrayToBase64":
            bytes = [];
            for (i = 0; i < me.params[0].length; i++) {
              string = me.params[0][i];
              byte = java.lang.Byte.parseByte(string);
              bytes.push(byte);
            }
            me.params[0] = bytes;
            break;
          case "createOutput":
            me.params[0] = cls.createQrCode(me.params[0], me.params[1]);
            break;
          default:
        }
        break;
      case "sol.common.as.ExcelDocument":
      case "sol.common.as.MapiMessage":
      case "sol.common.as.PowerPointDocument":
      case "sol.common.as.VisioDocument":
      case "sol.common.as.WordDocument":
        cls.openFromRepo({ objId: me.classConfig.objId });
        switch (me.method) {
          case "open":
            me.params[0] = sol.common.RepoUtils.downloadToStream(me.classConfig.objId);
            break;
          case "save":
            inputstream = sol.common.RepoUtils.downloadToStream(me.classConfig.objId);
            cls.open(inputstream);
            me.params[1] = cls.getSaveParams(me.classConfig.saveToRepoConfig);
            me.params[0] = new ByteArrayOutputStream();
            break;
          case "savePDF":
            me.params[0] = new ByteArrayOutputStream();
            break;
          case "openFile":
            cls.saveFile({ format: me.classConfig.format, filePath: me.classConfig.file });
            break;
          case "copyProperties":
            me.params[0] = new java.lang.Object();
            me.params[1] = new java.lang.Object();
            break;
          default:
        }
        break;
      case "sol.common.as.PdfUtils":
        switch (me.method) {
          case "getNumberOfPages":
            tempDir = sol.common.FileUtils.getTempDirPath();
            pdfFilePath = sol.common.RepoUtils.downloadToFile(me.classConfig.objId, { dstDirPath: tempDir, createDirs: true, createUniqueFileName: true });
            pdfFile = new File(pdfFilePath);
            me.params[0] = [pdfFile];
            break;
          case "mergePdfFiles":
            tempDir = sol.common.FileUtils.getTempDirPath();
            pdfFilePath = sol.common.RepoUtils.downloadToFile(me.classConfig.objId, { dstDirPath: tempDir, createDirs: true, createUniqueFileName: true });
            me.params[0] = pdfFilePath;
            me.params[0] = [me.params[0]];
            pdfFileOutPutName = "Output.pdf";
            if (new File(pdfFileOutPutName).exists()) {
              new File(pdfFileOutPutName).delete();
            }
            me.params[1] = pdfFileOutPutName;
            break;
          case "mergePdfStreams":
            inputstream = sol.common.RepoUtils.downloadToStream(me.classConfig.objId);
            me.params[0] = [inputstream];
            me.params[1] = new ByteArrayOutputStream();
            break;
          default:
        }
        break;
      case "sol.common.as.renderer.Excel":
        switch (me.method) {
          case "copyObject":
          case "expandRowSord":
          case "readHeaderFromSord":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbMin), LockC.NO);
            break;
          case "fillExcelSpreadsheet":
            excelDocument = sol.create("sol.common.as.ExcelDocument", {});
            excelDocument.openFromRepo({ objId: me.classConfig.templateId });
            me.params[0] = excelDocument;
            break;
          case "prepareColumnMapping":
          case "readHeader":
            excelDocument = sol.create("sol.common.as.ExcelDocument", {});
            excelDocument.openFromRepo({ objId: me.classConfig.templateId });
            cls.fillExcelSpreadsheet(excelDocument, {});
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbMin), LockC.NO);
            break;
          case "prepareHeader":
          case "readHeaderFromWorksheet":
          case "writeLine":
            excelDocument = sol.create("sol.common.as.ExcelDocument", {});
            excelDocument.openFromRepo({ objId: me.classConfig.templateId });
            cls.fillExcelSpreadsheet(excelDocument, {});
            break;
          case "isDate":
          case "isNumber":
            excelDocument = sol.create("sol.common.as.ExcelDocument", {});
            excelDocument.openFromRepo({ objId: me.classConfig.templateId });
            cls.fillExcelSpreadsheet(excelDocument, {});
            cells = cls._worksheet.getCells();
            cell = cells.getCell(0, 0);
            me.params[0] = cell;
            break;
          case "writeData":
            me.params[0] = [ixConnect.ix().checkoutSord([me.params[0]], new SordZ(SordC.mbMin), LockC.NO)];
            excelDocument = sol.create("sol.common.as.ExcelDocument", {});
            excelDocument.openFromRepo({ objId: me.classConfig.templateId });
            cls.fillExcelSpreadsheet(excelDocument, {});
            cls.prepareColumnMapping(me.params[0][0]);
            break;
          default:
        }
        break;
      case "sol.common.as.Utils":
        switch (me.method) {
          case "ensureRelogin":
            me.params[0] = ixConnect;
            break;
          default:
        }
        break;
      case "sol.common.as.WfController":
        switch (me.method) {
          case "calculateErrorUser":
          case "calculatePreviousUser":
          case "getNextNodes":
          case "getNodeConfig":
          case "handleControllerFunction":
          case "handleDirectRule":
          case "handleException":
          case "run":
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

    switch (me.className) {
      case "sol.common.as.BarcodeUtils":
        switch (me.method) {
          case "createCode39":
          case "createItfCode":
          case "createQrCode":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common.as.ExcelDocument":
      case "sol.common.as.PowerPointDocument":
      case "sol.common.as.VisioDocument":
      case "sol.common.as.WordDocument":
        switch (me.method) {
          case "getCells":
            result = "";
            break;
          case "getSaveParamsCSV":
          case "getSaveParamsHTML":
          case "getSaveParamsPDF":
          case "getSaveParamsDOCX":
          case "getSaveParams":
          case "loadPartDocument":
          case "saveToStream":
            result = String(result);
            break;
          case "open":
            me.params[0].close();
            break;
          case "save":
          case "savePDF":
            me.params[0].close();
            result = "";
            break;
          default:
        }
        break;
      case "sol.common.as.ExporterBase":
        switch (me.method) {
          case "getTemplateExtension":
            result = String(result);
            break;
          default:
        }
        break;
      case "sol.common.as.PdfUtils":
        switch (me.method) {
          case "mergePdfStreams":
            me.params[1].close();
            break;
          default:
        }
        break;
      case "sol.common.as.renderer.Excel":
        switch (me.method) {
          case "copyObject":
          case "expandRowSord":
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

sol.define("sol.unittest.as.ActionBase", {
  extend: "sol.common.as.ActionBase",

  getName: function () {
    return "ActionBase";
  },

  process: function () {
    return {};
  }

});

sol.define("sol.unittest.as.FunctionBase", {
  extend: "sol.common.as.FunctionBase",

  process: function () {
    return {};
  }

});

