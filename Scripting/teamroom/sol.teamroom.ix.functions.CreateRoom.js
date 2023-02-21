
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
 * Creates a teamroom
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
sol.define("sol.teamroom.ix.functions.CreateRoom", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true },
    _standardWorkflow: { config: "teamroom", prop: "entities.room.standardWorkflowField" }
  },

  process: function () {
    var me = this, result, templateSord, teamroomFolderSord, teamroomName;
    templateSord = sol.common.RepoUtils.getSord(me.objId, SordC.mbAll, LockC.NO);

    teamroomName = sol.common.IxUtils.execute("RF_sol_teamroom_function_generateRoomShortDesc", {
      objId: me.objId,
      updateExisting: true
    }).identifier;

    result = sol.teamroom.Utils.sendRequest({
      service: me._connection.serviceUrl,
      token: me._connection.API_TOKEN,
      guid: templateSord.guid,
      name: teamroomName,
      owner: me.owner,
      cmd: "create"
    });

    if (result) {
      if (result.responseOk) {
        if (result.content.indexOf("Creation successful") === -1) {
          // throw "Teamroom open room: Error during the creation of a teamroom. Response: " + result.content;
        } else {
          me.logger.info("Teamroom open room: executed successfully");
          me.logger.debug("Teamroom open room: content: " + result.content);
        }
      } else {
        // throw "Teamroom open room: Error during the creation of a teamroom. Response: " + result.content + ", error message" + result.errorMessage;
      }
    } else {
      // throw "Teamroom open room: no result";
    }

    // TODO: parse teamroomFolderGuid from result instead of this checkout? Would be safer
    // but the parsing might need more resources than our simple checkout by name
    teamroomFolderSord = sol.common.RepoUtils.getSord("ARCPATH:/Teamroom/" + teamroomName);

    // we need to copy everything from our template into the newly created
    // teamroom sord. We have to do it this way, because the service needs the sord guid
    // from the original folder to work propertly. (we can't change the guid easily as at
    // that point a folder with the same guid is already created on the remote archive)

    me.migrateTemplate(templateSord, teamroomFolderSord);

    try {
      sol.common.WfUtils.startMaskStandardWorkflow(teamroomFolderSord.id, { name: teamroomName, field: me._standardWorkflow });
    } catch (e) {
      me.logger.info(["Teamroom {0} has not defined a creation workflow", teamroomName]);
    }

    // TODO: we may want to move the teamroomFolderGuid
    // but for now we'll live with "// Teamroom" as this is hardcoded in the trm service

  },

  migrateTemplate: function(templateSord, teamroomSord) {
    var me = this, templateChildrenIds;

    templateChildrenIds = sol.common.RepoUtils.findChildren(templateSord.id).map(function(sord) {
      return sord.id;
    });

    // TODO: migrate map entries as well
    sol.common.RepoUtils.moveSords(templateChildrenIds, teamroomSord.id);

    templateSord.name = teamroomSord.name;
    templateSord.guid = teamroomSord.guid;
    templateSord.id = teamroomSord.id;

    ixConnect.ix().checkinSord(templateSord, SordC.mbAll, LockC.NO);

  }
});

/**
 * @member sol.teamroom.ix.functions.CreateRoom
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.owner = wfDiagram.ownerName;
  params.configStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.teamroom.ix.functions.CreateRoom", params).process();
}

/**
 * @member sol.teamroom.ix.functions.CreateRoom
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.owner = wfDiagram.ownerName;
  params.paramStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.teamroom.ix.functions.CreateRoom", params).process();
}