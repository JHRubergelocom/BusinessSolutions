
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeColor" });

/**
 * Changes the color of an archive element.
 *
 * Additionally the old color can be saved to a map field, from where is can be restored later
 *
 *     { color: "red", save: "OLD_COLOR" }
 *     { color: "blue", restore: "OLD_COLOR" }
 *
 * `save` and `restore` are both optional, but if `restore` is defined, it always wins over `color`.
 * If there is no color found in the map field `OLD_COLOR` the `color` will be used as fallback.
 *
 * # As workflow node
 *
 * `ObjId` is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field.
 *
 *     {
 *       "color": "blue"
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ChangeColor", {
 *       objId: "4711",
 *       color: "blue"
 *     });
 *
 * @author Pascal Zipfel, ELO Digital Office GmbH
 * @version 1.06.000
 *
 * @eloix
 *
 * @requires  sol.Logger
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.ChangeColor", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {String} color Tries to find a color which was defined in ELO
   */

  /**
   * @cfg {String} save Saves the old color to a map field
   */

  /**
   * @cfg {String} restore Restores the old color from a map filed
   */

  /**
   * @private
   * @property {de.elo.ix.client.ColorData[]} colorCache
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  /**
   * Changes the color of the element.
   */
  process: function () {
    var me = this,
        sord, oldColorId, newColorId, lookupColor, lookedupColor;

    sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbMin, LockC.NO);
    oldColorId = sord.kind;
    newColorId = 0;
    lookupColor = me.restoreFromMap() || me.color;

    if (lookupColor) {
      lookedupColor = me.getColor(lookupColor);
      if (lookedupColor) {
        newColorId = lookedupColor.id;
      }
    }

    if (oldColorId != newColorId) {
      sord.kind = newColorId;
      ixConnect.ix().checkinSord(sord, SordC.mbMin, LockC.NO);
      me.logger.info(["changed object color from '{0}' to '{1}'", oldColorId, newColorId]);
    }

    me.saveToMap(me.getColor(oldColorId));
  },

  /**
   * @private
   * @return {de.elo.ix.client.ColorData[]} colorCache
   */
  getColors: function () {
    var me = this;
    if (!me.colorCache) {
      me.colorCache = ixConnect.ix().checkoutColors(LockC.NO);
    }
    return me.colorCache;
  },

  /**
   * @private
   * @param {String|Number} color Name or ID of the color
   * @return {de.elo.ix.client.ColorData}
   */
  getColor: function (color) {
    var me = this,
        colors = me.getColors(),
        ignoreCase = !!color.toUpperCase,
        result = null;
    colors.some(function (c) {
      var hit = ((c.id == color) || ((ignoreCase) ? (c.name.toUpperCase() == color.toUpperCase()) : (c.name == color)));
      if (hit) {
        result = c;
      }
      return hit;
    });
    return result;
  },

  /**
   * @private
   * @return {String}
   */
  restoreFromMap: function () {
    var me = this,
        color = null,
        mapdata;
    if (me.restore) {
      try {
        mapdata = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [me.restore], LockC.NO);
        if (!mapdata || !mapdata.items || (mapdata.items.length <= 0)) {
          throw "no map entry found";
        }
        color = mapdata.items[0].value;
        me.logger.debug(["restore color '{0}' from map", color]);
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, [new KeyValue(me.restore, null)], LockC.NO);
      } catch (ex) {
        me.logger.warn(["could not restore color from map field '{0}'", me.restore], ex);
      }
    }
    return color;
  },

  /**
   * @private
   * @param {String} color
   */
  saveToMap: function (color) {
    var me = this;
    if (me.save && color) {
      try {
        ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, [new KeyValue(me.save, color.name)], LockC.NO);
        me.logger.debug(["saved color to map field '{0}' -> '{1}'", color, me.save]);
      } catch (ex) {
        me.logger.warn(["could not save color to map field '{0}'", me.restore], ex);
      }
    }
  }
});


/**
 * @member sol.common.ix.functions.ChangeColor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_ChangeColor", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.ChangeColor", params);

  module.process();

  logger.exit("onEnterNode_ChangeColor");
}


/**
 * @member sol.common.ix.functions.ChangeColor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_ChangeColor", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  module = sol.create("sol.common.ix.functions.ChangeColor", params);

  module.process();

  logger.exit("onExitNode_ChangeColor");
}


/**
 * @member sol.common.ix.functions.ChangeColor
 * @method RF_sol_function_ChangeColor
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_ChangeColor(iXSEContext, args) {
  logger.enter("RF_sol_function_ChangeColor", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      module = sol.create("sol.common.ix.functions.ChangeColor", params);

  module.process();

  logger.exit("RF_sol_function_ChangeColor");
}

