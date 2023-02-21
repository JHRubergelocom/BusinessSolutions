
/**
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */

var logger = sol.create("sol.Logger", {
  scope: "sol.unittest.as.services.Test"
});

sol.define("sol.unittest.as.services.Test", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} id id.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },
  
  convertPowerPointFileToPdf: function (sourceFile, targetFile) {
    var outputStream, presentation, fontFolders, i;

    sourceFile = new File(sourceFile);
    targetFile = new File(targetFile);

    logger.enter("convertPowerPointFileToPdf");
    logger.info(["Start convertPowerPointFileToPdf with sourceFile: '{0}', targetFile: '{1}'", sourceFile, targetFile]);
    logger.info(["sourceFile: {0}, targetFile: {1}", sourceFile, targetFile]);

    outputStream = null;
    try {
      // TODO load fonts
      fontFolders = Packages.com.aspose.slides.FontsLoader.getFontFolders();  
      if (fontFolders.length == 0) {
        fontFolders = [];
        fontFolders.push(new java.lang.String("/var/elo/fonts/arial.ttf"));
      }
      logger.info(["fontFolders.length = '{0}'", String(fontFolders.length)]);
      for (i = 0; i < fontFolders.length; i++) {
        logger.info(["fontFolder were loaded '{0}'", String(fontFolders[i])]);
      }
     
      Packages.com.aspose.slides.FontsLoader.loadExternalFonts(fontFolders);
      logger.info("ExternalFonts were loaded");
      // TODO load fonts

      presentation = new Packages.com.aspose.slides.Presentation(sourceFile.getPath());
      logger.info("MS Power Point file was loaded");
      outputStream = new FileOutputStream(targetFile);
      presentation.save(outputStream, Packages.com.aspose.slides.SaveFormat.Pdf);
      logger.info(["save targetFile: '{0}'", targetFile]);
      logger.info("Presentation.save");
      logger.info("PDF file was created");
    } catch (ex) {
      logger.info(["error converting document sourceFile: '{0}', targetFile: '{1}'", sourceFile, targetFile], ex);    
    } finally {
      if (outputStream != null) {
        outputStream.close();
      }
    }

    logger.info(["Finish convertPowerPointFileToPdf"]);
    logger.exit("convertPowerPointFileToPdf");
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        newObjId;

    if (me.windows) {
      me.convertPowerPointFileToPdf("C:\\Temp\\PdfExport\\PdfExportPowerPt.pptx", "C:\\Temp\\PdfExport\\PdfExportPowerPt.pdf");
    } else {
      me.convertPowerPointFileToPdf("/var/elo/servers/ELO-base/temp/Bibliotheken und IndexServer-Bausteine Vorstellung.pptx", "/var/elo/servers/ELO-base/temp/Bibliotheken und IndexServer-Bausteine Vorstellung.pdf");
    }

    return newObjId;           
  }
});
