/**
 * Exports a folder structure as PDF and saves it to the archive.
 *
 * @eloas
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.FunctionBase
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.common_document.Utils
 * @requires sol.common_document.as.Utils
 */
sol.define("sol.meeting.as.functions.PdfExport", {
  extend: "sol.common.as.FunctionBase",
  mixins: ["sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this, inputStreams = [],
        coverSheetGenerator, coverSheetResult,
        contentGenerator, contentResult, templates,
        mergedOutputStream, pdfName, oldPdfId;

    templates = me.getTemplates(me.objId, "PDF Template");
    templates.forEach(function (sord) {
      // first render the meta data pdf
      // as we're working with streams the name is irrelevant
      coverSheetGenerator = sol.create("sol.common.as.DocumentGenerator", {
        name: "Temporary",
        dataCollector: "RF_sol_common_service_ParentDataCollector",
        renderer: "sol.common.as.renderer.Fop",
        collectorConfig: {
          objId: me.objId,
          returnDataDefinition: true,
          allMapFields: true,
          formatter: "sol.common.ObjectFormatter.TemplateSord"
        },
        rendererConfig: {
          toStream: true,
          templateId: sord.id
        }
      });

      coverSheetResult = coverSheetGenerator.process();
      inputStreams.push(new ByteArrayInputStream(coverSheetResult.outputStream.toByteArray()));
    });

    // now render the content word documents
    templates = me.getTemplates(me.objId, "Content");
    templates.forEach(function (sord) {
      contentGenerator = sol.create("sol.common.as.DocumentGenerator", {
        name: "Temporary",
        dataCollector: "RF_sol_common_service_ParentDataCollector",
        renderer: "sol.common.as.renderer.Word",
        collectorConfig: {
          objId: me.objId,
          returnDataDefinition: true,
          allMapFields: true,
          formatter: "sol.common.ObjectFormatter.TemplateSord"
        },
        rendererConfig: {
          templateId: sord.id,
          saveToStream: true,
          format: "pdf"
        }
      });

      contentResult = contentGenerator.process();
      inputStreams.push(contentResult.inputStream);
    });

    // merge both streams to one file
    mergedOutputStream = new ByteArrayOutputStream();
    sol.common.as.PdfUtils.mergePdfStreams(inputStreams, mergedOutputStream);

    // upload the file to the target folder
    pdfName = me.getPdfName();
    oldPdfId = me.docExists(me.objId, pdfName, "Meeting Proposal Document", "pdf");
    sol.common.RepoUtils.saveToRepo({
      name: pdfName,
      extension: "pdf",
      objId: oldPdfId || undefined,
      parentId: me.objId,
      outputStream: mergedOutputStream,
      maskId: "Meeting Proposal Document",
      objKeysObj: {
        SOL_TYPE: "PROPOSAL_DOCUMENT",
        MEETING_PROPOSAL_DOCTYPE: "PROPOSAL_DOCUMENT"
      },
      versionComment: me.getVersionComment()
    });

    return { passOn: true };
  },

  getTemplates: function (parentId, contentType) {
    var results;

    results = sol.common.RepoUtils.findChildren(parentId, {
      objKeysObj: {
        MEETING_PROPOSAL_DOCTYPE: contentType
      }
    });

    return results;
  },

  getPdfName: function () {
    var me = this,
        map;

    map = sol.create("sol.common.SordMap", { objId: me.objId });
    map.read();

    return map.getValue("MEETING_PROPOSAL_DOCUMENTNAME") || me.sord.name;
  },

  getVersionComment: function () {
    var me = this,
        map;

    map = sol.create("sol.common.SordMap", { objId: me.objId });
    map.read();

    return map.getValue("MEETING_PROPOSAL_VERSION_COMMENT") || "";
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
  }
});
