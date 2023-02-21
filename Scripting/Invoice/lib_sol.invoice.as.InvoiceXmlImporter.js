
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Invoice XML Importer
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 *
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.as.Utils
 *
 */
sol.define("sol.invoice.as.InvoiceXmlImporter", {
  singleton: true,

  run: function () {
    var me = this,
        importerConfig, logger, invoiceConfig, importDestination, parentId, dir, xmlFiles, importer, result, i, xml;

    EM_WRITE_CHANGED = false;

    logger = sol.create("sol.Logger", { scope: "sol.invoice.as.InvoiceXmlImporter" }),
    invoiceConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.config" }).config,

    logger.enter("InvoiceXMLImporter");

    importDestination = sol.create("sol.common.Template", { source: invoiceConfig.importXML.importDestination.value }).apply();
    parentId = sol.common.RepoUtils.preparePath(importDestination);

    dir = new File(invoiceConfig.importXML.importDirectory.value);

    if (!dir || !(dir instanceof File) || !dir.exists() || !dir.isDirectory()) {
      throw "no valid directory import directory: " + dir;
    }

    xmlFiles = dir.listFiles(
      new FileFilter({
        accept: function (file) {
          return file.isFile() && file.name.toLowerCase().endsWith("xml");
        }
      })
    );

    logger.info(["found {0} files ... start importing", xmlFiles.length]);

    importerConfig = sol.create("sol.common.Config", { compose: "/invoice/Configuration/sol.invoice.InvoiceXmlImportConfig" }).config;
    importer = sol.create("sol.connector_xml.DocumentImporter", importerConfig);

    for (i = 0; i < xmlFiles.length; i++) {
      xml = xmlFiles[i];

      logger.info(["working on: {0}", xml]);

      if (importer.validate(xml)) {
        result = importer.process(xml, parentId);
      }

      if (result.containerId) {
        me.startInvoiceWorkflow(invoiceConfig, result.containerId);
      } else if (result && result.objIds && result.objIds.length > 0) {
        result.objIds.forEach(function (objId) {
          me.startInvoiceWorkflow(invoiceConfig, objId);
        });
      }
    }

    logger.exit("InvoiceXMLImporter");
  },

  /**
   * @private
   * Starts an invoice workflow
   * @param {Object} invoiceConfig Invoice configuration
   * @param {String} objId Object ID
   */
  startInvoiceWorkflow: function (invoiceConfig, objId) {
    var name;

    name = sol.create("sol.common.Template", { source: invoiceConfig.wfNamePattern.value }).applySord(objId);
    ixConnect.ix().startWorkFlow(invoiceConfig.wfTemplate.value, name, objId);
  }
});