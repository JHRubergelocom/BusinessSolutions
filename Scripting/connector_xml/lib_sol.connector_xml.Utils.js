
importPackage(Packages.java.io);
importPackage(Packages.java.utils);
importPackage(Packages.java.text);
importPackage(Packages.javax.xml);
importPackage(Packages.javax.xml.parsers);
importPackage(Packages.javax.xml.xpath);
importPackage(Packages.javax.xml.validation);
importPackage(Packages.javax.xml.transform.stream);
importPackage(Packages.org.xml.sax);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js

/**
 * Contains utility functions for the xml connector
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.FileUtils
 * @requires sol.connector_xml.Converter
 *
 */
sol.define("sol.connector_xml.Utils", {
  singleton: true,

  /**
   * Reads the converter from the configuration.
   * @param {Object} config The XML importer configuration.
   * @param {String} name The name of the converter to look for
   * @return {Object} The converter configuration
   */
  getConverterConfig: function (config, name) {
    var converter = config.converter,
        i;
    if (converter) {
      for (i = 0; i < converter.length; i++) {
        if (converter[i].name == name) {
          return converter[i];
        }
      }
    }
    return null;
  },

  /**
   * Creates a XSD validator from XSD files in the archive
   * @param {Array} xsdObjects An Array with XSD Objects containing the GUIDs
   * @return {javax.xml.validation.Validator}
   */
  createValidator: function (xsdObjects) {
    var xsdArray = [],
        factory, schema;

    xsdObjects.forEach(function (xsd) {
      var editInfo = ixConnect.ix().checkoutDoc(xsd.guid, null, EditInfoC.mbDocument, LockC.NO),
          docVersion = editInfo.document.docs[0],
          xsdInputStream = ixConnect.download(docVersion.url, 0, -1);
      xsdArray.push(new StreamSource(xsdInputStream));
    });

    factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI),
    schema = factory.newSchema(xsdArray);

    return schema.newValidator();
  },

  /**
   * Creates a new Document Builder
   * @return {javax.xml.parsers.DocumentBuilder}
   */
  getDocumentBuilder: function () {
    return DocumentBuilderFactory.newInstance().newDocumentBuilder();
  },

  /**
   * Parses a XML file.
   * @param {javax.xml.parsers.DocumentBuilder} documentBuilder
   * @param {java.io.File} xml
   * @return {org.w3c.dom.Document}
   */
  getDocument: function (documentBuilder, xml) {
    if (xml instanceof File) {
      return documentBuilder.parse(xml);
    } else {
      return documentBuilder.parse(new InputSource(new StringReader(xml)));
    }
  },

  /**
   * Converts a File to a StreamSource or a String to an InputStream
   * @param {java.io.File|java.lang.String} xml
   * @return {javax.xml.transform.stream.StreamSource|java.io.InputStream} If File -> StreamSource; if String -> InputStream
   */
  getStreamSource: function (xml) {
    if (xml instanceof File && xml.exists()) {
      return new StreamSource(new FileInputStream(xml));
    } else if (xml instanceof java.lang.String) {
      return new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8));
    }
    return null;
  },

  /**
   * Evaluates an XPath to a value
   * @param {org.xml.sax.InputSource} xmlDoc
   * @param {String} xPath
   * @return {java.lang.String}
   */
  getElementString: function (xmlDoc, xPath) {
    if (!(xPath instanceof XPathExpression)) {
      xPath = XPathFactory.newInstance().newXPath().compile(xPath);
    }
    return xPath.evaluate(xmlDoc, XPathConstants.STRING);
  },

  /**
   * Evaluates an XPath to a nodeset
   * @param {org.xml.sax.InputSource} xmlDoc
   * @param {String} xPath
   * @return {org.w3c.dom.NodeList}
   */
  getElements: function (xmlDoc, xPath) {
    if (!(xPath instanceof XPathExpression)) {
      xPath = XPathFactory.newInstance().newXPath().compile(xPath);
    }
    return xPath.evaluate(xmlDoc, XPathConstants.NODESET);
  },

  /**
   * Returns a value for a XPath expression, but also applies a converter
   * @param {org.xml.sax.InputSource} xmlDoc
   * @param {String} mapObj Map object
   * @param {Object} converterConfig
   * @param {Object} fieldMap A Map containing key-value combinations on which the converter might depend
   * @return {String}
   */
  getValue: function (xmlDoc, mapObj, converterConfig, fieldMap) {
    var me = this,
        value;

    if (!sol.common.ObjectUtils.isObject(mapObj)) {
      throw "Map object must be an object";
    }
    value = me.getElementString(xmlDoc, mapObj.xpath);
    if (converterConfig) {
      value = sol.connector_xml.Converter.convert(value, converterConfig, fieldMap, mapObj);
    }
    return value;
  },

  /**
   * Creates a KeyValue object
   * @param {String} key
   * @param {String} value
   * @return {de.elo.ix.client.KeyValue}
   */
  createMapEntry: function (key, value) {

    value += "";
    value = value.substr(0, ixConnect.CONST.MAP_DATA.lnValue);

    return new KeyValue(key, value);
  },

  /**
   * Creates the key for a map fieldMap
   * @param {String} pattern The pattern needs to contain the relevant placeholders
   * @param {String} prefix The placeholder for this is {PREFIX}
   * @param {String} field The placeholder for this is {FIELD}
   * @param {String} number The placeholder for this is {i}
   * @return {String}
   */
  buildMapKey: function (pattern, prefix, field, number) {
    if (pattern) {
      return pattern.replace("{PREFIX}", prefix).replace("{FIELD}", field).replace("{i}", number);
    }
    return prefix + "_" + field + "_" + number;
  },

  /**
   * Starts the import of a document into the archive
   * @param {String} filePath The path of the file which should be imported
   * @param {String} objId 'newVersion'=true this is the ID of the Document which will be replaced, else this is the ID of the folder where the document will be imported
   * @param {Number} maskId The mask of the new document, only relevant if 'newVersion'=false
   * @param {String} name The name of the new document, only relevant if 'newVersion'=false
   * @param {String} comment The import comment
   * @param {String} version The version
   * @param {Boolean} newVersion Indicates if the document is new, or should be added as a new Version to an existing one
   * @return {String} The objId of the document, if the import was successful
   */
  importDocument: function (filePath, objId, maskId, name, comment, version, newVersion) {
    var file = new File(filePath);

    if (file && file.exists() && file.isFile()) {
      if (newVersion) {
        return this.importNewVersion(file, objId, comment, version);
      } else {
        return this.importNewDocument(file, objId, maskId, name, comment, version);
      }
    } else {
      this.logger.warn(["no file found: {0}", filePath]);
    }
  },

  /**
   * Imports a file as a new Version of an existing document
   * @param {java.io.File} file
   * @param {String} objId The ID of the existing document
   * @param {String} comment The import comment
   * @param {String} version The version
   * @return {String} The objId of the document, if the import was successful
   */
  importNewVersion: function (file, objId, comment, version) {
    var ed, importObjId;

    try {
      ed = ixConnect.ix().checkoutDoc(objId, "", EditInfoC.mbDocument, LockC.IF_FREE);
      ed.document.docs[0].comment = comment ? comment : "";
      ed.document.docs[0].version = version ? version : parseFloat(ed.document.docs[0].version) + 1.0;
      ed.document.docs[0].createDateIso = ixConnect.dateToIso(new java.util.Date());
      ed.document.docs[0].ext = sol.common.FileUtils.getExtension(file);
      ed.document = ixConnect.ix().checkinDocBegin(ed.document);
      ed.document.docs[0].uploadResult = ixConnect.upload(ed.document.docs[0].url, file);
      ed.document = ixConnect.ix().checkinDocEnd(ed.sord, SordC.mbAll, ed.document, LockC.YES);
      importObjId = ed.document.objId + "";
      return importObjId;
    } catch (ex) {
      this.logger.error(["error importing version: file={0}", file], ex);
    }
  },

  /**
   * Imports a file as a new Version of an existing document
   * @param {java.io.File} file
   * @param {String} parentId The ID of the target folder
   * @param {Number} maskId The ID of the mask for the new document
   * @param {String} name The name of the new document
   * @param {String} comment The import comment
   * @param {String} version The version
   * @return {String} The objId of the document, if the import was successful
   */
  importNewDocument: function (file, parentId, maskId, name, comment, version) {
    var ed, newDoc, newObjId;

    try {
      ed = ixConnect.ix().createDoc(parentId, maskId, null, EditInfoC.mbAll);
      ed.sord.name = name ? name : sol.common.FileUtils.getName(file);
      ed.document.docs = [new DocVersion()];
      ed.document.docs[0].ext = sol.common.FileUtils.getExtension(file);
      ed.document = ixConnect.ix().checkinDocBegin(ed.document);
      ed.document.docs[0].uploadResult = ixConnect.upload(ed.document.docs[0].url, file);
      ed.document.docs[0].comment = comment ? comment : "";
      ed.document.docs[0].version = version ? version : parseFloat(ed.document.docs[0].version) + 1.0;
      ed.document.docs[0].createDateIso = ixConnect.dateToIso(new java.util.Date());
      newDoc = ixConnect.ix().checkinDocEnd(ed.sord, SordC.mbAll, ed.document, LockC.NO);
      newObjId = newDoc.objId + "";
      return newObjId;
    } catch (ex) {
      this.logger.error(["error importing: file={0}", file], ex);
    }
  },

  /**
   * Executes an action on a file specified by a String in the form 'action:parameter'
   *
   * The following actions are supported:
   *
   * - delete (needs no additional 'parameter')
   * - move (additional 'parameter': the subfolder where the file should be moved)
   * - rename (additional 'parameter': the suffix which will be appended to the file name)
   *
   * @param {java.io.File} file
   * @param {String} actionString
   * @param {String} timestamp
   */
  handleImportAction: function (file, actionString, timestamp) {
    var actionParts, action, actionParam, dstDirPath, dstDir, dstFileName, dstFilePath;
    if (!file || !(file instanceof File) || !file.exists()) {
      this.logger.warn("no valid file for handling");
      return;
    }
    if (!actionString) {
      actionString = "delete";
    }
    actionParts = actionString.split(":");
    if (actionParts.length < 1 || actionParts.length > 2) {
      throw "'" + actionString + "' is not a valid action";
    }
    action = actionParts[0];
    if (actionParts.length == 2) {
      actionParam = actionParts[1];
    }
    switch (action) {
      case "delete":
        FileUtils.forceDelete(file);
        break;
      case "move":
        if (!actionParam) {
          throw "move needs a target";
        }
        timestamp = timestamp || sol.common.FileUtils.getTimeStampString();
        dstFileName = FilenameUtils.getBaseName(file) + "_" + timestamp + "." + FilenameUtils.getExtension(file);
        dstDirPath = file.parent + File.separator + actionParam;
        dstDir = new File(dstDirPath);
        dstDir.mkdirs();
        dstFilePath = dstDirPath + File.separator + dstFileName;
        file.renameTo(new File(dstFilePath));
        break;
      case "rename":
        if (!actionParam) {
          throw "move needs a suffix";
        }
        timestamp = timestamp || sol.common.FileUtils.getTimeStampString();
        dstFilePath = file.canonicalPath + "_" + timestamp + "." + actionParam;
        file.renameTo(new File(dstFilePath));
        break;
      default:
        throw "'" + action + "' is not a valid action";
    }
  },

  /**
   * Writes an error log file.
   *
   * The file name is the name of the XML file with '.error.log' appended.
   * If the error file already exists, the errors will be appended.
   *
   * @param {java.io.File} file The XML file for which the errors should be logged.
   * @param {Array} errors An Array with error messages
   */
  writeErrorLog: function (file, errors) {
    if (!file || !(file instanceof File) || !file.exists()) {
      this.logger.warn("can not write error log for none exixting file");
      return;
    }

    var xmlName = file.getName(),
        errorName = xmlName + ".error.log",
        errorFile = file.toPath().resolveSibling(errorName).toFile(),
        lines = new ArrayList(),
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    lines.add(sdf.format(new java.util.Date()) + " : " + xmlName);
    lines.add("Errors:");
    lines.addAll(errors);
    lines.add("");

    FileUtils.writeLines(errorFile, "UTF-8", lines, true);
  },

  /**
   * Converts an XML document to string
   * @param {org.w3c.dom.Document} xmlDoc XML document
   * @return {String} String
   */
  xmlToString: function (xmlDoc)  {
    var transformer, source, result, streamResult;

    if (!xmlDoc) {
      throw "XML document is emtpy";
    }

    transformer = Packages.javax.xml.transform.TransformerFactory.newInstance().newTransformer();
    transformer.setOutputProperty(javax.xml.transform.OutputKeys.METHOD, "xml");
    transformer.setOutputProperty(javax.xml.transform.OutputKeys.INDENT, "yes");
    transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
    source = new Packages.javax.xml.transform.dom.DOMSource(xmlDoc);
    streamResult = new Packages.javax.xml.transform.stream.StreamResult(new java.io.StringWriter());
    transformer.transform(source, streamResult);
    result = streamResult.writer.toString()

    return result;
  }
});