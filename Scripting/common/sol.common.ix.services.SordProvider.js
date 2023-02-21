//@include lib_sol.common.SordProvider.js
//@include lib_sol.common.ix.RfUtils.js

/**
 * @member sol.common.SordProvider
 * @method RF_sol_common_service_SordProvider
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_SordProvider(iXSEContext, args) {
  var result, logger = sol.create("sol.Logger", { scope: "sol.common.SordProvider" });
  logger.enter("RF_sol_common_service_SordProvider");

  result = JSON.stringify(
    sol.common.SordProviderUtils.run(
      sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      { copy: false }
    )
  );
  logger.exit("RF_sol_common_service_SordProvider");
  return result;
}