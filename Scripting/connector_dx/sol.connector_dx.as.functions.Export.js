
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.java.io);
importPackage(Packages.java.text);

/**
 * This class contains the DX exporter.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.connector_dx.DXUtils
 *
 * Node configuration example:
 *
 *     {
 *       "$directRule": "sol.connector_dx.Export",
 *       "subsystem": "Invoice"
 *     }
 */
sol.define("sol.connector_dx.as.functions.Export", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["subsystem"],

  /**
   * @private
   * @property {String} templateId
   * The objId/GUID of the DX export XML template
   */

  /**
   * @private
   * @property {String} exchangeDir
   * The subfolder inside the DX directory for the exchange files
   */

  /**
   * @private
   * @property {java.text.SimpleDateFormat} folderDateFormatter
   * Formats the date for transfer to DX (Format: "yyyyMMddHHmmssSSS").
   */
  folderDateFormatter: new SimpleDateFormat("yyyyMMddHHmmssSSS"),

  /**
   * @private
   * @property {String} pathSeparator
   */
  pathSeparator: File.separator,

  /**
   * @private
   * @property {String[]} sordKeys
   * Spezifies, which Sord attributes are available in the template.
   */
  sordKeys: ["guid", "id", "ownerName", "maskName", "name", "IDateIso", "XDateIso"],

  /**
   * @cfg {String} subsystem
   * The subsystem, from which the configuration should be read.
   */

  /**
   * @cfg {String} [template="Default"] (optional)
   * The template name for the export XML
   */
  template: "Default",

  /**
   * @cfg {String[]} dxMasks (optional)
   * Only sords with a mask defined in this list will me marked as 'skipped: FALSE'.
   * If parameter is omitted, ALL sords will be marked as 'skipped: FALSE'.
   */

  /**
   * @cfg {Boolean} skipAdditionalFiles (optional)
   * If parameter is omitted, the second and the following files will be marked as `skipped: TRUE`.
   */

  initialize: function (config) {
    var me = this,
        dxConfig;

    me.$super("sol.common.as.FunctionBase", "initialize", [config]);

    try {
      me.templateId = sol.connector_dx.DXUtils.getDxExportTemplateId(me.subsystem, me.template);
      dxConfig = sol.connector_dx.DXUtils.getDxConfig(me.subsystem);
      me.exchangeDir = dxConfig.exchangeDirectory;
      me.skipAdditionalFiles = dxConfig.skipAdditionalFiles;
    } catch (ex) {
      me.logger.error("error initializing DX export configuration", ex);
      throw "initialization exception: " + ex;
    }
  },

  /**
   * Starts the export to the DX exchange folder.
   * @param {de.elo.ix.client.Sord} sord Sord
   * @return {Object} result
   */
  process: function (sord) {
    var me = this,
        fileData, xml, path,
        timestampString;

    if (!me.templateId) {
      throw "Template ID is empty";
    }

    sord = sord || EM_ACT_SORD;

    timestampString = me.folderDateFormatter.format(new java.util.Date()) + "";

    path = me.exchangeDir + me.pathSeparator + timestampString;

    me.logger.enter("DX_EXPORT", { objId: sord.id });
    me.logger.info(["start export of '{0}' (objId={1})", sord.name, sord.id]);

    me.createFolder(path);
    fileData = me.exportFiles(path, sord);
    xml = me.createXml(sord, fileData, timestampString);

    me.createDxFiles(path, xml);

    me.logger.exit("DX_EXPORT");

    return { passOn: true };
  },

  /**
   * Creates a new `File`, if the path does not exist, or is not a already folder.
   * @private
   * @param {String} path The path string to the `File` that should be created
   */
  createFolder: function (path) {
    this.logger.debug(["create folder: {0}", path]);

    var folder = new File(path);
    if (!folder.exists() || !folder.isDirectory()) {
      folder.mkdir();
    }
  },

  /**
   * This method has to be refactored to make this class accessible in ELOix.
   * @private
   * @param {String} path Export base path
   * @param {de.elo.ix.client.Sord} sord
   * @return {de.elo.ix.client.Sord[]}
   */
  exportFiles: function (path, sord) {
    var me = this,
        fileData = [],
        counter = 0,
        isFolder, exportSords, i, exportSord, ext, filePath, fileId;

    isFolder = sol.common.SordUtils.isFolder(sord);

    exportSords = isFolder ? sol.common.RepoUtils.findChildren(sord.id, { includeDocuments: true }) : [sord];

    for (i = 0; i < exportSords.length; i++) {
      exportSord = exportSords[i];

      isFolder = sol.common.SordUtils.isFolder(exportSord);

      if (isFolder) {
        continue;
      }

      ext = exportSord.docVersion.ext.toUpperCase();

      if ((ext == "PDF") || (ext == "TIF") || (ext == "TIFF")) {
        filePath = me.createFilePath(path, exportSord, counter);
        filePath = ix.downloadDocument(filePath, exportSord);
        fileId = new File(filePath).getName();

        me.logger.debug(["export file: '{0}'", filePath]);

        fileData.push(me.createFileDataObj(exportSord, fileId, counter));
        counter++;
      }
    }

    return fileData;
  },

  /**
   * This method creates the content of the DX XML file
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} fileData
   * @param {String} timestampString (optional)
   * @return {String} The DX XML string
   */
  createXml: function (sord, fileData, timestampString) {
    var me = this,
        template, data;

    template = sol.create("sol.common.Template");

    data = {};
    data.timestamp = timestampString;
    data.sord = me.createTemplateSord(sord);
    data.images = fileData;

    template.load(this.templateId);
    return template.apply(data);
  },

  /**
   * Writes the DX XML and the status file to the export folder.
   *
   * This method has to be refactored to make this class accessible in ELOix.
   * @private
   * @param {String} path Export path
   * @param {String} xml Content of XML file
   */
  createDxFiles: function (path, xml) {
    this.logger.debug("write files to disk");
    fu.asFile(path + this.pathSeparator + "Import.xml", xml, "UTF-8");
    fu.asFile(path + ".sf_import_start", " ", "UTF-8");
  },

  /**
   * Creates the data Object for the attribute section of the DX XML.
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object[]}
   */
  createTemplateSord: function (sord) {
    var data = sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: this.sordKeys,
          allObjKeys: true,
          allMapFields: true
        }
      }
    });

    return data.sord;
  },

  /**
   * Creates a data Object for the images section of the DX XML.
   * @private
   * @param {de.elo.ix.client.Sord} sord The sord for an image document
   * @param {String} fileName Full name of the file
   * @param {String} counter
   * @return {Object}
   */
  createFileDataObj: function (sord, fileName, counter) {
    var me = this,
        skipped = "FALSE",
        fileDataObj;

    if (me.skipAdditionalFiles && (counter > 0)) {
      skipped = "TRUE";
    } else if (!me.hasDxMask(sord)) {
      skipped = "TRUE";
    }

    fileDataObj = {
      locationId: fileName,
      imageId: counter,
      skipped: skipped
    };

    return fileDataObj;
  },

  /**
   * Creates the full path to an image file.
   * @private
   * @param {String} path The export path
   * @param {de.elo.ix.client.Sord} sord The document sord
   * @param {Number} counter The running number of the file
   * @return {String}
   */
  createFilePath: function (path, sord, counter) {
    return path + this.pathSeparator + sord.guid + "-" + counter;
  },

  /**
   * Checks if a document has a mask which is configured for DX.
   *
   * If no mask was configured, it returns always `true`.
   * @private
   * @param {de.elo.ix.client.Sord} sord The document sord which should be checkt
   * @return {Boolean}
   */
  hasDxMask: function (sord) {
    if (!this.dxMasks) {
      return true;
    }
    return this.dxMasks.indexOf(sord.maskName) > -1;
  }
});
