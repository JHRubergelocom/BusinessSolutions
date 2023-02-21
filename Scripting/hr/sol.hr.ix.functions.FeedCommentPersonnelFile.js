importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.client.feed);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js
//@include lib_sol.hr.Utils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", {
  scope: "sol.hr.ix.functions.FeedCommentPersonnelFile"
});

/**
 * Writes a Feed Comment to the personnel file of the user that started the current active workflow.
 *
 * Information that can be passed to the data object are based on the current object.
 *
 * FeedComment configuration is internally passed to sol.common.ix.functions.FeedComment. Therefore all configuration options can be used. e.g.
 *
 *     {
 *       "file": "sol.hr.workflow",
 *       "key": "WORKFLOW.HR.REQUEST.ADDR",
 *       "data": [ "HR_ADRESS", { "type": "SORD", "key": "guid" } ]
 *     }
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 *
 * @requires moment
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.hr.shared.Utils
 * @requires sol.hr.Utils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.hr.ix.functions.FeedCommentPersonnelFile", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    originGUIDField: { config: "hr", prop: "entities.employeeentryrequest.services.employeeentryrequestconclusionparams.const.originGUIDField", template: true } // ""
  },

  /**
   * @private
   * @cfg {String} personnelFileFrom
   * Defines where to get the personal file objId from. Defaults to WF_OWNER.
   *
   * Available options:
   *
   *     WF_OWNER
   */
  personnelFileFrom: "WF_OWNER",

  process: function (params) {
    var me = this,
        userName, currentUserInfo, currentUserGuid, originGuid,
        personnelFileObjId;

    if (me.personnelFileFrom === "originGuid") {
      originGuid = sol.common.ObjectUtils.getProp(sol.hr.shared.Utils.getSordData(me.objId, me.flowId, true), me.originGUIDField);
      personnelFileObjId = sol.hr.Utils.getPathOfUsersPersonnelFileByGuid(originGuid);
    } else {
      userName = me.wfOwnerName;
      personnelFileObjId = sol.hr.Utils.getPathOfUsersPersonnelFile(userName);
    }
    currentUserInfo = sol.common.UserUtils.getUserInfo(me.wfCurrentUser);
    currentUserGuid = currentUserInfo.guid;

    params.writeToObjId = personnelFileObjId;
    params.userGuid = currentUserGuid;

    me.executeIxFunctionAsAdministrator("RF_sol_function_FeedComment", params);
  },

  executeIxFunctionAsAdministrator: function (fct, paramObj) {
    paramObj.adminTicket = String(ixConnectAdmin.loginResult.clientInfo.ticket);
    var any = new Any();
    any.type = ixConnect.CONST.ANY.TYPE_STRING;
    any.stringValue = sol.common.JsonUtils.stringifyAll(paramObj);
    ixConnectAdmin.ix().executeRegisteredFunction(fct, any);
  }

});

/**
 * @member sol.common.ix.functions.FeedComment
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_FeedCommentPersonnelFile", { flowId: wFDiagram.id, nodeId: nodeId });
  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  params.wfOwnerName = wFDiagram.ownerName;
  params.wfCurrentUser = userId;
  module = sol.create("sol.hr.ix.functions.FeedCommentPersonnelFile", params);

  module.process(params);

  logger.exit("onExitNode_FeedCommentPersonnelFile");
}