/**
 * Creates a pdf using a template.{@link #pdfName}
 *
 * @author ESt, ELO Digital Office GmbH
 * 
 * @eloas
 * @requires sol.common.Cache
 * @requires sol.common.Config
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ActionBase
 * @requires sol.common.as.Utils
 * @requires sol.common.as.BarcodeUtils
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.hr.as.actions.CreatePDFByTemplate
 */
sol.define("sol.hr.as.actions.CreatePDFByTemplate", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["templateId", "targetFolderId", "pdfName", "pdfMaskId"],

  /**
   * @cfg {String} templateId (required)
   * ObjectId/ARCPATH of the ".fo"-template to be rendered
   */
  /**
   * @cfg {String} targetFolderId (required)
   * ObjectID/ARCPATH of the folder to save the generated PDF in.   
   */
  /**
   * @cfg {String} pdfName (required)
   * Name (without ".pdf") for the generated PDF file. 
   * examples:
   *    "Employee Badge"
   *    "My PDF File"
   */
  /**
   * @cfg {String} pdfMaskId (required)
   * This mask will be assigned to the generated PDF.
   * examples:
   *    "Basic Entry"
   *    0
   */
  /**
   * !!!NOT IMPLEMENTED YET!!!
   * @cfg {String} [createStandaloneDocument: "false"] (optional)
   * 
   * If set to true, creates a standalone document instead of creating a 
   * new version of an already existing document with the same name.
   */


  getName: function () {
    return "CreatePDF";
  },

  /**
   * @private
   * checks if a document exists.
   * returns ObjId of document if it exists, otherwise false
   * @param {String} folderId (required)
   * ObjectId/ARCPATH of the folder which presumably contains the document
   * @param {String} name (required)
   * Name of the file without extension
   * @param {String} mask (required)
   * Name of the documents's assigned document mask
   * @param {String} ext (required)
   * The document's extension (without a leading dot!) e.g. "pdf"
   * @return {Boolean|String}
   */ 
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

  /**
   * @private
   * initializes a pdf document generator using the passed configuration parameters
   * returns an initialized pdf document generator
   * @param {Object} rendererOptions (required)
   * Either: {objId: x} Will save the generated pdf as a new version of an already existing document
   * -> objId typically points to a Document
   * Or: {targetId: x}  Will save the generated pdf as a standalone new file. (Allows for duplicate documents within folders)
   * -> targetId typically points to a folder
   * x is an ObjectID/ARCPATH
   * @param {String} templateId (required)
   * ObjectId/ARCPATH of the ".fo"-template to be rendered
   * @param {String} targetFolderId (required)
   * ObjectID/ARCPATH of the folder to save the generated PDF in.
   * @param {String} pdfName (required)
   * Name (without ".pdf") for the generated PDF file. 
   * @param {String} pdfMaskId (required)
   * This mask will be assigned to the generated PDF.
   * @return {DocumentGenerator}
   */ 
  getPdfGenerator: function (rendererOptions, templateId, targetFolderId, pdfName, pdfMaskId) {
    var me = this, 
        rendererConfig = {
          templateId: templateId,
          maskId: pdfMaskId
        };
    rendererConfig = sol.common.ObjectUtils.merge(rendererConfig, rendererOptions);

    return sol.create("sol.common.as.DocumentGenerator", {
      name: pdfName,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      collectorConfig: {
        objId: targetFolderId,
        returnDataDefinition: true,
        allMapFields: true 
      },
      renderer: "sol.common.as.renderer.Fop",
      rendererConfig: rendererConfig
    });
  },

  genSordZ: function (name, mbs, overwrite) {
    var me = this, sordz = me[name];
    if (sordz === undefined && mbs || overwrite) {
      me[name] = new SordZ();
      sordz = me[name];
      mbs.forEach(function (mb) {
        sordz.add(mb);
      });
    }
    return sordz;
  },

  setObjKey: function (objId, key, value) {
    var me = this, sord;
    sord = ixConnect.ix().checkoutSord(objId, me.genSordZ("objKeysOnlySordZ", [SordC.mbObjKeys]), LockC.NO);
    
    if (sord && sord.objKeys) {
      for (var objKey in sord.objKeys) {
        if (String(sord.objKeys[objKey].name) == key) {
          sord.objKeys[objKey].data = [String(value)];
          break;
        }
      }
      ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
    }
  },

  process: function () {
    var me = this,
        oldPdfId, rendererOption, generator, result;
    oldPdfId = me.docExists(me.targetFolderId, me.pdfName, me.pdfMaskId, "pdf");  // check if the file to generate already exists
    rendererOption = (oldPdfId && { objId: oldPdfId }) || { targetId: me.targetFolderId };  // set option "update" or "create new"
    generator = me.getPdfGenerator(rendererOption, me.templateId, me.targetFolderId, me.pdfName, me.pdfMaskId);  // initialize generator
    result = generator.process(); //generate pdf
    me.setKey && me.setValue !== undefined && me.setObjKey(result.objId, me.setKey, me.setValue);
    
    result.objId && me.addGotoIdEvent(result.objId);  // select generated pdf in client app
  }
});