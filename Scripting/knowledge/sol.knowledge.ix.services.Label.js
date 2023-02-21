
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.LabelUtils.js


var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Label" });

/**
 * Provides service functions to manage label entries.
 *
 * # Select label
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Label_Select", {
 *             label: {
 *                 key: "ACCEPTED
 *             }});
 *
 * # Insert label
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Label_Insert", {
 *             label: {
 *                 key: "ACCEPTED,
 *                 locale: "sol.knowledge.ACCEPTED",
 *                 contentTypes: ["IDEA"],
 *                 color: "#F2F2F2"
 *             }});
 *
 * # Update label
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Label_Update", {
 *             label: {
 *                 key: "ACCEPTED,
 *                 locale: "sol.knowledge.ACCEPTED",
 *                 contentTypes: ["IDEA"],
 *                 color: "#F2F2F2"
 *             }});
 *
 * # Delete label
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Label_Delete", {
 *             label: {
 *                 key: "ACCEPTED
 *             }});
 *
 * # Get all labels
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Label_GetAll", {});
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.LabelUtils
 */
sol.define("sol.knowledge.ix.services.Label", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["label"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * @private
   * Select label.
   * @return {Object} Result check
   */
  select: function () {
    var me = this,
        label;

    label = sol.knowledge.ix.LabelUtils.selectLabelConfig(me.label);
    if (label.key) {
      return { success: true, label: label };
    }
    return { success: false };
  },

  /**
   * @private
   * Insert label.
   * @return {Object} Result check
   */
  insert: function () {
    var me = this;

    sol.knowledge.ix.LabelUtils.insertLabelConfig(me.label);
    return { success: true };
  },

  /**
   * @private
   * Update label.
   * @return {Object} Result check
   */
  update: function () {
    var me = this;

    sol.knowledge.ix.LabelUtils.updateLabelConfig(me.label);
    return { success: true };
  },

  /**
   * @private
   * Delete label.
   * @return {Object} Result check
   */
  delete: function () {
    var me = this;

    sol.knowledge.ix.LabelUtils.deleteLabelConfig(me.label);
    return { success: true };
  },

  /**
   * @private
   * Get all labels.
   * @return {Object} Result check
   */
  getAll: function () {
    var labels = [];

    labels = sol.knowledge.ix.LabelUtils.getLabels();
    if (labels.length > 0) {
      return { success: true, labels: labels };
    }
    return { success: false };
  }

});


/**
 * @member sol.knowledge.ix.services.Label
 * @method RF_sol_knowledge_service_Label_Select
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Label_Select(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Label_Select", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "label");
  service = sol.create("sol.knowledge.ix.services.Label", params);
  result = rfUtils.stringify(service.select());

  logger.exit("RF_sol_knowledge_service_Label_Select", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Label
 * @method RF_sol_knowledge_service_Label_Insert
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Label_Insert(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Label_Insert", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "label");
  service = sol.create("sol.knowledge.ix.services.Label", params);
  result = rfUtils.stringify(service.insert());

  logger.exit("RF_sol_knowledge_service_Label_Insert", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Label
 * @method RF_sol_knowledge_service_Label_Update
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Label_Update(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Label_Update", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "label");
  service = sol.create("sol.knowledge.ix.services.Label", params);
  result = rfUtils.stringify(service.update());

  logger.exit("RF_sol_knowledge_service_Label_Update", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Label
 * @method RF_sol_knowledge_service_Label_Delete
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Label_Delete(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Label_Delete", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "label");
  service = sol.create("sol.knowledge.ix.services.Label", params);
  result = rfUtils.stringify(service.delete());

  logger.exit("RF_sol_knowledge_service_Label_Delete", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Label
 * @method RF_sol_knowledge_service_Label_GetAll
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Label_GetAll(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_knowledge_service_Label_GetAll", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args);
  service = sol.create("sol.knowledge.ix.services.Label", params);
  result = rfUtils.stringify(service.getAll());

  logger.exit("RF_sol_knowledge_service_Label_GetAll", result);

  return result;
}
