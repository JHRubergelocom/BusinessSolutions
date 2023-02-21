
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common_sig.ix.services.UploadSignature" });

/**
 * Uploads a signature
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ix.ServiceBase
 * 
 * # IX function call example:
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_visitor_service_UploadSignature", { flowId: ELO_PARAMS.ELO_FLOWID, base64Content: base64Content });
 *     
 */
sol.define("sol.common_sig.ix.services.UploadSignature", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["visitorObjId", "base64Content"],
  
  signatureDataNodeName: "[data] signature",
  
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Uploads the given file base64 content
   * @return {Object} An Object containing the `flowId`
   */
  process: function () {
    var me = this,
        wfDiagram, signatureDataNode;

    wfDiagram = sol.common.WfUtils.getWorkflow(me.flowId);
    signatureDataNode = sol.common.WfUtils.getNodeByName(wfDiagram, me.signatureDataNodeName);
    if (!signatureDataNode) {
      throw "Node '" + me.signatureDataNodeName + "' not found";
    }
    if (!me.base64Content) {
      throw "Base64 content is empty";
    }
    
    signatureDataNode.properties = me.base64Content;
    
    ixConnect.ix().checkinWorkFlow(wfDiagram, WFDiagramC.mbAll, LockC.NO);
    
    return { flowId: me.flowId };
  }
});

/**
 * @member sol.common_sig.ix.services.UploadSignature
 * @method RF_sol_common_sig_service_UploadSignature
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_sig_service_UploadSignature(iXSEContext, args) {
  var params, service, result;
  
  logger.enter("RF_sol_common_sig_service_UploadSignature", args);
  
  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "flowId", "base64Content");
  service = sol.create("sol.common_sig.ix.services.UploadSignature", { flowId: params.flowId, base64Content: params.base64Content, extension: "jpg" });
  result = JSON.stringify(service.process());
  
  logger.exit("RF_sol_common_sig_service_UploadSignature", result);
  return result;
}
