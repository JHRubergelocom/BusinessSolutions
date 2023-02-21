
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.VisitorGroupMembers" });

/**
 * Reads and writes visitor group members
 *
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |||
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 *
 */
sol.define("sol.visitor.ix.services.ReadVisitorGroupMembers", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Number} visitorGroupGuid
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        visitorGroupMembers = [],
        visitorGroupMemberSords, i, visitorGroupMemberSord, tplSord, result;

    visitorGroupMemberSords = sol.common.RepoUtils.findChildren(me.visitorGroupObjId);

    for (i = 0; i < visitorGroupMemberSords.length; i++) {
      visitorGroupMemberSord = visitorGroupMemberSords[i];

      tplSord = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: visitorGroupMemberSord,
          config: {
            sordKeys: ["id", "guid", "name"],
            objKeys: ["VISITOR_FIRSTNAME", "VISITOR_LASTNAME", "VISITOR_COMPANYNAME", "VISITOR_MAIL", "VISITOR_PHONE", "VISITOR_STATUS"],
            mapKeys: ["VISITOR_GROUPRESPONSIBLE", "VISITOR_INTERNALVISITOR"]
          }
        }
      }).sord;
      visitorGroupMembers.push(tplSord);
    }

    result = { visitorGroupMembers: visitorGroupMembers };

    return result;
  }
});

sol.define("sol.visitor.ix.services.WriteVisitorGroupMembers", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Number} bla
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.visitorConfig = sol.visitor.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        visitorGroupMemberSords, key, entry, sordEnumeration, sord;

    if (!me.data) {
      return {};
    }

    me.visitorGroupMemberCache = sol.create("sol.common.Cache", {});
    visitorGroupMemberSords = sol.common.RepoUtils.findChildren(me.visitorGroupObjId);
    visitorGroupMemberSords.forEach(function (visitorGroupMemberSord) {
      me.visitorGroupMemberCache.put(visitorGroupMemberSord.id + "", visitorGroupMemberSord);
    });

    for (key in me.data) {
      entry = me.data[key];
      me.writeEntry(entry);
    }

    sordEnumeration = me.visitorGroupMemberCache.elements();
    while (sordEnumeration.hasMoreElements()) {
      sord = sordEnumeration.nextElement();
      ixConnect.ix().deleteSord(null, sord.id, LockC.NO, new DeleteOptions());
    }

    return {};
  },

  writeEntry: function (entry) {
    var me = this,
        visitorGroupMemberSord, keyValues, valuesObj, firstName, lastName, visitorGroupSord;

    visitorGroupMemberSord = me.visitorGroupMemberCache.remove(entry.objId);

    if (visitorGroupMemberSord) {
      keyValues = sol.common.SordUtils.updateSord(visitorGroupMemberSord, entry.data);
      ixConnect.ix().checkinSord(visitorGroupMemberSord, SordC.mbAllIndex, LockC.NO);
      if (keyValues) {
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, visitorGroupMemberSord.id, visitorGroupMemberSord.id, keyValues, LockC.NO);
      }
    } else {
      visitorGroupMemberSord = me.createVisitorGroupMemberSord(entry.data);
    }

    sol.common.IxUtils.execute("RF_sol_visitor_function_generateVisitorName", {
      objId: visitorGroupMemberSord.id,
      applyIdentifier: true,
      updateExisting: true
    });
  },

  createVisitorGroupMemberSord: function (sordData) {
    var me = this,
        visitorGroupSord, visitorType, visitorTplBasePath, visitorTplId,
        newVisitorId, newVisitorSord, keyValues;

    visitorGroupSord = ixConnect.ix().checkoutSord(me.visitorGroupObjId, SordC.mbAllIndex, LockC.NO);
    visitorType = sol.common.SordUtils.getObjKeyValue(visitorGroupSord, "VISITOR_SUBTYPE");

    visitorTplBasePath = me.visitorConfig.generators.templateFolderIds.visitorTypes;
    visitorTplId = sol.common.RepoUtils.getObjIdFromRelativePath(visitorTplBasePath, "/" + visitorType);

    if (!visitorTplId) {
      throw "Can't find single visitor template '" + visitorType + "'";
    }

    newVisitorId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: me.visitorGroupObjId,
      source: visitorTplId,
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: visitorType,
      asAdmin: true,
      useQuickCopy: true,
      metadata: [
        { type: "GRP", key: "SOL_TYPE", value: me.visitorConfig.visitor.solTypeVisitor }
      ],
      acl: {
        mode: "SET",
        entries: [
          { userName: me.userName, rights: { r: true, w: true, d: true, e: true, l: true } }
        ]
      }
    });

    newVisitorSord = ixConnect.ix().checkoutSord(newVisitorId, SordC.mbAllIndex, LockC.NO);

    keyValues = sol.common.SordUtils.updateSord(newVisitorSord, sordData);

    ixConnect.ix().checkinSord(newVisitorSord, SordC.mbAllIndex, LockC.NO);

    if (keyValues) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, newVisitorSord.id, newVisitorSord.id, keyValues, LockC.NO);
    }

    sol.common.IxUtils.execute("RF_sol_visitor_function_GenerateVisitorReference", {
      objId: newVisitorId,
      applyIdentifier: true
    });

    return newVisitorSord;
  }
});

/**
 * @member sol.visitor.ix.services.ReadVisitorGroupmembers
 * @method RF_sol_visitor_service_ReadVisitorGroupMembers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 *
 * Example:
 *
 *     RF_sol_visitor_service_ReadVisitorGroupMembers
 *     {
 *       "visitorGroupObjId": "1234"
 *     }
 */
function RF_sol_visitor_service_ReadVisitorGroupMembers(ec, args) {
  var service, config, result, resultString;

  logger.enter("RF_sol_visitor_service_ReadVisitorGroupMembers", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "visitorGroupObjId");

  service = sol.create("sol.visitor.ix.services.ReadVisitorGroupMembers", config);
  result = service.process();
  resultString = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_visitor_service_ReadVisitorGroupMembers", resultString);

  return resultString;
}

/**
 * @member sol.visitor.ix.services.WriteVisitorGroupmembers
 * @method RF_sol_visitor_service_WriteVisitorGroupMembers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 *
 * Example:
 *
 *     RF_sol_visitor_service_WriteVisitorGroupMembers
 *     {
 *     }
 */
function RF_sol_visitor_service_WriteVisitorGroupMembers(ec, args) {
  var service, config, result, resultString;

  logger.enter("RF_sol_visitor_service_WriteVisitorGroupMembers", args);
  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "visitorGroupObjId", "data");

  config.userName = ec.user.name + "";

  service = sol.create("sol.visitor.ix.services.WriteVisitorGroupMembers", config);
  result = service.process();

  resultString = sol.common.ix.RfUtils.stringify(result);
  logger.exit("RF_sol_visitor_service_WriteVisitorGroupMembers", resultString);

  return resultString;
}