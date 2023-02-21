
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetWorkflowMetadata" });

/**
 * Retrieves some metadata of a workflow.
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_GetWorkflowMetadata', {
 *       flowId: "4711"
 *     });
 *
 * Returns the workflow metadata:
 *
 *     {
 *       flowId: 4711,            // the workflow id
 *       name: "Musterflow",      // the workflow name
 *       objId: "0815",           // the objId
 *       objName: "Testdoc",      // the objects name
 *       status: "SUCCESS",       // the workflow status
 *       templateId: 23,          // the template id
 *       templateName: "Muster",  // the template name
 *       ownerId: 0,              // the owner id
 *       ownerName: "Admin",      // the owner name
 *       activeNodes: [           // a list of all active nodes
 *         {
 *           nodeId: 1,           // id of the active node
 *           nodeName: "node 1",  // name of the active node
 *           userId: 0,           // id of the node user
 *           userName: "Admin"    // name of the node user
 *         }
 *       ]
 *     }
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 */
sol.define("sol.common.ix.services.GetWorkflowMetadata", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["flowId"],

  /**
   * @cfg {String} flowId
   */

  /**
   * @cfg {Boolean} [inclFinished=true] (optional)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.inclFinished = (me.inclFinished === false) ? false : true;
  },

  /**
   * Retrieves the metadata
   * @return {Object}
   */
  process: function () {
    var me = this,
        wfUtils = sol.common.WfUtils,
        result = {},
        wfDiagram, wfStatus, activeNodes;

    try {
      wfDiagram = wfUtils.getWorkflow(me.flowId, { inclFinished: me.inclFinished });
      wfStatus = wfUtils.getWorkflowStatus(wfDiagram);

      result.flowId = wfDiagram.id;
      result.name = wfDiagram.name;
      result.objId = wfDiagram.objId;
      result.objName = wfDiagram.objName;
      result.status = wfStatus;
      result.templateId = wfDiagram.templateId;
      result.templateName = wfDiagram.templateName;
      result.ownerId = wfDiagram.ownerId;
      result.ownerName = wfDiagram.ownerName;

      activeNodes = wfUtils.getActiveNodes(wfDiagram);

      if (activeNodes && (activeNodes.length > 0)) {
        result.activeNodes = activeNodes.map(function (node) {
          return {
            nodeId: node.id,
            nodeName: node.name,
            userId: node.userId,
            userName: node.userName
          };
        });
      }

    } catch (ex) {
      me.logger.error("error retrieving workflow metadata", ex);
    }

    return result;
  }

});

/**
 * @member sol.common.ix.services.GetWorkflowMetadata
 * @method RF_sol_common_service_GetWorkflowMetadata
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetWorkflowMetadata(iXSEContext, args) {
  logger.enter("RF_sol_common_service_GetWorkflowMetadata", args);

  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "flowId"),
      service, result;

  service = sol.create("sol.common.ix.services.GetWorkflowMetadata", params);
  result = sol.common.JsonUtils.stringifyAll(service.process());

  logger.exit("RF_sol_common_service_GetWorkflowMetadata", result);

  return result;
}
