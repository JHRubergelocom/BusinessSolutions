importPackage(Packages.de.elo.ix.client);

//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.pubsec.Utils.js
//@include lib_sol.pubsec.FilingPlanUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.services.FilingPlanAcl" });

globalScope.$pubsec = globalScope.$pubsec || {};
globalScope.$pubsec.filingPlanAclRegistry = globalScope.$pubsec.filingPlanAclRegistry || {};


/**
 * Customized ACL inheritance for filing plan elements.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ix.RfUtils
 * @requires sol.pubsec.Utils
 * @requires sol.pubsec.FilingPlanUtils
 */
sol.define("sol.pubsec.ix.services.FilingPlanAclChecks", {
  extend: "sol.common.ix.ServiceBase",

  isEnabled: function () {
    var me = this,
        enabled = false,
        cfg, sord;

    cfg = sol.pubsec.Utils.loadConfig();

    if (me.objId) {
      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbLean, LockC.NO);
      enabled = sol.pubsec.FilingPlanUtils.isAclInheritanceApplicable(sord);
    } else {
      enabled = cfg.filingPlan.aclInheritanceBreaker.enabled;
    }

    return { enabled: enabled };
  }

});

/**
 * Customized ACL inheritance for filing plan elements.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ix.RfUtils
 * @requires sol.pubsec.Utils
 * @requires sol.pubsec.FilingPlanUtils
 */
sol.define("sol.pubsec.ix.services.FilingPlanAcl", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["mode", "startObjId", "aclChanges"],

  process: function () {
    var me = this,
        executorFunction;

    me.startSord = ixConnect.ix().checkoutSord(me.startObjId, SordC.mbLean, LockC.NO);

    if (!sol.pubsec.FilingPlanUtils.isAclInheritanceApplicable(me.startSord)) {
      return;
    }

    me.config = sol.pubsec.Utils.loadConfig();

    me.addedAclItems = me.deserializeAclArray(me.aclChanges.addedAcl);
    me.removedAclItems = me.deserializeAclArray(me.aclChanges.removedAcl);

    switch (me.mode) {
      case "REGISTER":
        executorFunction = me.checkAndRegister;
        break;
      case "EXECUTE":
        executorFunction = me.executeAclChanges;
        break;
      default:
        throw "IllegalStateException: '" + me.mode + "' is not a valid mode";
    }

    if ((me.addedAclItems.length > 0) || (me.removedAclItems.length > 0)) {
      executorFunction.call(me);
    }
  },

  checkAndRegister: function () {
    var me = this;

    me.walk(me.checkPermission);
    globalScope.$pubsec.filingPlanAclRegistry[me.startSord.guid] = me.aclChanges;
  },

  executeAclChanges: function () {
    var me = this;
    me.walk(me.updateAcl);
  },

  deserializeAclArray: function (jsonAclItems) {
    var aclItems = [];
    if (jsonAclItems && (jsonAclItems.length > 0)) {
      jsonAclItems.forEach(function (aclItemString) {
        aclItems.push(sol.common.JsonUtils.deserialize(aclItemString, "de.elo.ix.client.AclItem"));
      });
    }
    return aclItems;
  },

  walk: function (visitorFct) {
    var me = this,
        walkFct;

    walkFct = function (sord) {
      var children;

      if (sol.pubsec.FilingPlanUtils.isAclInheritanceApplicable(sord)) {
        visitorFct.call(me, sord);
        if (sol.common.SordUtils.isFolder(sord)) {
          children = sol.common.RepoUtils.findChildren(String(sord.id), {
            includeFolders: true,
            includeDocuments: false,
            includeReferences: false,
            sordZ: SordC.mbLean,
            objKeysObj: { SOL_TYPE: "\"" + me.config.filingPlan.aclInheritanceBreaker.processedSolTypes.join("\" OR \"") + "\"" }
          });

          if (children && (children.length > 0)) {
            children.forEach(walkFct);
          }
        }
      }
    };

    walkFct(me.startSord);
  },

  checkPermission: function (sord) {
    if (!sol.common.AclUtils.hasEffectiveRights(sord, { rights: { r: true, w: true, p: true } })) {
      throw "No permission to alter filing plan ACL";
    }
  },

  updateAcl: function (sord) {
    var me = this;

    sord.aclItems = ixConnect.ix().combineAcl(sord.aclItems, me.addedAclItems, null).sum;
    sord.aclItems = ixConnect.ix().combineAcl(sord.aclItems, me.removedAclItems, null).difference;

    ixConnect.ix().checkinSord(sord, new SordZ(SordC.mbAclItems), LockC.NO);
  }

});


/**
 * @member sol.pubsec.ix.services.FilingPlanAclChecks
 * @method RF_sol_pubsec_service_FilingPlanAclChange_Enabled
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_FilingPlanAclChange_Enabled(ec, args) {
  var params, modul, result;

  logger.enter("RF_sol_pubsec_service_FilingPlanAclChange_Enabled", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  modul = sol.create("sol.pubsec.ix.services.FilingPlanAclChecks", params);
  result = JSON.stringify(modul.isEnabled());

  logger.exit("RF_sol_pubsec_service_FilingPlanAclChange_Enabled", result);

  return result;
}

/**
 * @member sol.pubsec.ix.services.FilingPlanAcl
 * @method RF_sol_pubsec_service_RegisterFilingPlanAclChange
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_pubsec_service_RegisterFilingPlanAclChange(ec, args) {
  var params, modul;

  logger.enter("RF_sol_pubsec_service_RegisterFilingPlanAclChange", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "startObjId", "aclChanges");
  params.mode = "REGISTER";

  modul = sol.create("sol.pubsec.ix.services.FilingPlanAcl", params);
  modul.process();

  logger.exit("RF_sol_pubsec_service_RegisterFilingPlanAclChange");
}

/**
 * This asynchronous event is raised after a Sord object has been written and executes ACL inheritance on the filingplan if changed have been registered for the element.
 * @static
 * @member sol.pubsec.ix.services.FilingPlanAcl
 * @method onAfterCheckinSord
 * @param {de.elo.ix.client.IXServerEventsContext} ec
 * @param {de.elo.ix.client.Sord} sord
 * @param {de.elo.ix.client.Sord} sordCurrent
 * @param {de.elo.ix.client.Sord} sordParent
 * @param {de.elo.ix.client.LockZ} sordZ
 * @param {de.elo.ix.client.SordZ} lockZ
 * @throws RemoteException Exception thrown by the script itself or scripting engine.
 */
function onAfterCheckinSord(ec, sord, sordCurrent, sordParent, sordZ, lockZ) {
  var registeredAclChanges, event;

  if (!globalScope.$pubsec || !globalScope.$pubsec.filingPlanAclRegistry || !globalScope.$pubsec.filingPlanAclRegistry[sord.guid]) {
    return;
  }

  // Cleanup as first step to aviod concurrent access from competing events
  registeredAclChanges = globalScope.$pubsec.filingPlanAclRegistry[sord.guid];
  delete globalScope.$pubsec.filingPlanAclRegistry[sord.guid];

  logger.enter("onAfterCheckinSord_SetFilingPlanAcl");
  try {
    event = sol.create("sol.pubsec.ix.services.FilingPlanAcl", {
      startObjId: String(sord.id),
      aclChanges: registeredAclChanges,
      mode: "EXECUTE"
    });
    event.process();
  } catch (ex) {
    logger.error("Exception in 'onAfterCheckinSord_SetFilingPlanAcl'", ex);
  }
  logger.exit("onAfterCheckinSord_SetFilingPlanAcl");
}
