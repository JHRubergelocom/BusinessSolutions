
importPackage(Packages.java.text);

//@include lib_Class.js

/**
 * Contains the value converters
 *
 * A converter needs to have a convert function to register:
 *
 *     {
 *       convert: function (value, config, fields) { ... }
 *     }
 *
 * The following converters are registered by default:
 *
 * - {@link sol.connector_xml.converter.DefaultConverter DefaultConverter}
 * - {@link sol.connector_xml.converter.DateConverter DateConverter}
 * - {@link sol.connector_xml.converter.DynamicKwlLookup DynamicKwlLookup}
 *
 * @author Pascal Zipfel, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.connector_xml.Converter", {
  singleton: true,

  /**
   * @private
   * Converter registry
   */
  registry: {},

  /**
   * Converts a value using one of the registered converters.
   *
   * The appropriate converter will be looked up by the config.type property.
   *
   * @param {String} value The vaule which should be converted
   * @param {Object} config Configuration Object for the converter, the reguired properties depend on the used converter
   * @param {Object} fields Key-Value object with fields the converter might depend on; this might be optional, depending on the used converter
   * @param {Object} mapObj Map object
   * @return {String}
   */
  convert: function (value, config, fields, mapObj) {
    if (!value) {
      throw "Illegal Argument : No 'value' to convert";
    }
    if (!config) {
      throw "Illegal Argument : No 'config' for converter";
    }
    if (!config.type) {
      throw "Illegal Argument : No 'config.type' defined";
    }
    if (!this.registry[config.type]) {
      throw "Illegal Argument : No converter for type '" + config.type + "' registered";
    }

    return this.registry[config.type].convert(value, config, fields, mapObj);
  },

  /**
   * Registers a converter in the registry.
   * @param {String} type The name for the converter lookup
   * @param {Object} converter A object having a convert function.
   */
  register: function (type, converter) {
    if (!converter) {
      throw "Converter is empty";
    }
    if (!this.isFunction(converter.convert)) {
      throw converter + " needs to implement the 'convert' function";
    }
    this.registry[type] = converter;
  },

  /**
   * Removes a converter from the registry.
   * @param {String} type The name for the converter lookup
   */
  remove: function (type) {
    this.registry[type] = undefined;
  },

  /**
   * @private
   * Checks, if an object is a function
   * @param {Object} object
   * @return {Boolean}
   */
  isFunction: function (object) {
    return object && (Object.prototype.toString.call(object) === "[object Function]");
  }
});


/**
 * Simply sets a default value, if the value is empty.
 *
 * @author Pascal Zipfel, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.StringUtils
 *
 */
sol.define("sol.connector_xml.Converter.DefaultConverter", {
  singleton: true,

  /**
   * This convert method needs config.defaultValue
   *
   * @param {String} value The vaule which should be converted
   * @param {Object} config Configuration Object for the conversion
   * @return {String}
   */
  convert: function (value, config) {
    if (!config.defaultValue) {
      throw "Illegal Argument : 'DefaultConverter' needs a 'defaultValue' in the config object";
    }

    return (!sol.common.StringUtils.isBlank(value)) ? value : config.defaultValue;
  }
});


/**
 * Converts a Date from one format to another.
 *
 * @author Pascal Zipfel, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.StringUtils
 *
 */
sol.define("sol.connector_xml.Converter.DateConverter", {
  singleton: true,

  /**
   * This convert method needs config.fromPattern and config.toPattern
   *
   * The patterns have to be in Javas SimpleDateFormat syntax
   *
   * @param {String} value The vaule which should be converted
   * @param {Object} config Configuration Object for the conversion
   * @return {String}
   */
  convert: function (value, config) {
    var fromPatterns, javaFromPatterns, date;

    if (!sol.common.StringUtils.isBlank(value)) {
      if (!config.fromPattern || !config.toPattern) {
        throw "Illegal Argument : 'DateConverter' needs a 'fromPattern' and a 'toPattern' in the config object";
      }

      fromPatterns = sol.common.ObjectUtils.isArray(config.fromPattern) ? config.fromPattern : [config.fromPattern];

      javaFromPatterns = sol.common.ObjectUtils.toJavaArray(fromPatterns);

      date = Packages.org.apache.commons.lang3.time.DateUtils.parseDate(value, javaFromPatterns);

      value = Packages.org.apache.commons.lang.time.DateFormatUtils.format(date, config.toPattern);

    }
    return value;
  }
});


/**
 * Uses the value to lookup another value in a dynamic keyword list.
 *
 * @author Pascal Zipfel, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.StringUtils
 *
 */
sol.define("sol.connector_xml.Converter.DynamicKwlLookup", {
  singleton: true,

  /**
   * Configuration Parameter:
   *
   * - kwl:             The name of the script containing the dynamic kwl
   * - focusfield:      The field which contains the "to be converted" value
   * - returnfield:     The field which contains the convterted/return value
   * - dependentFields: Array of fields which are needed by the kwl (if specified, the fields-map needs to provide the corresponting values)
   * - defaultValue:    Default value if no (or more than one) result was found / if not defined, the unconverted value will be returned
   *
   * @param {String} value The vaule which should be converted
   * @param {Object} config Configuration Object for the conversion
   * @param {Object} fields Key-Value object with fields the converter might depend on; this might be optional, depending on the used converter
   * @return {String}
   */
  convert: function (value, config, fields) {
    var map, kdi, result, i, length, keyName;

    if (!sol.common.StringUtils.isBlank(value)) {
      if (!config.kwl || !config.focusfield || !config.returnfield) {
        throw "Illegal Argument : 'DynamicKwlLookup' needs a 'kwl', a 'focusfield' and a 'returnfield' in the config object";
      }

      map = this.fillDependentFields(fields, config.dependentFields);
      kdi = new KeywordsDynamicInfo();

      if (!config.focusfield) {
        config.focusfield = config.returnfield;
      }

      if (!map[config.focusfield]) {
        map[config.focusfield] = value;
      }

      kdi.mapData = map;
      kdi.mapLineFocus = config.focusfield;
      kdi.mapScriptName = config.kwl;

      result = ixConnect.ix().checkoutKeywordsDynamic(kdi);

      if (result && result.table && (result.table.size() == 1)) {
        length = result.keyNames.size();
        for (i = 0; i < length; i++) {
          keyName = result.keyNames.get(i);
          keyName = (keyName.startsWith("IX_MAP_")) ? keyName.substring(7) : keyName;
          keyName = (keyName.endsWith("{i}")) ? keyName.substring(0, keyName.length() - 3) : keyName;
          if (keyName == config.returnfield) {
            return result.table.get(0).get(i);
          }
        }
      }
      return config.defaultValue ? config.defaultValue : value;
    }
    return value;
  },

  /**
   * @private
   * Matches the fields against a list of dependent fields
   * @param {Object} fields Contains all available key-value pairs
   * @param {Array} dependentFields (optional) List of the values needed for the keyword list
   * @return {Object}
   */
  fillDependentFields: function (fields, dependentFields) {
    var map = {},
        i, field;

    if (!dependentFields) {
      for (field in fields) {
        map[field] = new java.lang.String(fields[field]);
      }
    } else if (dependentFields.length > 0) {
      for (i = 0; i < dependentFields.length; i++) {
        field = dependentFields[i];
        if (fields[field]) {
          map[field] = fields[field];
        } else {
          throw "not all dependent fields defined; missing field: " + field;
        }
      }
    }

    return map;
  }
});

/**
 * Converts one value another value
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.StringUtils
 *
 */
sol.define("sol.connector_xml.Converter.MappingConverter", {
  singleton: true,

  /**
   * This convert method needs config.map
   *
   * @param {String} value The vaule which should be converted
   * @param {Object} config Configuration Object for the conversion
   * @return {String}
   */
  convert: function (value, config) {
    var me = this,
        resultValue, dynKwlConverter;

    config.map = config.map || {};
    resultValue = config.map[value + ""];

    if (!resultValue && config.defaultValue) {
      resultValue = config.defaultValue;
    }

    if (config.useDynKwl && resultValue) {
      dynKwlConverter = sol.create("sol.connector_xml.Converter.DynamicKwlLookup");
      resultValue = dynKwlConverter.convert(resultValue, config);
    }
    resultValue += "";

    return resultValue;
  }
});

/**
 * Sets a value if it's empty
 *
 * @param {String} value The vaule which should be converted
 * @param {Object} config Configuration Object for the conversion
 * @param {Object} fields Key-Value object with fields the converter might depend on; this might be optional, depending on the used converter
 * @return {String}
 */
sol.define("sol.connector_xml.Converter.SetIfEmpty", {
  singleton: true,

  convert: function (value, config, fields, mapObj) {
    var currentValue;

    currentValue = (fields[mapObj.key] || "") + "";

    if (currentValue) {
      return currentValue;
    } else {
      return value;
    }
  }
});

sol.connector_xml.Converter.register("DefaultConverter", sol.connector_xml.Converter.DefaultConverter);
sol.connector_xml.Converter.register("DateConverter", sol.connector_xml.Converter.DateConverter);
sol.connector_xml.Converter.register("DynamicKwlLookup", sol.connector_xml.Converter.DynamicKwlLookup);
sol.connector_xml.Converter.register("SetIfEmpty", sol.connector_xml.Converter.SetIfEmpty);
sol.connector_xml.Converter.register("MappingConverter", sol.connector_xml.Converter.MappingConverter);
