
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckMandatoryFields" });

/**
 * Checks if all mandatory fields are set.
 *
 * When called as RF it just throws an exception when not all mandatory fields are properly set.
 *
 * When used in a workflow script, it either updates the ELO_WF_STATUS field as configured or throws an exception (in case the check fails).
 * If the `wfStatus` is configured, no exception will be thrown and instead the workflow status will be updated (either the the configured values or the defaults).
 *
 * # As workflow node
 *
 * `ObjId` is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "mandatory": [ { "key": "REFERENCE", "type": "GRP" } ],
 *       "wfStatus": { "onSuccess": "yaaay", "onFailure": "ohNooo" }
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the `objId` must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_CheckMandatoryFields", {
 *       objId: "4711",
 *       mandatory: [ { "key": "REFERENCE", "type": "GRP" } ],
 *       wfStatus: { "onSuccess": "yaaay", "onFailure": "ohNooo" }
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.SordUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CheckMandatoryFields", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "mandatory"],

  /**
   * @cfg {String} objId
   * The object which should be checked.
   */

  /**
   * @cfg {Array} mandatory
   * A list of mandatory fields. The objects need two properties: `key` and `type`.
   *
   *     "mandatory": [ { "key": "REFERENCE", "type": "GRP" } ],
   *
   * - `type`: This string can either be "GRP", "SORD", "MAP", or "WFMAP"
   * - `key`: This is, depending on the `type`, either an index field name, a map field, a workflow map field or a property name of de.elo.ix.client.Sord
   */

  /**
   * @cfg {Object} wfStatus
   *
   *     "wfStatus": { "onSuccess": "yaaay", "onFailure": "ohNooo" }
   *
   * This object can override the default workflow states which will be set after the check, if ths was used in a workflow node.
   * If the is `undefined`, the unction will throw an exception in case the checke fails.
   *
   * - `onSuccess`: set as ELO_WF_STATUS after a successfull check
   * - `onFailure`: set as ELO_WF_STATUS after a check failure
   */

  /**
   * @private
   * @property {String} [DEFAULT_PASSED_STATUS="PASSED"] Default workflow status in case of a successful check
   */
  DEFAULT_PASSED_STATUS: "PASSED",
  /**
   * @private
   * @property {String} [DEFAULT_FAILED_STATUS="FAILED"] Default workflow status in case of a check failure
   */
  DEFAULT_FAILED_STATUS: "FAILED",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Change the node user.
   */
  process: function () {
    var me = this,
        valid = me.checkMandatoryFields(),
        startNode, status;

    if (me.wfDiagram) {
      startNode = sol.common.WfUtils.getNode(me.wfDiagram, 0);
      if (valid) {
        status = (me.wfStatus && me.wfStatus.onSuccess) ? me.wfStatus.onSuccess : me.DEFAULT_PASSED_STATUS;
      } else {
        status = (me.wfStatus && me.wfStatus.onFailure) ? me.wfStatus.onFailure : me.DEFAULT_FAILED_STATUS;
      }
      startNode.yesNoCondition = status;
      me.logger.info(["changed ELO_WF_STATUS to '{0}' (objId={1}, flowId={2})", status, me.objId, me.wfDiagram.id]);
    }
  },

  /**
   * @private
   * @return {Boolean} status
   */
  checkMandatoryFields: function () {
    var me = this,
        sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO),
        invalid, error;

    me.logger.info(["start check: objId={0}", me.objId]);

    if (!Array.isArray(me.mandatory)) {
      throw "'mandatory' has to be an Array";
    }

    if (me.mandatory.length <= 0) {
      throw "'mandatory' attribute can not be empty";
    }

    invalid = me.mandatory.some(function (field) {
      var value, mapitems;

      if (!field.type || !field.key) {
        throw "invalid field declaration: " + JSON.stringify(field);
      }

      switch (field.type) {
        case "GRP":
          value = sol.common.SordUtils.getObjKeyValue(sord, field.key);
          if (me.isEmpty(value)) {
            error = "missing or empty objkey: '" + field.key + "'";
            return true;
          }
          break;
        case "SORD":
          value = sord[field.key];
          if (me.isEmpty(value)) {
            error = "invalid or empty sordkey: '" + field.key + "'";
            return true;
          }
          break;
        case "MAP":
          mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, sord.id, [field.key], LockC.NO).items;
          if (!mapitems || mapitems.length <= 0) {
            error = "invalid or empty mapkey: '" + field.key + "'";
            return true;
          }
          break;
        case "WFMAP":
          mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, sord.id, [field.key], LockC.NO).items;
          if (!mapitems || mapitems.length <= 0) {
            error = "invalid or empty wfmapkey: '" + field.key + "'";
            return true;
          }
          break;
        default:
          throw "unsuported type: '" + field.type + "'";
      }
      return false;
    });

    if (error) {
      me.logger.debug("error in check: ", error);
    }

    if ((!me.wfDiagram && invalid) || (me.wfDiagram && !me.wfStatus && invalid)) {
      throw error;
    }

    me.logger.info(["check finished: objId={0}; successful={1};", me.objId, !invalid]);

    return !invalid;
  },

  /**
   * @private
   * @param {String} str
   * @return {Boolean} status
   */
  isEmpty: function (str) {
    return !str || Packages.org.apache.commons.lang.StringUtils.isBlank(str);
  }
});


/**
 * @member sol.common.ix.functions.CheckMandatoryFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_CheckMandatoryFields", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "mandatory"),
      module;

  params.objId = wFDiagram.objId;
  params.wfDiagram = wFDiagram;
  module = sol.create("sol.common.ix.functions.CheckMandatoryFields", params);

  module.process();

  logger.exit("onEnterNode_CheckMandatoryFields");
}

/**
 * @member sol.common.ix.functions.CheckMandatoryFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_CheckMandatoryFields", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "mandatory"),
      module;

  params.objId = wFDiagram.objId;
  params.wfDiagram = wFDiagram;
  module = sol.create("sol.common.ix.functions.CheckMandatoryFields", params);

  module.process();

  logger.exit("onExitNode_CheckMandatoryFields");
}

/**
 * @member sol.common.ix.functions.CheckMandatoryFields
 * @method RF_sol_function_CheckMandatoryFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_CheckMandatoryFields(iXSEContext, args) {
  logger.enter("RF_sol_function_CheckMandatoryFields", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "mandatory"),
      module = sol.create("sol.common.ix.functions.CheckMandatoryFields", params);

  module.process();

  logger.exit("RF_sol_function_CheckMandatoryFields");
}
