//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.IxUtils.js

/**
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.SyncAgenda", {
  extend: "sol.common.ix.FunctionBase",

  process: function () {
    var me = this;

    me.logger.info(["sync"], me.objEntries);

    sol.common.IxUtils.execute("RF_sol_function_MultiSet", {
      objEntries: me.objEntries,
      dryRun: me.$dryRun
    });

  }

});

/**
 * @member sol.meeting.ix.functions.SyncAgenda
 * @method RF_sol_meeting_function_SyncAgenda
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
 function RF_sol_meeting_function_SyncAgenda(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  fun = sol.create("sol.meeting.ix.functions.SyncAgenda", rfArgs);
  return JSON.stringify(fun.process());
}
