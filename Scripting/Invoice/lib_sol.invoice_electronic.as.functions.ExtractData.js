/**
 * Electronic invoice extraction
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
 * Node configuration example:
 *
 *     {
 *       "$directRule": "sol.invoice_electronic.ExtractData",
 *       "statusFieldName": "INVOICE_DATACOLLECTION",
 *       "timestampMapFieldName": "ZUGFERD_IMPORTED"
 *     }
 */
sol.define("sol.invoice_electronic.as.functions.ExtractData", {
  extend: "sol.common.as.FunctionBase",

  requiredProperty: ["objId"],

  pilcrow: "\u00b6",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  /**
   * @cfg {Boolean} exportXml
   * Export the Zugferd XML file for debugging purposes
   */

  /**
   * @cfg {Boolean} xmlFilePath
   * Zugferd XML file path. The XML file is used instead of the embedded Zugferd XML file. For debugging purposes.
   */

  /**
   * Process the electronic invoice extraction
   * Extract the invoice XML file from document, start standard xml import, customize numerical values, discount calculation
   * @return {Object}
   */
  process: function () {
    var me = this,
        exceptionString = "",
        sord, children, idx, importConfig, xmlImporter, mapEntries, exportFile, tempDir,
        electronicInvoiceType, importConfigPath, nowIso, postProcessingClassNames,
        i, postProcessingClassName, postProcessingClass;

    sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;

    me.electronicInvoiceConfig = sol.create("sol.common.Config", { compose: "/invoice_electronic/Configuration/invoice.electronic.config" }).config;

    tempDir = sol.common.FileUtils.createTempDir({ prefix: "electronic_invoice" });

    if (me.xmlFilePath) {
      me.logger.info(["Use XML from file: {0}", me.xmlFilePath]);
    } else if (sol.common.SordUtils.isFolder(sord)) {
      children = sol.common.RepoUtils.findChildren(sord.id);
      for (idx in children) {
        if (sol.common.SordUtils.isDocument(children[idx])) {
          me.xmlFilePath = me.getInvoiceXmlFilePath(tempDir, children[idx]);
          if (me.xmlFilePath) {
            break;
          }
        }
      }
    } else {
      me.xmlFilePath = me.getInvoiceXmlFilePath(tempDir, sord);
    }

    if (me.exportXml && me.xmlFilePath) {
      exportFile = new java.io.File(sol.common.FileUtils.getTempDirPath() + java.io.File.separator + "electronic_invoice_" + sol.common.FileUtils.getTimeStampString() + ".xml");
      Packages.org.apache.commons.io.FileUtils.copyFile(new java.io.File(me.xmlFilePath), exportFile);
      me.logger.info(["XML file exported: {0}", exportFile.canonicalPath]);
    }

    if (me.xmlFilePath) {
      EM_WRITE_CHANGED = false;

      try {
        electronicInvoiceType = me.getElectronicInvoiceType(me.xmlFilePath);
      } catch (ex) {
        exceptionString = sol.common.ExceptionUtils.parseException(ex);
        me.logger.info(["Error determinating electronic invoice type: sord.id={0}, sord.name={1}, xmlFile={2}, exception={3}", sord.id, sord.name, me.xmlFilePath, exceptionString]);
        if (me.throwParseExceptions) {
          throw ex;
        }
      }

      if (!electronicInvoiceType) {
        return { passOn: true };
      }

      importConfigPath = me.pilcrow + "invoice_electronic" + me.pilcrow + "Configuration" + me.pilcrow + "Electronic invoice types" + me.pilcrow + electronicInvoiceType;
      me.logger.debug("Load electronic invoice config: " + importConfigPath);
      importConfig = sol.create("sol.common.Config", { compose: importConfigPath, forceReload: me.forceConfigReload }).config;

      if (!importConfig) {
        me.logger.warn("Can't find electronic invoice configuration: " + importConfigPath);
        return { passOn: true };
      }

      importConfig.clearValues = me.clearValues;

      try {
        xmlImporter = sol.create("sol.connector_xml.Importer", importConfig);
        xmlImporter.process(new File(me.xmlFilePath), me.objId);
      } catch (ex) {
        exceptionString = sol.common.ExceptionUtils.parseException(ex);
        me.logger.info(["Error extracting invoice data: sord.id={0}, sord.name={1}, xmlFile={2}, exception={3}", sord.id, sord.name, me.xmlFilePath, exceptionString]);
        if (me.throwParseExceptions) {
          throw ex;
        }
      }

      me.logger.info(["xmlImporter.process(new File(xmlFile), me.objId) executed: sord.id={0}, sord.name={1}, xmlFile={2}", sord.id, sord.name, me.xmlFilePath]);

      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

      postProcessingClassNames = importConfig.postProcessing || [];

      for (i = 0; i < postProcessingClassNames.length; i++) {
        postProcessingClassName = postProcessingClassNames[i];
        postProcessingClass = sol.create(postProcessingClassName, {});
        me.logger.debug(["Call post processing method: {0}.process(sord)", postProcessingClassName]);
        postProcessingClass.process(sord);
      }

      nowIso = sol.common.DateUtils.nowIso();

      mapEntries = sol.common.SordUtils.updateSord(sord, [{
        type: "GRP",
        key: me.statusFieldName || "INVOICE_DATACOLLECTION",
        value: electronicInvoiceType
      }, {
        type: "MAP",
        key: me.timestampMapFieldName || "ELECTRONIC_INVOICE_IMPORTED",
        value: nowIso
      }]);

      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
      if (mapEntries) {
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, mapEntries, LockC.NO);
      }
    }

    Packages.org.apache.commons.io.FileUtils.deleteQuietly(tempDir);

    return { passOn: true };
  },

  /**
   * Returns the invoice XML file path
   * @param  {java.io.File} tempDir Temp directory
   * @param  {Object} sord of current invoice represented by de.elo.ix.client.Sord
   * @return {String} content of zugferd XML file when successful, else null
   */
  getInvoiceXmlFilePath: function (tempDir, sord) {
    var me = this,
        result = false,
        xmlString = "",
        exceptionString = "",
        language, file, filePath, extension, xmlFilePath;

    me.logger.enter("getInvoiceXmlFilePath");

    language = ixConnect.loginResult.clientInfo.language;

    file = sol.common.FileUtils.downloadDocument(sord.id, tempDir.canonicalPath);

    filePath = file.canonicalPath;

    extension = (sol.common.FileUtils.getExtension(file) + "").toLowerCase();

    if (extension == "xml") {
      return filePath;
    }

    if (extension == "pdf") {
      xmlFilePath = filePath + ".xml";

      try {
        result = Packages.de.elo.mover.main.Utils.splitZugferd(filePath, xmlFilePath);
      } catch (ex) {
        exceptionString = sol.common.ExceptionUtils.parseException(ex);
      }
      if (result && sol.common.FileUtils.exists(xmlFilePath)) {
        xmlString = sol.common.FileUtils.readFileToString(xmlFilePath);
      } else {
        xmlFilePath = "";
        xmlString = "";
      }

      me.logger.debug(["pdfFilePath={0}", filePath]);
      me.logger.debug(["xmlFilePath={0}", xmlFilePath]);

      me.logger.info(["Extract electronic invoice XML: sord.name={0}, result={1}, language={2}, exception={3}", sord.name, result, language, exceptionString]);
      me.logger.debug(["xml={0}", xmlString]);

      me.logger.exit("getInvoiceXmlFilePath");
      return xmlFilePath;
    }
  },

  /**
   * Returns the electronic invoice type
   * @param {String} xmlPath XML path
   * @return {String} Electronic invoice type
   */
  getElectronicInvoiceType: function (xmlPath) {
    var me = this,
        xmlDocWithNamespaces, xmlDoc, xmlBuilder, electronicInvoiceTypes, i, electronicInvoiceType, documentElementNamespaceUri, electronicInvoiceTypeId,
        xpathResult;

    xmlDocWithNamespaces = sol.common.XmlUtils.readXmlFile(xmlPath, { namespaceAware: true });
    xmlBuilder = sol.create("sol.common.XmlBuilder", {
      xmlDoc: xmlDocWithNamespaces
    });

    documentElementNamespaceUri = xmlBuilder.getNamespaceUri();

    me.logger.debug(["documentElementNamespaceUri={0}", documentElementNamespaceUri]);

    if (!documentElementNamespaceUri) {
      return;
    }

    xmlDoc = sol.common.XmlUtils.readXmlFile(xmlPath);

    electronicInvoiceTypes = me.electronicInvoiceConfig.electronicInvoiceTypes;

    for (i = 0; i < electronicInvoiceTypes.length; i++) {
      electronicInvoiceType = electronicInvoiceTypes[i];
      if (electronicInvoiceType.documentElementNamespaceUri == documentElementNamespaceUri) {
        electronicInvoiceTypeId = electronicInvoiceType.id;
        xpathResult = me.checkXpaths(xmlDoc, electronicInvoiceType.xpathChecks);
        if (xpathResult) {
          break;
        }
      }
    }

    me.logger.debug(["electronicInvoiceType={0}, documentElementNamespaceUri={1}, xpathChecks=", electronicInvoiceTypeId || "undefined", documentElementNamespaceUri, electronicInvoiceType.xpathChecks || ""]);

    return electronicInvoiceTypeId;
  },

  checkXpaths: function (xmlDoc, xpathChecks) {
    var i, xpathCheck, xpath, result;

    if (!xpathChecks) {
      return true;
    }

    for (i = 0; i < xpathChecks.length; i++) {
      xpathCheck = xpathChecks[i];

      xpath = javax.xml.xpath.XPathFactory.newInstance().newXPath().compile(xpathCheck);
      result = xpath.evaluate(xmlDoc, javax.xml.xpath.XPathConstants.BOOLEAN);

      if (result == java.lang.Boolean.FALSE) {
        return false;
      }
    }

    return true;
  }
});

sol.define("sol.invoice_electronic.as.normalizeNumberBase", {

  prepareValue: function (value) {
    var me = this;

    value = (value || "") + "";
    value = value.trim();
    value = me.removeThousandSeparators(value);

    return value;
  },

  removeThousandSeparators: function (stringValue) {
    var thousandsep;

    stringValue = (stringValue || "") + "";
    thousandsep = stringValue.match(/(\D)(\d{3}\D)/);
    if (thousandsep) {
      stringValue = stringValue.replaceAll(thousandsep[1], "");
    }
  
    return stringValue;
  }
});

sol.define("sol.invoice_electronic.as.normalizeMapNumber", {
  extend: "sol.invoice_electronic.as.normalizeNumberBase",
  singleton: true,

  convert: function (value, config) {
    var me = this;

    value = me.prepareValue(value);

    if (value.match(/^-?\d+.\d+$/)) {
      value = String(value).replace(".", ",");
    }
    return value;
  }
});

sol.connector_xml.Converter.register("normalizeMapNumber", sol.invoice_electronic.as.normalizeMapNumber);

sol.define("sol.invoice_electronic.as.normalizeGrpNumber", {
  extend: "sol.invoice_electronic.as.normalizeNumberBase",
  singleton: true,

  convert: function (value, config) {
    var me = this;

    value = me.prepareValue(value);

    value = sol.common.SordUtils.normalizeNumber(value);
    return value;
  }
});

sol.connector_xml.Converter.register("normalizeGrpNumber", sol.invoice_electronic.as.normalizeGrpNumber);


sol.define("sol.invoice_electronic.as.decodeUriComponent", {
  singleton: true,

  convert: function (value, config) {
    value = decodeURIComponent(escape(value));
    return value;
  }
});

sol.connector_xml.Converter.register("decodeUriComponent", sol.invoice_electronic.as.decodeUriComponent);

