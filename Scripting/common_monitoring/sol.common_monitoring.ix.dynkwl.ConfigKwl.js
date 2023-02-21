
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.Injection.js

/**
 * Dynamic keyword list that returns the config content.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Injection
 */
sol.define("sol.common_monitoring.ix.dynkwl.ConfigKwl", {
  logger: sol.create("sol.Logger", { scope: "sol.common_monitoring.dynkwl.ConfigKwl" }),

  type: null,
  translate: false,
  tableTitle: undefined,
  tableHeaders: [
    "Name",
    "Shift",
    "Workflow",
    "Namensraum",
    "Schlüssel"
  ],
  tableKeyNames: [null],
  rowDataFields: [
    "name",
    "shift.value",
    "action.action",
    "namespace",
    "key"
  ],
  errorMessage: "",

  index: 0,
  resultSet: [],

  inject: {},
  $configRelation: {},

  initialize: function (config) {
    var me = this;
    config = config || {};
    me.initializeInjections(config);
    me.prepareConfig();
  },

  initializeInjections: function (config) {
    var me = this,
        baseKwlPath = config.kwlName + ".";

    if (config.configPath && config.kwlConfigPath && config.kwlName) {
      // setup configRelation
      me.$configRelation.kwlConfig = config.kwlConfigPath;
      me.$configRelation.config = config.configPath;
      // setup injection
      me.inject = {
        namespace: { config: "kwlConfig", prop: 'namespace' },
        type: { config: "kwlConfig", prop: baseKwlPath + 'type' },
        translate: { config: "kwlConfig", prop: baseKwlPath + 'translate' },
        tableTitle: { config: "kwlConfig", prop: baseKwlPath + 'title' },
        tableHeaders: { config: "kwlConfig", prop: baseKwlPath + 'header' },
        tableKeyNames: { config: "kwlConfig", prop: baseKwlPath + 'output' },
        rowDataFields: { config: "kwlConfig", prop: baseKwlPath + 'dataFields' },
        searchParams: { config: "kwlConfig", prop: baseKwlPath + 'searchParams' },
        errorMessage: { config: "kwlConfig", prop: baseKwlPath + 'errorMessage' },
        configs: { config: "config", prop: "configs" }
      };
      // inject
      sol.create("sol.common.Injection").inject(me);
    }
  },

  prepareConfig: function () {
    var me = this;

    Object.keys(me.configs || {}).forEach(function (key) {
      me.configs[key].key = me.configs[key].key || key;
      me.configs[key].namespace = me.configs[key].namespace || me.namespace;
    });
  },

  getResults: function (searchValue) {
    var me = this,
        configs = me.configs,
        searchParams = me.searchParams;

    return me.eachObjectKey(configs)
      .filter(function (config) {
        return (searchParams || [])
          .reduce(
            me.useOperator(searchValue, config, {}).bind(me),
            true
          );
      });
  },

  eachObjectKey: function (obj) {
    return Object.keys(obj || {})
      .map(function (key) {
        return obj[key];
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

  open: function (ec, sord, fieldName) {
    var me = this;
    me.logger.info("open", [sord.id, fieldName]);

    me.index = 0;
    me.fieldName = fieldName;

    me.resultSet = me.getResults(sol.common.SordUtils.getObjKeyValue(sord, fieldName));
  },

  openMap: function (ec, map, focusName) {
    var me = this;
    me.logger.info("open", [map, focusName]);

    me.index = 0;
    me.fieldName = focusName;

    me.updateTableKeyNames(focusName);

    me.resultSet = me.getResults(map[focusName]);
  },

  updateTableKeyNames: function (focusName) {
    var me = this,
        fieldIndex;

    fieldIndex = me.getIndexFromName(focusName);

    me.tableKeyNames = !fieldIndex
      ? (me.tableKeyNames || [])
      : (me.tableKeyNames || [])
        .map(function (keyName) {
          return !!keyName
            ? keyName.replace("{i}", fieldIndex)
            : null;
        });
  },

  getIndexFromName: function (focusName) {
    var name = String(focusName);
    return !name
      ? null
      : name.search(/\d+$/) > 0
        ? name.substring(name.search(/\d+$/))
        : "";
  },

  close: function () { },

  hasMoreRows: function () {
    var me = this;

    return me.index < me.resultSet.length;
  },

  getTitle: function () {
    var me = this;
    return me.tableTitle;
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
        keyNames;

    keyNames = (me.tableKeyNames || []).length == me.rowDataFields.length
      ? me.tableKeyNames || []
      : (me.rowDataFields || [])
        .map(function () {
          return null;
        });

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

/**
 * Implements a DynamicKeywordDataProvider
 * @static
 * @member sol.common_monitoring.dynkwl.ConfigKwlIterator
 * @return {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.common_monitoring.dynkwl.ConfigKwl" }),
      iterator;

  try {
    log.info("DynamicKeywordList (");

    iterator = sol.create("sol.common_monitoring.ix.dynkwl.ConfigKwl", {
      // eslint-disable-next-line no-undef
      configPath: configPath,
      // eslint-disable-next-line no-undef
      kwlConfigPath: kwlConfigPath,
      // eslint-disable-next-line no-undef
      kwlName: kwlName
    });

    return new DynamicKeywordDataProvider(iterator);
  } catch (e) {
    if (e instanceof ReferenceError) {
      // Handle error as necessary
      log.info('please specify configPath, kwlConfigPath and kwlName');
    }
  } finally {
    log.info(")getDataIterator");
  }
}
