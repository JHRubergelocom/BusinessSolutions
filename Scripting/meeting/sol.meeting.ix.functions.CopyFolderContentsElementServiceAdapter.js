
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CopyFolderContentsElementServiceAdapter" });


/**
 * Copies whole folder recursively.
 *
 * @private
 * This function will be replaced in future
 *
 * # As IX function call
 *
 *       source: 1233,
 *       copySourceAcl: false,
 *       inheritDestinationAcl: true
 *     });
 *
 * # Node configuration example:
 *
 *     {
 *       "source": "ARCPATH:/MyTemplates/MyTemplate1"
 *     }
 */
sol.define("sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;

    // store options to delegate props to the original function easily
    me._copyFolderContentsOptions = sol.common.ObjectUtils.clone(config);
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this, targetFolderId, sourceFolderId;

    targetFolderId = me.findByElementService(me.targetElementService);

    if (!me.source) {
      sourceFolderId = me.findByElementService(me.sourceElementService);
    } else {
      sourceFolderId = me.source;
    }

    me._copyFolderContentsOptions.objId = targetFolderId || me.objId;
    me._copyFolderContentsOptions.source = sourceFolderId;

    me.logger.info(["copyFolderContent options {0}", JSON.stringify(me._copyFolderContentsOptions)]);

    if (me.$dryRun) {
      return {
        name: "RF_sol_function_CopyFolderContents",
        args: me._copyFolderContentsOptions
      };
    } else {
      return sol.common.IxUtils.execute(
        "RF_sol_function_CopyFolderContents",
        me._copyFolderContentsOptions
      );
    }

  },

  findByElementService: function (elementServiceCfg) {
    var me = this, args, targetFolderId;
    if (elementServiceCfg && sol.common.ObjectUtils.isObject(elementServiceCfg)) {
      args = sol.common.ObjectUtils.clone(elementServiceCfg.args || {});

      if (elementServiceCfg.objId === "fromParams") {
        args.objId = me.objId;
      }

      me.logger.info(["use elementService {0}, args={1}", elementServiceCfg.name, JSON.stringify(args)]);
      targetFolderId = sol.common.IxUtils.execute(elementServiceCfg.name, args).id;
      me.logger.info(["determine targetFolder {0}", targetFolderId]);
    } else {
      targetFolderId = me.objId;
    }
    return targetFolderId;
  }
});

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_sol.meeting.ix.functions.CopyFolderContentsAdapter", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = String(wFDiagram.objId);

  module = sol.create("sol.meeting.ix.functions.CopyFolderContentsAdapter", params);
  module.process();

  logger.exit("onEnterNode_sol.meeting.ix.functions.CopyFolderContentsAdapter");
}

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = String(wFDiagram.objId);

  module = sol.create("sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", params);
  module.process();

  logger.exit("onExitNode_sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter");
}

/**
 * @member sol.common.ix.functions.CopyFolderContents
 * @method RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter(iXSEContext, args) {
  var params, module, objId;
  logger.enter("RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "copySourceAcl", "inheritDestinationAcl");

  try {
    sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);
  } catch (e) {
    params.asAdmin = false;
  }

  module = sol.create("sol.meeting.ix.functions.CopyFolderContentsElementServiceAdapter", params);
  objId = module.process();
  logger.exit("RF_sol_meeting_function_CopyFolderContentsElementServiceAdapter");
  return sol.common.JsonUtils.stringifyAll(objId);
}
