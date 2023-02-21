
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.RemoveAcl" });

/**
 * Removes ACL from a folder.
 *
 * The function can be configured which access rights of which users should be removed.
 * The default would be, that all access rights (except read) will be removed for all existing ACL entries.
 *
 * In addition the original ACL entries can be stored (backed up) to a map field.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following configuration would remove all access right (except read) for all existing ACL entries on the element and all sub elements.
 * The previous ACL entries will be saved to a map field (on each processed object).
 *
 *     {
 *       "mapKey": "ACL_BACKUP",
 *       "recursive": true
 *     }
 *
 * # As IX function call
 *
 * The following call would remove all access rights for the two users Paul and George (including the 'changePermissions' right since ELO12) just for the object itself. The previous ACL entries will be saved to a map field.
 *
 *     sol.common.IxUtils.execute('RF_sol_function_RemoveAcl', {
 *       objId: "4711",
 *       mapKey: 'PREVIOUS_ACL',     //optional
 *       users: ["paul", "george"],  //optional
 *       recursive: false,           //optional
 *       removeRead: true,           //optional
 *       removeWrite: true,          //optional
 *       removeDelete: true,         //optional
 *       removeEdit: true,           //optional
 *       removeList: true,           //optional
 *       removePermission: true,     //optional
 *       asAdmin: true               //optional
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.RemoveAcl", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} objId (required)
   * ObjectId of folder structure
   */

  /**
   * @cfg {String} mapKey (optional)
   * Name of Mapfield to store removed ACL when set
   */

  /**
   * @cfg {String[]} users (optional)
   * Group and/or user names of which the ACL should be removed. If empty, all existing ACL items will be processed.
   */

  /** @cfg {Boolean} [recursive=false] (optional) */

  /** @cfg {Boolean} [removeRead=false] (optional) */

  /** @cfg {Boolean} [removeWrite=true] (optional) */

  /** @cfg {Boolean} [removeDelete=true] (optional) */

  /** @cfg {Boolean} [removeEdit=true] (optional) */

  /** @cfg {Boolean} [removeList=true] (optional) */

  /** @cfg {Boolean} [removePermission=true] (optional) */

  /** @cfg {Boolean} [asAdmin=false] (optional) */

  /**
   * @private
   * @property {Object} rights
   */

  requiredConfig: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.users = config.users || [];
    me.rights = me.initRights(config);
    me.recursive = config.recursive || false;
  },

  /**
   * Removes ACL from whole folder structure.
   */
  process: function () {
    var me = this,
        params;

    params = {
      recursive: me.recursive,
      asAdmin: me.asAdmin
    };

    if (me.mapKey) {
      params.storeAcl = { type: "MAP", key: me.mapKey };
    }

    sol.common.AclUtils.removeRights(
      me.objId,
      me.users,
      me.rights,
      params
    );
  },

  /**
   * @private
   * @param {Object} config
   * @return {Object} rights
   */
  initRights: function (config) {
    var rights = {
      r: (config.removeRead === true) ? true : false,
      w: (config.removeWrite === false) ? false : true,
      d: (config.removeDelete === false) ? false : true,
      e: (config.removeEdit === false) ? false : true,
      l: (config.removeList === false) ? false : true,
      p: (config.removePermission === false) ? false : true
    };
    return rights;
  }
});

/**
 * @member sol.common.ix.functions.RemoveAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onEnterNode_RemoveAcl", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module;

  params.objId = wfDiagram.objId;
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  }

  module = sol.create("sol.common.ix.functions.RemoveAcl", params);

  module.process();

  logger.exit("onEnterNode_RemoveAcl");
}

/**
 * @member sol.common.ix.functions.RemoveAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  logger.enter("onExitNode_RemoveAcl", { flowId: wfDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
      module;

  params.objId = wfDiagram.objId;
  if (params.asAdmin) {
    sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  }

  module = sol.create("sol.common.ix.functions.RemoveAcl", params);

  module.process();

  logger.exit("onExitNode_RemoveAcl");
}

/**
 * @member sol.common.ix.functions.RemoveAcl
 * @method RF_sol_function_RemoveAcl
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_RemoveAcl(ec, args) {
  logger.enter("RF_sol_function_RemoveAcl", args);
  var params, module;

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");

  if (params.asAdmin) {
    sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);
  }

  module = sol.create("sol.common.ix.functions.RemoveAcl", params);
  module.process();

  logger.exit("RF_sol_function_RemoveAcl");
}
