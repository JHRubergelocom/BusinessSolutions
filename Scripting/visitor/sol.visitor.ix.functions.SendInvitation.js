
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.Mail.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.functions.SendInvitation" });

/**
 * Sends an invitation email
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.visitor.ix.functions.SendInvitation", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {String} flowId
   * Workflow ID
   */

  /**
   * @cfg {String} nodeId
   * Node ID
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.visitorConfig = sol.visitor.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        mailConfig = {},
        attachments = [],
        sendInvitationKey = "SEND_INVITATION",
        invitationTemplateKey = "INVITATION_TEMPLATE",
        recipient, templateBaseFolderId, mapObj, sendInvitation, templateName, templateFolderId, visitorSord,
        subjectTemplateId, bodyTemplateId, attsFolderId, attSords;

    visitorSord = sol.common.RepoUtils.getSord(me.objId);
    recipient = sol.common.SordUtils.getObjKeyValue(visitorSord, "VISITOR_MAIL");

    if (!recipient) {
      return;
    }

    mapObj = sol.common.SordUtils.getMapEntriesAsObject({ objId: me.objId, keys: [sendInvitationKey, invitationTemplateKey] });

    sendInvitation = mapObj[sendInvitationKey];
    templateName = mapObj[invitationTemplateKey];

    if ((sendInvitation != "1") || !templateName) {
      return;
    }

    templateBaseFolderId = me.visitorConfig.invitation.templateFolderId;

    templateFolderId = sol.common.RepoUtils.getObjIdFromRelativePath(templateBaseFolderId, "/" + templateName);

    if (!templateFolderId) {
      throw "Invitation template folder '" + templateName + "' not found.";
    }

    bodyTemplateId = sol.common.RepoUtils.getObjIdFromRelativePath(templateFolderId, "/body");

    if (!bodyTemplateId) {
      throw "Invitation body template '" + templateName + "/body' not found.";
    }

    subjectTemplateId = sol.common.RepoUtils.getObjIdFromRelativePath(templateFolderId, "/subject");
    if (!subjectTemplateId) {
      throw "Invitation subject template '" + templateName + "/subject' not found.";
    }

    attsFolderId = sol.common.RepoUtils.getObjIdFromRelativePath(templateFolderId, "/attachments");

    if (attsFolderId) {
      attSords = sol.common.RepoUtils.findChildren(attsFolderId, { includeDocuments: true, includeFolders: false });
    }

    attachments = attSords.map(function (attSord) {
      return { objId: attSord.id + "" };
    });

    me.logger.debug(["sendInvitation={0}, invitation.templateFolder.name={1}, invitation.templateFolder.id={2}, invitation.bodyTemplate.id={3}, invitation.subjectTemplate.id={4}",
      sendInvitation, templateName, templateFolderId, bodyTemplateId, subjectTemplateId]);

    mailConfig.objId = me.objId;
    mailConfig.flowId = me.flowId;
    mailConfig.nodeId = me.nodeId;
    mailConfig.from = me.visitorConfig.invitation.from || "reception@elo.com";
    mailConfig.to = recipient;
    mailConfig.subject = sol.common.RepoUtils.downloadSmallContentToString(subjectTemplateId);
    mailConfig.body = { type: me.visitorConfig.invitation.bodyType || "html", tplObjId: bodyTemplateId };
    mailConfig.atts = attachments;

    mail = sol.create("sol.common.Mail", mailConfig);
    mail.send();
  }
});

/**
 * @member sol.visitor.ix.functions.SendInvitation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onEnterNode_SendInvitation", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.visitor.ix.functions.SendInvitation", params);
  module.process();

  logger.exit("onEnterNode_SendInvitation");
}

/**
 * @member sol.visitor.ix.functions.SendInvitation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onExitNode_SendInvitation", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.visitor.ix.functions.SendInvitation", params);
  module.process();

  logger.exit("onExitNode_SendInvitation");
}

/**
 * @member sol.visitor.ix.functions.SendInvitation
 * @method RF_sol_function_SendInvitation
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_SendInvitation(ec, configAny) {
  var module, params, result;

  logger.enter("RF_sol_function_SendInvitation", configAny);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.visitor.ix.functions.SendInvitation", params);
  result = module.process();

  logger.exit("RF_sol_function_SendInvitation");

  return result;
}
