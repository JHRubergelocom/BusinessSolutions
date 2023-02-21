
//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

/**
 * @abstract
 * Base class for data collection services.
 *
 * @eloix
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.DataCollectorBase", {
  extend: "sol.common.ix.ServiceBase",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Starts the collection of the desired data
   */
  execute: function () {
    throw "can not call function 'execute' on abstract class 'sol.common.ix.DataCollectorBase'";
  }
});