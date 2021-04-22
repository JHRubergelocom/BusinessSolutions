
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
        htmlFile, targetFile;

    
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
   
    // Get Operating System
    /*
    os = System.getProperty("os.name").toLowerCase();
    return String(os);
    */

    // Convert tiff to pdf
    /*
    if (me.windows) {
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("C:\\Temp\\PdfExport\\Rechnung.TIF"), new File("C:\\Temp\\PdfExport\\Rechnung.pdf"));
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("C:\\Temp\\PdfExport\\Scan_Invoice_Unittest.tif"), new File("C:\\Temp\\PdfExport\\Scan_Invoice_Unittest.pdf"));
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("C:\\Temp\\PdfExport\\Tiff-Image-File-Download.tiff"), new File("C:\\Temp\\PdfExport\\Tiff-Image-File-Download.pdf"));
    } else {
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("/var/elo/servers/ELO-base/temp/Rechnung.TIF"), new File("/var/elo/servers/ELO-base/temp/Rechnung.pdf"));
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("/var/elo/servers/ELO-base/temp/Scan_Invoice_Unittest.tif"), new File("/var/elo/servers/ELO-base/temp/Scan_Invoice_Unittest.pdf"));
      Packages.de.elo.mover.utils.ELOAsTiffUtils.saveTiffAsPdf(new File("/var/elo/servers/ELO-base/temp/Tiff-Image-File-Download.tiff"), new File("/var/elo/servers/ELO-base/temp/Tiff-Image-File-Download.pdf"));
    }
    */

    /*
    if (me.windows) {
      sourceFile = new File("C:\\Temp\\PdfExport\\Test.pdf");
      targetFile = new File("C:\\Temp\\PdfExport\\Watermark.pdf");
      watermarkFile = new File("C:\\Temp\\PdfExport\\Logo.png");
      bookmarkFile = new File("C:\\Temp\\PdfExport\\Bookmark.pdf");
      childBookmarkFile = new File("C:\\Temp\\PdfExport\\ChildBookmark.pdf");
      textWatermarkFile = new File("C:\\Temp\\PdfExport\\TextWatermarkFile.pdf");
    } else {
      sourceFile = new File("/var/elo/servers/ELO-base/temp/Test.pdf");
      targetFile = new File("/var/elo/servers/ELO-base/temp/Watermark.pdf");
      watermarkFile = new File("/var/elo/servers/ELO-base/temp/Logo.png");
      bookmarkFile = new File("/var/elo/servers/ELO-base/temp/Bookmark.pdf");
      childBookmarkFile = new File("/var/elo/servers/ELO-base/temp/ChildBookmark.pdf");
      textWatermarkFile = new File("/var/elo/servers/ELO-base/temp/TextWatermarkFile.pdf");
    } 
    sol.common.FileUtils.copyFile(sourceFile, targetFile);

    // Insert Image Watermark with aspose
    pdfDocument = new Packages.com.aspose.pdf.Document(targetFile.getPath());
    imageStamp = new Packages.com.aspose.pdf.ImageStamp(watermarkFile.getPath());
    imageStamp.setBackground(true);

    // imageStamp.setHeight(350);
    // imageStamp.setWidth(350);
    imageStamp.setOpacity(0.5);

    imageStamp.setHorizontalAlignment(Packages.com.aspose.pdf.HorizontalAlignment.Center);
    imageStamp.setVerticalAlignment(Packages.com.aspose.pdf.VerticalAlignment.Center);

    pages = pdfDocument.getPages();
    for (i = 1; i <= pages.size(); i++) {
      page = pages.get_Item(i);
      page.addStamp(imageStamp);
    }
    pdfDocument.save(targetFile.getPath());

    if (me.windows) {
      // Insert Text Watermark with aspose
      sol.common.FileUtils.copyFile(sourceFile, textWatermarkFile);

      // open document
      pdfDocument = new Packages.com.aspose.pdf.Document(textWatermarkFile.getPath());
      // create text stamp
      textStamp = new Packages.com.aspose.pdf.TextStamp("Text Watermark");
      // set whether stamp is background
      textStamp.setBackground(true);
      // set origin
      //textStamp.setXIndent(100);
      //textStamp.setYIndent(100);
      textStamp.setOpacity(0.5);
      textStamp.setHorizontalAlignment(Packages.com.aspose.pdf.HorizontalAlignment.Center);
      textStamp.setVerticalAlignment(Packages.com.aspose.pdf.VerticalAlignment.Center);


      // rotate stamp
      textStamp.setRotateAngle(45.0);
      // set text properties
      // textStamp.getTextState().setFont(new Packages.com.aspose.pdf.FontRepository().findFont("Arial"));
      textStamp.getTextState().setFontSize(60.0);
      textStamp.getTextState().setFontStyle(Packages.com.aspose.pdf.FontStyles.Bold);
      textStamp.getTextState().setFontStyle(Packages.com.aspose.pdf.FontStyles.Italic);
      textStamp.getTextState().setForegroundColor(Packages.com.aspose.pdf.Color.getGreen());

      pages = pdfDocument.getPages();
      for (i = 1; i <= pages.size(); i++) {
        page = pages.get_Item(i);
        page.addStamp(textStamp);
      }

      // save output document
      pdfDocument.save(textWatermarkFile.getPath());    
    }

    // Add a Bookmark with aspose

    // Open the source PDF document
    pdfDocument = new Packages.com.aspose.pdf.Document(targetFile.getPath());

    // Create a bookmark object
    pdfOutline = new Packages.com.aspose.pdf.OutlineItemCollection(pdfDocument.getOutlines());
    pdfOutline.setTitle("Test Outline");
    pdfOutline.setItalic(true);
    pdfOutline.setBold(true);
    
    // Set the destination page number
    pdfOutline.setAction(new Packages.com.aspose.pdf.GoToAction(pdfDocument.getPages().get_Item(1)));
    
    // Add a bookmark in the document's outline collection.
    pdfDocument.getOutlines().add(pdfOutline);
    
    // Save the update document
    pdfDocument.save(bookmarkFile.getPath());


    // Add a Child Bookmark with aspose

    // Open document
    pdfDocument = new Packages.com.aspose.pdf.Document(targetFile.getPath());

    // Create a parent bookmark object
    pdfOutline = new Packages.com.aspose.pdf.OutlineItemCollection(pdfDocument.getOutlines());
    pdfOutline.setTitle("Parent Outline");
    pdfOutline.setItalic(true);
    pdfOutline.setBold(true);

    // Set the destination page number
    pdfOutline.setDestination(new Packages.com.aspose.pdf.GoToAction(pdfDocument.getPages().get_Item(2)));

    // Create a child bookmark object
    pdfChildOutline = new Packages.com.aspose.pdf.OutlineItemCollection(pdfDocument.getOutlines());
    pdfChildOutline.setTitle("Child Outline");
    pdfChildOutline.setItalic(true);
    pdfChildOutline.setBold(true);

    // Set the destination page number for child outline
    pdfChildOutline.setDestination(new Packages.com.aspose.pdf.GoToAction(pdfDocument.getPages().get_Item(10)));

    // Add child bookmark to parent bookmark's collection
    pdfOutline.add(pdfChildOutline);

    // Add parent bookmark to the document's outline collection.
    pdfDocument.getOutlines().add(pdfOutline);

    // Save output
    pdfDocument.save(childBookmarkFile.getPath());

    // Add Hypelink to File
    if (me.windows) {
      sourceFile = new File("C:\\Temp\\PdfExport\\Test.pdf");
      targetFile = new File("C:\\Temp\\PdfExport\\Hyperlink.pdf");
      contentFile = new File("C:\\Temp\\PdfExport\\Content.pdf");

    } else {
      sourceFile = new File("/var/elo/servers/ELO-base/temp/Test.pdf");
      targetFile = new File("/var/elo/servers/ELO-base/temp/Hyperlink.pdf");
      contentFile = new File("/var/elo/servers/ELO-base/temp/Content.pdf");

    } 
    sol.common.FileUtils.copyFile(sourceFile, targetFile);



    // Create document
    contentDocument = new Packages.com.aspose.pdf.Document();

    // Add page1
    page = contentDocument.getPages().add();

    // Add text to new page
    page.getParagraphs().add(new Packages.com.aspose.pdf.TextFragment("Inhaltsverzeichnis"));
    page.getParagraphs().add(new Packages.com.aspose.pdf.TextFragment("Seite 2"));


    // Add page2
    page = contentDocument.getPages().add();

    // Add text to new page
    page.getParagraphs().add(new Packages.com.aspose.pdf.TextFragment("Seite 2"));


    // Get page1
    page = contentDocument.getPages().get_Item(1);

    // Create Link annotation object  and specify rectangular region
    // link = new Packages.com.aspose.pdf.LinkAnnotation(page, new Packages.com.aspose.pdf.Rectangle(100, 760, 110, 770));
    link = new Packages.com.aspose.pdf.LinkAnnotation(page, new Packages.com.aspose.pdf.Rectangle(100, 560, 200, 570));

    // Set color for Annotation object
    // link.setColor(com.aspose.pdf.Color.fromRgb(java.awt.Color.green));
    border = new Packages.com.aspose.pdf.Border(link);
    border.setWidth(0);
    link.setBorder(border);

    // Specify the link to page2
    link.setAction(new Packages.com.aspose.pdf.GoToAction(2));


    // Add link annotation to annotations collection of first page of PDF file
    page.getAnnotations().add(link);

    // create text fragment
    textFragment = new Packages.com.aspose.pdf.TextFragment("main text");
    textFragment.setPosition(new Packages.com.aspose.pdf.Position(100, 560));

    // set text properties
    // textFragment.getTextState().setFont(Packages.com.aspose.pdf.FontRepository.findFont("Verdana"));
    // textFragment.getTextState().setFontSize(14);
    // textFragment.getTextState().setForegroundColor(Packages.com.aspose.pdf.Color.getBlue());
    // textFragment.getTextState().setBackgroundColor(Packages.com.aspose.pdf.Color.getGray());

    // create TextBuilder object
    textBuilder = new Packages.com.aspose.pdf.TextBuilder(page);
    // append the text fragment to the PDF page
    textBuilder.appendText(textFragment);

    // Save updated document
    contentDocument.save(contentFile);
    */

    // Convert htlm to pdf    

    me.logger.enter("sol.unittest.as.services.Test");
    me.logger.info(["Start sol.unittest.as.services.Test"]);
    try {
      if (me.windows) {
        htmlFile = new File("C:\\Temp\\PdfExport\\HTMLToPDF.html");
        targetFile = new File("C:\\Temp\\PdfExport\\HTMLToPDF.pdf");
  
      } else {
        htmlFile = new File("/var/elo/servers/ELO-base/temp/HTMLToPDF.html");
        targetFile = new File("/var/elo/servers/ELO-base/temp/HTMLToPDF.pdf");
      } 
      /*
      me.logger.info(["Try sol.unittest.as.services.Test with htmlFile: '{0}', targetFile: '{1}'", htmlFile, targetFile]);

      // Create HTML load options
      basePath = htmlFile.getParent() + File.separator;
      me.logger.info(["'basePath = htmlFile.getParent() + File.separator' with basePath: '{0}'", basePath]);

      htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath); 		 
      me.logger.info(["'htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath)' with basePath: '{0}', htmloptions: '{1}'", basePath, htmloptions]);

      // Load HTML file
      doc = new Packages.com.aspose.pdf.Document(htmlFile.getPath(), htmloptions); 
      me.logger.info(["'doc = new Packages.com.aspose.pdf.Document(htmlFile.getPath(), htmloptions)' with htmloptions: '{0}', doc: '{1}'", htmloptions, doc]);

      // Convert HTML file to PDF
      doc.save(targetFile.getPath());
      me.logger.info(["'doc.save(targetFile.getPath())' with targetFile: '{0}'", targetFile]);
      */
      /*
      // input HTML
      // HTML = "< b >BIG TEXT< /b>< ol>SOME VALUE< /ol>< li >item1< /li >< li >item2 & 3 < /li >< /ol >";
      HTML = "<HTML><HEAD><TITLE>Your Title Here</TITLE></HEAD><BODY BGCOLOR='FFFFFF'><CENTER><IMG SRC='clouds.jpg' ALIGN='BOTTOM'> </CENTER><HR><a href='http://somegreatsite.com'>Link Name</a>is a link to another nifty site<H1>This is a Header</H1><H2>This is a Medium Header</H2><HR></BODY></HTML>";

      // CSS for input HTML contents
      // CSS = " *{font-weight : normal !important ; margin :0 !important ; padding:0 !important ; list-style-type:none !important}";
      CSS = "";
      // instantiate Document instance
      doc = new Packages.com.aspose.pdf.Document();
      // add page to pages collection of Document object
      page = doc.getPages().add();
      // add HTMLFragment to paragraphs collection of PDF page
      page.getParagraphs().add(new com.aspose.pdf.HtmlFragment(CSS + HTML));
      // save resultant PDF file
      doc.save(targetFile.getPath());
      */
     
      Packages.de.elo.mover.main.helper.ConvertHelper.convertToPdf(htmlFile, targetFile);
    } catch (ex) {
      me.logger.error(["error sol.unittest.as.services.Test with htmlFile: '{0}', targetFile: '{1}'", htmlFile, targetFile], ex);
    }

    me.logger.info(["Finish sol.unittest.as.services.Test"]);
    me.logger.exit("sol.unittest.as.services.Test");

    return true;
  }
});
