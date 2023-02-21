
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.GoToWebinarConfiguration.js
//@include lib_sol.common.Injection.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.learning.ix.functions.OAuthorize", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.GoToWebinarConfiguration", "sol.common.mixins.Inject"],

  inject: {
    _serviceUser: { config: "gotowebinar", prop: "entities.oauth.default.serviceUser" }
  },


  callCredentialServer: function (request) {
    return sol.common.IxUtils.execute("RF_gotowebinar_Authorize", request);
  },

  getState: function (state, thrw) {
    if (!(state = String(state || "")) && thrw) {
      throw "state parameter must not be empty";
    }
    return state;
  },

  getCode: function (code, thrw) {
    if (!(code = String(code || "")) && thrw) {
      throw "code parameter must not be empty";
    }
    return code;
  },

  getError: function (error) {
    return String(error || "");
  },

  authorize: function (user) {
    var me = this,
        code = me.getCode(me.code), error = me.getError(me.error),
        request = { code: code, user: user };
    if (error) {
      return { authorized: false, message: error };
    }

    return me.callCredentialServer(request);
  },

  isUserAuthorized: function (user) {
    var authResult, authorized;
    authResult = (sol.common.IxUtils.execute("RF_gotowebinar_CheckAuthorization", { user: user }) || {}).authorized;
    authorized = !(authResult === "false" || !authResult);
    return { authorized: authorized };
  },

  getUser: function () {
    return String(ixConnect.loginResult.user.id);
  },

  process: function () {
    var me = this, user = (me.authorizeAsServiceUser && me._serviceUser) || me.userId || me.getUser();
    if (me.code) {
      return me.authorize(user);
    } else {
      return me.isUserAuthorized(user);
    }
  }
});

/**
 * @member sol.learning.ix.functions.OAuthorize
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun, authStatus;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
  fun = sol.create("sol.learning.ix.functions.OAuthorize", params);

  authStatus = (fun.process()).authorized ? "AUTHORIZED" : "NOT_AUTHORIZED";
  params.writeWfMap && sol.common.IxUtils.execute("RF_sol_function_Set", {
    objId: wfDiagram.objId, flowId: wfDiagram.id, entries: [{ type: "WFMAP", key: "AUTHORIZATION_STATUS", value: authStatus }]
  });
  params.writeWfStatus && sol.common.WfUtils.setWorkflowStatus(wfDiagram, authStatus);
}

/**
 * @member sol.learning.ix.functions.OAuthorize
 * @method RF_sol_learning_function_OAuthorize
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_OAuthorize(iXSEContext, args) {
  var rfArgs, fun, result;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfArgs.userId;
  delete rfArgs.reset;
  delete rfArgs.authorizeAsServiceUser;
  fun = sol.create("sol.learning.ix.functions.OAuthorize", rfArgs);
  result = fun.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}