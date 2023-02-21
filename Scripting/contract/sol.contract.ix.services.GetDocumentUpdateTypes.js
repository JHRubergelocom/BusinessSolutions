
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.contract.mixins.Configuration.js
//@include lib_sol.common.SordProvider.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.contract.ix.services.GetDocumentUpdateTypes" });

/**
 * Retrieves document update types.
 *
 * @author ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.contract.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.contract.ix.services.GetDocumentUpdateTypes", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.contract.mixins.Configuration", "sol.common.mixins.Inject"],

  requiredConfig: ["objId"],

  inject: {
    types: { config: "contract", prop: "clauses.types.updateTypes", template: true }
  },

  initialize: function (config) {
    var me = this;

    sol.create("sol.common.Injection").inject(me);
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        sord, solType, i, type;

    // Return a specific update type for a specific solution type, e.g. "CONTRACT_DOCUMENT_TEMPLATE"
    sord = sol.common.RepoUtils.getSord(me.objId);
    solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");

    me.logger.debug(["GetDocumentUpdateTypes: objId={0}, solType={1}", me.objId, solType]);

    for (i = 0; i < me.types.length; i++) {
      type = me.types[i];
      if (type.selectForSolType == solType) {
        return JSON.stringify([type]);
      }
    }

    return JSON.stringify(me.types);
  }
});

/**
 * @member sol.contract.ix.services.GetDocumentUpdateTypes
 * @method RF_sol_contract_service_GetDocumentUpdateTypes
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_contract_service_GetDocumentUpdateTypes(ec, args) {
  var params, module, result;

  logger.enter("RF_sol_contract_service_GetDocumentUpdateTypes", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  module = sol.create("sol.contract.ix.services.GetDocumentUpdateTypes", params);

  result = module.process();

  logger.exit("RF_sol_contract_service_GetDocumentUpdateTypes", result);

  return result;
}
