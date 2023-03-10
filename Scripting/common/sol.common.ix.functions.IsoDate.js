
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.IsoDate" });

/**
 * Writes the current date as ISO date into a index field.
 *
 * Formats:
 *
 * - Standard: 'yyyyMMddHHmmss'
 * - Without time: 'yyyyMMdd'
 *
 * # As workflow node
 *
 * `ObjId` is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "group": "COMPLETED_DATE",
 *       "withoutTime": true
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the `objId` must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ix_IsoDate", {
 *       objId: "4711",
 *       group: "COMPLETED_DATE",
 *       withoutTime: true
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.SordUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.IsoDate", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "group"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

   /**
   * @cfg {String} group (required)
   * Group field to write the change to
   */

  /**
   * @cfg {Boolean} [withoutTime=false] (optional)
   * If `true`, the time will be omitted from the ISO string
   */
  withoutTime: false,

  /**
   * @private
   * @property {java.text.SimpleDateFormat} formatter
   */
  formatter: new java.text.SimpleDateFormat("yyyyMMddHHmmss"),

  /**
   * @private
   * @property {java.text.SimpleDateFormat} formatter
   */
  withoutTimeFormatter: new java.text.SimpleDateFormat("yyyyMMdd"),

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Sets the ISO date.
   */
  process: function () {
    var me = this,
        sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO),
        dateField = sol.common.SordUtils.getObjKey(sord, me.group),
        date = new Date(),
        isoString;

    if (me.withoutTime === true) {
      isoString = me.withoutTimeFormatter.format(date);
    } else {
      isoString = me.formatter.format(date);
    }

    if (dateField) {
      dateField.data = [isoString];
      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
      me.logger.info(["write ISO date to [objId='{0}', objKey='{1}']: {2}", me.objId, me.group, isoString]);
    }
  }
});


/**
 * @member sol.common.ix.functions.IsoDate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_IsoDate", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "group"),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.IsoDate", params);

  module.process();

  logger.exit("onEnterNode_IsoDate");
}


/**
 * @member sol.common.ix.functions.IsoDate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_IsoDate", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId, "group"),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.IsoDate", params);

  module.process();

  logger.exit("onExitNode_IsoDate");
}


/**
 * @member sol.common.ix.functions.IsoDate
 * @method RF_sol_function_IsoDate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_IsoDate(iXSEContext, args) {
  logger.enter("RF_sol_function_IsoDate", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "group"),
      module = sol.create("sol.common.ix.functions.IsoDate", params);

  module.process();

  logger.exit("RF_sol_function_IsoDate");
}
