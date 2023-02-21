importPackage(Packages.java.lang);
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

wfHelper = new Object();
wfHelper = {

  wkhtmltopdf: "C:\\Program Files (x86)\\wkhtmltopdf\\wkhtmltopdf.exe",
    
  urlFirstPart: "http://vmweelotest05:9090/wf-Archive1",
  
  appendFrozenForm: function(wfCollectNode, sord) {
    
    var formName = this.getFormName(wfCollectNode);
    
    var ticket = ixConnect.getLoginResult().getClientInfo().getTicket();
    var urlParams = new Array();
    urlParams.push("wfid=" + wfCollectNode.flowId);
    urlParams.push("nodeid=" + wfCollectNode.nodeId);
    urlParams.push("ticket=" + ticket);
    urlParams.push("lang=de")
    
    var url = this.urlFirstPart + "/" + formName + ".jsp?" + urlParams.join("&");
    
    var tempFile = File.createTempFile("FrozenForm" + sord.id + "_", ".pdf");
    var tempFilePath = tempFile.getAbsolutePath();
    
    this.convertHtmlToPdf(url, tempFilePath);
    this.saveAttachment(sord, tempFile);
    tempFile["delete"]();
  },
  
  getFormName: function(wfCollectNode) {
  
    var wfdiag = wf.readActiveWorkflow(false);
    var formSpec = wfdiag.nodes[wfCollectNode.nodeId].formSpec;
    var formStartPos = formSpec.indexOf("[") + 1;
    var formEndPos = formSpec.indexOf("(");
    return formSpec.substring(formStartPos, formEndPos);
  },
  
  convertHtmlToPdf: function(url, destPath) {

    log.debug("url=" + url);
    log.debug("destPath=" + destPath);
    var proc = Runtime.getRuntime().exec([this.wkhtmltopdf, url, destPath]);
    
    var br = new BufferedReader(new InputStreamReader(proc.getErrorStream()));
    var line = null;
    while ( (line = br.readLine()) != null) {
      log.debug(line);
    }
    
    var returnCode = proc.waitFor();
    log.debug("returnCode=" + returnCode);
  },
  
  saveAttachment: function(sord, file) {
  
    var ed = ixConnect.ix().checkoutDoc(sord.id, null, EditInfoC.mbSordDocAtt, LockC.NO);
    var doc = ed.document;

    var docVersions = new Array(1);
    docVersions[0] = new DocVersion(); 

    doc.atts = docVersions;
    doc.atts[0].pathId = doc.docs[0].pathId;
    doc.atts[0].ext = ixConnect.getFileExt(file);
    doc = ixConnect.ix().checkinDocBegin(doc);

    doc.atts[0].uploadResult = ixConnect.upload(doc.atts[0].url, file)
    doc = ixConnect.ix().checkinDocEnd(null, null, doc, LockC.YES);
    log.debug("sord.id" + doc.objId + ", attachment.id=" + doc.atts[0].id);
  }
}
