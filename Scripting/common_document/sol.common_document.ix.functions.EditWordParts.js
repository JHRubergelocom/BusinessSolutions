
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.DynKwlUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common_document.ix.functions.EditWordParts" });

/**
 * Edits Word Parts
 *
 * The parts to be inserted are read from the map field defined as `partIdsFromMapTableKey`, e.g. CLAUSE_ID1, CLAUSE_ID2, CLAUSE_ID3.
 *
 * The inserted part is marked with a tag containing the key defined as `searchPartIdFieldName`, e.g. sol.common.DocumentPart.CLAUSE_ID=CL0001
 *
 * The part IDs can additionally be written pilcrow-separated in the field `partIdsTargetFieldName`.
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.DynKwlUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common_document.ix.functions.EditWordParts", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this;

    me.partsConfig = me.partsConfig || {};
    me.partsConfig.editParts = true;

    sol.common.IxUtils.execute("RF_sol_common_service_ExecuteAsAction", {
      solution: "common",
      action: "sol.common_document.as.functions.EditWordParts",
      config: {
        objId: me.objId,
        editParts: true,
        partIdsFromMapTableKey: me.partIdsFromMapTableKey,
        searchPartIdFieldName: me.searchPartIdFieldName,
        partIdsTargetFieldName: me.partIdsTargetFieldName
      },
      connParams: {
        language: ixConnect.loginResult.clientInfo.language + ""
      }
    });
  }
});

/**
 * @member sol.common_document.ix.functions.EditWordParts
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_EditWordParts", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common_document.ix.functions.EditWordParts", params);

  module.process();

  logger.exit("onEnterNode_EditWordParts");
}


/**
 * @member sol.common_document.ix.functions.EditWordParts
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_EditWordParts", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common_document.ix.functions.EditWordParts", params);

  module.process();

  logger.exit("onExitNode_EditWordParts");
}
