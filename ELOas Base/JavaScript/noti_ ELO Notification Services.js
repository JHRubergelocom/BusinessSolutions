// ELO Notification Services Library

var notify = new Notify();

function Notify() {
  this.templateRoot = "ARCPATH:¶Administration¶ELOas Base¶Misc¶";
  this.templatePath = this.templateRoot + "wfReminder";
  this.optionKey = "ELOas.SendWfAsMail";
  this.showMailBody = false;
}

/**
* prüft nach, ob der aktuelle Workflow-Eintrag einen
* konfigurierten Feed Kommentar enthält. So ein Knoten hat
* in der Arbeitsanweisung einen Text beginnend mit #wfaddfeed
* oder #wfmailandfeed. Wenn so ein Knoten vorliegt, wird
* ein neuer Feed Eintrag mit den aktuellen Parametern eingetragen.
*/
Notify.prototype.checkAddFeed = function() {
  this.withIndex = true;
  var comment = EM_WF_NODE.nodeComment;
  if (comment.startsWith("#wfaddfeed") || comment.startsWith("#wfmailandfeed")) {
    var props = this.getProperties(comment);
    
    var templateName = props.getProperty("feedtemplate");
    if (!templateName) {
      templateName = "wffeed";
    }
    
    var template = this.getTemplate(this.templateRoot + templateName);
    var msg = "";

    if ((typeof(notifyCallback) == "object") && notifyCallback.formatFeedMessage) {
      msg = notifyCallback.formatFeedMessage(template, EM_WF_NODE, EM_ACT_SORD, props);
    }
    
    if (!msg) {
      msg = this.substituteVars2(template, EM_WF_NODE, EM_ACT_SORD, props);
    }
    
    ix.addFeedComment(EM_ACT_SORD.guid, 0, msg);
    
    log.debug("Add feed entry done.");
    
    EM_WF_NEXT = "0";
  }
}

/**
* prüft nach, ob der aktuelle Workflow-Eintrag einen
* konfigurierten Mail Kommentar enthält. So ein Knoten hat
* in der Arbeitsanweisung einen Text beginnend mit #wfsendmail
* oder #wfmailandfeed. Wenn so ein Knoten vorliegt, wird
* eine EMail mit den aktuellen Parametern versandt.
*/
Notify.prototype.checkSendMail = function() {
  this.withIndex = true;
  var comment = EM_WF_NODE.nodeComment;
  if (comment.startsWith("#wfsendmail") || comment.startsWith("#wfmailandfeed")) {
    var props = this.getProperties(comment);
    
    var templateName = props.getProperty("template");
    var recipient = this.getMailUser(props.getProperty("recipient"));
    var sender = this.getMailUser(props.getProperty("sender"));
    var subject = props.getProperty("subject");
    if (!subject) {
      subject = EM_ACT_SORD.name;
    }
    
    if ((typeof(notifyCallback) == "object") && notifyCallback.getSubject) {
      var text = notifyCallback.getSubject(EM_WF_NODE, EM_ACT_SORD, props);
      if (text) {
        subject = text;
      }
    }
    
    if (!templateName) {
      templateName = "wfmail";
    }
    var template = this.getTemplate(this.templateRoot + templateName);
    var msg = "";

    if ((typeof(notifyCallback) == "object") && notifyCallback.formatMessage) {
      msg = notifyCallback.formatMessage(template, EM_WF_NODE, EM_ACT_SORD, props);
    }
    
    if (!msg) {
      msg = this.substituteVars2(template, EM_WF_NODE, EM_ACT_SORD, props);
    }
    
    var withAttachment = props.getProperty("withattachment");
    if (withAttachment) {
      withAttachment = withAttachment == "true";
    }
    
    if (withAttachment) {
      mail.sendMailWithAttachment(sender, recipient, subject, msg, EM_ACT_SORD.id, true);
    } else {
      mail.sendHtmlMail(sender, recipient, subject, msg);
    }
    
    log.debug("Send mail to " + recipient + " done.");
    
    EM_WF_NEXT = "0";
  }
}

/**
* Ermittelt zu einem Konfigurationseintrag die eingestellte
* EMail Adresse.
* Wenn der Eintrag mit $ELO$ beginnt, wird der folgende Teil als
* ELO Anwendername verwendet. Daraus wird dann die Mailadresse ausgelesen.
* Beginnt der Eintrag mit $INDEX$, wird der folgende Teil als
* Gruppenname der Indexzeile interpretiert. Der Inhalt dieser
* Indexzeile wird dann als Mailadresse verwendet.
* Lautet der Eintrag $PARENT$ wird der Eigentümer des Vorgängerknotens
* als ELO Anwender verwendet. Daraus wird dann die Mailadresse ausgelesen.
*
* user: Kennung für die Mailadresse
*/
Notify.prototype.getMailUser = function(user) {
  if ((typeof(notifyCallback) == "object") && notifyCallback.getMailUser) {
    var text = notifyCallback.getMailUser(user);
    if (text) {
      return text;
    }
  }

  if (!user) {
    return "";
  }
  
  if (user.startsWith("$ELO$")) {
    var eloUser = user.substring(5);
    user = this.getMailAddress(eloUser);
  } else if (user.startsWith("$INDEX$")) {
    var groupName = user.substring(7);
    user = elo.getIndexValueByName(EM_ACT_SORD, groupName, "");
  } else if (user == "$PARENT$") {
    var eloUser = this.getParentUserName();
    user = this.getMailAddress(eloUser);
  }
  
  return user;
}

/**
* Liefert den Vorgängerknoten des aktuellen Workflow Knotens.
* Falls es mehr als ein Vorgänger gibt, wird ein zufälliger
* Knoten aus der Liste der Vorgänger ausgewählt.
*/
Notify.prototype.getParent = function() {
  var myNodeId = EM_WF_NODE.nodeId;
  var wfDiagram = ixConnect.ix().checkoutWorkFlow( EM_WF_NODE.flowId, WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.NO );
  var links = wfDiagram.matrix.assocs;
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.nodeTo == myNodeId) {
      var parentNodeId = link.nodeFrom;
      var nodes = wfDiagram.nodes;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.id == parentNodeId) {
          return node;
        }
      }
    }
  }
  
  return null;
}

/**
* Liefert den Anwender des Vorgängerknotens des aktuellen Workflow Knotens.
* Falls es mehr als ein Vorgänger gibt, wird ein zufälliger
* Knoten aus der Liste der Vorgänger ausgewhlt.
*/
Notify.prototype.getParentUserName = function() {
  var parent = this.getParent();
  return (parent) ? parent.userName : null;
}

/**
* Liest die komplette ELO Anwenderliste aus und prüft für
* jeden Anwender nach, ob dieser eine Workflow Überwachung
* angemeldet hat und führt diese aus.
*
* replyTo: Antwort-An-Mailadresse
* subject: Betreff Text der Mail
* withGroups: Auch Gruppentermine in die Prüfung einbeziehen
* withDeputies: Auch Vertretungstermine in die Prfung einbeziehen
* withIndex: Die zu versendende Mail kann auch Indexzeilenwerte enthalten
*/
Notify.prototype.processAllUsers = function(replyTo, subject, withGroups, withDeputies, withIndex) {
  var users = ixConnect.ix().checkoutUsers(null, CheckoutUsersC.ALL_USERS_RAW, LockC.NO);

  for (var u = 0; u < users.length; u++) {
    this.processUserItems(users[u].id, replyTo, subject, withGroups, withDeputies, withIndex);
  }
}

/**
* Prüft für den angegebenen Anwender nach, ob dieser eine
* Workflow-Überwachung angemeldet hat und führt diese aus.
*
* userId: zu prüfender Anwender
* replyTo: Antwort-An-Mailadresse
* subject: Betreff Text der Mail
* withGroups: Auch Gruppentermine in die Prüfung einbeziehen
* withDeputies: Auch Vertretungstermine in die Prüfung einbeziehen
* withIndex: Die zu versendende Mail kann auch Indexzeilenwerte enthalten
*/
Notify.prototype.processUserItems = function(userId, replyTo, subject, withGroups, withDeputies, withIndex) {
  log.debug("Check Settings of user: " + userId);
  var ix = ixConnect.ix();
  
  try {
    if (!this.loadReportFlags(userId)) {
      log.debug("EMail report disabled by user option");
      return;
    }
    
    log.debug("Start Process User Items of user: " + userId);
    
    if (!this.withWeekend) {
      var day = new Date().getDay();
      var isWeekend = (day == 6) || (day == 0);
      if (isWeekend) {
        log.debug("Do not send mail at weekend days");
        return;
      }
    }
    
    withGroups = Boolean(withGroups & this.withGroups);
    withDeputies = Boolean(withDeputies & this.withDeputies);
    
    var wfInfo = this.prepareFindInfo(userId, withGroups, withDeputies, withIndex);
    this.startUser(userId, replyTo, subject, withIndex);
    this.prepareTable();
    
    var findResult = ix.findFirstTasks(wfInfo, 1000);
    var index = 0;
    for (;;) {
      var tasks = findResult.tasks;
      log.debug("Found: " + tasks.length);
      for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if ((typeof(notifyCallback) == "object") && notifyCallback.filterTask) {
          if (!notifyCallback.filterTask(task)) {
            continue;
          }
        }
        
        this.processTask(task);
      }
      
      if (!findResult.moreResults) {
        break;
      }
      
      index += tasks.length;
      findResult = ix.findNextTasks(findResult.searchId, index, 1000);
    }
    
    ix.findClose(findResult.searchId);
    this.finalize();
  } catch(e) {
    log.warn("Error processing Notification List: " + e);
  }
  
  log.debug("End Process User Items");
}

Notify.prototype.finalize = function() {
  log.debug("Start finalize");
  if ((this.lines.length > 0) || this.sendAlways) {
    log.debug("Lines: " + this.lines.length);
    var text = this.headerPart + this.lines.join("\r\n") + this.footerPart;
    
    var mailAddress = this.getMailAddress(this.userId);
    log.debug("Send to Address: " + mailAddress);
    if (mailAddress) {
      if (this.showMailBody) {
        // only for debugging
        var tempFile =  File.createTempFile("wfnotify", ".html");
        FileUtils.writeStringToFile(tempFile, text, "UTF-8");
        Packages.java.awt.Desktop.desktop.open(tempFile);
      }
      
      if ((typeof(notifyCallback) == "object") && notifyCallback.beforeSend) {
        text = notifyCallback.beforeSend(text);
      }

      if (text) {
        log.info("now send mail to " + mailAddress + text);
        mail.sendHtmlMail(this.replyTo, mailAddress, this.subject, text);
      }
    } else {
      log.warn("User request without mail address: " + this.userId);
    }
  }
}

Notify.prototype.processTask = function(task) {
  var wfNode = task.wfNode;
  log.debug(wfNode.nodeName);
  
  if (this.onlyOnce) {
    var mapid = "NOTIFY_SENT_" + wfNode.nodeId;
    var values = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, [mapid], LockC.NO);
    if (values && values.items.length > 0) {
      var data = values.items[0].value;  
      if (data == "sent") {
        log.info("Sent entry ignored: " + wfNode.flowId + " - " + wfNode.nodeId);
        return;
      }
    }

    var item = new KeyValue();
    item.key = mapid;
    item.value = "sent";
    ixConnect.ix().checkinMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, wfNode.flowId, wfNode.objId, [item], LockC.NO);
  }
  
  var text = this.getTableLine(task);
  text = this.substituteVars(text, task);
  
  
  this.lines.push(text);
}

Notify.prototype.startUser = function(userId, replyTo, subject, withIndex) {
  this.userId = userId;
  this.replyTo = replyTo;
  this.subject = subject;
  this.withIndex = withIndex;
  this.linePart = null;
  this.lines = new Array();
  this.lineCache = new Object();
}

Notify.prototype.prepareFindInfo = function(userId, withGroups, withDeputies, withIndex) {
  var wfInfo = new FindTasksInfo();
  
  wfInfo.inclDeputy = withDeputies;
  wfInfo.inclGroup = withGroups;
  wfInfo.inclWorkflows = true;
  wfInfo.inclOverTimeForSuperior = true;
  wfInfo.lowestPriority = UserTaskPriorityC.LOWEST ;
  wfInfo.highestPriority = UserTaskPriorityC.HIGHEST ;
  wfInfo.userIds = [userId];

  if (withIndex) {
    wfInfo.sordZ = SordC.mbAllIndex;
  }
  
  return wfInfo;
}

Notify.prototype.substituteVars = function(text, task) {
  return this.substituteVars2(text, task.wfNode, task.sord);
}

Notify.prototype.substituteVars2 = function(text, node, sord, props) {
  var startDate = this.formatDate(node.activateDateWorkflowIso);
  var timeLimit = this.formatDate(node.timeLimitIso);
  
  text = text.replace("$$nodeName$$", node.nodeName);
  text = text.replace("$$userName$$", node.userName);
  text = text.replace("$$flowName$$", node.flowName);
  text = text.replace("$$flowStatus$$", node.flowStatus);
  text = text.replace("$$activateDate$$", startDate);
  text = text.replace("$$timeLimit$$", timeLimit);
  text = text.replace("$$objName$$", node.objName);

  text = text.replace("$$objGuid$$", node.objGuid);
  text = text.replace("$$objId$$", node.objId);

  if (this.withIndex) {
    if (sord) {
      text = text.replace("$$maskName$$", sord.maskName );

      var objKeys = sord.objKeys;
      
      for (var k = 0; k < objKeys.length; k++) {
        var key = objKeys[k];
        var value = "";
        if (key.data && (key.data.length > 0)) {
          value = key.data[0];
        }
        
        text = text.replace("$$ixkey_" + key.id + "$$", value);
        text = text.replace("$$ixgroup_" + key.name + "$$", value);
      }
    }
  }
    
  if (this.isOverTimeLimit(node)) {
    text = text.replace(/\$\$className\$\$/g, "urgent");
  } else if (node.userId != this.userId) {
    text = text.replace(/\$\$className\$\$/g, "group");
  } else {
    text = text.replace(/\$\$className\$\$/g, "normal");
  }
  
  if (props) {
    var allNames = props.propertyNames();
    
    while (allNames.hasMoreElements()) {
      var pname = allNames.nextElement();
      var pvalue = props.getProperty(pname);
      
      if (pvalue) {
        text = text.replace("$$param." + pname + "$$", pvalue);
      }
    }
  }
  
  // alle übergebliebenen Platzhalter löschen
  text = text.replace(/\$\$\w+\$\$/g, "");
  
  return text;
}

Notify.prototype.isOverTimeLimit = function(node) {
  if (node.isOverTimeLimit()) {
    return true;
  }
  
  var esc = node.timeLimitEscalations;
  for (var i = 0; i < esc.length; i++) {
    if (esc[i].isOverTimeLimit()) {
      return true;
    }
  }
  
  return false;
}

Notify.prototype.formatDate = function(isoDate) {
  isoDate = String(isoDate);
  
  if (isoDate.length == 8) {
    return isoDate.substring(6, 8) + "." + isoDate.substring(4, 6) + "." + isoDate.substring(0, 4);
  }

  if (isoDate.length == 14) {
    return isoDate.substring(6, 8) + "." + isoDate.substring(4, 6) + "." + isoDate.substring(0, 4) +
           "  " + isoDate.substring(8, 10) + ":" + isoDate.substring(10, 12) + ":" + isoDate.substring(12);
  }
  
  return isoDate;
}

Notify.prototype.getTableLine = function(task) {
  if ((typeof(notifyCallback) == "object") && notifyCallback.getTableLine) {
    var line = notifyCallback.getTableLine(task);
    if (line != null) {
      return line;
    }
  }
  
  if (this.withIndex) {
    var sord = task.sord;
    if (sord) {
      var maskName = sord.maskName;
      if (this.lineCache[maskName]) {
        return this.lineCache[maskName];
      }
      
      try {
        var maskTemplate = this.getTemplate(this.templatePath + "_" + maskName);
        this.lineCache[maskName] = maskTemplate;
        return maskTemplate;
      } catch(e) {
        log.debug("No Mask Template found, use default template");
        this.lineCache[maskName] = this.linePart;
      }
    }
  }
  
  return this.linePart;
}

Notify.prototype.prepareTable = function() {
  var template = this.getTemplate(this.templatePath);
  var splitPos1 = template.indexOf("<!--ListStart-->");
  var splitPos2 = template.indexOf("<!--ListEnd-->");
  
  if ((splitPos1 < 0) || (splitPos2 < 0)) {
    throw "Invalid List Template, start or end position missing";
  }
  
  this.headerPart = template.substring(0, splitPos1);
  this.linePart = template.substring(splitPos1 + 16, splitPos2);
  this.footerPart = template.substring(splitPos2 + 14);
}

Notify.prototype.getTemplate = function(templatePath) {
  var editInfo = ixConnect.ix().checkoutSord(templatePath, EditInfoC.mbSordDoc, LockC.NO);
  var url = editInfo.sord.docVersion.url;
  
  var tempFile =  File.createTempFile("wfnotifytemplate", ".html");
  ixConnect.download(url, tempFile);
  
  var text = FileUtils.readFileToString(tempFile, "UTF-8");
  tempFile["delete"]();
  
  return String(text);
}

Notify.prototype.loadReportFlags = function(userId) {
  this.profileFlags = 0;
  var profile = new UserProfile();
  var key = new KeyValue();
  key.key = this.optionKey;
  profile.options = [key];
  profile.userId = userId;
  
  profile = ixConnect.ix().checkoutUserProfile(profile, LockC.NO);
  
  if (!profile.options || (profile.options.length == 0)) {
    return false;
  }
  
  for (var i = 0; i < profile.options.length; i++) {
    if (profile.options[i].key == this.optionKey) {
      var opt = Number(profile.options[i].value);
      
      this.enableMail = (opt & 1) != 0;
      this.sendAlways = (opt & 2) != 0;
      this.withGroups = (opt & 4) != 0;
      this.withDeputies = (opt & 8) != 0;
      this.withWeekend = (opt & 16) != 0;
      this.onlyOnce = (opt & 32) != 0;
      
      return this.enableMail;
    }
  }
  
  return false;
}

/**
* Liest zu einem ELO Anwender die konfigurierte Mail Adresse aus
*
* userId: ELO Anwender
*/
Notify.prototype.getMailAddress = function(userId) {
  var users = ixConnect.ix().checkoutUsers([userId], CheckoutUsersC.BY_IDS, LockC.NO);
  return users[0].userProps[1];
}

/**
* Erzeugt aus einem String ein Java Properties Objekt. Diese
* enthält Schlüssel-Wert Paare mit Konfigurationsdaten.
*
* description: Text der Properties, z.B. aus dem Memo Text
*/
Notify.prototype.getProperties = function(description) {
  var reader = new Packages.java.io.StringReader(description);
  var props = new Packages.java.util.Properties();
  props.load(reader);
  
  return props;
}
