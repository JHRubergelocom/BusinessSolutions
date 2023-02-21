// start namespace tfer
function TfReference(parentGuid, objectGuid, deleted) {
  this.jsonClass = "TfReference";
  this.parentGuid = String(parentGuid);
  this.objectGuid = String(objectGuid);
  this.deleted = deleted;
}

TfReference.prototype.fillup = function(reference) {
}

function TfUserOptions(options) {
  this.items = new Array();
  if (!options) {
    return;
  }
  
  for (var i = 0; i < options.length; i++) {
    var opt = String(options[i].key) + "¶" + String(options[i].value);
    this.items.push(opt);
  }
}

TfUserOptions.prototype.fillup = function(options) {
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var pos = item.indexOf("¶");
    if (pos > 0) {
      var key = item.substring(0, pos);
      var value = item.substring(pos + 1);
      var kv = new KeyValue(key, value);
      options.push(kv);
    }
  }
}

function TfMapData(mapData, objGuid) {
  this.jsonClass = "TfMapData";
  this.id = Number(mapData.id);
  this.name = String(mapData.domainName);
  this.guid = String(mapData.guid);
  this.objId = Number(mapData.objId);
  this.objGuid = String(objGuid);
  
  this.items = new Array();
  var it = mapData.items;
  for (var i = 0; i < it.length; i++) {
    var mapItem = it[i]
    var item = new Object();
    item.key = String(mapItem.key);
    item.value = String(mapItem.value);
    this.items.push(item);
  }
  
  if (EM_EventsI && (typeof EM_EventsI.tferMapWrite == "function")) {
    EM_EventsI.tferMapWrite(this, mapData);
  }
}

TfMapData.prototype.fillup = function(mapData) {
  mapData.id = this.id;
  mapData.domainName = this.name;
  mapData.guid = this.guid;
  mapData.objId = this.objId;
  
  var cnt = this.items.length;
  result = new Array(cnt);
  for (var i = 0; i < cnt; i++) {
    var item = this.items[i];
    var kv = new KeyValue(item.key, item.value);
    result[i] = kv;
  }
  
  mapData.setItems(result);
  
  if (EM_EventsI && (typeof EM_EventsI.tferMapFillup == "function")) {
    EM_EventsI.tferMapFillup(wfDiagram, this, translator);
  }
}

function TfWorkflow(wfDiagram, translator) {
  this.jsonClass = "TfWorkflow";
  this.id = Number(wfDiagram.id);
  this.name = String(wfDiagram.name);
  this.guid = String(wfDiagram.guid);
  
  this.aclItems = new TfObjAcls(wfDiagram.aclItems);
  this.completionDateIso = String(wfDiagram.completionDateIso);
  this.deleted = Boolean(wfDiagram.deleted);
  this.flags = Number(wfDiagram.flags);
  this.objType = Number(wfDiagram.objType);
  this.overTimeLimit = Boolean(wfDiagram.overTimeLimit);
  this.ownerGuid = translator.fromId(Number(wfDiagram.ownerId)).guid;
  log.info("export: " + this.ownerGuid + " : " + wfDiagram.ownerId);
  this.prio = Number(wfDiagram.prio);
  this.processOnServerId = String(wfDiagram.processOnServerId);
  this.startDateIso = String(wfDiagram.startDateIso);
  this.timeLimitIso = String(wfDiagram.timeLimitIso);
  this.timeLimitUserName = String(wfDiagram.timeLimitUserName);
  
  this.matrix = new TfWfMatrix(wfDiagram.matrix);
  this.nodes = new TfWfNodes(wfDiagram.nodes, translator);
  this.timeLimitEscalations = new TfWfTimeLimits(wfDiagram.timeLimitEscalations);
  
  if (EM_EventsI && (typeof EM_EventsI.tferWorkflowWrite == "function")) {
    EM_EventsI.tferWorkflowWrite(this, wfDiagram, translator);
  }
}

TfWorkflow.prototype.fillup = function(wfDiagram, translator) {
  wfDiagram.name = this.name;
  wfDiagram.guid = this.guid;
  
  wfDiagram.completionDateIso = this.completionDateIso;
  wfDiagram.deleted = this.deleted;
  wfDiagram.flags = this.flags;
  wfDiagram.objType = this.objType;
  wfDiagram.overTimeLimit = this.overTimeLimit;
  wfDiagram.ownerId = translator.fromGuid(this.ownerGuid).id;
  log.info("import: " + this.ownerGuid + " : " + wfDiagram.ownerId);
  wfDiagram.prio = this.prio;
  wfDiagram.processOnServerId = this.processOnServerId;
  wfDiagram.startDateIso = this.startDateIso;
  wfDiagram.timeLimitIso = this.timeLimitIso;
  wfDiagram.timeLimitUserName = this.timeLimitUserName;
  wfDiagram.timeLimitUserId = -1;
  
  var objAcls = new Array();
  var jAcls = this.aclItems;
  jAcls.fillup = TfObjAcls.prototype.fillup;
  jAcls.fillup(objAcls);
  wfDiagram.aclItems = objAcls;
  
  var matrix = new WFNodeMatrix();
  var jmatrix = this.matrix;
  jmatrix.fillup = TfWfMatrix.prototype.fillup;
  jmatrix.fillup(matrix);
  wfDiagram.matrix = matrix;
  
  var nodes = new Array();
  var jnodes = this.nodes;
  jnodes.fillup = TfWfNodes.prototype.fillup;
  jnodes.fillup(nodes, translator);
  wfDiagram.nodes = nodes;
  
  var timeLimits = new Array();
  var jtimeLimits = this.timeLimitEscalations;
  jtimeLimits.fillup = TfWfTimeLimits.prototype.fillup;
  jtimeLimits.fillup(timeLimits);
  wfDiagram.timeLimitEscalations = timeLimits;
  
  if (EM_EventsI && (typeof EM_EventsI.tferWorkflowFillup == "function")) {
    EM_EventsI.tferWorkflowFillup(wfDiagram, this, translator);
  }
}

function TfWfNodes(nodes, translator) {
  var result = new Array();
  if (!nodes) {
    return result;
  }
  
  for (var i = 0; i < nodes.length; i++) {
    var jnode = new TfWfNode(nodes[i], translator);
    result.push(jnode);
  }
  
  return result;
}

TfWfNodes.prototype.fillup = function(nodes, translator) {
  for (var i = 0; i < this.length; i++) {
    var node = new WFNode();
    var jnode = this[i];
    jnode.fillup = TfWfNode.prototype.fillup;
    jnode.fillup(node, translator);
    nodes.push(node);
  }
}

function TfWfNode(node, translator) {
  this.id = Number(node.id);
  this.name = String(node.name);
  
  this.allowActivate = Boolean(node.allowActivate);
  this.comment = String(node.comment);
  this.delayDateIso = String(node.delayDateIso);
  this.delayDays = Number(node.delayDays);
  this.userGuid = translator.fromId(Number(node.userId)).guid;
  this.department2Guid = translator.fromId(Number(node.department2)).guid;
  this.designDepartmentGuid = translator.fromId(Number(node.designDepartment)).guid;
  this.enterDateIso = String(node.enterDateIso);
  this.exitDateIso = String(node.exitDateIso);
  this.flags = Number(node.flags);
  this.formSpec = String(node.formSpec);
  this.iconId = String(node.iconId);
  this.inUseDateIso = String(node.inUseDateIso);
  this.isNext = Number(node.isNext);
  this.label = String(node.label);
  this.labelTranslationKey = String(node.labelTranslationKey);
  this.moveCyclePosX = Number(node.moveCyclePosX);
  this.nameTranslationKey = String(node.nameTranslationKey);
  this.nbOfDonesToExit = Number(node.nbOfDonesToExit);
  this.onEnter = String(node.onEnter);
  this.onExit = String(node.onExit);
  this.overTimeLimit = Boolean(node.overTimeLimit);
  this.posX = Number(node.posX);
  this.posY = Number(node.posY);
  this.processOnServerId = String(node.processOnServerId);
  this.timeLimit = String(node.timeLimit);
  this.timeLimitIso = String(node.timeLimitIso);
  this.type = Number(node.type);
  this.userDelayDateIso = String(node.userDelayDateIso);
  this.yesNoCondition = String(node.yesNoCondition);
  
  this.scriptNames = new TfStringArray(node.scriptNames);
  this.objKeyNames = new TfStringArray(node.objKeyNames);
  this.timeLimitEscalations = new TfWfTimeLimits(node.timeLimitEscalations);
}

TfWfNode.prototype.fillup = function(node, translator) {
  node.id = this.id;
  node.name = this.name;
  
  node.allowActivate = this.allowActivate;
  node.comment = this.comment;
  node.delayDateIso = this.delayDateIso;
  node.delayDays = this.delayDays;
  node.userId = translator.fromGuid(this.userGuid).id;
  node.department2 = translator.fromGuid(this.department2Guid).id;
  node.designDepartment = translator.fromGuid(this.designDepartmentGuid).id;
  node.enterDateIso = this.enterDateIso;
  node.exitDateIso = this.exitDateIso;
  node.flags = this.flags;
  node.formSpec = this.formSpec;
  node.iconId = this.iconId;
  node.inUseDateIso = this.inUseDateIso;
  node.isNext = this.isNext;
  node.label = this.label;
  node.labelTranslationKey = this.labelTranslationKey;
  node.moveCyclePosX = this.moveCyclePosX;
  node.nameTranslationKey = this.nameTranslationKey;
  node.nbOfDonesToExit = this.nbOfDonesToExit;
  node.onEnter = this.onEnter;
  node.onExit = this.onExit;
  node.overTimeLimit = this.overTimeLimit;
  node.posX = this.posX;
  node.posY = this.posY;
  node.processOnServerId = this.processOnServerId;
  node.timeLimit = this.timeLimit;
  node.timeLimitIso = this.timeLimitIso;
  node.type = this.type;
  node.userDelayDateIso = this.userDelayDateIso;
  node.yesNoCondition = this.yesNoCondition;
  
  node.scriptNames = this.scriptNames;
  node.objKeyNames = this.objKeyNames;
  
  var timeLimits = new Array();
  var jtimeLimits = this.timeLimitEscalations;
  jtimeLimits.fillup = TfWfTimeLimits.prototype.fillup;
  jtimeLimits.fillup(timeLimits);
  node.timeLimitEscalations = timeLimits;
}

function TfStringArray(strings) {
  var result = new Array();
  if (!strings) {
    return result;
  }
  
  for (var i = 0; i < strings.length; i++) {
    result.push(String(strings[i]));
  }
  return result;
}

function TfWfTimeLimits(limits) {
  var result = new Array();
  if (!limits) {
    return result;
  }
  
  for (var i = 0; i < limits.length; i++) {
    var jlimit = new TfWfTimeLimit(limits[i]);
    result.push(jlimit);
  }
  
  return result;
}

TfWfTimeLimits.prototype.fillup = function(limits) {
  for (var i = 0; i < this.length; i++) {
    var jlimit = this[i];
    jlimit.fillup = TfWfTimeLimit.prototype.fillup;
    var limit = new WFTimeLimit();
    jlimit.fillup(limit);
    limits.push(limit);
  }
}

function TfWfTimeLimit(limit) {
  this.overTimeLimit = Boolean(limit.overTimeLimit);
  this.timeLimit = Number(limit.timeLimit);
  this.timeLimitIso = String(limit.timeLimitIso);
  this.userName = String(limit.userName);
}

TfWfTimeLimit.prototype.fillup = function(limit) {
  limit.overTimeLimit = this.overTimeLimit;
  limit.timeLimit = this.timeLimit;
  limit.timeLimitIso = this.timeLimitIso;
  limit.userName = this.userName;
  limit.userId = -1;
}
  
function TfWfMatrix(matrix) {
  var assocs = matrix.assocs;
  var result = new Array();
  if (!assocs) {
    return result;
  }
  
  
  for (var i = 0; i < assocs.length; i++) {
    var jassoc = new TfWfAssoc(assocs[i]);
    result.push(jassoc);
  }
  
  return result;
}

TfWfMatrix.prototype.fillup = function(matrix) {
  var assocs = new Array();
  
  for (var i = 0; i < this.length; i++) {
    var assoc = new WFNodeAssoc();
    var jassoc = this[i];
    jassoc.fillup = TfWfAssoc.prototype.fillup;
    jassoc.fillup(assoc);
    assocs.push(assoc);
  }
  
  matrix.assocs = assocs;
}

function TfWfAssoc(assoc) {
  this.done = Boolean(assoc.done);
  this.nodeFrom = Number(assoc.nodeFrom);
  this.nodeTo = Number(assoc.nodeTo);
  this.type = Number(assoc.type);
}

TfWfAssoc.prototype.fillup = function(assoc) {
  assoc.done = this.done;
  assoc.nodeFrom = this.nodeFrom;
  assoc.nodeTo = this.nodeTo;
  assoc.type = this.type;
}

function TfMask(docMask, workflowTranslator, keywordsProvider) {
  this.jsonClass = "TfMask";
  this.id = Number(docMask.id);
  this.name = String(docMask.name);
  this.guid = String(docMask.guid);
  
  this.barcode = String(docMask.barcode);
  this.kind = Number(docMask.DKind);
  this.path = Number(docMask.DPath);
  this.flowName = workflowTranslator.nameFromId(docMask.flowId);
  this.flowName2 = workflowTranslator.nameFromId(docMask.flowId2);
  this.index = String(docMask.index);
  this.lifetime = String(docMask.lifetime);
  this.nameTranslationKey = String(docMask.nameTranslationKey);
  this.textTranslationKey = String(docMask.textTranslationKey);
  this.text = String(docMask.text);  

  this.aclItems = new TfObjAcls(docMask.aclItems);
  this.docAclItems = new TfObjAcls(docMask.docAclItems);

  var det = docMask.details;
  var jdet = new Object();
  jdet.archivingMode = Number(det.archivingMode);
  jdet.createIndexPath = Boolean(det.createIndexPath);
  jdet.createIndexReferencesPaths = Boolean(det.createIndexReferencesPaths);
  jdet.documentMask = Boolean(det.documentMask);
  jdet.folderMask = Boolean(det.folderMask);
  jdet.searchMask = Boolean(det.searchMask);
  jdet.encryptionSet = Number(det.encryptionSet);
  jdet.fulltext = Boolean(det.fulltext);
  jdet.releaseDocument = Boolean(det.releaseDocument);
  jdet.sortOrder = Number(det.sortOrder);
  this.details = jdet;
  
  this.lines = new TfMaskLines(docMask.lines, keywordsProvider);  
}

TfMask.prototype.fillup = function(docMask, workflowTranslator, keywordsProvider) {
  docMask.name = this.name;
  docMask.guid = this.guid;
  
  docMask.barcode = this.barcode;
  docMask.DKind = this.kind;
  docMask.DPath = this.path;
  docMask.flowId = workflowTranslator.idFromName(this.flowName);
  docMask.flowId2 = workflowTranslator.idFromName(this.flowName2);
  docMask.index = this.index;
  docMask.lifetime = this.lifetime;
  docMask.nameTranslationKey = this.nameTranslationKey;
  docMask.textTranslationKey = this.textTranslationKey;
  docMask.text = this.text;

  var objAcls = new Array();
  var jAcls = this.aclItems;
  jAcls.fillup = TfObjAcls.prototype.fillup;
  jAcls.fillup(objAcls);
  docMask.aclItems = objAcls;
  var objDAcls = new Array();
  var jDAcls = this.docAclItems;
  jDAcls.fillup = TfObjAcls.prototype.fillup;
  jDAcls.fillup(objDAcls);
  docMask.docAclItems = objDAcls;

  var det = new DocMaskDetails();
  var jdet = this.details;
  det.archivingMode = jdet.archivingMode;
  det.createIndexPath = jdet.createIndexPath;
  det.createIndexReferencesPaths = jdet.createIndexReferencesPaths;
  det.documentMask = jdet.documentMask;
  det.encryptionSet = jdet.encryptionSet;
  det.folderMask = jdet.folderMask;
  det.fulltext = jdet.fulltext;
  det.releaseDocument = jdet.releaseDocument;
  det.searchMask = jdet.searchMask;
  det.sortOrder = jdet.sortOrder;
  docMask.details = det;
  
  var lines = new Array();
  var jlines = this.lines;
  jlines.fillup = TfMaskLines.prototype.fillup;
  jlines.fillup(lines, keywordsProvider);
  docMask.lines = lines;
}

function TfMaskLines(lines, keywordsProvider) {
  var jlines = new Array();
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var jline = new TfMaskLine(line, keywordsProvider);
    jlines.push(jline);
  }
  
  return jlines;
}

TfMaskLines.prototype.fillup = function(lines, keywordsProvider) {
  for (var i = 0; i < this.length; i++) {
    var line = new DocMaskLine();
    var jline = this[i];
    jline.fillup = TfMaskLine.prototype.fillup;
    jline.fillup(line, keywordsProvider);
    lines.push(line);
  }
}

function TfMaskLine(line, keywordsProvider) {
  this.id = Number(line.id);
  this.name = String(line.name);
  
  this.access = Number(line.access);
  this.canEdit = Boolean(line.canEdit);
  this.comment = String(line.comment);
  this.commentTranslationKey = String(line.commentTranslationKey);
  this.defaultValue = String(line.defaultValue);
  this.disableWordWheel = Boolean(line.disableWordWheel);
  this.editCol = Number(line.editCol);
  this.editRow = Number(line.editRow);
  this.editWidth = Number(line.editWidth);
  this.externalData = String(line.externalData);
  this.hidden = Boolean(line.hidden);
  this.important = Boolean(line.important);
  this.inherit = Boolean(line.inherit);
  this.inheritFromParent = Boolean(line.inheritFromParent);
  this.key = String(line.key);
  this.labelCol = Number(line.labelCol);
  this.labelRow = Number(line.labelRow);
  this.max = Number(line.max);
  this.min = Number(line.min);
  this.nameTranslationKey = String(line.nameTranslationKey);
  this.nextTab = Boolean(line.nextTab);
  this.onlyBuzzwords = Boolean(line.onlyBuzzwords);
  this.postfixAsterix = Boolean(line.postfixAsterix);
  this.prefixAsterix = Boolean(line.prefixAsterix);
  this.readOnly = Boolean(line.readOnly);
  this.serverScriptName = String(line.serverScriptName);
  this.tabIndex = Number(line.tabIndex);
  this.tabOrder = Number(line.tabOrder);
  this.translate = Boolean(line.translate);
  this.lineType = Number(line.type);
  this.version = Boolean(line.version);
  
  this.aclItems = new TfObjAcls(line.aclItems);
  
  this.keywords = new TfKeywords(this.key, keywordsProvider);
}

TfMaskLine.prototype.fillup = function(line, keywordsProvider) {
  line.id = this.id;
  line.name = this.name;
  
  line.access =this.access;
  line.canEdit = this.canEdit;
  line.comment = this.comment;
  line.commentTranslationKey = this.commentTranslationKey;
  line.defaultValue = this.defaultValue;
  line.disableWordWheel = this.disableWordWheel;
  line.editCol = this.editCol;
  line.editRow = this.editRow;
  line.editWidth = this.editWidth;
  line.externalData = this.externalData;
  line.hidden = this.hidden;
  line.important = this.important;
  line.inherit = this.inherit;
  line.inheritFromParent = this.inheritFromParent;
  line.key = this.key;
  line.labelCol = this.labelCol;
  line.labelRow = this.labelRow;
  line.max = this.max;
  line.min = this.min;
  line.nameTranslationKey = this.nameTranslationKey;
  line.nextTab = this.nextTab;
  line.onlyBuzzwords = this.onlyBuzzwords;
  line.postfixAsterix = this.postfixAsterix;
  line.prefixAsterix = this.prefixAsterix;
  line.readOnly = this.readOnly;
  line.serverScriptName = this.serverScriptName;
  line.tabIndex = this.tabIndex;
  line.tabOrder = this.tabOrder;
  line.translate = this.translate;
  line.type = this.lineType;
  line.version = this.version;
  
  var objAcls = new Array();
  var jAcls = this.aclItems;
  jAcls.fillup = TfObjAcls.prototype.fillup;
  jAcls.fillup(objAcls);
  line.aclItems = objAcls;
  
  var keywordList = new KeywordList();
  var jKeys = this.keywords;
  jKeys.fillup = TfKeywords.prototype.fillup;
  jKeys.fillupChildren = TfKeywords.prototype.fillupChildren;
  jKeys.fillup(keywordList);
  if (keywordList.id != "") {
    keywordsProvider.saveList(keywordList);
  }
}

function TfKeywords(name, keywordsProvider) {
  var list = keywordsProvider.getList(name);
  if (!list) {
    return;
  }
  
  this.name = String(list.id);
  this.guid = String(list.guid);
  
  // work around um Indexserver Bug: wenn über die GUID eingelesen wird,
  // dann wird das GUID Feld nicht gesetzt.
  if (this.guid == "") {
    this.guid = name;
  }
  // End work around
  
  this.jsonClass = "TfKeywords";
  this.children = this.listChildren(list.children);
}

TfKeywords.prototype.listChildren = function(childList) {
  var result = new Array();
  
  if (!childList) {
    return result;
  }
  
  for (var i = 0; i < childList.length; i++) {
    var item = childList[i];
    var jitem = new Object();
    jitem.add = Boolean(item.add);
    jitem.enabled = Boolean(item.enabled);
    jitem.id = String(item.id);
    jitem.raw = Boolean(item.raw);
    jitem.text = String(item.text);
    
    jitem.children = this.listChildren(item.children);
    result.push(jitem);
  }
  
  return result;
}

TfKeywords.prototype.fillup = function(keywords) {
  if (!this.name) {
    return;
  }
  
  keywords.id = this.name;
  keywords.guid = this.guid;
  
  var childList = this.fillupChildren(this.children);
  if (childList) {
    keywords.children  = childList;
  }
}

TfKeywords.prototype.fillupChildren = function(children) {
  if (!children || (children.length == 0)) {
    return null;
  }
  
  var childList = new Array();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var item = new Keyword();
    item.add = child.add;
    item.enabled = child.enabled;
    item.id = child.id;
    item.raw = child.raw;
    item.text = child.text;
    item.children = this.fillupChildren(child.children);
    childList.push(item);
  }
  
  return childList;
}

function TfSord(sord, userTranslator, guidProvider) {
  this.jsonClass = "TfSord";
  this.id = Number(sord.id);
  this.name = String(sord.name);
  this.guid = String(sord.guid);

  this.childCount = Number(sord.childCount);
  this.delDateIso = String(sord.delDateIso);
  this.deleted = Boolean(sord.deleted);
  this.details = new TfSordDetails(sord.details);
  this.IDateIso = String(sord.IDateIso);
  this.kind = Number(sord.kind);
  this.maskName = String(sord.maskName);
  this.parentGuid = guidProvider.guidFromId(sord.parentId);
  this.ownerGuid = userTranslator.fromId(sord.ownerId).guid;
  this.type = Number(sord.type);
  this.XDateIso = String(sord.XDateIso);

  var objKeys = sord.objKeys
  var jKeys = new Array();
  for (var k = 0; k < objKeys.length; k++) {
    jKeys.push(new TfObjKey(objKeys[k]));
  }
  this.objKeys = jKeys;

  this.aclItems = new TfObjAcls(sord.aclItems);
  
  this.desc = String(sord.desc);
  this.hiddenText = String(sord.hiddenText);
  
  if (EM_EventsI && (typeof EM_EventsI.tferSordWrite == "function")) {
    EM_EventsI.tferSordWrite(this, sord, userTranslator, guidProvider);
  }
}

TfSord.prototype.fillup = function(sord, userTranslator) {
  sord.name = this.name;
  sord.guid = this.guid;
  
  sord.childCount = this.childCount;
  sord.delDateIso = this.delDateIso;
  sord.deleted = Boolean(this.deleted);
  sord.IDateIso = this.IDateIso;
  sord.kind = this.kind;
  sord.maskName = this.maskName;
  sord.ownerId = userTranslator.fromGuid(this.ownerGuid).id;
  sord.type = this.type;
  sord.XDateIso = this.XDateIso;

  var jdetails = this.details;
  var details = new SordDetails();
  jdetails.fillup = TfSordDetails.prototype.fillup;
  jdetails.fillup(details);
  sord.details = details;
  
  var keys = this.objKeys;
  var objKeys = new Array();
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    key.fillup = TfObjKey.prototype.fillup;
    var newKey = new ObjKey();
    key.fillup(this.id, newKey);

    objKeys.push(newKey);
  }
  sord.objKeys = objKeys;

  var objAcls = new Array();
  var jAcls = this.aclItems;
  jAcls.fillup = TfObjAcls.prototype.fillup;
  jAcls.fillup(objAcls);
  sord.aclItems = objAcls;
  
  sord.desc = this.desc;
  sord.hiddenText = this.hiddenText;
  
  if (EM_EventsI && (typeof EM_EventsI.tferSordFillup == "function")) {
    EM_EventsI.tferSordFillup(sord, this, userTranslator);
  }
}

function TfSordDetails(details) {
  this.archivingMode = Number(details.archivingMode);
  this.arcReplEnabled = Boolean(details.arcReplEnabled);
  this.encryptionSet = Number(details.encryptionSet);
  this.fulltext = Boolean(details.fulltext);
  this.replRoot = Boolean(details.replRoot);
  this.sortOrder = Number(details.sortOrder);
  this.translateSordName = Boolean(details.translateSordName);
}

TfSordDetails.prototype.fillup = function(details) {
  details.archivingMode = this.archivingMode;
  details.arcReplEnabled = this.arcReplEnabled;
  details.encryptionSet = this.encryptionSet;
  details.fulltext = this.fulltext;
  details.replRoot = this.replRoot;
  details.sortOrder = this.sortOrder;
  details.translateSordName = this.translateSordName;
}

function TfObjKey(objKey) {
  this.name = String(objKey.name);
  this.id = Number(objKey.id);
  this.data = new Array();

  for (var d = 0; d < objKey.data.length; d++) {
    this.data.push(String(objKey.data[d]));
  }
}

TfObjKey.prototype.fillup = function(objId, objKey) {
  objKey.id = this.id;
  objKey.objId = objId;
  objKey.name = this.name;
  objKey.data = this.data;
}


function TfObjAcls(objAcls) {
  var jAcls = new Array();

  for (var i = 0; i < objAcls.length; i++) {
    jAcls.push(new TfObjAcl(objAcls[i]));
  }

  this.objAcls = jAcls;
}

TfObjAcls.prototype.fillup = function(objAcls) {
  for (var i = 0; i < this.objAcls.length; i++) {
    var acl = this.objAcls[i];
    var newAcl = new AclItem();
    acl.fillup = TfObjAcl.prototype.fillup;
    acl.fillup(newAcl);

    objAcls.push(newAcl);
  }
}

function TfObjAcl(objAcl) {
  this.access = Number(objAcl.access);
  this.name = this.getName(objAcl.id, objAcl.name);
  this.type = Number(objAcl.type);

  var groups = new Array();
  var andGroups = objAcl.andGroups;
  if (andGroups) {
    for (var i = 0; i < andGroups.length; i++) {
      groups.push(this.getName(andGroups[i].id, andGroups[i].name));
    }
  }

  this.andGroups = groups;
}

TfObjAcl.prototype.getName = function(id, name) {
  if ((id < 0) || (id == UserInfoC.ID_EVERYONE_GROUP)) {
    return String(id);
  } else {
    return String(name);
  }
}

TfObjAcl.prototype.fillup = function(objAcl) {
  objAcl.access = this.access;
  objAcl.name = this.name;
  objAcl.type = this.type;
  objAcl.id = -1;

  var groups = new Array();

  for (var i = 0; i < this.andGroups.length; i++) {
    var group = new IdName();
    group.name = this.andGroups[i];
    group.id = -1;

    groups.push(group);
  }

  objAcl.andGroups = groups;
}

function TfColors(colorDatas) {
  this.jsonClass = "TfColors";
  var jColor = new Array();
  for (var i = 0; i < colorDatas.length; i++) {
    jColor.push(new TfColor(colorDatas[i]));
  }

  this.colorData = jColor;
}

TfColors.prototype.fillup = function(colorDatas) {
  for (var i = 0; i < this.colorData.length; i++) {
    var data = this.colorData[i];
    data.fillup = TfColor.prototype.fillup;

    col = new ColorData();
    data.fillup(col)
    colorDatas.push(col);
  }
}

function TfColor(colorData) {
  this.id = Number(colorData.id);
  this.name = String(colorData.name);
  this.RGB = Number(colorData.RGB);
  this.guid = String(colorData.guid);
}

TfColor.prototype.fillup = function(colorData) {
  colorData.id = this.id;
  colorData.name = this.name;
  colorData.RGB = this.RGB;
  colorData.guid = this.guid;
}

function TfUser(userInfo, translator) {
  this.jsonClass = "TfUser";
  this.guid = String(userInfo.guid);
  this.name = String(userInfo.name);
  this.id = Number(userInfo.id);
  this.desc = String(userInfo.desc);
  this.flags = Number(userInfo.flags);
  this.flags2 = Number(userInfo.flags2);
  this.lastLoginIso = String(userInfo.lastLoginIso);
  this.parent = translator.fromId(Number(userInfo.parent)).guid;
  this.superiorId =  translator.fromId(Number(userInfo.superiorId)).guid;
  this.tStamp = String(userInfo.tStamp);
  this.ugtype = userInfo.type; 

  this.groupList = new Array();
  for (var i = 0; i < userInfo.groupList.length; i++) {
    var guid =  translator.fromId(Number(userInfo.groupList[i])).guid;
    this.groupList.push(guid);
  }

  this.keyList = new Array();
  for (i = 0; i < userInfo.keylist.length; i++) {
    this.keyList.push(Number(userInfo.keylist[i]));
  }

  this.userProps = new Array();
  for (i = 0; i < userInfo.userProps.length; i++) {
    var prop = userInfo.userProps[i];
    this.userProps.push((prop == null) ? "" : String(prop));
  }
  
  if (EM_EventsI && (typeof EM_EventsI.tferUserWrite == "function")) {
    EM_EventsI.tferUserWrite(this, userInfo, translator);
  }
}

TfUser.prototype.fillup = function(userInfo, translator) {
  userInfo.desc = this.desc;
  userInfo.flags = this.flags;
  userInfo.flags2 = this.flags2;
  userInfo.guid = this.guid;
  userInfo.name = this.name;
  userInfo.type = this.ugtype;
  userInfo.lastLoginIso = this.lastLoginIso;
  userInfo.superiorId = translator.fromGuid(this.superiorId).id;
  userInfo.parent = translator.fromGuid(this.parent).id;
  
  var idList = new Array();
  for (var i = 0; i < this.groupList.length; i++) {
    var item = translator.fromGuid(this.groupList[i]);
    if (item.id != -1) {
      idList.push(item.id);
    }
  }
  userInfo.groupList = idList;
  
  userInfo.keylist = this.keyList;
  userInfo.userProps = this.userProps;
  
  if (EM_EventsI && (typeof EM_EventsI.tferUserFillup == "function")) {
    EM_EventsI.tferUserFillup(userInfo, this, translator);
  }
}

function TfKeywordsProvider() {
  this.kwCache = new Object();
}

TfKeywordsProvider.prototype.getList = function(name) {
  var item = this.kwCache[name];
  
  if (!item) {
    try {
      item = ixConnect.ix().checkoutKeywordList(name, KeywordC.mbEdit, 100000, LockC.NO);
    } catch(e) {
      item = null;
    }
    this.kwCache[name] = item;
  }
  
  return item;
}

TfKeywordsProvider.prototype.saveList = function(list) {
  ixConnect.ix().checkinKeywordList(list, LockC.NO);
}

function TfGuidProvider() {
  this.guidCache = new Object();
}

TfGuidProvider.prototype.addGuid = function(id, guid) {
  this.guidCache[id] = guid;
}

TfGuidProvider.prototype.guidFromId = function(id) {
  var guid = this.guidCache[id];
  
  if (!guid) {
    var editInfo = ixConnect.ix().checkoutSord(id, EditInfoC.mbOnlyId, LockC.NO);
    guid = String(editInfo.sord.guid);
    this.guidCache[id] = guid;
  }
  
  return guid;
}

function TfWorkflowTranslator() {
  this.wfCache = new Object();
}

TfWorkflowTranslator.prototype.addItem = function(id, name) {
  this.wfCache[id] = name;
}

TfWorkflowTranslator.prototype.nameFromId = function(id) {
  if (id == -1) {
    return "";
  }
  
  var cache = this.wfCache;
  
  var item = cache[id];
  if (!item) {
    var wf = ixConnect.ix().checkoutWorkflowTemplate(String(id), "", WFDiagramC.mbAll, LockC.NO);
    item = String(wf.name);
    cache[id] = item;
  }
  
  return item;
}

TfWorkflowTranslator.prototype.idFromName = function(name) {
  if (name == "") {
    return -1;
  }
  
  var cache = this.wfCache;
  
  var item = cache[name];
  if (!item) {
    var wf = ixConnect.ix().checkoutWorkflowTemplate(name, "", WFDiagramC.mbAll, LockC.NO);
    item = String(wf.id);
    cache[name] = item;
  }
  
  return item;
}

function TfUserIdTranslator() {
  var users = ixConnect.ix().checkoutUsers(null, CheckoutUsersC.ALL_USERS_AND_GROUPS_RAW , LockC.NO);
  
  var len = users.length;
  var jusers = new Array(len);
  for (var i = 0; i < len; i++) {
    var actUser = users[i];
    var newUser = new Object();
    newUser.id = Number(actUser.id);
    newUser.guid = String(actUser.guid);
    newUser.name = String(actUser.name);
    log.debug("User: " + actUser.id + " : " + actUser.name + " : " + actUser.guid);
    jusers[i] = newUser;
  }
  
  jusers.push( {id: -1, guid:"-1", name:"-1"});
  jusers.push( {id: -2, guid:"-2", name:"-2"});
  jusers.push( {id: -3, guid:"-3", name:"-3"});
  
  this.userCache = jusers;
  this.emptyUser = {id: -1, guid:"", name: ""};
}

TfUserIdTranslator.prototype.addItem = function(uid, uguid, uname) {
  this.userCache.push( {id: uid, guid: uguid, name: uname} );
}

TfUserIdTranslator.prototype.fromGuid = function(guid) {
  var len = this.userCache.length;
  
  for (var i = 0; i < len; i++) {
    if (this.userCache[i].guid == guid) {
      return this.userCache[i];
    }
  }
  
  return this.emptyUser;
}

TfUserIdTranslator.prototype.fromId = function(id) {
  var len = this.userCache.length;
  
  for (var i = 0; i < len; i++) {
    if (this.userCache[i].id == id) {
      return this.userCache[i];
    }
  }
  
  return this.emptyUser;
}

TfUserIdTranslator.prototype.fromName = function(name) {
  var len = this.userCache.length;
  
  for (var i = 0; i < len; i++) {
    if (this.userCache[i].name == name) {
      return this.userCache[i];
    }
  }
  
  return this.emptyUser;
}

// end of namespace tfer