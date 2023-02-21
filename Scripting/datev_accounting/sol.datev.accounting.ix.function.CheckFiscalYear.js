importPackage(Packages.de.elo.ix.client);
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectFormatter.js

//@include lib_sol.datev.accounting.mixins.ApiRequest.js
//@include lib_sol.datev.accounting.mixins.Configuration.js
//@include lib_sol.datev.accounting.mixins.LocalizedKwlList.js

//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ix.DynKwlUtils.js

var logger = sol.create("sol.Logger", {
  scope: "sol.datev.accounting.ix.functions.CheckFiscalYear",
});

/**
 * Retrieve fiscal year object from elo integration for DATEV service bypassing the current invoice date.
 *
 * The logic to select the correct fiscal year is already implemented in the service API.
 * It returns a fiscal year object with some additional information.
 * Several data will be written to the current sord object when fiscal year information was found by the invoice date:
 *
 *  ACCOUNTING_DATEV_FISCALYEAR
 *  ACCOUNTING_DATEV_IS_USING_DELIVERY_DATE
 *
 *  Other information will be skipped by default.
 *  If there is no matching fiscal year by invoice date process will be skipped and nothing happens. Fields are still empty and should be filled manually by a user.
 *
 * # As workflow node
 * ObjId is set based on the element that the workflow is attached to.
 * No further configuration is needed.
 *
 *     {}
 * 
 * @author MHe, ELO Digital Office GmbH
 * @eloix
 * 
 * @version 1.0
 * 
 * @requires  sol.common.Config
 * @requires  sol.common.SordUtils
 * @requires  sol.common.Map
 * @requires  sol.common.WfUtils
 * @requires  sol.common.IxUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.ix.FunctionBase
 * @requires  sol.common.ix.DynKwlUtils
 * @requires  sol.datev.accounting.mixins.ApiRequest
 * @requires  sol.datev.accounting.mixins.Configuration
 * @requires  sol.datev.accounting.mixins.LocalizedKwlList
 * 
 * 
 */
sol.define("sol.datev.accounting.ix.function.CheckFiscalYear", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
    "sol.datev.accounting.mixins.ApiRequest",
    "sol.datev.accounting.mixins.Configuration",
    "sol.datev.accounting.mixins.LocalizedKwlList",
  ],

  inject: {
    api: { config: "api", prop: "api", template: false },
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.fields = {
      INVOICE_DATE: "INVOICE_DATE",
      CLIENT_ID: "COMPANY_CODE",
      FISCALYEAR: "ACCOUNTING_DATEV_FISCALYEAR",
      IS_USING_DELIVERY_DATE: "ACCOUNTING_DATEV_IS_USING_DELIVERY_DATE",
    };
  },

  /**
   * Call ELO Integration for DATEV service and retrieve fiscal year by an passing date
   */
  process: function () {
    var me = this,
      sordData,
      resp,
      content,
      resolvedRequestUrl;

    sordData = me.getTemplateSord().sord;

    resolvedRequestUrl = me.resolveUrl(
      me.getApiResourceUri(me.api, me.endpoints.fiscalYear),
      { sord: sordData }
    );

    resp = me.getResourceByUrl(resolvedRequestUrl);

    if (!resp) {
      me.logger.error(["response is undefined, url={0}", resolvedRequestUrl]);
      return;
    }

    if (resp.responseOk) {
      me.logger.info([
        "Found FiscalYear. Request Url={0}, content={1}",
        resolvedRequestUrl,
        resp.content + "",
      ]);
      content = resp.content;
      if (me.sord) {
        me.logger.info(["found fiscalYear={0}", content]);

        me.executeSet([
          me.provideFiscalYear(content),
          me.provideIsUsingDeliveryDate(content),
        ]);
      } else {
        me.logger.warn("sord is undefined. Could not write fiscalyear to sord");
      }

      return {
        message: "FiscalYear was found",
        data: sordData,
        resp: resp,
      };
    }

    if (resp.responseCode === 404) {
      me.logger.info([
        "FiscalYear wasn't found for datev client={0} with invoicedate={1}",
        sordData.objKeys[me.fields.CLIENT_ID],
        sordData.objKeys[me.fields.INVOICE_DATE],
      ]);
      return {
        message: "FiscalYear wasn't found",
        data: sordData,
        resp: resp,
      };
    } else {
      me.logger.warn([
        "response of {0}, responseCode={1}, errorMessage={2}",
        resolvedRequestUrl,
        resp.responseCode,
        resp.errorMessage,
      ]);
    }
  },

  /**
   * Provide an elo field configuration for index field 'fiscal year'
   */
  provideFiscalYear: function (fiscalYear) {
    var me = this;
    return { type: "GRP", key: me.fields.FISCALYEAR, value: fiscalYear.id };
  },

  provideIsUsingDeliveryDate: function (fiscalYear) {
    var me = this;
    me.logger.info("provideIsUsingDeliveryDate", JSON.stringify(fiscalYear));
    return {
      type: "MAP",
      key: me.fields.IS_USING_DELIVERY_DATE,
      value: +fiscalYear.usingDeliveryDate || 0,
    };
  },

  /**
   * @private
   */
  executeSet: function (config) {
    var me = this,
      setConfig;
    me.logger.info("executeSet", JSON.stringify(config));
    setConfig = {
      objId: me.objId,
      entries: config,
    };
    sol.common.IxUtils.execute("RF_sol_function_Set", setConfig);
  },

  /**
   * @private
   */
  getTemplateSord: function () {
    var me = this,
      sord,
      data;

    try {
      sord = sol.common.RepoUtils.getSord(me.objId);
      data = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: sord,
          config: {
            mapKeys: me.mapKeys,
            objKeys: me.objKeys,
          },
        },
      });

      me.sord = sord;
      return data;
    } catch (ex) {
      me.logger.error(["Couldn't checkout sord objId={0}", me.objId], ex);
      throw ex;
    }
  },
});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  // noinspection ES6ConvertVarToLetConst
  var params, module;

  logger.enter("onExitNode_CheckFiscalYear", {
    flowId: wFDiagram.id,
    nodeId: nodeId,
  });

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = wFDiagram.objId;
  params.flowId = wFDiagram.id;

  module = sol.create(
    "sol.datev.accounting.ix.function.CheckFiscalYear",
    params
  );

  module.process();

  logger.exit("onExitNode_CheckFiscalYear");
}

/**
 * @member
 * @method
 * @static
 */
function RF_sol_accounting_function_CheckFiscalYear(ec, args) {
  var params, returnObj, result;
  logger.enter("RF_sol_accounting_function_CheckFiscalYear", args);
  params = sol.common.ix.RfUtils.parseAndCheckParams(
    ec,
    arguments.callee.name,
    args
  );
  returnObj = sol.create(
    "sol.datev.accounting.ix.function.CheckFiscalYear",
    params
  );
  result = returnObj.process();
  logger.exit("RF_sol_accounting_function_CheckFiscalYear", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
