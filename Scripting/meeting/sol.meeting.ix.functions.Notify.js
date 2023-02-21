
importPackage(Packages.de.elo.ix.client);
//@include lib_Class.js
//@include lib_sol.common.Mail.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ExecUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.ObjectFormatter.MapTableToArray.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.Notify" });

/**
 * Sends an email with attachments
 *
 *
 * For more details see {@link sol.common.as.functions.SendMail}
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
sol.define("sol.meeting.ix.functions.Notify", {
  extend: "sol.common.ix.FunctionBase",
  mixins: ["sol.common.mixins.Inject"],

  inject: {
    templateSord: { sordIdFromProp: "params.objId" }
  },


  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this;

    if (me.shouldAppendAttachments()) {
      me.params.atts = me.prepareAttachmentList();
    }

    if (me.$dryRun) {
      return {
        params: me.params
      };
    }

    mail = sol.create("sol.common.Mail", me.params);
    mail.send();
  },

  shouldAppendAttachments: function () {
    var me = this;
    return me.params.attachmentField;
  },

  prepareAttachmentList: function () {
    var me = this, attachmentList,
        attachmentField = me.params.attachmentField;

    attachmentList = sol.common.TemplateSordUtils.getTable(me.templateSord, [attachmentField]);

    if (!attachmentList || !attachmentList.length) {
      return;
    }

    // map to expected structure {@see sol.common.Mail}
    return attachmentList.map(function (row) {
      return { objId: row[attachmentField] };
    });
  }


});

/**
 * @member sol.meeting.ix.functions.Notify
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onEnterNode_Notify", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.meeting.ix.functions.Notify", { params: params });
  module.process();

  logger.exit("onEnterNode_Notify");
}

/**
 * @member sol.common.ix.functions.Notify
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onExitNode_Notify", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.meeting.ix.functions.Notify", { params: params });
  module.process();

  logger.exit("onExitNode_Notify");
}

/**
 * @member sol.common.ix.functions.Notify
 * @method RF_sol_function_Notify
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_Notify(ec, configAny) {
  var module, params, result;

  logger.enter("RF_sol_meeting_function_Notify", configAny);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.meeting.ix.functions.Notify", { params: params });
  result = module.process();

  logger.exit("RF_sol_meeting_function_Notify");

  return result;
}
