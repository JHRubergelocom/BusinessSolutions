
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectSortUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js


/**
 * Iterates over a sord's MapTable(s) or elements provided via parameter or a service call and calls a registered function for each element.
 *
 * Each row/element is passed to the function as parameter. The parameter name must be defined
 * as options.elementArg and could be called "sordMetadata".
 *
 * Scroll down for an example using a service as data source instead of a MAPTABLE.
 *
 * ### Example: Short Intro
 *
 * Define the table structure in `columns`. Omit the "1" from the end of the field name which you
 * defined in the form-editor.
 *
 * If this function is running in a workflow, it will have access to objId and flowId automatically.
 * Otherwise, define both as a parameter.
 *
 *     {
 *       "objId": "5203", // optional, when in workflow
 *       "flowId": 59,    // optional, when in workflow
 *       "columns": {
 *         "wfMap": [
 *           "COURSE_ENROLLMENT_USER",
 *           "COURSE_ENROLLMENT_STATUS"
 *         ],
 *         "map": []
 *       },
 *       "options": {
 *         "elementArg": "sordMetadata"
 *       },
 *       "callback": {
 *         "name": "RF_sol_learning_function_CreateEnrollmentHeadless",
 *         "args": {
 *           "myadditionalargument": "{{translate 'my.locale.string'}}"
 *         }
 *       }
 *     }
 *
 * The function would now be called with a parameter called `sordMetadata` for every table row.
 * The parameter would look like this
 *
 *     {
 *       "sordMetadata": {
 *           "COURSE_ENROLLMENT_USER": "Felix Unger",
 *           "COURSE_ENROLLMENT_STATUS": "ENROLLED"
 *       },
 *       "myadditionalargument": "This is a localized text"
 *     }
 *
 * To view these parameters, define `options.dryRun:true`. The callback will not be executed then.
 * Instead you can see all values with with the function will be called. (One array entry is one call).
 *
 * The object displayed in "result" will be passed to the function defined in callback.name.
 *
 * ### Example: TemplateSord
 *
 * Your target function might require a TemplateSord instead of a flat object. Simply define
 *
 *       "options": {
 *         "elementArg": "sordMetadata",
 *         "elementAsTemplateSord": true
 *       },
 *
 * The result would look like this:
 *
 *     {
 *       "sordMetadata": {
 *         "wfMapKeys": {
 *           "COURSE_ENROLLMENT_USER": "Felix Unger",
 *           "COURSE_ENROLLMENT_STATUS": "ENROLLED"
 *         }
 *       },
 *       "myadditionalargument": "This is a localized text"
 *     }
 *
 * ### Example: Mapping field values
 *
 * Most of the time, the target function will probably require different field names from the original
 * sord's field names.
 *
 * You can use a mapping to move fields from one property to another: Please note, that the property key
 * is relative to sordMetadata (or whatever is defined as `options.elementArg`), while the property value
 * is not. This enables moving values from e.g. a templateSord to an outer scope
 *
 *       "options": {
 *         "elementArg": "sordMetadata",
 *         "elementAsTemplateSord": true,
 *         "moveValues": {
 *           "wfMapKeys.COURSE_ENROLLMENT_STATUS": "sordMetadata.objKeys.COURSE_ENROLLMENT_STATUS",
 *           "wfMapKeys.COURSE_ENROLLMENT_USER": "thisis.something.else",
 *         }
 *       }
 *
 * Of course the mapping source would not include "wfMapKeys", if the "elementAsTemplateSord" option
 * was set to false. The mapping target path can be as deeply nested as you wish.
 *
 *     {
 *       "sordMetadata": {
 *         "wfMapKeys": {},
 *         "objKeys": {
 *           "COURSE_ENROLLMENT_STATUS": "ENROLLED"
 *         }
 *       },
 *       "thisis": {
 *         "something": {
 *           "else": "ENROLLED"
 *         }
 *       },
 *       "myadditionalargument": "This is a localized text"
 *     }
 *
 * Example: Adding additional parameters
 *
 * Most functions need additional parameters. And you will also want to have access to fields of the
 * (workflow) sord, which contains the maptable.
 *
 * E.g. imagine an invoice sord containing a maptable of items. Each item will have an item number
 * and item description. However, you want to call a createInvoiceItem function which also requires
 * a field called "INVOICE_NO" which is not contained in the maptable but on the base sord.
 * You can now add this field using a handlebars helper in the additional `callback.args` object.
 * In handlebars you have access to the (invoice) sord.
 *
 * If additional "callback.args" are defined, they are deep-merged into the prepared parameter
 * which contains the sordMetadata element:
 *
 *     element: { sordMetadata: { mapKeys: { ... } } }
 *     args:    { test: true, sordMetadata: { testInner: true } }
 *     result:  { test: true, sordMetadata: { testInner: true, mapKeys: { ... } } }
 *
 * A complete example could look like this:
 *
 *     {
 *       "objId": "5203", // optional, when in workflow
 *       "flowId": 59,    // optional, when in workflow
 *       "columns": {
 *         "wfMap": [
 *           "COURSE_ENROLLMENT_USER",
 *           "COURSE_ENROLLMENT_STATUS"
 *         ],
 *         "map": []
 *       },
 *       "options": {
 *         "elementArg": "sordMetadata",
 *         "elementAsTemplateSord": true,
 *         "moveValues": {
 *           "wfMapKeys.COURSE_ENROLLMENT_STATUS": "objKeys.COURSE_ENROLLMENT_STATUS"
 *         }
 *       },
 *       "callback": {
 *         "name": "RF_sol_learning_function_CreateEnrollmentHeadless",
 *         "args": {
 *           "myadditionalargument": "{{translate 'my.locale.string'}}",
 *           "sordMetadata": {
 *             "objId": "{{sord.id}}",
 *             "flowId": "{{flowId}}",
 *             "objKeys": {
 *               "COURSE_REFERENCE": "{{{sord.objKeys.COURSE_REFERENCE}}}",
 *               "COURSE_NAME": "{{{sord.objKeys.COURSE_NAME}}}"
 *             }
 *           }
 *         }
 *       }
 *     }
 *
 * Which results in
 *
 *         {
 *           "sordMetadata": {
 *             "mapKeys": {},
 *             "wfMapKeys": {
 *               "COURSE_ENROLLMENT_USER": "Administrator"
 *             },
 *             "objKeys": {
 *               "COURSE_ENROLLMENT_STATUS": "ENROLLED",
 *               "COURSE_REFERENCE": "0007",
 *               "COURSE_NAME": "Test"
 *             },
 *             "objId": "5203",
 *             "flowId": "59"
 *           },
 *           "myadditionalargument": "my.locale.string"
 *         }
 *
 * ### Filtering
 * If you want that only specific rows would be passed to the callback, you can define filter rules in
 * the options. For each row, all of the given filter will be applied and only matching objects will
 * be kept and passed to the callback function. It doesn't matter if you're using map table or wfMap table.
 * The crucial point ist, that your filter prop path is matching a object path of the result object.
 * The output format is depending on elementAsTemplateSord option or your moveValues operations.
 *
 * The filter will be applied after the moveValue operation.
 *
 *
 * #### Applying a filter with single filter value
 *
 *     {
 *       "options": {
 *         "filter": [
 *           { "prop" : "sordMetadata.mapKeys.SOLUTION_FIELD", value: "A -*"}
 *         ]
 *       }
 *     }
 *
 * #### Applying a filter with multiple filter values
 *
 *     {
 *       "options": {
 *         "filter": [
 *           { "prop" : "sordMetadata.mapKeys.SOLUTION_FIELD", value: ["A -*", "B -*"]}
 *         ]
 *       }
 *     }
 *
 * #### Returns
 *
 * An array of all return values of the function calls or all prepared parameters which
 * would have been sent during each function call if `options.dryRun` is set to true.
 *
 *     { data: [{ objId: "12345", flowId: "33" }] }
 *
 * ### Sorting
 *
 * It is possible to specify certain search criteria after which the result is sorted.
 *
 * Important: Only the result on the service side is sorted, not on the database level.
 * This can lead to incorrect sorting when using pagination.
 *
 * Several sorting criteria can also be specified. The first element is always
 * the most important criterion. In the case of identical values, the following sorting criteria
 * are applied.
 *
 * Via `type` a sorting algorithm from {@see sol.common.ObjectSortUtils} can be passed as a string.
 * The name must be identical to the functions offered there. Otherwise,
 * the default is always selected as the standard.
 *
 * Possible types at the moment: `default`, `date`.
 *
 * The type `date` enables sorting with the help of date objects.
 *
 *     {
 *      "options": {
 *         "elementArg" : "data"
 *         "sort": [
 *            { "prop": "data.startDate", "type": "date" },
 *            { "prop": "data.reference"}
 *         ]
 *       }
 *     }
 *
 * ### Complete Example: Use service results (e.g. sords) as data source
 *
 * If your data is not contained in a MAPTABLE, you can also use an external service to provide e.g. sords.
 *
 * In this example, we want to find all courses in the archive using the RF_sol_common_service_SordProvider as `elementService`.
 * Then, we want to prepend "POPULAR" to each course's name, when the course has a 5 star rating, using the RF_sol_function_Set function.
 *
 * To enable access to the element's data when the callback is prepared for execution, we define `renderArgsWithElement": true`.
 * This enables the use of the element's data in the `callback.args` object's strings.
 *
 *     {
 *       "elementService": {
 *         "name": "RF_sol_common_service_SordProvider",
 *         "args": {
 *           "masks": ["Course"],
 *           "search": [{ "key": "SOL_TYPE", "value": ["COURSE"] }],
 *           "output": [
 *             { "source": { "type": "SORD", "key": "id" }, "target": { "prop": "id" } },
 *             { "source": { "type": "GRP", "key": "COURSE_NAME" }, "target": { "prop": "name" } },
 *             { "source": { "type": "MAP", "key": "COURSE_STAR_SCORE" }, "target": { "prop": "stars" } }
 *           ]
 *         }
 *       },
 *       "options": {
 *         "elementArg": "data",
 *         "moveValues": { "id": "objId" }, // the SET-function we use in the callback needs an objId.
 *         "renderArgsWithElement": true,
 *         "filter": [ { "prop": "data.stars", "value": "5" } ], // since SordProvider supports filtering too, we could have filtered above instead of here
 *         "dryRun": true // set this to false to actually execute the SET function in the end
 *       },
 *       "callback": {
 *         "name": "RF_sol_function_Set",
 *         "args": {
 *           "entries": [ { "type": "GRP", "key": "COURSE_NAME", "value": "POPULAR: {{{element.data.name}}}" }]
 *         }
 *       }
 *     }
 *
 * Info: instead of moving the `id` to `objId` using the `moveValues` option, we also could have defined `objId: "{{element.data.id}}"`
 * in the `callback.args` object.
 *
 * If you want to convert each item to an mapTable entry you can use the variable $mapIndex from your elementArg variable (e.g. data)
 * With Handlebars you can append each trailing number to your configuration result
 *
 *     { "type": "MAP", "key": "COURSE_NAME{{element.data.$mapIndex}}", "value": "{{{element.data.course}}}" }
 *
 * In this case you should avoid to use filter from the foreach function because we can't ensure that the index is correct.
 * For example the filter function will delete the second row, so your result is that $mapIndex = 2 is missing.
 *
 *     {
 *       "args": [
 *         {
 *           "entries": [ { "type": "GRP", "key": "COURSE_NAME1", "value": "POPULAR: BS ELO Contract" } ]
 *         },
 *         {
 *           "entries": [ { "type": "GRP", "key": "COURSE_NAME3", "value": "POPULAR: BS ELO Learning" } ]
 *         }
 *       ]
 *     }
 *
 * Instead use sordprovider filter function
 *
 *      {
 *       "elementService": {
 *         "name": "RF_sol_common_service_SordProvider",
 *         "args": {
 *           "masks": ["Course"],
 *           "search": [{ "key": "SOL_TYPE", "value": ["COURSE"] }],
 *           "filter": [ { "prop": "stars", "value": "5" } ]
 *           "output": [
 *             { "source": { "type": "SORD", "key": "id" }, "target": { "prop": "id" } },
 *             { "source": { "type": "GRP", "key": "COURSE_NAME" }, "target": { "prop": "name" } },
 *             { "source": { "type": "MAP", "key": "COURSE_STAR_SCORE" }, "target": { "prop": "stars" } }
 *           ]
 *         }
 *         ...
 *       }
 *
 * Attention: Only services which return an array of objects as the `sords` or `elements` property can be used with the ForEach function.
 *
 * #### Result
 *
 *     {
 *       "args": [
 *         {
 *           "data": { "name": "BS ELO Contract", "stars": "5" } }
 *           "objId": "5204",
 *           "entries": [ { "type": "GRP", "key": "COURSE_NAME", "value": "POPULAR: BS ELO Contract" } ]
 *         },
 *         {
 *           "data": { "name": "BS ELO Learning", "stars": "5" } }
 *           "objId": "5442",
 *           "entries": [ { "type": "GRP", "key": "COURSE_NAME", "value": "POPULAR: BS ELO Learning" } ]
 *         }
 *       ],
 *       "excluded": 7  // number of elements which did not match the filter criteria
 *     }
 *
 * If `dryRun` is set to false, the SET-function will be called with each of the two objects in the `args` array.
 *
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.ForEach", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
    "sol.common.mixins.Inject",
    "sol.common.mixins.ObjectFilter",
    "sol.common.mixins.ObjectSort"
  ],

  requiredConfig: ["callback"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", optional: true },
    originalConfig: { jsonFromProp: "configStr", forTemplating: false, template: false },
    config: { jsonFromProp: "configStr", forTemplating: false, template: true },
    flowId: { prop: "flowId", forTemplating: true }
  },

  /**
  * @cfg {Object} columns min. one of wfMap or map column names must be defined
  * @cfg {String[]} columns.wfMap (optional) column names of fields which are a WFMAPTABLE column (see docs)
  * @cfg {String[]} columns.map (optional) column names of fields which are a MAPTABLE column (see docs)
  */

  /**
  * @cfg {Object} options
  * @cfg {Boolean} options.elementArg property name, at which the maptable row object will be stored in the parameter object
  * @cfg {Boolean} [options.elementAsTemplateSord = false] (optional) formats the maptable row object as a templatesord before adding it to the parameter object
  * @cfg {Boolean} [options.dryRun = false] (optional) callback will not be executed, only prepared parameters will be returned. (good for debugging)
  * @cfg {Object} options.moveValues.Object
  * @cfg {Boolean}[options.deleteAfterUse = false] (optional) if set it to true, all applied rows to the callback function will be deleted. If dryRun = true, deleteInstructions will only be returned.
  * @cfg {Object[]} options.filter filter rules which will be applied to each row
  * @cfg {String} options.protectedFields.Object.* property names are the source paths, property values are the target paths for moving values in the parame
  * @cfg {Object} elementService
  * @cfg {String} elementService.name name of RF service (e.g. "RF_sol_common_service_SordProvider")
  * @cfg {Object} elementService.args additional arguments for the service
  */

  /**
  * @cfg {Object} callback
  * @cfg {String} callback.name name of registered function (e.g. "RF_sol_function_Set")
  * @cfg {Object} callback.args additional arguments for the callback
  */

  /**
   * External dependencies
   */

  executeCallback: function (callback, args) {
    return sol.common.IxUtils.execute(callback, args);
  },

  isObj: function (o) {
    return sol.common.ObjectUtils.type(o, "object");
  },

  validStr: function (s) {
    return sol.common.ObjectUtils.type(s, "string") && String(s) && s.trim();
  },

  moveVal: function (srcObj, tgtObj, source, target) {
    var ou = sol.common.ObjectUtils;
    ou.setProp(tgtObj, target, ou.getProp(srcObj, source));
    ou.setProp(srcObj, source, undefined, true);
  },

  /**
   * Helpers
   */
  buildTable: function (columns, sord) {
    var me = this, mapTypes = Object.keys(columns);
    function createEmptyTable() {
      return Object.keys(columns).reduce(function (table, mapType) {
        return columns[mapType].forEach(function (column) {
          table[column] = [];
        }) || table;
      }, {});
    }

    function addMapDataToTable(table, mapType) {
      var sordMapData = sord[mapType + "Keys"] || {}, cols = columns[mapType];
      function addKeyToTable(key) {
        var column, rowNo;
        function keyIsColumn() {
          return cols.some(function (col) {
            return column = (
              key.indexOf(col) == 0
              && ((rowNo = +(key.slice(col.length))) === rowNo)
            ) && col;
          });
        }

        keyIsColumn() // -1 below, because MAPTABLES index has a +1 index offset
          && (table[column][rowNo - 1] = (sordMapData[key]));
      }

      return Object.keys(sordMapData).forEach(addKeyToTable) || table;
    }

    function addColumnDefinitions(info, mapType) {
      me.logger.info("table build successfully. adding table info");
      return columns[mapType].forEach(function (col) {
        info[col] = mapType + "Keys";
      }) || info;
    }

    me.logger.info("building table in memory");
    return {
      data: mapTypes.reduce(addMapDataToTable, createEmptyTable()),
      info: mapTypes.reduce(addColumnDefinitions, {})
    };
  },

  convertToElements: function (table, opt) {
    var me = this, elementArg = opt.elementArg, asTemplateSord = opt.elementAsTemplateSord,
        data = table.data, info = table.info,
        columns = Object.keys(data), elements;

    function createBlankElementsArray() {
      function arrayOfInt(int) {
        return Array.apply(null, Array(int));
      }
      return arrayOfInt(sizeOfLargestColumn());
    }

    function sizeOfLargestColumn() {
      return columns.reduce(function (max, col) {
        return (data[col].length >= max) ? data[col].length : max;
      }, 0);
    }

    function rowToObject(_, rowNo) {
      var element = {}, notEmpty = false, tmp = columns.reduce(function (obj, col) {
        var val = data[col][rowNo];
        (val !== "") && (notEmpty = true) && (obj[col] = val);
        return obj;
      }, {});

      element[elementArg] = tmp;
      element.$rowIndex = rowNo; // we need the index later for the deleteInstructions
      return notEmpty && element;
    }

    function rowToTemplateSord(_, rowNo) {
      var element = {}, notEmpty = false, tmp = columns.reduce(function (ts, col) {
        var val = data[col][rowNo];
        (val !== "") && (notEmpty = true) && (ts[info[col]][col] = val);
        return ts;
      }, { mapKeys: {}, wfMapKeys: {} });

      element[elementArg] = tmp;
      element.$rowIndex = rowNo; // we need the index later for the deleteInstructions
      return notEmpty && element;
    }

    function truthy(o) {
      return o[elementArg];
    }

    me.logger.info("Converting table to elements. Columns: " + columns);

    elements = createBlankElementsArray()
      .map(asTemplateSord ? rowToTemplateSord : rowToObject)
      .filter(truthy);

    me.logger.info("Extracted " + elements.length + " elements from table");

    return elements;
  },

  forEachElement: function (elements, opts, cbOpts) {
    var me = this, preparedArgs, args = cbOpts.args;
    function prepareCallbackArg(element) {
      var freshArgs = args;
      function deepMerge(a, b) {
        return Object.keys(b).forEach(function (p) {
          a[p] = (me.isObj(a[p]) && me.isObj(b[p]))
            ? deepMerge(a[p], b[p])
            : b[p];
        }) || a;
      }
      if (opts.renderArgsWithElement) {
        me.$templatingData.element = element;
        try {
          freshArgs = JSON.parse(sol.common.TemplateUtils.render(freshArgs, me.$templatingData));
        } catch (error) {
          freshArgs = sol.common.TemplateUtils.render(JSON.parse(freshArgs), me.$templatingData);
        }
      }
      return deepMerge(element, freshArgs);
    }

    function executeCb(params) {
      var rfName = cbOpts.name;
      return me.executeCallback(rfName, params);
    }

    function addMapIndex(element, index) {
      if (element.data && element.data.$mapIndex) {
        me.logger.warn("Don't use $mapIndex as target prop - The prop is reserved to pass MapIndex to callback and will override your definition");
      }

      // map index always begin at 1
      element.data && (element.data.$mapIndex = index + 1);
      return element;
    }

    me.logger.info("Preparing arguments for callbacks");

    // MapIndex must be added first so we can access $mapIndex in handlebars
    preparedArgs = elements
      .map(addMapIndex)
      .map(prepareCallbackArg)
      .filter(me.matchObject.bind(null, opts.filter));

    me.logger.info("Callbacks will be executed for " + preparedArgs.length + " elements");
    return opts.dryRun
      ? (me.logger.info("Dry run: No callback executed. Returning args"), { args: preparedArgs })
      : { args: preparedArgs, results: preparedArgs.map(executeCb) };
  },

  sanitizeConfig: function (cfg, sordsProvided) {
    var me = this, result = {};
    function filterArrayStrings(arr) {
      return arr.map(me.validStr).filter(me.validStr);
    }

    function columns(opt) {
      if (!(Array.isArray(opt.map) || Array.isArray(opt.wfMap))) {
        throw "`columns` must contain an array called `map` or `wfMap` or both arrays";
      }
      opt = Object.keys(opt).reduce(function (acc, key) {
        acc[key] = filterArrayStrings(opt[key]);
        return acc;
      }, {});
      if (!((opt.map || []).length || (opt.wfMap || []).length)) {
        throw "no valid column names found in `columns` arrays `map` or `wfMap`";
      }
      me.logger.info("columns config ok");
      return opt;
    }

    function callback(opt) {
      var name = opt.name, args = opt.args || {};
      if (!((name = me.validStr(name)) && name.indexOf("RF_") === 0)) {
        throw "`callback.name` must be a string starting with 'RF_' (a valid registered function)`: " + name;
      }
      if (args && !me.isObj(args)) {
        throw "`callback.args` must be an object if it is defined. current type: " + typeof args;
      }
      me.logger.info("callback config ok");
      return { name: name, args: args };
    }

    function elementService(opt) {
      var name = opt.name, args = opt.args || {};
      if (!((name = me.validStr(name)) && name.indexOf("RF_") === 0)) {
        throw "`elementService.name` must be a string starting with 'RF_' (a valid registered service)`: " + name;
      }
      if (args && !me.isObj(args)) {
        throw "`elementService.args` must be an object if it is defined. current type: " + typeof args;
      }
      me.logger.info("elementService config ok");
      return { name: name, args: args };
    }

    function options(opt) {
      var elArg = opt.elementArg, mvVals = opt.moveValues, filters, mvKeys = [], sorts;

      if (!(elArg = me.validStr(elArg))) {
        throw "`options.elementArg` must be a string containing min. 1 character: " + elArg;
      }

      if (mvVals && !(me.isObj(mvVals) && (mvKeys = filterArrayStrings(Object.keys(mvVals))).length)) {
        throw "`options.moveValues` must be an object containing min. 1 property with a string value if it is defined. current type: " + typeof mvVals;
      }

      mvKeys.length && (mvVals = (mvKeys || []).reduce(function (acc, key) {
        var val = me.validStr(mvVals[key]);
        if (!val) {
          throw "`options.moveValues` property values must be non-empty strings! current type: " + typeof mvVals[key] + " value: " + val;
        }
        acc[key] = val;
        return acc;
      }, {}));

      // from mixin sol.common.ObjectUtils.ObjectFilter
      filters = me.generateFilter(me.options.filter || []);

      // from mixin sol.common.ObjectSortUtils.ObjectSort
      sorts = me.generateSort(me.options.sort || []);

      me.logger.info("options ok");

      return {
        elementArg: elArg,
        elementAsTemplateSord: opt.elementAsTemplateSord,
        deleteAfterUse: opt.deleteAfterUse,
        renderArgsWithElement: opt.renderArgsWithElement,
        moveValues: mvVals,
        filter: filters,
        sort: sorts,
        dryRun: opt.dryRun
      };
    }
    me.logger.info("sanitizing config");

    me.isObj(cfg.elementService) && (result.elementService = elementService(cfg.elementService));

    if ((sordsProvided || (sordsProvided = !!result.elementService)) && cfg.options.deleteAfterUse) {
      throw "`An `elementService` or `sords` were defined. `deleteAfterUse` option can only be used on MAPTABLES`.";
    }
    result.sordsProvided = sordsProvided;

    !sordsProvided && (result.columns = columns(cfg.columns));
    result.options = options(cfg.options);
    result.callback = callback(cfg.callback);

    if (result.options.renderArgsWithElement) {
      result.callback.args = sol.common.JsonUtils.stringifyQuick(me.originalConfig.callback.args);
    }


    return result;
  },

  executeDeleteInstructions: function (deleteInstructions) {
    var me = this;
    if (deleteInstructions.length) {
      me.logger.info("used table rows will be unset");
      me.executeCallback("RF_sol_function_Set", {
        objId: me.objId,
        flowId: me.flowId,
        entries: deleteInstructions
      });
    } else {
      me.logger.info("nothing to delete. DeleteInstructions are empty");
    }
  },

  generateDeleteInstructions: function (elements, table) {
    var type, typeMapping = { mapKeys: "MAP", wfMapKeys: "WFMAP" },
        deleteInstructions = [], appliedRowIndices = [];

    elements.forEach(function (el) { // build lookup array: rows for which the callback was executed
      appliedRowIndices[el.$rowIndex] = true;
    });

    Object.keys(table.data).forEach(function (columnName) {
      type = typeMapping[table.info[columnName]]; // {table: {info: SOLUTION_FIELD: "mapKeys"}} => "MAP"

      table.data[columnName].forEach(function (_, curIndex) {
        appliedRowIndices[curIndex]
          && deleteInstructions.push({ type: type, key: columnName + (curIndex + 1), value: "" });
      });
    });

    return deleteInstructions;
  },

  mv: function (opts, element) {
    var me = this, elementArg = opts.elementArg,
        moveDef = opts.moveValues, mvKeys = Object.keys(moveDef);
    return mvKeys.forEach(function (source) {
      me.moveVal(element[elementArg], element, source, moveDef[source]);
    }) || element;
  },

  sordsToElements: function (sords, opt) {
    var me = this, elementArg = opt.elementArg, elements;

    function toElement(sord) {
      var element = {};
      element[elementArg] = sord;
      return element;
    }

    elements = sords.map(toElement);

    me.logger.info("Created " + elements.length + " elements from sords");

    return elements;
  },

  executeElementService: function (cfg) {
    var me = this, elements;
    elements = (me.executeCallback(cfg.name, cfg.args || {}) || {});
    elements = elements.sords || elements.elements;
    if (!Array.isArray(elements)) {
      throw "The RF defined as `elementService` must return an object containing a property `sords` or `elements` which contains an array (of objects)";
    }
    return elements;
  },

  process: function () {
    var me = this, config, table, elements, data, deleteInstructions,
        sords = me.sords || me.elements, result = {};

    config = me.sanitizeConfig(me.config, Array.isArray(sords));

    if (config.sordsProvided) {
      config.elementService
        && (sords = me.executeElementService(config.elementService));
      elements = me.sordsToElements(sords, config.options);
    } else {
      table = me.buildTable(config.columns, me.sord);
      elements = me.convertToElements(table, config.options);
    }

    config.options.moveValues
      && (elements = elements.map(me.mv.bind(me, config.options)));

    if (config.options.sort && config.options.sort.length > 0) {
      me.logger.debug(["element will be sorted by {0}", JSON.stringify(config.options.sort)]);
      elements = me.sortArray(elements, config.options.sort);
    }

    data = me.forEachElement(elements, config.options, config.callback);

    if (config.options.deleteAfterUse) {
      deleteInstructions = me.generateDeleteInstructions(data.args, table);
      if (config.options.dryRun) {
        result.deleteInstructions = deleteInstructions;
      } else {
        me.executeDeleteInstructions(deleteInstructions);
      }
    }

    if (config.options.dryRun) {
      result.args = data.args;
      result.excluded = elements.length - data.args.length;
    }
    result.data = data.results;

    return result;
  }
});

/**
 * @member sol.common.ix.functions.ForEach
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.configStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.common.ix.functions.ForEach", params).process();
}

/**
 * @member sol.common.ix.functions.ForEach
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.configStr = sol.common.JsonUtils.stringifyQuick(params);

  sol.create("sol.common.ix.functions.ForEach", params).process();
}


/**
 * @member sol.common.ix.functions.ForEach
 * @method RF_sol_common_function_ForEach
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 * @return {Object}
 */
function RF_sol_common_function_ForEach(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ForEach" }),
      rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      result;

  rfParams.configStr = sol.common.JsonUtils.stringifyQuick(rfParams);

  result = sol.common.JsonUtils.stringifyQuick(
    sol.create("sol.common.ix.functions.ForEach", rfParams).process()
  );

  logger.exit("RF_sol_common_function_ForEach");
  return result;
}
