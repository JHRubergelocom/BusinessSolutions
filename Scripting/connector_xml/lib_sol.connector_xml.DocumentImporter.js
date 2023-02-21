
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Contains the DocumentImporter functions
 *
 * The importer is used to process XML files and import files into the archive.
 * The XML extraction is controlled by a configuration object.
 *
 * ## Usage
 *
 *     var targetId = ... ,
 *         config = ... ,
 *         xml = new java.io.File( ... ),
 *         importer = sol.create("sol.connector_xml.DocumentImporter", config);
 *
 *     if (importer.validate(xml)) {
 *       importer.process(xml, targetId);
 *     }
 *
 * ## Configuration
 * The configuration consists of several properties/sections, which will be described below.
 * ### xsd
 * This contains an Array with GUIDs of XSD files in the archive. They're optional, but if none are defined the validation will always return true.
 *
 * ### container
 * If this is set to true, the files should be imported into a new subfolder of the target folder (this is not implemented yet, so far only container=false will work)
 *
 * ### sord
 * Only required, in container mode ans specifies the mask of the new container (also not implemented yet)
 *
 * ### importSuccessAction
 * Defines, what happens to the XML file in case of import success.
 * Further documentation an the options/ the structure of the instriction see {@link sol.connector_xml.Utils#handleImportAction Utils.handleImportAction}
 *
 * ### importErrorAction
 * Defines, what happens to the XML file in case of import error.
 * Further documentation an the options/ the structure of the instriction see {@link sol.connector_xml.Utils#handleImportAction Utils.handleImportAction}
 *
 * ### files
 * This object holds configurations for the informations needed to import the files from the filesystem to the archive.
 *
 * - xpath: Path to the file nodes inside the XML
 * - useRelativePaths: if set to `true` paths will be evaluated relative to the XML file
 * - importSuccessAction: Action for the files in case of success (see {@link sol.connector_xml.Utils#handleImportAction Utils.handleImportAction})
 * - importErrorAction: Action for the files in case of error (see {@link sol.connector_xml.Utils#handleImportAction Utils.handleImportAction})
 * - values: This object contains the XPaths for reading the file information from the file node.
 *
 * Each value has a describing object:
 *
 *     { xpath: "comment", converter: "defaultComment" }
 *
 * xpath: XPath inside the file node
 * converter: (optional) for documentation see {@link sol.connector_xml.Importer}
 *
 * This are the values which will be read from the file nodes:
 *
 * #### FILE_PATH
 * The file system path of the file
 * #### FILE_MASK
 * The mask which should be set after import
 * #### FILE_NAME
 * The name for the archive element
 * #### FILE_COMMENT
 * The comment for the archive element
 * #### FILE_VERSION
 * The version for the archive element
 *
 * ### converter
 * For documentation see {@link sol.connector_xml.Importer} and {@link sol.connector_xml.Converter Converter}
 *
 * ## Configuration example
 *
 *     {
 *       xsd: [{ name: "XSD Name", guid: "(04089DB6-E667-EDDE-DB86-5FCB6E5F4DFB)" }],  //optional
 *       container: false,
 *       sord: {   //only for container=true
 *         mask: "Eingangsrechnung"
 *       },
 *       importSuccessAction: "rename:imported", //[delete|move:SUBFOLDER|rename:SUFFIX], default is delete
 *       importErrorAction: "rename:error", //[delete|move:ARCPATH|rename:SUFFIX], default in delete
 *       files: {
 *         xpath: "/import/file",
 *         importSuccessAction: "rename:imported", //[delete|move:SUBFOLDER|rename:SUFFIX], default is delete
 *         importErrorAction: "rename:error", //[delete|move:ARCPATH|rename:SUFFIX], default in delete
 *         values: {
 *           "FILE_PATH": { xpath: "path" },
 *           "FILE_MASK": { xpath: "mask", converter: "defaultMask" },
 *           "FILE_NAME": { xpath: "name" },
 *           "FILE_COMMENT": { xpath: "comment", converter: "defaultComment" },
 *           "FILE_VERSION": { xpath: "version", converter: "defaultVersion" }
 *         }
 *       },
 *       converter: [
 *         { name: "defaultMask", type: "DefaultConverter", defaultValue: "Basic Entry" },
 *         { name: "defaultComment", type: "DefaultConverter", defaultValue: "standard import" },
 *         { name: "defaultVersion", type: "DefaultConverter", defaultValue: "0.8.15" }
 *       ]
 *     }
 *
 * # Metadata import
 * The `DocumentImporter` can import metadata as well.
 *
 * At this point only metadata import is only supported in `container` mode.
 * To import metadata to the newly generated container, the configuration has to define a `mapping` (see {@link sol.connector_xml.Importer} for configuration).
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.002
 *
 * @requires sol.common.RepoUtils
 * @requires sol.connector_xml.Utils
 *
 */
sol.define("sol.connector_xml.DocumentImporter", {

  /**
   * @cfg xsd
   */
  /**
   * @cfg container
   */
  /**
   * @cfg sord
   * required if 'container'= true
   */
  /**
   * @cfg importSuccessAction (required)
   */
  /**
   * @cfg importErrorAction (required)
   */
  /**
   * @cfg files (required)
   */
  /**
   * @cfg converter
   */

  /**
   * @private
   * @property logger
   */
  /**
   * @private
   * @property config
   */
  /**
   * @private
   * @property utils
   */
  /**
   * @private
   * @property validator
   */
  /**
   * @private
   * @property documentBuilder
   */
  /**
   * @private
   * @property importer
   */

  initialize: function (config) {
    var me = this;
    if (!config) {
      throw "cannot initialize new " + me.$className + " without configuration";
    }

    me.logger = sol.create("sol.Logger", { scope: me.$className });

    me.config = config;
    me.utils = sol.connector_xml.Utils;

    me.validator = (me.config.xsd && (me.config.xsd.length > 0)) ? me.utils.createValidator(me.config.xsd) : null;
    me.documentBuilder = me.utils.getDocumentBuilder();
    me.importer = me.impl.getInstance(me.config);
  },

  /**
   * Validation against the schema which is defined in the config
   * @param {java.io.File} xml The XML file that should be validated
   * @return {Boolean}
   */
  validate: function (xml) {
    if (this.validator) {
      var xmlStreamSource = this.utils.getStreamSource(xml);
      try {
        this.validator.validate(xmlStreamSource);
      } catch (ex) {
        this.logger.warn("validation failed", ex);
        return false;
      }
    }
    return true;
  },

  /**
   * Starts the import according to the configuration.
   * @param {java.io.File} xml The XML file that should be processed
   * @param {String} parentId The ID of the target folder
   * @return {Object}
   */
  process: function (xml, parentId) {
    var me = this,
        fileData, result, action, timestamp;

    me.logger.enter("process", { objId: parentId });
    if (!me.importer) {
      throw "no importer defined";
    }

    me.logger.info(["process XML: {0}; import into '{1}'; using '{2}'", xml, parentId, me.importer.name]);

    me.doc = me.utils.getDocument(me.documentBuilder, xml);

    fileData = me.readXmlData();

    me.preprocessFilePaths(xml, fileData);

    me.logger.debug(["import files using '{0}'", me.importer.name]);
    timestamp = sol.common.FileUtils.getTimeStampString();

    result = me.importer.process(parentId, fileData, me.config.files.importSuccessAction, me.config.files.importErrorAction, timestamp, me.config.sord.mask);
    action = me.config.importSuccessAction;

    me.writeMetadata(xml, result);

    if (result.errors && result.errors.length > 0) {
      action = me.config.importErrorAction;
      me.utils.writeErrorLog(xml, result.errors);
    }

    me.utils.handleImportAction(xml, action, timestamp);

    me.doc = undefined;

    return result;
  },

  /**
   * @private
   * Parses the XML file and reads the data according to the configuration.
   * @return {java.io.File[]}
   */
  readXmlData: function () {

    var me = this,
        files = [],
        fileConfig, nodes, node, info, i, xmlString,
        pathConverter, maskConverter, nameConverter, commentConverter, versionConverter;

    me.logger.enter("readXmlData");

    fileConfig = me.config.files;

    if (me.logger.debugEnabled) {
      xmlString = sol.connector_xml.Utils.xmlToString(me.doc);
      me.logger.debug(["xml=" + xmlString]);
    }

    nodes = sol.connector_xml.Utils.getElements(me.doc, fileConfig.xpath);

    pathConverter = sol.connector_xml.Utils.getConverterConfig(me.config, fileConfig.values.FILE_PATH.converter);
    maskConverter = sol.connector_xml.Utils.getConverterConfig(me.config, fileConfig.values.FILE_MASK.converter);
    nameConverter = sol.connector_xml.Utils.getConverterConfig(me.config, fileConfig.values.FILE_NAME.converter);
    commentConverter = sol.connector_xml.Utils.getConverterConfig(me.config, fileConfig.values.FILE_COMMENT.converter);
    versionConverter = sol.connector_xml.Utils.getConverterConfig(me.config, fileConfig.values.FILE_VERSION.converter);

    for (i = 0; i < nodes.getLength(); i++) {
      node = nodes.item(i);
      info = {};

      info.path = sol.connector_xml.Utils.getValue(node, fileConfig.values.FILE_PATH, pathConverter) + "";
      info.mask = sol.connector_xml.Utils.getValue(node, fileConfig.values.FILE_MASK, maskConverter) + "";
      info.name = sol.connector_xml.Utils.getValue(node, fileConfig.values.FILE_NAME, nameConverter) + "";
      info.comment = sol.connector_xml.Utils.getValue(node, fileConfig.values.FILE_COMMENT, commentConverter) + "";
      info.version = sol.connector_xml.Utils.getValue(node, fileConfig.values.FILE_VERSION, versionConverter) + "";

      files.push(info);
    }

    me.logger.exit("readXmlData");
    return files;
  },

  /**
   * @private
   * Preprocessing of the file paths.
   * If `useRelativePaths` is set to `true`, this evaluates the relative (from the XML) paths to the files to absulute paths.
   * @param {java.io.File} xmlFile
   * @param {Object[]} fileData
   */
  preprocessFilePaths: function (xmlFile, fileData) {
    var me = this,
        xmlPath, basePath;

    if (me.config.files.useRelativePaths !== true) {
      return;
    }
    if (!xmlFile || !xmlFile.exists()) {
      return;
    }
    if (!fileData || (fileData.length <= 0)) {
      return;
    }

    xmlPath = xmlFile.getAbsolutePath();
    basePath = xmlPath.substring(0, xmlPath.lastIndexOf(File.separator));

    fileData.forEach(function (data) {
      data.path = basePath + File.separator + data.path;
    });
  },

  /**
   * @private
   * Imports metadata for a container from the xml file.
   * @param {java.io.File} xml
   * @param {Object} params This should be the result of the importer process function
   */
  writeMetadata: function (xml, params) {
    var me = this,
        importer, i, objId;

    if (xml && params && me.config && me.config.mapping && (me.config.mapping.length > 0)) {
      importer = sol.create("sol.connector_xml.Importer", me.config);

      if (params.containerId) {
        importer.process(xml, params.containerId);
      } else {
        if (params.objIds) {
          for (i = 0; i < params.objIds.length; i++) {
            objId = params.objIds[i];
            importer.process(xml, objId);
          }
        }
      }
    }
  },

  /**
   * @private
   * Contains the implementations for the differant importer strategies.
   *
   * An importer needs to have the following structure:
   *
   *     my_importer: {
   *       name: "importer name",
   *       process: function (parentId, fileData, successAction, errorAction) {
   *         ...
   *       }
   *     }
   *
   * The process method should return an Object containing two arrays (`objIds` and `errors`).
   *
   * If the import is in container mode, a containerId will be returned as well.
   */
  impl: {

    /**
     * Returns the correct importer implementation based on a given configuration.
     * @param {Object} config
     * @return {Object}
     */
    getInstance: function (config) {
      if (config.container === true) {
        return this.CONTAINER_IMPORTER;
      }
      return this.PLAIN_IMPORTER;
    },

    /**
     * The plain importer just puts all files plain into a folder.
     */
    PLAIN_IMPORTER: {
      /**
       * @property {String} name
       * The name of ths importer.
       */
      name: "PLAIN_IMPORTER",

      /**
       * Starts the import.
       * @param {String} parentId ID of the target folder
       * @param {Object} fileData Description of the files
       * @param {String} successAction Action string which specifies the behaviour in an success case
       * @param {String} errorAction Action string which specifies the behaviour in an error case
       * @param {String} timestamp A timestamp for possible rename actions
       * @return {Object} Returns an object containing an array with objIds and an array with errors (if there have been any)
       */
      process: function (parentId, fileData, successAction, errorAction, timestamp) {
        var result = { errors: [], objIds: [], parentId: parentId },
            i, data, action, objId;

        for (i = 0; i < fileData.length; i++) {
          data = fileData[i];
          action = successAction;
          objId = sol.connector_xml.Utils.importDocument(data.path, parentId, data.mask, data.name, data.comment, data.version, false);

          if (!objId) {
            if (!errorAction) {
              throw "error importing '" + data.path + "' and no error handling defined";
            }
            action = errorAction;
            result.errors.push(data.path);
          } else {
            result.objIds.push(objId);
          }
          sol.connector_xml.Utils.handleImportAction(new File(data.path), action, timestamp);
        }
        return result;
      }
    },

    /**
     * Creates a subfolder and imports all files (from one XML) into that folder.
     */
    CONTAINER_IMPORTER: {

      name: "CONTAINER_IMPORTER",

      /**
       * Starts the import.
       * @param {String} parentId ID of the target folder
       * @param {Object} fileData Description of the files
       * @param {String} successAction Action string which specifies the behaviour in an success case
       * @param {String} errorAction Action string which specifies the behaviour in an error case
       * @param {String} timestamp A timestamp for possible rename actions
       * @param {String} mask Doc mask
       * @return {Object} Returns an object containing an array with objIds, an array with errors (if there have been any) and an objId of the container
       */
      process: function (parentId, fileData, successAction, errorAction, timestamp, mask) {
        var result = { errors: [], objIds: [] },
            name, i, data, action, objId;

        name = fileData[0].name;

        if (!name) {
          throw "Import file name is empty";
        }

        parentId = sol.common.RepoUtils.preparePath("ARCPATH[" + parentId + "]:" + sol.common.RepoUtils.pilcrow + fileData[0].name, { mask: mask });

        result.containerId = parentId;

        for (i = 0; i < fileData.length; i++) {
          data = fileData[i];
          action = successAction;
          objId = sol.connector_xml.Utils.importDocument(data.path, parentId, data.mask, data.name, data.comment, data.version, false);

          if (!objId) {
            if (!errorAction) {
              throw "error importing '" + data.path + "' and no error handling defined";
            }
            action = errorAction;
            result.errors.push(data.path);
          } else {
            result.objIds.push(objId);
          }
          sol.connector_xml.Utils.handleImportAction(new File(data.path), action, timestamp);
        }
        return result;
      }
    }
  }
});
