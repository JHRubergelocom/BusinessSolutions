importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.meeting.ix.ProposalUtils.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.ActionBase
 * @requires sol.meeting.ix.ProposalUtils
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.actions.ProposalRecord", {
  extend: "sol.common.ix.ActionBase",
  requiredConfig: ["itemReference", "workflow"],

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],
  inject: {
    service: { config: "resolutions", prop: "services.proposalRecord", template: true }
  },

  process: function () {
    var me = this, fillSordResult, proposal;

    try {

      proposal = sol.meeting.ix.ProposalUtils.findProposalByItem({
        objKeys: {
          MEETING_ITEM_ID: me.itemReference
        }
      }, { throwError: false });

      if (!proposal || !proposal.objId) {
        throw Error("proposal was not found for meeting item (" + me.objId + ") or objId in proposal result is missing");
      }
      fillSordResult = me.executeFillSord(me.prepareFillSordConfig(proposal));

      me.addWfDialogEvent(fillSordResult.flowId, { objId: proposal.objId });
    } catch (ex) {
      me.logger.error(["An error occured", ex]);
      throw ex;
    }
  },

  prepareFillSordConfig: function (proposal) {
    var me = this;

    return {
      objId: proposal.objId,
      source: {
        templateSord: {
          objKeys: {
            // TODO: this should be refactored
            STANDARD_WORKFLOW: me.workflow
          }
        }
      },
      target: {
        objId: proposal.objId,
        startWorkflow: me.service.workflow
      }
    };
  },

  executeFillSord: function (cfg) {
    return sol.common.IxUtils.execute("RF_sol_function_FillSord", cfg);
  },

  getName: function () {
   return "ProposalRecord";
  }

});

/**
 * @member sol.meeting.ix.actions.ProposalRecord
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_ProposalRecord(iXSEContext, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "itemReference"),
      action, result;

  action = sol.create("sol.meeting.ix.actions.ProposalRecord", params);
  result = action.execute();
  return result;
}
