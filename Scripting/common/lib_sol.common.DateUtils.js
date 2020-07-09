
//@include lib_Class.js
/* eslint-disable */
//@include lib_moment.js
/* eslint-enable */

/**
 * Utils for handling dates. This allows e.g. converting ELO ISO dates to moment.js date-objects.
 *
 * Uses moment.js for converting and handling date strings. Please refer to the official documentation of
 * moment.js for further information. http://momentjs.com/docs/
 *
 *     var momentDate = sol.common.DateUtils.isoToDate('20151203');
 *
 *     // add 7 days with moment.js
 *     var oneWeekAfter = momentDate.add(7, 'days');
 *
 * @author PZ, ELO Digital Office GmbH
 *
 */
sol.define("sol.common.DateUtils", {
  singleton: true,
  alternateClassName: "sol.Date",

  /**
   * @property
   * @private
   * Internal date formats used for checking and parsing
   */
  ISO_CONFIGS: {
    ISODATE: { format: "YYYYMMDD", regex: /^\d{8}$/ },
    ISODATETIME: { format: "YYYYMMDDHHmmss", regex: /^\d{14}$/ },
    ELOTSTAMP: { format: "YYYY.MM.DD.HH.mm.ss", regex: /^\d{4}(.\d{2}){5}$/ },
    ISODATEMILLISECONDS: { format: "YYYYMMDDHHmmssSSS", regex: /^\d{17}$/ }
  },

  /**
   * Converts an iso date string to a date object
   * @param {String} isoDate The iso date string
   * @param {Object} config Configuration
   * @param {Boolean} config.startOfDay Return the start of the day
   * @param {Boolean} config.endOfDay Return the end of the day
   * @return {Date} A JavaScript Date object
   */
  isoToDate: function (isoDate, config) {
    var me = this,
        mom;

    if (!isoDate) {
      return;
    }

    mom = me.isoToMoment(isoDate, config);

    return mom.toDate();
  },

  /**
   * Converts an iso date string to a moment object
   * @param {String} isoDate The iso date string
   * @param {Object} config Configuration
   * @param {Boolean} config.asUtc Parse as UTC
   * @param {Boolean} config.startOfDay Return the start of the day
   * @param {Boolean} config.endOfDay Return the end of the day
   * @return {Moment} A JavaScript Date object
   */
  isoToMoment: function (isoDate, config) {
    var mom, cfg;

    if (!isoDate) {
      return;
    }

    config = config || {};

    for (cfg in this.ISO_CONFIGS) {
      if (this.ISO_CONFIGS.hasOwnProperty(cfg) && this.ISO_CONFIGS[cfg].regex.test(isoDate)) {
        if (config.asUtc) {
          mom = moment.utc(isoDate, this.ISO_CONFIGS[cfg].format, true);
        } else {
          mom = moment(isoDate, this.ISO_CONFIGS[cfg].format, true);
        }
        break;
      }
    }

    if (config.startOfDay) {
      mom = mom.startOf("day");
    } else if (config.endOfDay) {
      mom = mom.endOf("day");
    }

    if (!mom) {
      throw "sol.common.DateUtils.isoToDate: Wrong input format, must be an ELO iso date string: " + isoDate;
    }

    return mom;
  },

  /**
   * Converts a date object to an iso string
   * @param {Date} date The date object
   * @param {Object} params (optional)
   * @param {Boolean} [params.withoutTime=false] (optional) If set to `true`, the time will be omitted from the ISO string
   * @param {Boolean} [params.startOfDay=false] (optional) Start of day
   * @param {String|Number} params.utcOffset (optional) UTC offset
   * @param {Boolean} params.pattern Pattern
   * @return {String} The resulting iso date
   */
  dateToIso: function (date, params) {
    var me = this,
        isoDate, mo;

    params = params || {};
    mo = moment(date);

    isoDate = me.momentToIso(mo, params);

    return isoDate;
  },

  /**
   * Converts a moment object to an iso string
   * @param {Moment} mo The moment object
   * @param {Object} params (optional)
   * @param {Boolean} [params.withoutTime=false] (optional) If set to `true`, the time will be omitted from the ISO string
   * @param {Boolean} [params.startOfDay=false] (optional) Start of day
   * @param {String|Number} params.utcOffset (optional) UTC offset
   * @param {Boolean} params.pattern Pattern
   * @return {String} The resulting iso date
   */
  momentToIso: function (mo, params) {
    var me = this,
        isoDate;

    params = params || {};

    if (typeof params.utcOffset != "undefined") {
      mo.utcOffset(params.utcOffset);
    }

    if (params.startOfDay) {
      mo.startOf("d");
    }

    if (!params.pattern) {
      params.pattern = (params.withoutTime === true) ? me.ISO_CONFIGS.ISODATE.format : me.ISO_CONFIGS.ISODATETIME.format;
    }

    isoDate = mo.format(params.pattern);

    return isoDate;
  },

  /**
   * Returns now as iso string
   * @param {Object} params (optional)
   * @param {String} params.withMilliseconds
   * @param {String|Number} params.utcOffset
   * @return {String}
   */
  nowIso: function (params) {
    var me = this,
        now;

    params = params || {};

    if (params.withMilliseconds === true) {
      return String(moment().format(this.ISO_CONFIGS.ISODATEMILLISECONDS.format));
    }
    now = me.dateToIso(new Date(), params);
    return now;
  },

  /**
   * Adds or removes time units from a date object.
   *
   * The following example will substracts 3 days from myDate and returns a Date
   *
   *     sol.common.DateUtils.shift(myDate, -3)
   *
   * The following example will adds 7 hours to myDate and returns a String with the specified pattern:
   *
   *     sol.common.DateUtils.shift(myDate, 7, { pattern: "YYYY.MM.DD HH:mm:ss", unit: "h" })
   *
   * Supported `unit` patterns:
   *
   * - years: y
   * - half years: hy
   * - quarters: Q
   * - months: M
   * - weeks: w
   * - days: d
   * - hours: h
   * - minutes: m
   * - seconds: s
   * - milliseconds: ms
   *
   * @param {Date} date The date object which should be used as base for the shift
   * @param {Number} value The amount which should be shifted
   * @param {Object} params (optional) Additional parameters
   * @param {String} params.pattern (optional) Format string (see [moment.js](http://momentjs.com/) for formating options)
   * @param {String} [params.unit="d"] (optional) The unit which should be added/substracted
   * @return {Date|String} Returns a `String` if a params.pattern is defined and a `Date` if not.
   */
  shift: function (date, value, params) {
    var shifted, unit;

    shifted = moment(date.getTime());
    unit = (params && params.unit) ? params.unit : "d";

    if (unit == "hy") {
      unit = "M";
      value *= 6;
    }

    if (!(/^[yQMwdhms]$|^ms$|^hy$/.test(unit))) {
      throw "IllegalArgumentException: unsupported unit for shift: " + unit;
    }

    shifted.add(value, unit);

    return (params && params.pattern) ? shifted.format(params.pattern) : shifted.toDate();
  },

  /**
   * Formats a Date object.
   *
   *      sol.common.DateUtils.format(new Date(), "YYYY.MM.DD HH:mm:ss.SSS")
   *
   * @param {Date} date The date object
   * @param {String} pattern Format string (see [moment.js](http://momentjs.com/) for formating options)
   * @return {String}
   */
  format: function (date, pattern) {
    return moment(date.getTime()).format(pattern);
  },

  /**
   * Parses a date string with a given pattern.
   *
   *     var maythefourth = sol.common.DateUtils.parse("1977-05-04");
   *
   *     var maythefourth = sol.common.DateUtils.parse("04.05.1977", "DD.MM.YYYY");
   *
   *     var maythefourth = sol.common.DateUtils.parse("05/04/1977", "MM/DD/YYYY");
   *
   * If no `pattern` is defined the function tries to figure out the format by using various standards (see [moment.js/parsing](https://momentjs.com/docs/#/parsing/string/)).
   * For consistent results the use of `pattern` is encouraged.
   *
   * @param {String} dateString
   * @param {String} pattern (optional) Parse string (see [moment.js](http://momentjs.com/) for parsing options)
   * @return {Date} Returns `null` if date could not be determined
   */
  parse: function (dateString, pattern) {
    var mom;
    mom = (pattern) ? moment(dateString, pattern, true) : moment(dateString);
    return (mom.isValid()) ? mom.toDate() : null;
  },

  /**
   * Calculates a difference between to dates
   * @param {Date} startDate Start date
   * @param {Date} endDate End date
   * @param {String} unit Unit
   * @param {Object} config Configuration
   * @param {Boolean} config.roundUp Round up
   * @return {Number}
   */
  diff: function (startDate, endDate, unit, config) {
    var number, isQuarter, isHalfYear;

    number;
    isQuarter = false;

    if (!startDate) {
      throw "Start date is empty";
    }

    if (!endDate) {
      throw "End date is empty";
    }

    if (!unit) {
      throw "Unit is empty";
    }

    if (unit == "O") {
      return 1;
    }

    if (unit == "Q") {
      isQuarter = true;
      unit = "M";
    }

    if (unit == "hy") {
      isHalfYear = true;
      unit = "M";
    }

    config = config || {};

    number = moment(endDate.getTime()).diff(startDate.getTime(), unit, true);

    number = isQuarter ? (number / 3) : number;
    number = isHalfYear ? (number / 6) : number;

    if (config.roundUp) {
      number = Math.ceil(number);
    }
    return number;
  },

  /**
   * Checks wether a date is between a start date and an end end date
   * @param {Date} [startDate=now] Start date
   * @param {Date} [endDate=now] End date
   * @param {Date} [checkDate=now] Check date
   * @return {Boolean}
   */
  isBetween: function (startDate, endDate, checkDate) {
    var checkMoment, startMoment, endMoment;

    startMoment = startDate ? moment(startDate.getTime()) : moment();
    endMoment = endDate ? moment(endDate.getTime()) : moment();
    checkMoment = checkDate ? moment(checkDate.getTime()) : moment();

    return checkMoment.isBetween(startMoment, endMoment);
  },

  /**
   * Prepare duration
   * @param {Number} number Duration
   * @param {String} unit Duration unit
   * @return {Object} Duration
   */
  prepareDuration: function (number, unit) {
    var duration, splitParts;

    if (number == "") {
      return;
    }

    unit += "";

    splitParts = unit.split(" ");
    unit = splitParts[0];

    unit = unit || "d";

    switch (unit) {
      case "y":
        duration = { years: number };
        break;

      case "hy":
        duration = { months: number * 6 };
        break;

      case "Q":
        duration = { months: number * 3 };
        break;

      case "M":
        duration = { months: number };
        break;

      case "w":
        duration = { weeks: number };
        break;

      case "d":
        duration = { days: number };
        break;

      case "h":
        duration = { hours: number };
        break;

      case "m":
        duration = { minutes: number };
        break;

      case "seconds":
        duration = { seconds: number };
        break;

      default:
        throw "Invalid duration unit: " + unit;
    }

    return duration;
  },

  /**
   * Returns the `end of` time of a specified period
   * @param {Moment} moment Moment
   * @param {String} unit Unit
   * @return {Moment} Moment
   */
  endOf: function (moment, unit) {
    var month;

    if (!unit) {
      return moment;
    }

    if (unit == "hy") {
      month = moment.month();
      while ((month != 5) && (month != 11)) {
        moment = moment.add({ month: 1 });
        month = moment.month();
      }
      moment = moment.endOf("M");
      return moment;
    }

    moment.endOf(unit);

    return moment;
  },

  /**
   * Transforms an ISO date
   * @param {String} isoDate ISO date
   * @param {Object} config Configuration
   * @param {Boolean} config.asUtc Parse as UTC
   * @param {String|Number} config.utcOffset UTC offset
   */
  transformIsoDate: function (isoDate, config) {
    var mo;
    if (!isoDate) {
      return "";
    }
    mo = sol.common.DateUtils.isoToMoment(isoDate, config);
    isoDate = sol.common.DateUtils.momentToIso(mo, config);

    return isoDate;
  },

  /**
   * Checks wether the given moment represents the last day of the month
   * @param {Moment} mom Moment
   * @param {Object} params Parameters
   * @param {Number} [config.toleranceDays==0] Tolerance days
   */
  isLastDayOfMonth: function (mom, params) {
    if (!mom) {
      return false;
    }

    params = params || {};
    params.toleranceDays = params.toleranceDays || 0;

    if ((mom.get("date") + params.toleranceDays) >= mom.daysInMonth()) {
      return true;
    }

    return false;
  }
});

//# sourceURL=lib_sol.common.DateUtils.js
