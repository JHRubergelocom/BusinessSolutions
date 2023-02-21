/**
 * Analyze a sord for spezified values.
 *
 * Each of the spezified values has to be meet.
 *
 * Each value has to define a `type` and a `key` (see {@link sol.common.SordUtils#getValue})
 *
 * # Value definitions
 *
 * Check if a field exists
 *
 *     { type: "GRP", key: "STATUS", exists: true }
 *
 * Check if a field has any value
 *
 *     { type: "GRP", key: "STATUS", notEmpty: true }
 *
 * Check if a field is empty
 *
 *     { type: "GRP", key: "STATUS", isEmpty: true }
 *
 * Compare field content to a reference value (with default comparator '==')
 *
 *     { type: "GRP", key: "STATUS", referenceValue: "UPDATE" }
 *
 * Compare field content to be greater than a reference value (in this case: is the saved ISO date in the map before the sord edit date)
 *
 *     { type: "MAP", key: "CHECK_ISO", referenceValue: { type: "SORD", key: "TStamp" }, comparator: "<" }
 *
 * Compare field content with several localized keyword list keys
 *
 *     { type: "GRP", key: "CONTRACT_STATUS", localizedKwl: true, referenceValues: ["D", "S"] }
 *
 * The value analyzer has a spezial type `PARENT_MAP`. This will try to check the values from a parent elements map.
 * Therefore the collector has to return a prefilled context with a `parentMap` property (like e.g. the {@link sol.common_monitoring.as.collectors.ChildrenCollector ChildrenCollector} does).
 * If the collector does not return such a property, it will be handled as empty.
 * Check if the parent has a map value STATUS.4711 (key.objId) for the sord with `sord.id=4711`:
 *
 *     { type: "PARENT_MAP", key: "STATUS", notEmpty: true }
 *
 * # Comparisons
 * If compared with a reference value, several comparators can be defined.
 *
 * Supported comparators are:
 *
 * - "==" equal (default)
 * - ">"  greater
 * - ">=" greater or equal
 * - "<"  smaller
 * - "<=" smaller or equal
 *
 * # Context enhancement
 * In addition to just check the values, they can be saved in an context object which can then be used in further processing.
 * E.g. the {@link sol.common_monitoring.as.executors.SimpleExecutor SimpleExecutor} can use those values in the action definitions.
 *
 *     var analyzer = sol.create("sol.common_monitoring.as.analyzers.ValueAnalyzer", {
 *       action: { type: "WORKFLOW", templateId: "{{ctx.updateWorkflow}}" },
 *       values: [
 *         { type: "MAP", key: "UPDATE_WF", notEmpty: true, toContext: "updateWorkflow" }
 *       ]
 *     });
 *
 * In case of a successfull check, the corresponding value will be written to the context object, which can then be used by the following components.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.000
 *
 * @eloas
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 */
sol.define("sol.common_monitoring.as.analyzers.ValueAnalyzer", {

  requiredConfig: ["action", "values"],

  /**
   * @cfg {Object} action
   */

  /**
   * @cfg {Object[]} values
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * Analyzes an object for matches of set of values.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} ctx Context object
   * @return {Object[]}
   */
  analyze: function (sord, ctx) {
    var me = this,
        results = [],
        allRequirementsMeet = true,
        i, max, valueCfg, checkFct, checkResult;

    me.logger.enter("analyze", { objId: sord.id, name: String(sord.name), valuesCount: me.values.length });

    for (i = 0, max = me.values.length; i < max; i++) {
      valueCfg = me.values[i];
      checkFct = me.noop; // this will the rule -> in case it has an unsupported configuration
      if (valueCfg.exists === true) {
        checkFct = me.exists;
      } else if (valueCfg.notEmpty === true) {
        checkFct = me.notEmpty;
      } else if (valueCfg.isEmpty === true) {
        checkFct = me.isEmpty;
      } else if (valueCfg.referenceValue || me.checkReferenceValues) {
        checkFct = me.checkReferenceValues;
      }

      checkResult = checkFct.call(me, sord, valueCfg, ctx);

      if (checkResult.success && ctx && valueCfg.toContext) {
        ctx[valueCfg.toContext] = checkResult.value;
      }

      allRequirementsMeet = allRequirementsMeet && checkResult.success;

      if (!allRequirementsMeet) {
        break; // skip further processing
      }
    }

    if (allRequirementsMeet) {
      results.push({ action: me.action });
    }

    me.logger.exit("analyze", results);

    return results;
  },

  /**
   * @private
   * If there is an illegal check configuration, this 'no operation' will be used to void check.
   * @return {Object}
   */
  noop: function () {
    return { success: false };
  },

  /**
   * @private
   * Checks, if the spezified field exists.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} value
   * @param {Object} ctx
   * @return {Object}
   */
  exists: function (sord, value, ctx) {
    var me = this,
        result = { success: false },
        propertyValue;

    propertyValue = me.getValue(sord, value, ctx);

    result.success = ((typeof propertyValue !== "undefined") && (propertyValue !== null));
    result.value = propertyValue;

    return result;
  },

  /**
   * @private
   * Checks, if the spezified field has any value.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} value
   * @param {Object} ctx
   * @return {Object}
   */
  notEmpty: function (sord, value, ctx) {
    var me = this,
        result = { success: false },
        propertyValue;

    propertyValue = me.getValue(sord, value, ctx);

    result.success = !sol.common.StringUtils.isEmpty(propertyValue);
    result.value = propertyValue;

    return result;
  },

  /**
   * @private
   * Checks, if the spezified field is empty.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} value
   * @param {Object} ctx
   * @return {Object}
   */
  isEmpty: function (sord, value, ctx) {
    var me = this,
        propertyValue, result;

    result = { success: false };

    propertyValue = me.getValue(sord, value, ctx);

    result.success = sol.common.StringUtils.isEmpty(propertyValue);

    return result;
  },

  /**
   * @private
   * Checks, if a specific value is set on the sord.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} value
   * @param {Object} ctx
   * @return {Object}
   */
  checkReferenceValues: function (sord, value, ctx) {
    var me = this,
        result = { success: false },
        referenceValueDefs, i, referenceValueDef,
        propertyValue, referenceValue;

    propertyValue = me.getValue(sord, value, ctx);
    referenceValueDefs = value.referenceValues || [value.referenceValue];

    for (i = 0; i < referenceValueDefs.length; i++) {
      referenceValueDef = referenceValueDefs[i];

      referenceValue = me.getValue(sord, referenceValueDef, ctx);

      if (propertyValue && referenceValue) {
        result.success = me.compare(propertyValue, referenceValue, value.comparator);
        result.value = propertyValue;
        if (result.success) {
          break;
        }
      }
    }

    return result;
  },

  /**
   * @private
   * Compares two values.
   * @param {String} value
   * @param {String} referenceValue
   * @param {String} comparator
   * @return {Boolean}
   */
  compare: function (value, referenceValue, comparator) {
    var compareResult;
    switch (comparator) {
      case ">":
        compareResult = (value > referenceValue);
        break;
      case ">=":
        compareResult = (value >= referenceValue);
        break;
      case "<":
        compareResult = (value < referenceValue);
        break;
      case "<=":
        compareResult = (value <= referenceValue);
        break;
      default:
        compareResult = (value === referenceValue);
        break;
    }
    return compareResult;
  },

  /**
   * @private
   * Retrieves a value dependent on a configuration.
   *
   * If the 'valueCfg' is already a constant value, it will be returned as it is.
   *
   * If the value from sord.TStamp should be loaded, this function converts it to a legal ISO date.
   *
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} valueCfg
   * @param {Object} ctx
   * @return {String}
   */
  getValue: function (sord, valueCfg, ctx) {
    var value;

    if (valueCfg && valueCfg.hasOwnProperty("type") && valueCfg.hasOwnProperty("key")) {
      if (valueCfg.type === "PARENT_MAP" && ctx && ctx.parentMap) {
        value = ctx.parentMap.getValue(valueCfg.key + "." + sord.id);
      } else {
        if (valueCfg.localizedKwl) {
          value = (sol.common.SordUtils.getLocalizedKwlKey(sord, valueCfg) || "") + "";
        } else {
          value = (sol.common.SordUtils.getValue(sord, valueCfg) || "") + "";
        }

        if (valueCfg.type === "SORD" && valueCfg.key === "TStamp") {
          value = value.replace(/\./g, "");
        }
      }
    } else {
      value = valueCfg;
    }

    return value;
  }

});
