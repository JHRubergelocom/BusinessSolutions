
//@include lib_Class.js
//@include lib_sol.common.ix.ServiceRegistry.js

/**
 * @class sol.visitor.ix.Registration
 * Registers all services and configurations exposed by the visitor solution.
 */

sol.common.ix.ServiceRegistry.register("visitor_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Visitor update registration",
  description: "Description of how the visitor updates have to be registered.",
  cfg: {
    $config: "/visitor/Configuration/visitor.config",
    templateId: "{{config.visitor.requestWorkflows.updateVisitor.workflowTemplateName}}"
  },
  ns: "sol.visitor",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["VISITOR", "VISITOR_GROUP"]
});

sol.common.ix.ServiceRegistry.register("longtermbadge_update_registration_config", {
  type: sol.common.ix.ServiceRegistry.TYPES.CONFIG,
  name: "Long-term badge update registration",
  description: "Description of how the long-term badge updates have to be registered.",
  cfg: {
    $config: "/visitor/Configuration/visitor.config",
    templateId: "{{config.visitor.requestWorkflows.updateLongtermbadge.workflowTemplateName}}"
  },
  ns: "sol.visitor",
  functions: [sol.common.ix.ServiceRegistry.FUNCTIONS.REGISTER_UPDATE],
  soltypes: ["LONG_TERM_BADGE"]
});
