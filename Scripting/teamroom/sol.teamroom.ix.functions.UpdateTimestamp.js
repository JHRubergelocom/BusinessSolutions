
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
 * Updates timestamp of a document/structure or feed entry
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
sol.define("sol.teamroom.ix.functions.UpdateTimestamp", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true },
    _config: { config: "teamroom", prop: "entities.room.services.getinfo", template: true }
  },

  updateTimestamp: function (id) {
    return sol.teamroom.Utils.update(
      "update objekte set objtstampsync = objtstamp where objid = " + id,
      "Update timestamp of " + id
    );
  },

  updateFeedTimestamp: function (id, timestamp) {
    return sol.teamroom.Utils.update(
      "update feedaction set updatedateiso = " + timestamp + " where actionguid = '" + id + "'",
      "Update feed timestamp of " + id
    );
  },

  process: function () {
    var me = this,
        id = me._params.id,
        mode = me._params.mode,
        timestamp = me._params.timestamp,
        token = me._params.token,
        apiToken = me._connection.API_TOKEN;

    if (me._params.flowId && !token) {
      token = apiToken;
    } else if (token !== apiToken) {
      me.logger.warn("Invalid '" + mode + "' token: " + token);
      throw "Unauthorized access";
    }

    if (mode == "updatets") {
      return me.updateTimestamp(id);
    } else if (mode == "updatetsfeed") {
      return me.updateFeedTimestamp(id, timestamp);
    } else {
      throw "Mode  not supported: " + mode;
    }
  }
});

/**
 * @member sol.teamroom.ix.functions.UpdateTimestamp
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.configStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.updatetimestamp("sol.teamroom.ix.functions.UpdateTimestamp", params).process();
}

/**
 * @member sol.teamroom.ix.functions.UpdateTimestamp
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.paramStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.updatetimestamp("sol.teamroom.ix.functions.UpdateTimestamp", params).process();
}

/**
 * @member sol.teamroom.ix.functions.UpdateTimestamp
 * @method RF_sol_teamroom_function_UpdateTimestamp
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_ServiceBaseName
 */
function RF_sol_teamroom_function_UpdateTimestamp(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.teamroom.ix.functions.UpdateTimestamp" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  delete rfParams.flowId;
  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);

  result = sol.common.JsonUtils.stringifyQuick(
    sol.create("sol.teamroom.ix.functions.UpdateTimestamp", rfParams).process()
  );

  logger.exit("sol.teamroom.ix.functions.UpdateTimestamp");
  return result;
}

function functionAdapter(ec, args, mode) {
  var rfParams = {};
  rfParams.id = sol.teamroom.Utils.verifySqlParam(args[0]);
  if (mode == "updatets") {
    rfParams.token = args[1];
  } else {
    rfParams.token = args[2];
    rfParams.timestamp = args[1];
  }
  rfParams.mode = mode;
  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);

  return sol.create("sol.teamroom.ix.functions.UpdateTimestamp", rfParams).process();
}

function RF_Teamroom_UpdateTS(ec, args) {
  return functionAdapter(ec, args, "updatets");
}

function RF_Teamroom_UpdateFeedTS(ec, args) {
  return functionAdapter(ec, args, "updatetsfeed");
}