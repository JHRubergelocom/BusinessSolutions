
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_decimal-light.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.contract.DurationUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.functions.ExtendDuration" });

/**
 * Extends the contract period and recalculates the payment plan
 *
 * @eloix
 *
 * @requires sol.common.SordUtils
 * @requires sol.common.Map
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.contract.ix.functions.ExtendDuration", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  initialize: function (config) {
    var me = this;
    me.contractConfig = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.unitSuffix = me.unitSuffix || "_UNIT";
  },

  /**
   * Extends the contract duration
   */
  process: function () {
    var me = this,
        newData = [],
        tplSord, updates, mapData;

    me.sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

    tplSord = sol.common.SordUtils.getTemplateSord(me.sord).sord;

    updates = {
      objKeys: {},
      mapKeys: {}
    };

    sol.contract.DurationUtils.calcContractEnd(tplSord, updates);

    sol.contract.DurationUtils.calcTerminationDateFixed(tplSord, updates);
    sol.contract.DurationUtils.calcReminderDate(tplSord, updates);

    me.fillUpdates(updates.objKeys, "GRP", newData);
    me.fillUpdates(updates.mapKeys, "MAP", newData);

    mapData = sol.common.SordUtils.updateSord(me.sord, newData);

    if (mapData) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sord.id, me.sord.id, mapData, LockC.NO);
    }

    me.sordMap = sol.create("sol.common.SordMap", { objId: me.sord.id });
    me.sordMap.read();
    me.calcPaymentPlan();
    ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
    me.sordMap.write();
  },

  /**
   * @private
   * @param {Object} valuesObj
   * @param {String} type
   * @param {Array} newData
   */
  fillUpdates: function (valuesObj, type, newData) {
    var key, value;

    for (key in valuesObj) {
      value = valuesObj[key];
      newData.push({ type: type, key: key, value: value });
    }
  },

  /**
   * Sets a value
   * @private
   * @param {Object} fieldDef Field definition
   * @param {String} fieldDef.type Field type
   * @param {String} fieldDef.name Field name
   * @param {String} value Value
   */
  setValue: function (fieldDef, value) {
    var me = this;
    if (!fieldDef || !fieldDef.type || !fieldDef.key) {
      throw "Field definition is incomplete";
    }
    fieldDef.value = value;
    me.newData.push(fieldDef);
  },

  /**
   * @private
   * Calculates and sets a date
   * @param {String} srcDateField Source date field
   * @param {String} durationField Duration field
   * @param {String} dstDateField Destination date field
   * @param {Object} params Parameters
   * @param {Object} params.endOfField
   * @param {Object} params.minTermStartField
   * @param {Object} params.minTermNumberField
   * @param {Object} params.minTermNumberUnitField
   * @param {Boolean} params.substractOneDay
   * @param {Boolean} params.minToday
   * @return {String}
   */
  setCalculatedDate: function (srcDateField, durationField, dstDateField, params) {
    var me = this,
        srcIsoDate, durationNumber, durationUnit, dstIsoDate,
        minTermStartIsoDate, minTermNumber, minTermUnit, minTermIsoDate, todayIso;

    params = params || {};

    todayIso = sol.common.SordUtils.nowIsoForConnection(null, { startOfDay: true });

    switch (String(srcDateField.type)) {
      case "$NOW":
        srcIsoDate = todayIso;
        break;
      case "CONST":
        srcIsoDate = srcDateField.value || "";
        break;
      default:
        srcIsoDate = sol.common.SordUtils.getValue(me.sord, srcDateField);
        break;
    }

    if (!srcIsoDate) {
      return;
    }

    durationNumber = sol.common.SordUtils.getValue(me.sord, durationField);
    durationUnit = sol.common.SordUtils.getLocalizedKwlKey(me.sord, { type: durationField.type, key: durationField.key + me.unitSuffix });

    if (params.endOfField) {
      params.endOfUnit = sol.common.SordUtils.getLocalizedKwlKey(me.sord, params.endOfField) || "d";
    }
    if (params.substractOneDay) {
      srcIsoDate = sol.contract.DurationUtils.calculateDate(srcIsoDate, -1, "d");
    }
    dstIsoDate = sol.contract.DurationUtils.calculateDate(srcIsoDate, durationNumber, durationUnit, params);

    if (params.minTermNumberField) {
      minTermStartIsoDate = sol.common.SordUtils.getValue(me.sord, params.minTermStartField);
      minTermNumber = sol.common.SordUtils.getObjKeyValueAsNumber(me.sord, params.minTermNumberField) || 0;
      minTermUnit = sol.common.SordUtils.getLocalizedKwlKey(me.sord, params.minTermNumberUnitField);
      minTermIsoDate = sol.contract.DurationUtils.calculateDate(minTermStartIsoDate, minTermNumber, minTermUnit);

      if (minTermIsoDate > dstIsoDate) {
        dstIsoDate = minTermIsoDate;
      }

      if (params.minToday && (dstIsoDate < todayIso)) {
        dstIsoDate = todayIso;
      }
    }

    me.setValue(dstDateField, dstIsoDate);
    return dstIsoDate;
  },

  /**
   * @private
   * Re-calulates the payment plan
   */
  calcPaymentPlan: function () {
    var me = this,
        total = 0,
        currencyCode, baseCurrencyCode, amountLocalCurr, exchangeRate;

    me.sordMap.forEachRow(me.contractConfig.mapFields.contractCashflowRecurringUnit, function (i) {
      var singleAmount, startDateIso, endDateIso, unit,
          rowTotal = "";

      singleAmount = me.sordMap.getNumValue(me.contractConfig.mapFields.contractCashflowSingle + i);
      if (singleAmount) {
        startDateIso = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowDate + i) || sol.common.SordUtils.getObjKeyValue(me.sord, me.contractConfig.fields.contractStart);
        endDateIso = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowTo + i) || sol.common.SordUtils.getObjKeyValue(me.sord, me.contractConfig.fields.contractEnd) || sol.common.SordUtils.getObjKeyValue(me.sord, me.contractConfig.fields.nextPossibleTermination);
        unit = me.sordMap.getValue(me.contractConfig.mapFields.contractCashflowRecurringUnit + i);
        rowTotal = sol.contract.DurationUtils.calcRowTotal(startDateIso, endDateIso, singleAmount, unit);
        total += rowTotal;
      }
      me.sordMap.setNumValue(me.contractConfig.mapFields.contractCashflowAmount + i, rowTotal);
    }, me);

    sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.contractConfig.fields.cashflowSum, total);

    baseCurrencyCode = sol.contract.DurationUtils.getBaseCurrency();
    currencyCode = sol.common.SordUtils.getObjKeyValue(me.sord, me.contractConfig.fields.currencyCode);

    if (!currencyCode || (currencyCode == baseCurrencyCode)) {
      sol.common.SordUtils.setObjKeyValue(me.sord, me.contractConfig.fields.currencyCode, baseCurrencyCode);
      me.sordMap.setValue(me.contractConfig.mapFields.exchangeRate, "1");
    }
    exchangeRate = me.sordMap.getNumValue(me.contractConfig.mapFields.exchangeRate);
    amountLocalCurr = sol.contract.DurationUtils.calcLocalCurrencyAmount(total, exchangeRate);
    sol.common.SordUtils.setObjKeyValueAsNumber(me.sord, me.contractConfig.fields.cashflowSumLocalCurr, amountLocalCurr);
  }
});

/**
 * @member sol.contract.ix.functions.ExtendDuration
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_ExtendDuration", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.ExtendDuration", params);

  module.process();

  logger.exit("onEnterNode_ExtendDuration");
}


/**
 * @member sol.contract.ix.functions.ExtendDuration
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_ExtendDuration", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.contract.ix.functions.ExtendDuration", params);

  module.process();

  logger.exit("onExitNode_ExtendDuration");
}


/**
 * @member sol.common.ix.functions.ChangeRights
 * @method RF_sol_contract_function_ExtendDuration
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_contract_function_ExtendDuration(iXSEContext, args) {
  logger.enter("RF_sol_contract_function_ExtendDuration", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.contract.ix.functions.ExtendDuration", params);

  module.process();

  logger.exit("RF_sol_contract_function_ExtendDuration");
}

