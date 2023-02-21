
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.services.UploadPhoto" });

/**
 * Uploads a visitor image
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.Logger
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.RepoUtils
 * 
 * # IX function call example:
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_dev_service_UploadPhoto", { visitorObjId: ELO_PARAMS.ELO_OBJID, base64Content: base64Content });
 *     
 */
sol.define("sol.dev.ix.services.UploadPhoto", {
  extend: "sol.common.ix.ServiceBase",
  requiredConfig: ["visitorObjId", "base64Content"],
  
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },
  
  setGuidInVisitor: false,

  /**
   * Uploads the given file base64 content
   * @return {Object} Contains the `objId` of the uploaded image
   */
  process: function () {
    var me = this,
        visitorConfig, photoName, dstObjId, dstGuid, visitorFolder, maskId;
    
    visitorConfig = sol.create("sol.common.Config", { compose: "/development_internal/Configuration/dev_internal.config" }).config;
    maskId = visitorConfig.visitor.visitorDocumentMask;  
     
    visitorFolder = ixConnect.ix().checkoutSord(me.visitorObjId, SordC.mbAllIndex, LockC.NO);
    photoName = sol.create("sol.common.Template", { source: visitorConfig.visitor.photoNameTemplate }).applySord(visitorFolder);

    dstObjId = sol.common.RepoUtils.saveToRepo({ parentId: me.visitorObjId, name: photoName, base64Content: me.base64Content, extension: me.extension, maskId: maskId });
    dstGuid = ixConnect.ix().checkoutSord(dstObjId, SordC.mbOnlyId, LockC.NO).guid;
    
    if (me.setGuidInVisitor) {
      sol.common.SordUtils.setObjKeyValue(visitorFolder, visitorConfig.visitor.photoGuidFieldName, dstGuid);
      ixConnect.ix().checkinSord(visitorFolder, SordC.mbAllIndex, LockC.NO);
    }
	
    return { objId: dstObjId, guid: String(dstGuid)};
  }
});

/**
 * @member sol.dev.ix.services.UploadPhoto
 * @method RF_sol_dev_service_UploadPhoto
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_dev_service_UploadPhoto(iXSEContext, args) {
  logger.enter("RF_sol_dev_service_UploadPhoto", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "visitorObjId", "base64Content");
  service = sol.create("sol.dev.ix.services.UploadPhoto", { visitorObjId: params.visitorObjId, base64Content: params.base64Content, extension: "jpg" });
  result = JSON.stringify(service.process());  
  logger.exit("RF_sol_dev_service_UploadPhoto", result);
  return result;
}
