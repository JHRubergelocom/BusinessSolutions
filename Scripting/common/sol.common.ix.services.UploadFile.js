
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.UploadFile" });

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * Uploads a file into a folder (objId) and returns the objId and guid of the created file.
 *
 * @cfg {String} objId (required) target folder
 * @cfg {String} base64Content (required) base64 String
 * @cfg {String} extension  (required) file extension (jpg, png)
 * @cfg {Number} encryptionSet (optional) encryption set
 * @cfg {Object} cfg (required)
 * @cfg {String} cfg.maskName (required) mask name for target file
 * @cfg {String} cfg.fileName (required) file name for target file
 * @cfg {String} cfg.extension (optional) extension e.g. "png". will use "jpg" as fallback if undefined
 * @cfg {String} cfg.type (optional) sord type for target file
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.RepoUtils
 *
 */
sol.define("sol.common.ix.services.UploadFile", {
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
        dstObjId, dstGuid, targetFolder, oldFileId, configForSaveToRepo, fileName = me.cfg.fileName || me.cfg.pictureName, sord;

    targetFolder = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO).id;
    fileName = ~fileName.indexOf("{{") ? sol.common.TemplateUtils.render(fileName) : fileName;

    configForSaveToRepo = {
      name: fileName,
      base64Content: me.base64Content,
      extension: me.extension,
      encryptionSet: me.encryptionSet,
      maskId: me.cfg.maskName
    };

    oldFileId = me.docExists(targetFolder, fileName, me.cfg.maskName, me.extension);
    configForSaveToRepo[(oldFileId ? "objId" : "parentId")] = oldFileId || targetFolder;

    dstObjId = sol.common.RepoUtils.saveToRepo(configForSaveToRepo);
    sord = ixConnect.ix().checkoutSord(dstObjId, EditInfoC.mbSord, LockC.NO).sord;
    dstGuid = sord.guid;

    if (me.cfg.type) {
      try {
        sord.type = sol.common.SordTypeUtils.getSordTypeId(me.cfg.type);
      } catch (e) {
        me.logger.debug("could not retrieve sordtype via id", e);
        throw "UploadFile: could not retrieve sordtype via id `" + me.cfg.type + "`";
      }
      try {
        ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
      } catch (e) {
        me.logger.debug("updating sord type failed during checkin", e);
        throw "UploadFile: updating sord type failed during checkin.";
      }
    }

    return { objId: dstObjId, guid: String(dstGuid) };
  }
});

/**
 * @member sol.common.ix.services.UploadFile
 * @method RF_sol_common_service_UploadFile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_UploadFile(iXSEContext, args) {
  logger.enter("RF_sol_common_service_UploadFile", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "base64Content", "cfg");
  service = sol.create("sol.common.ix.services.UploadFile", {
    objId: params.objId,
    base64Content: params.base64Content,
    extension: params.extension,
    encryptionSet: params.encryptionSet,
    cfg: params.cfg
  });
  result = JSON.stringify(service.process());
  logger.exit("RF_sol_common_service_UploadFile", result);

  return result;
}

/**
 * @deprecated moved here from common_document for backwards compatibility
 * @member sol.common_document.ix.services.UploadFile
 * @method RF_sol_common_document_service_UploadFile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_UploadFile(iXSEContext, args) {
  logger.enter("RF_sol_common_document_service_UploadFile", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "base64Content", "cfg");
  service = sol.create("sol.common.ix.services.UploadFile", {
    objId: params.objId,
    base64Content: params.base64Content,
    extension: params.extension || "jpg",
    encryptionSet: params.encryptionSet,
    cfg: params.cfg
  });
  result = JSON.stringify(service.process());
  logger.exit("RF_sol_common_document_service_UploadFile", result);

  return result;
}