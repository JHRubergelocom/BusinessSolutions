importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * @abstract
 *
 * Basic operations used by elo business solutions are modularized as ELOas function modules.
 *
 * Implementations should allow using functions in different ways:
 *   - As a workflow node
 *   - Executed within ELOas Scripts
 *
 * # Implementing a function
 *
 * A function must extend the class FunctionBase.
 *
 *     sol.define("custom.solution.as.function.MyFunction", {
 *       extend: "sol.common.as.FunctionBase",
 *
 *       requiredConfig: ["objId", "myParam"],
 *
 *       initialize: function (config) {
 *         var me = this;
 *         me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
 *       },
 *
 *       process: function() {
 *         // function logic goes here
 *         var me = this;
 *         me.myParam;
 *       },
 *     });
 *
 *
 * @eloix
 */
sol.define("sol.common.as.FunctionBase", {

  /**
   * @property {sol.Logger}
   * @protected
   * The logger for the module
   */
  logger: undefined,

  /**
   * @cfg {string}
   * Object ID for the element
   */
  objId: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * Execution of the function module
   * @return {String}
   */
  execute: function () {
    var me = this,
        result;
    try {
      result = me.process();
    } catch (ex) {
      if (me.ixCall) {
        elo.setAnswer("Exception: " + ex);
      } else {
        throw ex;
      }
    }
    return result;
  },

  /**
   * @abstract
   * Implementation of function modules' process.
   * This function must be implemented by the child class and should contain the logic of the function module.
   */
  process: function () {
    throw "cannot call 'process' of abstract FunctionBase";
  }

});