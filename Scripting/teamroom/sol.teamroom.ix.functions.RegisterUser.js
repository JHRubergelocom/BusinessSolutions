importPackage(Packages.de.elo.utils);
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
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
sol.define("sol.teamroom.ix.functions.RegisterUser", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.teamroom.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _params: { jsonFromProp: "paramStr", forTemplating: false, template: true },
    _connection: { config: "teamroom", prop: "entities.connection", template: true },
    _config: { config: "teamroom", prop: "entities.user.functions.registerUser", template: true }
  },

  checkExistingUser: function (eloUser, user) {
    var me = this, mail = eloUser.userProps[UserInfoC.PROP_NAME_EMAIL];

    if (mail && mail.equalsIgnoreCase(user.mail)) {
      me.logger.info("mail exists: " + mail);
      return msg(true, 200, "EXISTING_WITH_SAME_MAIL", user, String(eloUser.getName()));
    } else {
      return msg(true, 200, "EXISTING_WITH_SAME_NAME", user, String(eloUser.getName()));
    }
  },

  findUser: function (user) {
    var me = this;
    try {
      return me.checkExistingUser(ixConnectAdmin.ix().checkoutUser(user.mail, CheckoutUsersC.BY_IDS, LockC.NO), user);
    } catch (e) {
      me.logger.info("user not found by mail");
    }
    try {
      return me.checkExistingUser(ixConnectAdmin.ix().checkoutUser(user.name, CheckoutUsersC.BY_IDS, LockC.NO), user);
    } catch (e) {
      me.logger.info("user not found by name");
    }
  },

  generateRandomPassword: function () {
    var array = new java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 7);
    new java.util.Random().nextBytes(array);
    return String(array, java.nio.charset.Charset.forName("UTF-8"));
  },

  createNewUser: function (user, tgtGroup) {
    var me = this, trmGroup = ixConnectAdmin.ix().checkoutUser("Teamroom Members", CheckoutUsersC.BY_IDS, LockC.NO),
        newUser = ixConnectAdmin.ix().createUser(null),
        groupsOfUser = newUser.groupList || [],
        newGroups = [], javaArr, i;

    log.info("new user guid: " + newUser.guid);
    newUser.setName(user.name);
    newUser.userProps[UserInfoC.PROP_NAME_EMAIL] = user.mail;

    for (i = 0; i < groupsOfUser.length; i++) {
      newGroups.push(groupsOfUser[i]);
    }
    newGroups.push(tgtGroup, trmGroup.id);

    javaArr = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, newGroups.length);
    for (i = 0; i < newGroups.length; i += 1) {
      javaArr[i] = newGroups[i];
    }

    newUser.groupList = javaArr;
    newUser.setPwd(me.generateRandomPassword());

    ixConnectAdmin.ix().checkinUsers([newUser], CheckinUsersC.NEW_USER, LockC.YES);

    log.info("new user created!");
  },

  createRegistrationMessage: function (user) {
    var me = this, sord, objId, guid;
    me.logger.info("creating registration entry...");

    objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me._config.registrationTemplate,
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: user.name,
      useQuickCopy: true,
      acl: {
        mode: "ADD",
        entries: [
          { userName: "$CURRENTUSER", rights: { r: true, w: true, d: true, e: true, l: true, p: true } }
        ]
      }
    });

    sord = ixConnect.ix().checkoutSord(objId, EditInfoC.mbSord, LockC.NO).sord;
    sord.setXDateIso(ISODate.nowUTC());
    guid = String(sord.guid);
    ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);

    sol.common.IxUtils.execute("RF_sol_function_Set", {
      objId: objId,
      entries: [
        { key: "ELO_ACCOUNT_MAIL", type: "GRP", value: user.mail },
        { key: "ELOTR_ACCOUNT_USERNAME", type: "GRP", value: user.name },
        { key: "ELO_ACCOUNT_STATUS", type: "GRP", value: "accepted" },
        { key: "ELO_APPS_FOLDER", type: "MAP", value: GUID.APPS_FOLDER },
        { key: "ELO_WF_URL", type: "MAP", value: me._config.wf.baseUrl + me._config.wf.registrationApp + "&guid=" + guid }
      ]
    });

    sol.common.WfUtils.startWorkflow(me._config.workflow.wfName, me._config.workflow.wfTitle, objId);
    return { success: true };
  },

  process: function () {
    var me = this, params = me._params, mode = params.mode,
        room = params.room, system = params.system,
        user = params.user || {}, role = user.role,
        name = user.name, mail = user.mail, groups;

    if (mode == "register") {
      return (!(room && system && user && role) && msg(false, 400, "Wrong input", params))
      || (!~["admin", "member", "guest"].indexOf(role) && msg(false, 400, "The user has an unknown role", user))
      || (!sol.teamroom.Utils.checkIfAdmin(me.ec, (groups = sol.teamroom.Utils.getRoleGroups(system, role))[0])
          && msg(false, 401, "Current user could not be found in admin group of given room."))
      || (!name && msg(false, 400, "The user has an empty name.", user))
      || (!mail && msg(false, 400, "The user has an empty mail.", user))
      || me.findUser(user)
      || (me.createNewUser(user, groups[groups.length > 1 ? 1 : 0].id), me.createRegistrationMessage(user));
    } else if (mode == "sendregistration") {
      return ((params.apiToken !== me._connection.API_TOKEN) && msg(false, 401, "Wrong api token sent."))
      || (!name && msg(false, 400, "The user has an empty name.", user))
      || (!mail && msg(false, 400, "The user has an empty mail.", user))
      || me.createRegistrationMessage(user);
    } else {
      throw "Mode " + mode + " not supported";
    }
  }
});

/**
 * @member sol.teamroom.ix.functions.RegisterUser
 * @method RF_sol_teamroom_function_RegisterUser
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_FunctionBaseName
 */
function RF_sol_teamroom_function_RegisterUser(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.teamroom.ix.functions.RegisterUser" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  rfParams.paramStr = sol.common.JsonUtils.stringifyQuick(rfParams);
  rfParams.ec = iXSEContext;

  result = sol.common.JsonUtils.stringifyQuick(
    sol.create("sol.teamroom.ix.functions.RegisterUser", rfParams).process()
  );

  logger.info("Result RegisterUser:" + result);
  logger.exit("sol.teamroom.ix.functions.RegisterUser");
  return result;
}

function functionAdapter(ec, args, mode) {
  args.mode = mode;
  return RF_sol_teamroom_function_RegisterUser(ec, sol.common.JsonUtils.stringifyQuick(args));
}

function msg(success, code, message, input, existing) {
  return { success: success, code: code, message: message, input: input, existing: existing };
}

function RF_TR_createRegistrationEntry(ec, args) {
  return functionAdapter(ec, JSON.parse(args) || {}, "sendregistration");
}

function RF_TR_registerUser(ec, args) {
  return functionAdapter(ec, JSON.parse(args) || {}, "register");
}