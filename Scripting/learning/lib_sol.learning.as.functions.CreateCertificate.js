/**
 * Creates a PDF, Word or Excel document from a template.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 */
sol.define("sol.learning.as.functions.CreateCertificate", {
  extend: "sol.common.as.FunctionBase",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" },
    _config: { config: "learning", prop: "entities.enrollment.functions.createcertificate.const", template: true } // {}
  },

  getName: function () {
    return "CreateCertificate";
  },

  isNumber: function (val) {
    var isNaN = function (v) {
      return v !== v;
    };
    return !isNaN(Number(val));
  },

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

  process: function () {
    var me = this,
        name = me.name || me._config.name,
        targetId = me.targetId || me._config.target,
        targetMask = (me.targetMask || me._config.targetMask || "Course certificate"),
        templateId = me.templateId || me.sord.objKeys.COURSE_CERTIFICATE_TEMPLATE || me._config.templateId,
        generator, templateSord, extension, renderer, renderedObjId, convertedObjId, officeConverter, oldPdfId,
        saveToRepoConfig = {
          format: "pdf",
          name: name
        };

    if (!templateId) {
      throw "A templateId must be defined.";
    }
    if (!sol.common.RepoUtils.isGuid(templateId) && !me.isNumber(templateId)) {
      templateId = sol.common.RepoUtils.getObjIdFromRelativePath(me._config.templatePath, "/" + templateId);
    }

    templateSord = sol.common.RepoUtils.getSord(templateId, { sordZ: SordC.mbAll });
    extension = String(templateSord.docVersion.ext).toLowerCase();
    if (extension.indexOf("doc") == 0) {
      renderer = "sol.common.as.renderer.Word";
    } else if (extension.indexOf("xls") == 0) {
      renderer = "sol.common.as.renderer.Excel";
    } else if (extension.indexOf("fo") == 0) {
      renderer = "sol.common.as.renderer.Fop";
    } else {
      me.addErrorEvent("sol.learning.msg.wrongExtType", null, null, ixConnect.loginResult.clientInfo.language);
      return;
    }
    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: renderer,
      collectorConfig: {
        objId: me.objId,
        returnDataDefinition: true,
        allMapFields: true
      },
      rendererConfig: {
        targetId: targetId,
        templateId: templateId
      }
    });
    renderedObjId = (generator.process() || {}).objId;

    (oldPdfId = me.docExists(me._config.storagePath, name, targetMask, "pdf"))  // check if the file to generate already exists
      ? (saveToRepoConfig.objId = oldPdfId)
      : (saveToRepoConfig.parentId = targetId);

    if (renderer === "sol.common.as.renderer.Word") {
      officeConverter = sol.create("sol.common.as.functions.OfficeConverter", {
        openFromRepo: {
          objId: renderedObjId
        },
        saveToRepo: saveToRepoConfig
      });
      convertedObjId = (officeConverter.process() || {}).objId;
      sol.common.IxUtils.execute("RF_sol_function_Delete", { objId: renderedObjId });
      if (!convertedObjId) {
        throw "could not convert word certificate to pdf";
      }
    } else {
      convertedObjId = renderedObjId;
    }

    if (!oldPdfId) {
      if (convertedObjId) {
        me.sord = ixConnect.ix().checkoutSord(convertedObjId, SordC.mbAllIndex, LockC.NO);
        me.sord = ixConnect.ix().changeSordMask(me.sord, targetMask, EditInfoC.mbSord).sord;
        ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
      }
      sol.common.IxUtils.execute("RF_sol_function_Move", {
        objId: convertedObjId,
        path: me._config.storagePath,
        adjustRights: false
      });

      ixConnect.ix().refSord("", me.objId, convertedObjId, -1);
    }
    return { passOn: true, objId: convertedObjId };
  }
});
