
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.connector_xml.Utils.js
//@include lib_sol.connector_xml.Converter.js
//@include lib_sol.connector_xml.Importer.js
//@include lib_sol.connector_xml.DocumentImporter.js
//@include lib_sol.connector_dx.DXUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.connector_dx.ix.services.DxImporter" });

/**
 * Imports Docx xmlFile.
 *
 * # As IX function call
 *
 *     sol.common.IxUtils.execute('RF_sol_connector_dx_service_DxImporter', {
 *       docClass: 'invoice',
 *       xmlContent: '<?xml version="1.0" encoding="UTF-8" standalone="no"?> ..'
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.connector_xml.Utils
 * @requires sol.connector_xml.Converter
 * @requires sol.connector_xml.Importer
 * @requires sol.connector_xml.DocumentImporter
 * @requires sol.connector_dx.DXUtils
 *
 */
sol.define("sol.connector_dx.ix.services.DxImporter", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["subsystem", "docClass", "objId", "xmlContent"],

  /**
   * @cfg {String} subsystem (required)
   * The subsystem to determine the path to the configuration
   */

  /**
   * @cfg {String} docClass (required)
   * Document Class to import
   * e.g. "invoice"
   */

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {String} xmlContent (required)
   * DocXtractor XML content
   */

  dataCollectionValue: "DocXtractor",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Imports DX content.
   */
  process: function () {
    var me = this,
        dxDocClassFieldName, dxConfig, docClassConfig, xmlImporter, sord;

    dxConfig = sol.connector_dx.DXUtils.getDxConfig(me.subsystem);
    dxDocClassFieldName = dxConfig.dxDocClassFieldName;

    docClassConfig = sol.connector_dx.DXUtils.getDxImportMapping(me.subsystem, me.docClass);

    xmlImporter = sol.create("sol.connector_xml.Importer", docClassConfig);
    xmlImporter.process(me.xmlContent, me.objId);

    sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;
    sol.common.SordUtils.setObjKeyValue(sord, dxDocClassFieldName, me.docClass);

    if (!dxConfig.dataCollectionFieldName) {
      throw "Data collection field name is empty";
    }

    sol.common.SordUtils.setObjKeyValue(sord, dxConfig.dataCollectionFieldName, me.dataCollectionValue);
    ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
  }
});

sol.define("sol.connector_dx.ix.normalizeMapNumber", {
  singleton: true,

  convert: function (value, config) {
    value = sol.common.StringUtils.replaceAll(value, " ", "");
    if (value.match(/^-?\d+.\d+$/)) {
      value = String(value).replace(".", ",");
    }
    return value;
  }
});

sol.connector_xml.Converter.register("normalizeMapNumber", sol.connector_dx.ix.normalizeMapNumber);

sol.define("sol.connector_dx.ix.normalizeGrpNumber", {
  singleton: true,

  convert: function (value, config) {
    value = sol.common.SordUtils.normalizeNumber(value);
    return value;
  }
});

sol.connector_xml.Converter.register("normalizeGrpNumber", sol.connector_dx.ix.normalizeGrpNumber);

/**
 * @member sol.connector_dx.ix.services.DxImporter
 * @method RF_sol_connector_dx_service_DxImporter
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_connector_dx_service_DxImporter(iXSEContext, args) {
  logger.enter("RF_sol_connector_dx_service_DxImporter", args);
  var params, module;

  logger.info("RF_sol_connector_dx_service_DxImporter: language=" + iXSEContext.ci.language);
  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "subsystem", "docClass", "objId", "xmlContent");
  module = sol.create("sol.connector_dx.ix.services.DxImporter", params);

  module.process();
  logger.exit("RF_sol_connector_dx_service_DxImporter");
  return sol.common.ix.RfUtils.stringify({ success: true });
}
