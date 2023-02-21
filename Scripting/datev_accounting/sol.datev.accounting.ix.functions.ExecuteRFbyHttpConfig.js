
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
//@include lib_sol.common.Template.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.HttpUtils.js
//@include lib_sol.common.ix.FunctionBase.js


var logger = sol.create("sol.Logger", { scope: "sol.datev.accounting.ix.functions.ExecuteRFbyHttpConfig" });

sol.define("sol.datev.accounting.ix.functions.ExecuteRFbyHttpConfig", {
  extend: "sol.common.ix.FunctionBase",

  required: ["endpoint"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   */
  process: function () {
    var me = this, resp, content;

    resp = sol.common.HttpUtils.sendRequest({
        url: me.endpoint,
        method: 'get',
        contentType: 'application/json;charset=UTF-8',
        params: {
            INVOICE_TYPE: "IN"
        }
    });

    if (resp && resp.responseOk &&resp.responseCode === 200){
        content = JSON.parse(resp.content);

        me.logger.info(["objId={1}, content={0}, ", me.objId, JSON.stringify(content)]);

        if (content.function){
            me.logger.info(["before: execution function={0}, config={1}", content.function, content.params]);

            /*var rfParams = sol.common.TemplateUtils.render(content.params, {
                sord: {
                    id: me.objId
                }
            });*/

            content.params.objId = content.params.objId || me.objId;
            sol.common.IxUtils.execute(content.function, content.params);
            me.logger.info(["success: execution function={0}, config={1}", content.function, content.params]);
        }
        return content;
    } else {
        me.logger.error(["respCode={0}, message={1}", resp.responseCode, resp.errorMessage]);
        return {
            code: resp.responseCode,
            message: resp.errorMessage
        }
    }
  }
});


/**
 * @member sol.invoice.ix.functions.ChangeUser
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
    var params, module;

    logger.enter("onExitNode_ExecuteRFbyHttpConfig", { flowId: wFDiagram.id, nodeId: nodeId });

    params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
    params.objId = wFDiagram.objId;
    params.flowId = wFDiagram.id;

    module = sol.create("sol.datev.accounting.ix.functions.ExecuteRFbyHttpConfig", params);

    module.process();

    logger.exit("onExitNode_CheckBusinessPartner");
}



/**
 * @member
 * @method
 * @static
 */
function RF_sol_datev_accounting_ExecuteRFByHttpConfig(ec, args) {
  var params, returnObj, result;
  logger.enter("RF_sol_datev_accounting_ExecuteRFByHttpConfig", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  returnObj = sol.create("sol.datev.accounting.ix.functions.ExecuteRFbyHttpConfig", params);
  result = returnObj.process();
  logger.exit("RF_sol_datev_accounting_ExecuteRFByHttpConfig", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
