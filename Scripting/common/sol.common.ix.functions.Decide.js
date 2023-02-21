
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Decide" });

/**
 * Makes a decision on field values by regular expressions and sets the workflow status
 *
 * # Example
 *
 *     {
 *       "checks": [
 *         { "type": "GRP", "key": "PROJECT_NO", "regex": "^AB(\\d+)$", "writeMatches": [{ "type": "GRP", "key": "COMPANY_NAME" }] },
 *         { "type": "GRP", "key": "PROJECT_NAME", "regex": "My(Project)", "writeMatches": [{ "type": "GRP", "key": "VENDOR_NAME" }] }
 *       ],
 *       "trueStatus": "TRUE",
 *       "falseStatus": "FALSE"
 *     }
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Decide", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram", "nodeId", "checks"],

  /**
   * @cfg {de.elo.ix.client.wfDiagram} wfDiagram (required)
   * The workflow which should be checked.
   */

  /**
   * @cfg {String} [trueStatus=TRUE]
   * Status value for ´true´
   */

  /**
   * @cfg {String} [falseStatus=FALSE]
   * Status value for ´false´
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Perform the checks.
   */
  process: function () {
    var me = this,
        decision, statusValue;

    me.sord = ixConnect.ix().checkoutSord(me.wfDiagram.objId, SordC.mbAllIndex, LockC.NO);
    decision = me.checkAndWrite();

    me.trueStatus = me.trueStatus || "TRUE";
    me.falseStatus = me.falseStatus || "FALSE";

    statusValue = decision ? me.trueStatus : me.falseStatus;

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, statusValue);
  },

  checkAndWrite: function () {
    var me = this,
        updates = [],
        result = true,
        i, j, singleCheck, value, regExp, matches, match, mapEntries,
        fieldDefIndex, fieldDefRef, fieldDef;

    for (i = 0; i < me.checks.length; i++) {
      singleCheck = me.checks[i];
      if ((singleCheck.type == "WFMAP") && me.flowId) {
        value = String(sol.common.WfUtils.getWfMapValue(me.flowId, singleCheck.key) || "");
      } else {
        value = String(sol.common.SordUtils.getValue(me.sord, singleCheck) || "");
      }
      if (!value && !(me.checkEmptyValues === true)) {
        me.logger.debug(["Check: Field is emtpy: type={0}, key={1}", singleCheck.type, singleCheck.key]);
        result = false;
        break;
      }

      regExp = new RegExp(singleCheck.regex);
      matches = value.match(regExp);

      if (!matches || (matches.length == 0)) {
        me.logger.debug(["Check: Field value doesn't match: type={0}, key={1}, value={2}, regex={3}", singleCheck.type, singleCheck.key, value, singleCheck.regex]);
        result = false;
        break;
      }

      if (singleCheck.writeMatches) {

        for (j = 1; j < matches.length; j++) {
          match = matches[j];
          fieldDefIndex = j - 1;
          fieldDefRef = singleCheck.writeMatches[fieldDefIndex];
          if (fieldDefRef) {
            fieldDef = sol.common.ObjectUtils.clone(fieldDefRef);
            fieldDef.value = match;
            me.logger.debug(["Write match to field: {0}", JSON.stringify(fieldDef)]);
            updates.push(fieldDef);
          }
        }
      }
    }

    if (updates.length > 0) {
      mapEntries = sol.common.SordUtils.updateSord(me.sord, updates);
      ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
      if (mapEntries) {
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sord.id, me.sord.id, mapEntries, LockC.NO);
      }
    }

    me.logger.debug("Check: All fields match");
    return result;
  }
});

/**
 * @member sol.common.ix.functions.Decide
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Decide", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;
  module = sol.create("sol.common.ix.functions.Decide", params);

  module.process();

  logger.exit("onExitNode_Decide");
}
