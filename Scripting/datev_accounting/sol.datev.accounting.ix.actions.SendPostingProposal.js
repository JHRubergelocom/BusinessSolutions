importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ActionBase.js
//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js



// noinspection ES6ConvertVarToLetConst
var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.actions.SendPostingProposal" });

/**
 *
 *
 * @author MH, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.ix.FunctionBase
 *
 * This functions module can only be used as an end script onto a workflow node
 *
 */
sol.define("sol.datev.accounting.ix.actions.SendPostingProposal", {
  extend: "sol.common.ix.ActionBase",

  required: ["sordIds"],

  mixins: ["sol.datev.accounting.mixins.ApiRequest", "sol.datev.accounting.mixins.Configuration"],

  inject: {
    api: { config: "api", prop: "api", template: false }
  },

  initialize: function (config) {
    // noinspection ES6ConvertVarToLetConst
    var me = this;
    me.$super("sol.common.ix.ActionBase", "initialize", [config]);
  },

  getName: function(){
    return "SendPostingProposals";
  },

  /**
     *
     */
  process: function () {
    // noinspection ES6ConvertVarToLetConst
    var me = this, arrSordIds, currentUser,
        content;

    arrSordIds = me.sordIds;
    if (!sol.common.ObjectUtils.isArray(arrSordIds)){
      arrSordIds = me.sordIds.split(",");
    }


    if (ixConnect != null){
      currentUser = ixConnect.loginResult.user;
    }
    

    var data = sol.common.IxUtils.execute('RF_datev_function_PostingProposal', {
       sordIds: arrSordIds,
       currentUser: currentUser ? currentUser.name : ""
    });


    if (data.exceptionMessage){
       me.logger.warn(["exception message={0}", data.exceptionMessage]);
       me.addErrorEvent("sol.datev.accounting.posting.proposal.error", null, data.exceptionMessage, me.ci);
    } else {
      me.addInfoEvent("sol.datev.accounting.posting.proposal.response" , me.ci, {});
    }

  },
});

function RF_datev_accounting_actions_SendPostingProposals(ec, args) {
  var me = this,
    action, params;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  params.ci = ec.ci;
  action = sol.create("sol.datev.accounting.ix.actions.SendPostingProposal", params);
  return action.execute();

}

