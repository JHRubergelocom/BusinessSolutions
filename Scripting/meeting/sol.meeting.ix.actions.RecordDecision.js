importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.meeting.ix.ProposalUtils.js
//@include lib_sol.meeting.mixins.Configuration.js


/**
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Injection
 * @requires sol.common.StringUtils
 * @requires sol.common.ix.ActionBase
 * @requires sol.common.ix.ProposalUtils
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.actions.RecordDecision", {
  extend: "sol.common.ix.ActionBase",
  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  requiredConfig: ["objId", "itemReference"],

  inject: {
    workflow: { config: "meetingItem", prop: "meetingItem.actions.recordDecision.workflow", template: false },
    templateSord: { config: "meetingItem", prop: "meetingItem.actions.recordDecision.templateSord", template: true },
    copySordKeys: { config: "meetingItem", prop: "meetingItem.actions.recordDecision.copySordKeys", template: false },
    sord: { sordIdFromProp: "objId", optional: true }
  },

  process: function () {
    var me = this, decision, flowId,
      itemId = me.objId, proposal;
    try {
      me.evaluateInjectedConfig();

      proposal = sol.meeting.ix.ProposalUtils.findProposalByItem({
        objKeys: {
          MEETING_ITEM_ID: me.itemReference
        }
      }, { throwError: false });

      // create new simple decision object for the item
      // when no proposal was already created
      // createdSord contains { objId, flowId }
      decision = proposal || me.createSimpleDecision(itemId);
      flowId = me.startWorkflow(decision);


      me.addWfDialogEvent(flowId, { objId: decision.objId });
    } catch (ex) {
      me.logger.error(["An error occured", ex]);
      me.addErrorEvent(ex.message);
    }
  },

  evaluateInjectedConfig: function () {
    var me = this, workflow = me.workflow || {};

    if (sol.common.StringUtils.isBlank(workflow.template)) {
      throw Error("Workflow template id must be set in `sol.meeting.ix.actions.RecordDecision`");
    }

    if (sol.common.StringUtils.isBlank(workflow.name)) {
      throw Error("Workflow name must be set in `sol.meeting.ix.actions.RecordDecision`");
    }
  },

  getName: function () {
   return "RecordDecision";
  },

  createSimpleDecision: function (itemId) {
    var me = this, decision;

    decision = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
      source: {
        templateSord: me.templateSord,
        copySordKeys: ["name"]
      },
      target: {
        fromService: {
          name: "RF_sol_function_CreateSord",
          params: {
            sourceElement: {
              fromScratch: {
                mask: me.templateSord.mask,
                type: me.templateSord.type
              },
              options: { inherit: true }
            },
            targetFolder: { objId: itemId }
          }
        }
      }
    });

    if (!decision.objId) {
      throw Error("Could not create simple decision on item " + itemId);
    }

    return decision;
  },

  startWorkflow: function (targetObj) {
    var me = this, flowId;
    flowId = sol.common.WfUtils.startWorkflow(me.workflow.template, me.workflow.name, targetObj.objId);

    if (!flowId) {
      throw Error("Could not start workflow `" + me.action.workflowId + "` for item " + me.objId);
    }
    return flowId;
  }
});

/**
 * @member sol.meeting.ix.actions.RecordDecision
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_RecordDecision(iXSEContext, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "itemReference"),
      action, result;

  action = sol.create("sol.meeting.ix.actions.RecordDecision", params);
  result = action.execute();
  return result;
}
