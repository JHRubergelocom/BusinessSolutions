
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
 * Completes enrollments based on a sord containing a MAPTABLE containing the enrollments which should be completed.
 *
 * #### Returns
 *
 *     { code: "success", info: "Enrollments completed successfully" }
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
sol.define("sol.learning.ix.functions.InitiateSessionConclusion", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "flowId"],

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: { sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" } },

  extractColumnsFromConfig: function (mappings) {
    return mappings.reduce(function (acc, mapping) {
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
    return Object.keys(table)  // find size of largest column ...
      .reduce(function (max, col) {
        return table[col].length >= max ? table[col].length : max;
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
    columns[mapName].some(function (col) {
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
    return Object.keys(columns)  // map, wfMap
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

  completeEnrollment: function (config) {
    sol.common.IxUtils.execute("RF_sol_learning_function_ManageEnrollment", config);
  },

  rowToCompletion: function (row) {
    var me = this;
    (row[me.attendedIndicatorColumn] === "1")
      && me.completeEnrollment({
        action: me.cancel ? "cancelled" : "completed",
        course: me.sord.objKeys[me.courseNoColumn],
        session: me.sord.objKeys[me.sessionNoColumn],
        user: row[me.userColumn]
      });
  },

  process: function () {
    var me = this;

    me.convertTable(me.buildTable(me.extractColumnsFromConfig(me.metadataMapping), me.sord))
      .forEach(me.rowToCompletion.bind(me));

    return { code: "success", info: "Enrollments completed successfully" };
  }
});

/**
 * @member sol.learning.ix.functions.InitiateSessionConclusion
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.InitiateSessionConclusion", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.InitiateSessionConclusion
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.InitiateSessionConclusion", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.InitiateSessionConclusion
 * @method RF_sol_learning_function_InitiateSessionConclusion
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_InitiateSessionConclusion(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  fun = sol.create("sol.learning.ix.functions.InitiateSessionConclusion", rfArgs);

  return JSON.stringify(fun.process());
}