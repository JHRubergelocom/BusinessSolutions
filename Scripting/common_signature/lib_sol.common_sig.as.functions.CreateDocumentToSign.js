
importPackage(Packages.de.elo.ix.client);

var logger = sol.create("sol.Logger", { scope: "sol.common_sig.as.functions.CreateDocumentToSign" });

/**
 * Checks whether a document and user are specified, copies the doc into the parent object and starts the workflow to sign it.
 *
 * The User will be set on the workflow node with the kay `sol.common_sig.wf.user.signDocument`.
 *
 * If `documentBasePath` and `documentTypeSource` are defined, this function will copy a template to the target specified by `objId`.
 * If neither of those are defined, the finction will try to convert and sign the element specified by `objId`.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  handlebars
 * @requires  moment
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.IxUtils
 * @requires  sol.common.SordMap
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.Template
 * @requires  sol.common.as.Utils
 * @requires  sol.common.as.FunctionBase
 * @requires  sol.common.as.functions.OfficeConverter
 *
 */
sol.define("sol.common_sig.as.functions.CreateDocumentToSign", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["objId", "wfTemplate", "wfNameTemplate", "userSource"],

  /**
   * @cfg {String} objId (required) This is either the id of the target (in case `documentBasePath` and `documentTypeSource` are definied) or the id of the document which should be signed.
   */

  /**
   * @cfg {String} wfTemplate (required) The name of the workflow template which should be started
   */

  /**
   * @cfg {String} wfNameTemplate (required) The template for the name of the started workflow (in handlebars syntax: `sord` and `wfDate` are available)
   */

  /**
   * @cfg {Object} userSource (required) Definition where the signing user should be read from (see {@link sol.common.SordUtils#getValue} for object definition)
   */

  /**
   * @cfg {String} documentBasePath (optional) ARCPATH with the documents which could be signed
   */

  /**
   * @cfg {Object} documentTypeSource (optional) Definition where the selected document type should be read from (see {@link sol.common.SordUtils#getValue} for object definition)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  /**
   * Creates a document to sign and starts the signing workflow.
   * @return {Object}
   */
  process: function () {
    var me = this,
        keyValues = [],
        sord, documentType, userName, convertObjId, convertSord, objId, documentMap, tplSord, wfName, flowId, wfDiagram, i, node, objKey,
        formSpec;

    me.logger.enter("sol.common_sig.as.functions.CreateDocumentToSign");

    sord = sol.common.RepoUtils.getSord(me.objId);
    userName = sol.common.SordUtils.getValue(sord, me.userSource);
    keyValues.push(new KeyValue(me.userSource.key, ""));

    if (me.documentBasePath && me.documentTypeSource) {
      me.logger.debug(["Copy document template '{0}' to '{1}'", documentType, sord.id]);
      documentType = sol.common.SordUtils.getValue(sord, me.documentTypeSource);
      convertObjId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
        objId: sord.id,
        source: me.getTemplateArcPath(documentType, me.documentBasePath),
        copySourceAcl: false,
        inheritDestinationAcl: true,
        name: documentType,
        asAdmin: true
      });
      keyValues.push(new KeyValue(me.documentTypeSource.key, ""));
    } else {
      me.logger.debug("Use original object for signing");
      convertObjId = sord.id;
    }

    if (userName && (userName != "")) {
      me.logger.debug("start signing process");
      convertSord = sol.common.RepoUtils.getSord(convertObjId, { sordZ: SordC.mbAll });
      objId = me.convertToPdf(convertSord);

      if (objId !== "-1") {
        documentMap = sol.create("sol.common.SordMap", { objId: objId });
        documentMap.read();
        formSpec = documentMap.getValue("SIGNATURE_FORMSPEC");
        documentMap.setValue("SIGNATURE_LANGUAGE", ixConnect.loginResult.clientInfo.language + "");

        for (i = 0; i < sord.objKeys.length; i++) {
          objKey = sord.objKeys[i];
          documentMap.setValue(objKey.name, sol.common.SordUtils.getObjKeyValue(sord, objKey.name));
        }

        documentMap.write();

        tplSord = sol.common.SordUtils.getTemplateSord(sord).sord;
        wfName = sol.create("sol.common.Template", { source: me.wfNameTemplate }).apply({ sord: tplSord, wfDate: new Date() });

        flowId = ixConnect.ix().startWorkFlow(me.wfTemplate, wfName, objId);

        me.logger.debug(["flowId={0}", flowId]);

        wfDiagram = ixConnect.ix().checkoutWorkFlow(flowId.toString(), WFTypeC.ACTIVE, WFDiagramC.mbAll, LockC.YES);
        if (wfDiagram && wfDiagram.nodes) {
          for (i = 0; i < wfDiagram.nodes.length; i++) {
            node = wfDiagram.nodes[i];

            me.logger.debug(["node={0}; nodename={1}; nameTranslationKey={2}", node.type, node.name, node.nameTranslationKey]);

            if (node.nameTranslationKey == "sol.common_sig.wf.user.signDocument") {
              node.userName = userName;
              if (formSpec) {
                node.formSpec = formSpec;
              }
            }
          }
        }
        ixConnect.ix().checkinWorkFlow(wfDiagram, WFDiagramC.mbAll, LockC.YES);

        me.logger.info(["Started signing process for '{0}' on '{1}' (objId={2}, flowId={3})", userName, convertSord.name, convertSord.id, flowId]);

        if (keyValues && (keyValues.length > 0)) {
          ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, keyValues, LockC.NO);
        }
      }
    }

    me.logger.exit("sol.common_sig.as.functions.CreateDocumentToSign");

    return { passOn: true };
  },

  /**
   * @private
   * Converts a document to a PDF.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String} The objId of the converted document or '-1' if there was an error
   */
  convertToPdf: function (sord) {
    var me = this,
        objId = "-1",
        ext, converter, convertResult;
    me.logger.enter("convertToPdf");
    try {
      ext = (sord && sord.docVersion && sord.docVersion.ext) ? sord.docVersion.ext : null;
      if (ext && (ext == "pdf")) {
        me.logger.debug("skip converting, document is already an PDF");
        objId = sord.id;
      } else {
        converter = sol.create("sol.common.as.functions.OfficeConverter", {
          openFromRepo: {
            objId: sord.id
          },
          saveToRepo: {
            format: "pdf",
            parentId: sord.parentId,
            name: sord.name
          }
        });
        if (converter.isSupported(ext)) {
          convertResult = converter.execute();
          if (convertResult && convertResult.objId) {
            objId = convertResult.objId;
          }
        } else {
          me.logger.warn(["format '{0}' is not supported", ext]);
        }
      }
    } catch (ex) {
      me.logger.error(["error converting document (objId={0}, name={1})", sord.id, sord.name], ex);
    }
    me.logger.exit("convertToPdf");
    return objId;
  },

  /**
   * @private
   * @param {String} documentType
   * @param {String} basePath
   * @return {String}
   */
  getTemplateArcPath: function (documentType, basePath) {
    return sol.common.RepoUtils.getObjIdFromRelativePath(basePath, "/" + documentType);
  }
});
