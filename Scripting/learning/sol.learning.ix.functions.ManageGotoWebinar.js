
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
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
sol.define("sol.learning.ix.functions.ManageGotoWebinar", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.GoToWebinarConfiguration", "sol.common.mixins.Inject"],

  inject: {
    _findSessionConfig: { config: "gotowebinar", prop: "entities.enrollment.functions.managegotowebinar.enrollment.find.session" },
    _OAuthServiceUser: { config: "gotowebinar", prop: "entities.oauth.default.serviceUser" },
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", includeBlobs: true }
  },

  saveResultInSord: function (objId, setInstructions) {
    sol.common.IxUtils.execute("RF_sol_function_Set", { objId: objId, entries: setInstructions });
  },

  getAction: function (action, thrw) {
    if (!(action = String(action || ""))) {
      throw "action parameter must not be empty";
    }
    return action;
  },

  getUser: function (full) {
    return full
      ? ixConnect.loginResult.user
      : String(ixConnect.loginResult.user.id);
  },

  getCreateSessionData: function (session) {
    return {
      subject: session.objKeys.SESSION_NAME || "unnamed ELO webinar",
      description: session.formBlobs.SESSION_DESC || "no description for this ELO webinar",
      times: [
        {
          startTime: session.objKeys.SESSION_STARTTIME,
          endTime: session.mapKeys.SESSION_ENDTIME
        }
      ]
    };
  },

  getInstructionsFromSession: function (g2wSession) {
    return [
      { type: "MAP", key: "SESSION_G2W_ORGANIZERKEY", value: String(g2wSession.organizerKey || "") },
      { type: "MAP", key: "SESSION_G2W_WEBINARKEY", value: String(g2wSession.webinarKey || "") },
      { type: "MAP", key: "SESSION_G2W_REGISTRATIONURL", value: String(g2wSession.registrationUrl || "") }
    ];
  },

  getInstructionsFromEnrollment: function (g2wEnrollment) {
    return [
      { type: "MAP", key: "SESSION_G2W_JOINURL", value: String(g2wEnrollment.joinUrl || "") },
      { type: "MAP", key: "SESSION_G2W_ORGANIZERKEY", value: String(g2wEnrollment.organizerKey || "") },
      { type: "MAP", key: "SESSION_G2W_REGISTRANTKEY", value: String(g2wEnrollment.registrantKey || "") }
    ];
  },

  g2wCreateSession: function (params) {
    var me = this;
    me.logger.debug("Creating Session:", params);
    return sol.common.IxUtils.execute("RF_gotowebinar_CreateWebinar", params);
  },

  g2wUpdateSession: function (params) {
    var me = this;
    me.logger.debug("Updating Session:", params);
    return sol.common.IxUtils.execute("RF_gotowebinar_UpdateWebinar", params);
  },

  createSession: function (user) {
    var me = this, g2wSession;
    g2wSession = me.g2wCreateSession({
      user: user,
      data: me.getCreateSessionData(me.sord),
      originTimeZone: me.sord.mapKeys.SESSION_TIMEZONE || String(ixConnect.loginResult.clientInfo.timeZone)
    });
    if (g2wSession.webinarKey !== undefined) {
      me.saveResultInSord(me.objId, me.getInstructionsFromSession(g2wSession));
      return {
        webinarKey: String(g2wSession.webinarKey || ""),
        registrationUrl: String(g2wSession.registrationUrl || ""),
        organizerKey: String(g2wSession.organizerKey || "")
      };
    } else {
      return { error: "creating a webinar in gotowebinar failed!", data: g2wSession };
    }
  },

  getUserData: function (userName, fields) {
    var me = this,
        userSord = sol.common.UserUtils.getUserFolder(userName),
        userProps = ((sol.common.UserUtils.getUserInfo(userName) || {}).userProps || []),
        userData = {}, firstName, lastName, splitName, mail, fullName;
    userName = String(userName);
    if (fields && fields.length) {
      [].slice.call(userSord.objKeys)
        .forEach(function (objKey) {
          var key = String(objKey.name), value = String(objKey.data[0] || "");
          ~fields.indexOf(key) && (userData[key] = value);
        });
    }

    mail = String(userData.ELOMAILADDRESS || userProps[UserInfoC.PROP_NAME_EMAIL] || "").trim();

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

    firstName = me.sanitize(firstName);
    lastName = me.sanitize(lastName);

    if (!firstName || !lastName || !mail) {
      throw "Enrollment user `" + userName + "` has no (ELOFULLNAME or ELOMAILADDRESS) or username only contained invalid characters: (" + fullName + ", " + mail + ")";
    }

    return {
      firstName: firstName,
      lastName: lastName,
      email: mail
    };
  },

  // invalid characters according to gohiring
  sanitize: function (s) {
    return s.replace(/[:/%\+\*\$@\?;:\.]/g, "").replace(/  /g, "");
  },

  g2wRegisterEnrollment: function (params) {
    return sol.common.IxUtils.execute("RF_gotowebinar_RegisterEnrollment", params);
  },

  g2wDeleteEnrollment: function (params) {
    sol.common.IxUtils.execute("RF_gotowebinar_getRegistrants", JSON.parse(JSON.stringify(params))); // for debugging purposes
    return sol.common.IxUtils.execute("RF_gotowebinar_DeleteEnrollment", params);
  },

  findSession: function () {
    var me = this;
    me._findSessionConfig.search.push({ key: "SESSION_REFERENCE", value: me.sord.objKeys.SESSION_REFERENCE });
    return (sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._findSessionConfig, me._optimize, "session", ["output"]).sords[0] || {});
  },

  getWebinarKeys: function () {
    var me = this, session = me.findSession(), webinarKey, organizerKey;
    webinarKey = session.webinarKey;
    if (!(webinarKey = String(webinarKey || ""))) {
      throw "webinarKey not found in session sord with objId " + session.objId;
    }
    organizerKey = String(session.organizerKey || "");
    return { webinarKey: webinarKey, organizerKey: organizerKey };
  },

  getRegistrantKeys: function () {
    var me = this, session = me.findSession(), webinarKey = session.webinarKey, registrantKey, organizerKey;

    registrantKey = String(
      session.registrantKey
      || (me.sord && me.sord.mapKeys && me.sord.mapKeys.SESSION_G2W_REGISTRANTKEY)
      || ""
    );

    organizerKey = String(
      session.organizerKey
      || (me.sord && me.sord.mapKeys && me.sord.mapKeys.SESSION_G2W_ORGANIZERKEY)
      || ""
    );

    if (!(webinarKey = String(webinarKey || ""))) {
      throw "webinarKey not found in session sord with objId " + session.objId;
    }
    if (!registrantKey) {
      throw "registrantKey not found in session sord or enrollment with objId " + session.objId;
    }
    if (!organizerKey) {
      throw "organizerKey not found in session sord with objId " + session.objId;
    }

    return { registrantKey: registrantKey, webinarKey: webinarKey, organizerKey: organizerKey };
  },

  enrollInSession: function (user) {
    var me = this, registrationParams, g2wEnrollment, keys = me.getWebinarKeys();
    registrationParams = {
      user: me._OAuthServiceUser,
      webinarKey: keys.webinarKey,
      organizerKey: keys.organizerKey || undefined,
      data: me.getUserData(user, ["ELOFULLNAME", "ELOMAILADDRESS"])
    };
    g2wEnrollment = me.g2wRegisterEnrollment(registrationParams);
    if (g2wEnrollment.registrantKey !== undefined) {
      me.saveResultInSord(me.objId, me.getInstructionsFromEnrollment(g2wEnrollment));
    } else {
      return { error: "registering the enrollment for a webinar failed!", data: g2wEnrollment };
    }
  },

  cancelEnrollment: function (user) {
    var me = this, cancellationParams, g2wEnrollment, keys = me.getRegistrantKeys();
    cancellationParams = {
      user: me._OAuthServiceUser,
      webinarKey: keys.webinarKey,
      registrantKey: keys.registrantKey,
      organizerKey: keys.organizerKey,
      data: {}
    };

    g2wEnrollment = me.g2wDeleteEnrollment(cancellationParams);
    if (g2wEnrollment.result === true) {
      me.saveResultInSord(me.objId, me.getInstructionsFromEnrollment(g2wEnrollment));  // removes api data from sord
    } else {
      return { error: "canceling the enrollment failed!", data: g2wEnrollment };
    }
  },

  updateSession: function (sord) {
    var me = this;
    return me.g2wUpdateSession({
      user: me._OAuthServiceUser,
      webinarKey: sord.mapKeys.SESSION_G2W_WEBINARKEY,
      organizerKey: sord.mapKeys.SESSION_G2W_ORGANIZERKEY || undefined,
      notifyParticipants: false,
      data: me.getCreateSessionData(sord)
    });
  },

  process: function () {
    var me = this, action = me.getAction(me.action);
    return ((action === "create_session") && me.createSession(me.getUser()))
    || ((action === "update_session") && me.updateSession(me.sord))
    || ((action === "cancel") && me.cancelEnrollment(me.sord.objKeys.COURSE_ENROLLMENT_USER))
    || ((action === "enroll") && me.enrollInSession(me.sord.objKeys.COURSE_ENROLLMENT_USER))
    || { error: "no valid action defined!" };
  }
});

/**
 * @member sol.learning.ix.functions.ManageGotoWebinar
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.ManageGotoWebinar", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.ManageGotoWebinar
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.ManageGotoWebinar", params);

  fun.process();
}