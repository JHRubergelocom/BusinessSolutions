
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.dev.ix.functions.ResolveTemplate" });


/**
 * Resolve a Template String with provided context data
 *
 * # Using templates from a string
 *
 *     {
 *         source: 'Hello {{name}}.',
 *         context: {
 *            name: "Max"
 *         }
 *     }
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Template
 * 
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.dev.ix.functions.ResolveTemplate", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["source", "context"],


  /**
   * @cfg {String} source (required)
   */

  /**
   * @cfg {Object[]} context(required)
   *
   */

  /**
   */
  process: function () {
    var me = this, template, result;

    template = sol.create("sol.common.Template", {
      source: me.source
    });
    result = template.apply(me.context);
    return result;
  }
});


/**
 * @member sol.dev.ix.functions.ResolveTemplate
 * @method RF_sol_function_ResolveTemplate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_dev_function_ResolveTemplate(ec, args) {
  var params, module;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "source", "context");
  module = sol.create("sol.dev.ix.functions.ResolveTemplate", params);
  return JSON.stringify(module.process());
}
