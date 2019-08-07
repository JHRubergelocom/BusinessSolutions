
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.SolCommonAclUtils" });

/**
 * Unittests of Methods in 'sol.common.AclUtils'.
 *
 * As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_SolCommonAclUtils', {
 *       method: 'addRights',
 *       params: {
 *                 objId: '4711',
 *                 users: ["baum", "renz"],
 *                 rights: { r: true, w: true, d: false, e: false, l: false, p: true},
 *                 config: {}
 *               }
 *     });
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common.ix.RepoUtils
 * @requires  sol.common.ix.AclUtils
 */
sol.define("sol.unittest.ix.services.SolCommonAclUtils", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["method", "params"],

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object} params Method parameters.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        result = {};

    switch (me.method) {
      case "addRights":
        result = sol.common.AclUtils.addRights(me.params.objId, me.params.users, me.params.rights, me.params.config);
        break;
      case "removeRights":
        result = sol.common.AclUtils.removeRights(me.params.objId, me.params.users, me.params.rights, me.params.config);
        break;
      case "restoreRights":
        result = sol.common.AclUtils.restoreRights(me.params.objId, me.params.config);
        break;
      case "editRights":
        result = sol.common.AclUtils.editRights(me.params.objId, me.params.users, me.params.rights, me.params.config, me.params.combineAclFunction);
        break;
      case "retrieveUserAcl":
        result = sol.common.AclUtils.retrieveUserAcl(me.params.users, me.params.accessCode, me.params.asAdmin);
        break;
      case "retrieveAndGroupAcl":
        result = sol.common.AclUtils.retrieveAndGroupAcl(me.params.andGroup, me.params.defaultAccessCode, me.params.asAdmin);
        break;
      case "retrieveSordAcl":
        result = sol.common.AclUtils.retrieveSordAcl(me.params.sord, me.params.accessCode);
        break;
      case "retrieveElements":
        result = sol.common.AclUtils.retrieveElements(me.params.objId, me.params.recursive, me.params.asAdmin);
        break;
      case "addSordRights":
        result = sol.common.AclUtils.addSordRights(me.params.oldAclList, me.params.newAclList, me.params.asAdmin);
        break;
      case "removeSordRights":
        result = sol.common.AclUtils.removeSordRights(me.params.oldAclList, me.params.newAclList, me.params.asAdmin);
        break;
      case "editSordRights":
        result = result = sol.common.AclUtils.editSordRights(me.params.sord, me.params.params);
        break;
      case "restoreSordRights":
        result = sol.common.AclUtils.restoreSordRights(me.params.sord, me.params.params);
        break;
      case "createAclItemFromUserInfo":
        result = sol.common.AclUtils.createAclItemFromUserInfo(me.params.userInfo, me.params.accessCode);
        break;
      case "createAclItemFromAcl":
        result = sol.common.AclUtils.createAclItemFromAcl(me.params.aclItem, me.params.accessCode);
        break;
      case "createAccessCode":
        result = sol.common.AclUtils.createAccessCode(me.params.rights);
        break;
      case "changeRightsInBackground":
        result = sol.common.AclUtils.changeRightsInBackground(me.params.objId, me.params.config);
        break;
      case "changeRightsInBackground":
        result = sol.common.AclUtils.changeRightsInBackground(me.params.objId, me.params.config);
        break;
      case "checkPreconditions":
        result = sol.common.AclUtils.checkPreconditions(me.params.objId, me.params.config);
        break;
      case "initializeRights":
        result = sol.common.AclUtils.initializeRights(me.params.newAclItems, me.params.objId, me.params.config, me.params.conn);
        break;
      case "appendInheritedAcl":
        result = sol.common.AclUtils.appendInheritedAcl(me.params.newAclItems, me.params.objId, me.params.config, me.params.conn);
        break;
      case "appendUserAcl":
        result = sol.common.AclUtils.appendUserAcl(me.params.newAclItems, me.params.objId, me.params.config, me.params.defaultAccessCode);
        break;
      case "appendAndGroupAcl":
        result = sol.common.AclUtils.appendUserAcl(me.params.newAclItems, me.params.objId, me.params.config, me.params.defaultAccessCode);
        break;
      case "canExecute":
        result = sol.common.AclUtils.canExecute(me.params.mode, me.params.aclItems);
        break;
      case "executeBackgroundAclJob":
        result = sol.common.AclUtils.executeBackgroundAclJob(me.params.conn, me.params.startIds, me.params.config, me.params.newAclItems);
        break;
      case "ixExecutesBackgroundJobsSynchronous":
        result = sol.common.AclUtils.ixExecutesBackgroundJobsSynchronous(me.params.conn);
        break;
      case "preprocessUsers":
        result = sol.common.AclUtils.preprocessUsers(me.params.objId, me.params.users);
        break;
      case "replaceUserNamePlaceholders":
        result = sol.common.AclUtils.replaceUserNamePlaceholders(me.params.userName, me.params.ctxSord, me.params.conn);
        break;
      case "enrichContextSord":
        result = sol.common.AclUtils.enrichContextSord(me.params.ctxSord, me.params.inclTplSord, me.params.conn);
        break;
      case "containsSessionUserAndhasEffectiveRights":
        result = sol.common.AclUtils.containsSessionUserAndhasEffectiveRights(me.params.rightsConfig);
        break;
      case "hasEffectiveRights":
        result = sol.common.AclUtils.hasEffectiveRights(me.params.sord, me.params.params);
        break;
      case "containsRights":
        result = sol.common.AclUtils.containsRights(me.params.accessCode, me.params.rights);
        break;
      default:
        throw "IllegalMethodException: Method " + me.method + " not supported";
    }
    return result;
  }
});

/**
 * @member sol.unittest.ix.services.SolCommonAclUtils
 * @method RF_sol_unittest_service_SolCommonAclUtils
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_SolCommonAclUtils(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_SolCommonAclUtils", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "method", "params");
  service = sol.create("sol.unittest.ix.services.SolCommonAclUtils", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_SolCommonAclUtils", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

