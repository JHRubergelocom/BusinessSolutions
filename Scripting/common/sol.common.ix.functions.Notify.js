
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.FileUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.Mail.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Notify" });

/**
 * Sends an email
 *
 * # As workflow node
 *
 *     {
 *       "from": "elo@contelo.com",
 *       "to": "solutions@elo.com",
 *       "subject": "Neue Aufgabe",
 *       "body": {
 *       "type": "html",
 *       "tplObjId": "ARCPATH:/Administration/Business Solutions Custom/notify/Configuration/Mail templates/Example",
 *       "data": {
 *         "person": {
 *         "salutation": "Mr",
 *           "firstName": "Peter",
 *           "lastName": "Smith"
 *         }
 *       }
 *    }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Notify", {
 *       objId: "4711",
 *       mode: "run",
 *       from: "elo@contelo.com",
 *       to: {
 *         type: "CURRENT"
 *       },
 *       subject: "Neue Aufgabe",
 *       body: {
 *         type: "html",
 *         tplObjId: "ARCPATH:/Administration/Business Solutions Custom/contract/Configuration/Mail templates/Notification"
 *       },
 *       data: {
 *         person": {
 *           salutation: "Mr",
 *           firstName: "Peter",
 *           lastName: "Smith"
 *         }
 *       }
 *     }
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
sol.define("sol.common.ix.functions.Notify", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} type
   * Notification type. Default is "e-mail"
   */

  /**
   * @cfg {Object} config
   * Configuration object for the notification
   * see {@link sol.common.Mail}
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this;

    mail = sol.create("sol.common.Mail", me.params);
    mail.send();
  }
});

/**
 * @member sol.common.ix.functions.Notify
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

  module = sol.create("sol.common.ix.functions.Notify", { params: params });
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

  module = sol.create("sol.common.ix.functions.Notify", { params: params });
  module.process();

  logger.exit("onExitNode_Notify");
}

/**
 * @member sol.common.ix.functions.Notify
 * @method RF_sol_function_Notify
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Notify(ec, configAny) {
  var module, params, result;

  logger.enter("RF_sol_function_Notify", configAny);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.common.ix.functions.Notify", { params: params });
  result = module.process();

  logger.exit("RF_sol_function_Notify");

  return result;
}
