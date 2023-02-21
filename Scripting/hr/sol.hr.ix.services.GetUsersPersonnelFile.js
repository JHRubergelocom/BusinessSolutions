importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves the objId of a user's personnel file or empty string if no file was found.
 *
 * ### Result
 * 
 *     objId: sord.id,
 *     name: sord.name,
 *     desc: sol.common.SordUtils.getObjKeyValue(sord, "desc")
 *     sourceFolder: sord.sourceFolder (varies depending on template source)
 * 
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.services.GetUsersPersonnelFile", {
  extend: "sol.common.ix.ServiceBase",
  
  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],
  
  inject: {
    solutionType: { config: "hr", prop: "entities.file.services.userspersonnelfile.const.solutiontype", template: true }, // ""
    userIdField: { config: "hr", prop: "entities.file.services.userspersonnelfile.const.useridfield", template: true } // ""
  },
  
  findFile: function (userId) {
    var me = this, findInfo, findByIndex, objKeys, key1 = new ObjKey(), key2 = new ObjKey(), findResult, sord;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();

    findInfo.findByIndex = findByIndex;
    key1.name = me.userIdField;
    key1.data = [userId];
    key2.name = "SOL_TYPE";
    key2.data = [me.solutionType];
    objKeys = [
      key1, key2
    ];

    findByIndex.objKeys = objKeys;
    findByIndex.maskId = ""; //ignore mask

    findResult = ixConnectAdmin.ix().findFirstSords(findInfo, 1, SordC.mbAll);
    sord = findResult && findResult.sords && findResult.sords.length > 0 && findResult.sords[0];
    return sord.id && { objId: sord.id, name: sord.name } || {};
  },

  /**
   * Retrieves the data as specified in the constructor configuration.
   * @returns {String[]} Array with types
   */
  process: function () {
    var me = this;

    return (
      me.fileGuid
      ? (ixConnectAdmin.ix().checkoutSord(me.fileGuid, SordC.mbOnlyId, LockC.NO)).id
      : me.findFile(me.userId)
    );
  }
});

/**
 * @member sol.hr.ix.services.GetUsersPersonnelFile
 * @method RF_sol_common_service_GetUsersPersonnelFile
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetUsersPersonnelFile(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;
  
  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  serviceProc = sol.create("sol.hr.ix.services.GetUsersPersonnelFile", rfParams);
  result = rfUtils.stringify(serviceProc.process());
  return result;
}