
//@include lib_Class.js

/**
 * Helper functions for contracts
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elowf
 *
 * @requires sol.common.DateUtils
 */
sol.define("sol.contract.DurationUtils", {
  singleton: true,

  /**
   * Returns the "end of" date
   * @param {Date} date Date
   * @param {String} unit Unit
   * @returns {Date} End of date
   */
  getEndOfDate: function (date, unit) {
    var momentDate;
    momentDate = moment(date.getTime());
    return momentDate.endOf(unit).startOf("day").toDate();
  },

  allUnits: ["y", "hy", "Q", "M", "w", "d"],

  /**
   * Returns the smallest duration unit
   * @param {Array} unitStrings Units strings
   * @return {String}
   */
  getSmallestUnitString: function (unitStrings) {
    var me = this,
        unit, smallestUnit, unitString,
        i, j, u = 0;

    if (!unitStrings) {
      throw "Units strings are empty";
    }

    if (unitStrings.length == 1) {
      return unitStrings[0];
    }

    for (i = 0; i < unitStrings.length; i++) {
      unit = me.getKwlKey(unitStrings[i]);
      for (j = u; j < me.allUnits.length; j++) {
        if (unit == me.allUnits[j]) {
          u = j;
        }
      }
    }

    smallestUnit = me.allUnits[u];

    for (i = 0; i < unitStrings.length; i++) {
      unitString = unitStrings[i];
      unit = me.getKwlKey(unitString);
      if (smallestUnit == unit) {
        return unitString;
      }
    }
  },

  /**
   * Calculates a duration
   * @param {String} startDateIso Start date
   * @param {String} endDateIso End date
   * @param {String} unit
   * @return {Number}
   */
  calcDuration: function (startDateIso, endDateIso, unit) {
    var me = this,
        startDate, endDate, number;

    unit = me.getKwlKey(unit);

    if (!unit || (unit == "O")) {
      return 1;
    }

    if (!startDateIso || !endDateIso) {
      return "";
    }

    startDate = sol.common.DateUtils.isoToDate(String(startDateIso));
    endDate = sol.common.DateUtils.isoToDate(String(endDateIso));

    number = sol.common.DateUtils.diff(startDate, endDate, unit, { roundUp: true });

    return number;
  },

  /**
   * Returns the keyword list key
   * @param {String} str String
   * @param {String} separator Separator
   * @return {String}
   */
  getKwlKey: function (str, separator) {
    var separatorPos;

    if (!str) {
      return "";
    }

    str = String(str);
    separator = separator || "-";
    separatorPos = str.indexOf(separator);
    if (separatorPos < 0) {
      return str;
    }
    return str.substring(0, separatorPos).trim();
  },

  /**
   * Calculates the row total
   * @param {String} startDateIso Start date
   * @param {String} endDateIso End date
   * @param {Decimal} singleAmount Single amount
   * @param {String} unit Unit
   * @return {Number}
   */
  calcRowTotal: function (startDateIso, endDateIso, singleAmount, unit) {
    var me = this,
        count, rowTotal;

    count = me.calcDuration(startDateIso, endDateIso, unit);
    if (count == "") {
      return new Decimal(0);
    }

    if (typeof singleAmount == "number") {
      singleAmount = new Decimal(singleAmount);
    }

    rowTotal = singleAmount.times(count);
    return rowTotal;
  },

  /**
   * Returns the base currency
   * @return {String} Base currency
   */
  getBaseCurrency: function () {
    return "EUR";
  },

  /**
   * Calculates the local currency amount
   * @param {Number} amount Amount
   * @param {Number} exchangeRate Exchange rate
   * @return {Number}
   */
  calcLocalCurrencyAmount: function (amount, exchangeRate) {
    var localCurrencyAmount;
    localCurrencyAmount = amount / exchangeRate;
    return localCurrencyAmount;
  },

  /**
   * Calculates contract data
   * @param {Object} tplSord Template Sord
   * @param {Object} updates Template Sord
   * @return {Object} updates Updates
   */
  calcContract: function (tplSord, updates) {
    var me = this,
        additionalShiftCounter = 0,
        permanent, specialTerminationRight, terminationDate;

    if (!tplSord) {
      throw "Template Sord is empty";
    }

    permanent = (tplSord.mapKeys.DURATION_TYPE == "sol.contract.form.permanent");

    if (permanent) {
      do {
        me.calcNextPossibleContractEnd(tplSord, updates, additionalShiftCounter);
        terminationDate = me.calcTerminationDateFromNow(tplSord, updates);
        additionalShiftCounter++;
      } while (terminationDate && terminationDate.isBefore(moment().startOf("d")) && (additionalShiftCounter <= 10));
    } else {
      me.calcContractEnd(tplSord, updates);
      specialTerminationRight = (tplSord.mapKeys.SPECIAL_TERMINATION_RIGHT == "1");
      if (specialTerminationRight) {
        me.calcNextPossibleContractEnd(tplSord, updates, 0);
        me.calcTerminationDateFromNow(tplSord, updates);
      } else {
        me.calcTerminationDateFixed(tplSord, updates);
      }
    }
    me.calcReminderDate(tplSord, updates);

    return updates;
  },

  /**
   * @private
   * Converts an ISO date to a moment date
   * @param {String} isoDate ISO date
   * @return {Object} Moment date
   */
  isoToMoment: function (isoDate) {
    var mom;

    if (!isoDate || (isoDate.length < 8)) {
      return;
    }

    isoDate = isoDate.substr(0, 8);

    mom = moment(isoDate, "YYYYMMDD");

    return mom;
  },

  /**
   * @private
   * Converts a moment date to an ISO date
   * @param {Object} mom Moment date
   * @return {String} ISO date
   */
  momentToIso: function (mom) {
    var isoDate;
    if (!mom) {
      return "";
    }
    isoDate = mom.format("YYYYMMDD") + "000000";
    return isoDate;
  },

  /**
   * @private
   * Clears the contract end date
   * @param {Object} tplSord Tempate Sord
   */
  clearContractEnd: function (tplSord) {
    if (!tplSord.objKeys.CONTRACT_START) {
      tplSord.objKeys.CONTRACT_END = "";
    }
  },

  /**
   * @private
   * @param {Object} tplSord Tempate Sord
   * @param {Object} updates Updates
   * @param {Number} additionalShiftCounter Additional shift counter
   */
  calcNextPossibleContractEnd: function (tplSord, updates, additionalShiftCounter) {
    var me = this,
        nextPossibleContractEndIso = "",
        nextPossibleContractEnd, noticePeriodEnd,
        now, noticePeriod, noticePeriodNumber, noticePeriodUnit, contractEnd, contractStart, startDate,
        contractMinTermNumber, contractMinTermUnit, contractMinTerm, contractMinEnd, terminationPoint,
        contractEndIso;

    contractEndIso = tplSord.objKeys.CONTRACT_END;

    if (contractEndIso && (tplSord.mapKeys.DURATION_TYPE == "sol.contract.form.permanent")) {
      me.addUpdate(tplSord, updates, { type: "MAP", key: "NEXT_POSSIBLE_CONTRACT_END", value: "" });
      return;
    }

    contractEnd = me.isoToMoment(contractEndIso);
    if (contractEnd) {
      contractEnd = contractEnd.endOf("d");
    }
    now = moment();

    noticePeriodNumber = tplSord.mapKeys.NOTICE_PERIOD || 0;
    noticePeriodUnit = me.getKwlKey(tplSord.mapKeys.NOTICE_PERIOD_UNIT);

    contractStart = me.isoToMoment(tplSord.objKeys.CONTRACT_START);
    if (!contractStart) {
      return;
    }

    contractMinTermNumber = tplSord.mapKeys.CONTRACT_MIN_TERM;
    contractMinTermUnit = me.getKwlKey(tplSord.mapKeys.CONTRACT_MIN_TERM_UNIT);
    contractMinTerm = sol.common.DateUtils.prepareDuration(contractMinTermNumber, contractMinTermUnit);

    startDate = (contractStart.isAfter(now.clone().add(contractMinTerm))) ? contractStart : now;

    noticePeriod = sol.common.DateUtils.prepareDuration(noticePeriodNumber, noticePeriodUnit);
    noticePeriodEnd = startDate.clone().add(noticePeriod);

    if (contractMinTerm) {
      contractMinEnd = contractStart.add(contractMinTerm);
    }

    terminationPoint = me.getKwlKey(tplSord.mapKeys.TERMINATION_POINT);

    nextPossibleContractEnd = noticePeriodEnd;

    if (contractMinEnd && contractMinEnd.isAfter(noticePeriodEnd)) {
      nextPossibleContractEnd = contractMinEnd;
    }

    terminationPoint = terminationPoint || "d";
    nextPossibleContractEnd = nextPossibleContractEnd.add(additionalShiftCounter, terminationPoint);

    nextPossibleContractEnd = nextPossibleContractEnd.add(-1, "d");

    nextPossibleContractEnd = sol.common.DateUtils.endOf(nextPossibleContractEnd, terminationPoint);

    nextPossibleContractEndIso = me.momentToIso(nextPossibleContractEnd);

    if ((tplSord.mapKeys.DURATION_TYPE == "sol.contract.form.fixedTerm") && (tplSord.mapKeys.SPECIAL_TERMINATION_RIGHT == "1")) {
      if (nextPossibleContractEndIso && nextPossibleContractEnd.isAfter(contractEnd)) {
        nextPossibleContractEndIso = "";
      }
    }

    if (nextPossibleContractEnd.isSame(now) || nextPossibleContractEnd.isBefore(now) || !noticePeriod) {
      nextPossibleContractEndIso = "";
    }

    me.addUpdate(tplSord, updates, { type: "MAP", key: "NEXT_POSSIBLE_CONTRACT_END", value: nextPossibleContractEndIso });
  },

  /**
   * @private
   * Add update
   * @param {Object} tplSord Template Sord
   * @param {Array} updates Updates array
   * @param {Object} update Update
   */
  addUpdate: function (tplSord, updates, update) {
    if (update.type == "GRP") {
      tplSord.objKeys[update.key] = update.value;
      updates.objKeys[update.key] = update.value;
    } else {
      tplSord.mapKeys[update.key] = update.value;
      updates.mapKeys[update.key] = update.value;
    }
  },

  /**
   * @private
   * @param {Object} tplSord Tempate Sord
   * @param {Object} updates Updates
   * @param {Number} additionalShiftCounter Additional shift counter
   */
  calcContractEnd: function (tplSord, updates, additionalShiftCounter) {
    var me = this,
        contractStart, contractDuration, contractEnd, contractEndIso, unitKey,
        extensionFlag, extensionInterval, extensionIntervalUnit, extensionStatusValues, contractStatus,
        extension, noticePeriod, nextPossibleTermination, nextPossibleTerminationStartOfDay, nowMoment;

    contractStart = me.isoToMoment(tplSord.objKeys.CONTRACT_START);

    if (!contractStart) {
      return;
    }

    contractDuration = sol.common.DateUtils.prepareDuration(tplSord.mapKeys.CONTRACT_DURATION, tplSord.mapKeys.CONTRACT_DURATION_UNIT);

    contractEnd = contractStart.clone().add(contractDuration);

    extensionInterval = tplSord.mapKeys.EXTENSION_INTERVAL;
    extensionIntervalUnit = tplSord.mapKeys.EXTENSION_INTERVAL_UNIT;

    extensionFlag = (tplSord.mapKeys.EXTENSION_FLAG == "1");
    contractStatus = me.getKwlKey(tplSord.objKeys.CONTRACT_STATUS);

    extensionStatusValues = ["D", "I", "A", "N", "S"];

    if (extensionFlag && (+extensionInterval > 0) && extensionIntervalUnit && (extensionStatusValues.indexOf(contractStatus) > -1)) {
      extension = sol.common.DateUtils.prepareDuration(extensionInterval, extensionIntervalUnit);

      noticePeriod = sol.common.DateUtils.prepareDuration(tplSord.mapKeys.NOTICE_PERIOD, tplSord.mapKeys.NOTICE_PERIOD_UNIT);

      if (noticePeriod) {
        nextPossibleTermination = contractEnd.clone().subtract(noticePeriod);
      } else {
        nextPossibleTermination = contractEnd.clone();
      }

      nextPossibleTerminationStartOfDay = nextPossibleTermination.clone().startOf("d");
      nowMoment = moment();

      while (nextPossibleTerminationStartOfDay.isBefore(nowMoment)) {
        contractEnd.add(extension);
        if (noticePeriod) {
          nextPossibleTermination = contractEnd.clone().subtract(noticePeriod);
        } else {
          nextPossibleTermination = contractEnd.clone();
        }
        nextPossibleTerminationStartOfDay = nextPossibleTermination.clone().startOf("d");
      }

      me.logger.debug(["ExtendContract: newContractEnd={0}]", contractEnd.toString()]);
    }

    contractEndIso = me.momentToIso(contractEnd);

    if (contractDuration) {
      unitKey = me.getKwlKey(tplSord.mapKeys.CONTRACT_DURATION_UNIT);
      if ((contractStart.date() == contractEnd.date()) || !unitKey || (unitKey == "d")) {
        contractEnd = contractEnd.add(-1, "d");
      }
    } else {
      if (tplSord.objKeys.CONTRACT_END) {
        contractEnd = me.isoToMoment(tplSord.objKeys.CONTRACT_END);
      } else {
        return;
      }
    }

    contractEndIso = me.momentToIso(contractEnd);

    me.addUpdate(tplSord, updates, { type: "MAP", key: "NEXT_POSSIBLE_CONTRACT_END", value: "" });
    me.addUpdate(tplSord, updates, { type: "GRP", key: "CONTRACT_END", value: contractEndIso });
  },

  /**
   * @private
   * @param {Object} tplSord Tempate Sord
   * @param {Object} updates Updates
   * @return {Moment} Next possible termination date
   */
  calcTerminationDateFromNow: function (tplSord, updates) {
    var me = this,
        nextPossibleContractEnd, noticePeriod, nextPossibleTermination, nextPossibleTerminationIso;

    nextPossibleContractEnd = me.isoToMoment(tplSord.mapKeys.NEXT_POSSIBLE_CONTRACT_END);

    if (!nextPossibleContractEnd) {
      me.addUpdate(tplSord, updates, { type: "GRP", key: "NEXT_POSSIBLE_TERMINATION", value: "" });
      return;
    }

    noticePeriod = sol.common.DateUtils.prepareDuration(tplSord.mapKeys.NOTICE_PERIOD, tplSord.mapKeys.NOTICE_PERIOD_UNIT);

    if (!noticePeriod) {
      return;
    }

    nextPossibleTermination = nextPossibleContractEnd.clone().subtract(noticePeriod);

    nextPossibleTermination = me.adjustToRealMonthEnd(nextPossibleTermination, nextPossibleContractEnd, [tplSord.mapKeys.NOTICE_PERIOD_UNIT, tplSord.mapKeys.TERMINATION_POINT]);

    nextPossibleTerminationIso = me.momentToIso(nextPossibleTermination);

    if (nextPossibleTermination.isBefore(moment().startOf("d"))) {
      nextPossibleTerminationIso = "";
    }

    me.addUpdate(tplSord, updates, { type: "GRP", key: "NEXT_POSSIBLE_TERMINATION", value: nextPossibleTerminationIso });

    return nextPossibleTermination;
  },

  /**
   * @private
   * @param {Object} tplSord Template Sord
   * @param {Object} updates Updates
   * @return {Moment} Next possible termination date
   */
  calcTerminationDateFixed: function (tplSord, updates) {
    var me = this,
        nextPossibleTerminationIso = "",
        contractEnd, noticePeriod, nextPossibleTermination;

    contractEnd = me.isoToMoment(tplSord.objKeys.CONTRACT_END);

    if (!contractEnd) {
      return;
    }

    contractEnd = me.isoToMoment(tplSord.objKeys.CONTRACT_END);

    noticePeriod = sol.common.DateUtils.prepareDuration(tplSord.mapKeys.NOTICE_PERIOD, tplSord.mapKeys.NOTICE_PERIOD_UNIT);

    if (noticePeriod) {
      nextPossibleTermination = contractEnd.clone().subtract(noticePeriod);

      if (nextPossibleTermination.isAfter(moment().startOf("d"))) {
        nextPossibleTermination = me.adjustToRealMonthEnd(nextPossibleTermination, contractEnd, [tplSord.mapKeys.NOTICE_PERIOD_UNIT, tplSord.mapKeys.TERMINATION_POINT]);
        nextPossibleTerminationIso = me.momentToIso(nextPossibleTermination);
      }
    }

    me.addUpdate(tplSord, updates, { type: "GRP", key: "NEXT_POSSIBLE_TERMINATION", value: nextPossibleTerminationIso });
  },

  /**
   * @private
   * @param {Moment} adjustMoment Adjust moment
   * @param {Moment} indicatorMoment Indicator moment
   * @param {String} indicatorUnits Indicator units
   */
  adjustToRealMonthEnd: function (adjustMoment, indicatorMoment, indicatorUnitStrings) {
    var me = this,
        endOfMonthUnits, i, indicatorUnitString, indicatorUnitKey;

    endOfMonthUnits = ["y", "hy", "Q", "M"];

    if (!adjustMoment || !indicatorMoment || !indicatorUnitStrings || (indicatorUnitStrings.length == 0)) {
      return adjustMoment;
    }

    if (!sol.common.DateUtils.isLastDayOfMonth(indicatorMoment, { toleranceDays: 1 })) {
      return adjustMoment;
    }

    for (i = 0; i < indicatorUnitStrings.length; i++) {
      indicatorUnitString = indicatorUnitStrings[i];
      indicatorUnitKey = me.getKwlKey(indicatorUnitString);
      if (endOfMonthUnits.indexOf(indicatorUnitKey) < 0) {
        return adjustMoment;
      }
    }

    adjustMoment = adjustMoment.clone().endOf("M");

    return adjustMoment;
  },

  /**
   * @private
   * @param {Object} tplSord Tempate Sord
   * @param {Object} updates Updates
   */
  calcReminderDate: function (tplSord, updates) {
    var me = this,
        startDateIso, startDate, reminderDate, reminderDateIso, reminderPeriod;

    startDateIso = tplSord.objKeys.NEXT_POSSIBLE_TERMINATION || tplSord.mapKeys.NEXT_POSSIBLE_CONTRACT_END || tplSord.objKeys.CONTRACT_END;

    startDate = me.isoToMoment(startDateIso);

    if (!startDate) {
      return;
    }

    reminderPeriod = sol.common.DateUtils.prepareDuration(tplSord.mapKeys.REMINDER_PERIOD, tplSord.mapKeys.REMINDER_PERIOD_UNIT);

    if (!reminderPeriod) {
      return;
    }

    reminderDate = startDate.subtract(reminderPeriod);

    reminderDateIso = me.momentToIso(reminderDate);

    me.addUpdate(tplSord, updates, { type: "GRP", key: "NEXT_REMINDER_DATE", value: reminderDateIso });
  }
});
