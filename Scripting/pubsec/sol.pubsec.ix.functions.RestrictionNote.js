
//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.pubsec.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.pubsec.ix.functions.RestrictionNote" });

/**
 * 
 * # Configuration
 *
 * |Property|Description|
 * |:------|:------|
 * |fields.restrictionNoteDescription||
 * |mapFields.restrictionNoteDescription||
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ix.FunctionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.ix.functions.RestrictionNote", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["ci", "objId"],
  
  /** 
   * @cfg {de.elo.ix.client.ClientInfo} ci (required)
   */
  
  /**
   * @cfg {String} objId ObjId of the process (required)
   */

  /**
   * @cfg {Boolean} [reset=false] (optional)
   */
   
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();
  },

  process: function () {
    var me = this,
        sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO),
        restrictionNote;
    
    if (me.reset === true) {
      sol.common.SordUtils.setObjKeyValue(sord, me.config.fields.restrictionNoteDescription, "");
      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
      me.setDescription();
    } else {
      restrictionNote = sol.common.SordUtils.getObjKeyValue(sord, me.config.fields.restrictionNoteDescription);
      // restrictionDesc = me.getDescription();
      if (sol.common.StringUtils.isBlank(restrictionNote)) {
        throw sol.common.TranslateTerms.getTerm(me.ci, "sol.pubsec.ix.actions.RestrictionNote.error.mandatory");
      }
    }
  },
  
  getDescription: function () {
    var me = this,
        mapdata = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [me.config.mapFields.restrictionNoteDescription], LockC.NO);
    return (mapdata && mapdata.items && (mapdata.items.length > 0)) ? mapdata.items[0].value : null;
  },
  
  setDescription: function (desc) {
    var me = this,
        mapkey = new KeyValue(me.config.mapFields.restrictionNoteDescription, null);
    if (desc) {
      mapkey.value = desc;
    }
    ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, [mapkey], LockC.NO);
  }
  
});

/**
 * @member sol.pubsec.ix.functions.RestrictionNote
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_RestrictionNote", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  params.ci = clInfo;
  module = sol.create("sol.pubsec.ix.functions.RestrictionNote", params);
  module.process();
  logger.exit("onEnterNode_RestrictionNote");
}

/**
 * @member sol.pubsec.ix.functions.RestrictionNote
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_RestrictionNote", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  params.objId = wFDiagram.objId;
  params.ci = clInfo;
  module = sol.create("sol.pubsec.ix.functions.RestrictionNote", params);
  module.process();
  logger.exit("onExitNode_RestrictionNote");
}
