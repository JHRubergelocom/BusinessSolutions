importPackage(Packages.de.elo.utils);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js
//@include lib_sol.teamroom.mixins.Configuration.js
//@include lib_sol.teamroom.Utils.js

/**
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.UserUtils
 * @requires sol.teamroom.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.teamroom.ix.functions.HandleEvent", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true },
    _events: { config: "teamroom", prop: "entities.eventhandler.events" }
  },

  process: function () {
    var me = this, params = me._params,
        mode = params.mode, teamroomSord, result,
        eventConfig = (me._events || {})[mode];

    if (me.apiKey !== me._connection.API_TOKEN) {
      me.logger.warn("Invalid '" + mode + "' Event token: " + me.apiKey);
      throw "Invalid '" + mode + "' Event token: " + me.apiKey;
    }

    if (eventConfig) {
      if (eventConfig.wfName) {
        teamroomSord = sol.common.RepoUtils.getSord(me.guid);
        sol.common.WfUtils.startWorkflow(eventConfig.wfName, eventConfig.wfTitle, teamroomSord.id);
      }

      if (eventConfig.rfName) {
        result = sol.common.IxUtils.execute(eventConfig.rfName, params);
        me.logger.info(["Teamroom rfName: {0}, result: {1}", eventConfig.rfName, result]);
      }
    }
  }
});

/**
 * @member sol.teamroom.ix.functions.HandleEvent
 * @method RF_sol_teamroom_function_HandleEvent
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionBaseName
 */
function RF_sol_teamroom_function_HandleEvent(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.teamroom.ix.functions.HandleEvent" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);

  result = sol.common.JsonUtils.stringifyQuick(
    sol.create("sol.teamroom.ix.functions.HandleEvent", rfParams).process()
  );

  logger.info("Result RegisterUser:" + result);
  logger.exit("sol.teamroom.ix.functions.HandleEvent");
  return result;
}

function functionAdapter(ec, args, mode) {
  var rfParams = {
    guid: String(args[0]),
    name: String(args[1]),
    apiKey: String(args[2]),
    mode: mode
  };

  return RF_sol_teamroom_function_HandleEvent(ec, sol.common.JsonUtils.stringifyQuick(rfParams));
}

function msg(success, code, message, input, existing) {
  return { success: success, code: code, message: message, input: input, existing: existing };
}

function RF_Teamroom_Created(ec, args) {
  return functionAdapter(ec, args, "created");
}

function RF_Teamroom_Closed(ec, args) {
  return functionAdapter(ec, args, "closed");
}

function RF_Teamroom_Deleted(ec, args) {
  return functionAdapter(ec, args, "deleted");
}