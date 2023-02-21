
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.DataCollectorBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ParentDataCollector" });

/**
 * Collects all parent information from the hierarchy.
 *
 * The hierarchy will be returned as a flat structure.
 *
 * The result hierarchy contains the following properties:
 *
 * - sord: The selected element itself
 * - parent: The direct parent element
 * - SOL_TYPE: For each found SOL_TYPE one property (see {@link #mode}), could contain duplicates to 'parent' and 'sord'
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_service_ParentDataCollector", {
 *       objId: "5690",
 *       formatter: "sol.common.ObjectFormatter.StatisticSord"
 *     });
 *
 * # Result
 *
 *     {
 *       version: '1.00.000',
 *       formatter: 'sol.common.ObjectFormatter.StatisticSord',
 *       sord: {
 *         id: "5690",
 *         name: 'Annual report',
 *         O_INVOICE_DATE: '20160101'
 *       },
 *       parent: {
 *         id: "5669",
 *         name: '12 Public relations',
 *         O_INVOICE_DATE: '20151202'
 *       },
 *       FILE: {
 *         id: "5669",
 *         name: '12 Public relations',
 *         O_INVOICE_DATE: '20151202'
 *       },
 *       ...
 *     }
 *
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.ix.DataCollectorBase
 *
 */
sol.define("sol.common.ix.services.ParentDataCollector", {
  extend: "sol.common.ix.DataCollectorBase",

  requiredConfig: ["objId"],

  collectorVersion: "1.01.000",

  MODES: {
    FIRST_WINS: "FIRST_WINS",
    LAST_WINS: "LAST_WINS",
    ALL: "ALL"
  },

  DEFAULT_VALUES: {
    hierarchicalIdentifier: "SOL_TYPE",
    mode: "FIRST_WINS",
    formatter: "sol.common.ObjectFormatter.TemplateSord",
    sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
    allMapFields: false
  },

  /**
   * @cfg {String} objId (required)
   * id of the parent element (guid, objId or archivepath)
   */

  /**
   * @cfg {String} [hierarchicalIdentifier="SOL_TYPE"]
   * The value from this field will be used to collect the hierarchy
   */

  /**
   * @cfg {String} [mode="FIRST_WINS"]
   * The mode defines, which object from the hierarchy will be send with the result.
   *
   * - "FIRST_WINS": the first hit (upwards) in the hierarchy for each type wins
   * - "LAST_WINS": the last hit (upwards) in the hierarchy for each type wins
   * - "ALL": collects an array of the specific type (not implemented yet)
   *
   */

  /**
   * @cfg {String} [formatter="sol.common.ObjectFormatter.TemplateSord"]
   * Sord object formatter implementation.
   *
   * e.g. `sol.common.ObjectFormatter.StatisticSord` or `sol.common.ObjectFormatter.TemplateSord`
   */

  /**
   * @cfg {String[]} sordKeys
   * The data objects will contain this keys from the sord.
   * By default the following keys will be returned: ['id', 'guid', 'maskName', 'name', 'desc', 'IDateIso', 'XDateIso', 'ownerName']
   */

  /**
   * @cfg {Boolean} allMapFields
   * The data objects will contain all map fields.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.DataCollectorBase", "initialize", [config]);

    me.hierarchicalIdentifier = config.hierarchicalIdentifier || me.DEFAULT_VALUES.hierarchicalIdentifier;
    me.mode = config.mode || me.DEFAULT_VALUES.mode;
    me.formatter = config.formatter || me.DEFAULT_VALUES.formatter;
    me.sordKeys = config.sordKeys || me.DEFAULT_VALUES.sordKeys;
    me.allMapFields = config.allMapFields || me.DEFAULT_VALUES.allMapFields;
  },

  /**
   * Starts the collection of the desired data
   * @return {String}
   */
  execute: function () {
    var me = this,
        data = {},
        sord, parentSord;

    data.version = me.collectorVersion;
    data.formatter = me.formatter;

    try {
      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
      data.sord = me.createTemplateSord(sord);
    } catch (ex) {
      me.logger.warn("Error collecting sord data, continue with data collected so far", ex);
    }

    try {
      parentSord = ixConnect.ix().checkoutSord(sord.parentId, SordC.mbAllIndex, LockC.NO);
      data.parent = me.createTemplateSord(parentSord);
    } catch (ex) {
      me.logger.warn("Error collecting parent sord data, continue with data collected so far", ex);
    }

    try {
      me.collectHierarchy(sord, data);
    } catch (ex) {
      me.logger.warn("Error collecting sord hierarchy, continue with data collected so far", ex);
    }

    return sol.common.JsonUtils.stringifyAll(data);
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} dataObj
   */
  collectHierarchy: function (sord, dataObj) {
    var me = this,
        type;

    if (sord.id > 1) {
      type = sol.common.SordUtils.getObjKeyValue(sord, me.hierarchicalIdentifier);
      if (type) {
        switch (me.mode) {
          case me.MODES.FIRST_WINS:
            if (!dataObj[type]) {
              dataObj[type] = me.createTemplateSord(sord);
            }
            break;
          case me.MODES.LAST_WINS:
            dataObj[type] = me.createTemplateSord(sord);
            break;
          case me.MODES.ALL:
            throw "mode '" + me.MODES.ALL + "' is not implemented yet";
          default:
            throw "mode" + me.mode + "is not defined";
        }
      }
      me.collectHierarchy(ixConnect.ix().checkoutSord(sord.parentId, SordC.mbAllIndex, LockC.NO), dataObj);
    }
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object}
   */
  createTemplateSord: function (sord) {
    var me = this;
    return sol.common.ObjectFormatter.format({
      sord: {
        formatter: me.formatter,
        data: sord,
        config: {
          allMapFields: me.allMapFields,
          sordKeys: me.sordKeys
        }
      }
    }).sord;
  }

});

/**
 * @member sol.common.ix.services.ParentDataCollector
 * @method RF_sol_common_service_ParentDataCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_ParentDataCollector(ec, configAny) {
  logger.enter("RF_sol_common_service_ParentDataCollector", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId"),
      jsonDataCollector, result;

  jsonDataCollector = sol.create("sol.common.ix.services.ParentDataCollector", config);
  result = jsonDataCollector.execute();
  logger.exit("RF_sol_common_service_ParentDataCollector", result);
  return result;
}
