/**
 *
 * @eloas
 *
 * @requires sol.common.Injection
 * @requires sol.common.RepoUtils
 * @requires sol.common.as.PdfUtils
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.as.PdfUtils
 * @requires sol.common.as.renderer.Fop
 * @requires sol.common.as.DocumentGenerator
 */
sol.define("sol.meeting.as.functions.StandardDocumentGenerator", {
  extend: "sol.common.as.FunctionBase",

  docExists: function (folderId, name, mask, ext) {
    var me = this;
    try {
      return (function (oldDoc) {
        return oldDoc && (+(oldDoc.mask) === +(mask) || String(oldDoc.maskName) === mask) && String(oldDoc.docVersion.ext) == ext && oldDoc.id;
      })(ixConnect.ix().checkoutSord("ARCPATH[" + sol.common.RepoUtils.getSord(folderId).guid + "]:/" + name, SordC.mbAll, LockC.NO));
    } catch (e) {
      return me.logger.debug("No old version found: ", e) && false;
    }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        result;

    me.logger.info(["start meeting document on {0}", me.objId]);

    result = me.createDocuments();

    return result ? {
      passOn: true
    } : {
      passOn: false
    };
  },

  createDocuments: function () {
    var me = this,
        result = true;
    if (me.documentGeneratorConfig.solType == "MEETING_MINUTES_DOCUMENT") {
      //at least one checkbox has to be checked
      if (me.isTotal()) {
        result = me.createDocument();
      }
      if (me.isPartial()) {
        result = result && me.createDocument(true);
      }
    } else {
      result = me.createDocument();
    }
    return result;
  },

  createDocument: function (createPartial) {
    var me = this,
        docGenerator, collector, result, fileName, rendererConfig,
        renderer, additionalSordData, subFolderId;
    try {
      subFolderId = sol.common.RepoUtils.preparePath("ARCPATH[" + me.objId + "]:/" + me.documentGeneratorConfig.subFolder, {
        mask: "Meeting Structure",
        data: {
          settings: {
            language: me.getLanguage()
          }
        }
      });
      collector = me.getDataCollector(createPartial);
      fileName = me.getFileName(createPartial);
      rendererConfig = me.getRendererConfig(fileName, subFolderId, createPartial);
      renderer = me.getRenderer();
      additionalSordData = me.getAdditionalSordData();
      docGenerator = sol.create("sol.common.as.DocumentGenerator", {
        name: fileName,
        renderer: renderer,
        rendererConfig: rendererConfig,
        dataCollector: collector.dataCollector,
        collectorConfig: collector.collectorConfig,
        additionalSordData: additionalSordData
      });
      docGenerator.process();
      result = true;
    } catch (ex) {
      me.logger.error("meeting document could not be generated", ex);
      result = false;
    } finally {
      me.logger.info(["process completed {0}", JSON.stringify(result)]);
    }
    return result;
  },

  getDataCollector: function (createPartial) {
    var me = this;
    return {
      dataCollector: "RF_sol_meeting_service_GetMeetingDocumentData",
      collectorConfig: {
        objId: me.objId,
        flowId: me.flowId,
        partialKey: createPartial ? me.documentGeneratorConfig.fields.settingPartial : null
      }
    };
  },

  getRendererConfig: function (fileName, subFolderId, createPartial) {
    var me = this,
        targetMask = "Meeting Document",
        validObjId, rendererConfig, oldPdfId, versionComment, ownerId;

    validObjId = sol.common.RepoUtils.getObjId(me.documentGeneratorConfig.template);
    versionComment = me.getVersionComment();
    me.logger.info(["templateObjId is {0}", validObjId]);
    ownerId = me.getOwnerId();

    (oldPdfId = me.docExists(subFolderId, fileName, targetMask, "pdf")) && createPartial // check if the file to generate already exists
      ?
      (rendererConfig = {
        objId: oldPdfId,
        templateId: validObjId,
        maskId: targetMask,
        versionComment: versionComment,
        versionIncrement: 1,
        ownerId: ownerId
      }) :
      (rendererConfig = {
        targetId: subFolderId,
        templateId: validObjId,
        maskId: targetMask,
        versionComment: versionComment,
        version: 1,
        objKeysObj: {
          SOL_TYPE: me.documentGeneratorConfig.solType
        },
        ownerId: ownerId
      });

    return rendererConfig;
  },

  getFileName: function (createPartial) {
    var me = this,
        fileName = "Meeting Minutes",
        map;

    map = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    map.read([me.documentGeneratorConfig.fields.documentName]);
    fileName = map.getValue(me.documentGeneratorConfig.fields.documentName);
    fileName = createPartial ? me.documentGeneratorConfig.fileName.partial.prefix + fileName : me.documentGeneratorConfig.fileName.prefix + fileName;
    fileName = sol.create("sol.common.Template", {
      source: fileName
    }).apply({
      settings: {
        language: me.getLanguage()
      }
    });
    return fileName;
  },

  getOwnerId: function () {
    var me = this,
        ownerId = "",
        map;

    map = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    map.read(["CURRENT_USER"]);
    ownerId = map.getValue("CURRENT_USER");
    return ownerId;
  },

  getAdditionalSordData: function () {
    var me = this,
        additionalSordData;

    additionalSordData = [{
      objId: me.objId,
      propertyName: "settings"
    }];

    return additionalSordData;
  },

  getVersionComment: function () {
    var me = this,
        versionComment = "",
        map;

    map = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    map.read([me.documentGeneratorConfig.fields.versionComment]);
    versionComment = map.getValue(me.documentGeneratorConfig.fields.versionComment);
    return versionComment;
  },

  getRenderer: function () {
    return "sol.common.as.renderer.Fop";
  },

  isPartial: function () {
    var me = this;
    return me.checkWfMapSetting(me.documentGeneratorConfig.fields.settingPartial);
  },

  isTotal: function () {
    var me = this;
    return me.checkWfMapSetting(me.documentGeneratorConfig.fields.settingTotal);
  },

  checkWfMapSetting: function (settingKey) {
    var me = this,
        setting = "",
        map;

    map = sol.create("sol.common.WfMap", {
      objId: me.objId,
      flowId: me.flowId
    });
    map.read([settingKey]);
    setting = map.getValue(settingKey);
    return setting == "1";
  },

  getLanguage: function () {
    var me = this,
        lang = "",
        map;

    map = sol.create("sol.common.SordMap", {
      objId: me.objId
    });
    map.read(["CURRENT_LANGUAGE"]);
    lang = map.getValue("CURRENT_LANGUAGE");
    return lang;
  }
});