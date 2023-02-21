
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js


var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.function.FillItem" });


/**
 * Copy specific fields from the proposal to the item itself
 *
 * # Example as a workflow node
 *  {
 *     "objId": "4711"
 *  }
 *
 * # Example as a IX function call
 *    sol.common.IxUtils.execute("RF_sol_meeting_function_FillItem", {
 *      "objId": "4711"
 *   })
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.function.FillItem", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  _optimizations: {},

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    itemSearchConfig: { config: "meeting", prop: "entities.meetingitem.services.getMeetingItem", template: true },
    itemOutputConfig: { config: "meeting", prop: "entities.meetingitem.outputs.itemMin", template: false },
    sord: { sordIdFromProp: "objId", optional: false }
  },

  process: function () {
    var me = this, result;
    result = me.fillItem(me.findItem());

    return {
        code: "success",
        message: "fill operation succeeded",
        data: { sord: me.sord, result: result }
    };
  },

  findItem: function () {
    var me = this, result;
    // TODO: Better writing GetItem provider

    result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider",
         {
           masks: me.itemSearchConfig.masks,
           search: me.itemSearchConfig.search,
           output: me.itemOutputConfig,
           options: {
             maxResults: 1,
             formatAsTemplateSord: true,
             ignorePropertyNames: false
           },
         },
         me._optimizations, "item", ["output"]);

    if (!result || result.sords.length === 0) {
        throw Error("Could not determine item from proposal object " + me.sord.id);
    }
    return result.sords[0];
  },

  fillItem: function (item) {
    if (!item) {
      throw Error("item must be set");
    }
    var me = this,
      config = {
       source: { objId: me.objId },
       target: { objId: item.id },
       metadataMapping: me.metadataMapping,
       options: { onlyWriteMappings: true }
     };

     return sol.common.IxUtils.execute("RF_sol_function_FillSord", config);
  }


});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
 function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_FillItem", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId), fun;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  fun = sol.create("sol.meeting.ix.function.FillItem", params);
  fun.process();
  logger.exit("onExitNode_FillItem");
}


/**
 * @member sol.meeting.ix.functions.Reference
 * @method RF_sol_learning_function_Reference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_FillItem(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId");
  fun = sol.create("sol.meeting.ix.function.FillItem", rfArgs);
  return JSON.stringify(fun.process());
}
