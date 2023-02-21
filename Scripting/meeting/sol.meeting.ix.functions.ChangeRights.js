importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.ObjectFormatter.MapTableToArray.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.ChangeRights" });

/**
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ObjectFormatter.MapTableToArray
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.ix.functions.ChangeRights", {
  extend: "sol.common.ix.FunctionBase",
  mixins: ["sol.common.mixins.Inject", "sol.common.mixins.ObjectFilter"],
  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" }
  },

  initialize: function (config) {
    var me = this;
    me.$copiedConfig = sol.common.ObjectUtils.clone(config);
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },


  process: function () {
    var me = this, config;

    config = me.preprocessUsers();

    try {
      me.logger.info(["RF_sol_function_ChangeRights: {0}", JSON.stringify(config)]);
      sol.common.IxUtils.execute("RF_sol_function_ChangeRights", config);
    } catch (ex) {
      me.logger.error(["Exception in sol.common.ix.functions.Changerights {0}", ex.message], ex);
      throw ex;
    }

    return { code: "success", config: config };
  },

  /**
   * @protected
   * @throws an exception when something went wrong
   * @returns
   */
  preprocessUsers: function () {
    var me = this;
    try {
      me.$copiedConfig.users = me.preprocessUserlist(me.users);
      if (me.cleanup && me.cleanup.users) {
        me.$copiedConfig.cleanup.users = me.preprocessUserlist(me.cleanup.users);
      }
      return me.$copiedConfig;
    } catch (ex) {
      me.logger.error(["Exception in sol.meeting.ix.functions.ChangeRights#preprocessUsers: {0}", ex.message], ex);
      throw ex;
    }
  },

  /**
   * @protected
   */
  preprocessUserlist: function (users) {
    var me = this;
    return (users || [])
      .filter(sol.common.ObjectUtils.isTruthy)
      .reduce(function (userList, userEntry) {
        var table, value, result = {}, selector, tableKind, filterCallback;
        if (sol.common.ObjectUtils.isString(userEntry) || userEntry.name) {
          userList.push(userEntry);
        } else if (userEntry.table === true) {
          // key could be either an array or an plain string
          // so in case of an array we want to use the first
          selector = sol.common.ObjectUtils.isString(userEntry.key)
            ? userEntry.key
            : userEntry.useField;

          if (!selector) {
            throw Error("Could not determine field to select user field. Either use key as string in your type definition or set prop `useField`")
          }

          // choose whether we want to retreive wfMap table or a maptable
          tableKind = userEntry.type === "WFMAP" ? "wfMapKeys" : "mapKeys";

          if (userEntry.filter && userEntry.filter.length > 0) {
            // from mixin sol.common.ObjectUtils.ObjectFilter
            filterCallback = me.matchObject.bind(null, me.generateFilter(userEntry.filter));
          } else {
            filterCallback = function () {
             return true;
            };
          }

          // Here we want to pass all key(s) to the table function to retrieve
          // either one column or multiple columns
          table = sol.common.TemplateSordUtils.getTable(me.sord, userEntry.key, tableKind);
          table
            .filter(filterCallback)
            .forEach(function (row) {
              userList.push({
                name: row[selector],
                rights: userEntry.rights
              });
          });
        } else if (userEntry.key && userEntry.type) {
          value = sol.common.TemplateSordUtils.getValue(me.sord, userEntry);
          result.name = value;
          userList.push({
            name: value,
            rights: userEntry.rights
          });
        }
      return userList;
    }, []);
  }

});


/**
 * @member sol.meeting.ix.functions.ChangeRights
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_ChangeRights", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = String(wFDiagram.objId);
  params.flowId = String(wFDiagram.id);


  module = sol.create("sol.meeting.ix.functions.ChangeRights", params);
  module.process();

  logger.exit("onEnterNode_ChangeRights");
}


/**
 * @member sol.meeting.ix.functions.ChangeRights
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wFDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_ChangeRights", { flowId: wFDiagram.id, nodeId: nodeId });

  sol.common.WfUtils.checkMainAdminWf(wFDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId);
  params.objId = String(wFDiagram.objId);
  params.flowId = String(wFDiagram.id);

  module = sol.create("sol.meeting.ix.functions.ChangeRights", params);
  module.process();

  logger.exit("onExitNode_ChangeRights");
}

/**
 * @member sol.meeting.ix.functions.ChangeRights
 * @method RF_sol_meeting_function_ChangeRights
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
 function RF_sol_meeting_function_ChangeRights(ec, args) {
  var params, module,result;

  logger.enter("RF_sol_meeting_function_ChangeRights", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.meeting.ix.functions.ChangeRights", params);
  result = module.process();
  logger.exit("RF_sol_meeting_function_ChangeRights");
  return JSON.stringify(result);
}
