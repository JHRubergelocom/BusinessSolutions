
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.recruiting.mixins.ConfigurationIntegration.js

/**
 * Publishes a posting
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.HttpUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.recruiting.ix.functions.PublishPosting", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.recruiting.mixins.ConfigurationIntegration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", includeBlobs: true },
    POSTING: { prop: "sord" },
    user: { prop: "user" },
    // do not render ad_template, because it cointains handlebars helpers which will be used by GOhiring
    ad_template: { config: "recruiting_integration", prop: "entities.posting.functions.publish.params.ad_template", template: false },
    _config: { config: "recruiting_integration", prop: "entities.posting.functions.publish", template: true, emptyNonRendered: true }
  },

  missingData: function (data) {
    return Object.keys(data).filter(function (prop) {
      return String(data[prop] || "").trim() === "";
    });
  },

  filterEmpty: function (obj) {
    var me = this;
    Object.keys(obj).forEach(function (prop) {
      var val = obj[prop];
      if (typeof val == "string" && val.trim() === "") {
        obj[prop] = undefined;
      } else if (typeof val == "object" && !Array.isArray(val)) {
        obj[prop] = me.filterEmpty(val);
      }
    })
    return JSON.parse(JSON.stringify(obj));
  },

  process: function () {
    var me = this, result, args, jobId, missing;
    args = {
      production: !!me._config.production,
      httpMethod: "POST",
      httpPath: "/external/enrollments",
      cookie: null,
      body: me.filterEmpty(me._config.params),
      config: me._config.gohiring_con
    };

    missing = me.missingData(args.body.user);
    if (missing.length) {
      throw "All user properties must be set in the user profile of user `" + me.user.name + "`! Missing properties: " + missing;
    }

    args.body.ad_template = me.ad_template; // restore ad_template which still has handlebars helpers

    me.logger.info("RF_GoHiring_Execute Args: ", args);
    result = sol.common.IxUtils.execute("RF_GoHiring_Execute", args);
    me.logger.info("RF_GoHiring_Execute Answer:", result);

    if (result.result === false && result.exception) {
      throw result.message;
    }

    ((jobId = (result.location || "").match(/\/jobs\/(.+)\/details\/edit/)) && (jobId = jobId[1]))
      && sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: me.objId,
        entries: [{
          type: "MAP",
          key: "RECRUITING_GOHIRING_JOBID",
          value: jobId
        }]
      });

  }
});

sol.define("sol.recruiting.ix.functions.GetRedirectRequest", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.recruiting.mixins.ConfigurationIntegration", "sol.common.mixins.Inject"],

  inject: {
    user: { prop: "user" },
    _config: { config: "recruiting_integration", prop: "entities.posting.functions.publish", template: false }
  },

  filterEmpty: function (obj) {
    var me = this;
    Object.keys(obj).forEach(function (prop) {
      var val = obj[prop];
      if (typeof val == "string" && val.trim() === "") {
        obj[prop] = undefined;
      } else if (typeof val == "object" && !Array.isArray(val)) {
        obj[prop] = me.filterEmpty(val);
      }
    })
    return JSON.parse(JSON.stringify(obj));
  },

  missingData: function (data) {
    return Object.keys(data).filter(function (prop) {
      return String(data[prop] || "").trim() === "";
    });
  },

  process: function () {
    var me = this, result, args, missing, job;
    args = {
      production: !!me._config.production,
      TeStHash: me.TeStHash, // this is not a typo
      httpMethod: "POST",
      httpPath: "/external/enrollments",
      cookie: null,
      body: me._config.params,
      config: me._config.gohiring_con,
      returnRequest: !!me.returnRequest
    };

    job = args.body.job;

    if (me.returnRequest) {
      args.body = {
        user: args.body.user,
        payment_address: args.body.payment_address,
        strategies: { job: "create_or_update" }
      };
    }

    if (me.guid) {
      args.body.job = job;
      me.$templatingData.sord = sol.common.WfUtils.getTemplateSord(
        ixConnect.ix().checkoutSord(me.guid, SordC.mbAllIndex, LockC.NO),
        null,
        { formBlobs: true }
      ).sord;
      me.$templatingData.POSTING = me.$templatingData.sord;
    }

    args.body = sol.common.TemplateUtils.render(args.body, me.$templatingData, { emptyNonRendered: true });
    args.body = me.filterEmpty(args.body);

    missing = me.missingData(args.body.user);
    if (missing.length) {
      return { error: "All user properties must be set in the user profile of user `" + me.user.name + "`! Missing properties: " + missing };
    }
    if (me.guid && !args.body.job.id) {
      return { error: "Sord is not a job!" + me.guid };
    }


    me.logger.info("RF_GoHiring_Execute returnRequest Args: ", args);
    result = sol.common.IxUtils.execute("RF_GoHiring_Execute", args);
    if (result.result === false && result.exception) {
      throw result.message;
    }
    me.logger.info("RF_GoHiring_Execute returnRequest Answer:", result);

    if (me.returnRequest) {
      return result;
    }
  }
});

function getUser(user, fields) {
  function sanitize(s) {
    return s.replace(/[:/%\+\*\$@\?;:\.]/g, "").replace(/  /g, "");
  }
  var userInfo = sol.common.UserUtils.getUserInfo(user) || {},
      userId = String(userInfo.id || user),
      userName = String(userInfo.name || userId),
      userSord = sol.common.UserUtils.getUserFolder(userName),
      userProps = (userInfo.userProps || []),
      userData = {}, firstName, lastName, splitName, mail, fullName;
  userName = String(userName);
  if (fields && fields.length) {
    [].slice.call(userSord.objKeys)
      .forEach(function (objKey) {
        var key = String(objKey.name), value = String(objKey.data[0] || "");
        ~fields.indexOf(key) && (userData[key] = value);
      });
  }

  mail = String(userData.ELOMAILADDRESS || userProps[UserInfoC.PROP_NAME_EMAIL] || "").trim() || "nomailfound@nodomain.com";

  fullName = String(userData.ELOFULLNAME).trim();
  if (fullName.indexOf(" ")) {
    splitName = fullName.split(" ");
    firstName = splitName[0].trim();
    lastName = splitName.slice(1, splitName.length).join("").trim();
  }

  if (!firstName && !lastName) { // fallback to username if fullname was not defined
    fullName = userName.trim().replace(/\d+$/, "").trim(); // remove numbers from end of username
    if (fullName.indexOf(" ")) {
      splitName = fullName.split(" ");
      firstName = splitName[0].trim();
      lastName = splitName.slice(1, splitName.length).join("");
    }
  }

  if (!firstName) {
    firstName = userName;
  }

  if (!lastName) {
    lastName = userName;
  }

  firstName = sanitize(firstName);
  lastName = sanitize(lastName);

  if (!firstName || !lastName) {
    throw "user `" + userName + "` has no (ELOFULLNAME or ELOMAILADDRESS) or username only contained invalid characters: (" + fullName + ", " + mail + ")";
  }

  return {
    id: userId,
    firstName: firstName,
    lastName: lastName,
    email: mail
  };
}

/**
 * @member sol.recruiting.ix.functions.PublishPosting
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.user = getUser(userId, ["ELOFULLNAME", "ELOMAILADDRESS"]);

  fun = sol.create("sol.recruiting.ix.functions.PublishPosting", params);

  fun.process();
}

/**
 * @member sol.recruiting.ix.functions.PublishPosting
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.user = getUser(userId, ["ELOFULLNAME", "ELOMAILADDRESS"]);

  fun = sol.create("sol.recruiting.ix.functions.PublishPosting", params);

  fun.process();
}



/**
 * @member sol.recruiting.ix.functions.PublishPosting
 * @method RF_sol_recruiting_function_GetRedirectRequest
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_recruiting_function_GetRedirectRequest(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  rfArgs.returnRequest = true;
  rfArgs.user = getUser(ixConnect.loginResult.user.id, ["ELOFULLNAME", "ELOMAILADDRESS"]);

  fun = sol.create("sol.recruiting.ix.functions.GetRedirectRequest", rfArgs);

  return JSON.stringify(fun.process());
}