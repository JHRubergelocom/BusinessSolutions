
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceRegistry.js


/**
 * @member sol.common.ix.ServiceRegistry
 * @method RF_sol_common_service_ServiceRegistry_Query
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_ServiceRegistry_Query(ec, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.common.ix.ServiceRegistry" }),
      params, resultObj, result;

  logger.enter("RF_sol_common_service_ServiceRegistry_Query");

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  if (params.serviceId) {
    resultObj = sol.common.ix.ServiceRegistry.get(params.serviceId, params);
  } else {
    resultObj = sol.common.ix.ServiceRegistry.query(params.query, params);
  }

  result = JSON.stringify(resultObj);

  logger.exit("RF_sol_common_service_ServiceRegistry_Query");

  return result;
}
