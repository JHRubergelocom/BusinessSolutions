importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.voting.mixins.Configuration.js
//@include lib_sol.meeting.voting.ix.Voting.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.DeleteVoting" });

/**
* 
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.ix.RepoUtils
* @requires sol.common.ix.AclUtils
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.voting.ix.services.DeleteVoting", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  mixins: [
    "sol.meeting.voting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  _optimize: {},

  inject: {
    deleteWorkflow: { config: "voting", prop: "voting.services.deleteVoting.workflow" }
  },

  deleteVoting: function () {
    var me = this, voting, result;

    // validate automatically if the object is a meeting voting
    voting = sol.create("sol.meeting.voting.ix.Voting", me.objId);

    voting.checkPermissions({ rights: { d: true } });

    // start workflow which should have the delete function node
    result = sol.common.WfUtils.startWorkflow(me.deleteWorkflow.name, me.deleteWorkflow.title, me.objId);
    me.logger.info(["result {0}", JSON.stringify(result)]);
    return { flowId: result, objId: me.objId };
  }
});

/**
* @member sol.meeting.voting.ix.services.Voting
* @method RF_sol_meeting_voting_service_Voting_Delete
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Voting_Delete(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      votingService, result;

  votingService = sol.create("sol.meeting.voting.ix.services.DeleteVoting", rfParams);
  result = votingService.deleteVoting();
  return sol.common.JsonUtils.stringifyQuick(result);
}