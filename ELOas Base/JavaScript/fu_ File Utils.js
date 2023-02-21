// start namespace fu
var fu = new Object();
fu = {

  clearSpecialChars: function (fileName) {
    var newFileName = fileName.replaceAll("\\W", "_");
    return newFileName;
  },

  getTempFile: function (sordId) {
    var editInfo = ixConnect.ix().checkoutDoc(sordId, null, EditInfoC.mbSordDoc, LockC.NO);
    var url = editInfo.document.docs[0].url;
    var ext = "." + editInfo.document.docs[0].ext;
    var name = fu.clearSpecialChars(editInfo.sord.name);

    var temp = File.createTempFile(name, ext);
    log.debug("Temp file: " + temp.getAbsolutePath());

    ixConnect.download(url, temp);

    return temp;
  },

  addVersion: function(objId, docFile) {
    var editInfo = ixConnect.ix().checkoutDoc(objId, null, EditInfoC.mbSordDoc, LockC.NO);
    var doc = editInfo.document;
    var ext = this.getExt(docFile.name);
    
    doc.docs[0].ext = ext;
    doc = ixConnect.ix().checkinDocBegin(doc);
    
    var url = doc.docs[0].url;
    var uploadResult = ixConnect.upload(url, docFile);
    
    doc.docs[0].uploadResult = uploadResult;
    doc = ixConnect.ix().checkinDocEnd(null, null, doc, LockC.NO);
  },
  
  deleteFile: function (delFile) {
    delFile["delete"]();
  },

  asString: function (sourcePath, encoding) {
    var file = new File(sourcePath);
    var text = FileUtils.readFileToString(file, encoding);
    return text;
  },

  asFile: function(destPath, data, encoding) {
    var file = new File(destPath);
    FileUtils.writeStringToFile(file, data, encoding);
  },

  rename: function(oldName, newName, overwrite) {
    var oldFile = new File(oldName);
    var newFile = new File(newName);

    if (overwrite && newFile.exists() ) {
      fu.deleteFile(newFile);
    }

    return oldFile.renameTo(newFile);
  },

  getExt: function(fileName) {
    fileName = String(fileName);
    var dotPos = fileName.lastIndexOf(".");
    if ((dotPos > 0) && (dotPos < (fileName.length - 1))) {
      return fileName.substring(dotPos + 1).toLowerCase();
    } else {
      return "";
    }
  },
  
  fileNameDate: function(date) {
    function pad(n){
        return n < 10 ? '0' + n : n
    }
    return date.getUTCFullYear()+'-'
    + pad(date.getUTCMonth()+1)+'-'
    + pad(date.getUTCDate())+'T'
    + pad(date.getUTCHours())+'-'
    + pad(date.getUTCMinutes())+'-'
    + pad(date.getUTCSeconds())+'Z'
  },
  
  convertToPdf: function(sourceName, destName) {
    var converted = false;
    
    var ext = this.getExt(sourceName);
    if ((ext == "doc") || (ext == "docx")) {
      log.debug("Convert Word document");
      var doc = new com.aspose.words.Document(sourceName);
      doc.save(destName);
      converted = true;
      
    } else if ((ext == "xls") || (ext == "xlsx")) {
      log.debug("Convert Excel document");
      var workbook = new com.aspose.cells.Workbook(sourceName);      
      workbook.save(destName, com.aspose.cells.FileFormatType.ASPOSE_PDF);
      converted = true;
         
    } else if ((ext == "ppt") || (ext == "pptx")) {
      log.debug("Convert Powerpoint document");
      var pdfFile = new File(destName);
      var outputStream = new java.io.FileOutputStream(pdfFile);
      var presentation = new com.aspose.slides.Presentation(sourceName);
      presentation.save(outputStream, com.aspose.slides.SaveFormat.Pdf);
      outputStream.close(); 
      converted = true;

    }
    
    return converted;
  },
  
  convertAsNewVersion: function(objid) {
    var sourceFile = this.getTempFile(objid);
    var destFile = new File( sourceFile.path + ".pdf" );
    
    if (this.convertToPdf(sourceFile.path, destFile.path)) {
      this.addVersion(objid, destFile);
      destFile["delete"]();
    }
    
    
    sourceFile["delete"]();
    
  }
  

};
// end of namespace fu