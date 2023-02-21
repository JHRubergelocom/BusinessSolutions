/**
 * Extract e-invoice test
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 *
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.FileUtils
 * @requires  sol.common.Config
 * @requires  sol.common.ExceptionUtils
 * @requires  sol.connector_xml.Importer
 *
 */
sol.define("sol.invoice_electronic.as.ExtractDataTest", {
  singleton: true,

  processSord: function () {
    var me = this,
        params = {};

    params = {
      objId: EM_ACT_SORD.id + "",
      forceConfigReload: true,
      clearValues: true
    };
    EM_PARAM2 = JSON.stringify(params);

    me.logger.info("Extract e-invoice data: sord.id=" + EM_ACT_SORD.id + ", sord.name=" + EM_ACT_SORD.name);
    sol.common.as.Utils.executeFunction("sol.invoice_electronic.as.functions.ExtractData", { throwParseExceptions: true });
  }
});
