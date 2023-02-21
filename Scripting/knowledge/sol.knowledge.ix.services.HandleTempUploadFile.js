importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", {
  scope: "sol.knowledge.ix.services.HandleTempUploadFile"
}); // eslint-disable-line one-var

/**
 * @private
 */
sol.define("sol.knowledge.ix.services.HandleTempUploadFile", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId", "type"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  process: function () {
    var me = this,
      target, sord;

    target = me.getTarget();
    if (target) {
      sol.common.RepoUtils.moveSords([me.objId], target, {
        adjustAclOverwrite: false
      });
    }

    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbLean, LockC.NO);
    // knowledge users should not require the right to change masks.
    sord = ixConnectAdmin.ix().changeSordMask(sord, me.getMask(), EditInfoC.mbSordLean).sord;
    ixConnectAdmin.ix().checkinSord(sord, SordC.mbLean, LockC.NO);
  },

  getTarget: function () {
    var me = this;
    switch (me.type) {
      case "file":
        return me.config.boardUpload.fileUpload;
      case "image":
        return me.config.boardUpload.imageUpload;
      default:
        return "";
    }
  },

  getMask: function () {
    var me = this;
    return me.config.boardUpload.mask;
  }

});

/**
 * @member sol.knowledge.ix.services.HandleTempUploadFile
 * @method RF_sol_knowledge_service_HandleTempUploadFile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase# RF_ServiceBaseName
 */
function RF_sol_knowledge_service_HandleTempUploadFile(ec, args) {
  var params, module;

  logger.enter("RF_sol_knowledge_service_HandleTempUploadFile", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "type"),
    module = sol.create("sol.knowledge.ix.services.HandleTempUploadFile", params),
    module.process();
  logger.exit("RF_sol_knowledge_service_HandleTempUploadFile");
}