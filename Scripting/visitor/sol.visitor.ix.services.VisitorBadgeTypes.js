
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.VisitorBadgeTypes" });

/**
 * Retrieves available visitor badge types.
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
sol.define("sol.visitor.ix.services.GetVisitorBadgeTypes", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available visitor badge types will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.visitor.Utils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with visitor badge types
   */
  process: function () {
    var me = this,
        visitorSord, solType, visitorBadgeTemplates;

    visitorSord = sol.common.RepoUtils.getSord(me.objId);
    solType = sol.common.SordUtils.getObjKeyValue(visitorSord, "SOL_TYPE");

    visitorBadgeTemplates = me.getAllTemplates(solType);

    return me.convert(visitorBadgeTemplates);
  },

  /**
   * @private
   * Retrieves all template Sord objects.
   * @param {String} solType Solution type
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllTemplates: function (solType) {
    var me = this,
        searchConf = {},
        path, conn;

    conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect;

    path = (solType == "LONG_TERM_BADGE") ? me.config.visitor.longtermbadge.templateFolderId : me.config.visitorBadge.templateFolderId;

    searchConf.includeFolders = false;
    searchConf.includeDocuments = true;
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
          objId: sord.id,
          name: sord.name,
          desc: sord.desc
        });
      });
    }
    return converted;
  }

});

/**
 * Checks the preconditions for creation of a visitor badge.
 *
 * This service uses the mask of the parent to determine if it is a valid location for the visitor badge.
 *
 * Returns an Object:
 *
 *     {
 *       valid: true,
 *       msg: "optional message"
 *     }
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.VISITORBADGE_TYPE|The existence of this field on a mask, marks the element as a valid target|
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
sol.define("sol.visitor.ix.services.CheckVisitorBadgePreconditions", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["ci", "targetId"],

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
   * Checks the preconditions for creating a visitor badge.
   * @returns {Object}
   */
  process: function () {
    var me = this,
        result = { valid: false },
        sord, typeService;

    try {
      sord = ixConnect.ix().checkoutSord(me.targetId, SordC.mbAllIndex, LockC.NO);
    } catch (ex) {
      me.logger.warn("invalid location for visitor badge", ex);
      result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.visitor.ix.services.VisitorBadge.errorNoElement");
      return result;
    }

    if (me.isValidDocument(sord)) {
      result.valid = true;

      // identify valid visitor types
      typeService = sol.create("sol.visitor.ix.services.GetVisitorBadgeTypes", { objId: me.targetId });
      result.types = typeService.process();
    } else {
      result.msg = sol.common.TranslateTerms.getTerm(me.ci, "sol.visitor.ix.services.VisitorBadge.errorInvalidLocation");
    }

    return result;
  },

  isValidDocument: function (sord) {
    return sol.visitor.Utils.isVisitor(sord);
  }

});


/**
 * @member sol.visitor.ix.services.GetVisitorBadgeTypes
 * @method RF_sol_visitor_service_GetVisitorBadgeTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_GetVisitorBadgeTypes(iXSEContext, args) {
  logger.enter("RF_sol_visitor_service_GetVisitorBadgeTypes", args);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      service, result;

  service = sol.create("sol.visitor.ix.services.GetVisitorBadgeTypes", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_visitor_service_GetVisitorBadgeTypes", result);
  return result;
}

/**
 * @member sol.visitor.ix.services.CheckVisitorBadgePreconditions
 * @method RF_sol_visitor_service_CheckVisitorBadgePreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_CheckVisitorBadgePreconditions(iXSEContext, args) {
  logger.enter("RF_sol_visitor_service_CheckVisitorBadgePreconditions", args);

  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "targetId"),
      service, result;

  config.ci = iXSEContext.ci;

  service = sol.create("sol.visitor.ix.services.CheckVisitorBadgePreconditions", config);
  result = rfUtils.stringify(service.process());
  logger.exit("RF_sol_visitor_service_CheckVisitorBadgePreconditions", result);
  return result;
}
