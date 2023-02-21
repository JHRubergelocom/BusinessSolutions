

importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js

/**
 * 
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * 
 * 
 *
 * @eloix
 *
 */
 
/**
 * @cfg {objId} id (optional)
 * A single objId or guid.
 */

/**
 * @cfg {String[]} ids (optional)
 * An Array of objIds or guids passed as an object {id: 1234}.
 */
sol.define("sol.meeting.ix.functions.DeleteItem", {
  extend: "sol.common.ix.FunctionBase",
  
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.ids = me.ids || [];
    if (!sol.common.ObjectUtils.isArray(me.ids)) {
      throw Error("Items must be given as an array");
    }
    if (me.objId !== null && me.objId !== undefined && me.objId !== "") {
      me.ids.push({ id: me.objId });
    }
  },

  process: function () {
    var me = this, result = {};
    result.items = me.ids.map(function (item) {
      return me.deleteMeetingItem(item.id);
    });
    return result;
  },

  deleteMeetingItem: function (id) {
    var me = this;
    try {
      if (!me.isAgendaItem(id)) {
        throw Error("Selected item is not an agenda item");
      }
      sol.common.IxUtils.execute("RF_sol_function_Delete", {
        objId: id
      });
      return { objId: id, deleted: true };

    } catch (ex) {
      me.logger.warn(["Could not delete sord {0}", id], ex);
      return { objId: id, deleted: false };
    }
  },

  isAgendaItem: function (objId) {
    var solType, sord;
    sord = sol.common.RepoUtils.getSord(objId, { SordZ: SordC.mbObjKeys });
    solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");
    return (solType.indexOf("MEETING_ITEM") > -1 || solType == "STRUCTURAL_ITEM");
  }
});

/**
* @member sol.meeting.ix.functions.DeleteItem
* @method RF_sol_meeting_function_Item_Delete
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
*/
function RF_sol_meeting_function_Item_Delete(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      itemService = sol.create("sol.meeting.ix.functions.DeleteItem", rfParams),
      result = itemService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}