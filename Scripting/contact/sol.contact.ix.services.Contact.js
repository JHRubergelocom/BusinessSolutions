
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contact.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.contact.ix.services.Contact" });

/**
 * Retrieves available contact types.
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
 * @requires sol.common.IxUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.contact.Utils
 */
sol.define("sol.contact.ix.services.GetContactTypes", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object} filter (optional) Additional filters which can be applied to the results
   * @cfg {Boolean} filter.ignorePermissions (optional) If set, all available contact types will be returned ignoring the user permissions (will only work in ELOix and ELOas)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.contact.Utils.loadConfig();
  },

  /**
   * Retrieves the data as spezified in the constructor configuration.
   * @returns {String[]} Array with contact types
   */
  process: function () {
    var me = this,
        contactTemplates;

    contactTemplates = me.getAllTemplates();

    return me.convert(contactTemplates);
  },

  /**
   * @private
   * Retrieves all template Sord objects.
   * @returns {de.elo.ix.client.Sord[]}
   */
  getAllTemplates: function () {
    var me = this,
        conn = (me.filter && (me.filter.ignorePermissions === true) && ixConnectAdmin) ? ixConnectAdmin : ixConnect,
        path = me.config.contact.templateFolderId,
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
 * Creates a contact.
 *
 * # As IX function call
 * Example with some data to create the new contact.
 *
 *     sol.common.IxUtils.execute('RF_sol_contact_service_CreateContact', {
 *       contactType: "Default",
 *       data: [
 *         { type: "SORD", key: "name", value: "TMP_SERVICE" },
 *         { type: "GRP", key: "CONTACTLIST_REFERENCE", value: "CCL000000319" },
 *         { type: "GRP", key: "COMPANY_REFERENCE", value: "CCOM000000179" },
 *         { type: "GRP", key: "CONTACT_FIRSTNAME", value: "Max" },
 *         { type: "GRP", key: "CONTACT_LASTNAME", value: "Mustermann" }
 *       ]
 *     });
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |contact.templateFolderId|Base path of the contact templates|
 * |contact.createWorkflowNameTemplate|Name template for the workflow (in handlebars syntax)|
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.002
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.contact.Utils
 */
sol.define("sol.contact.ix.services.CreateContact", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["ci", "user", "contactType"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    if (!me.data && !me.sordMetadata) {
      throw "Either 'data' or 'sordMetadata' property has to be defined";
    }

    if (!me.data && me.sordMetadata) {
      if (!me.sordMetadata.objKeys || (!me.sordMetadata.objKeys.CONTACTLIST_REFERENCE && !me.sordMetadata.objKeys.COMPANY_REFERENCE)) {
        throw "No contactlist or company reference defined";
      }

      me.data = sol.contact.Utils.mapData(me.sordMetadata);
    }

  },

  /**
   * Creates a new contact and starts a workflow.
   * @return {Object} Result contains `objId` of the new element and `name` of the new element
   */
  process: function () {
    var me = this,
        result;

    try {
      result = sol.contact.Utils.createContact(me.contactType, { owner: me.user, fromService: true });

      me.prefillMetadata(result.objId);

      sol.common.WfUtils.startMaskStandardWorkflow(result.objId, { name: result.name, field: "STANDARD_WORKFLOW" });

      result.reference = sol.contact.Utils.getContactReference(result.objId);

      return result;
    } catch (ex) {
      me.logger.error("error creating new contact", ex);
      if (result && result.objId) {
        sol.common.IxUtils.execute("RF_sol_function_Delete", { objId: result.objId, deleteFinally: true });
      }
    }
  }

});


/**
 * @member sol.contact.ix.services.GetContactTypes
 * @method RF_sol_contact_service_GetContactTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contact_service_GetContactTypes(iXSEContext, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_contact_service_GetContactTypes", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  service = sol.create("sol.contact.ix.services.GetContactTypes", config);
  result = rfUtils.stringify(service.process());

  logger.exit("RF_sol_contact_service_GetContactTypes", result);

  return result;
}

/**
 * @member sol.contact.ix.services.CreateContact
 * @method RF_sol_contact_service_CreateContact
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contact_service_CreateContact(ec, args) {
  var rfUtils, config, service, result;

  logger.enter("RF_sol_contact_service_CreateContact", args);

  rfUtils = sol.common.ix.RfUtils;
  config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "contactType");

  config.ci = ec.ci;
  config.user = ec.user;

  service = sol.create("sol.contact.ix.services.CreateContact", config);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_contact_service_CreateContact", result);

  return result;
}
