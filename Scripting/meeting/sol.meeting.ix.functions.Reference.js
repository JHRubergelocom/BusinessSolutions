
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.SordTypeUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Create a reference from source object to referencePaths
 * 
 * # Example as a workflow node
 *  {
 *     "source": "4711",
 *     "referencePaths": ["ARCPATH:/Sitzungsmanagement/"]
 *  }
 * 
 * # Example as a IX function call
 *    sol.common.IxUtils.execute("RF_sol_function_Reference", {
 *      "source": "4711",
 *      "referencePaths": ["ARCPATH:/Sitzungsmanagement/"]
 *   })
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.Reference", {
  extend: "sol.common.ix.FunctionBase",

  initialize: function(config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this;
    me.executeMove();
    return {code: "success", message: "move operation succeeded" , data: {source: me.source, referencePaths: me.referencePaths}}
  },

  executeMove: function(){
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_function_Move", {
      objId: me.source,
      referencePaths: me.referencePaths
    })
  }
});



/**
 * @member sol.meeting.ix.functions.Reference
 * @method RF_sol_learning_function_Reference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_Reference(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "source", "referencePaths");
  fun = sol.create("sol.meeting.ix.functions.Reference", rfArgs);
  return JSON.stringify(fun.process());
}
