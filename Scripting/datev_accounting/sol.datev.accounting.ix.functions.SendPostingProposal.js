importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js

// noinspection ES6ConvertVarToLetConst
var logger = sol.create("sol.Logger", { scope: "datev.invoice.ix.functions.PostingProposal" });

/**
 *
 *
 * @author MH, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.common.Config
 * @requires  sol.common.ix.FunctionBase
 *
 *
 *
 */
sol.define("datev.invoice.ix.functions.PostingProposal", {
  extend: "sol.common.ix.FunctionBase",

  required: ["sordIds", "currentUser"],

  mixins: ["sol.datev.accounting.mixins.ApiRequest", "sol.datev.accounting.mixins.Configuration"],

  inject: {
    api: { config: "api", prop: "api", template: false }
  },

  initialize: function (config) {
    // noinspection ES6ConvertVarToLetConst
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.logger.info(['sordIds={0}, currentUser={1}', me.sordIds, me.currentUser])
  },

  /**
     *
     */
  process: function () {
    var me = this, resp,
        requestUrl = this.getApiResourceUri(me.api, me.endpoints.postingProposal);


      me.logger.info(["service start: {0}", me.sordIds]);
      resp = me.postResourceByUrl(requestUrl, {
        encodeData: false,
        dataObj: {
          sordIds: me.sordIds,
          currentUser: me.currentUser
        }
      });

      if (resp.responseOk){
          if (resp.content.exceptionMessage){
             return {
               exceptionMessage: resp.content.exceptionMessage
             };
          }
          return resp;
      } else {
        me.logger.warn(["datev-connect request returned incomplete request: url={0}, responseCode={1}, errorMessage={2}", requestUrl, resp.responseCode || 'undefined' , resp.errorMessage.message]);
        return {
          exceptionMessage: String(resp.errorMessage.message || resp.errorMessage)
        };
      }
  }
});

/**
 *
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  // noinspection ES6ConvertVarToLetConst
  var params, module;

  logger.enter("onEnterNode_PostingProposal", { flowId: wFDiagram.id, nodeId: nodeId });
  
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;
  params.currentUser = '';
  if (ixConnect != null){
    params.currentUser = String(ixConnect.loginResult.user.name) || '';
  }

  if (!params.sordIds){
    logger.info(["use single objId, {0}", wFDiagram.objId]);
    params.sordIds = [String(wFDiagram.objId)];
  }


  module = sol.create("datev.invoice.ix.functions.PostingProposal", params);

  module.process();

  logger.exit("onEnterNode_PostingProposal");
}

function RF_datev_function_PostingProposal(ec, args) {
  var params, returnObj, result;
  logger.enter("RF_datev_function_PostingProposal", result);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  returnObj = sol.create("datev.invoice.ix.functions.PostingProposal", params);
  result = returnObj.process();
  logger.exit("RF_datev_function_PostingProposal", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

