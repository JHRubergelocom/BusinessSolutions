
//@include lib_Class.js

/**
 * Contains the EP export functions used by the Rule
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.FileUtils
 *
 * @eloas
 *
 */
sol.define("sol.common.as.functions.BatchExport", {
  extend: "sol.common.as.FunctionBase",

  /**
   * @cfg objIds
   * Object IDs
   */

  /**
   * @cfg objIds
   * Object IDs
   */

  /**
   * @cfg exportConfigObjId
   * Export configuration object ID
   */

  /**
   * ERP export
   * @returns {String} result Result
   */
  process: function () {
    var me = this,
        tplSords = [],
        logger, tplSord, i, sord, sords,
        nameTpl, data, name, contentTpl, content, dstFilePath, result;

    logger = sol.create("sol.Logger", { scope: this.$className });
    logger.enter("process");

    if (!me.objIds) {
      throw "Object IDs are empty";
    }

    if (!me.exportConfigObjId) {
      throw "Export configuration object ID is empty";
    }

    me.exportConfig = sol.create("sol.common.Config", { compose: me.exportConfigObjId }).config;

    me.tplObjId = me.exportConfig.tplObjId;

    if (!me.tplObjId) {
      throw "Template object ID is empty";
    }

    me.nameTplString = me.exportConfig.nameTplString || "Export_{{{formatDate 'YYYYMMDDHHmmss'}}}";

    me.dstDirPath = me.exportConfig.dstDirPath;

    if (!sol.common.FileUtils.exists(me.dstDirPath)) {
      logger.warn(["Destination directory '{0}' doesn't exist.", me.dstDirPath]);
      me.dstDirPath = sol.common.FileUtils.getTempDirPath();
    }

    me.extension = me.exportConfig.extension || "csv";
    me.encoding = me.exportConfig.encoding || "UTF-8";

    sords = sol.common.RepoUtils.getSords(me.objIds);
    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      tplSord = sol.common.SordUtils.getTemplateSord(sord).sord;
      tplSords.push(tplSord);
    }

    data = { sords: tplSords };

    logger.debug(["data={0}", JSON.stringify(data)]);

    nameTpl = sol.create("sol.common.Template", { source: me.nameTplString });
    name = nameTpl.apply(tplSord);

    contentTpl = sol.create("sol.common.Template", { objId: me.tplObjId });
    content = contentTpl.apply(data);

    logger.debug(["content={0}", content]);

    dstFilePath = me.dstDirPath + java.io.File.separator + name + "." + me.extension;

    sol.common.FileUtils.writeStringToFile(dstFilePath, content, { encoding: me.encoding });

    logger.info(["File '{0}' exported.", dstFilePath]);

    result = {
      passOn: true,
      exportFilePath: dstFilePath
    };

    return result;
  }
});
