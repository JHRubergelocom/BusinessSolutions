
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.privacy.ix.services.ExtendedParentDataCollector" });

/**
 * Collects all parent information from the hierarchy.
 *
 * The hierarchy will be returned as a flat structure.
 * The hierarchy will be enriched with information from the user folders for all specified fields.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 *
 */
sol.define("sol.privacy.ix.services.ExtendedParentDataCollector", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  USER_FIELD_DEFS: [
    { type: "MAP", key: "OVERALL_RESPONSIBLE" },
    { type: "MAP", key: "PROC_ACTIVITY_HEAD_OF_DEPARTMENT" },
    { type: "MAP", key: "DATA_PROTECTION_OFFICER" }
  ],

  USER_OBJKEYS: ["ELOTITLE", "ELOFULLNAME", "ELOMAILADDRESS", "ELOPHONENUMBER", "ELOMOBILENUMBER", "ELOFAXNUMBER", "ELOUSERPOSITION", "ELOLOCATION"],

  SORDKEYS: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],

  PROC_ACTIVITY_BLOBS: ["ACTIVITY_WHY", "ONLYLAWFULL_FIELDS", "RECIPIENT_THIRDCOUNTRY"],

  /**
   * @cfg {String} objId (required)
   * id of the parent element (guid, objId or archivepath)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
  },

  /**
   * Starts the collection of the desired data
   * @return {String}
   */
  execute: function () {
    var me = this,
        data = {};

    try {
      data = sol.common.IxUtils.execute("RF_sol_common_service_ParentDataCollector", {
        objId: me.objId,
        sordKeys: me.SORDKEYS,
        allMapFields: true
      });

      me.enhanceProcessingActivityData(data);
      me.expandUserData(data);

    } catch (ex) {
      me.logger.warn("Error collecting data, continue with data collected so far", ex);
    }

    return sol.common.JsonUtils.stringifyAll(data);
  },

  expandUserData: function (data) {
    var me = this,
        userData = {};

    me.USER_FIELD_DEFS.forEach(function (fieldCfg) {
      var user;
      try {
        user = sol.common.SordUtils.getValue(me.sord, fieldCfg);
        userData[fieldCfg.key] = me.getUserData(user, data.formatter);
      } catch (ex) {
        // ignore user data with exceptions
      }

    });

    data.users = userData;
  },

  getUserData: function (user, formatter) {
    var me = this,
        userFolderSord;

    userFolderSord = sol.common.UserUtils.getUserFolder(user);

    return sol.common.ObjectFormatter.format({
      sord: {
        formatter: formatter,
        data: userFolderSord,
        config: {
          allObjKeys: false,
          allMapFields: false,
          sordKeys: me.SORDKEYS,
          objKeys: me.USER_OBJKEYS
        }
      }
    }).sord;
  },

  enhanceProcessingActivityData: function (data) {
    var me = this;

    data.sord = me.getSordData(data.sord.id, data.formatter);
    if (data.sord.id == data.PROCESSING_ACTIVITY.id) {
      data.PROCESSING_ACTIVITY = data.sord;
    } else {
      data.PROCESSING_ACTIVITY = me.getSordData(data.PROCESSING_ACTIVITY.id, data.formatter);
    }
  },

  getSordData: function (objId, formatter) {
    var me = this,
        sord;

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbLean, LockC.NO);

    return sol.common.ObjectFormatter.format({
      sord: {
        formatter: formatter,
        data: sord,
        config: {
          allObjKeys: true,
          allMapFields: true,
          sordKeys: me.SORDKEYS,
          formBlobs: me.PROC_ACTIVITY_BLOBS
        }
      }
    }).sord;
  }
});

/**
 * @member sol.privacy.ix.services.ExtendedParentDataCollector
 * @method RF_sol_privacy_service_ExtendedParentDataCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_privacy_service_ExtendedParentDataCollector(ec, configAny) {
  var config, dataCollector, result;

  logger.enter("RF_sol_privacy_service_ExtendedParentDataCollector", configAny);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId");

  dataCollector = sol.create("sol.privacy.ix.services.ExtendedParentDataCollector", config);
  result = dataCollector.execute();

  logger.exit("RF_sol_privacy_service_ExtendedParentDataCollector", result);

  return result;
}

