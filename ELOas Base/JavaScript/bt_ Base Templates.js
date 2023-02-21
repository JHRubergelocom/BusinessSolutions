var Sords = new Array();
var showVersion = true;
var idleStateMessage = "";

// start namespace bt
var bt = new Object();

function btExecuteRuleset(name, num, userid, param1, param2, param3) {
  return bt.executeRuleset(name, num, userid, param1, param2, param3);
}

function btExecuteRuleset(name, num, userid, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  return bt.executeRuleset(name, num, userid, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10);
}


bt = {  
  executeRuleset: function (name, num, userid, param1, param2, param3) {
    if (showVersion) {
      log.info("Start processing, Lib Version: " + EM_VERSION_NO);
      showVersion = false;
    }
        
    if (ruleset.getStop && ruleset.getStop()) {
      log.info("executeRuleset interrupted " + ruleset.getStop());
      return;
    }


    EM_USERID = userid;

    if (param1 != "") {
      EM_SEARCHVALUE = param1;
    }

    EM_PARAM1 = param1;
    EM_PARAM2 = param2;
    EM_PARAM3 = param3;
    EM_TREE_STATE = 1;

    try {
      log.debug("Execute " + EM_SEARCHNAME);

      onStart();
      if (EM_SEARCHNAME == "TREEWALK") {
        bt.doTreeWalk();
      } else if (EM_SEARCHNAME == "WORKFLOW") {
        bt.doWorkflow();
      } else if (EM_SEARCHNAME == "DIRECT") {
        bt.doDirect();
      } else if (EM_SEARCHNAME.indexOf("MAILBOX") == 0) {
        bt.doMail();
      } else if (EM_SEARCHNAME == "TILE") {
        bt.doTile();
      } else {
        bt.executeSearch();
        elo.processResultSet();
      }
      onEnd();
    } catch (ex) {
      log.info("Error executeRuleset: " + ex);
    }

    log.info("Stop status: " + (ruleset.getStop && ruleset.getStop()));
    sysExitRuleset();

    if (idleStateMessage != "") {	
	return idleStateMessage;
    } else {
	return "Idle...";
    }	
  },

  executeRuleset: function (name, num, userid, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    if (showVersion) {
      log.info("Start processing, Lib Version: " + EM_VERSION_NO);
      showVersion = false;
    }
        
    if (ruleset.getStop && ruleset.getStop()) {
      log.info("executeRuleset interrupted " + ruleset.getStop());
      return;
    }


    EM_USERID = userid;

    if (param1 != "") {
      EM_SEARCHVALUE = param1;
    }

    EM_PARAM1 = param1;
    EM_PARAM2 = param2;
    EM_PARAM3 = param3;
    EM_PARAM4 = param4;
    EM_PARAM5 = param5;
    EM_PARAM6 = param6;
    EM_PARAM7 = param7;
    EM_PARAM8 = param8;
    EM_PARAM9 = param9;
    EM_PARAM10 = param10;
    EM_TREE_STATE = 1;

    try {
      log.debug("Execute " + EM_SEARCHNAME);

      onStart();
      if (EM_SEARCHNAME == "TREEWALK") {
        bt.doTreeWalk();
      } else if (EM_SEARCHNAME == "WORKFLOW") {
        bt.doWorkflow();
      } else if (EM_SEARCHNAME == "DIRECT") {
        bt.doDirect();
      } else if (EM_SEARCHNAME.indexOf("MAILBOX") == 0) {
        bt.doMail();
      } else if (EM_SEARCHNAME == "TILE") {
        bt.doTile();
      } else {
        bt.executeSearch();
        elo.processResultSet();
      }
      onEnd();
    } catch (ex) {
      log.info("Error exceuteRuleset: " + ex);
    }

    log.info("Stop status: " + (ruleset.getStop && ruleset.getStop()));
    sysExitRuleset();

    if (idleStateMessage != "") {	
	return idleStateMessage;
    } else {
	return "Idle...";
    }    
  },

  exitRuleset: function () {
    log.debug("Exit Base Templates");
  },

  doDirect: function () {
    var sord;
 
    if (EM_SEARCHVALUE != "" && EM_SEARCHVALUE != null && EM_SEARCHVALUE != undefined) {  
      var members = (EM_WITH_LOCK) ? EditInfoC.mbSordLean : EditInfoC.mbSord;
      var items = EM_SEARCHVALUE.split(",");
      for (var i = 0; i < items.length; i++) {
        EM_SEARCHVALUE = items[i];
        var editInfo = ixConnect.ix().checkoutSord(EM_SEARCHVALUE,members, LockC.NO);
        sord = editInfo.getSord();
        bt.processObject(sord);
      }
    } else {
      sord = new Sord();
      sys.processRules(sord);
    }

  },

  doMail: function () {
    try {
      var conName = EM_SEARCHNAME.substring(8);
      mail.connectImap(conName);
      while (mail.nextMessage()) {
        if (ruleset.getStop && ruleset.getStop()) {
          log.info("doMail interrupted");
          return;
        }
        
        var editInfo = ixConnect.ix().createDoc(EM_SEARCHVALUE, EM_SEARCHMASK, null, EditInfoC.mbSord);
        var sord = editInfo.getSord();
        sord.name = MAIL_MESSAGE.getSubject();
        bt.processObject(sord);
      }
      mail.closeImap();
    } catch (ex) {
      log.error("Error collecting mails: " + ex);
      return;
    }
  },

  doTile: function () {
    var tileName = EM_SEARCHVALUE;
    log.debug("tileName=" + tileName);
    Packages.de.elo.mover.main.tiles.TileUtils.archiveWithTile(tileName);
  },

  doWorkflow: function () {
    var result = null;
    
    try {
      var fTI = new FindTasksInfo();
      fTI.inclWorkflows = true;
      fTI.lowestPriority = 2;
      fTI.highestPriority = 0;
      fTI.inclDeleted = EM_WF_WITH_DELETED;
      var result = ixConnect.ix().findFirstTasks(fTI, EM_SEARCHCOUNT);
      var idx = 0;
      for (;;) {
        if (ruleset.getStop && ruleset.getStop()) {
          log.info("doWorkflow interrupted");
          return;
        }
        
        EM_TASKLIST = result.tasks;
        
        try {
          bt.processTaskList();
        } catch (ex2) {
          log.error("Error processing task list: " + ex2);
        }
      
        if (!result.moreResults) {
          break;
        }
        
        idx += EM_TASKLIST.length;
        result = ixConnect.ix().findNextTasks( result.searchId, idx, EM_SEARCHCOUNT );
      }
    } catch (ex) {
      log.error("Error collection task list: " + ex);
      return;
    } finally {
      if (result) {
        ixConnect.ix().findClose(result.searchId);
      }
    }
  },

  processTaskList: function () {
    var members = (EM_WITH_LOCK) ? EditInfoC.mbSordLean : EditInfoC.mbSord;
    for (var i = 0; i < EM_TASKLIST.length; i++) {
      if (ruleset.getStop && ruleset.getStop()) {
        log.info("processTaskList interrupted");
        return;
      }
      
      var node = EM_TASKLIST[i].getWfNode();
      if (node) {
        if (EM_WF_FILTER_NAME && (EM_WF_FILTER_NAME != node.nodeName)) {
          log.debug("Filter - ignore task: " + node.nodeName);
          continue;
        }
        
        if (EM_WF_USER_DELAY_DATE && (EM_WF_USER_DELAY_DATE < node.userDelayDateIso)) {
          // optional zurückgestellte Knoten ignorieren
          log.debug("Filter - ignore delayed node: " + node.nodeName);
          continue;
        }        
        
        try {
          var objId = node.getObjId();
          var editInfo = ixConnect.ix().checkoutSord(objId, members, LockC.NO);
          var sord = editInfo.getSord();
          
          if (sord && (EM_ALLOWALLMASKS || (sord.getMask() == EM_SEARCHMASK))) {
            EM_WF_NEXT = "";
            EM_WF_NODE = node;
            EM_WF_STATUS = node.flowStatus;
            bt.processObject(sord);
            bt.processNextWf(node);
          }
        
        } catch(e) {
          log.warn("Error processing task item: " + e);
        }
      }
    }

    ruleset.setStatusMessage("Wait.");
  },

  processNextWf: function (node) {
    if (EM_WF_NEXT != "") {
      var succList = new Array();

      try {
        var wfNode = ixConnect.ix().beginEditWorkFlowNode(node.getFlowId(), node.getNodeId(), LockC.YES);
        var nodeName = wfNode.getNode().getName();
        var succNodes = wfNode.getSuccNodes();
        var parts = EM_WF_NEXT.split("¶");
        for (var p = 0; p < parts.length; p++) {
          var part = parts[p];
          var succNo = Number(part);
          if (isFinite(succNo) && (succNo >= 0) && (succNo < succNodes.length)) {
            succList.push(succNodes[succNo].getId());
          } else {
            for (var i = 0; i < succNodes.length; i++) {
              if (part == succNodes[i].getName()) {
                succList.push(succNodes[i].getId());
                break;
              }
            }
          }
        }

        var comment = wfNode.node.comment;
        if (comment) {
          comment = comment + "\n\nprocessed by ELOas";
        } else {
          comment = "processed by ELOas";
        }
        
        ixConnect.ix().endEditWorkFlowNode(node.getFlowId(), node.getNodeId(), false, false, nodeName, comment, succList);

        if (EM_WF_STATUS != node.flowStatus) {
          var workflow = wf.readWorkflow(node.flowId, true);
          var nodes = workflow.nodes;
          for(var n = 0; n < nodes.length; n++) {
            var root = nodes[n];
            if (root.id == 0) {
              root.yesNoCondition = EM_WF_STATUS;
              break;
            }
          }
          wf.writeWorkflow(workflow);
        }
      } catch (ex) {
        log.error("Confirm Workflow Node exception: " + ex);
        var wfdiag = wf.readWorkflow(node.getFlowId(), false);
        try {
          ixConnect.ix().checkinWorkFlow(wfdiag, WFDiagramC.mbOnlyLock, LockC.YES);
        } catch (ex2) {
          log.error("Cannot unlock Workflow: " + ex2);
        }
      }
    }
  },

  doTreeWalk: function () {
    try {
      EM_SAVE_TREE_ROOT = false;
      EM_TREE_ABORT_WALK = false;
      EM_TREE_MAX_LEVEL = 32;
      var editInfo = ixConnect.ix().checkoutSord(EM_SEARCHVALUE, EditInfoC.mbSord, LockC.NO);
      var name = editInfo.sord.name;
      log.debug("Process tree: " + name);
      EM_ROOT_SORD = editInfo.sord;
      bt.walkLevel(0, editInfo.sord);
      if (EM_SAVE_TREE_ROOT) {
        ixConnect.ix().checkinSord(editInfo.sord, SordC.mbAll, LockC.NO);
      }
      log.debug("Exit process tree");
    } catch (ex) {
      log.warn("Cannot process tree " + EM_SEARCHVALUE + " : " + ex);
    }
  },

  walkLevel: function (actLevel, parentSord) {
    if ((actLevel > EM_TREE_MAX_LEVEL) || EM_TREE_ABORT_WALK) {
      log.debug("Tree walk aborted: " + actLevel + " : " + EM_TREE_MAX_LEVEL + " : " + EM_TREE_ABORT_WALK);
      return;
    }

    var findInfo = new FindInfo();
    var findChildren = new FindChildren();
    findChildren.setParentId(parentSord.getId());
    findChildren.setMainParent(EM_TW_MAINPARENT);
    findInfo.setFindChildren(findChildren);

    var members = (EM_WITH_LOCK) ? SordC.mbMin : SordC.mbAll;
    var findResult = ixConnect.ix().findFirstSords(findInfo, EM_SEARCHCOUNT, members);
    var idx = 0;

    if (ruleset.getStop && ruleset.getStop()) {
      log.info("walkLevel 1 interrupted");
      return;
    }
    
    // Read all entries before processing of the subitems because of the search timeout
    var sords = findResult.sords;
    while (findResult.isMoreResults()) {
      if (ruleset.getStop && ruleset.getStop()) {
        log.info("walkLevel 3 interrupted");
        break;
      }
      
      idx = sords.length;
      findResult = ixConnect.ix().findNextSords(findResult.getSearchId(), idx, EM_SEARCHCOUNT, members);
      sords = ArrayUtils.addAll(sords, findResult.sords);
    }
    
    ixConnect.ix().findClose(findResult.getSearchId());
    log.debug("Process Sord list, length: " + sords.length);

    // process item list.
    var i;
    for (i = 0; i < sords.length; i++) {
      log.info("TW Interrupt status: " + (ruleset.getStop && ruleset.getStop()) + ", id: " + Thread.currentThread().id);
      if (EM_TREE_ABORT_WALK) {
        log.debug("Tree walk aborted");
        break;
      }

      if (ruleset.getStop && ruleset.getStop()) {
        log.info("walkLevel 2 interrupted");
        break;
      }
      
      log.debug("Process Sord: " + sords[i].name);

      EM_TREE_STATE = 0;
      EM_TREE_LEVEL = actLevel;
      EM_PARENT_SORD = parentSord;
      EM_TREE_EVAL_CHILDREN = true;
      bt.processObject(sords[i]);

      if (EM_TREE_EVAL_CHILDREN) {
        bt.walkLevel(actLevel + 1, sords[i]);
      } else {
        log.debug("Tree walk, eval children suppressed");
      }

      EM_TREE_STATE = 1;
      EM_TREE_LEVEL = actLevel;
      EM_PARENT_SORD = parentSord;
      bt.processObject(sords[i]);
    }
  },

  executeSearch: function () {
    log.info("Start Execute Search");
    try {
      if (EM_FIND_RESULT == null) {
        bt.startNewSearch();
      } else {
        bt.continueSearch();
      }
    } catch (ex) {
      log.info("Search aborted: " + ex);
      Sords = [];
      EM_FIND_RESULT = null;
    }
  },

  startNewSearch: function () {
    if (EM_SEARCHNAME == "OBJIDS") {
      return bt.startNewSearchObjIds(EM_SEARCHVALUE);
    } else if (EM_SEARCHNAME.substring(0, 3) == "RF_") {
      return bt.startRegisteredFunctionSearch(EM_SEARCHNAME, EM_SEARCHVALUE);
    } else {
      return bt.startNewSearchIndex();
    }
  },

  startRegisteredFunctionSearch: function( rfFunctionName, rfFunctionParam ) {
    var result = ixConnect.ix().executeRegisteredFunctionString( rfFunctionName, rfFunctionParam );
    return bt.startNewSearchObjIds(result);
  },
  
  startNewSearchObjIds: function (searchvalue) {
    ruleset.setStatusMessage("Loading objids...");
    var findInfo = new FindInfo();
    var findByIndex = new FindByIndex();

    var objKey = new ObjKey();
    var keyData = new Array(1);
    keyData[0] = "";
    objKey.setName("*");
    objKey.setData(keyData);

    var objKeys = new Array(1);
    objKeys[0] = objKey;

    findByIndex.setObjKeys(objKeys);
    findInfo.setFindByIndex(findByIndex);

    var findOptions = FindOptions();
    var ids = searchvalue.split(",");
    findOptions.setObjIds(ids);
    findInfo.setFindOptions(findOptions);

    var members = (EM_WITH_LOCK) ? SordC.mbMin : SordC.mbAll;
    EM_FIND_RESULT = ixConnect.ix().findFirstSords(findInfo, EM_SEARCHCOUNT, members);
    EM_START_INDEX = 0;
    bt.getSearchResult();
  },

  startNewSearchIndex: function () {
    ruleset.setStatusMessage("Searching...");
    var findInfo;
    
    if (EM_FIND_INFO) {
      findInfo = EM_FIND_INFO;	
    } else { 
      findInfo = new FindInfo();
      var findByIndex = new FindByIndex();

      if (EM_SEARCHNAME == "ELOTIMESTAMP") {
        findByIndex.name = "*";
        var findOptions = new FindOptions();
        findOptions.TStamp = EM_SEARCHVALUE;
        findInfo.findOptions = findOptions;
      } else {
        var values = EM_SEARCHVALUE.split("¶");
        var names = EM_SEARCHNAME.split("¶");
        var cnt = (values.length < names.length) ? values.length : names.length;
        
        var objKeys = new Array();
        for (var k = 0; k < cnt; k++) {
          var objKey = new ObjKey();
          objKey.name = names[k];
          objKey.data = [values[k]];
          objKeys.push(objKey);
        }

        findByIndex.setObjKeys(objKeys);
      }

      findByIndex.setMaskId(EM_SEARCHMASK);

      if ((EM_XDATEFROM != "") || (EM_XDATETO != "")) {
        var xdate = elo.decodeDate(EM_XDATEFROM) + "..." + elo.decodeDate(EM_XDATETO);
        findByIndex.setXDateIso(xdate);
        log.debug("Find by XDate: " + xdate);
      }

      if ((EM_IDATEFROM != "") || (EM_IDATETO != "")) {
        var idate = elo.decodeDate(EM_IDATEFROM) + "..." + elo.decodeDate(EM_IDATETO);
        findByIndex.setIDateIso(idate);
        log.debug("Find by IDate: " + idate);
      }

      findInfo.setFindByIndex(findByIndex);
    }
    
    var members = (EM_WITH_LOCK) ? SordC.mbMin : SordC.mbAll;
    EM_FIND_RESULT = ixConnect.ix().findFirstSords(findInfo, EM_SEARCHCOUNT, members);
    EM_START_INDEX = 0;
    bt.getSearchResult();
  },

  continueSearch: function () {
    var members = (EM_WITH_LOCK) ? SordC.mbMin : SordC.mbAll;
    EM_FIND_RESULT = ixConnect.ix().findNextSords(EM_FIND_RESULT.getSearchId(), EM_START_INDEX, EM_SEARCHCOUNT, members);
    bt.getSearchResult();
  },

  getSearchResult: function () {
    Sords = EM_FIND_RESULT.getSords();
    ruleset.setMoreResults(EM_FIND_RESULT.isMoreResults());
    log.debug("More results available: " + EM_FIND_RESULT.isMoreResults());

    if (EM_FIND_RESULT.isMoreResults()) {
      EM_START_INDEX += Sords.length;
    } else {
      ixConnect.ix().findClose(EM_FIND_RESULT.getSearchId());
      EM_FIND_RESULT = null;
      EM_START_INDEX = 0;
    }

    log.info("Execute Search done, " + Sords.length + " entries found.");
    ruleset.setStatusMessage(Sords.length + " entries found");
  },

  processObject: function(Sord) {
    if (ruleset.getStop && ruleset.getStop()) {
      log.info("processObject interrupted");
      return;
    }
    
    if (EM_WITH_LOCK) {
      if (Sord.lockId < 99990) {
        var lockedSord;

        try {
          lockedSord = ixConnect.ix().checkoutSord(Sord.id, EditInfoC.mbSord, LockC.YES).sord;
          bt.processObjectLocal(lockedSord);
        } catch(e) {
          log.info("Lock conflict, item ignored: " + Sord.id + " : " + Sord.name + " : Reason: " + e);
        } finally {
          if (lockedSord) {
            ixConnect.ix().checkinSord(lockedSord, SordC.mbOnlyUnlock, LockC.YES);
          }
        }
      } else {
        log.debug("Locked item ignored: " + Sord.id + " : " + Sord.name);
      }
    } else {
      bt.processObjectLocal(Sord);
    }
  },

  processObjectLocal: function(Sord) {
    EM_ACT_SORD = Sord;
    elo.loadBaseData(Sord);
    log.info("Sord: " + NAME + "   State: " + EM_TREE_STATE);
    ruleset.setStatusMessage("Process: " + NAME);

    try {
      EM_MASK_LOADED = -1;
      sys.loadIndexLines(Sord);
      EM_INDEX_LOADED = EM_MASK_LOADED >= 0;
    } catch (ex) {
      EM_INDEX_LOADED = false;
    }

    if (EM_TREE_STATE == 1) {
      EM_NEW_DESTINATION = new Array();
    } else {
      EM_NEW_DESTINATION = undefined;
    }

    EM_WRITE_CHANGED = false;
    sys.processRules(Sord);
    log.debug("EM_WRITE_CHANGED: " + EM_WRITE_CHANGED);

    try {
      elo.storeBaseData(Sord);
      if (EM_INDEX_LOADED) {
        sys.storeIndexLines(Sord);
      }

      if (EM_TREE_STATE == 1) {
        bt.moveFinally(Sord);

        if (EM_WRITE_CHANGED) {
          var members = new SordZ(SordC.mbAll);
          members.sub(SordC.mbReplSet);
          members.sub(SordC.mbReplNames);
          ixConnect.ix().checkinSord(Sord, members, LockC.NO);
        }
      }
    } catch (e) {
      EM_ERROR = e;
      log.info("Error on store or move: " + EM_ERROR);
      try {
        sys.finalErrorRule(Sord);
        elo.storeBaseData(Sord);
        sys.storeIndexLines(Sord);
        if (EM_TREE_STATE == 1) {
          bt.moveFinally(Sord);
          var members = SordC.mbAll;
          members.sub(SordC.mbReplSet);
          members.sub(SordC.mbReplNames);
          ixConnect.ix().checkinSord(Sord, members, LockC.NO);
        }
      } catch (e) {
        log.error("Error in Error Rule: " + e);
      }
    }
  },


  moveTo: function (Sord, destination) {
    if (destination != "*") {
      log.debug("MoveTo " + destination);
      destination = EM_FOLDERMASK + "¶¶¶." + destination;
    } else {
      log.debug("MoveTo: Keep actual position.");
    }

    EM_NEW_DESTINATION.push(destination);
  },

  moveFinally: function (Sord) {
    if (EM_NEW_DESTINATION.length > 0) {
      var destPath = EM_NEW_DESTINATION[0];
      if (destPath != "*") {
        var destId = elo.preparePath(destPath);
        log.debug("Dest: " + destId + "   Source: " + Sord.getParentId());

        if ((destId > 0) && (destId != Sord.getParentId())) {
          ixConnect.ix().copySord(destId, Sord.getGuid(), null, CopySordC.MOVE);
          Sord.setParentId(destId);
        }
      }

      var i;
      for (i = 1; i < EM_NEW_DESTINATION.length; i++) {
        var destId = elo.preparePath(EM_NEW_DESTINATION[i]);
        log.debug("Add. Ref: Dest: " + destId + "   Source: " + Sord.getParentId());

        if ((destId > 0) && (destId != Sord.getParentId())) {
          ixConnect.ix().copySord(destId, Sord.getGuid(), null, CopySordC.REFERENCE);
        }
      }
    }
  }

  // end of namespace bt
};