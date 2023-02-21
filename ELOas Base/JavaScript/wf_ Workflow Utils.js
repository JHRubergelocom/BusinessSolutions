// start namespace wf
var wf = new Object();
wf = {

  /**
  * Ergänzt den angegebenen Workflowknoten um eine parallele Liste
  * von Anwendern. Wenn der Knoten einen Nachfolger hat, wird eine
  * Kenntnisname erzeugt, besitzt der Knoten zwei Nachfolger, wird
  * eine Freigabe erzeugt (1. Nachfolger: Freigabe, 2. Nachfolger:
  * Abgelehnt).
  *
  * Der Parameter userNodeName kann entweder ein String enthalten,
  * dann bekommen alle Knoten den gleichen Namen. Oder es wird ein
  * Array mit der gleichen Länge wie userList übergeben, dann erhält
  * jeder Anwenderwenderknoten den entsprechenden Namen aus dem
  * userNodeName Array.
  *
  * var userList = ["Musterfrau", "Mustermann"];
  * var nodeNames = ["Rechnung Prüfen","Rechnung überweisen"]; 
  *
  * @param workflowId ELO Workflow-id
  * @param nodeId Knotennummer innerhalb des Workflows
  * @param userList String Array mit den Anwendernamen
  * @param userNodeName Bezeichnung(en) für die neu erzeugten Knoten
  * @param copyProcessor callback Funktion zum Kopieren der Knotenfelder
  **/
  expandNodeParallel: function(workflowId, nodeId, userList, userNodeName, copyProcessor) {
    var flow, node, matrix, successorId, firstSuccessor, sndSuccessor;
    
    try {
      flow = this.readWorkflow(workflowId, true);
      var nodeInserter = new NodeInserter(flow);
      node = wf.getNodeById(flow, nodeId);
      matrix = flow.matrix.assocs;
      for (var a = 0; a < matrix.length; a++) {
        var assoc = matrix[a];
        if (assoc.nodeFrom == nodeId) {
          if (!firstSuccessor) {
            firstSuccessor = wf.getNodeById(flow, assoc.nodeTo);
          } else if (!sndSuccessor) {
            sndSuccessor = wf.getNodeById(flow, assoc.nodeTo);
          } else {
            break;
          }
        }
      }
        
      nodeInserter.insertNodesParallel(node, firstSuccessor, sndSuccessor, userList, userNodeName, copyProcessor);
      nodeInserter.finalyze();
      this.writeWorkflow(flow);
      flow = null;
    } finally {
      if (flow) {
        this.unlockWorkflow(flow);
      }
    }
  },
  
  /**
  * Ergänzt den angegebenen Workflowknoten um eine sequenzielle Liste
  * von Anwendern. Wenn der Knoten einen Nachfolger hat, wird eine
  * Kenntnisname erzeugt, besitzt der Knoten zwei Nachfolger, wird
  * eine Freigabe erzeugt (1. Nachfolger: Freigabe, 2. Nachfolger:
  * Abgelehnt).
  *
  * Der Parameter userNodeName kann entweder ein String enthalten,
  * dann bekommen alle Knoten den gleichen Namen. Oder es wird ein
  * Array mit der gleichen Länge wie userList übergeben, dann erhält
  * jeder Anwenderwenderknoten den entsprechenden Namen aus dem
  * userNodeName Array.
  *
  * @param workflowId ELO Workflow-id
  * @param nodeId Knotennummer innerhalb des Workflows
  * @param userList String Array mit den Anwendernamen
  * @param userNodeName Bezeichnung(en) für die neu erzeugten Knoten
  * @param copyProcessor callback Funktion zum Kopieren der Knotenfelder
  **/
  expandNodeLinear: function(workflowId, nodeId, userList, userNodeName, copyProcessor) {
    var flow, node, matrix, firstSuccessor, sndSuccessor;
    
    try {
      flow = this.readWorkflow(workflowId, true);
      var nodeInserter = new NodeInserter(flow);
      node = wf.getNodeById(flow, nodeId);
      matrix = flow.matrix.assocs;
      for (var a = 0; a < matrix.length; a++) {
        var assoc = matrix[a];
        if (assoc.nodeFrom == nodeId) {
          if (!firstSuccessor) {
            firstSuccessor = wf.getNodeById(flow, assoc.nodeTo);
          } else if (!sndSuccessor) {
            sndSuccessor = wf.getNodeById(flow, assoc.nodeTo);
          } else {
            break;
          }
        }
      }
        
      nodeInserter.insertNodesLinear(node, firstSuccessor, sndSuccessor, userList, userNodeName, copyProcessor);
      nodeInserter.finalyze();
      this.writeWorkflow(flow);
      flow = null;
    } finally {
      if (flow) {
        this.unlockWorkflow(flow);
      }
    }
  },
  
  readWorkflow: function (workflowId, withLock) {
    log.debug("Read Workflow Diagram, WorkflowId = " + workflowId);
    return ixConnect.ix().checkoutWorkFlow(String(workflowId), WFTypeC.ACTIVE, WFDiagramC.mbAll, (withLock) ? LockC.YES : LockC.NO);
  },


  readActiveWorkflow: function (withLock) {
    var flowId = EM_WF_NODE.getFlowId();
    return wf.readWorkflow(flowId, withLock);
  },


  writeWorkflow: function (wfDiagram) {
    ixConnect.ix().checkinWorkFlow(wfDiagram, WFDiagramC.mbAll, LockC.YES);
  },


  unlockWorkflow: function (wfDiagram) {
    ixConnect.ix().checkinWorkFlow(wfDiagram, WFDiagramC.mbOnlyLock, LockC.YES);
  },

  /**
  * Beendet alle laufenden Workflows zu einer ELO Objekt-Id
  *
  * @param objectId ELO Objekt-Id
  */
  deleteAllWorkflowsOfObject: function (objectId) {
    var fti = new FindTasksInfo();  
    fti.allUsers = true;  
    fti.objId = objectId;  
    fti.inclWorkflows = true;  
    fti.lowestPriority = UserTaskPriorityC.LOWEST;  
      
    var fr = ixConnect.ix().findFirstTasks( fti, 100 );  
    try {  
      while (true) {  
        var tasks = fr.tasks;  
        log.debug( "tasks.count=" + tasks.length );  
        for (var i=0; i < tasks.length; i++) {  
          var flowId = tasks[i].wfNode.flowId;  
          this.terminateWorkflow( flowId );  
        }  
              
        if (!fr.isMoreResults()) break;  
          
        idx += fr.tasks.length;  
        fr = ixConnect.ix().findNextTasks( fr.searchId, idx, 100 );  
      }  
    } finally {  
      if (fr != null) {  
        ixConnect.ix().findClose( fr.searchId );  
      } 
    }    
  },

  /**
  * Beendet den Workflow
  *
  * @param flowId Workflow-Id des zu beendenden Workflows
  */
  terminateWorkflow: function( flowId ) {  
    log.debug( "terminateWorkflow: flowId=" + flowId );  
    ixConnect.ix().terminateWorkFlow( flowId, LockC.NO );  
  },     
  
  getNodeByName: function (wfDiagram, nodeName) {
    var nodes = wfDiagram.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.getName() == nodeName) {
        return node;
      }
    }

    return null;
  },

  getNodeById: function (wfDiagram, nodeId) {
    var nodes = wfDiagram.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.id == nodeId) {
        return node;
      }
    }

    return null;
  },


  changeNodeUser: function (nodeName, nodeUserName) {
    var diag = wf.readActiveWorkflow(true);
    var node = wf.getNodeByName(diag, nodeName);
    if (node) {
      node.setUserName(nodeUserName);
      wf.writeWorkflow(diag);
    } else {
      wf.unlockWorkflow(diag);
    }
  },

  changeAllUsers: function (oldUser, newUser) {
    var changed = false;
    var diag = wf.readActiveWorkflow(true);
    var nodes = diag.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.userName == oldUser) {
        node.userName = newUser;
        changed = true;
      }
    }
    
    if (changed) {
      wf.writeWorkflow(diag);
    } else {
      wf.unlockWorkflow(diag);
    }
  },

  copyNodeUser: function (sourceNodeName, destinationNodeName) {
    var diag = wf.readActiveWorkflow(true);
    var sourceNode = wf.getNodeByName(diag, sourceNodeName);
    var destNode = wf.getNodeByName(diag, destinationNodeName);

    if (sourceNode && destNode) {
      var user = sourceNode.getUserName();
      destNode.setUserName(user);
      wf.writeWorkflow(diag);

      return user;
    } else {
      wf.unlockWorkflow(diag);
      return null;
    }
  },

  startWorkflow: function (templateName, flowName, objectId) {
    return ixConnect.ix().startWorkFlow(templateName, flowName, objectId);
  },
  
  getNodeProperties: function(node) {
    var desc = (node.nodeComment) ? node.nodeComment : node.comment;
    log.debug("Props of " + ((node.nodeName) ? node.nodeName : node.name) + " : " + desc);
    var props = new java.util.Properties();
    var reader = new java.io.StringReader(desc);
    props.load(reader);
    
    return props;
  },
  
  getSuccessor: function(node) {
    var editNode = ixConnect.ix().beginEditWorkFlowNode(node.flowId, node.nodeId, LockC.NO);
    var succNodes = editNode.succNodes;
    if (succNodes && succNodes.length > 0) {
      return succNodes[0];
    } else {
      return null;
    }
  },
  
  fillupFlow: function(flow, flowId, objId, sourceWaitId, newOwner, returnTo, flowObjId) {
    flow.objId = flowObjId;
    flow.id = -1;
    flow.type = WFTypeC.ACTIVE;
  
    var nodes = flow.nodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var props = this.getNodeProperties(node);
      if (props.getProperty("type") == "return") {
        var desc = node.comment + "\r\nflowid=" + flowId + 
                                  "\r\nnodeid=" + sourceWaitId + 
                                  "\r\nrootid=" + objId + 
                                  "\r\nserver=" + returnTo + "\r\n";
        node.comment = desc;        
      }
      
      if (newOwner && (node.id != 0) && (newOwner != "null") && (node.userId == -2)) {
        node.userId = -1;
        node.userName = newOwner;
      }
    }
  },
  
  createOrConfirmFlowFromZip: function(flowData, hasError, errorMessage) {
    if (flowData.flowName == "") {
      this.confirmFlowFromZip(flowData, hasError, errorMessage);
    } else {
      this.createFlowFromZip(flowData, hasError, errorMessage);
    }
  },
  
  createFlowFromZip: function(flowData, hasError, errorMessage) {
    var flow = ixConnect.ix().checkoutWorkFlow(flowData.flowName, WFTypeC.TEMPLATE, WFDiagramC.mbAll, LockC.NO);
    if (flowData.subName) {
      flow.name = flowData.subName;
    }
    
    var objGuid = flowData.eloObjGuid;
    if (flowData.remoteWfObjId && (flowData.remoteWfObjId.length == 38)) {
      objGuid = flowData.remoteWfObjId;
    }
    
    this.fillupFlow(flow, flowData.waitFlowId, flowData.eloObjGuid, flowData.waitNodeId, flowData.newOwner, flowData.returnTo, objGuid);
    
    log.info("Start Subworkflow: " + flowData.flowName);
    ixConnect.ix().checkinWorkFlow(flow, WFDiagramC.mbAll, LockC.NO);
  },
  
  confirmFlowFromZip: function(flowData, hasError, errorMessage) {
    var flowId = flowData.waitFlowId;
    var nodeId = flowData.waitNodeId;
    try {
      var flowNode = ixConnect.ix().beginEditWorkFlowNode(flowId, nodeId, LockC.YES);
      var nodeComment = flowNode.node.comment;
      
      if (hasError) {
        nodeComment = nodeComment + "\r\n\r\n" + errorMessage;
      }
      
      var succNodes = flowNode.succNodes;
      var succNodeIds = new Array();
      for (var n = 0; n < succNodes.length; n++) {
        var succNode = succNodes[n];
        var isErrorNode = succNode.name == "OnError";
        
        if (isErrorNode == hasError) {
          succNodeIds.push(succNode.id);
        }
      }
      ixConnect.ix().endEditWorkFlowNode(flowId, nodeId, false, false, flowNode.node.name, nodeComment, succNodeIds);
    } catch(e) {
      // only unlock
      ixConnect.ix().endEditWorkFlowNode(flowId, nodeId, false, true, null, null, null);
      throw(e);
    }
  },
  
  startRemoteFlow: function(node, props) {
    var serverName = props.getProperty("server");
    var flowName = props.getProperty("call");
    var destination = props.getProperty("destination");
    var newOwner = props.getProperty("newowner");
    if (!newOwner) {
      newOwner = "";
    }
    var returnTo = props.getProperty("returnto");
    if (flowName) {
      var succ = this.getSuccessor(node);
      if (serverName == "local") {
        var flow = ixConnect.ix().checkoutWorkFlow(flowName, WFTypeC.TEMPLATE, WFDiagramC.mbAll, LockC.NO);
        this.fillupFlow(flow, node.flowId, node.objId, succ.id, newOwner, returnTo, "");
        ixConnect.ix().checkinWorkFlow(flow, WFDiagramC.mbAll, LockC.NO);
      } else {
        var flowData = new Object();
        this.fillStandardProps(node, props, flowData);
        flowData.serverName = String(serverName);
        flowData.flowName = String(flowName);
        flowData.destination = String(destination);
        flowData.waitFlowId = String(node.flowId);
        flowData.waitNodeId = String(succ.id);
        flowData.eloObjGuid = String(node.objGuid);
        flowData.newOwner = String(newOwner);
        flowData.returnTo = String(returnTo);
        this.createExport(node, flowData, false);
      }
      EM_WF_NEXT = "0";
    }
  },
  
  fillStandardProps: function(node, props, flowData) {
    flowData.jsonClass = "TfFlowData";
    
    var restrict = this.sanitize(props.getProperty("restrict"));
    flowData.restrictGroup = restrict;
    
    var masks = props.getProperty("masks");
    if (masks) {
      masks = String(masks);
      flowData.masks = new Object();
      var items = masks.split("¶");
      for (var it = 0; it < items.length; it++) {
        flowData.masks[items[it]] = true;
      }
    } else {
      flowData.masks = null;
    }
    
    var subname = this.sanitize(props.getProperty("subname"));
    flowData.subName = subname;
    
    var exportMode = this.sanitize(props.getProperty("export"));
    flowData.exportMode = exportMode;
    
    var scriptName = this.sanitize(props.getProperty("scriptbeforesend"));
    flowData.scriptBeforeSend = scriptName;
    scriptName = this.sanitize(props.getProperty("scriptbeforereturn"));
    flowData.scriptBeforeReturn = scriptName;
    scriptName = this.sanitize(props.getProperty("scriptafterreturn"));
    flowData.scriptAfterReturn = scriptName;
  },
  
  sanitize: function(text) {
    if (text) {
      text = String(text);
    } else {
      text = "";
    }
    
    return text;
  },
  
  createExport: function(node, flowData, isReturn) {
    var fileName = EM_WF_EXPORT_ROOT + "\\" + flowData.serverName + "\\EX" + node.flowId + "." + node.nodeId + "." + Math.floor(Math.random() * 1000000000) + ".zip";
    tfex.doWfExport(flowData, fileName, isReturn);
  },
  
  returnRemoteFlow: function(node, props) {
    var remoteFlowId = props.getProperty("flowid");
    var remoteNodeId = props.getProperty("nodeid");
    if ((remoteFlowId >= 0) && (remoteNodeId >= 0)) {
      var editNode = ixConnect.ix().beginEditWorkFlowNode(remoteFlowId, remoteNodeId, LockC.YES);
      
      var succList = [editNode.succNodes[0].id];
      ixConnect.ix().endEditWorkFlowNode(remoteFlowId, remoteNodeId, false, false, editNode.node.name, "returned from " + node.nodeName, succList);
    }
    EM_WF_NEXT= "0";
  },
  
  exportRemoteFlow: function(node, props) {
    var flowData = new Object();
    this.fillStandardProps(node, props, flowData);
    flowData.serverName = String(props.getProperty("server"));
    flowData.flowName = String(props.getProperty("flowName") || "");
    flowData.destination = String(props.getProperty("destination") || "");
    flowData.waitFlowId = String(props.getProperty("flowid"));
    flowData.waitNodeId = String(props.getProperty("nodeid"));
    var rootId = String(props.getProperty("rootid"));
    if (rootId.length != 38) {
      rootId = String(node.objGuid);
    }
    flowData.eloObjGuid = rootId;
    flowData.newOwner = String("");
    flowData.returnTo = String("");
    this.createExport(node, flowData, true);
    EM_WF_NEXT= "0";
  },
  
  processRemoteWorkflow: function(node) {
    var workflow;
    try {
      workflow = ixConnect.ix().checkoutWorkFlow(node.flowId , WFTypeC.ACTIVE, WFDiagramC.mbOnlyLock, LockC.YES);
    } catch(e) {
      log.info("Locked workflow ignored: " + node.flowId);
      EM_WF_NEXT = "";
      return;
    }
    log.debug("Lock Ok");
  
    var props = this.getNodeProperties(node);
    var type = props.getProperty("type");
	
    if (type == "remoteflow") {
      this.startRemoteFlow(node, props);
    } else if (type == "return") {
      var server = props.getProperty("server");
      if (!server || (server == "local")) {
        this.returnRemoteFlow(node, props);
      } else {
        this.exportRemoteFlow(node, props);
      }
    }
    
    if (EM_WF_NEXT == "") {
      // Unlock wird nicht vom ELOas durchgeführt
      log.debug("Unlock by wf modul");
      try {
        ixConnect.ix().checkinWorkFlow(workflow, WFDiagramC.mbOnlyLock, LockC.YES);
      } catch (ex2) {
        log.error("Cannot unlock Workflow: " + ex2);
      }
    }
  },
  
  // Workflowreport erstellen
  createWFReport: function(node, sord) {
    var flow = this.readWorkflow(node.flowId, false);
    var text = new Array();
    
    this.fillHeader(text, flow);
    this.fillNodes(text, flow);
    this.fillFooter(text);
    
    this.storeReport(text, sord);
  },
  
  storeReport: function(text, sord) {
    var name = fu.clearSpecialChars(sord.name);
    var file = File.createTempFile(name, ".html");
    FileUtils.writeStringToFile(file, text.join(""), "UTF-8");
    
    if (sord.type < 254) {
      // insert document
      var docMask = "Freie Eingabe";
      var versDescr = "ELOas version";
      var versComment = "ELOas workflow report";
      var newDocId = Packages.de.elo.mover.utils.ELOAsUtils.insertIntoArchive(emConnect, file, sord.id, docMask, versDescr, versComment, false);
      log.info("newDocId=" + newDocId);
      var newDocSord = ixConnect.ix().checkoutSord(newDocId, SordC.mbLean, LockC.YES);
      newDocSord.name = "Workflow report";
      ixConnect.ix().checkinSord(newDocSord, SordC.mbLean, LockC.YES);
    } else {
      // insert attachment
      ix.addAttachment(sord.id, file);
    }
  },
  
  formatIsoDate: function(isoDate) {
    isoDate = String(isoDate);
    if (isoDate.length > 11) {
      return isoDate.substring(6, 8) + "." + isoDate.substring(4, 6) + "." + isoDate.substring(0, 4) + " - " + isoDate.substring(8, 10) + ":" + isoDate.substring(10, 12);
    } else if (isoDate.length > 7) {
      return isoDate.substring(6, 8) + "." + isoDate.substring(4, 6) + "." + isoDate.substring(0, 4);
    } else if (isoDate.length == 0) {
      return "";
    } else {
      return isoDate;
    }
  },
  
  fillHeader: function(text, flow) {
    var wfName = www.toHtml(flow.name)
    text.push("<html><head><title>Workflow-Report : ");
    text.push(wfName);
    text.push('</title></head><body bgcolor="#ffffff" text="#000000" style="font-family:Tahoma,Arial,sans-serif;">');
    text.push('<table><tr><td colspan=2><h1>Workflow Abschlussbericht</h></td></tr>');
    text.push("<tr><td>&nbsp;</td></tr><tr><td><b>Workflowname</b></td><td><b>");
    text.push(wfName);
    text.push("</b></td></tr><tr><td><b>Abschlussdatum</b></td><td><b>");
    text.push(new Date());
    text.push("</b></td></tr></table><p>");
    text.push('<table border="0" CELLPADDING="8" cellspacing="0">');
    text.push('<tr bgcolor="#c0d0ff"><th align="left">Nr.</th><th align="left">Startdatum</th><th align="left">Endedatum</th><th align="left">Anwender</th><th align="left">Knoten</th><th align="left">Bemerkung</th></tr>');
  },
  
  fillFooter: function(text) {
    text.push("</table></body></html>");
  },
  
  fillNodes: function(text, flow) {
    var nodes = flow.nodes;
    var line = 1;
    
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.type == 2) {
        this.fillNode(text, node, line);
        line++;
      }
    }
  },
  
  fillNode: function(text, node, line) {
    var user = node.userTerminate;
    if (user == "") {
      user = node.userName;
    }
    
    text.push("<tr bgcolor=");
    text.push( (line % 2) ? "#f5f8ff" : "#eef0ff" );
    text.push('><td valign="top" align="left">');
    text.push(line);
    text.push('</td><td valign="top" align="left">');
    text.push(this.formatIsoDate(node.enterDateIso));
    text.push('</td><td valign="top" align="left">');
    text.push(this.formatIsoDate(node.exitDateIso));
    text.push('</td><td valign="top" align="left">');
    text.push(www.toHtml(user));
    text.push('</td><td valign="top" align="left">');
    text.push(www.toHtml(node.name));
    text.push('</td><td valign="top" align="left">');
    text.push(www.toHtml(node.comment));
    text.push("</td></tr>");
  },
  
  adjustNodeComment: function(node, newComment) {
    var flow = ixConnect.ix().checkoutWorkFlow(node.flowId, WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.YES);
    var nodes = flow.nodes;
    var id = node.nodeId;
    
    for (var i = 0; i < nodes.length; i++) {
      var nd = nodes[i];
      if (nd.id == id) {
        nd.comment = newComment;
        break;
      }
    }
    
    ixConnect.ix().checkinWorkFlow(flow, WFDiagramC.mbAll, LockC.YES);
  },
  
  checkSubWorkflow: function(node) {
    log.debug("Check node: " + node.flowName);
    var props = wf.getNodeProperties(node);
    var command = props.get("Command");
    var subflow = props.get("TemplateName");
    var subname = props.get("FlowName");
    
    if (command == "callSWF") {
      if (subflow) {
        var subName = props.get("FlowName");
        log.info("Start Subworkflow: " + subflow);
        var subflowId = ixConnect.ix().startWorkFlow(subflow, subName || node.objName, node.objId);
        var nodeComment = "Command=waitSWF\r\nFlowId=" + subflowId + "\r\nTemplateName=" + subflow;
        if (subname) {
          nodeComment = nodeComment + "\r\nFlowName=" + subname;
        }
        wf.adjustNodeComment(node, nodeComment);
        log.info("Wait for termination of the subworkflow " + subflowId);
      }
    } else if (command == "waitSWF") {
      var waitForWfId = props.get("FlowId");
      log.debug("Check termination state of " + waitForWfId);
      try {
        var flow = ixConnect.ix().checkoutWorkFlow(waitForWfId, WFTypeC.ACTIVE, WFDiagramC.mbOnlyLock, LockC.NO);
        log.debug("Still available");
      } catch(e) {
        e = String(e);
        log.debug("Not reachable: " + e);
        if (e.indexOf("[ELOIX:5023]") >= 0) {
          log.info("Subworkflow " + waitForWfId + " terminated, resume workflow.");
          var comment = "Command=callSWF\r\nTemplateName=" + subflow;
          if (subname) {
            comment = comment + "\r\nFlowName=" + subname;
          }
          var wfNode = ixConnect.ix().beginEditWorkFlowNode(node.flowId, node.nodeId, LockC.YES);
          var nodeName = wfNode.node.name;
          var succList = wfNode.succNodes;
          ixConnect.ix().endEditWorkFlowNode(node.flowId, node.nodeId, false, false, nodeName, comment, [succList[0].id]);
        }
      }
    }
  },

  defaultCopyProcessor: function(node, startNode, firstSuccessor, sndSuccessor) {
    node.comment = startNode.comment;
    node.department2 = startNode.department2;
    node.formSpec = startNode.formSpec;
    node.processOnServerId = startNode.processOnServerId;
  }

}
// end of namespace wf 

// private Hilfsfunktionen für die expandNode Funktionen
function NodeInserter(flow) {
  this.flow = flow;
  this.nodes = this.copyNodes(flow);
  this.assocs = this.copyAssocs(flow);
};

NodeInserter.prototype.finalyze = function() {
  this.flow.nodes = this.nodes;
  this.flow.matrix.assocs = this.assocs;
};

NodeInserter.prototype.insertNodesParallel = function(startNode, firstSuccessor, sndSuccessor, userList, userNodeName, copyProcessor) {
  if (userList.length > 20) {
    throw("Maximum of 20 successors exceeded.");
  }
  
  var nextId = this.nextFreeNodeId();
  var scatter, gather, abort;
  scatter = new WFNode();
  scatter.id = nextId++;
  scatter.name = startNode.name;
  scatter.type = WFNodeC.TYPE_SPLITNODE;
  scatter.posY = startNode.posY + 80;
  scatter.posX = startNode.posX;
  scatter.userId = -1;
  this.nodes.push(scatter);
  
  if (firstSuccessor) {
    gather = new WFNode();
    gather.id = nextId++;
    gather.name = firstSuccessor.name;
    gather.type = WFNodeC.TYPE_COLLECTNODE;
    gather.nbOfDonesToExit = -1;
    gather.posY = firstSuccessor.posY - 80;
    gather.posX = firstSuccessor.posX;
    gather.userId = -1;
    this.nodes.push(gather);
    
    if (sndSuccessor) {
      abort = new WFNode();
      abort.id = nextId++;
      abort.name = sndSuccessor.name;
      abort.type = WFNodeC.TYPE_COLLECTNODE;
      abort.nbOfDonesToExit = 1;
      abort.posY = sndSuccessor.posY - 80;
      abort.posX = sndSuccessor.posX;
      abort.userId = -1;
      this.nodes.push(abort);
    }
  }
  
  this.addScatterGather(startNode, firstSuccessor, sndSuccessor, scatter, gather, abort);
  var nodesList = this.addUsers(nextId, startNode, firstSuccessor, sndSuccessor, scatter, gather, abort, userList, userNodeName, copyProcessor);
  
  if (abort) {
    abort.formSpec = nodesList;
  }
};

NodeInserter.prototype.insertNodesLinear = function(startNode, firstSuccessor, sndSuccessor, userList, userNodeName, copyProcessor) {
  var nextId = this.nextFreeNodeId();
  var actSuccessor = firstSuccessor;
  
  for (var u = userList.length - 1; u >= 0; u--) {
    var user = userList[u];
    var name = (typeof(userNodeName) == "string") ? userNodeName : userNodeName[u];
    var userNode = this.createUserNode(nextId++, name, user);
    userNode.posY = startNode.posY + (u + 1) * 80;
    userNode.posX = startNode.posX - u * 40;
    
    if (copyProcessor) {
      copyProcessor(userNode, startNode, firstSuccessor, sndSuccessor);
    }
    
    this.nodes.push(userNode);
    if (actSuccessor) {
      this.addAssoc(userNode.id, actSuccessor.id);
      
      if (sndSuccessor) {
        this.addAssoc(userNode.id, sndSuccessor.id);
      }
    }
    
    actSuccessor = userNode;
  }
  
  this.adjustStartNode(startNode.id, actSuccessor.id);
};
  
NodeInserter.prototype.addUsers = function(nextId, startNode, firstSuccessor, sndSuccessor, scatter, gather, abort, userList, userNodeName, copyProcessor) {
  var nodesList = "";
  for (var i = 0; i < userList.length; i++) {
    if (i > 0) { nodesList += ","; };
    nodesList += nextId;
    
    var name = (typeof(userNodeName) == "string") ? userNodeName : userNodeName[i];
    var userNode = this.createUserNode(nextId++, name, userList[i]);
    userNode.posY = scatter.posY + 80;
    userNode.posX = scatter.posX + i * 200;
    
    if (copyProcessor) {
      copyProcessor(userNode, startNode, firstSuccessor, sndSuccessor);
    }
    
    this.nodes.push(userNode);
    
    this.addAssoc(scatter.id, userNode.id);
    
    if (gather) {
      this.addAssoc(userNode.id, gather.id);
    }
    
    if (abort) {
      this.addAssoc(userNode.id, abort.id);
    }
  }
  
  if (gather) {
    nodesList += "," + gather.id;
  }
  
  return nodesList;
};
  
NodeInserter.prototype.addScatterGather = function(startNode, firstSuccessor, sndSuccessor, scatter, gather, abort) {
  var found1 = false;
  var foundA = false;
  for (var i = 0; i < this.assocs.length; i++) {
    var assoc = this.assocs[i];
    if (firstSuccessor && (assoc.nodeFrom == startNode.id) && (assoc.nodeTo == firstSuccessor.id)) {
      assoc.nodeTo = scatter.id;
      found = true;
    }
    if (sndSuccessor && (assoc.nodeFrom == startNode.id) && (assoc.nodeTo == sndSuccessor.id)) {
      assoc.nodeFrom = abort.id;
      foundA = true;
    }
  }
  
  if (!found1) {
    this.addAssoc(startNode.id, scatter.id);
  }
  
  if (gather) {
    this.addAssoc(gather.id, firstSuccessor.id);
  }
  
  if (abort && !foundA) {
    this.addAssoc(abort.id, sndSuccessor.id);
  }
};
  
NodeInserter.prototype.createUserNode = function(id, name, user) {
  var node = new WFNode();
  node.id = id;
  node.userName = user;
  node.name = name;
  node.type = WFNodeC.TYPE_PERSONNODE;
  node.flags = WFNodeC.FLAG_ONE_SUCCESSOR;
  
  return node;
};
  
NodeInserter.prototype.adjustStartNode = function(startNodeId, firstUserNodeId) {
  for (var i = this.assocs.length - 1; i >= 0; i--) {
    if (this.assocs[i].nodeFrom == startNodeId) {
      this.assocs.splice(i, 1);
    }
  }
  
  this.addAssoc(startNodeId, firstUserNodeId);
};

NodeInserter.prototype.nextFreeNodeId = function() {
  var nodes = this.flow.nodes;
  var maxId = 0;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id > maxId) {
      maxId = nodes[i].id;
    }
  }
  
  return maxId + 1;
};
  
NodeInserter.prototype.copyNodes = function(flow) {
  var jsNodes = new Array();
  var nodes = flow.nodes;
  for (var i = 0; i < nodes.length; i++) {
    jsNodes.push(nodes[i]);
  }
  
  return jsNodes;
};
  
NodeInserter.prototype.copyAssocs = function(flow) {
  var jsAssocs = new Array();
  var assocs = flow.matrix.assocs;
  for (var i = 0; i < assocs.length; i++) {
    jsAssocs.push(assocs[i]);
  }
  
  return jsAssocs;
};
  
NodeInserter.prototype.addAssoc = function(from, to) {
  var assoc = new WFNodeAssoc();
  assoc.nodeFrom = from;
  assoc.nodeTo = to;
  this.assocs.push(assoc);
};

