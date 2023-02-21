importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include sol.common.ix.functions.Delete.js


var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.DeleteShellItem" });

/**
 * Determine connected shell item of an meeting item.
 *
 * The Shell item is only an blank objects with some meta information.
 * The organizer has the ability to manage the shell object as soon as the owner of
 * the meeting item doesnt submit the whole item to the meeting.
 *
 * For this scenario all the content and documents are missing in the item itself
 * The organizer is only working with the shell object.
 *
 * After the user has submitted the original item to the meeting the shell item must be deleted!
 *
 * This function can only be executed in workflow for security reasons.
 *
 * It is important that the validation within the class is executed
 * so that we increase security and not accidentally delete other objects
 *
 * ## Example
 *
 *   {
 *     "objId": "4711",
 *     "target": {
*        "fromField": {
 *          { "type": "GRP", "key": "ELOINDEX" }
 *       }
 *     }
 *   }
 *
 * @eloix
 *
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ix.functions.Delete
 */
sol.define("sol.meeting.ix.functions.DeleteShellItem", {
  extend: "sol.common.ix.functions.Delete",
  requiredConfig: ["objId", "target"],

  /**
   * @cfg {Object} target Define target field definition
   * @cfg {Object} [target.fromField] target.fromField field definition to dertermine objId by sord field
   */

  /**
   * @private
   */
  expectedSolType: "MEETING_ITEM",

  /**
   * @private
   */
  connectionField: "MEETING_ITEM_LINK",

  process: function () {
    var me = this, targetId, sord, targetSord;

    sord = sol.common.RepoUtils.getSord(me.objId);

    // rewriting target objId because we would like to delete
    // a connected object directly.
    targetId = me.determineTarget(sord, me.target);

    if (!targetId) {
      me.logger.info(["skip deletion because shell item doesn't exist objId={0}", me.objId]);
      return;
    }

    targetSord = sol.common.RepoUtils.getSord(targetId);

    if (sol.common.SordUtils.getObjKeyValue(targetSord, "SOL_TYPE") !== me.expectedSolType) {
      throw Error("This object may not be deleted because SOL_TYPE is not as expected. Expected SOL_TYPE is " + me.expectedSolType);
    }

    if (!me.hasSameGuid(sord, targetSord)) {
      throw Error("sord objId= " + sord.id + ", guid="
        + sord.guid + " targetSord guid "
        + sol.common.SordUtils.getObjKeyValue(targetSord, me.connectionField)
        + " is not connected to each other. Different guid detected in " + me.connectionField + " field");
    }

    me.performDeletion(targetId);
  },

  performDeletion: function (targetId) {
    var me = this;
    // rewriting objId because we dont want to delete the current sord itself.
    me.objId = targetId;
    // extra methods for better testing purposes
    me.$super("sol.common.ix.functions.Delete", "process", []);
  },

  determineTarget: function (sord, targetOptions) {
    var me = this, options, targetId;

    if (targetOptions) {
      options = sol.common.ObjectUtils.clone(targetOptions);
      me.logger.debug("Determine targetId ", options);
      if (sol.common.ObjectUtils.type(targetOptions.fromField, "object")) {
        targetId = sol.common.SordUtils.getValue(sord, options.fromField);
      } else if (sol.common.ObjectUtils.type(targetOptions.fromService, "object")) {
        throw Error("fromService is currently not implemented");
      } else {
        throw Error("fromField must be defined at least with following structure: { fromField: { type, key }");
      }
    }

    return targetId;
  },

  hasSameGuid: function (sourceSord, targetSord) {
    var me = this;
    return String(sourceSord.guid) === sol.common.SordUtils.getObjKeyValue(targetSord, me.connectionField);
  }

});

/**
 * @member sol.common.ix.functions.Delete
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
 function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_DeleteShellItem", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }
  params.objId = wFDiagram.objId;

  module = sol.create("sol.meeting.ix.functions.DeleteShellItem", params);
  module.process();

  logger.exit("onExitNode_DeleteShellItem");
}

/**
 * @member sol.common.ix.functions.Delete
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;
  logger.enter("onEnterNode_DeleteShellItem", { flowId: wFDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  }
  params.objId = wFDiagram.objId;

  module = sol.create("sol.meeting.ix.functions.DeleteShellItem", params);
  module.process();

  logger.exit("onEnterNode_DeleteShellItem");
}