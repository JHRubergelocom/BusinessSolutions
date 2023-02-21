importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.MoveToNotifications" });

/**
*
*
* @author ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.Injection
* @requires sol.common.ObjectUtils
* @requires sol.common.SordUtils
* @requires sol.common.Template
* @requires sol.common.ix.FunctionBase
* @requires sol.meeting.mixins.Configuration
*/
sol.define("sol.meeting.ix.functions.MoveToNotifications", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    moveArgs: { config: "notification", prop: "entries.notification.functions.notificationTemplates.moveToTemplateFolder.moveArgs", template: true },
    meetingGuid: { config: "notification", prop: "entries.notification.functions.notificationTemplates.moveToTemplateFolder.meetingGuid", template: true },
    NOTIFICATION: { sordIdFromProp: "objId", optional: false }
  },

  process: function () {
    var me = this,
        meetingBoardSord = me.getTemplateSord(me.meetingGuid);

    return meetingBoardSord
      ? sol.common.IxUtils.execute(
        "RF_sol_function_Move",
        sol.common.TemplateUtils.render(
          me.moveArgs,
          {
            source: meetingBoardSord
          }
        ))
      : null;
  },

  getTemplateSord: function (objId) {
    return (sol.common.SordUtils.getTemplateSord(
      sol.common.RepoUtils.getSord(objId)
    ) || {}).sord;
  }
});

/**
 * @member sol.meeting.ix.functions.MoveToNotifications
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(client, userId, diagram, nodeId) {
  logger.enter("onEnterNode_MoveToNotifications", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  generator = sol.create("sol.meeting.ix.functions.MoveToNotifications", params);

  generator.process();

  logger.exit("onEnterNode_MoveToNotifications");
}

/**
 * @member sol.meeting.ix.functions.MoveToNotifications
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_MoveToNotifications", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  generator = sol.create("sol.meeting.ix.functions.MoveToNotifications", params);

  generator.process();

  logger.exit("onExitNode_MoveToNotifications");
}

/**
* @member sol.meeting.ix.functions.MoveToNotifications
* @method RF_sol_meeting_function_MoveToNotifications
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionBaseName
*/
function RF_sol_meeting_function_MoveToNotifications(iXSEContext, args) {
  var params,
      result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  params.config = params;

  result = sol.create("sol.meeting.ix.functions.MoveToNotifications", params).process();
  return sol.common.JsonUtils.stringifyQuick(result);
}