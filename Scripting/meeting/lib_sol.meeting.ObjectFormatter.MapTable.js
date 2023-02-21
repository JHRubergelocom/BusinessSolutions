
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js


/**
 * Converts a MapTable of a TemplateSord structure into an array
 * All types except the mapKeys are ignored by the converter.
 *
 * MapTable fields that are not in the output definition
 * are also not considered in the result and are discarded.
 *
 * Example of a TemplateSord object with MapTable
 *
 *    {
 *       mapKeys: {
 *          "PERSON_ADDRESS_STREET1": "Musterstraße",
 *          "PERSON_ADDRESS_CITY1": "Musterstadt"
 *       }
 *    }
 *
 * Example Call
 *
 *     var converter = sol.create("sol.meeting.ObjectFormatter.MapTable", {
 *       output: [
 *         { source: { key: "PERSON_ADDRESS_STREET" }, target: { prop: "street" } }
 *         { source: { key: "PERSON_ADDRESS_CITY" },  target: { prop: "city" } }
 *       ],
 *       options: {
 *         ignorePropertyNames: true
 *       }
 *     });
 *
 * Output
 *
 *    [
 *      { street: "Musterstraße", city: "Musterstadt", $mapIndex: "1"}
 *    ]
 *
 * The special prop $mapIndex is added to the result object to determine the mapIndex in
 * further processing
 *
 * ### Options
 *
 *    {
 *       options: { ignorePropertyNames: true }
 *    }
 *
 * When this parameter is defined, the target.prop name is ignored by default. An Array with objects on the original fieldnames will be created.
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.ObjectUtils
 *
 */
sol.define("sol.meeting.ObjectFormatter.MapTable", {
  requiredConfig: ["output"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.outputCache = {};
    me.options = me.options || {};
    me.options.ignorePropertyNames = me.options.ignorePropertyNames || false;
    me.sanitizeOutputConfig(me.output);
  },

  sanitizeOutputConfig: function (output) {
    var me = this;

    // prepare an output temporary cache
    // With the cache we can find output definitions easier

    output.forEach(function (definition) {
       if (!definition.source) {
        throw Error("missing source prop in output definition, " + JSON.stringify(definition));
       }

       if (!sol.common.ObjectUtils.type(definition.source.key, "string")) {
         throw Error("key in output definition is not a string," + JSON.stringify(definition));
       }

       me.outputCache[definition.source.key] = definition;
    });
  },

  /**
   * Convert mapKeys of a templateSord object to an array
   * @param {Object} templateSord
   * @param {Object} config
   * @param {Array} config.fields
   */
  format: function (templateSord) {
    var me = this, result = {};

    if (!templateSord || !templateSord.mapKeys) {
      return [];
    }

    Object.keys(templateSord.mapKeys).forEach(function (mapKey) {
      var mapIndex = me.getFieldNameIndex(mapKey), outputDef, value, fieldName, targetFieldname;

      if (mapIndex > 0) {
        fieldName = me.getFieldName(mapKey);
        outputDef = me.outputCache[fieldName];

        // transform mapKey only when output definition exists
        if (outputDef) {
          value = sol.common.ObjectUtils.getProp(templateSord.mapKeys, mapKey);
          if (!result[mapIndex]) {
            // create new entry, when we read a new row
            result[mapIndex] = {};
          }
          targetFieldname = me.getTargetFieldName(mapKey, outputDef);
          sol.common.ObjectUtils.setProp(result[mapIndex], targetFieldname, value);
        }
      } else {
        me.logger.debug(["skip field `{0}` because it is not a maptable", mapKey]);
      }
    });

    return me.convertToArray(result);
  },

  /**
   * @returns mapIndex when field has any index otherwise -1
   */
  getFieldNameIndex: function (fieldName) {
    var me = this, pos;
    pos = me.getIndexPosition(fieldName);

    if (pos > 0) {
      return fieldName.substring(pos);
    }

    return "";
  },

  getFieldName: function (fieldName) {
    var me = this, pos;
    pos = me.getIndexPosition(fieldName);
    if (pos > 0) {
      return fieldName.substring(0, pos);
    }

    return "";
  },

  getIndexPosition: function (fieldName) {
    if (!sol.common.ObjectUtils.isString(fieldName)) {
      throw Error("`fieldName must be a string, type=`" + sol.common.ObjectUtils.type(fieldName));
    }
    return fieldName.search(/\d+$/);
  },

  getTargetFieldName: function (mapKey, outputDefinition) {
    var me = this;
    return me.options.ignorePropertyNames
      ? mapKey
      : outputDefinition.target.prop;
  },

  convertToArray: function (result) {
    return Object.keys(result).map(function (index) {
      result[index].$mapIndex = index;
      return result[index];
    });
  }

});
