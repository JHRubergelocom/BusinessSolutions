
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Inherit" });

/**
 * This module handles the inheritance of index fields from the parent.
 *
 * The configuration, which fields should be inherited is done via {@link #fields}.
 * If inherited fields already have a value, they will not be overridden by default.
 * This behaviour can be altered via an `override` flag in each field configuration.
 * 
 * Without any fields-configuration the ELO standard mechanism for inheritance
 * will be triggered. The objId and it's children will be passed to the mechanism.
 * All fields will be inherited according to their mask field configuration.
 * You can wait until the inheritance is finished with the {@link #waitUntilFinished} parameter.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration should be applied to the comments field and would inherit the name of the parent,
 * the field 'MY_INHERITED' and the map field 'MY_INHERITED_MAP' (existing values will not be overridden).
 * Additionally the field MY_INHERITED_2 will be <i>inherited</i> from the field 'MY_OTHER' from the parent
 *
 *     {
 *       "fields": [
 *         { "type": "SORD", "key": "name" },
 *         { "type": "GRP", "key": "MY_INHERITED" },
 *         { "type": "MAP", "key": "MY_INHERITED_MAP" },
 *         { "type": "GRP", "key": "MY_INHERITED_2", "source": { "type": "GRP", "key": "MY_OTHER" } }
 *       ]
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 * The following example would inherit the field 'MY_INHERITED' from the parent and override an exiting value.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Inherit", {
 *       objId: "4711",
 *       fields: [
 *         { "type": "GRP", "key": "MY_INHERITED", "override": true }
 *       ]
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.003
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.ConfigMixin
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.AsyncUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.Inherit", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {Object[]} fields
   * Optional parameter. When empty we're using the server-side 
   * inheritKeywording feature to copy all inheritable fields
   * (as configured in the mask fields)
   * 
   * With this parameter you're independent of the mask configuration.
   * You can choose which fields should be inherited by defining them
   * in this parameter. 
   * 
   * Object containing the configuration for the inherited fields:
   *
   *     [
   *       { type: "SORD", key: "name" },
   *       { type: "GRP", key: "MY_FIELD", "override": true }
   *     ]
   *
   * Currently only "SORD" and "GRP" are supported as `type`.
   */

  /**
   * @cfg {Boolean} waitUntilFinished
   * This parameter only works when the fields parameter is empty
   * 
   * When true we're waiting for the inheritance to finish.
   * The inheritKeywording job is async when this parameter is false
   */

  waitUntilFinished: false,

  /**
   * @cfg {Integer} sleepTime
   * Miliseconds to wait between each check of the current
   * inheritance job state
   */
  sleepTime: 200,

  /**
   * @private
   * @property {de.elo.ix.client.Sord} sord
   */

  /**
   * @private
   * @property {de.elo.ix.client.Sord} parentSord
   */

  /**
   * @private
   * @property {Object[]} updates
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);

    me.logger.debug("initialize");

    if (me.fields) {
      me.sord = ixConnectAdmin.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.FORCE);
      me.parentSord = ixConnectAdmin.ix().checkoutSord(me.sord.parentId, SordC.mbAllIndex, LockC.NO);
      me.updates = [];
    } else {
      me.sleepTime = (sol.common.ObjectUtils.isNumber(config.sleepTime)) ? config.sleepTime : me.sleepTime;
    }
  },

  /**
   * This module handles inheritance of index fields from the parent.
   */
  process: function () {
    var me = this,
        mapitems, jobState;

    if (me.fields) {
      me.fields.forEach(me.inheritField, me);
      me.logger.info("initial inheritance values initialized");

      if (me.updates.length > 0) {
        mapitems = sol.common.SordUtils.updateSord(me.sord, me.updates);
        ixConnectAdmin.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.YES);
        if (mapitems && (mapitems.length > 0)) {
          ixConnectAdmin.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, mapitems, LockC.NO);
        }
      } else {
        ixConnectAdmin.ix().checkinSord(me.sord, SordC.mbOnlyUnlock, LockC.YES);
      }
    } else {
      jobState = me.startInheritKeywordingJob(me.objId);

      if (me.waitUntilFinished) {
        jobState = sol.common.AsyncUtils.waitForJob(jobState.getJobGuid(), { connection: ixConnectAdmin, interval: me.sleepTime });
      }
    }

    me.logger.info("initial inheritance successfull");
  },


  /**
   * @private
   * @param {String} objId Start ID for the processTree
  */
  startInheritKeywordingJob: function (startId) {
    var me = this, navInfo, procInfo;
    
    navInfo = new NavigationInfo();
    navInfo.startIDs = [startId];

    procInfo = new ProcessInfo();
    procInfo.desc = "sol.common.ix.functions.Inherit";
    procInfo.errorMode = ProcessInfoC.ERRORMODE_CRITICAL_ONLY;
    procInfo.procInheritKeywording = new ProcessInheritKeywording();
    
    me.logger.debug(["start copy process: startId={0}", startId]);
    return ixConnectAdmin.ix().processTrees(navInfo, procInfo);
  },

  /**
   * @private
   * @param {Object} cfg Configuration
   */
  inheritField: function (cfg) {
    var me = this,
        parentValue, targetValue, override;
    try {
      parentValue = sol.common.SordUtils.getValue(me.parentSord, (cfg.source) ? cfg.source : cfg);
      targetValue = sol.common.SordUtils.getValue(me.sord, cfg);
      override = (cfg.override === true) ? true : false;
      if (me.checkUpdate(parentValue, targetValue, override)) {
        cfg.value = parentValue;
        me.updates.push(cfg);
      }
    } catch (ex) {
      me.logger.error("error inheriting", ex);
    }
  },

  /**
   * @private
   * @param {String} parentValue Parent value
   * @param {String} targetValue Target value
   * @param {Boolean} override Override value
   * @return {String}
   */
  checkUpdate: function (parentValue, targetValue, override) {
    if (parentValue) {
      parentValue += "";
    }
    if (targetValue) {
      targetValue += "";
    }
    return (!targetValue || override) && (parentValue !== targetValue);
  }

});

/**
 * @member sol.common.ix.functions.Inherit
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(ci, userId, wfDiagram, nodeId) {
  var params, module;
  logger.enter("onEnterNode_Inherit", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;

  module = sol.create("sol.common.ix.functions.Inherit", params);
  module.process();

  logger.exit("onEnterNode_Inherit");
}

/**
 * @member sol.common.ix.functions.Inherit
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var params, module;
  logger.enter("onExitNode_Inherit", { flowId: wfDiagram.id, nodeId: nodeId });

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);
  params.objId = wfDiagram.objId;

  module = sol.create("sol.common.ix.functions.Inherit", params);
  module.process();

  logger.exit("onExitNode_Inherit");
}

/**
 * @member sol.common.ix.functions.Inherit
 * @method RF_sol_function_Inherit
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Inherit(ec, configAny) {
  var params, module;
  logger.enter("RF_sol_function_Inherit", configAny);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId");

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.common.ix.functions.Inherit", params);
  module.process();

  logger.exit("RF_sol_function_Inherit");
}
