
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.common_document.ix.services.UploadFile" });

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * Uploads a photo into a folder (objId) and returns the objId and guid of the created photo.
 *
 * @cfg {String} objId (required) target folder
 * @cfg {String} base64Content (required) base64 String
 * @cfg {String} extension  (required) file extension (jpg, png)
 * @cfg {Object} cfg (required)
 * @cfg {String} cfg.maskName (required) mask name for target file
 * @cfg {String} cfg.pictureName (required) file name for target file
 * @cfg {String} cfg.extension (optional) extension e.g. "png". will use "jpg" as fallback if undefined
 *
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.RepoUtils
 *
 */
sol.define("sol.common_document.ix.services.UploadFile", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["objId", "base64Content"],

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
   * Uploads the given file base64 content
   * @return {Object} Contains the `objId` of the uploaded image
   */
  process: function () {
    var me = this,
        dstObjId, dstGuid, targetFolder, oldPhotoId, configForSaveToRepo, pictureName = me.cfg.pictureName;

    targetFolder = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO).id;
    pictureName = ~pictureName.indexOf("{{") ? sol.common.TemplateUtils.render(pictureName) : pictureName;

    configForSaveToRepo = { name: pictureName, base64Content: me.base64Content, extension: me.extension, maskId: me.cfg.maskName };
    oldPhotoId = me.docExists(targetFolder, pictureName, me.cfg.maskName, me.extension);
    configForSaveToRepo[(oldPhotoId ? "objId" : "parentId")] = oldPhotoId || targetFolder;

    dstObjId = sol.common.RepoUtils.saveToRepo(configForSaveToRepo);
    dstGuid = ixConnect.ix().checkoutSord(dstObjId, SordC.mbOnlyId, LockC.NO).guid;

    return { objId: dstObjId, guid: String(dstGuid) };
  }
});

/**
 * @member sol.common_document.ix.services.UploadFile
 * @method RF_sol_common_document_service_UploadFile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_UploadFile(iXSEContext, args) {
  logger.enter("RF_sol_common_document_service_UploadFile", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "base64Content", "cfg");
  service = sol.create("sol.common_document.ix.services.UploadFile", { objId: params.objId, base64Content: params.base64Content, extension: params.extension || "jpg", cfg: params.cfg });
  result = JSON.stringify(service.process());
  logger.exit("RF_sol_common_document_service_UploadFile", result);
  return result;
}
