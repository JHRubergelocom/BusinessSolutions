
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.teamroom.mixins.Configuration.js
//@include lib_sol.teamroom.Utils.js


/**
 * Deletes a teamroom
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.teamroom.ix.functions.DeleteRoom", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", optional: true},
    flowId: { prop: "flowId", forTemplating: true },
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true }
  },

  process: function () {
    var me = this, result;
    result = sol.teamroom.Utils
      .sendRequest({
        service: me._connection.serviceUrl,
        token: me._connection.API_TOKEN,
        guid: me.sord.guid,
        name: me.sord.name,
        cmd: "delete"
      });

    if (result) {
      if (result.responseOk) {
        if (result.content.indexOf("Ok.") === -1) {
          // throw "Teamroom delete room: Error during the closing of a teamroom. Response: " + result.content;
        } else {
          me.logger.info("Teamroom delete room: executed successfully");
          me.logger.debug("Teamroom delete room: content: " + result.content);
        }
      } else {
        // throw "Teamroom delete room: Error during the closing of a teamroom. Response: " + result.content + ", error message" + result.errorMessage;
      }
    } else {
      // throw "Teamroom delete room: no result";
    }
  }
});

/**
 * @member sol.teamroom.ix.functions.DeleteRoom
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.owner = wfDiagram.ownerName;
  params.configStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.teamroom.ix.functions.DeleteRoom", params).process();
}

/**
 * @member sol.teamroom.ix.functions.DeleteRoom
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.owner = wfDiagram.ownerName;
  params.paramStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.teamroom.ix.functions.DeleteRoom", params).process();
}