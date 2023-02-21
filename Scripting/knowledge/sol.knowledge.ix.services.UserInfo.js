
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.BadgesUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.UserInfo" });

/**
 * Provides service function for Get/Set UserInfo.
 *
 * # Get/Set UserInfo
 *
 *    sol.common.IxUtils.execute("RF_sol_knowledge_service_UserInfo_Get", {
 *     // pass the name, GUID or ID of the user
 *     user: "Nils Mosbach"
 *   });
 *
 *   sol.common.IxUtils.execute("RF_sol_knowledge_service_UserInfo_Set", {
 *     // pass the name, GUID or ID of the user
 *     user: "Nils Mosbach",
 *     fields: { jobTitle: "CEO“,
 *               department: "Business Solution",
 *               company: "ELO“ }
 *   });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.01.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.UserUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.BadgesUtils
 */
sol.define("sol.knowledge.ix.services.UserInfo", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["user"],

  /**
   * @cfg {String} user (required) The user for which the data should be changed.
   */

  /**
   * @cfg {Object} fields (optional) The attributes that should be set.
   * @cfg {String} fields.jobTitle (optional)
   * @cfg {String} fields.department (optional)
   * @cfg {String} fields.company (optional)
   */

  /** 
   * @cfg {String} lang (opional) 
   * If set with a language abbreviation, that language will be used. The login language is the default.
   * The length has to be 2.
   */

  /**
   * @property
   * @private
   */
  TYPES: {
    user: "user",
    group: "group"
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.userInfo = sol.common.UserUtils.getUserInfo(me.user);
    me.userFolder = sol.common.UserUtils.getUserFolder(me.user);
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {Object} JSON-Object with Post/Reply
   */
  getUserInfo: function () {
    var me = this,
        user = {},
        result;

    me._lang = ixConnect.loginResult.clientInfo.language;
    if (me.lang && (me.lang.length === 2)) {
      ixConnect.loginResult.clientInfo.language = me.lang;
    }
    
    sol.common.TranslateTerms.require("sol.knowledge");

    user.name = (me.userFolder.name || "") + "";
    user.id = (typeof me.userInfo.id !== "undefined") ? String(me.userInfo.id) : "";
    user.guid = (me.userInfo.guid || "") + "";
    user.email = (me.userInfo.userProps[UserInfoC.PROP_NAME_EMAIL] || "") + "";
    user.jobTitle = (sol.common.SordUtils.getObjKeyValue(me.userFolder, "ELOUSERPOSITION") || "") + "";
    user.department = (sol.common.SordUtils.getObjKeyValue(me.userFolder, "ELODEPARTMENT") || "") + "";
    user.company = (sol.common.SordUtils.getObjKeyValue(me.userFolder, "ELOCOMPANY") || "") + "";
    user.reputation = (sol.common.SordUtils.getObjKeyValueAsNumber(me.userFolder, "REPUTATION") || "") + "";
    user.type = me.getType() + "";
    user.badges = me.getBadges();

    ixConnect.loginResult.clientInfo.language = me._lang;

    result = { success: true, user: user };

    return result;
  },

  /**
   * Set the data as spezified in the field configuration.
   * @returns {Object}
   */
  setUserInfo: function () {
    var me = this,
        fields = me.fields,
        result;

    try {
      if (fields) {
        if (fields.jobTitle) {
          sol.common.SordUtils.setObjKeyValue(me.userFolder, "ELOUSERPOSITION", fields.jobTitle);
        }
        if (fields.department) {
          sol.common.SordUtils.setObjKeyValue(me.userFolder, "ELODEPARTMENT", fields.department);
        }
        if (fields.company) {
          sol.common.SordUtils.setObjKeyValue(me.userFolder, "ELOCOMPANY", fields.company);
        }
        ixConnect.ix().checkinSord(me.userFolder, SordC.mbAllIndex, LockC.NO);
        result = { success: true };
      }
    } catch (e) {
      result = { success: false };
    }
    return result;
  },

  /**
   * @private
   * @return {String}
   */
  getType: function () {
    var me = this;

    if (me.userInfo.type == UserInfoC.TYPE_USER) {
      return me.TYPES.user;
    }

    if (me.userInfo.type == UserInfoC.TYPE_GROUP) {
      return me.TYPES.group;
    }
    return "";
  },

  /**
   * @private
   * @return {Object[]}
   */
  getBadges: function () {
    var me = this,
        userBadges = [],
        categoryBadge, categoryBadges, badges, badge, i, j, separatorPos, category, type;

    categoryBadges = sol.knowledge.ix.BadgesUtils.getCategoryBadges();
    badges = sol.common.SordUtils.getObjKeyValues(me.userFolder, "BADGES");
    if (badges) {
      for (i = 0; i < badges.length; i++) {
        badge = badges[i] + "";
        separatorPos = badge.lastIndexOf("_");
        if (separatorPos > -1) {
          category = badge.substring(0, separatorPos);
          type = badge.substring(separatorPos + 1);
          for (j = 0; j < categoryBadges.length; j++) {
            categoryBadge = categoryBadges[j];
            if (category == categoryBadge.category) {
              if (type == categoryBadge.type) {
                userBadges.push(categoryBadge);
              }
            }
          }
        }
      }
    }
    return userBadges;
  }

});

/**
 * @member sol.knowledge.ix.services.UserInfo
 * @method RF_sol_knowledge_service_UserInfo_Get
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_UserInfo_Get(iXSEContext, args) {
  var config, service, result;

  logger.enter("RF_sol_knowledge_service_UserInfo_Get", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "user");

  service = sol.create("sol.knowledge.ix.services.UserInfo", config);
  result = sol.common.ix.RfUtils.stringify(service.getUserInfo());

  logger.exit("RF_sol_knowledge_service_UserInfo_Get", result);
  return result;
}

/**
 * @member sol.knowledge.ix.services.UserInfo
 * @method RF_sol_knowledge_service_UserInfo_Set
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_UserInfo_Set(iXSEContext, args) {
  var config, service, result;

  logger.enter("RF_sol_knowledge_service_UserInfo_Set", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "user");

  service = sol.create("sol.knowledge.ix.services.UserInfo", config);
  result = sol.common.ix.RfUtils.stringify(service.setUserInfo());

  logger.exit("RF_sol_knowledge_service_UserInfo_Set", result);
  return result;
}

