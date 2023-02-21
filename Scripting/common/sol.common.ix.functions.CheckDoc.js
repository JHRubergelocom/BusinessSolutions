
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.CheckDoc" });

/**
 * Checks the properties of a document, e.g. the extension
 *
 * # Example
 *
 *     {
 *       "checks": { "hasExtension": ["tiff", "tif", "pdf", "jpg", "jpeg"] },
 *       "containerMode": true,
 *       "wfStatus": { "onSuccess": "TRUE", "onFailure": "FALSE" }
 *     }
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CheckDoc", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["wfDiagram", "checks"],

  /**
   * @cfg {de.elo.ix.client.wfDiagram} wfDiagram (required)
   * The workflow which should be checked.
   */

  /**
   * @cfg {Object} checks
   * Checks
   */

  /**
   * @cfg {String[]} checks.extensions
   * Extensions
   */

  /**
   * @cfg {Boolean} containerMode
   * Container mode
   */

  /**
   * @cfg {Object} wfStatus
   *
   *     "wfStatus": { "onSuccess": "yaaay", "onFailure": "ohNooo" }
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

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Perform the checks.
   */
  process: function () {
    var me = this,
        result, status;

    me.sord = ixConnect.ix().checkoutSord(me.wfDiagram.objId, SordC.mbAllIndex, LockC.NO);
    result = me.check();

    if (result) {
      status = (me.wfStatus && me.wfStatus.onSuccess) ? me.wfStatus.onSuccess : me.DEFAULT_PASSED_STATUS;
    } else {
      status = (me.wfStatus && me.wfStatus.onFailure) ? me.wfStatus.onFailure : me.DEFAULT_FAILED_STATUS;
    }

    sol.common.WfUtils.setWorkflowStatus(me.wfDiagram, status);
  },

  check: function () {
    var me = this,
        sord, isFolder, extension, result;

    sord = ixConnect.ix().checkoutSord(me.wfDiagram.objId, SordC.mbAll, LockC.NO);
    isFolder = sol.common.SordUtils.isFolder(sord);
    if (isFolder) {
      sord = me.getFirstChildDocument(sord);
    }
    if (!sord || !sord.docVersion || !sord.docVersion.ext) {
      return false;
    }
    extension = (sord.docVersion.ext + "").toLowerCase();

    if (!me.checks || !me.checks.hasExtension) {
      return false;
    }

    me.checks.hasExtension = me.checks.hasExtension.map(function (ext) {
      return ext.toLowerCase();
    });

    result = (me.checks.hasExtension.indexOf(extension) > 0);

    return result;
  },

  getFirstChildDocument: function (sord) {
    var sords, firstChildDocument;

    sords = sol.common.RepoUtils.findChildren(sord.id, {
      includeDocuments: true,
      includeFolders: false
    });

    if (!sords || (sords.length < 1)) {
      return null;
    }

    firstChildDocument = sords[0];
    return firstChildDocument;
  }
});

/**
 * @member sol.common.ix.functions.CheckDoc
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_CheckDoc", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.wfDiagram = wfDiagram;

  module = sol.create("sol.common.ix.functions.CheckDoc", params);

  module.process();

  logger.exit("onExitNode_CheckDoc");
}
