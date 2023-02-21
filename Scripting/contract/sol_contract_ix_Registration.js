
//@include lib_Class.js
//@include lib_sol.common.ix.ServiceRegistry.js

/**
 * @class sol.contract.ix.Registration
 * Registers all services and configurations exposed by the contract solution.
 */

sol.common.ix.ServiceRegistry.register("RF_sol_contract_function_CreateContractHeadless", {
  type: sol.common.ix.ServiceRegistry.TYPES.SERVICE,
  name: "Create contracts",
  description: "Service to create contracts.",
  service: "RF_sol_contract_function_CreateContractHeadless",
  ns: "sol.contract",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.CREATE, sol.common.ix.ServiceRegistry.FUNCTIONS.IMPORT],
  soltypes: ["CONTRACT"],
  masks: ["Contract"],
  serviceParameters: [
    { key: "template.name", dataType: "string", mandatory: true, desc: "Defines the template used by the service to create the new contract." },
    { key: "sordMetadata", dataType: "object", mandatory: true, desc: "The metadata in form of a template sord to prefill the new contract" }
  ]
});

sol.common.ix.ServiceRegistry.register("contract_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Contract update registration",
  description: "Description of how the contract updates have to be registered.",
  cfg: {
    $config: "/contract/Configuration/contract.config",
    templateId: "{{config.workflows.updateContract.workflowTemplateName}}"
  },
  ns: "sol.contract",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["CONTRACT"]
});
