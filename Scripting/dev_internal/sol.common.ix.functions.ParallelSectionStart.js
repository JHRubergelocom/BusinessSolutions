importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ParallelSectionStart" });

/**
 * *** Work in progress ***
 *
 * Builds parallel nodes
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.02.004
 *
 * @eloix
 * @requires  sol.common.WfUtils
 * @requires  sol.common.WfMap
 * @requires  sol.common.MapTable
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.ParallelSectionStart", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram"],

  /**
   * @cfg {de.elo.ix.client.WFDiagram} wfDiagram (required)
   * The WFDiagram to which the changes should me applied to
   */

  /**
   * @cfg {String} parallelId (required)
   * Identifies the parallel section
   */

  initialize: function (config) {
    var me = this;
    me.params = config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Builds parallel nodes
   * @return {Object}
   */
  process: function () {
    var me = this,
        parallelSectionInfo;

    parallelSectionInfo = me.collectParallelNodes(me.wfDiagram, me.nodeId, me.parallelSectionId);

    return parallelSectionInfo;
  },

  /**
   * @private
   * @param {de.elo.ix.client.WFDiagram} wfDiagram Workflow diagram
   * @param {String} startNodeId Start node ID
   * @param {String} parallelSectionId Parallel section ID
   * @return {Object} Parallel section info
   */
  collectParallelNodes: function (wfDiagram, startNodeId, parallelSectionId) {
    var me = this,
        parallelSectionInfo, key, assoc;

    parallelSectionInfo = {
      startNodeId: startNodeId,
      nodes: {},
      assocs: {}
    };
    me.collectNode(wfDiagram, startNodeId, parallelSectionInfo, parallelSectionId);

    for (key in parallelSectionInfo.assocs) {
      assoc = parallelSectionInfo.assocs[key];
      if (assoc.nodeTo == parallelSectionInfo.endNodeId) {
        delete parallelSectionInfo.assocs[key];
      }
    }

    return parallelSectionInfo;
  },

  collectNode: function (wfDiagram, nodeId, parallelSectionInfo, parallelSectionId) {
    var me = this,
        node, successorAssocs, config, assoc, i, toNodeId, key;

    nodeId += "";

    node = sol.common.WfUtils.getNodeById(wfDiagram, nodeId);

    if (!node) {
      throw "Can't find node: nodeId=" + nodeId;
    }

    if (node.type == WFNodeC.TYPE_COLLECTNODE) {
      try {
        config = JSON.parse(node.properties);
        if (config.parallelSectionId == parallelSectionId) {
          parallelSectionInfo.endNodeId = nodeId;
          return;
        }
      } catch (ex) {
        // ignore
      }
    } else if (node.type == WFNodeC.TYPE_ENDNODE) {
      throw "Parallel end node not found: parallelSectionId=" + parallelSectionId;
    }

    if (nodeId != parallelSectionInfo.startNodeId) {
      parallelSectionInfo.nodes[nodeId] = node;
    }

    successorAssocs = me.getSuccessorAssocs(wfDiagram, nodeId);

    for (i = 0; i < successorAssocs.length; i++) {
      assoc = successorAssocs[i];
      key = assoc.nodeFrom + "-" + assoc.nodeTo;
      if (nodeId != parallelSectionInfo.startNodeId) {
        parallelSectionInfo.assocs[key] = assoc;
      }
      toNodeId = assoc.nodeTo + "";
      me.collectNode(wfDiagram, toNodeId, parallelSectionInfo, parallelSectionId);
    }
  },

  /**
   * Returns the successor node IDs
   * @param {de.elo.ix.client.WFDiagram} wfDiagram Workflow diagram
   * @param {String} nodeId Start node ID
   * @return {Array} Successor node IDs
   */
  getSuccessorAssocs: function (wfDiagram, nodeId) {
    var successorAssocs = [],
        assocs, assoc, i;

    assocs = wfDiagram.matrix.assocs;

    for (i = 0; i < assocs.length; i++) {
      assoc = assocs[i];
      if (assoc.nodeFrom == nodeId) {
        successorAssocs.push(assoc);
      }
    }

    return successorAssocs;
  }
});

/**
 * @member sol.common.ix.functions.ParallelSectionStart
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module, result;

  logger.enter("onExitNode_ParallelSectionStart", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "parallelSectionId");

  params.wfDiagram = wfDiagram;
  params.nodeId = nodeId;

  module = sol.create("sol.common.ix.functions.ParallelSectionStart", params);
  result = module.process();

  logger.exit("onExitNode_ParallelSectionStart");
  return result;
}

// End Script sol.common.ix.functions.parallelsectionstart.js -------------------------
