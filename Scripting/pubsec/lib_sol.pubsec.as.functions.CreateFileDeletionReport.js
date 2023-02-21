/**
 * Renders a file deletion report as PDF and saves it to the archive.
 *
 * @eloas
 * @requires sol.common.SordUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.AsyncUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.functions.CreateFileDeletionReport", {
  extend: "sol.common.as.FunctionBase",
  
  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
    sol.common.TranslateTerms.require("sol.pubsec.as.functions.CreateFileDeletionReport");
    if (!sol.pubsec.Utils.isFile(me.objId)) {
      throw "IllegalArgumentException: can not generate a 'file deletion report' for none file element";
    }
  },
  
  getName: function () {
    return "CreateFileDeletionReport";
  },

  process: function () {
    var me = this,
        targetId, templateId, name, result;
    
    me.logger.enter("sol.pubsec.as.functions.CreateFileDeletionReport");

    targetId = me.getTargetId();
    templateId = me.getTemplateId();
    name = sol.create("sol.common.Template", { source: me.config.reporting.names.fileDeletion }).apply({ date: new Date() });

    result = me.generateDeletionReport(targetId, templateId, name);
    me.setReportRights(result.objId);
    
    me.logger.exit("sol.pubsec.as.functions.CreateFileDeletionReport");

    return JSON.stringify({ passOn: true });
  },

  /**
   * @private
   * Retrives the target for the report from the pubsec configuration (`reporting.targetIds.fileDeletion`).
   * @return {String}
   */
  getTargetId: function () {
    var me = this;
    return me.config.reporting.targetIds.fileDeletion;
  },

  /**
   * @private
   * Retrives the template for the report from the pubsec configuration (`reporting.deletionTemplateId`).
   * @return {String}
   */
  getTemplateId: function () {
    var me = this,
        path = me.config.reporting.deletionTemplateId,
        separator, splitIndex, startPath, templateName;
    
    separator = sol.common.RepoUtils.getPathSeparator(path);
    splitIndex = path.lastIndexOf(separator);
    startPath = path.substring(0, splitIndex);
    templateName = path.substring(splitIndex);

    return sol.common.RepoUtils.getObjIdFromRelativePath(startPath, templateName);
  },

  /**
   * @private
   * Generates a PDF deletion report and saves it to the archive.
   * @param {String} targetId
   * @param {String} templateId
   * @param {String} name
   * @return {Object}
   */
  generateDeletionReport: function (targetId, templateId, name) {
    var me = this,
        generator, result;

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_services_ChildrenDataCollector",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        parentId: me.objId,
        endLevel: -1,
        formatter: "sol.common.ObjectFormatter.TemplateSord"
      },
      rendererConfig: {
        targetId: targetId,
        templateId: templateId
      },
      compareFct: function (templateSord1, templateSord2) {
        var cmpResult, ref1, ref2;
        try {
          ref1 = templateSord1.objKeys.FILE_REFERENCE + templateSord1.objKeys.PROCESS_REFERENCE + templateSord1.objKeys.DOCUMENT_REFERENCE;
          ref2 = templateSord2.objKeys.FILE_REFERENCE + templateSord2.objKeys.PROCESS_REFERENCE + templateSord2.objKeys.DOCUMENT_REFERENCE;
          cmpResult = ref1.localeCompare(ref2);
        } catch (ex) {
          cmpResult = 0;
        }
        return cmpResult;
      }
    });

    result = generator.process();
    return result;
  },

  /**
   * @private
   * Sets the rights of the report to the rights the original object had.
   * @param {String} reportId
   */
  setReportRights: function (reportId) {
    var me = this,
        cfg;

    cfg = {
      mode: "SET",
      inherit: { aclSrcObjId: me.objId }
    };

    sol.common.AclUtils.changeRightsInBackground(reportId, cfg);
  }
  
});
