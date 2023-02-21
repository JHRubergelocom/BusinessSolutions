
//@include lib_Class.js
/* eslint-disable */
//@include lib_handlebars.js
//@include lib_moment.js
/* eslint-enable */
//@include lib_sol.common.Cache.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.WfUtils.js

importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

/**
 * This class encapsulates templating operations by handlebars.js.
 *
 * For more information on using templates and the template syntax of handlebars please refer to
 * <a href="http://www.handlebarsjs.com/">www.handlebarsjs.com</a>.
 *
 * # Using templates from a string
 *
 *     var tpl = sol.create('sol.common.Template', {
 *         source: 'Hello {{name}}.'
 *     });
 *
 *     var result = tpl.apply({
 *       name: 'Marcus'
 *     });
 *
 * # Using templates from an elo text file
 *
 *     var tpl = sol.create('sol.common.Template', {});
 *
 *     // load data from a text file in ELO
 *     tpl.load('GUID');
 *
 *     // accessing objKey properties is difficult.
 *     // use sol.common.ObjectFormatter to get an easy to use sord object.
 *     var data = sol.common.ObjectFormatter.format({
 *       sord: {
 *         formatter: 'sol.common.ObjectFormatter.TemplateSord',
 *         data: sord
 *     });
 *
 *     var result = tpl.apply(data);
 *
 * # Helper functions
 *
 * ## Date formatting: formatDate
 * Registers the templating function `formatDate`. For all formating strings <a href="http://momentjs.com/">moment.js</a> syntax will be used.
 *
 *     {{formatDate outputFormat inputDate inputFormat}}
 *
 * All parameters are optional:
 *
 * - outputFormat {String} default: 'YYYYMMDDHHmmss'
 * - inputDate {Date|String} default: the current date
 * - inputFormat {String} default: 'YYYYMMDDHHmmss'
 *
 * But, if an inputDate is defined, the outputFormat has to be set (even if it is to an empty string), and if an inputFormat is defined, both previous parameters have to be defined.
 *
 * The following example would output a human readable date from a index field:
 *
 *     {{formatDate 'DD.MM.YYYY HH:mm:ss' sord.objKeys.MY_DATE}}
 *
 * ## monthName
 * Registers the `monthName` helper which returns the month name of a date.
 *
 *     {{{monthName isoDate=sord.objKeys.INVOICE_DATE textStyle='SHORT' locale='de'}}}
 *
 * ## Counter
 * Registers the `count` helper which allows the use of IX conters in Template Strings.
 *
 *     {{count 'MY_COUNTER'}}
 *
 * It also supports the normalization of the counter results to a spezific length by padding characters on the left side.
 * This can be configured, by a second parameter with a string of the desired length an containing the desired characters.
 * If the counter value has a greater length then the parameter, it will not be altered.
 *
 *     {{count 'MY_COUNTER' '0000'}}  // all returned values will be of the length 4 and the missing positions will be fitted with zeros
 *
 * Another spezial feature of this helper is the use of template statements inside the counter name parameter
 *
 *     {{count 'MY_COUNTER_{{sord.objKeys.FILE_REFERENCE}}'}} // this will create a counter for every file reference
 *
 * ## ObjKey Iterator: eachObjKey
 * Registers the templating iterator `eachObjKey` to iterate over an array of object keys.
 * This Iterator handles the String[] array of the ObjKey-value property.
 *
 * The enclosed context can use the properties name and value. Please note that `eachObjKey` is only required
 * if sol.common.ObjectFormatter.TemplateSord is not used.
 *
 *     {{#eachObjKey sord}}{{name}}: {{value}}{{/eachObjKey}}
 *
 * ## Map values helper: mapTable
 * Registers the templating iterator `mapTable` to iterate over an object with object keys
 * which ends with an index number
 *
 *     {{#mapTable mapKeys indicatorKey="INVI_POS_NO"}}
 *       {{INVI_POS_NO}} {{INVI_POS_DATA}}
 *     {{/mapTable}}
 *
 *     // example map table
 *     INVI_POS_NO1 = "1"
 *     INVI_POS_NO2 = "2"
 *     INVI_POS_DATA1 = "Data 123"
 *     INVI_POS_DATA2 = "Data 345"
 *
 * `#mapTable` is an iterator with an isolated scope. Values of the sord can still be accessed using `../`.
 *
 *     {{#mapTable mapKeys indicatorKey="INVI_POS_NO"}}
 *       {{../sord.objKeys.INVOICE_NO}} {{INVI_POS_NO}} {{INVI_POS_DATA}}
 *     {{/mapTable}}
 *
 * ## Substring helper: substring
 * Registers the templating function `substring`, which allows to only use parts from an input value.
 *
 *     {{substring stringProperty 0 4}}
 *     {{substring stringProperty 0 1 uppercase='true'}}
 *
 * ## Replace helper: replace
 *
 *     {{replace INVI_GROSS_AMOUNT '-' ''}}
 *
 * ## Translation helper: translate
 * Registers the templating function `translate`, which allows to use translation keys in the templates.
 *
 * The language string is optional. If it is omitted, the function tries to get the language from the connection.
 *
 *     {{translate stringProperty languageProperty}}
 *
 * or
 *
 *     {{translate "this.is.a.TranslationKey", "de"}}
 *
 *
 * ## Barcode creation helper: base64Barcode
 * Registers the templating function `base64Barcode` which creates barcode images for Apache FOP reports.
 *
 * QR code example:
 *
 *     {{base64Barcode type="QR_CODE" content="elodms://12345"}}
 *
 * Code 39 example:
 *
 *     {{base64Barcode type="CODE_39" content="HELLO"}}
 *
 * Interleaved 2 of 5 example:
 *
 *     {{base64Barcode type="ITF" content="123456"}}
 *
 * Apache FOP integration example:
 *
 *     <fo:block><fo:external-graphic src="url('data:image/png;base64,{{base64Barcode content="dms://{{sord.guid}}" type="QR_CODE"}}')"/></fo:block>
 *
 * ## Image as Base 64 helper: base64Image
 *
 * Loads an image from the repository by the object ID and returns it as base64 encoded String
 *
 * Example:
 *
 *     var base64Content = sol.create("sol.common.Template", { source: "{{base64Image objId='{{sord.objKeys.VISITOR_PHOTO_GUID}}'}}" }).applySord(sord);
 *
 * Apache FOP integration example
 *
 *     <fo:block><fo:external-graphic src="url('data:image/jpg;base64,{{base64Image objId='{{hierarchy.visitor.objKeys.VISITOR_PHOTO_GUID}}'}}')"/></fo:block>
 *
 * ## Using if conditions if, ifCond
 *
 * Handlebars provides an easy way to check if a value is given using the build in helper
 *
 *     {{#if sord.name}} ... {{/if}}
 *
 * Camparison of Strings can be realised thanks to ifCond. Please note that the compare iterator must be passed as a string value.
 *
 *     {{#ifCond sordA.name '==' sordB.name}} ... {{/ifCond}}
 *     {{#ifCond sordA.objKeys.NET_AMOUNT '<' sordB.objKeys.NET_AMOUNT}} ... {{/ifCond}}
 *
 * Following operators are supported by ifCond:
 *
 *     ==  ===  !==  !=  <  <=  >  >=  &&  ||
 *
 * ## Bock helper 'ifNegative'
 *
 *     {{#ifNegative INVI_GROSS_AMOUNT}} ... {{ifNegative}}
 *
 * ## Using if conditions if, ifContains
 *
 * Handlebars provides an easy way to check if a value is given using the build in helper
 *
 *     {{#if sord.name}} ... {{/if}}
 *
 * A string can be searched for another string thanks to ifContains.
 *
 *     {{#ifContains sordA.name sordB.name}} ... {{/ifContains}}
 *     {{#ifContains sordA.objKeys.DESCRIPTION 'INV'}} ... {{/ifContains}}
 *
 * ## Block helper 'ifKey'
 *
 *     {{#ifKey ../objKeys.INVOICE_TYPE 'CN'}} ... {{/ifKey}}
 *
 * ## Current user
 *
 * The current user name can be given by
 *
 *     {{currentUser}}
 *
 * Additional properties like the user id can be accessed thanks to an optional property.
 * Following properties are supported:
 *
 *     {{currentUser 'id'}}
 *     {{currentUser 'guid'}}
 *     {{currentUser 'desc'}}
 *     {{currentUser 'email'}}
 *
 * By default or if properties are passed that are not mentioned above the users name ist returned.
 *
 * ## Get user folder GUIDs
 *
 * Every ELO user has a folder that allows storing personal data. The following helper will return the guid of this folder based on the current user session.
 *
 *     {{userFolder}}
 *
 * In addition the default subfolders can be adressed as well
 *
 *     {{userFolder 'private'}}
 *     {{userFolder 'data'}}
 *     {{userFolder 'inbox'}}
 *
 * ## Pad left
 *
 *     {{padLeft sord.objKeys.VENDOR_NO '0000000000'}}
 *
 * ## Number
 *
 * Returns a number with a dot as decimal separator
 *
 *     {{number sord.mapKeys.INVI_TOTAL_NET_PRICE1}}
 *
 * ## Abs
 *
 * Returns a number without sign
 *
 *     {{{abs INVI_GROSS_AMOUNT decimalSeparator=','}}}
 *
 * ## Helper 'debitCreditIndicator':
 *
 * Returns an indicator that shows if an amount is negative
 *
 *     {{debitCreditIndicator INVI_GROSS_AMOUNT 'S' 'H'}}
 *
 * ## External link
 *
 * Creates an external link and returns the appropriate URL
 *
 *     {{{externalLink objId='{{{sord.id}}}' limitTo=1 limitToUnit='y' times=5}}}
 *     {{externalLink objId='{{{sord.id}}}' limitTo=1 limitToUnit='y' times=5 escapeXml=true}}
 *
 * ## Sum map field values
 *
 * Iterates over an object with map keys which ends with an index number.
 * The values of the specified field are summed.
 *
 *     {{mapFieldSum sord.mapKeys field='INVI_POS_DATA' decimals=2 onlyIfEmpty='INVI_POS_OPT' onlyIfNotEmpty='INVI_POS_NR'}}
 *
 *     // example map data
 *     INVI_POS_NR1 = "01"
 *     INVI_POS_DATA1 = "1"
 *     INVI_POS_NR2 = "02"
 *     INVI_POS_DATA2 = "2"
 *     INVI_POS_NR3 = "03"
 *     INVI_POS_DATA3 = "3"
 *     INVI_POS_NR4 = "04"
 *     INVI_POS_DATA4 = "4,333"
 *     INVI_POS_NR5 = "05"
 *     INVI_POS_DATA5 = "5,333"
 *     INVI_POS_OPT5 = "Test"
 *
 *     Returns: 10,33
 *
 *
 * ## Block helper 'minDate'
 *
 * Iterates over an array and determinates the minimum date.
 *
 *     {{#minDate sords format='DD.MM.YYYY'}}{{objKeys.INVOICE_DATE}}{{/minDate}}
 *
 *
 * ## Block helper 'maxDate'
 *
 * Iterates over an array and determinates the minimum date.
 *
 *     {{#maxDate sords format='DD.MM.YYYY'}}{{objKeys.INVOICE_DATE}}{{/maxDate}}
 *
 *
 * ## Helper 'kwl:key'
 *
 * Returns the key of a localized keyword list entry
 *
 *     {{kwl:key sord.objKeys.INVOICE_TYPE}}
 *
 *
 * ## Helper 'kwl:value'
 *
 * Returns the localized text of a localized keyword list entry
 *
 *     {{kwl:value sord.objKeys.INVOICE_TYPE}}
 *
 *
 * ## Helper 'math'
 *
 * Calculates a field
 *
 *     {{math FIELD1 "+" FIELD2 decimalPlaces=2 decimalSeparator=','}}
 *
 *
 * ## Custom
 *
 * This helper lets you use your previously by {@link #registerCustomHelper} registered functions.
 * This only works in ELO modules which support the 'globalScope' (currently only JavaClient and IndexServer).
 *
 * To register a custom helper, create an instance of 'sol.common.Template' and register your helper function.
 *
 * The script can NOT start with the `lib_` prefix.
 *
 * A `your.namespace.CustomHelper.js` could be implemented like this:
 *
 *     //&#64;include lib_sol.common.Template.js
 *
 *     (function () {
 *       var tpl = sol.create("sol.common.Template");
 *
 *       tpl.registerCustomHelper("hello", function (config) {
 *         return "hello " + arguments[0];
 *       });
 *
 *       // register further helpers
 *
 *     }());
 *
 * It is important this registration is executed bevor a custom helper will be used for the first time.
 * E.g. when the scripts are loaded like in the example above.
 *
 * The helper will used with `{{custom '%HELPER_NAME%' %ADDITIONAL_ARGS% }}`:
 *
 *     var tpl = sol.create("sol.common.Template", { source: "{{custom 'hello' name}}" });
 *     var str = tpl.apply({ name: "hans" });
 *
 * This will result in `str => hello hans`
 *
 * Another implementation of the same helper function might look like this:
 *
 * You can pass in a variable number of parameters to a helper function. They will be made available in options.hash.
 *
 *     ...
 *       var tpl = sol.create("sol.common.Template");
 *       var fct = function (cfg) {
 *         return "hello " + cfg.hash.name;
 *       };
 *       tpl.registerCustomHelper("hello", fct);
 *     ...
 *
 * Which would then be used like this (to the same result):
 *
 *     var tpl = sol.create("sol.common.Template", { source: "{{custom 'hello' name=name}}" });
 *     var str = tpl.apply({ name: "hans" });
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @eloas
 * @elojc
 *
 * @requires sol.common.Cache
 * @requires sol.common.ObjectUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.BarcodeUtils
 */
sol.define("sol.common.Template", {

  /**
   * @cfg {String} source
   * Template source as a string.
   *
   *         source = "Hello {{name}}."
   */

  /**
   * @property {Object} template
   * Compiled handlebars.js template.
   */

  /**
   * @property {Boolean} isRepoPath
   * If true the given string is a repository path and the separator is replaced by pilcrow.
   */

  pilcrow: "\u00b6",

  initialize: function (config) {
    var me = this;
    me.logger = sol.create("sol.Logger", { scope: me.$className });
    config = config || {};
    if (config.source) {
      me.setSource(config.source, config.isRepoPath);
    }
    if (config.objId) {
      me.load(config.objId);
    }
  },

  /**
  * @private
  * Compiles the template string.
  */
  compile: function () {
    var me = this;
    if (!me.source) {
      return;
    }

    me.source += "";
    me.template = sol.common.TemplateUtils.compileUsingCache(me.source);
  },

  /**
   * Loads the template string from an ELO document
   * @param {String} objId ELO object ID
   */
  load: function (objId) {
    var me = this,
        repoUtils, content;

    me.logger.enter("load", arguments);
    if (!objId) {
      throw "Template.load(): Object Id must not be empty";
    }
    repoUtils = sol.common.RepoUtils;
    content = repoUtils.downloadSmallContentToString(objId);
    content = String(content).replace("\uFEFF", "");

    if (!content) {
      throw "Template string must not be empty.";
    }
    me.source = content;
    me.compile();
    me.logger.exit("load", { source: me.source });
  },

  /**
   * Sets the source from a template string
   * @param {String} source
   * @param {Boolean} isRepoPath
   */
  setSource: function (source, isRepoPath) {
    var me = this;
    me.logger.enter("setSource", arguments);
    source = String(source);
    if (isRepoPath && (source.indexOf(me.pilcrow) < 0)) {
      source = sol.common.StringUtils.replaceAll(source, "/", me.pilcrow);
    }
    me.source = source;
    me.compile();
    me.logger.exit("setSource", { source: me.source });
  },

  /**
  * Apply the template with the object data.
  * @param {Object} paramObj Data object which contains the data to fill in.
  * @returns {String}
  */
  apply: function (paramObj) {
    var me = this;
    if (!me.template) {
      throw "Template is empty";
    }
    me.logger.enter("apply", arguments);
    me.result = me.template(paramObj);
    me.logger.exit("apply", me.result);
    return me.result;
  },

  /**
   * Renders the template with the sord data, optionally including its workflow data.
   * @param {String|de.elo.ix.client.Sord} sord Object ID of the element or a Sord.
   * @param {String|Number} flowId (optional) workflow ID of the element.
   * @returns {String}
   */
  applySord: function (sord, flowId) {
    var me = this, templateSord,
        _result;
    me.logger.enter("applySord", arguments);
    if (!sord) {
      me.logger.exit("applySord");
      return;
    }

    if (!sol.common.SordUtils.isSord(sord) || !sol.common.SordUtils.isIndexdataLoaded(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, EditInfoC.mbSord, LockC.NO).sord;
    }

    if ((flowId != undefined) && (+(flowId) === +(flowId))) { // flowId is a number
      templateSord = sol.common.WfUtils.getTemplateSord(sord, flowId);
    }

    if (!templateSord) {
      templateSord = sol.common.SordUtils.getTemplateSord(sord);
    }

    _result = me.apply(templateSord);
    me.logger.exit("applySord");
    return _result;
  },

  getResult: function () {
    var me = this;
    me.logger.enter("getResult", arguments);
    me.logger.exit("getResult", me.result);
    return me.result;
  },

  /**
   * Registers an helper function globally. This function can be used later by using the custom helper.
   * @param {String} name Name of the helper
   * @param {Function} fct The function which will be used by the custom helper. This function recieves all parameters that are handed over to the custom helper after the name of the called cutom helper.
   */
  registerCustomHelper: function (name, fct) {
    var me = this;
    if (typeof globalScope === "object") {
      globalScope.$handlebars = globalScope.$handlebars || {};
      globalScope.$handlebars.customhelper = globalScope.$handlebars.customhelper || {};
      if (globalScope.$handlebars.customhelper[name]) {
        me.logger.warn(["Overriding existing custom helper '{0}'", name]);
      }
      globalScope.$handlebars.customhelper[name] = fct;
    } else {
      throw "custom handlebars helpers are not supported in this environment";
    }
  }

});

/* Register helpers for handlebars.js templates */

Handlebars.registerHelper("custom", function () {
  var customHelperName;

  if (typeof globalScope !== "object") {
    return new Handlebars.SafeString("# custom helpers are not supported in this environment #");
  }

  if (arguments.length < 1) {
    return new Handlebars.SafeString("# no custom helper name given #");
  }

  customHelperName = arguments[0];

  if (!globalScope.$handlebars || !globalScope.$handlebars.customhelper || typeof globalScope.$handlebars.customhelper[customHelperName] !== "function") {
    return new Handlebars.SafeString("# no custom helper registered for name '" + customHelperName + "' #");
  }

  return globalScope.$handlebars.customhelper[customHelperName].apply(this, Array.prototype.slice.call(arguments, 1));
});

Handlebars.registerHelper("formatDate", function () {
  var defaultFormat = "YYYYMMDDHHmmss",
      outputFormat, inputDate, inputFormat, isDate, date;

  defaultFormat = "YYYYMMDDHHmmss";
  outputFormat = (arguments.length > 1) ? arguments[0] : defaultFormat;
  inputDate = (arguments.length > 2) ? arguments[1] : null;
  inputFormat = (arguments.length > 3) ? arguments[2] : null;
  isDate = sol.common.ObjectUtils.isDate(inputDate);

  if (inputDate) {
    if (!isDate && !inputFormat) {
      inputFormat = (inputDate.length === 8) ? "YYYYMMDD" : defaultFormat;
    }
    date = (isDate) ? moment(inputDate) : moment(inputDate, inputFormat);
  } else {
    date = moment();
  }

  return new Handlebars.SafeString(date.format(outputFormat));
});

Handlebars.registerHelper("count", function () {
  var counterTemplateString = arguments[0],
      context = arguments[arguments.length - 1],
      padLeft = (arguments.length === 3) ? arguments[1] : null,
      counterTemplate, counterName, count;

  if (!counterTemplateString) {
    return new Handlebars.SafeString("-");
  }
  counterTemplate = sol.common.TemplateUtils.compileUsingCache(counterTemplateString);
  counterName = counterTemplate(context.data.root);

  if (!counterName) {
    return new Handlebars.SafeString("-");
    //throw "Counter name must not be empty.";
  }
  count = sol.common.CounterUtils.incCounter(counterName);
  if (padLeft) {
    count = sol.common.StringUtils.padLeft(count, padLeft.length, padLeft[0]);
  }
  return new Handlebars.SafeString(count);
});

Handlebars.registerHelper("padLeft", function (str, padLeft) {
  return new Handlebars.SafeString(sol.common.StringUtils.padLeft(str, padLeft.length, padLeft[0]));
});

Handlebars.registerHelper("eachObjKey", function (context, options) {
  var ret = "",
      i, objKey, value;
  for (i = 0; i < context.length; i++) {
    objKey = context[i];
    value = "";
    if (objKey.data && (objKey.data.length > 0)) {
      value = objKey.data[0];
    }
    ret += options.fn({ key: objKey.name, value: value });
  }

  return ret;
});

Handlebars.registerHelper("mapTable", function (context, options) {
  var ret = "",
      mapFields = [],
      maxLines = 2000,
      indicatorKey = options.hash.indicatorKey,
      i, key, index, name, data;

  context = context || {};

  if (!options.mapFields) {
    for (key in context) {
      index = sol.common.StringUtils.getTrailingNumber(key);
      if (index == undefined) {
        continue;
      }
      name = sol.common.StringUtils.removeTrailingNumber(key);
      mapFields[index] = mapFields[index] || {};
      mapFields[index][name] = context[key];
    }
  }

  for (i = 1; i < maxLines; i++) {
    if (!context[indicatorKey + i]) {
      break;
    }
    data = mapFields[i];
    data.objKeys = context.objKeys;
    data.parentIndex = options.data.index;
    data.mapIndex = i + "";
    if (options && options.data && options.data.root) {
      data.firstDocChild = options.data.root.firstDocChild;
    }

    ret += options.fn(data);
  }

  return ret;
});

Handlebars.registerHelper("mapFieldSum", function (context, options) {
  var count = 0.0, key, field,
      decimals, name, onlyIfEmpty, onlyIfNotEmpty, idx;

  if (options && options.hash) {
    if (options.hash.field) {
      field = options.hash.field;
    } else {
      //no field given return empty string
      return "";
    }
    if (options.hash.decimals) {
      decimals = options.hash.decimals;
    }
    if (options.hash.onlyIfEmpty) {
      onlyIfEmpty = options.hash.onlyIfEmpty;
    }
    if (options.hash.onlyIfNotEmpty) {
      onlyIfNotEmpty = options.hash.onlyIfNotEmpty;
    }
  } else {
    return "";
  }
  if (!context || context.length < 1) {
    return "";
  }

  for (key in context) {
    name = sol.common.StringUtils.removeTrailingNumber(key);
    idx = sol.common.StringUtils.getTrailingNumber(key);
    if (field != name) {
      continue;
    }
    if (onlyIfEmpty && !sol.common.StringUtils.isEmpty(context[onlyIfEmpty + idx])) {
      continue;
    }
    if (onlyIfNotEmpty && sol.common.StringUtils.isEmpty(context[onlyIfNotEmpty + idx])) {
      continue;
    }
    try {
      count += parseFloat(context[key].replace(",", "."));
    } catch (ignore) { /*ignore*/ }
  }

  if (decimals) {
    count = count.toFixed(decimals);
  }

  return new Handlebars.SafeString(String(count).replace(".", ","));
});

Handlebars.registerHelper("substring", function (str, start, end, options) {
  var resultStr = str ? str.substring(start, end) : "";
  if (resultStr && options && options.hash && options.hash.uppercase) {
    resultStr = resultStr.toUpperCase();
  }
  return new Handlebars.SafeString(resultStr);
});

Handlebars.registerHelper("replace", function (str, find, replace, options) {
  var result;

  if (!str) {
    return str;
  }
  str = str.toString();

  if (!find) {
    return str;
  }
  replace = replace || "";

  result = str.split(find).join(replace);

  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper("translate", function (key, language) {
  var translatedStr = "";
  try {
    // additional check necessary, because if language is omitted in template string, language parameter has accidentally the context parameter
    if (!language || ((typeof language === "object") && (language.name === "translate"))) {
      translatedStr = sol.common.TranslateTerms.translate(key);
    } else {
      translatedStr = sol.common.TranslateTerms.getTerm(language, key);
    }
  } catch (ex) {
    translatedStr = key;
  }
  return new Handlebars.SafeString(translatedStr);
});

Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case "===":
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case "!==":
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case "!=":
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case "<":
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case "<=":
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case ">":
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case ">=":
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case "&&":
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case "||":
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

Handlebars.registerHelper("base64Barcode", function (options) {
  var me = this,
      config = options.hash,
      contentTemplate, base64String;
  config.returnBase64 = true;
  contentTemplate = sol.common.TemplateUtils.compileUsingCache(config.content);
  config.content = contentTemplate(me);
  base64String = sol.common.as.BarcodeUtils.generate(config.type, config.content, config);
  return new Handlebars.SafeString(base64String);
});

Handlebars.registerHelper("base64Image", function (options) {
  var me = this,
      config = options.hash,
      objIdTemplate, base64Content;
  objIdTemplate = sol.common.TemplateUtils.compileUsingCache(config.objId);
  config.objId = objIdTemplate(me);
  if (!config.objId) {
    throw "Object ID is empty";
  }
  try {
    base64Content = sol.common.RepoUtils.downloadToBase64String(config.objId);
  } catch (ex) {
    // return a transparent 1x1 px png
    base64Content = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    log.warn("could not load image with objId=" + config.objId); // TODO sol.common.GlobelLogger
  }
  return new Handlebars.SafeString(base64Content);
});

Handlebars.registerHelper("ifContains", function (input, searchString, options) {
  input = input || "";
  if (input.toString().indexOf(searchString) != -1) {
    return options.fn(this);
  }	else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("ifKey", function (input, key, options) {
  var parts;

  input = input || "";
  input = input.toString();
  parts = input.split(" ");

  if (parts && (parts.length > 0) && (parts[0] == key)) {
    return options.fn(this);
  }	else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("ifNegative", function (input, options) {

  input = input || "";
  input = input.toString();

  if ((input.length > 0) && (input[0] == "-")) {
    return options.fn(this);
  }	else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("doublecurly", function (object, open) {
  return open ? new Handlebars.SafeString("{{") : new Handlebars.SafeString("}}");
});

Handlebars.registerHelper("text", function (inputString) {
  return new Handlebars.SafeString(inputString);
});

Handlebars.registerHelper("currentUser", function (options) {
  var user = ixConnect.loginResult.user;
  switch (options) {
    case "id":
      return new Handlebars.SafeString(user.id);
    case "guid":
      return new Handlebars.SafeString(user.guid);
    case "desc":
      return new Handlebars.SafeString(user.desc);
    case "email":
      return new Handlebars.SafeString(user.userProps[UserInfoC.PROP_NAME_EMAIL]);
    default:
      return new Handlebars.SafeString(user.name);
  }
});

Handlebars.registerHelper("userFolder", function (options) {
  var user = ixConnect.loginResult.user,
      query, sord;

  switch (options) {
    case "private":
      query = "OKEY:ELOINDEX=/users/private#" + user.guid;
      break;
    case "data":
      query = "OKEY:ELOINDEX=/users/data#" + user.guid;
      break;
    case "inbox":
      query = "OKEY:ELOINDEX=/users/inbox#" + user.guid;
      break;
    default:
      query = "ARCPATH:/" + user.name;
  }

  sord = ixConnect.ix().checkoutSord(query, SordC.mbOnlyGuid, LockC.NO);
  if (sord) {
    return new Handlebars.SafeString(sord.guid);
  }
});

Handlebars.registerHelper("number", function (number) {
  number = (number == undefined) ? "" : String(number);

  if (number.match(/^-?\d+,\d+$/)) {
    number = number.replace(",", ".");
  }
  return new Handlebars.SafeString(number);
});

Handlebars.registerHelper("abs", function (number, options) {
  var groups, decimalSeparator;

  number = (number == undefined) ? "" : String(number);
  options = options || {};
  options.hash = options.hash || {};

  decimalSeparator = options.hash.decimalSeparator || ".";

  groups = number.match(/(^-?)(\d+)(\D)(\d+$)/);

  if (groups && (groups.length == 5)) {
    number = groups[2] + decimalSeparator + groups[4];
  }

  return new Handlebars.SafeString(number);
});

Handlebars.registerHelper("debitCreditIndicator", function (number, debitIndicator, creditIndicator) {
  var indicator, numberStr;

  debitIndicator = debitIndicator || "D";
  creditIndicator = creditIndicator || "C";

  try {
    indicator = creditIndicator;

    numberStr = number + "";
    numberStr = sol.common.StringUtils.replaceAll(numberStr, ",", ".");

    number = parseFloat(numberStr);

    if (number < 0) {
      indicator = debitIndicator;
    }
  } catch (ignore) {
  }

  return new Handlebars.SafeString(indicator);
});

Handlebars.registerHelper("minDate", function (tplSords, options) {
  var minDateIso = "",
      isoDates = [],
      i, tplSord, isoDate, config, minDateFormatted;

  config = options.hash;

  for (i = 0; i < tplSords.length; i++) {
    tplSord = tplSords[i];

    isoDate = options.fn(tplSord).substr(0, 8);
    if (isoDate) {
      isoDates.push(isoDate);
    }
  }

  isoDates.sort();

  if (isoDates.length > 0) {
    minDateIso = isoDates[0];
  }

  if (config.format) {
    minDateFormatted = moment(minDateIso, "YYYYMMDD").format(config.format);
  } else {
    minDateFormatted;
  }

  return new Handlebars.SafeString(minDateFormatted);
});

Handlebars.registerHelper("maxDate", function (tplSords, options) {
  var minDateIso = "",
      isoDates = [],
      i, tplSord, isoDate, config, minDateFormatted;

  config = options.hash;

  for (i = 0; i < tplSords.length; i++) {
    tplSord = tplSords[i];

    isoDate = options.fn(tplSord).substr(0, 8);
    if (isoDate) {
      isoDates.push(isoDate);
    }
  }

  isoDates.sort();

  if (isoDates.length > 0) {
    minDateIso = isoDates[isoDates.length - 1];
  }

  if (config.format) {
    minDateFormatted = moment(minDateIso, "YYYYMMDD").format(config.format);
  } else {
    minDateFormatted;
  }

  return new Handlebars.SafeString(minDateFormatted);
});

Handlebars.registerHelper("externalLink", function (options) {
  var me = this,
      objIdTemplate, url, config;

  config = options.hash;
  if (config.objId) {
    objIdTemplate = sol.common.TemplateUtils.compileUsingCache(config.objId);
    config.objId = objIdTemplate(me);
  }

  url = sol.common.RepoUtils.createExternalLink(config);

  return new Handlebars.SafeString(url);
});

Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
  var result;

  lvalue = (lvalue + "").replace(",", ".");
  rvalue = (rvalue + "").replace(",", ".");

  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  result = {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue
  }[operator];

  if (options.hash.decimalPlaces) {
    result = result.toFixed(options.hash.decimalPlaces);
  }

  if (options.hash.decimalSeparator) {
    result = (result + "").replace(".", options.hash.decimalSeparator);
  }

  return result;
});

Handlebars.registerHelper("monthName", function (options) {
  var monthName = "",
      isoDate, month, textStyleString, textStyle, localeString;

  isoDate = options.hash.isoDate || moment().format("YYYYMM");

  if (/^\d{6}/.test(isoDate)) {
    month = isoDate.substring(4, 6);
    textStyleString = options.hash.textStyle || "FULL";
    textStyle = java.time.format.TextStyle[textStyleString.toUpperCase()];
    localeString = options.hash.locale || "en";
    monthName = java.time.Month.of(month).getDisplayName(textStyle, new java.util.Locale(localeString));
  }

  return new Handlebars.SafeString(monthName);
});

/**
 * @private
 */
sol.define("sol.common.TemplateRegexUtils", {
  singleton: true,

  extract: function (text, regExp) {
    var m, matchValue;

    matchValue = (text === undefined) ? "" : String(text);
    if (regExp && (m = regExp.exec(text)) !== null) {
      // The result can be accessed through the `m`-variable.
      if (m.length > 0) {
        matchValue = m[1];
      }
    }
    return matchValue.trim();
  }
});

Handlebars.registerHelper("kwl:key", function (keyValue, options) {
  var delimiter, regExp, result;

  delimiter = options.hash.delimiter || "-";
  regExp = new RegExp("([^\\s]+)\\s" + delimiter + "\\s", "m");

  result = sol.common.TemplateRegexUtils.extract(keyValue, regExp);

  return new Handlebars.SafeString(result);
});

Handlebars.registerHelper("kwl:value", function (keyValue, options) {
  var delimiter, regExp, result;

  delimiter = options.hash.delimiter || "-";
  regExp = new RegExp(delimiter + "\\s(.*)", "m");

  result = sol.common.TemplateRegexUtils.extract(keyValue, regExp);

  return new Handlebars.SafeString(result);
});

/**
 * This class contains util functions to facilitate working with templates.
 * E.g. render, which takes any object(=template) and inputdata and returns the recursively rendered object.
 * @elojc
 * @eloas
 * @eloix
 */
sol.define("sol.common.TemplateUtils", {
  singleton: true,
  /* renders a template `tpl` using the JavaScript-Object `tplData`
  * if options.emptyNonRendered is defined as true, but the rendered String is empty the string will be returned empty.
  * otherwise, the original templatestring is returned (e.g. "{{sord.objKeys.MYFIELD}}")
  * if options.stringifyResults is defined as true, data from the tplData object which is not already a string is stringified
  */
  render: function (tpl, tplData, options) {
    var fallbackToTplStr = (options = (options || {})).emptyNonRendered !== true,
        stringifyResults = options.stringifyResults === true;
    function isString(str) {
      return (typeof str === "string")
        || (typeof java !== "undefined" && str instanceof java.lang.String);
    }
    function stringify(obj) {
      return JSON.stringify(obj, function (_, val) {
        return (val && val.getClass) ? String(val) : val;
      });
    }
    function renderStr(str) {
      var res = (sol.create("sol.common.Template", { source: str })).apply(tplData);
      return (isString(res) && (res = String(res).trim()))
        || (stringifyResults ? stringify(res) : res);
    }
    function processStr(str) {
      var res = str;
      return (str && (~str.indexOf("{{") ? (res = renderStr(str)) : str))
        || ((res === "") && fallbackToTplStr && str)
        || res;
    }
    function processObj(obj) {
      Object.keys(obj)
        .forEach(function (key) {
          try {
            obj[key] = render(obj[key]); // recursion
          } catch (e) {} // setting the property value may fail
        });
    }
    function processAny(any) {
      return (Array.isArray(any) && any.map(render)) // recursion
        || ((typeof any === "object" && any !== null) && processObj(any))
        || any;
    }
    function render(any) {
      return isString(any) ? processStr(String(any)) : processAny(any);
    }
    return render(tpl);
  },

  /**
   * Compiles Handlebars strings using a cache for compiled strings
   * @param {String} source Source
   */
  compileUsingCache: function (source) {
    var me = this,
        template;

    source += "";

    if ((typeof globalScope === "object") && (source.length <= 512)) {
      globalScope.$handlebars = globalScope.$handlebars || {};
      globalScope.$handlebars.compiledTemplates = globalScope.$handlebars.compiledTemplates || sol.create("sol.common.Cache", {});
      template = globalScope.$handlebars.compiledTemplates.get(source);
      if (template) {
        me.logger.debug(["Handlebars code from cache: {0}", source]);
      } else {
        template = me.compileWithRetries(source);
        globalScope.$handlebars.compiledTemplates.put(source, template);
      }
    }

    if (!template) {
      template = me.compileWithRetries(source);
    }

    return template;
  },

  /**
   * @private
   * @param {String} source Source
   */
  compileWithRetries: function (source) {
    var me = this,
        tries = 3,
        i, template;

    for (i = 0; i <= tries; i++) {
      try {
        template = Handlebars.compile(source);
        me.logger.debug(["Handlebars string compiled: {0}", source]);
        break;
      } catch (ex) {
        if (i >= tries) {
          throw "Exception compiling template: " + ex;
        }
      }
    }

    return template;
  }
});

