
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Creates sessions based on a sord containing a MAPTABLE containing the data for the bulk mailing.
 *
 * #### Returns
 *
 *     { code: "success", data: [{ objId: "12345", flowId: "33" }], info: "Bulk mailing initiated successfully" }
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.AddSessions", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" }
  },

  _optimize: {},

  pilcrow: String.fromCharCode(182),

  extractColumnsFromConfig: function (mappings) {
    return mappings
      .reduce(function (acc, mapping) {
        (mapping = mapping.target)
          && (
            (mapping.valueFromMapTableRow && acc.map.push(mapping.valueFromMapTableRow))
            || (mapping.valueFromWfMapTableRow && acc.wfMap.push(mapping.valueFromWfMapTableRow))
          );
        return acc;
      }, { wfMap: [], map: [] });
  },

  arrayOfInt: function (int) {
    return Array.apply(null, Array(int));
  },

  sizeOfLargestColumn: function (table) {
    return Object.keys(table) // find size of largest column ...
      .reduce(function (max, col) {
        return (table[col].length >= max) ? table[col].length : max;
      }, 0);
  },

  rowToObject: function (table, columns, _, rowNo) {
    return columns
      .reduce(function (acc, col) {
        acc[col] = table[col][rowNo];
        return acc;
      }, {});
  },

  rowNotEmpty: function (row) {
    return Object.keys(row)
      .some(function (name) {
        return row[name];
      });
  },

  addKeyToTable: function (table, columns, map, mapName, key) {
    var column;
    columns[mapName]
      .some(function (col) {
        return (column = key.indexOf(col) === 0 && col);
      })
        && (table[column][+(key.slice(column.length)) - 1] = (map[key]));
  },

  addMapToTable: function (columns, sord, table, mapName) {
    var me = this, map;
    Object.keys(map = (sord[mapName + "Keys"] || {}))
      .forEach(me.addKeyToTable.bind(null, table, columns, map, mapName));
    return table;
  },

  generateEmptyTable: function (colMap) {
    return Object.keys(colMap)
      .reduce(function (acc, mapName) {
        return colMap[mapName]
          .reduce(function (ac, col) {
            return (ac[col] = []) && ac;
          }, acc);
      }, {});
  },

  buildTable: function (columns, sord) {
    var me = this;
    return Object.keys(columns) // map, wfMap
      .reduce(
        me.addMapToTable.bind(me, columns, sord),
        me.generateEmptyTable(columns)
      );
  },

  convertTable: function (table) {
    var me = this;
    return me.arrayOfInt(me.sizeOfLargestColumn(table))
      .map(me.rowToObject.bind(null, table, Object.keys(table)))
      .filter(me.rowNotEmpty);
  },

  createSession: function (config) {
    var me = this;

    try {
      return sol.common.IxUtils.execute("RF_sol_learning_function_CreateSessionHeadless", config);
    } catch (_e) {
      me.logger.debug("AddSessions: Creating a session failed. Please review the logs (RF_sol_learning_function_CreateSessionHeadless) for further details.");
    }
  },

  adjustConfigForRow: function (config, row) {
    config.metadataMapping // set values from maptables in mapping
      .reduce(function (acc, mapping, col) {
        (mapping = mapping.target)
          && (col = (mapping.valueFromMapTableRow || mapping.valueFromWfMapTableRow))
            && (mapping.value = (row[col] || ""));
        return acc;
      }, config);

    config.template = { name: row["SESSION_TEMPLATE"] };
    return config;
  },

  rowToSession: function (config, results, row) {
    var me = this;
    results.push(
      (me.createSession(me.adjustConfigForRow(JSON.parse(config), row), row) || {}).data
    );
    return results;
  },

  process: function () {
    var me = this, createdSessions = [];

    me.convertTable(me.buildTable(me.extractColumnsFromConfig(me.metadataMapping), me.sord))
      .reduce(
        me.rowToSession.bind(
          me,
          sol.common.JsonUtils.stringifyQuick({ // stringify once...gets parsed in rowToSession
            objId: me.objId,
            flowId: me.flowId || "",
            course: me.sord.objKeys.COURSE_REFERENCE,
            metadataMapping: me.metadataMapping
          })
        ),
        createdSessions
      );

    return { code: "success", data: createdSessions, info: "Sessions added successfully" };
  }
});

/**
 * @member sol.learning.ix.functions.AddSessions
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.AddSessions", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.AddSessions
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.AddSessions", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.AddSessions
 * @method RF_sol_learning_function_AddSessions
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_AddSessions(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.AddSessions", rfArgs);

  return JSON.stringify(fun.process());
}