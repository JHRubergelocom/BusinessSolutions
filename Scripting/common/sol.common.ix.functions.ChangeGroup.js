
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ObjectFormatter.MapTableToArray.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.ChangeGroup" });

/**
 * Changes the given ELO group.
 *
 * It is possible to add new members to the ELO group or remove existing members.
 *
 * When the user is already a member of the ELO group nothing will be happen
 *
 * ### Retrieving user list from mapTable
 *
 * In the example all userNames will be returned where the field MEETING_PERSON_CRUD_STATUS is
 * equal `CREATE`. With `propSelector` you can reach that the function returns an array with plain
 * strings instead of an object
 *
 *    "addMembers": [
*        {
 *         "type": "WFMAP",
 *         "key": ["MEETING_PERSON_USERNAME", "MEETING_PERSON_CRUD_STATUS"],
 *         "table": true,
 *         "propSelector": "MEETING_PERSON_USERNAME",
 *         "filter": [
 *            { "prop": "MEETING_PERSON_CRUD_STATUS", "value": "CREATE" }
 *         ]
 *       }
 *     ]
 *
 *  Hint: You have to pass the flowId to the function to enable WFMAP fields
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 * Following additional configuration can be applied to the comments field.
 *
 *     {
 *      "groupName": "New Group"
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_ChangeGroup", {
 *       groupName: "group",
 *       addMembers: ["renz", "kraft"],
 *       removeMembers: ["eichner"]
 *     });
 *
 * @eloix
 * @requires sol.common.IxUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.Injection
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.JsonUtils
 * @requires sol.common.ix.ObjectUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.ObjectFormatter.MapTableToArray
 *
 */
sol.define("sol.common.ix.functions.ChangeGroup", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg groupName
   */

   /**
   * @cfg {Boolean} [asAdmin=false] (optional)
   * When `asAdmin` is set to true the operation will be execute with an admin connection
   */

  mixins: ["sol.common.mixins.Inject"],

  inject: {
    name: { prop: "groupName", template: true },
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", optional: false }
  },

  TEMPLATESORDACCESSORS: {
    SORD: "",
    GRP: "objKeys.",
    MAP: "mapKeys.",
    WFMAP: "wfMapKeys."
  },

  /**
  * @cfg {String} groupName
  * The name of the new group. Templating is possible if objId/flowId is passed to the function
  */

  /**
  * @cfg {Array<Object>|Object|String} addMembers
  *
  */

  /**
   * @cfg {Array<Object>|Object|String} removeMembers
   */

   initialize: function (config) {
    var me = this;

    if (config.addMembers && !sol.common.ObjectUtils.isArray(config.addMembers)) {
      config.addMembers = [config.addMembers];
    }

    if (config.removeMembers && !sol.common.ObjectUtils.isArray(config.removeMembers)) {
      config.removeMembers = [config.removeMembers];
    }

    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.checkConfig();
    me.connection = ((me.asAdmin === true) && (typeof ixConnectAdmin !== "undefined")) ? ixConnectAdmin : ixConnect;

  },

  checkConfig: function () {
    var me = this, flowIdIsNecessary,
      checkWorkflowIsNecessary = function (entry) {
        return entry && entry.type === "WFMAP";
      };

    flowIdIsNecessary = (me.addMembers || []).some(checkWorkflowIsNecessary)
      || (me.removeMembers || []).some(checkWorkflowIsNecessary);

    if (flowIdIsNecessary && !me.flowId) {
        throw Error("Your configuration contains WFMAP fields. `flowId` must be passed to the function");
    }
  },

  /**
   *
   */
  process: function () {
    var me = this, addMembers, removeMembers,
      groupName = me.getGroupName();

    try {
      if (me.shouldAddMembers()) {
        // add users to created group
        me.logger.debug(["addMembers {0}", JSON.stringify(me.addMembers)]);
        addMembers = me.prepareUserList(me.addMembers || []);

        if (!me.$dryRun) {
          me.addUsersToGroups(addMembers, [groupName]);
        }
      }

      if (me.shouldRemoveMembers()) {
        removeMembers = me.prepareUserList(me.removeMembers || []);

        if (!me.$dryRun) {
          me.removeUsersFromGroups(removeMembers, [groupName]);
        }
      }
    } catch (ex) {
      me.logger.warn(["An error occured {0}", ex.message], ex);
      throw ex;
    }

    return {
      name: groupName,
      addMembers: addMembers,
      removeMembers: removeMembers
    };
  },

  getGroupName: function () {
    var me = this, key;
    if (sol.common.ObjectUtils.isString(me.groupName)) {
      return me.groupName;
    } else if (me.groupName && me.groupName.type) {
       // complex object { type: "GRP", "key": "FIELDNAME" }
      if (!me.groupName || !me.hasAccesssorKey(me.groupName)) {
        throw Error("process type " + me.groupName.type + "is not supported currently");
      }

      key = me.getAccessor(me.groupName);
      return sol.common.ObjectUtils.getProp(me.sord, key);
    } else {
      throw Error("Could not determine groupName");
    }
  },

  /**
   * @private
   * @returns
   */
  shouldAddMembers: function () {
    var me = this;
    return me.addMembers && me.addMembers.length > 0;
  },

  /**
   * @private
   * @returns
   */
  shouldRemoveMembers: function () {
    var me = this;
    return me.removeMembers && me.removeMembers.length > 0;
  },

  /**
   * @private
   * @param {} names
   * @param {*} targetGroups
   */
   addUsersToGroups: function (names, targetGroups) {
    var me = this;
    me.logger.debug(["addUsersToGroups {0} {1}", names, targetGroups]);
    sol.common.UserUtils.addUsersToGroups(names, targetGroups, {
      connection: me.connection
    });
  },

  /**
   * @private
   * @param {} names
   * @param {*} targetGroups
   */
  removeUsersFromGroups: function (names, targetGroups) {
    var me = this;
    me.logger.debug(["removeUsersFromGroups {0} {1}", names, targetGroups]);
    sol.common.UserUtils.removeUsersFromGroups(names, targetGroups, {
      connection: me.connection
    });
  },

  prepareUserList: function (userDef) {
    var me = this, users, userList;

    users = (userDef || [])
      .filter(function (entry) { return entry; }) // TODO: implement default filter in ObjectUtils to filter nullable values
      .reduce(function (userObjList, entry) {
      if (sol.common.ObjectUtils.type(entry, "string")) {
        userList = [entry];
      } else if (entry.type) {
        userList = me.extractUsers(entry);
      } else if (entry.service) {
        throw Error("elementService is currently not implemented");
      } else {
        throw Error("Unknown entry type in `addUsersToGroup`. Only `type` and `service` is allowed");
      }

      // each user should be unqiue in the array so we store the user
      // into an object first. It avoids duplicates user.
      // User have to been a string value here
      userList && userList.reduce(function (objList, user) {
        user && (objList[user] = true);
        return objList;
      }, userObjList);


      return userObjList;
    }, {});

    // Now we convert it back to an array, so we can pass it easily to UserUtils
    return Object.keys(users);
  },

  /**
   *
   * @param {Object} entry
   * @param {Object} entry.type
   * @param {Object} entry.key
   * @returns {Array<String>}
   */
  extractUsers: function (entry) {
    var me = this, key,
      mapTableFormatter, users, output, keys;

    // complex object { type: "GRP", "key": "FIELDNAME" }
    if (!entry || !me.hasAccesssorKey(entry)) {
      throw Error("process type " + entry.type + "is not supported currently");
    }

    key = me.getAccessor(entry);

    if (entry.table === true) {

      keys = sol.common.ObjectUtils.isArray(entry.key)
        ? entry.key
        : [entry.key];

      output = keys.map(function (k) {
        return { source: { key: k }, target: { prop: k } };
      });

      me.logger.info(["output {0}, entry={1}", JSON.stringify(output), JSON.stringify(entry)]);

      // convert map table to an array so we can pass user array easily to UserUtils later
      mapTableFormatter = sol.create("sol.common.ObjectFormatter.MapTableToArray", {
        kind: entry.type === "WFMAP" ? "wfMapKeys" : "mapKeys",
        output: output,
        options: {
          propSelector: entry.propSelector || "",
          filter: entry.filter || []
        }
      });

      users = mapTableFormatter.format(me.sord);
      me.logger.info(["users in table {0}", JSON.stringify(users)]);
    } else {
      users = [sol.common.ObjectUtils.getProp(me.sord, key)];
    }

    return users;
  },

  hasAccesssorKey: function (entry) {
    var me = this;
    return me.TEMPLATESORDACCESSORS.hasOwnProperty((entry.type || "").toUpperCase());
  },

  getAccessor: function (entry) {
    var me = this;
    return me.TEMPLATESORDACCESSORS[(entry.type || "").toUpperCase()] + entry.key;
  },

  uniqueList: function (list) {
    var obj = list.reduce(function (acc, item) {
      acc[item] = true;
      return acc;
    }, {});
    return Object.keys(obj);
  }
});




/**
 * @member sol.common.ix.functions.ChangeGroup
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onEnterNode_ChangeGroup", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params.objId = String(wFDiagram.objId);
  params.flowId = String(wFDiagram.id);
  module = sol.create("sol.common.ix.functions.ChangeGroup", params);

  module.process();

  logger.exit("onEnterNode_ChangeGroup");
}


/**
 * @member sol.common.ix.functions.ChangeGroup
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_ChangeGroup", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      module;

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);

  params.objId = wFDiagram.objId;
  params.flowId = String(wFDiagram.id);
  module = sol.create("sol.common.ix.functions.ChangeGroup", params);

  module.process();

  logger.exit("onExitNode_ChangeGroup");
}


/**
 * @member sol.common.ix.functions.ChangeGroup
 * @method RF_sol_function_ChangeGroup
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_ChangeGroup(ec, args) {
  logger.enter("RF_sol_function_ChangeGroup", args);
  var module, result, params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args);

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);
  module = sol.create("sol.common.ix.functions.ChangeGroup", params);

  result = module.process();
  logger.exit("RF_sol_function_ChangeGroup");
  return sol.common.JsonUtils.stringifyQuick(result);
}

