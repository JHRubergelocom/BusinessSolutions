
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contract.ix.ContractUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.services.PaymentPlanCollector" });

/**
 * Returns the payment plan items
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.002
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Map
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.contract.ix.ContractUtils
 */
sol.define("sol.contract.ix.services.PaymentPlanCollector", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["parentId"],

  /**
   * @cfg {String} parentId (required)
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.contractConfig = sol.contract.ix.ContractUtils.loadConfig();
  },

  process: function () {
    var me = this,
        solTypeFieldName, solTypes, objKeysObj, sord, sords, i;

    me.items = [];

    solTypeFieldName = me.contractConfig.fields.objType || "SOL_TYPE";
    solTypes = me.contractConfig.objectTypes || ["CONTRACT"];

    objKeysObj = {};
    objKeysObj[solTypeFieldName] = sol.common.RepoUtils.buildOrValuesSearchString(solTypes);

    // Single contract
    sord = sol.common.RepoUtils.getSord(me.parentId);
    if (solTypes.indexOf(sol.common.SordUtils.getObjKeyValue(sord, solTypeFieldName) + "") > -1) {
      sords = [sord];
    } else {
      sords = sol.common.RepoUtils.findChildren(me.parentId, { includeFolders: true, includeDocuments: false, includeReferences: true, objKeysObj: objKeysObj, recursive: true, level: 32, sordZ: SordC.mbAllIndex });
    }

    for (i = 0; i < sords.length; i++) {
      me.processContract(sords[i]);
    }
    return { sords: me.items };
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   */
  processContract: function (sord) {
    var me = this;

    me.sordMap = sol.create("sol.common.SordMap", { objId: sord.id });
    me.sordMap.read();

    me.sordMap.forEachRow(me.contractConfig.mapFields.contractCashflowRecurringUnit, function (i) {
      var singleAmount, description, endDateIso, startDate, endDate, unit, startDateIso;
      startDateIso = "";
      singleAmount = me.sordMap.getNumValue(me.contractConfig.mapFields.contractCashflowSingle + i);

      if (singleAmount) {
        description = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowDesc + i);
        startDateIso = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowDate + i) || sol.common.SordUtils.getObjKeyValue(sord, me.contractConfig.fields.contractStart);
        endDateIso = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowTo + i) || sol.common.SordUtils.getObjKeyValue(sord, me.contractConfig.fields.contractEnd);

        startDate = startDateIso ? sol.common.DateUtils.isoToDate(startDateIso) : new Date();
        endDate = endDateIso ? sol.common.DateUtils.isoToDate(endDateIso) : new Date();
        unit = me.sordMap.getKwlKey(me.contractConfig.mapFields.contractCashflowRecurringUnit + i);

        do {
          startDateIso = sol.common.DateUtils.dateToIso(startDate);
          me.items.push(me.createLineTemplateSord(sord, me.sordMap.data, { description: description, amount: singleAmount, date: startDateIso }));
          if (unit == "O") {
            break;
          }
          startDate = sol.common.DateUtils.shift(startDate, 1, { unit: unit });
        } while (startDate < endDate);
      }
    }, me);

  },

  createLineTemplateSord: function (sord, mapEntries, calculatedProperties) {
    var me = this,
        tSord;

    tSord = sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"]
        }
      }
    }).sord;

    tSord.mapKeys = me.filterIndexedMapEntries(mapEntries);

    tSord.mapKeys.CONTRACT_CASHFLOW_DESC = calculatedProperties.description;
    tSord.mapKeys.CONTRACT_CASHFLOW_AMOUNT = calculatedProperties.amount;
    tSord.mapKeys.CONTRACT_CASHFLOW_DATE = calculatedProperties.date;

    return tSord;
  },

  filterIndexedMapEntries: function (mapEntries) {
    var filteredEntries = {},
        key;

    for (key in mapEntries) {
      if (mapEntries.hasOwnProperty(key) && !sol.common.StringUtils.getTrailingNumber(key)) {
        filteredEntries[key] = mapEntries[key];
      }
    }

    return filteredEntries;
  }

});

/**
 * @member sol.contract.ix.services.PaymentPlanCollector
 * @method RF_sol_contract_service_PaymentPlanCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contract_service_PaymentPlanCollector(iXSEContext, args) {
  logger.enter("RF_sol_contract_service_PaymentPlanCollector", args);
  var config, service, result, resultString;

  config = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),

  service = sol.create("sol.contract.ix.services.PaymentPlanCollector", config);
  result = service.process();
  resultString = sol.common.ix.RfUtils.stringify(result, { tabStop: 2 });
  logger.exit("RF_sol_contract_service_PaymentPlanCollector", resultString);

  return resultString;
}

