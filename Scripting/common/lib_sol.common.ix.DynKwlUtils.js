
//@include lib_Class.js

/**
 * Helper function for dynamic keyword lists
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.ObjectUtils
 * @requires sol.common.SordUtils
 */
sol.define("sol.common.ix.DynKwlUtils", {
  singleton: true,

  /**
   * Fills the object keys of an ELO object by a dynamic keyword list
   * @param {de.elo.ix.client.Sord} sord ELO object
   * @param {String} focusedFieldName Field name of the queried field
   * @param {Object} params (optional)
   * @param {Boolean} [params.ignoreMissingFields=false] (optional) If `true` missing fields on the mask will be ignored (therefore no exception will be thrown)
   * @return {Boolean} True if the sord has been changed
   */
  fillSord: function (sord, focusedFieldName, params) {
    var sordChanged = false,
        keywordsDynamicInfo = new KeywordsDynamicInfo(),
        keywordsDynamicResult, keyIterator, valueIterator, key, value;
    keywordsDynamicInfo.sord = sord;
    keywordsDynamicInfo.maskLineFocus = sol.common.SordUtils.getDocMaskLine(sord.maskName, focusedFieldName);
    keywordsDynamicResult = ixConnect.ix().checkoutKeywordsDynamic(keywordsDynamicInfo);
    if (keywordsDynamicResult.table.size() != 1) {
      return;
    }
    keyIterator = keywordsDynamicResult.keyNames.iterator();
    valueIterator = keywordsDynamicResult.table.iterator().next().iterator();
    while (keyIterator.hasNext()) {
      key = keyIterator.next();
      value = valueIterator.next();
      if (key && (key.indexOf("$") !== 0)) {
        try {
          sol.common.SordUtils.setObjKeyValue(sord, key, value);
          sordChanged = true;
        } catch (ex) {
          if (!params || !params.ignoreMissingFields) {
            throw ex;
          }
        }

      }
    }
    return sordChanged;
  },

  /**
   * Fills the map fields and object keys of an ELO object by a dynamic keyword list
   * @param {Object} map Input data
   * @param {de.elo.ix.client.Sord} sord ELO object
   * @param {String} focusedFieldName Field name of the queried field
   * @param {String} scriptName Name of the dynamic keyword list script
   * @param {Object} params Parameters
   * @param {Boolean} [params.append=false] Append lines
   */
  fillMap: function (map, sord, focusedFieldName, scriptName, params) {
    var me = this,
        mapKeys = [],
        keywordsDynamicInfo, keywordsDynamicResult, keyValues, linesIterator, keyIterator, valueIterator, key, i, value,
        sordMap, sordMapTable, filterValue,
        mapKeysWithoutIndex = [];

    keywordsDynamicInfo = new KeywordsDynamicInfo();

    params = params || {};
    map = map || {};

    if (sord) {
      sol.common.ObjectUtils.forEach(sord.objKeys, function (objKey) {
        map[objKey.name] = (objKey.data && (objKey.data.length > 0)) ? objKey.data[0] : "";
      }, this);
    }

    keywordsDynamicInfo.mapData = map;
    keywordsDynamicInfo.mapLineFocus = focusedFieldName;
    keywordsDynamicInfo.mapScriptName = scriptName;
    keywordsDynamicResult = ixConnect.ix().checkoutKeywordsDynamic(keywordsDynamicInfo);
    keyValues = [];

    filterValue = map[focusedFieldName];

    if (!filterValue && (keywordsDynamicResult.table.size() > 1)) {
      me.logger.info("Filter value is empty and there are multiple result lines. Fields won't be filled. scriptName=" + scriptName + ", focusedFieldName=" + focusedFieldName);
      return;
    }

    keyIterator = keywordsDynamicResult.keyNames.iterator();
    while (keyIterator.hasNext()) {
      key = keyIterator.next() + "";
      if ((key.indexOf("IX_MAP_") == 0) && (key.indexOf("{i}") < 0)) {
        mapKeysWithoutIndex.push(key);
      }
    }

    if ((mapKeysWithoutIndex.length > 0) && (keywordsDynamicResult.table.size() > 1)) {
      me.logger.info("Result with multiple lines, but destination map keys without index. Fields won't be filled. scriptName=" + scriptName + ", mapKeysWithoutIndex=" + mapKeysWithoutIndex);
      return;
    }

    linesIterator = keywordsDynamicResult.table.iterator();

    if (params.append) {
      keyIterator = keywordsDynamicResult.keyNames.iterator();
      while (keyIterator.hasNext()) {
        key = keyIterator.next() + "";
        if ((key.indexOf("IX_MAP_") == 0) || (key.indexOf("IX_GRP_") == 0)) {
          key = key.substring(7);
        }
        key = key.replace("{i}", "");
        mapKeys.push(key);
      }
      sordMap = sol.create("sol.common.SordMap", { objId: sord.id });
      sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: mapKeys });
      i = sordMapTable.getLength();
    } else {
      i = 0;
    }

    while (linesIterator.hasNext()) {
      i++;
      keyIterator = keywordsDynamicResult.keyNames.iterator();
      valueIterator = linesIterator.next().iterator();
      while (keyIterator.hasNext()) {
        key = keyIterator.next();
        value = valueIterator.next();
        if (key.startsWith("IX_MAP_")) {
          key = key.substring(7);
          key = key.replace("{i}", String(i));
          keyValues.push(new KeyValue(key, value));
        } else {
          if (key.startsWith("IX_GRP_")) {
            key = key.substring(7);
          }
          sol.common.SordUtils.setObjKeyValue(sord, key, value);
        }
      }
    }
    if (keyValues.length > 0) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, sord.id, sord.id, keyValues, LockC.NO);
    }
  }
});


/**
 * Helper functions for the dynamic keywordlist iterators.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 */
sol.define("sol.common.ix.DynKwlMixin", {
  mixin: true,

  initialize: function (config) {
    var me = this;
    me.tableKeyNames_default = config.tableKeyNames_default || me.tableKeyNames_default;
    me.tableKeyNames_configOverride = config.tableKeyNames_configOverride || me.tableKeyNames_configOverride;

    me.formatting = config.formatting || me.formatting;
  },

  /**
   * @protected
   * Determines the table keys for the output of the dynamic kwl.
   * @param {String} focusFieldName
   * @return {String[]}
   */
  getTableKeyNames: function (focusFieldName) {
    var me = this,
        tableKeyNames;

    if (typeof me.tableKeyNames === "function") {
      me.log.debug(["Determine table key names by function. FucusFieldName='{0}', DefaultConfig='{1}' OverrideConfig='{2}'", focusFieldName, JSON.stringify(me.tableKeyNames_default), JSON.stringify(me.tableKeyNames_configOverride)]);
      tableKeyNames = me.tableKeyNames.call(me, focusFieldName, (me.tableKeyNames_default || "No default configuration"), (me.tableKeyNames_configOverride || {}));
    } else {
      tableKeyNames = me.tableKeyNames;
    }

    if (!tableKeyNames) {
      me.log.warn(["Can not determine 'tableKeyNames' in class '{0}'", me.$className]);
    }

    me.log.debug(["tableKeyNames='{0}'", JSON.stringify(tableKeyNames)]);
    return tableKeyNames;
  },

  /**
   * @protected
   * Uses `this.formatting` to apply formatting to a table row.
   *
   * # Format decimal
   * See also {@link sol.common.Locale#formatDecimal}.
   *
   *     formatting = [
   *       { columnNames: ["MY_OUTPUT_COLUMN1"], minimumFractionDigits: 0, maximumFractionDigits: 2 },
   *       { columnNames: ["MY_OUTPUT_COLUMN2", "ANOTHER_OUTPUT_COLUMN"], maximumFractionDigits: 4 }
   *     ];
   *
   * @param {String[]} row
   */
  formatRow: function (row) {
    var me = this,
        i, def, iteratorArray, containsIdx, j, columnIndex, value, formatedValue;

    if (me.formatting && (typeof me.tableKeyNames === "function")) {
      throw "Formating can not be used when 'tableKeyNames' is a function";
    }

    if (me.formatting && (me.formatting.length > 0)) {
      for (i = 0; i < me.formatting.length; i++) {
        def = me.formatting[i];

        iteratorArray = def.columnNames || def.columnIndexes || [];
        containsIdx = !!def.columnIndexes;

        for (j = 0; j < iteratorArray.length; j++) {
          columnIndex = (containsIdx) ? iteratorArray[j] : me.tableKeyNames.indexOf(iteratorArray[j]);
          if (columnIndex > -1) {
            value = String(row[columnIndex]);

            switch (def.type) {
              case "NUMBER":
                formatedValue = me.formatNumber(value, def);
                break;
              default:
                throw "Unsupported format type";
            }
            row[columnIndex] = formatedValue;
          }
        }
      }
    }
  },

  /**
   * @private
   * Formats decimal numbers using {@link sol.common.Locale#formatDecimal}.
   * @param {String} value
   * @param {Object} params
   * @return {String}
   */
  formatNumber: function (value, params) {
    var me = this;

    if (!value || value == "null") {
      value == "";
    } else {
      if (!me.$locale) {
        me.$locale = sol.create("sol.common.Locale", { ec: me.ec });
        me.$locale.read();
      }
      value = me.$locale.formatDecimal(value, params);
    }
    return value;
  }

});
