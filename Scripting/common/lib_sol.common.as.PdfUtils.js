
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
    pdfMerger.mergeDocuments();

    inputStreams.forEach(function (inputStream) {
      inputStream.close();
    });
  }
});
