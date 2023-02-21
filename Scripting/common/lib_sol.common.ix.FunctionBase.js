
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js

/**
 * @abstract
 *
 * Basic operations used by elo business solutions are modularized as ix function modules.
 *
 * Implementations should allow using functions in different ways:
 *   - As a workflow node (onEnterNode, onExitNode)
 *   - Executed as a registered function call.
 *
 * # Implementing a a function
 *
 * A function must extend the class FunctionBase and should implement the functions onEnterNode, onExitNode and RF_custom_functions_MyFunction on js script scope level.
 *
 *     sol.define("custom.function.MyFunction", {
 *       extend: "sol.common.ix.FunctionBase",
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
 *     function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
 *       var params = sol.common.ix.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
 *           module;
 *         params.objId = wFDiagram.objId;
 *         module = sol.create("custom.functions.MyFunction", params);
 *         module.process();
 *     }
 *
 *     function onExitNode(clInfo, userId, wFDiagram, nodeId) {
 *       // same than onEnterNode
 *     }
 *
 *     function RF_custom_functions_MyFunction(iXSEContext, args) {
 *       var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "myParam"),
 *           module;
 *         module = sol.create("RF_custom_solution_functions_MyFunction", params);
 *         module.process();
 *     }
 *
 * # Executing function as Workflow Node
 *
 * Functions can be used as Workflow scripts. In this case the objId is set based on the current workflow and must not
 * be passed to the function.
 *
 * Other configurations can be defined in the notes field of each workflow. It is recommended to use one workflow node
 * for each function.
 *
 *     {
 *       myParam: "Yeah!"
 *     }
 *
 * # Execute function as ix registered function
 *
 * Functions can be exectud with the help of sol.common.ix.RfUtils.execute. In this case the Utils class handles the
 * ix Any-Object transformation.
 *
 *     sol.common.IxUtils.execute('RF_custom_functions_MyFunction', {
 *       objId: "4711",
 *       myParam: "Yeah!"
 *     });
 *
 * @eloix
 * @requires sol.Logger
 */
sol.define("sol.common.ix.FunctionBase", {

  /**
   * @property {sol.Logger}
   * @protected
   * The logger for the module
   */
  logger: undefined,

  /** @cfg {string}
   * Object ID for the element
   */
  objId: undefined,

  initialize: function (config) {
    var me = this;
    RhinoManager.registerClass(me.$className);
    this.$super("sol.Base", "initialize", [config]);
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

/**
 * @member sol.common.ix.FunctionBase
 * @method onEnterNode
 * @static
 * @abstract
 *
 * This function is called before a workflow node is activated.
 *
 * The configuration for this function can be defined in the comments section of each workflow node and should be valid js.
 * For more information on using this function please refer to the functions documentation.
 *
 * @param {de.elo.ix.client.ClientInfo} clInfo object with language, country and ticket
 * @param {number} userId The calling users ID
 * @param {de.elo.ix.client.WFDiagram} wFDiagram
 * @param {number} nodeId The activated node ID
 */


/**
 * @member sol.common.ix.FunctionBase
 * @method onExitNode
 * @static
 * @abstract
 *
 * This function is called after a workflow node is deactivated.
 *
 * The configuration for this function can be defined in the comments section of each workflow node and should be valid js.
 * For more information on using this function please refer to the functions documentation.
 *
 * @param {de.elo.ix.client.ClientInfo} clInfo  object with language, country and ticket
 * @param {number} userId  The calling users ID
 * @param {de.elo.ix.client.WFDiagram} wFDiagram
 * @param {number} nodeId  The deactivated node ID
 */

/**
 * @member sol.common.ix.FunctionBase
 * @method RF_FunctionName
 * @static
 * @abstract
 *
 * This function can be called from an application by invoking the API function "executeRegisteredFunction" or by using
 * sol.common.IxUtils.execute which internally handles the Any-Object conversion.
 *
 * All configuration params should be passed as a configuration object to the args param.
 *
 *     sol.common.IxUtils.execute('RF_FunctionName', {
 *       configParam1: 'myParam'
 *     });
 *
 * @param {de.elo.ix.client.IXServerEventsContext} Execution context
 * @param {Object} args Argument array sent by the client application.
 */