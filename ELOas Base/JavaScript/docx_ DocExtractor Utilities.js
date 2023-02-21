// start namespace docx
var docx = new Object();

const docx_statusIndexLine = 5;
const docx_exportStatusMsg = "EXPORTED";
const docx_importStatusMsg = "IMPORTED";
const docx_asExportDir = "Analyze";
const docx_asImportDir = "Import";
const docx_asErrorDir = "Error";
const docx_asDoneDir = "Done";

const docx_xmlTemplate = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
  '<!DOCTYPE STACK SYSTEM "System\Config\DTD\sfx_import.dtd">\n' +
  '<STACK Category="Invoice" LocationType="File" Priority="5" StackID="MyCompany %TimeStamp%" SubSystem="Invoice">\n' +
  '<ATTRIBUTES>\n' +
  '  <KeyValuePair Key="$Dpi" Value="300"/>\n' +
  '  <KeyValuePair Key="$ScanDate" Value="%Scandatum%"/>\n' +
  '  <KeyValuePair Key="$ArchivId" Value="%Guid%"/>\n' +
  '  <KeyValuePair Key="$ArchivDocId" Value="%Id%"/>\n' +
  '</ATTRIBUTES>\n' +
  '%Images%\n' +
  '</STACK>\n';

const docx_imageTemplate = '<IMAGE DocID="0000" ImageID="%ImageId%" Skipped="%Skipped%" LocationID="%Guid%-%ImageId%.%Ext%"/>\n';
//<IMAGE DocID="0000" ImageID="001" Skipped="TRUE" LocationID="(AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE)-001.tif"/>
//<IMAGE DocID="0000" ImageID="002" Skipped="TRUE" LocationID="(AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE)-002.tif"/>

docx = {
  mapData: undefined,
  
  // TODO: Hier werden die zu übernehmenden Felder aufgelistet
  processSord: function(sord, data) {
    var objKeys = sord.objKeys;
    var fg = data.PROCESS.DOCUMENT.FIELDGROUP;
    sord.XDateIso = this.getFieldValue(fg, 'VE_NAV_LAST_CHANGE', 'D');
    
    // Indexzeilen
    this.assignField(fg, 'INV_NUMBER', objKeys, 0, "S");
    this.assignField(fg, 'INV_AMOUNT', objKeys, 1, "S");
    this.assignField(fg, 'VE_NAME', objKeys, 2, "S");
    this.assignField(fg, 'INV_DATE', objKeys, 3, "D");
    this.assignField(fg, 'INV_CASH_DISCOUNT_DATE', objKeys, 4, "D");
    
    // MAP Felder
    this.assignMap(fg, 'INV_TAX_RATE', 'TAX_RATE', 'N');
    this.assignMap(fg, 'INV_TAX_AMOUNT', 'TAX_AMOUNT', 'N');
    this.assignMap(fg, 'INV_TAX_CODE', 'TAX_CODE', 'S');
  },
  
  checkForInvoice: function(sord) {
    return sord.name == "Rechnung";
  },
  
  importCmd: function (path) {
    log.debug("Execute command import: " + path);
    this.importDir(path);
    log.debug("Import Done.");
  },

  importDir: function(path) {
    var impDirName = path + File.separator + docx_asImportDir;
    var impDir = new File(impDirName);
    var impFiles = impDir.list();
   
    for (var i = 0; i < impFiles.length; i++) {
      var destDir = docx_asDoneDir;
      var fileName = impFiles[i];
      try {
        this.importFile(impDirName, fileName);
      } catch(e) {
        destDir = docx_asErrorDir;
      }
      
      log.debug("Import done, move file " + fileName + " to " + destDir);
      var destDirName = path + File.separator + destDir;
      fu.rename(impDirName + File.separator + fileName, destDirName + File.separator + fileName);
    }
  },
  
  importFile: function(path, file) {
    log.debug("Process file: " + file);
    var xmlText = String(fu.asString(path + File.separator + file, "UTF-8")); 
    var headerEnd = xmlText.indexOf("<STACK");
    if (headerEnd > 0) {
      xmlText = xmlText.substring(headerEnd);
    }
    var stack = new XML(xmlText);
    this.mapData = new Array();
    
    var attributes = stack.ATTRIBUTES
    var destination = attributes.KeyValuePair.(@Key=='$ArchivId');
    var guid = destination.@Value;
    log.info(destination.@Value);
    var editInfo = ixConnect.ix().checkoutSord(guid, EditInfoC.mbSord, LockC.YES);
    this.processSord(editInfo.sord, stack);
    this.storeData(editInfo.sord);
  },
  
  storeData: function(sord) {
    try {
      var id = sord.id;
      sord.objKeys[docx_statusIndexLine].data = [ docx_importStatusMsg ];
      
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, id, id, this.mapData, LockC.NO);
      ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.YES);
    } catch(e) {
      ixConnect.ix().checkinSord(sord, SordC.mbOnlyLock, LockC.YES);
      throw(e);
    }
  },
  
  assignMap: function(data, attribPrefix, mapPrefix, ty) {
    var prefixLen = attribPrefix.length;
    var cnt = data.FIELD.length();
    
    for (var i = 0; i < cnt; i++) {
      var field = data.FIELD[i];
      var name = field.@Name;
      if (name.substring(0, prefixLen) == attribPrefix) {
        var mapName = mapPrefix + name.substring(prefixLen);
        var value = field.@Value;
        value = this.processValue(value, ty);
        var kv = new KeyValue(mapName, value);
        this.mapData.push(kv);
      }
    }
  },
  
  assignField: function(data, attribName, objKeys, indexLineNo, ty) {
    value = this.getFieldValue(data, attribName, ty);
    objKeys[indexLineNo].data = [value];
  },
  
  getFieldValue: function(data, attribName, ty) {
    var item = data.FIELD.(@Name==attribName);
    var value = item.@Value;
    
    return this.processValue(value, ty);
  },
  
  processValue: function(value, ty) {
    value = String(value);
    
    if (ty == "D") {
      value = this.processDate(value);
    } else if (ty == "N") {
      value = this.processNumber(value);
    }
    
    return value;
  },
  
  processNumber: function(value) {
    // TODO Punkt, Komma Anpassung
    return value;
  },
  
  processDate: function(unformattedDate) {
    ufd = unformattedDate;
    
    if ((ufd.length == 10) && (ufd.substring(2,3) == ".")) {
      return ufd.substring(6) + ufd.substring(3, 5) + ufd.substring(0, 2);
    } else if ((ufd.length == 8) && (ufd.substring(2,3) == ".")) {
      return "20" + ufd.substring(6) + ufd.substring(3, 5) + ufd.substring(0, 2);
    } else {
      return ufd;
    }
  },
  
  exportCmd: function (path, sord) {
    if (sord.type < 254) {
      this.createXmlFile(path, sord);
    } else {
      log.warn("Es können nur Ordner als DocExtractor Quelle aufgeführt werden: " + sord.id + " : " + sord.name);
    }
    return;
  },
  
  createXmlFile: function(path, sord) {
    var destPathName = path + File.separator + docx_asExportDir;

    var imageData = this.exportFiles(destPathName, sord);
    var fileContent = this.fillupXmlTemplate(sord, imageData);
    var destXmlFile = destPathName + File.separator + sord.guid + ".xml";
    fu.asFile(destXmlFile, fileContent, "UTF-8");
  },
  
  exportFiles: function(path, sord) {
    var xmlData = new Array();
    var sords = ix.collectChildren(sord.id);
    
    for (var i = 0; i < sords.length; i++) {
      log.info(sords[i].name);
      var image = this.fillupImage(path, sord.guid, sords[i], i);
      xmlData.push(image);
    }
    
    return xmlData.join("");
  },
  
  fillupImage: function(path, guid, sord, cnt) {
    var isRechnung = this.checkForInvoice(sord);
    
    var text = docx_imageTemplate;
    text = text.replace(/\%Guid\%/, guid);
    text = text.replace(/\%ImageId\%/g, cnt);
    text = text.replace(/\%Skipped\%/, isRechnung ? "FALSE" : "TRUE");
    text = text.replace(/\%Ext%/g, sord.docVersion.ext);
    
    var fileName = path + File.separator + guid + "-" + cnt;
    ix.downloadDocument(fileName, sord);
    
    return text;
  },
  
  fillupXmlTemplate: function(sord, imageData) {
    var text = docx_xmlTemplate;
    text = text.replace(/\%Guid\%/, sord.guid);
    text = text.replace(/\%Id\%/, sord.id);
    text = text.replace(/\%Scandatum\%/, sord.IDateIso);
    text = text.replace(/\%TimeStamp\%/, new Date());
    text = text.replace(/\%Images\%/, imageData);
    
    return text;
  }
  
} // end of namespace docx