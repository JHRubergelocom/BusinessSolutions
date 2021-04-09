
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
 * @author PB, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Injection
 */
sol.define("sol.common_monitoring.ix.dynkwl.ConfigKwl", {

  type: "",
  translate: false,
  tableKeyNames: [null],
  tableHeaders: ["Name", "Shift", "Workflow", "Schlüssel"],
  rowDataFields: ["name", "shift", "workflow", "key"],
  tableTitle: undefined,
  errorMessage: "",

  index: 0,
  resultSet: [],

  inject: undefined,
  $configRelation: {
  },

  initialize: function (config) {
    var me = this;
    me.logger = sol.create("sol.Logger", { scope: "sol.common_monitoring.dynkwl.ConfigKwl" });
    config = config || {};
    me.initializeInjections(config);
    me.prepareConfig();

    me.logger.info("config", {
      namespace: me.namespace,
      type: me.type,
      translate: me.translate,
      tableTitle: me.tableTitle,
      tableHeaders: me.tableHeaders,
      tableKeyNames: me.tableKeyNames,
      rowDataFields: me.rowDataFields,
      searchParams: me.searchParams,
      errorMessage: me.errorMessage,
      configs: me.configs
    });
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
        translate: { config: "kwlConfig", prop: baseKwlPath + 'type' },
        tableTitle: { config: "kwlConfig", prop: baseKwlPath + 'tableTitle' },
        tableHeaders: { config: "kwlConfig", prop: baseKwlPath + 'tableHeaders' },
        tableKeyNames: { config: "kwlConfig", prop: baseKwlPath + 'tableKeyNames' },
        rowDataFields: { config: "kwlConfig", prop: baseKwlPath + 'rowDataFields' },
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
    var me = this;

    return Object
      .keys(me.configs || {})
      .map(function (key) {
        return me.configs[key];
      })
      .filter(function (config) {
        return (me.searchParams || [])
          .map(function (searchParam) {
            var startAt = 0, value = searchParam.value || searchValue;
            switch (searchParam.mode) {
              case "STARTS_WITH":
                return (config[searchParam.name] || "").indexOf(value, 0) === 0;
              case "ENDS_WITH":
                startAt = (config[searchParam.name] || "").length - value.length;
              case "CONTAINS":
                return (config[searchParam.name] || "").indexOf(value, startAt) !== -1;
              default:
                return (config[searchParam.name] === value);
            }
          })
          .reduce(function (acc, value) {
            return acc && value;
          }, true);
      });
  },
  open: function (ec, sord, fieldName) {
    var me = this,
        value = sol.common.SordUtils.getObjKeyValue(sord, fieldName);

    me.fieldName = fieldName;

    me.index = 0;
    me.resultSet = me.getResults(value);
  },
  openMap: function (ec, map, focusName) {
    var me = this,
        value = map[focusName];

    me.fieldName = focusName;

    me.index = 0;
    me.resultSet = me.getResults(value);
  },
  close: function () { },
  hasMoreRows: function () {
    var me = this;
    return (me.index < (me.resultSet.length));
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
    var me = this,
        row = me.resultSet[me.index];
    me.logger.info("me.resultSet", me.resultSet);
    me.logger.info("me.index", me.index);
    me.logger.info("me.row", me.row);
    me.index++;
    if (row) {
      row = me.getRowData(row);
      return row;
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
        keyNames = me.tableKeyNames || [];

    if (keyNames.length === 0) {
      (me.rowDataFields || {}).map(function (rowDataField) {
        keyNames.push(null);
      });
    }
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
      iterator,
      _configPath,
      _kwlConfigPath,
      _kwlName;
  try {
    log.info("DynamicKeywordList (");

    _configPath = configPath;
    _kwlConfigPath = kwlConfigPath;
    _kwlName = kwlName;

    iterator = sol.create("sol.common_monitoring.ix.dynkwl.ConfigKwl", {
      configPath: _configPath,
      kwlConfigPath: _kwlConfigPath,
      kwlName: _kwlName
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
