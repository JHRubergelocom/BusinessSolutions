
//@include lib_Class.js

/**
 * PDF utilities
 *
 * @author MW, ELO Digital Office GmbH
 *
 * @eloas
 *
 * @requires sol.common.RepoUtils
 */

sol.define("sol.common.as.PdfUtils", {

  singleton: true,

  /**
   * Merges PDF streams
   * @param {Array} inputStreams PDF input streams
   * @param {java.io.OutputStream} outputStream
   */
  mergePdfStreams: function (inputStreams, outputStream) {
    var me = this,
        pdfBoxVersion, pdfMerger;

    if (!inputStreams) {
      throw "Input streams are empty";
    }

    pdfBoxVersion = (new Packages.org.apache.pdfbox.pdmodel.PDDocument()).class.package.implementationVersion;
    me.logger.debug(["PDF box version: {0}", pdfBoxVersion]);

    if (pdfBoxVersion > "2.0.0") {
      pdfMerger = new Packages.org.apache.pdfbox.multipdf.PDFMergerUtility();
    } else {
      pdfMerger = new Packages.org.apache.pdfbox.util.PDFMergerUtility();
    }

    inputStreams.forEach(function (inputStream) {
      pdfMerger.addSource(inputStream);
    });

    pdfMerger.destinationStream = outputStream;
    pdfMerger.mergeDocuments(Packages.org.apache.pdfbox.io.MemoryUsageSetting.setupTempFileOnly());

    inputStreams.forEach(function (inputStream) {
      inputStream.close();
    });
  },

  /**
   * Merges PDF files
   * @param {Array} inputFileNames PDF input file names
   * @param {String} outputFileName
   */
  mergePdfFiles: function (inputFileNames, outputFileName) {
    var me = this,
        pdfBoxVersion, pdfMerger;

    if (!inputFileNames) {
      throw "Input filenames are empty";
    }

    pdfBoxVersion = (new Packages.org.apache.pdfbox.pdmodel.PDDocument()).class.package.implementationVersion;
    me.logger.debug(["PDF box version: {0}", pdfBoxVersion]);

    if (pdfBoxVersion > "2.0.0") {
      pdfMerger = new Packages.org.apache.pdfbox.multipdf.PDFMergerUtility();
    } else {
      pdfMerger = new Packages.org.apache.pdfbox.util.PDFMergerUtility();
    }

    inputFileNames.forEach(function (inputFileName) {
      pdfMerger.addSource(inputFileName);
    });

    pdfMerger.destinationFileName = outputFileName;
    pdfMerger.mergeDocuments(Packages.org.apache.pdfbox.io.MemoryUsageSetting.setupTempFileOnly());
  },

  /**
   * Get number of pages in PDF file
   * @param {java.io.File} dstFile
   * @return {Number} numOfPages
   */
  getNumberOfPages: function (pdfFile) {
    var me = this,
        pdfFileExtension, doc, numOfPages;

    me.logger.debug(["pdfFile= {0}", pdfFile]);
    pdfFileExtension = sol.common.FileUtils.getExtension(pdfFile);
    pdfFileExtension = pdfFileExtension.toLowerCase();

    if ((pdfFile == null) || (pdfFileExtension != "pdf")) {
      me.logger.debug(["Illegal input for the pdf file, execution will be aborted"]);
      return 0;
    }

    try {
      doc = new Packages.org.apache.pdfbox.pdmodel.PDDocument.load(pdfFile);
      numOfPages = doc.getNumberOfPages();
      me.logger.debug(["numOfPages= {0}", numOfPages]);
    } finally {
      doc.close();
    }

    return numOfPages;
  }

});
