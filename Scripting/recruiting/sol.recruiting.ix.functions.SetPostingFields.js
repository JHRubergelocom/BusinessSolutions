
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js

/**
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.recruiting.ix.functions.SetPostingFields", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  process: function () {
    var me = this,
        sord, sords, requisitionno, requisitionqualifications, requisitiondesc, requisitionname;

    sord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbAllIndex });
    requisitionno = sol.common.SordUtils.getObjKeyValue(sord, "RECRUITING_REQUISITION_NO");
    if (requisitionno) {
      sords = sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", 
        {
          masks: ["Recruiting Requisition"],
          search: [{ key: "RECRUITING_REQUISITION_NO", value: requisitionno }],
          output: [
            { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
            { source: { type: "SORD", key: "name" }, target: { prop: "name" } },
            { source: { type: "GRP", key: "RECRUITING_REQUISITION_DESC" }, target: { prop: "requisitiondesc" } },
            { source: { type: "GRP", key: "RECRUITING_REQUISITION_NAME" }, target: { prop: "requisitionname" } },
            { source: { type: "FORMBLOB", key: "RECRUITING_REQUISITION_QUALIFICATIONS" }, target: { prop: "requisitionqualifications" } }    
          ]    
        });
      if (sords.sords[0]) {
        requisitionqualifications = sords.sords[0].requisitionqualifications;
        requisitiondesc = sords.sords[0].requisitiondesc;
        requisitionname = sords.sords[0].requisitionname;
        if (!requisitionqualifications) { 
          requisitionqualifications = ""; 
        }
        if (!requisitiondesc) { 
          requisitiondesc = ""; 
        }
        if (!requisitionname) { 
          requisitionname = ""; 
        }  
        sol.common.IxUtils.execute("RF_sol_function_Set", {
          objId: me.objId,
          entries: [
            {
              type: "FORMBLOB",
              key: "RECRUITING_POSTING_QUALIFICATIONS",
              value: requisitionqualifications
            },
            {
              type: "SORD",
              key: "desc",
              value: requisitiondesc
            },
            {
              type: "GRP",
              key: "RECRUITING_POSTING_NAME",
              value: requisitionname
            }
          ]
        });
      }
    }
  }
});

/**
 * @member sol.recruiting.ix.functions.SetPostingFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.recruiting.ix.functions.SetPostingFields", params);

  fun.process();
}

/**
 * @member sol.recruiting.ix.functions.SetPostingFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  fun = sol.create("sol.recruiting.ix.functions.SetPostingFields", params);

  fun.process();
}

/**
 * @member sol.recruiting.ix.functions.SetPostingFields
 * @method RF_sol_recruiting_function_SetPostingFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_recruiting_function_SetPostingFields(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId");
  fun = sol.create("sol.recruiting.ix.functions.SetPostingFields", rfArgs);

  fun.process();
}