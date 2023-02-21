
/**
 * @private
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 */
sol.define("sol.common_document.as.functions.ReadExcelTable", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} path
   * Path
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        result = {},
        excelDocument;

    if (!me.objId) {
      throw "Object ID is empty";
    }

    if (!me.tableConfig) {
      throw "Table configuration is empty";
    }

    excelDocument = sol.create("sol.common.as.ExcelDocument", {});
    excelDocument.openFromRepo({ objId: me.objId });
    result = excelDocument.getTableData(me.tableConfig);

    return result;
  }
});
