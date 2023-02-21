
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include sol.common.ix.services.StandardPreconditions.js

/**
 *
 * @requires sol.common.ix.services.StandardPreconditions
 *
 */
sol.define("sol.meeting.services.ProposalPreCondition", {
  extend: "sol.common.ix.services.StandardPreconditions",

  notAllowedMessage: "sol.meeting.proposals.preconditions.initiateApproval.notAllowed",

  conditions: [
    { prop: "objKeys.MEETING_PROPOSAL_STATUS", value: "D - *" }
  ]
});

/**
* @method RF_sol_meeting_service_ProposalPrecondition
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_ProposalPrecondition(context, args) {
  var params,
      module,
      result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "targetId");

  module = sol.create("sol.meeting.services.ProposalPreCondition", params);

  result = module.process();

  return sol.common.JsonUtils.stringifyQuick(result);
}
