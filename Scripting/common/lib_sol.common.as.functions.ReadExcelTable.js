
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
sol.define("sol.common.as.functions.ReadExcelTable", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["file"],

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

    if (!me.file) {
      throw "Excel document file path is empty";
    }

    excelDocument = sol.create("sol.common.as.ExcelDocument", {});
    excelDocument.openFile({ file: me.file });
    result = excelDocument.getTableData({ startRowIndex: 8, columnNames: ["firstName", "lastName"] });

    return JSON.stringify(result);
  }
});
