
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.Visitor" });

/**
 * Retrieves available visitor types.
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |||
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 */
sol.define("sol.visitor.ix.services.GetVisitorTypes", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available visitor types will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.visitor.Utils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with visitor types
   */
  process: function () {
    var me = this,
        visitorTemplates;

    visitorTemplates = me.getAllTemplates();

    return me.convert(visitorTemplates);
  },

  /**
   * @private
   * Retrieves all template Sord objects.
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllTemplates: function () {
    var me = this,
        conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect,
        path = me.config.visitor.templateFolderId,
        searchConf = {};

    searchConf.includeFolders = true;
    searchConf.includeDocuments = false;
    searchConf.includeReferences = true;
    searchConf.sordZ = SordC.mbAllIndex;

    return sol.common.RepoUtils.findChildren(path, searchConf, conn);
  },

  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord[]} reportTemplateSords
   * @returns {Object[]}
   */
  convert: function (reportTemplateSords) {
    var converted = [];
    if (reportTemplateSords) {
      reportTemplateSords.forEach(function (sord) {
        converted.push({
          objId: sord.guid,
          name: sord.name,
          desc: sord.desc
        });
      });
    }
    return converted;
  }

});

/**
 * Checks the preconditions for creation of a visitor.
 *
 * This service uses the mask of the parent to determine if it is a valid location for the visitor.
 *
 * Returns an Object:
 *
 *     {
 *       valid: true,
 *       msg: "optional message"
 *       targetId: valid target
 *     }
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.FILE_TYPE|The existence of this field on a mask, marks the element as a valid target|
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.visitor.ix.services.CheckVisitorPreconditions", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["ci"],

  /**
   * @cfg {String} targetId (required)
   * ObjectId of the target folder
   */

  /**
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.visitor.Utils.loadConfig();
  },

  /**
   * Checks the preconditions for creating a visitor.
   * @returns {Object}
   */
  process: function () {
    var result = { valid: false },
        typeService;

    /**result.targetId = me.targetId;
    try {
      sord = ixConnect.ix().checkoutSord(result.targetId, SordC.mbAllIndex, LockC.NO);
    } catch (ex) {
      me.logger.warn("invalid location for visitor", ex);
      result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.visitor.ix.services.CreateVisitor.errorNoElement");
      return result;
    }**/

    //if (me.isValidLocation(sord)) {
    result.valid = true;

    // identify valid visitor types
    typeService = sol.create("sol.visitor.ix.services.GetVisitorTypes", {});
    result.types = typeService.process();

    //} else {
    //  result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.visitor.ix.services.CreateVisitor.errorInvalidLocation");
    //}

    return result;
  },

  /**
   * @private
   * Checks valid location for new visitor element
   * @param {de.elo.ix.client.Sord} sord
   * @returns {Boolean} if valid or not
   */
  isValidLocation: function (sord) {
    return ((sol.common.SordUtils.isFolder(sord) && !sol.visitor.Utils.getParentVisitor(sord.id)) || sord.id === 1);
  }

});

/**
 * Checks the preconditions for canceling a visitor registration.
 *
 * @author PZ, ELO Digital Office GmbH
 * @since 1.05.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 */
sol.define("sol.visitor.ix.services.CancelVisitorRegistrationPrecondition", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["userInfo"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.visitor.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        registrations,
        result = { valid: true };

    if (!me.targetId || !me.isVisitorRegistrationSelected()) {
      registrations = me.getVisitorRegistrations();
      if (registrations && (registrations.length > 0)) {
        result.types = registrations;
      }
    }

    return result;
  },

  isVisitorRegistrationSelected: function () {
    var me = this,
        visitorRegistrationSelected = false,
        visitorObjId, visitorSord, visitorStatusKey;

    visitorObjId = sol.common.RepoUtils.getValidParent(me.targetId, "SOL_TYPE", me.config.visitor.typeOfVisitors);

    if (visitorObjId != null) {
      visitorSord = sol.common.RepoUtils.getSord(visitorObjId);
      visitorStatusKey = sol.common.SordUtils.getLocalizedKwlKey(visitorSord, { type: "GRP", key: "VISITOR_STATUS" });
      if (visitorStatusKey == "PR") {
        visitorRegistrationSelected = true;
      }
    }

    return visitorRegistrationSelected;
  },

  isMemberOfGroup: function (registration) {
    var me = this, 
        sord;

    sord = ixConnect.ix().checkoutSord(registration.parentId, SordC.mbAllIndex, LockC.NO);
    return (sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") == me.config.visitor.solTypeVisitorGroup);
  },

  getTypeDescription: function (registration) {
    var me = this,
        sord;

    sord = ixConnect.ix().checkoutSord(registration.id, SordC.mbAllIndex, LockC.NO);
    if (sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") == me.config.visitor.solTypeVisitorGroup) {
      return sol.common.TranslateTerms.translate("sol.visitor.ix.actions.PreRegisterGroup.name");
    } else {
      return sol.common.TranslateTerms.translate("sol.visitor.ix.actions.PreRegisterVisitor.name");
    }
  },

  getVisitorRegistrations: function () {
    var me = this,
        registrationsSearchResult, registrations;

    registrationsSearchResult = sol.common.RepoUtils.findSords({
      objKeysObj: {
        SOL_TYPE: "\"" + me.config.visitor.typeOfVisitors.join("\" OR \"") + "\"",
        VISITOR_STATUS: "PR*"
      }
    });

    if (registrationsSearchResult && (registrationsSearchResult.length > 0)) {

      registrationsSearchResult = registrationsSearchResult.filter(function (registration) {
        return (((registration.ownerId == me.userInfo.id) || (sol.common.SordUtils.getObjKeyValue(registration, "VISITOR_RESPONSIBLEEMPLOYEE") == me.userInfo.name)) && !me.isMemberOfGroup(registration));
      });

    }

    if (registrationsSearchResult && (registrationsSearchResult.length > 0)) {
      registrations = registrationsSearchResult.map(function (registration) {
        return {
          objId: String(registration.id),
          name: registration.name,
          desc: me.getTypeDescription(registration)
        };
      });
    }

    return registrations;
  }

});


/**
 * @member sol.visitor.ix.services.GetVisitorTypes
 * @method RF_sol_visitor_service_GetVisitorTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_GetVisitorTypes(iXSEContext, args) {
  logger.enter("RF_sol_visitor_service_GetVisitorTypes", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service, result;

  service = sol.create("sol.visitor.ix.services.GetVisitorTypes", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_visitor_service_GetVisitorTypes", result);
  return result;
}

/**
 * @member sol.visitor.ix.services.CheckVisitorPreconditions
 * @method RF_sol_visitor_service_CheckVisitorPreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_CheckVisitorPreconditions(iXSEContext, args) {
  logger.enter("RF_sol_visitor_service_CheckVisitorPreconditions", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "targetId"),
      service, result;

  config.ci = iXSEContext.ci;

  service = sol.create("sol.visitor.ix.services.CheckVisitorPreconditions", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_visitor_service_CheckVisitorPreconditions", result);
  return result;
}

/**
 * @member sol.visitor.ix.services.CancelVisitorRegistrationPrecondition
 * @method RF_sol_visitor_service_CancelVisitorRegistrationPrecondition
 * @static
 * @inheritdoc sol.common.ix.ActionBase#RF_FunctionName
 */
function RF_sol_visitor_service_CancelVisitorRegistrationPrecondition(ec, args) {
  var config, service, result;
  logger.enter("RF_sol_visitor_service_CancelVisitorRegistrationPrecondition", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  config.userInfo = ec.user;

  service = sol.create("sol.visitor.ix.services.CancelVisitorRegistrationPrecondition", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_visitor_service_CancelVisitorRegistrationPrecondition", result);
  return result;
}
