
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.DataCollectorBase.js
//@include lib_sol.visitor.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.visitor.ix.services.ParentDataCollectorGroup" });

/**
 * Collects all parent information from the visitor
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_visitor_service_ParentDataCollectorGroup", {
 *       objId: '5690',
 *       returnDataDefinition: true
 *     });
 *
 * # Result
 *
 *     {
 *       version: '1.00.000',
 *       formatter: 'sol.common.ObjectFormatter.TemplateSord',
 *       dataDefinition: {
 *         rootElementName: "visitors",
 *         dataProperties: ["parent"],
 *         arrayElementTagNames: { sords: "sord" }
 *       },
 *       visitors: {
 *         sord: {
 *           id: '5669',
 *           name: '12 Public relations',
 *           O_INVOICE_DATE: '20151202'
 *         }
 *					sords: [
 * 					{
 *           id: '5669',
 *           name: 'Besuch, Wichtiger, BZ1',
 *           O_INVOICE_DATE: '20151202'
 *         	},
 *					{
 *           id: '5664',
 *           name: 'Besuch, Wichtiger, BZ1',
 *           O_INVOICE_DATE: '20151202'
 *         	}
 *			  ]
 *       }
 *     }
 *
 * @eloix
 * @author MW
 *
 * @requires sol.common.Config
 * @requires sol.common.Map
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.visitor.Utils
 */
sol.define("sol.visitor.ix.services.ParentDataCollectorGroup", {
  extend: "sol.common.ix.DataCollectorBase",

  requiredConfig: ["objId"],

  collectorVersion: "1.00.000",

  /**
   * @cfg {String} objId (required)
   * id of the parent element (guid, objId or archivepath)
   */
  objId: null,

  /**
   * @cfg {String} formatter
   * Sord object formatter implementation.
   *
   * e.g. `sol.common.ObjectFormatter.StatisticSord` or `sol.common.ObjectFormatter.TemplateSord`
   */
  formatter: "sol.common.ObjectFormatter.TemplateSord",

  /**
   * @cfg {Boolean} [returnDataDefinition=false] (optional)
   * If `true`, the service returns the data definition for the object, which is necessary for the convertion to XML.
   */
  returnDataDefinition: false,

  /**
   * @property {Object} dataDefinition
   * This contains the data definition for the result
   */
  dataDefinition: {
    dataProperties: ["hierarchy"]
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.DataCollectorBase", "initialize", [config]);
    me.visitorConfig = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;

    me.objId = config.objId || me.objId;
    me.formatter = config.formatter || me.formatter;
    me.returnDataDefinition = config.returnDataDefinition || me.returnDataDefinition;
  },

  /**
   * Starts the collection of the desired data
   * @return {String} data
   */
  execute: function () {
    var me = this,
        data = {};

    data.version = me.collectorVersion;
    data.formatter = me.formatter;
    if (me.returnDataDefinition === true) {
      data.dataDefinition = me.dataDefinition;
    }

    data.visitors = sol.common.IxUtils.execute("RF_sol_common_services_ChildrenDataCollector", {
      parentId: me.objId,
      formatter: me.formatter,
      filter: [{ key: "SOL_TYPE", val: "\"VISITOR\" OR \"LONG_TERM_BADGE\"" }],
      endLevel: 1
    });

    me.filterVisitors(data.visitors);

    if ((data.visitors.sord.objKeys.SOL_TYPE == "VISITOR") || (data.visitors.sord.objKeys.SOL_TYPE == "LONG_TERM_BADGE")) {
      data.visitors.sords = [data.visitors.sord];
    }

    return sol.common.JsonUtils.stringifyAll(data);
  },

  alreadyPrintedKey: "VISITOR_ALREADYPRINTED",

  filterVisitors: function (visitors) {
    var me = this,
        filteredVisitorSords = [],
        visitorTplSord, i, items;

    for (i = 0; i < visitors.sords.length; i++) {
      visitorTplSord = visitors.sords[i];
      items = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, visitorTplSord.id, [me.alreadyPrintedKey], LockC.NO).items;
      if (items && ((items.length == 0) || (items[0].value != "1"))) {
        filteredVisitorSords.push(visitorTplSord);
      }
    }

    visitors.sords = filteredVisitorSords;
  }
});

/**
 * @member sol.visitor.ix.services.ParentDataCollectorGroup
 * @method RF_sol_visitor_service_ParentDataCollectorGroup
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_visitor_service_ParentDataCollectorGroup(ec, configAny) {
  logger.enter("RF_sol_visitor_service_ParentDataCollectorGroup", configAny);
  var rfUtils = sol.common.ix.RfUtils,
      config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId"),
      jsonDataCollector, result;

  jsonDataCollector = sol.create("sol.visitor.ix.services.ParentDataCollectorGroup", config);
  result = jsonDataCollector.execute();
  logger.exit("RF_sol_visitor_service_ParentDataCollectorGroup", result);
  return result;
}

