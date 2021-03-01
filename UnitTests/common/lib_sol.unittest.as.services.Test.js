
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
   * Converts a document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  convertMsgWithAttchmentToPdf: function (sord, dstDirPath) {
    var me = this,
        inputStream = null,
        msgFile, message, attachments, i, attachment, attachmentInfo, attachmentObjectData,
        isAttachmentOutlookMessage, messageAttachment;

    me.logger.enter("convertMsgWithAttchmentToPdf");
    me.logger.info(["Start convertMsgWithAttchmentToPdf with sord: '{0}'", sord]);

    inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
    me.writeInputStreamToFile(inputStream, dstDirPath, sord.name, sord.ext);

    msgFile = new java.io.File(dstDirPath + java.io.File.separator + sord.name + "." + sord.ext);
    message = Packages.com.aspose.email.MapiMessage.fromFile(msgFile);
    attachments = message.getAttachments();

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
      
    }

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
        pdfInputStream, dstDirPath;
    
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

    // TODO Save MSG-File with Attachment
    dstDirPath = "C:\\Temp\\PdfExport";
    pdfInputStream = me.convertMsgWithAttchmentToPdf({ id: me.objId, name: "Mail", ext: "msg" }, dstDirPath);

    return pdfInputStream;
    // TODO
   
        
  }
});
