
importPackage(Packages.de.elo.ix.client);
//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Roles.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js

//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ix.DynKwlUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.CheckStatusPreCondition" });

/**
 * @author MHe 
 * 
 * {
 *   "objId": "4711"
 *   "condition" : {"field:"{"type": "GRP", "key": "INVOICE_STATUS"}, "isKWL": true , "allowed": ["5"]}
 * }
 * 
 */
sol.define("sol.datev.accounting.ix.functions.CheckStatusPreCondition", {
  extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.datev.accounting.mixins.ApiRequest",
        "sol.datev.accounting.mixins.Configuration",
        "sol.datev.accounting.mixins.LocalizedKwlList"
    ],

    inject: {
        api: { config: "api", prop: "api", template: false }
    },



  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   */
  process: function () {
    var me = this, sord, statusValue, allowedValues, ixConnect = me.getIxConnection();
    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbLean, LockC.NO);


    statusValue = sol.common.SordUtils.getValue(sord, me.condition.field);


    if (me.condition.isKwl){
        statusValue = me.getLocalizedKey(statusValue);
    } 

    me.logger.info(["current status is {0}", statusValue]);

    return {
      valid: me.isAllowed(statusValue)
    }

  },

  getIxConnection: function(){
      return (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;
  },

  isAllowed: function(statusValue){
    var me = this, values = me.condition.values; valid = false;
   
    if (!sol.common.ObjectUtils.isArray(values)){
        values = [values];
    }

    var result = sol.common.ObjectUtils.arrayFind(values, function(value, index){
        return String(value) === statusValue
    });

    valid = result !== undefined
    return me.condition.whitelist ? valid : !valid
  }

  
});


/**
 * @member
 * @method
 * @static
 */
function RF_sol_accounting_function_CheckPostingProposalPreCondition(ec, args) {
  var me = this, params, preConditionObj, selectedObjIds, result = {valid: true};
  logger.enter("RF_sol_accounting_function_CheckPostingProposalPreCondition", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "targetId");

  params.condition = {
    field: {
      type: "GRP",
      key: "INVOICE_STATUS"
    },
    isKwl: true,
    values: [5],
    whitelist: true
  }

  selectedObjIds = params.targetId;
  if (!sol.common.ObjectUtils.isArray(selectedObjIds)){
    me.logger.info("single selection of {0}", params.targetId);
    selectedObjIds = [params.targetId];
  }


  for (var i = 0; i < selectedObjIds.length; ++i){
      params.objId = selectedObjIds[i];
      preConditionObj = sol.create("sol.datev.accounting.ix.functions.CheckStatusPreCondition", params);
      result.valid = result.valid && preConditionObj.process().valid
      me.logger.info(JSON.stringify(result));
  }


  if (!result.valid){
    result.msg =  sol.common.TranslateTerms.getTerm(ec.ci, "sol.datev.accounting.postingproposal.wrongStatus");
  }

  logger.exit("RF_sol_accounting_function_CheckPostingProposalPreCondition", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member
 * @method
 * @static
 */
function RF_sol_accounting_function_CheckLockPreCondition(ec, args) {
  var me = this, params, preConditionObj, result;
  logger.enter("RF_sol_accounting_function_CheckPostingProposalPreCondition", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "targetId");

  params.condition = {
    field: {
      type: "GRP",
      key: "INVOICE_STATUS"
    },
    isKwl: true,
    values: [5,6,7,9],
    whitelist: false
  }

  params.objId = params.targetId;
  preConditionObj = sol.create("sol.datev.accounting.ix.functions.CheckStatusPreCondition", params);
  result = preConditionObj.process()
  
  if (!result.valid){
    result.msg =  sol.common.TranslateTerms.getTerm(ec.ci, "sol.datev.accounting.lock.notAllowed");
  }

  logger.exit("RF_sol_accounting_function_CheckPostingProposalPreCondition", result);
  return sol.common.JsonUtils.stringifyAll(result);
}



