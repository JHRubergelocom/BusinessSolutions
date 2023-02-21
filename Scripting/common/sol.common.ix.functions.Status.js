
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Status" });

/**
 * Writes a status into a index field, either directly or tries to read it from a keyword list.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 *
 * Following configuration should be applied to the 'script properties' field for a status update:
 *
 *     {
 *       "group": "MY_INDEX_FIELD",
 *       "status": "DONE"
 *     }
 *
 * Following configuration should be applied to the 'script properties' field and will load a status from the fields KWL staring with '3'
 *
 *     {
 *       "group": "MY_INDEX_FIELD_WITH_ELO_KWL",
 *       "status": "3",
 *       "useKwl": true
 *     }
 *
 * Following configuration will load a status from the fields dynamic KWL staring with 'M' (e.g. M - month) from a localized dynamic KWL
 *
 *     {
 *       "group": "REMINDER_PERIOD_UNIT",
 *       "status": "M",
 *       "useDynKwl": true,
 *       "dynKwlCfg": {
 *         "returnColumn": 2,
 *         "filterColumn": 0
 *       }
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute('RF_sol_function_Status', {
 *       objId: "4711",
 *       group: "MY_INDEX_FIELD_WITH_ELO_KWL",
 *       status: "3",
 *       useKwl: true
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.06.000
 *
 * @eloix
 * @requires sol.Logger
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Status", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "group", "status"],

  /**
   * @cfg {string} group (required)
   * group field to write the change to
   */
  group: undefined,

  /**
   * @cfg {string} status (required)
   * If neither `useKwl` nor `useDynKwl` is defined, this value will be written to the group field.
   * If one of both is defined though, this will be used as a 'startsWith' filter on the KWL entries.
   */
  status: undefined,

  /**
   * @cfg {Boolean} [useTemplating=false] (optional)
   * If specified, the {@link #status} will be handled as a handlebars string (see {@link sol.common.Template} for more information).
   * The templating will be processed before any further executions (like `useKwl` or `useDynKwl`).
   * The template has access to at least the current sord:
   *
   *     { "group": "INVOICE_STATUS", "useTemplating": true, "status": "OPEN_{{sord.objKeys.INVOICE_TYPE}}" }
   *     { "group": "INVOICE_NUMBER", "useTemplating": true, "status": "{{count 'MY_INVOICE_COUNTER'}}" }
   *
   */
  useTemplating: undefined,

  /**
   * @cfg {Boolean} [useKwl=false] (optional)
   * If specified, the script reads the KWL from group field and retrieves keyword starting with status
   */
  useKwl: undefined,

  /**
   * @cfg {Boolean} [useDynKwl=false] (optional)
   * If specified, the script reads the KWL from group field and retrieves keyword starting with status
   */
  useDynKwl: undefined,

  /**
   * @cfg {Object} dynKwlCfg (optional)
   * @cfg {Object} dynKwlCfg.returnColumn (optional)
   * @cfg {Object} dynKwlCfg.filterColumn (optional)
   * Additional configuration for dynamic KWL queries (see {@link sol.common.SordUtils#getDynamicKeywordlistValue})
   */
  dynKwlCfg: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Sets the status.
   */
  process: function () {
    var me = this,
        conn, sord, statusKey, newStatus, oldStatus;

    conn = (typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect;

    sord = conn.ix().checkoutSord(me.objId, SordC.mbLean, LockC.NO);
    statusKey = sol.common.SordUtils.getObjKey(sord, me.group);
    newStatus = me.getStatus(sord);

    if (me.useKwl) {
      newStatus = me.getStatusFromKwl(newStatus, me.group);
    } else if (me.useDynKwl) {
      newStatus = me.getStatusFromDynKwl(sord.maskName, newStatus, me.group, me.dynKwlCfg);
    }

    if (statusKey) {
      oldStatus = statusKey.data[0] || "";
      statusKey.data = [newStatus];
      conn.ix().checkinSord(sord, SordC.mbLean, LockC.NO);
      me.logger.info(["changed '{0}' status from '{1}' to '{2}'", me.group, oldStatus, newStatus]);
    }
  },

  /**
   * @private
   * Retrieves the status. If `useTemplating===true` it will apply handlebars using the current sord as data.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String}
   */
  getStatus: function (sord) {
    var me = this,
        status = me.status;

    if (me.useTemplating === true) {
      status = sol.create("sol.common.Template", { source: status }).applySord(sord);
    }

    return status;
  },

  /**
   * @private
   * Retrieves a status string from the keyword list of the spezified field.
   * It checks, if one of the entries in the keyword list starts with the statusPrefix.
   * @param {String} statusPrefix
   * @param {String} field
   * @return {String} The found item from the keyword list or the statusPrefix, if nothing was found
   */
  getStatusFromKwl: function (statusPrefix, field) {
    var kwl = ixConnect.ix().checkoutKeywordList(field, KeywordC.mbView, 30, LockC.NO),
        items, i, item;

    if (kwl) {
      items = kwl.children;
      for (i = 0; i < items.length; i++) {
        item = items[i].text;
        if (item.startsWith(statusPrefix)) {
          return item;
        }
      }
    } else {
      this.logger.warn(["no keywordlist for field '{0}'", field]);
    }

    this.logger.warn(["no keywordlist match for: '{0}'", statusPrefix]);
    return statusPrefix;
  },

  /**
   * @private
   * Retrieves a status string from the dynamic keyword list of the spezified field.
   * It checks, if one of the entries in the keyword list starts with the statusPrefix.
   * @param {String} maskName
   * @param {String} statusPrefix
   * @param {String} field
   * @param {Object} cfg
   * @return {String} The found item from the keyword list or the statusPrefix, if nothing was found
   */
  getStatusFromDynKwl: function (maskName, statusPrefix, field, cfg) {
    var params = { data: statusPrefix },
        result;

    if (cfg) {
      params.returnColumn = cfg.returnColumn;
      params.filterColumn = cfg.filterColumn;
    }

    result = sol.common.SordUtils.getDynamicKeywordlistValue(maskName, field, params);

    if (result.length <= 0) {
      this.logger.warn(["no keywordlist match for: '{0}'", statusPrefix]);
    } else if (result.length > 1) {
      this.logger.warn(["no unique keywordlist match for: '{0}'", statusPrefix]);
    } else {
      statusPrefix = result[0];
    }

    return statusPrefix;
  }

});


/**
 * @member sol.common.ix.functions.Status
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;
  logger.enter("onEnterNode_Status", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "group", "status");
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Status", params);
  module.process();

  logger.exit("onEnterNode_Status");
}


/**
 * @member sol.common.ix.functions.Status
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;
  logger.enter("onExitNode_Status", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "group", "status");
  params.objId = wFDiagram.objId;

  module = sol.create("sol.common.ix.functions.Status", params);
  module.process();

  logger.exit("onExitNode_Status");
}


/**
 * @member sol.common.ix.functions.Status
 * @method RF_sol_function_Status
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Status(iXSEContext, args) {
  var params, module;
  logger.enter("RF_sol_function_Status", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "group", "status");
  module = sol.create("sol.common.ix.functions.Status", params);

  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, params);

  module.process();

  logger.exit("RF_sol_function_Status");
}
