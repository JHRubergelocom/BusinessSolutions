
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.invoice.Converter.js

var logger = sol.create("sol.Logger", { scope: "sol.invoice.ix.functions.CreateApprovalNodes" });

/**
 * Creates the approval part of the workflow depending on the configuration.
 *
 * There is only an onExitNode support so far.
 *
 * # As workflow node
 *
 * There's no need for passing configuration option to the comments area of the workflow node.
 * All configurations should be done in the `/Administration/Business Solutions/invoice/Configuration/sol.invoice.config` file thanks to the node name.
 * Please see following example for more information.
 *
 * # Approval users / groups
 * To lookup the approval users, the script uses {@link sol.common.Roles#getUsers}.
 * It uses the configuration from <strong>`/Administration/Business Solutions/invoice/Configuration/sol.invoice.WorkflowUserRoles.config`</strong> and retrives a list of users for the <strong>APPROVAL</strong> role.
 *
 * See {@link sol.common.Roles} for more documentation.
 *
 * # Node creation
 * It creates a person node and an approval node for each user.
 * In addition it also connects each person node to the decline node (nodes.INVOICE_APPROVAL_DECLINE).
 *
 * All subsequent nodes will be moved down in the diagram for better readability.
 *
 * # Configuration
 * Will be loaded from `/Administration/Business Solutions/invoice/Configuration/sol.invoice.config`
 *
 * |Property|Description|
 * |:------|:------|
 * |nodes.INVOICE_APPROVAL_APPROVE|The fix approval node, after this node the new nodes will be inserted|
 * |nodes.INVOICE_APPROVAL_DECLINE|All inserted person nodes get a additional connection to zhis node|
 * |nodes.INVOICE_ACCOUNTING_FORWARD|The created 'sub-process' gets a connection to this node|
 * |approval.personNode.prefix|The name prefix for the inserted approver nodes|
 * |approval.personNode.form|The form for the person nodes|
 * |approval.forwardNode.prefix|The name prefix for the inserted approval nodes|
 * |approval.forwardNode.script|The Script which should be executed in the forward node|
 * |approval.forwardNode.config|The configuration for the forward node script as node comment; if there is no script or is doesn't need o configuration this can be a normal node comment|
 *
 * # User configuration:
 * Will be loaded from `/Administration/Business Solutions/invoice/Configuration/sol.invoice.WorkflowUserRoles.config`
 *
 *     "roles": [
 *       {
 *         "name": "APPROVAL",
 *         "users": [
 *           { "user": "Management", "conditions": [ { "type": "GRP", "key": "INVOICE_NET_AMOUNT", "rel": "GT", "val": 3000, "converter": "sol.invoice.Converter.currency" } ] },
 *           { "user": "Administrator", "conditions": [ { "type": "GRP", "key": "INVOICE_NET_AMOUNT", "rel" : "GT", "val" : 10000, "converter" : "sol.invoice.Converter.currency" } ] }
 *         ]
 *       }
 *     ]
 *
 * # Example workflow, after node creation:
 * {@img sol.invoice.ix.functions.CreateApprovalNodes-example1.png Freigabeprozess erstellen}
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 * @deprecated
 *
 * @requires  sol.common.WfUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.Config
 * @requires  sol.common.Roles
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder
 *
 */
sol.define("sol.invoice.ix.functions.CreateApprovalNodes", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram", "currentNodeId"],

  /** @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * the WFDiagram to which the changes should me applied to
   */
  wfDiagram: undefined,

  /** @cfg {number} currentNodeId (required)
   * the ID of the current node;
   * it is used as startnode for inserting the new sub-process
   */
  currentNodeId: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.wfConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config.workflow;
  },

  process: function () {
    var me = this,
        wfUtils = sol.common.WfUtils,
        sord = ixConnect.ix().checkoutSord(this.wfDiagram.objId, EditInfoC.mbSord, LockC.NO).sord,
        userConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.WorkflowUserRoles.config" }).config,
        users = sol.common.Roles.getUsers("APPROVAL", sord, userConfig.roles),
        startNode, startNodeName, nextNodeName, nodeBuilder, declineNodeName, continueNodeName, yNodePos,
        user, nextUser, approvalNodeName, forwardNodeName, nextNode,
        i;

    this.logger.info(["create approval nodes: users={0}", users.join("|")]);

    if (users && (users.length > 0)) {
      startNode = wfUtils.getNode(this.wfDiagram, this.currentNodeId);
      startNodeName = (!sol.common.StringUtils.isBlank(startNode.nameTranslationKey)) ? startNode.nameTranslationKey + "" : startNode.name + "";
      nextNodeName = me.wfConfig.approval.personNode.prefix.value + " " + users[0];
      nodeBuilder = sol.create("sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder", { wfDiagram: this.wfDiagram, startNodeName: startNodeName, nextNodeNames: [nextNodeName] });
      declineNodeName = me.wfConfig.nodes.INVOICE_APPROVAL_DECLINE.value;
      continueNodeName = me.wfConfig.nodes.INVOICE_ACCOUNTING_FORWARD.value;
      yNodePos = -1;

      for (i = 0; i < users.length; i++) {
        user = users[i];
        nextUser = users[i + 1];
        approvalNodeName = me.wfConfig.approval.personNode.prefix.value + " " + user;
        forwardNodeName = me.wfConfig.approval.forwardNode.prefix.value + " (" + user + ")";
        nextNode = (nextUser) ? (me.wfConfig.approval.personNode.prefix.value + " " + nextUser) : continueNodeName;

        nodeBuilder.addNode(approvalNodeName, {
          userName: user,
          formSpec: me.wfConfig.approval.personNode.form.value,
          xPosCount: 0,
          yPosCount: yNodePos++,
          type: WFNodeC.TYPE_PERSONNODE,
          dstNodeNames: [forwardNodeName, declineNodeName]
        });

        nodeBuilder.addNode(forwardNodeName, {
          scriptSpecExit: me.wfConfig.approval.forwardNode.script.value,
          xPosCount: 0,
          yPosCount: yNodePos++,
          type: WFNodeC.TYPE_SPLITNODE,
          dstNodeNames: [nextNode],
          comment: me.wfConfig.approval.forwardNode.config.value
        });
      }

      nodeBuilder.build();

      this.removeAssoc(this.wfDiagram, startNode.id, wfUtils.getNodeByName(this.wfDiagram, continueNodeName).id);
      this.removeNode(this.wfDiagram, this.currentNodeId);
      this.addAssoc(this.wfDiagram, wfUtils.getNodeByName(this.wfDiagram, me.wfConfig.nodes.INVOICE_APPROVAL_APPROVE.value).id, wfUtils.getNodeByName(this.wfDiagram, nextNodeName).id);
      this.moveNodesDown(this.wfDiagram, startNode, yNodePos);
    }
  },

  removeNode: function (workflow, nodeId) {
    var nodes = Array.prototype.slice.call(workflow.nodes),
        newNodes = [];

    nodes.forEach(function (node) {
      if (node.id != nodeId) {
        newNodes.push(node);
      }
    });
    workflow.nodes = newNodes;
  },

  addAssoc: function (workflow, fromId, toId) {
    var assocs = Array.prototype.slice.call(workflow.matrix.assocs),
        newAssoc = new WFNodeAssoc();

    newAssoc.nodeFrom = fromId;
    newAssoc.nodeTo = toId;

    assocs.push(newAssoc);
    workflow.matrix.assocs = assocs;
  },

  removeAssoc: function (workflow, fromId, toId) {
    var assocs = Array.prototype.slice.call(workflow.matrix.assocs),
        newAssocs = [];

    assocs.forEach(function (assoc) {
      if (assoc.nodeFrom != fromId || assoc.nodeTo != toId) {
        newAssocs.push(assoc);
      }
    });
    workflow.matrix.assocs = newAssocs;
  },

  moveNodesDown: function (workflow, referenceNode, steps) {
    var nodes = Array.prototype.slice.call(workflow.nodes),
        distance = steps * 80;

    nodes.forEach(function (node) {
      if ((node.posX > (referenceNode.posX/*-100*/)) && (node.posY > referenceNode.posY)) {
        node.posY += distance;
      }
    });
  }
});

/**
 * JavaScript to dynamically add nodes to a workflow.
 *
 * After a WfNodeBuilder instance was created, nodes can be added with the `addNode` method.
 * To finally edit the WFDiagram, the `build` method has to be invoked.
 * The `build` method returns the WfDiagram which has to be checked in by the calling script.
 * There is no automatic checkin, so this class can be used in IX functions such as `onEnterNode`, because these event methods take care of the checkin themselfes.
 *
 * ## Usage
 *
 *     var nodeBuilder = sol.create("sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder", { wFDiagram: wFDiagram, startNodeName: "Start Node", nextNodeNames: ["New Node"] });
 *
 *     nodeBuilder.addNode("New Node", {
 *       userName: "ELO Service",
 *       formSpec: "[tab(form1)]",
 *       xPosCount: 0,
 *       yPosCount: 1,
 *       type : WFNodeC.TYPE_PERSONNODE,
 *       dstNodeNames: ["Exit Node"],
 *       scriptSpecEnter: "",
 *       scriptSpecExit: "",
 *       comment: "Kommentar"
 *     });
 *
 *     nodeBuilder.build();
 *
 * {@img sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder-example1.png workflow before and after new node was added}
 *
 * ## Restrictions
 *
 * - Due to the internal node handling of this component, node names need to be unique
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 */
sol.define("sol.invoice.ix.functions.CreateApprovalNodes.WfNodeBuilder", {

  /**
   * @private
   * @property {sol.Logger} logger
   * The logger for the module
   */

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   */
  /**
   * @cfg {String} startNodeName (required)
   */
  /**
   * @cfg {Array} nextNodeNames (required)
   */

  initialize: function (config) {
    if (!config.wfDiagram || !config.startNodeName || !config.nextNodeNames) {
      throw "illegal configuration: wfDiagram, startNodeName and nextNodeNames are mandatory";
    }
    if (config.nextNodeNames.length > 20) {
      throw "Illegal Argument: only 20 predecessor nodes supported";
    }

    var me = this;
    me.logger = sol.create("sol.Logger", { scope: me.$className });

    me.logger.debug("INIT START");

    me.wfDiag = config.wfDiagram;
    me.maxNodeId = 0;
    me.nodes = Array.prototype.slice.call(me.wfDiag.nodes);
    me.assocs = Array.prototype.slice.call(me.wfDiag.matrix.assocs);

    me.nodes.forEach(function (node) {
      if (String(node.name)) {
        if (me.getNodeParams(node.name)) {
          throw "Node names must be unique (nodeName=" + node.name + ").";
        }
        if (node.id) {
          me.setNodeParams(node, { nodeId: node.id, nodeName: node.name, node: node });
        }
      }
      if (node.id > me.maxNodeId) {
        me.maxNodeId = node.id;
      }
    }, me);
    me.startNode = me.getNodeParams(config.startNodeName).node;
    me.nextNodeNames = config.nextNodeNames;

    me.logger.debug("INIT FINISHED");
  },

  /**
   * Adds a node to the WFDiagram.
   * @param {String} nodeName The name for the new node
   * @param {Object} params The parameter for the new node
   * @param {String} params.userName This user will be set (only on `type=WFNodeC.TYPE_PERSONNODE`)
   * @param {String} params.formSpec The form String for the form based workflow (only on `type=WFNodeC.TYPE_PERSONNODE`)
   * @param {String} params.scriptSpecEnter The IX script name which should be executed `onNodeEnter`
   * @param {String} params.scriptSpecExit The IX script name which should be executed `onNodeExit`
   * @param {Number} params.xPosCount Places the node horizontally
   * @param {Number} params.yPosCount Places the node vertically (relative to the start node)
   * @param {Number} params.type Type numbers are defined by WFNodeC
   * @param {String[]} params.dstNodeNames The node names which should be successor nodes to this one
   * @param {String} params.comment An optional node comment
   */
  addNode: function (nodeName, params) {
    if (params.dstNodeNames.length > 20) {
      throw "Illegal Argument: only 20 predecessor nodes supported";
    }
    nodeName += "";
    this.setNodeParams(nodeName, {
      newNode: true,
      nodeName: nodeName,
      userName: params.userName,
      formSpec: params.formSpec,
      scriptSpecEnter: params.scriptSpecEnter,
      scriptSpecExit: params.scriptSpecExit,
      xPosCount: params.xPosCount,
      yPosCount: params.yPosCount,
      type: params.type,
      dstNodeNames: params.dstNodeNames,
      comment: params.comment
    });
  },

  /**
   * Integrates the added nodes to the WFDiagram.
   *
   * Nothing will be checked in at this point.
   * The calling function is responsible for checking in the modified workflow.
   *
   * @return {de.elo.ix.client.WFDiagram} The modified WFDiagram
   */
  build: function () {
    this.logger.debug("BUILD START");

    var newNodeName, newNodeParams, newNode, newNodeId, i = 1;

    for (newNodeName in this.getNodesParams()) {
      newNodeParams = this.getNodeParams(newNodeName);
      if (newNodeParams.newNode) {
        newNodeId = this.maxNodeId + i;
        i++;

        this.logger.debug(["Create node: node.id={0}, node.name={1}, node.userName={2}", newNodeId, newNodeParams.nodeName, newNodeParams.userName]);

        newNode = ixConnect.ix().createWFNode(newNodeId, newNodeParams.type);
        newNode.name = newNodeParams.nodeName;
        if (newNodeParams.type == WFNodeC.TYPE_PERSONNODE) {
          newNode.userName = newNodeParams.userName;
          newNode.flags |= WFNodeC.FLAG_ONE_SUCCESSOR;
          newNode.formSpec = newNodeParams.formSpec;
        }
        if (newNodeParams.scriptSpecEnter) {
          newNode.onEnter = newNodeParams.scriptSpecEnter;
        }
        if (newNodeParams.scriptSpecExit) {
          newNode.onExit = newNodeParams.scriptSpecExit;
        }
        if (newNodeParams.comment) {
          newNode.comment = newNodeParams.comment;
        }
        newNode.posY = this.startNode.posY + (80 * (newNodeParams.yPosCount + 1));
        newNode.posX = 20 + (200 * newNodeParams.xPosCount);
        this.getNodeParams(newNodeName).nodeId = newNodeId;
        this.nodes.push(newNode);
      }
    }

    this.nextNodeNames.forEach(function (nextNodeName) {
      this.addAssoc(this.startNode.name, nextNodeName);
    }, this);

    for (newNodeName in this.getNodesParams()) {
      newNodeParams = this.getNodeParams(newNodeName);
      if (newNodeParams.newNode) {
        this.addAssocs(newNodeParams.nodeName, newNodeParams.dstNodeNames);
      }
    }

    this.wfDiag.nodes = this.nodes;
    this.wfDiag.matrix.assocs = this.assocs;

    this.logger.debug("BUILD FINISHED");

    return this.wfDiag;
  },

  /**
   * @private
   * @param {String} srcNodeName
   * @param {String[]} dstNodeNames
   * @param {String} dstNodeName
   */
  addAssocs: function (srcNodeName, dstNodeNames) {
    if (!dstNodeNames || dstNodeNames.length <= 0) {
      throw "No destination nodes defined.";
    }
    if (dstNodeNames.length > 20) {
      throw "Illegal Argument: only 20 predecessor nodes supported";
    }
    for (var i = 0; i < dstNodeNames.length; i++) {
      this.addAssoc(srcNodeName, dstNodeNames[i]);
    }
  },

  /**
   * @private
   * @param {String} srcNodeName
   * @param {String} dstNodeName
   */
  addAssoc: function (srcNodeName, dstNodeName) {
    var srcNodeParams = this.getNodeParams(srcNodeName + ""),
        dstNodeParams, assoc;

    if (!srcNodeParams) {
      throw "Source node '" + srcNodeName + "' not found.";
    }
    dstNodeParams = this.getNodeParams(dstNodeName + "");
    if (!dstNodeParams) {
      throw "Destination node '" + dstNodeName + "' not found.";
    }

    this.logger.debug(["Create assoc: {0}({1}) -> {2}({3})", srcNodeParams.nodeName, srcNodeParams.nodeId, dstNodeParams.nodeName, dstNodeParams.nodeId]);

    assoc = new WFNodeAssoc();
    assoc.nodeFrom = srcNodeParams.nodeId;
    assoc.nodeTo = dstNodeParams.nodeId;
    this.assocs.push(assoc);
  },

  /**
   * @private
   * Internal nodes cache
   * @return {Object}
   */
  getNodesParams: function () {
    if (this.nodesParams) {
      return this.nodesParams;
    }
    return {};
  },

  /**
   * @private
   * Internal nodes cache
   * @param {String} node
   * @return {String}
   */
  getNodeParams: function (node) {
    var cache = this.getNodesParams();
    if (typeof node === "string") {
      return cache[node];
    }
    return (cache[node.nameTranslationKey]) ? cache[node.nameTranslationKey] : cache[node.name];
  },

  /**
   * @private
   * Internal node cache
   * @param {String} node
   * @param {Object} nodeParam
   */
  setNodeParams: function (node, nodeParam) {
    if (!this.nodesParams) {
      this.nodesParams = {};
    }
    if (typeof node === "string") {
      if (this.nodesParams[node]) {
        throw "Node already exists (name=" + node + ")";
      }
      this.nodesParams[node] = nodeParam;
      return;
    }
    if (!sol.common.StringUtils.isBlank(node.nameTranslationKey)) {
      if (this.nodesParams[node.nameTranslationKey]) {
        throw "Node already exists (nameTranslationKey=" + node.nameTranslationKey + ")";
      }
      this.nodesParams[node.nameTranslationKey] = nodeParam;
      return;
    }
    if (this.nodesParams[node.name]) {
      throw "Node already exists (name=" + node.name + ")";
    }
    this.nodesParams[node.name] = nodeParam;
  }

});


/**
 * @member sol.invoice.ix.functions.CreateApprovalNodes
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_CreateApprovalNodes", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module;

  params.wfDiagram = wfDiagram;
  params.currentNodeId = nodeId;
  module = sol.create("sol.invoice.ix.functions.CreateApprovalNodes", params);

  module.process();

  logger.exit("onExitNode_CreateApprovalNodes");
}
