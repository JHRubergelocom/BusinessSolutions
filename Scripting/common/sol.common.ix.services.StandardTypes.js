
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.StandardTypes" });

/**
 * Standardized implementation for a types/templates service.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.StandardTypes", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * description texts are cut at this length.
   */
  maxDescLength: 70,

  /**
   * @cfg {Object} shortenDesc (optional) Description text will be limited to 70 characters.
   * @cfg {Object} $types (optional) Configuration to retrieve the types for selection in the client.
   * @cfg {String} $types.path The path containing the templates. If `$types` is defined, this is mandatory.
   */

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Performes the checks and retrieves the data as spezified in the configuration.
   * @returns {Object}
   */
  process: function () {
    var me = this;

    me.collectTypes();

    // TODO filtering

    return me._types;
  },

  /**
   * Collects the types and stores them to `_types`.
   */
  collectTypes: function () {
    var me = this,
      types;

    if (me.$types) {
      if (!me.$types.path) {
        throw "IllegalArgumentException: to retrieve types at least a 'path' has to be defined";
      }

      types = me.retrieveAllTypes();
      me._types = me.convertTypes(types);
    }
  },

  /**
   * @private
   * Retrieves all type Sord objects.
   * @returns {de.elo.ix.client.Sord[]}
   */
  retrieveAllTypes: function () {
    var me = this,
      searchConf, types;

    searchConf = {
      includeFolders: me.$types.includeFolders || true,
      includeDocuments: me.$types.includeDocuments || false,
      includeReferences: me.$types.includeReferences || true,
      sordZ: SordC.mbAllIndex
    };

    types = sol.common.RepoUtils.findChildren(me.$types.path, searchConf);

    return types;
  },

  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord[]} typeSords
   * @returns {Object[]}
   */
  convertTypes: function (typeSords) {
    var me = this;

    return sol.common.ObjectUtils.isArray(typeSords)
      ? typeSords.map(function (typeSord) {
        return me.convertType(typeSord);
      })
      : [];
  },

  /**
   * @private
   * Converts from Sords to Objects
   * @param {de.elo.ix.client.Sord} typeSord
   * @returns {Object}
   */
  convertType: function (typeSord) {
    var me = this;
    formattedSord = sol.common.ObjectFormatter.format({
      sord: {
        formatter: 'sol.common.ObjectFormatter.TemplateSord',
        data: typeSord
      }
    }).sord;

    // In the beginning we had only objId, name and desc.
    // Later we added the whole formatted TemplateSord. We're keeping those
    // three properties to keep it compatible with old ActionDefinitions
    formattedSord.objId = typeSord.id;
    formattedSord.name = typeSord.name;
    formattedSord.desc = me.getConvertedDescription(typeSord.desc + "");

    return formattedSord;
  },

  /**
   * @private
   * Converts a description
   * @param {String} description
   * @returns {String}
   */
  getConvertedDescription: function (description) {
    var me = this;

    return me.shouldShortenDescription(description)
      ? me.shortDescription(description)
      : description;
  },

  /**
   * @private
   * Determines if a description should be shorten
   * @param {StringLike} description
   * @returns {Boolean}
   */
  shouldShortenDescription: function (description) {
    var me = this;

    return me.shortenDesc && (description || "").length > me.maxDescLength;
  },

  /**
   * @private
   * shorts a description
   * @param {StringLike} description
   * @returns {String}
   */
  shortDescription: function (description) {
    var me = this;

    return (description || "").substr(0, me.maxDescLength - 3) + "...";
  }
});




/**
 * @member sol.common.ix.services.StandardTypes
 * @method RF_sol_common_service_StandardTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_StandardTypes(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_common_service_StandardTypes", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.common.ix.services.StandardTypes", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_common_service_StandardTypes", result);

  return result;
}
