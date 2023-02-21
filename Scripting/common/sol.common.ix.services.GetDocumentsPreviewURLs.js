importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js

/**
 * Retrieves preview urls for the specified id(s), which can be objIds or guids.
 *
 * ### Examples
 *
 * #### Get a document's URL
 *
 *     Call
 *     {
 *       objId: "(205E7844-175E-8A12-B83F-BED4A87EB996)"
 *     }
 *     Result
 *     {
 *       (205E7844-175E-8A12-B83F-BED4A87EB996): "http://archive.dev.elo/ix-Solutions/ix?cmd=preview&ticket=DDDD369F7EEA08E408C2DAA5F664AD12&page=1&size=131072&notes=false&doc=true&slctn=false&docid=(6C373A45-597F-75F2-934E-690A53177E7F)"
 *     }
 *
 * #### Get URLs for multiple documents
 *
 * The second document only has one single page. We use flatten, therefore the second document's URL is returned as a string.
 * If we would not use flatten, both properties would be an array.
 *
 *     Call
 *     {
 *       objIds: [
 *         "(F2FAC205-7A40-180A-66B5-F580E678F041)",
 *         "(205E7844-175E-8A12-B83F-BED4A87EB996)"
 *       ],
 *       previewSize: "tiny",
 *       startPage: 1,
 *       endPage: 2,
 *       flatten: true
 *     }
 *     Result
 *     {
 *       (F2FAC205-7A40-180A-66B5-F580E678F041): [
 *         "http://archive.dev.elo/ix-Solutions/ix?cmd=preview&ticket=DDDD369F7EEA08E408C2DAA5F664AD12&page=1&size=131072&notes=false&doc=true&slctn=false&docid=(B9464D83-5E03-31DF-46F4-3F2531C231B2)",
 *         "http://archive.dev.elo/ix-Solutions/ix?cmd=preview&ticket=DDDD369F7EEA08E408C2DAA5F664AD12&page=2&size=131072&notes=false&doc=true&slctn=false&docid=(B9464D83-5E03-31DF-46F4-3F2531C231B2)",
 *       ],
 *       (205E7844-175E-8A12-B83F-BED4A87EB996): "http://archive.dev.elo/ix-Solutions/ix?cmd=preview&ticket=DDDD369F7EEA08E408C2DAA5F664AD12&page=1&size=131072&notes=false&doc=true&slctn=false&docid=(6C373A45-597F-75F2-934E-690A53177E7F)"
 *     }
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.UserUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.GetDocumentsPreviewURLs", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId (optional)
   * An objId or guid.
   */

  /**
   * @cfg {String[]} objIds (optional)
   * An Array of objIds or guids.
   */

  /**
   * @cfg {String} documentId (optional)
   * An objId or guid of a specific document version. (parameter objId is ignored if this is defined)
   */

  /**
   * @cfg {String[]} documentIds (optional)
   * An Array of objIds or guids of specific document versions. (parameter objIds is ignored if this is defined)
   */

  /**
   * @cfg {Number} [startPage = 1] (optional)
   * Include all pages starting from `startPage` in the preview.
   */

  /**
   * @cfg {Number} [endPage = 1] (optional)
   * Include all pages up to page `endPage` in the preview.
   */

  /**
   * @cfg {String|"original"|"tiniest"|"tiny"|"medium"|"large"} [previewSize = "original"] (optional)
   * Resizes the generated preview accordingly
   */

  /**
   * @cfg {Boolean} [processDocument = false] (optional)
   * Activate processing (see JavaDoc)
   */

  /**
   * @cfg {Boolean} [renderAnnotations = false] (optional)
   * Render annotations
   */

  /**
   * @cfg {Boolean} [renderAnnotationsData = false] (optional)
   * Render annotation data
   */

  /**
   * @cfg {Boolean} [renderAnnotationsOnly = false] (optional)
   * Only render Annotations
   */

  /**
   * @cfg {Boolean} [flatten = false] (optional)
   * If startPage and endPage are defined, usually the urls for each page are returned in an array.
   * If this option is set to true and there is only one page in the resulting preview, the service
   * will not return an array, but only a string.
   */

  /**
   * @property {String} [defaultPreviewSize = "original"] If no previewSize is defined. This value is used.
   */
  defaultPreviewSize: "original",

  /**
   * @private
   * mapping between previewSize and PreviewImageInfoC constant values
   */
  previewSizes: {
    original: PreviewImageInfoC.SIZE_ORIGINAL,
    tiniest: PreviewImageInfoC.SIZE_TINIER,
    tiny: PreviewImageInfoC.SIZE_TINY,
    medium: PreviewImageInfoC.SIZE_MEDIUM,
    large: PreviewImageInfoC.SIZE_LARGE
  },

  /**
   * @private
   * Returns a PreviewImageInfoGenerator
   */
  PreviewImageInfoGenerator: function (classContext) {
    var generator = function () {
      this.previewImageInfo = (this.p = new PreviewImageInfo());
    };

    generator.prototype = {
      addPageSelection: function (startPage, endPage) {
        this.p.startPage = +(startPage) || 1;
        this.p.endPage = +(endPage) || 1;
        return this;
      },
      addPreviewSize: function (size) {
        this.p.previewSize = classContext.previewSizes[(size ? String(size) : classContext.defaultPreviewSize)];
        return this;
      },
      addProcessDocument: function (procDoc) {
        this.p.processDocument = procDoc === true;
        return this;
      },
      addAnnOpts: function (render, data, only) {
        this.p.renderAnnotationsData = data === true;
        this.p.renderAnnotationsOnly = only === true;
        this.p.renderAnnotations = (render !== false) && (this.p.renderAnnotationsData || this.p.renderAnnotationsOnly);
        return this;
      }
    };

    return new generator();
  },

  /**
   * @private
   * Builds a PreviewImageInfo Java Object for checkoutPreviewImageURLs
   */
  buildPreviewImageInfo: function (opts) {
    var me = this;
    return (new me.PreviewImageInfoGenerator(me))
      .addPageSelection(opts.startPage, opts.endPage)
      .addPreviewSize(opts.previewSize)
      .addProcessDocument(opts.processDocument)
      .addAnnOpts(opts.renderAnnotations, opts.renderAnnotationsData, opts.renderAnnotationsOnly)
      .previewImageInfo;
  },

  /**
   * @private
   * for usage in Array.map()
   */
  jsStr: function (s) {
    return String(s);
  },

  /**
   * @private
   * retrieves available urls for the preview of the document `id` defined by the PreviewImageInfo `pii`
   */
  getPreviewURLs: function (pii, id) {
    var me = this, urlObj;
    try {
      urlObj = ((ixConnect.ix().checkoutPreviewImageURLs(pii) || {}).urls || {});
    } catch (_e) {
      urlObj = {};
    }
    return Array.prototype.slice.call(((typeof urlObj.toArray === "function") && (urlObj.toArray())) || [])
      .map(me.jsStr);
  },

  /**
   * @private
   * Adds the urls of the preview of document `id`. For usage in Array.reduce()
   */
  addPreviewUrlsOf: function (idProperty, flatten, pii, acc, id) {
    var me = this;
    id
      && (id = String(id))
      && (pii[idProperty] = id)
      && (acc[id] = me.getPreviewURLs(pii, id))
      && (flatten && acc[id].length <= 1)
        && (acc[id] = acc[id][0]);
    return acc;
  },

  /**
   * @private
   * Determines if the flatten option should be active
   */
  flattenActive: function (opts) {
    return ((opts.endPage === opts.startPage) || !!opts.flatten);
  },

  /**
   * @return {Object} return Object containing all URLs mapped to all Ids
   * @return {String} return.propertyName name of the passed id
   * @return {String|String[]} return.propertyValue URLs
   */
  process: function () {
    var me = this,
        documentIds = me.documentIds || me.documentId,
        ids = documentIds || me.objIds || me.objId,
        idProperty = documentIds ? "documentId" : "objectId";

    if (!ids) {
      throw "No documentId(s) or objId(s) defined.";
    }

    return (Array.isArray(ids) ? ids : [ids])
      .reduce(
        me.addPreviewUrlsOf.bind(
          me,
          idProperty,
          me.flattenActive(me.args),
          me.buildPreviewImageInfo(me.args)
        ),
        {}
      );
  }
});

/**
 * @member sol.common.ix.services.GetDocumentsPreviewURLs
 * @method RF_sol_common_service_GetDocumentsPreviewURLs
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetDocumentsPreviewURLs(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result,
      logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetDocumentsPreviewURLs" });

  logger.enter("RF_sol_common_service_GetDocumentsPreviewURLs");

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  rfParams.args = JSON.parse(args);

  serviceProc = sol.create("sol.common.ix.services.GetDocumentsPreviewURLs", rfParams);
  result = JSON.stringify(serviceProc.process());

  logger.exit("RF_sol_common_service_GetDocumentsPreviewURLs");
  return result;
}