
//@include lib_Class.js

/**
 * @private
 * Creates a signed PDF file
 * Combines a given file with a signature image.
 * The signature image is retrieved as base64 content from a "properties" property of a data node or form a form blob field
 *
 * @author MW, ELO Digital Office GmbH
 *
 * @eloas
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 *
 * Sample node configuration:
 *
 *    {
 *      "$directRule": "sol.common.CreateSignedPdf" ,
 *      "field": {
 *        "type": "FORMBLOB",
 *        "key": "WO_SIGNATURE"
 *      },
 *      "signatureBasePath": "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/visitor/Configuration/Reports/Signature",
 *      "signaturType": "Default"
 *    }
 *
 *    {
 *      "$function": "sol.common.as.functions.CreateSignedPdf" ,
 *      "dataNodeName": "[data] signature",
 *      "templateId": "ARCPATH:/Administration/Business Solutions/visitor/Configuration/Reports/Signature/Signature",
 *      "name": "signed"
 *    }
 */
sol.define("sol.common.as.functions.CreateSignedPdf", {
  extend: "sol.common.as.FunctionBase",

  requiredProperty: ["objId", "flowId", "dataNodeName"],

  /**
   * @cfg {String} objId (required)
   * Object ID of the PDF file that should be signed
   */

  /**
   * @cfg {String} flowId (required)
   * Workflow ID
   */

  /**
   * @cfg {String} dataNodeName
   * Name which holds the base64 string with the signature
   */

  /**
   * @cfg {String} field
   * Field that contains the signature data
   */

  /**
   * @cfg {String} name (optional)
   * Name of the created document, default will be the name of the original element
   */

  /**
   * @cfg {String} templateId (optional)
   * Object ID of the FOP template. Either this, or `signatureBasePath` and `signaturType` has to be set. If a `templateId` is defined, it has priority.
   */

  /**
   * @cfg {String} signatureBasePath (optional)
   * ARCPATH with the signatur types. If not set, `templateId` has to be defined. If a `templateId` is defined, it has priority.
   */

  /**
   * @cfg {String} signaturType (optional)
   * The template name for the signature (in the `signatureBasePath`). If not set, `templateId` has to be defined. If a `templateId` is defined, it has priority.
   */

  /**
   * @cfg {String} dstFolderId (optional)
   * Folder ID of the destination folder
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
    if (!me.templateId && !me.signatureBasePath) {
      throw "IllegalArgumentException: either a 'templateId' or 'signatureBasePath' has to be defined";
    }
    if (me.signatureBasePath && !me.signaturType) {
      throw "IllegalArgumentException: if a 'signatureBasePath' is defined, a 'signaturType' is mandatory";
    }
  },

  getName: function () {
    return "SignPdf";
  },

  process: function () {
    var me = this,
        wfDiagram, dataNode, blobValue, blobData, imageData, imageDataParts, fopRenderer, sord, srcObjUrl, srcTempFilePath,
        data, signatureFopResult, srcDocInputStream, signatureInputStream, mergedOutputStream;

    if (me.dataNodeName) {
      wfDiagram = sol.common.WfUtils.getWorkflow(me.flowId);
      dataNode = sol.common.WfUtils.getNodeByName(wfDiagram, me.dataNodeName);

      if (!dataNode) {
        throw "Data node '" + me.dataNodeName + "' not found.";
      }

      imageData = dataNode.properties + "";
    }

    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    if (me.field) {
      blobValue = sol.common.SordUtils.getValue(sord, me.field);
      blobData = JSON.parse(blobValue);
      imageData = blobData.signature;
    }

    if (!imageData) {
      throw "Image data is empty";
    }

    imageDataParts = imageData.split(";base64,");
    if (imageDataParts && (imageDataParts.length == 2)) {
      imageData = imageDataParts[1];
    }

    me.dstFolderId = me.dstFolderId || sord.parentId;
    me.name = me.name || sord.name;
    me.templateId = me.getTemplateId();

    data = { srcTempFilePath: srcTempFilePath, srcObjUrl: srcObjUrl, imageData: imageData, sord: sol.common.SordUtils.getTemplateSord(sord).sord };

    me.logger.debug(["Create signature PDF: imageData={0}" + imageData]);

    fopRenderer = sol.create("sol.common.as.renderer.Fop", { templateId: me.templateId, toStream: true });
    signatureFopResult = fopRenderer.render(me.name, data);

    signatureInputStream = me.convertOutputStreamToInputStream(signatureFopResult.outputStream);

    srcDocInputStream = sol.common.RepoUtils.downloadToStream(me.objId);
    mergedOutputStream = new ByteArrayOutputStream();
    sol.common.as.PdfUtils.mergePdfStreams([srcDocInputStream, signatureInputStream], mergedOutputStream);
    sol.common.RepoUtils.saveToRepo({ objId: me.objId, name: me.name, outputStream: mergedOutputStream, extension: "pdf" });

    return { passOn: true };
  },

  /**
   * @private
   * Converts an output stream to an input stream
   * @param {java.io.OutputStream} outputStream
   * @return {java.io.InputStream}
   */
  convertOutputStreamToInputStream: function (outputStream) {
    if (!outputStream) {
      throw "Output stream is empty";
    }
    var inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    outputStream.close();
    return inputStream;
  },

  /**
   * @private
   * @return {String}
   */
  getTemplateId: function () {
    var me = this;
    return me.templateId || sol.common.RepoUtils.getObjIdFromRelativePath(me.signatureBasePath, "/" + me.signaturType);
  }
});
