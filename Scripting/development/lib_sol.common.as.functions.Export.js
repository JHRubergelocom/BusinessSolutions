
/**
 * @private
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 */
sol.define("sol.common.as.functions.Export", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["objId", "exporterClassName", "tplObjId", "dstDirPath"],

  /**
   * @cfg {String} $config
   * Repository path of the config file
   */

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {String} exporterClassName
   * Exporter class name
   */

  /**
   * @cfg {String} tplObjId
   * Template object ID
   */

  /**
   * @cfg {String} dstDirPath
   * Destination directory path
   */

  /**
   * @cfg {String} createPath
   * If true, the path will be created if it doesn't exist.
   */

  /**
   * @cfg {String} [encoding=UTF-8]
   * Encoding
   */

  initialize: function (config) {
    var me = this;
    me.config = sol.common.ConfigMixin.mergeConfiguration(config);
  },

  process: function () {
    var me = this,
        exporter;

    if (!me.config.exporterClassName) {
      throw "Exporter class name is empty.";
    }

    exporter = sol.create(me.config.exporterClassName, me.config);
    return exporter.process();
  }
});

/**
 *
 * Base class for exporter classes
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.004
 *
 * @requires sol.common.Config
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.FileUtils
 * @requires sol.common.Template
 */
sol.define("sol.common.as.ExporterBase", {
  extend: "sol.common.as.FunctionBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.payloadIds = [];
    me.extension = me.getTemplateExtension() || config.extension;
    me.encoding = config.encoding || "UTF-8";
  },

  tempExtension: "$$$",

  export: function () {
    var me = this,
        dstDirPathTpl, nameTpl, contentTpl, content, metaDataFileName, metaDataTempFilePath, metaDataFilePath,
        i, payloadId, payloadName, numberOfPayloads, sord, tplSord;

    try {
      sord = ixConnect.ix().checkoutSord(me.objId, EditInfoC.mbSord, LockC.NO).sord;
      tplSord = sol.common.SordUtils.getTemplateSord(sord);

      me.logger.debug("content=" + JSON.stringify(tplSord));

      me.dstDirPath += "";

      if (me.dstDirPath.indexOf("{{") > -1) {
        dstDirPathTpl = sol.create("sol.common.Template", { source: me.dstDirPath });
        me.dstDirPath = dstDirPathTpl.apply(tplSord);
      }

      if (!sol.common.FileUtils.exists(me.dstDirPath)) {
        if (me.createPath) {
          sol.common.FileUtils.makeDirectories(new java.io.File(me.dstDirPath));
        } else {
          throw "Destination directory doesn't exist: " + me.dstDirPath;
        }
      }

      nameTpl = sol.create("sol.common.Template", { source: me.nameTplString });
      me.name = nameTpl.apply(tplSord);

      contentTpl = sol.create("sol.common.Template", { objId: me.tplObjId });
      content = contentTpl.apply(tplSord.sord);

      metaDataFileName = me.name + "." + me.extension;
      metaDataTempFilePath = me.dstDirPath + File.separator + metaDataFileName + "." + me.tempExtension;

      if (me.overwrite) {
        sol.common.FileUtils.deleteFiles({ dirPath: me.dstDirPath, prefix: me.name });
      }

      sol.common.FileUtils.writeStringToFile(metaDataTempFilePath, content, { bom: me.bom, encoding: me.encoding });

      numberOfPayloads = me.payloadIds.length;
      for (i = 0; i < numberOfPayloads; i++) {
        payloadId = me.payloadIds[i];
        payloadName = me.name;
        if (numberOfPayloads > 1) {
          payloadName += "_" + sol.common.StringUtils.padLeft(i, 3);
        }
        sol.common.RepoUtils.downloadToFile(payloadId, { dstDirPath: me.dstDirPath, fileName: payloadName });
      }

      metaDataFilePath = sol.common.FileUtils.rename(metaDataTempFilePath, metaDataFileName);
    } catch (ex) {
      me.writeErrorFile(ex);
      throw ex;
    }

    log.info("insideTomcat:" + sol.common.ExecUtils.insideTomcat());

    if (me.debug && !sol.common.ExecUtils.insideTomcat()) {
      sol.common.ExecUtils.open(metaDataFilePath);
    }

    return { passOn: true };
  },

  writeErrorFile: function (message) {
    var me = this,
        errorFilePath = me.dstDirPath + File.separator + me.name + ".err";

    sol.common.FileUtils.delete(errorFilePath);
    sol.common.FileUtils.writeStringToFile(errorFilePath, message);
  },

  getTemplateExtension: function () {
    var me = this,
        ext = null,
        templateSord;

    templateSord = ixConnect.ix().checkoutSord(me.tplObjId, EditInfoC.mbSord, LockC.NO).sord;

    if (templateSord && templateSord.docVersion && templateSord.docVersion.ext) {
      ext = templateSord.docVersion.ext;
    }

    return ext;
  }

});

/**
 * Simple XML exporter
 *
 * Exports the values of an object as XML file and optionally the appropriate payload file
 *
 * Some of the parameters could be pre-defined in a configuration file.
 * This configuration file can be specified by the `$config` property.
 *
 * Example:
 *
 *     var exporter = sol.create("sol.common.as.SimpleExporter", {
 *       $config: "ARCPATH:/Administration/Business Solutions/invoice/Configuration/sol.invoice.ExportConfig",
 *       objId: "ARCPATH:/Invoice/Invoice in-tray/Sample invoice"
 *     });
 *     exporter.process();
 *
 * Workflow node sample configuration:
 *
 *     {
 *       "$function": "sol.common.as.Exporter",
 *       "$config": "ARCPATH:/Administration/Business Solutions/invoice/Configuration/sol.invoice.ExportConfig"
 *     }
 *
 * Sample configuration file:
 *
 *     {
 *       "exporterClassName": "sol.common.as.SimpleExporter",
 *       "tplObjId": "ARCPATH:/Administration/Business Solutions/invoice/Export Templates/sol.invoice.xml",
 *       "dstDirPath": "c:/invoice/export",
 *       "payload": true,
 *       "overwrite": true
 *     }
 */
sol.define("sol.common.as.SimpleExporter", {
  extend: "sol.common.as.ExporterBase",

  requiredConfig: ["objId", "tplObjId"],

  /**
   * @cfg {String} objId
   * Object ID
   */

  /**
   * @cfg {String} tplObjId
   * Template object ID
   */

  /**
   * @cfg {String} nameTplString
   * Template string for the file name of the export files
   */

  /**
   * @cfg {String} extension
   * Extension of the metadata file. This will be overriden by the extension from the export template and only be used, if the extension of the template can't be determined.
   */

  /**
   * @cfg {String} dstDirPath
   * Destination directory path
   */

  /**
   * @cfg payload
   * If true the payload document will be exported as well
   */

  /**
   * @cfg bom
   * If true the export file will be exported with a byte order mark
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ExporterBase", "initialize", [config]);
  },

  process: function () {
    var me = this;
    me.nameTplString = me.nameTplString || "{{sord.guid}}";
    me.extension = me.extension || "xml";
    if (me.payload) {
      me.payloadIds = me.getPayloadIds();
    }
    return me.export();
  },

  /**
   * Determinate the payload object IDs
   * @return {Array}
   */
  getPayloadIds: function () {
    var me = this,
        sord, sords;
    sord = sol.common.RepoUtils.getSord(me.objId);
    if (sol.common.SordUtils.isFolder(sord)) {
      sords = sol.common.RepoUtils.findChildren(me.objId, { includeFolders: true, includeDocuments: true, sordZ: SordC.mbLean });
      return sords.map(function (sord) {
        return sord.id;
      });
    }
    return [me.objId];
  }
});
