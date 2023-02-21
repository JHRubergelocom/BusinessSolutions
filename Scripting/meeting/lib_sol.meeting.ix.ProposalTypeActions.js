importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 *
 * @eloix
 *
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.ProposalTypeActions", {

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    actions: { config: "resolutions", prop: "actions", template: true },
    proposalActionTypes: { config: "proposals", prop: "proposalTypes", template: false },
    defaultProposalType: { config: "proposals", prop: "settings.defaultProposalType", template: false }
  },

  getActions: function (proposalTypeCode) {
    var me = this, proposalActions;

    if (proposalTypeCode) {
      proposalActions = me.getProposalActions(proposalTypeCode);
      if (!sol.common.ObjectUtils.isArray(proposalActions)) {
        me.logger.warn("proposal type `" + proposalTypeCode + "` has not matching action configs. Use default");
        proposalActions = me.getProposalActions(me.defaultProposalType);
      }
    } else {
      proposalActions = me.getProposalActions(me.defaultProposalType);
    }

    return me.resolveAllActions(proposalActions);
  },

  resolveAllActions: function (proposalActions) {
    var me = this;
    return proposalActions
      .map(me.resolveAction.bind(me)) // resolve each action configuration by actionKey
      .filter(function (action) { // remove undefined actions
        return action;
      })
    .map(me.mergeProps.bind(me));
  },

  /**
   * @private
   */
  getProposalActions: function(key) {
    var me = this;
    return sol.common.ObjectUtils.getProp(me.proposalActionTypes, key);
  },

  /**
   * @private
   * @param {} action
   * @returns
   */
  resolveAction: function (action) {
    var me = this, resolvedAction;

    if (!action) {
      return undefined;
    } else if (action.divider) {
      return action;
    } else if (action.actionKey) {
      // return action config with title and workflow configs
      resolvedAction = sol.common.ObjectUtils.getProp(me.actions, action.actionKey);

      if (sol.common.ObjectUtils.isObject(action.args)) {
        // merge all props of specific action configuration into base action configuration
        // to have the ability to override specific settings in special use-cases
        resolvedAction = sol.common.ObjectUtils.merge(resolvedAction, action.args);
      }
      return resolvedAction;
    } else {
      return undefined;
    }
  },

  mergeProps: function (action) {
    return action;


  }

});
