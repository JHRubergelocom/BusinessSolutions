
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js


/**
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.ix.LocalizedKwlIterator
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.configKwl.Base", {

  /**
   * @cfg {String} propertyName
   * PropertyName of the configuration, which will be used and converted into a keyword list.
   */
  propertyName: "entities.webapp.services.config.labels",

  tableTitle: "Labels",

  tableHeaders: ["Schl&uuml;ssel", "Name"],

  tableKeyNames: [null, null],

  rowDataFields: ["key", "name"],

  errorMessage: "",

  searchParams: [
    {
      name: "name",
      mode: "CONTAINS"
    }
  ],

  resultSet: [],

  mixins: [
    "sol.learning.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    rawDataset: { config: "learning", prop: null }
  },

  initialize: function (config) {
    var me = this;

    if (me.propertyName) {
      me.inject.rawDataset.prop = me.propertyName;
      sol.create("sol.common.Injection").inject(me);
      me.$super("sol.Base", "initialize", [config]);
    } else {
      throw "propertyName is not defined in subclass";
    }
  },

  open: function (ec, sord, fieldName) {
    var me = this;

    me._open({
      name: fieldName,
      value: sol.common.SordUtils.getObjKeyValue(sord, fieldName)
    });
  },

  openMap: function (ec, map, focusName) {
    var me = this;

    me._open({
      name: focusName,
      value: map[focusName]
    });
  },

  _open: function (field) {
    var me = this;

    me.index = 0;
    me.fieldName = field.name;
    me.fieldIndex = me.getIndexFromName(field.name);
    me.resultSet = me.getResults(field.value);
  },


  getIndexFromName: function (name) {
    name = String(name);
    if (!name) {
      return "";
    }
    var pos = name.search(/\d+$/);
    if (pos > 0) {
      return name.substring(pos);
    }
    return "";
  },

  getResults: function (searchValue) {
    var me = this,
        getDataset = function () {
          return Array.isArray(me.rawDataset)
            ? me.rawDataset
            : Object.keys(me.rawDataset || {})
              .map(function (key) {
                me.rawDataset[key].key = me.rawDataset[key].key || key;
                return me.rawDataset[key];
              });
        };

    return getDataset()
      .filter(function (dataEntry) {
        return (me.searchParams || [])
          .reduce(
            me.useOperator(searchValue, dataEntry, {}).bind(me),
            true
          );
      });
  },

  useOperator: function (value, config, parentParam) {
    var me = this;

    function matches(_value, _config, param) {
      return param.operator
        ? (param.searchParams || [])
          .reduce(
            me.useOperator(_value, _config, param).bind(me),
            param.operator != "or"
          )
        : me.compare(param.mode)(
          (_config[param.name] || "").toLowerCase(),
          (param.value || _value || "").toLowerCase()
        );
    }

    return function (intermediate, param) {
      return parentParam.operator == "or"
        ? intermediate || matches.apply(me, [value, config, param])
        : intermediate && matches.apply(me, [value, config, param]);
    };
  },

  compare: function (method) {
    var compare = {
      STARTS_WITH: function (searchIn, search) {
        return (searchIn || "")
          .indexOf(search || "", 0) == 0;
      },
      ENDS_WITH: function (searchIn, search) {
        return (searchIn || "")
          .indexOf((search || ""), (searchIn || "").length - (search || "").length) != -1;
      },
      CONTAINS: function (searchIn, search) {
        return (searchIn || "").indexOf(search || "") != -1;
      },
      default: function (searchIn, search) {
        return typeof search != undefined && searchIn == search;
      }
    };

    return compare[method] || compare.default;
  },

  close: function () {

  },

  hasMoreRows: function () {
    var me = this;

    return me.index < me.resultSet.length;
  },

  getTitle: function () {
    var me = this;
    return me.tableTitle || "";
  },

  getHeader: function () {
    var me = this;
    return me.tableHeaders;
  },

  getNextRow: function () {
    var me = this;

    if (me.resultSet[me.index]) {
      return me.getRowData(me.resultSet[me.index++]);
    }
  },

  getRowData: function (data) {
    var me = this;

    return (me.rowDataFields || [])
      .map(function (rowDataField) {
        return sol.common.ObjectUtils.getProp(data, rowDataField);
      });
  },

  getKeyNames: function () {
    var me = this,
        keyNames,

        createKeyNamesFromRowDataFields = function () {
          return (me.rowDataFields || [])
            .map(function () {
              return null;
            });
        },
        setIndex = function (_keyNames) {
          return _keyNames
            .map(function (keyName) {
              return !!keyName
                ? ((me.fieldIndex != "")
                  ? keyName.replace("{i}", me.fieldIndex)
                  : keyName)
                : null;
            });
        };

    keyNames = setIndex(
      (me.tableKeyNames || []).length == me.rowDataFields.length
        ? me.tableKeyNames || []
        : createKeyNamesFromRowDataFields()
    );

    keyNames[keyNames.length - 1] = keyNames[keyNames.length - 1] || me.fieldName;
    return keyNames;
  },

  getMessage: function () {
    var me = this;
    return me.errorMessage;
  },

  getIterator: function () {
    var me = this;

    return me;
  }
});
