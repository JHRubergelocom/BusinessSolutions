
/**
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */
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

  /**
   * Write inputstream to file
   * @private
   * @param {java.io.InputStream} inputStream
   * @param {String} dstDirPath
   * @param {String} fileName
   * @param {String} fileFormat
   * @return {java.io.File} dstFile
   */
  writeInputStreamToFile: function (inputStream, dstDirPath, fileName, fileFormat) {
    var me = this, 
        dstFile;

    me.logger.enter("writePdfInputStreamToFile");
    me.logger.info(["Start writePdfInputStreamToFile with dstDirPath: '{0}', fileName: '{1}', fileFormat: '{2}'", dstDirPath, fileName, fileFormat]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + fileName + "." + fileFormat);
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(inputStream, dstFile);

    me.logger.info(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  /**
   * Converts a file to a PDF.
   * @private
   * @param {String} filePath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertFileToPdf: function (filePath) {
    var me = this,
        inputStream = null,
        ext, converter;

    me.logger.enter("convertFileToPdf");
    me.logger.info(["Start convertFileToPdf with sord: '{0}'", filePath]);

    try {
      ext = sol.common.FileUtils.getExtensionFromPath(filePath);
      if (ext && (ext == "pdf")) {
        me.logger.debug("skip converting, document is already an PDF");
        inputStream = new FileInputStream(filePath);
      } else {
        converter = sol.create("sol.common.as.functions.OfficeConverter", {
          openFile: {
            filePath: filePath
          },
          saveToStream: {
            format: "pdf"
          }
        });
        if (converter.isSupported(ext)) {
          inputStream = converter.execute();
        } else {
          me.logger.warn(["format '{0}' is not supported", ext]);
        }
      }
    } catch (ex) {
      me.logger.info(["error converting file (filePath={0})", filePath], ex);
    }
    me.logger.info(["Finish convertFileToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertFileToPdf");
    return inputStream;
  },

  // schon in as.Utils vorhanden
  /**
   * Converts an output stream to an input stream
   * @private
   * @param {java.io.OutputStream} outputStream
   * @return {java.io.InputStream} inputStream
   */
  convertOutputStreamToInputStream: function (outputStream) {
    var me = this,
        inputStream;

    me.logger.enter("convertOutputStreamToInputStream");
    me.logger.debug(["Start convertOutputStreamToInputStream with outputStream: '{0}'", outputStream]);

    if (!outputStream) {
      me.logger.info("convertOutputStreamToInputStream 'Output stream is empty'");
      throw "Output stream is empty";
    }
    inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    outputStream.close();

    me.logger.debug(["Finish convertOutputStreamToInputStream with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertOutputStreamToInputStream");
    return inputStream;
  },

  /**
   * Write inputstream to file
   * @private
   * @param {java.io.InputStream} pdfInputStream
   * @param {String} dstDirPath
   * @param {String} pdfName;
   * @return {java.io.File} dstFile
   */
  writePdfInputStreamToFile: function (pdfInputStream, dstDirPath, pdfName) {
    var me = this, 
        dstFile;

    me.logger.enter("writePdfInputStreamToFile");
    me.logger.info(["Start writePdfInputStreamToFile with dstDirPath: '{0}', pdfName: '{1}'", dstDirPath, pdfName]);

    dstFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");
    if (!dstFile.exists()) {
      dstFile.createNewFile();
    }

    Packages.org.apache.commons.io.FileUtils.copyInputStreamToFile(pdfInputStream, dstFile);

    me.logger.info(["Finish writePdfInputStreamToFile with dstFile: '{0}'", dstFile]);
    me.logger.exit("writePdfInputStreamToFile");

    return dstFile;
  },

  /**
   * Converts a Msg document (E-Mail) to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertMsgWithAttchmentToPdf: function (sord, dstDirPath) {
    var me = this,
        inputStream = null,
        msgFile, msgFilePath, message, attachments, i, attachment, attachmentInfo, attachmentObjectData,
        isAttachmentOutlookMessage, messageAttachment, fileAttchments, pdfInputStream, 
        pdfInputStreams, mergedOutputStream;

    me.logger.enter("convertMsgWithAttchmentToPdf");
    me.logger.info(["Start convertMsgWithAttchmentToPdf with sord: '{0}'", sord]);

    inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
    me.writeInputStreamToFile(inputStream, dstDirPath, sord.name, sord.ext);
    msgFilePath = dstDirPath + java.io.File.separator + sord.name + "." + sord.ext;
    msgFile = new java.io.File(msgFilePath);
    message = Packages.com.aspose.email.MapiMessage.fromFile(msgFile);
    attachments = message.getAttachments();

    fileAttchments = [];
    for (i = 0; i < attachments.size(); i++) {
      attachment = attachments.get_Item(i);

      attachmentInfo = {};
      attachmentInfo.fileName = attachment.getLongFileName();
      attachmentInfo.fileExtension = attachment.getExtension();

      attachmentObjectData = attachment.getObjectData();

      // Check if attachment is an outlook message
      if (attachmentObjectData) {
        if (attachmentObjectData.isOutlookMessage()) {
          isAttachmentOutlookMessage = true;
        } else {
          isAttachmentOutlookMessage = null;
        }
      } else {
        isAttachmentOutlookMessage = null;
      }

      if (isAttachmentOutlookMessage) {
        messageAttachment = attachment.getObjectData().toMapiMessage();
        attachmentInfo.filePath = dstDirPath;
        attachmentInfo.filePathAndFileName = dstDirPath + java.io.File.separator + attachmentInfo.fileName;
        messageAttachment.save(attachmentInfo.filePathAndFileName);

      } else {
        attachmentInfo.filePath = dstDirPath;
        attachmentInfo.filePathAndFileName = dstDirPath + java.io.File.separator + attachmentInfo.fileName;
        attachment.save(attachmentInfo.filePathAndFileName);
      }
      fileAttchments.push(attachmentInfo.filePathAndFileName);
      
    }

    pdfInputStreams = [];
    pdfInputStream = me.convertFileToPdf(msgFilePath);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }

    fileAttchments.forEach(function (fileAttchment) {
      pdfInputStream = me.convertFileToPdf(fileAttchment);
      if (pdfInputStream) {
        pdfInputStreams.push(pdfInputStream);
      }
    });

    mergedOutputStream = new ByteArrayOutputStream();
    sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
    inputStream = me.convertOutputStreamToInputStream(mergedOutputStream);   

    sol.common.FileUtils.delete(msgFilePath, { quietly: true }); 
    fileAttchments.forEach(function (fileAttchment) {
      sol.common.FileUtils.delete(fileAttchment, { quietly: true }); 
    });

    me.logger.info(["Finish convertMsgWithAttchmentToPdf with inputStream: '{0}'", inputStream]);
    me.logger.exit("convertMsgWithAttchmentToPdf");

    return inputStream;
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this, 
        pdfInputStream, dstDirPath, os;
    
    /*    
    mapiMessage = sol.create("sol.common.as.MapiMessage", {});
    
    mapiMessage.openFromRepo({
      objId: me.objId
    });

    newObjId = mapiMessage.saveToRepo({
      format: "pdf",
      parentId: "ARCPATH:/_Test",
      name: "MapiMessage1"
    });

    return newObjId;
    */

    // Save MSG-File with Attachment
    /*
    dstDirPath = "C:\\Temp\\PdfExport";
    pdfInputStream = me.convertMsgWithAttchmentToPdf({ id: me.objId, name: "Mail", ext: "msg" }, dstDirPath);
    me.writePdfInputStreamToFile(pdfInputStream, dstDirPath, "ConvertedMail");
    return pdfInputStream;
    */
    os = System.getProperty("os.name").toLowerCase();
    return String(os);
    
  }
});
