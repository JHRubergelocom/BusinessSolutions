
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

  wkhtmltopdfRelativePath: "\\wkhtmltopdf\\bin\\wkhtmltopdf.exe",

  /**
   * @cfg {String} id id.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  getWkhtmltopdfPath: function () {
    var me = this;

    me.logger.enter("getWkhtmltopdfPath");
    me.logger.info(["Start getWkhtmltopdfPath"]);

    if (!me.wkhtmltopdfPath) {
      me.wkhtmltopdfPath = sol.common.ExecUtils.getProgramFilesDir() + me.wkhtmltopdfRelativePath;
    }
    me.logger.info(["Finish getWkhtmltopdfPath with me.wkhtmltopdfPath: '{0}'", me.wkhtmltopdfPath]);
    me.logger.exit("getWkhtmltopdfPath");

    return me.wkhtmltopdfPath;
  },

  convertHtmlToPdf: function (url, destPath) {
    var me = this;

    me.logger.enter("convertHtmlToPdf");
    me.logger.info(["Start convertHtmlToPdf with url: '{0}', destPath: '{1}'", url, destPath]);

    sol.common.ExecUtils.startProcess([me.getWkhtmltopdfPath(), "-O", "Portrait", url, destPath], { wait: true });


    me.logger.info(["Finish convertHtmlToPdf"]);
    me.logger.exit("convertHtmlToPdf");
  },


  /**
   * Retrieve the feed guid of an element (sol.common.ix.SubscriptionUtils)
   * @param {String} objId
   * @return {String}
   */
  getFeedGuid: function (objId) {
    var fai, fr, feed;

    fai = FindActionsInfo();
    fai.objId = objId;
    fr = ixConnect.feedService.findFirstActions(fai, 1, ActionC.mbMin);

    feed = (fr && fr.actions && fr.actions.length > 0) ? fr.feeds.get(fr.actions[0].feedGuid) : null;

    return (feed) ? feed.guid : null;
  },

  getFeedUrl: function (objId) {
    var baseUrl, url, guid,
        urlParams = [];


    guid = sol.common.RepoUtils.getSord(objId).guid;

    urlParams.push("ticket=" + ixConnect.loginResult.clientInfo.ticket);
    urlParams.push("userid=" + ixConnect.loginResult.user.id);
    urlParams.push("lang=" + ixConnect.loginResult.clientInfo.language);
    urlParams.push("timezone=" + "Europe/Berlin");

    baseUrl = sol.common.WfUtils.getWfBaseUrl();

    url = baseUrl + "/social/feed/?guid=" + guid + "&" + urlParams.join("&");
    return url;
  },

  getActions: function (objId) {
    var findInfo, findResult, idx, actions, i;

    findInfo = new FindActionsInfo();
    findInfo.objId = objId;

    idx = 0;
    findResult = ixConnect.getFeedService().findFirstActions(findInfo, 200, ActionC.mbAll);

    actions = [];

    while (true) {
      for (i = 0; i < findResult.actions.length; i++) {
        actions.push(findResult.actions[i]);
      }
      if (!findResult.moreResults) {
        break;
      }
      idx += findResult.actions.length;
      findResult = ixConnect.getFeedService().findNextActions(findResult.searchId, idx, 200, ActionC.mbAll);
    }
    return actions;
  },

  getActionsTree: function (actions) {
    var actionsTree, item, i;

    actionsTree = [];

    actions.forEach(function (action) {
      if (String(action.parentGuid).trim() === "") {
        item = {};
        item = { action: action, children: [] };
        actionsTree.push(item);
      }
    });

    actions.forEach(function (action) {
      if (String(action.parentGuid).trim() !== "") {
        actionsTree.forEach(function (actionTree) {
          if (action.parentGuid === actionTree.action.guid) {
            actionTree.children.push(action);
          }
        });
      }
    });

    actionsTree.forEach(function (actionTree) {
      for (i = 0; i < actions.length; i++) {
        if (String(actions[i].parentGuid) === String(actionTree.action.guid)) {
          item = {};
          item = { action: actions[i] };  
          actionTree.children.push(item);
        }  
      }
    });

    return actionsTree;
  },

  /**
   * Append feed info of sord to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} dstDirPath
   * @param {String} pdfName
   * @param {Object} config Pdf export configuration
   * @return {java.io.File} dstPdfFile
   */
  appendFeedInfo: function (sord, dstDirPath, pdfName, config) {
    var me = this,
        dstPdfFile,
        dstPdfPath, dstFeedPdfPath, dstFeedPdfFile, feedUrl,
        mergedOutputStream, pdfInputStreams, pdfInputStream;

    me.logger.enter("appendFeedInfo");
    me.logger.debug(["Start appendFeedInfo with sord: '{0}', dstDirPath: '{1}', pdfName: '{2}', config: '{3}'", sord, dstDirPath, pdfName, sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 })]);

    dstPdfFile = new java.io.File(dstDirPath + java.io.File.separator + pdfName + ".pdf");

    dstPdfPath = dstPdfFile.getPath();
    dstFeedPdfPath = dstDirPath + java.io.File.separator + "_feed.pdf";

    feedUrl = me.getFeedUrl(sord, config);
    me.convertFeedToPdf(feedUrl, dstFeedPdfPath);
    dstFeedPdfFile = new File(dstFeedPdfPath);

    mergedOutputStream = new ByteArrayOutputStream();
    pdfInputStreams = [];
    pdfInputStream = new FileInputStream(dstPdfPath);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }
    pdfInputStream = new FileInputStream(dstFeedPdfPath);
    if (pdfInputStream) {
      pdfInputStreams.push(pdfInputStream);
    }
    sol.common.as.PdfUtils.mergePdfStreams(pdfInputStreams, mergedOutputStream);
    dstPdfFile = me.writePdfOutputStreamToFile(mergedOutputStream, dstDirPath, pdfName);
    sol.common.FileUtils.deleteFiles({ dirPath: dstFeedPdfFile.getPath() });

    me.logger.debug(["Finish appendFeedInfo with dstPdfFile: '{0}'", dstPdfFile]);
    me.logger.exit("appendFeedInfo");    

    return dstPdfFile;
  },

  /**
   * Converts a html document to a PDF.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} ext
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  _convertHtmlToPdf: function (sord, ext, dstDirPath) {
    var me = this,
        inputStream = null,
        pdfInputStream = null,
        sourceFile, targetFile, fileName,
        basePath, htmloptions, doc;

    me.logger.enter("_convertHtmlToPdf");
    me.logger.debug(["Start _convertHtmlToPdf with sord: '{0}'", sord]);

    try {
      inputStream = sol.common.RepoUtils.downloadToStream(sord.id);
      fileName = sol.common.FileUtils.sanitizeFilename(sord.name);

      sourceFile = me.writeInputStreamToFile(inputStream, dstDirPath, fileName, ext);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      basePath = sourceFile.getParent() + File.separator;
      me.logger.debug(["'basePath = sourceFile.getParent() + File.separator' with basePath: '{0}'", basePath]);

      htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath); 		 
      me.logger.debug(["'htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath)' with basePath: '{0}', htmloptions: '{1}'", basePath, htmloptions]);

      doc = new Packages.com.aspose.pdf.Document(sourceFile.getPath(), htmloptions); 
      me.logger.debug(["'doc = new Packages.com.aspose.pdf.Document(sourceFile.getPath(), htmloptions)' with htmloptions: '{0}', doc: '{1}'", htmloptions, doc]);

      doc.save(targetFile.getPath());
      me.logger.debug(["'doc.save(targetFile.getPath())' with targetFile: '{0}'", targetFile]);

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });
      
    } catch (ex) {
      me.logger.error(["error _convertHtmlToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }

    me.logger.debug(["Finish _convertHtmlToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("_convertHtmlToPdf");
    return pdfInputStream;
  },
  
  /**
   * Converts a html file to a PDF.
   * @private
   * @param {String} filePath   
   * @param {String} dstDirPath
   * @return {java.io.InputStream} inputStream or null if there was an error
   */
  _convertHtmlFileToPdf: function (filePath, dstDirPath) {
    var me = this,
        pdfInputStream = null,
        sourceFile, targetFile, fileName,
        basePath, htmloptions, doc;

    me.logger.enter("_convertHtmlFileToPdf");
    me.logger.debug(["Start _convertHtmlFileToPdf with filePath: '{0}', dstDirPath:'{1}'", filePath, dstDirPath]);

    try {
      sourceFile = new File(filePath);
      fileName = sol.common.FileUtils.getName(sourceFile);
      targetFile = new File(dstDirPath + java.io.File.separator + fileName + ".pdf");

      basePath = sourceFile.getParent() + File.separator;
      me.logger.debug(["'basePath = sourceFile.getParent() + File.separator' with basePath: '{0}'", basePath]);

      htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath); 		 
      me.logger.debug(["'htmloptions = new Packages.com.aspose.pdf.HtmlLoadOptions(basePath)' with basePath: '{0}', htmloptions: '{1}'", basePath, htmloptions]);

      doc = new Packages.com.aspose.pdf.Document(sourceFile.getPath(), htmloptions); 
      me.logger.debug(["'doc = new Packages.com.aspose.pdf.Document(sourceFile.getPath(), htmloptions)' with htmloptions: '{0}', doc: '{1}'", htmloptions, doc]);

      doc.save(targetFile.getPath());
      me.logger.debug(["'doc.save(targetFile.getPath())' with targetFile: '{0}'", targetFile]);

      pdfInputStream = new ByteArrayInputStream(Packages.org.apache.commons.io.FileUtils.readFileToByteArray(targetFile));
      sol.common.FileUtils.delete(sourceFile, { quietly: true });

    } catch (ex) {
      me.logger.error(["error _convertHtmlFileToPdf with sourceFile:'{0}', targetFile:'{1}'", sourceFile, targetFile], ex);
    }

    me.logger.debug(["Finish _convertHtmlFileToPdf with inputStream: '{0}'", pdfInputStream]);
    me.logger.exit("_convertHtmlFileToPdf");
    return pdfInputStream;
  },
  
  

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this, htmlFile, targetFile, actions, actionsTree;
    
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
        // feedFile = new File("C:\\Temp\\PdfExport\\Feed.pdf");
  
      } else {
        htmlFile = new File("/var/elo/servers/ELO-base/temp/HTMLToPDF.html");
        targetFile = new File("/var/elo/servers/ELO-base/temp/HTMLToPDF.pdf");
        // feedFile = new File("/var/elo/servers/ELO-base/temp/Feed.pdf");
      } 
      
      me.logger.info(["Try sol.unittest.as.services.Test with htmlFile: '{0}', targetFile: '{1}'", htmlFile, targetFile]);

      /*
      // Aspose

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

      // wkhtmltopdf
      me.convertHtmlToPdf(htmlFile.getPath(), targetFile.getPath());


      /*
      // Get Notes, Annotations
      notes = ixConnect.ix().checkoutNotes(me.objId, null, NoteC.mbAll, LockC.NO);
      notes.forEach(function (note) {
        switch (note.type) {
          case NoteC.TYPE_ANNOTATION_FILETEXT:
            typetext = "NoteC.TYPE_ANNOTATION_FILETEXT: Note type: reserved";
            break;

          case NoteC.TYPE_ANNOTATION_FILLEDRECTANGLE: 	
            typetext = "NoteC.TYPE_ANNOTATION_FILLEDRECTANGLE: Note type:draws a filled coloured box on the document, over the existing document.";
            break;

          case NoteC.TYPE_ANNOTATION_FREEHAND: 	
            typetext = "NoteC.TYPE_ANNOTATION_FREEHAND: Note type:freehand line.";
            break;

          case NoteC.TYPE_ANNOTATION_HOLLOWRECTANGLE: 	
            typetext = "NoteC.TYPE_ANNOTATION_HOLLOWRECTANGLE: Note type:draws a hollow rectangle (frame) on a document.";
            break;

          case NoteC.TYPE_ANNOTATION_HORIZONTAL_LINE: 	
            typetext = "NoteC.TYPE_ANNOTATION_HORIZONTAL_LINE: Note type:horizontal line.";
            break;

          case NoteC.TYPE_ANNOTATION_LINE: 	
            typetext = "NoteC.TYPE_ANNOTATION_LINE: Note type:reserved";
            break;

          case NoteC.TYPE_ANNOTATION_MARKER: 	
            typetext = "NoteC.TYPE_ANNOTATION_MARKER: Note type:highlighting rectange (filled) on the document.";
            break;

          case NoteC.TYPE_ANNOTATION_NOTE: 	
            typetext = "NoteC.TYPE_ANNOTATION_NOTE: Note type:annotation text";
            break;

          case NoteC.TYPE_ANNOTATION_NOTE_WITHFONT: 	
            typetext = "NoteC.TYPE_ANNOTATION_NOTE_WITHFONT: Note type:Draws a filled rectangular box on a document and displays text in the box.";
            break;

          case NoteC.TYPE_ANNOTATION_RECTANGLE: 	
            typetext = "NoteC.TYPE_ANNOTATION_RECTANGLE: Note type:reserved";
            break;

          case NoteC.TYPE_ANNOTATION_STAMP: 	
            typetext = "NoteC.TYPE_ANNOTATION_STAMP: Deprecated.Use 'TYPE_ANNOTATION_STAMP_NEW'";
            break;

          case NoteC.TYPE_ANNOTATION_STAMP_NEW: 	
            typetext = "NoteC.TYPE_ANNOTATION_STAMP_NEW: Note type:adds a stamp, such as a received date for example, to a document.";
            break;

          case NoteC.TYPE_ANNOTATION_STRIKEOUT: 	
            typetext = "NoteC.TYPE_ANNOTATION_STRIKEOUT: Note type:strike out text";
            break;

          case NoteC.TYPE_ANNOTATION_TEXT: 	
            typetext = "NoteC.TYPE_ANNOTATION_TEXT: Annotation with text but without a rectangle.";
            break;

          case NoteC.TYPE_ANOTEW_MARKER: 	
            typetext = "NoteC.TYPE_ANOTEW_MARKER: Deprecated.";
            break;

          case NoteC.TYPE_ANOTEWG_NOTE: 	
            typetext = "NoteC.TYPE_ANOTEWG_NOTE: Deprecated.";
            break;

          case NoteC.TYPE_NONE: 	
            typetext = "NoteC.TYPE_NONE: Note type:needed in FindByNotes to indicate typeless filtering";
            break;

          case NoteC.TYPE_NORMAL: 	
            typetext = "NoteC.TYPE_NORMAL: Note type:standard yellow note";
            break;

          case NoteC.TYPE_NORMAL_ACL: 	
            typetext = "NoteC.TYPE_NORMAL_ACL: Note type:standard ACL";
            break;

          case NoteC.TYPE_PERSONAL: 	
            typetext = "NoteC.TYPE_PERSONAL: Note type:standard green note";
            break;

          case NoteC.TYPE_STAMP: 	
            typetext = "NoteC.TYPE_STAMP: Note type:standard red note";
            break;

          default:
        }  
        me.logger.info(["---------------------------------------------------------------------"]);
        me.logger.info(["note.id='{0}', note.type='{1}', typetext='{2}'", note.id, note.type, typetext]);

        me.logger.info(["note.color='{0}'", note.color]);
        me.logger.info(["note.createDateIso='{0}'", note.createDateIso]);
        me.logger.info(["note.desc='{0}'", note.desc]);
        me.logger.info(["note.guid='{0}'", note.guid]);
        me.logger.info(["note.height='{0}'", note.height]);
        me.logger.info(["note.pageNo='{0}'", note.pageNo]);
        me.logger.info(["note.width='{0}'", note.width]);
        me.logger.info(["note.XPos='{0}'", note.XPos]);
        me.logger.info(["note.YPos='{0}'", note.YPos]);

        if (note.noteFreehand != null) {
          if (note.noteFreehand.points != null) {
            note.noteFreehand.points.forEach(function (point) {
              me.logger.info(["point.x='{0}'", point.x]);
              me.logger.info(["point.y='{0}'", point.y]);
            });
          }
          me.logger.info(["note.noteFreehand.strikeoutColor='{0}'", note.noteFreehand.strikeoutColor]);
          me.logger.info(["note.noteFreehand.strikeoutWidth='{0}'", note.noteFreehand.strikeoutWidth]);
          me.logger.info(["note.noteFreehand.width='{0}'", note.noteFreehand.width]);
        } 
        if (note.noteImage != null) {
          me.logger.info(["note.noteImage.fileData='{0}'", note.noteImage.fileData]);
          me.logger.info(["note.noteImage.fileName='{0}'", note.noteImage.fileName]);
        } 
        if (note.noteText != null) { 
          me.logger.info(["note.noteText.fontInfo='{0}'", note.noteText.fontInfo]);
          me.logger.info(["note.noteText.text='{0}'", note.noteText.text]);
        } 

        me.logger.info(["---------------------------------------------------------------------"]);

      });
*/

      // Get feed info
      actions = me.getActions(me.objId);
      actions.forEach(function (action) {
        me.logger.info(["action.feedGuid   = '{0}'", action.feedGuid]);
        me.logger.info(["action.guid       = '{0}'", action.guid]);
        me.logger.info(["action.text       = '{0}'", action.text]);
        me.logger.info(["action.parentGuid = '{0}'", action.parentGuid]);
        me.logger.info(["action.text       = '{0}'", action.text]);
        me.logger.info(["action.type       = '{0}'", action.type]);
        me.logger.info(["action.userName   = '{0}'", action.userName]);
      });


      actionsTree = me.getActionsTree(actions);

      actionsTree.forEach(function (actionTree) {
        me.logger.info(["actionTree.action.feedGuid   = '{0}'", actionTree.action.feedGuid]);
        me.logger.info(["actionTree.action.guid       = '{0}'", actionTree.action.guid]);
        me.logger.info(["actionTree.action.text       = '{0}'", actionTree.action.text]);
        me.logger.info(["actionTree.action.parentGuid = '{0}'", actionTree.action.parentGuid]);
        me.logger.info(["actionTree.action.text       = '{0}'", actionTree.action.text]);
        me.logger.info(["actionTree.action.type       = '{0}'", actionTree.action.type]);
        me.logger.info(["actionTree.action.userName   = '{0}'", actionTree.action.userName]);

        actionTree.children.forEach(function (child) {
          me.logger.info(["actionTree.children.action.feedGuid             = '{0}'", child.action.feedGuid]);
          me.logger.info(["actionTree.children.action.guid                 = '{0}'", child.action.guid]);
          me.logger.info(["actionTree.children.action.text                 = '{0}'", child.action.text]);
          me.logger.info(["actionTree.children.action.parentGuid           = '{0}'", child.action.parentGuid]);
          me.logger.info(["actionTree.children.action.text                 = '{0}'", child.action.text]);
          me.logger.info(["actionTree.children.action.type                 = '{0}'", child.action.type]);
          me.logger.info(["actionTree.children.action.userName             = '{0}'", child.action.userName]);
        });
  
      });

      

      me.logger.debug(["actionsTree: '{0}'", sol.common.JsonUtils.stringifyAll(actionsTree, { tabStop: 2 })]);

      /*
      feedUrl = me.getFeedUrl(me.objId);
      java.awt.Desktop.desktop.browse(new java.net.URI(feedUrl));
      me.convertHtmlToPdf(feedUrl, feedFile.getPath());
      */      
    } catch (ex) {
      me.logger.error(["error sol.unittest.as.services.Test"], ex);
    }

    me.logger.info(["Finish sol.unittest.as.services.Test"]);
    me.logger.exit("sol.unittest.as.services.Test");

    return true;
  }
});
