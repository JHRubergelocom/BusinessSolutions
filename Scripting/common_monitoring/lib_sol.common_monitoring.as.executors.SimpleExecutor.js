/**
 * This executor can be used to start simple tasks.
 *
 * That an action can be executed it has to define a type. Supported types are:
 *
 * - workflows: `type="WORKFLOW"` (starts a workflow)
 * - technical workflows: `type="TECHNICAL_WORKFLOW"` (starts a workflow and deletes it after execution if the workflow is already finished, i.e. does not contain any user nodes)
 * - reminder: `type="REMINDER"` (creates a reminder)
 * - function modules: `type="FUNCTION"` (executes a function with the objId of the current object as only parameter)
 *
 * # Enhancement
 * An analyzer can enhance a context object with additional information.
 * Some properties in the action definition can use those information to dynamically change the configuration property.
 *
 * The following action properties can use those enhancement:
 *
 * - WORKFLOW / TECHNICAL_WORKFLOW : user
 * - WORKFLOW / TECHNICAL_WORKFLOW : templateId
 * - WORKFLOW / TECHNICAL_WORKFLOW : nameTemplate
 * - REMINDER : user
 * - REMINDER : nameTemplate
 *
 * # Configuration
 * Depending on the type, the action needs additional information:
 *
 *     {
 *       type: "WORKFLOW",
 *       user: "Administrator", // optional, if none is defined, the during initialization set user will be user
 *       templateId: "NameOrIdOfTheWorkflowTemplate",
 *       nameTemplate: "{{translate 'wfPrefix'}}: {{sord.name}}" // optional, default is the name of the sord
 *     }
 *
 *     {
 *       type: "TECHNICAL_WORKFLOW",
 *       user: "Administrator", // optional, if none is defined, the during initialization set user will be user
 *       templateId: "{{ctx.TemplateNameReadFromFieldByValueAnalyzer}}", // enhancement example
 *       nameTemplate: "{{translate 'wfPrefix'}}: {{sord.name}}" // optional, default is the name of the sord
 *     }
 *
 *     {
 *       type: "REMINDER",
 *       user: "Administrator", // optional, if none is defined, the during initialization set user will be user
 *       nameTemplate: "Erinnerung: {{sord.objKeys.CONTRACT_NAME}}" // optional, default is the name of the sord
 *     }
 *
 *     {
 *       type: "FUNCTION",                        // only one of `module`, `direct` or `regfct` will be used, priority order is `regfct` -> `direct` -> `module`
 *       module: "my.namespace.MyFunctionModule"  // tries to create a module with this name and calls its `process` function (module and its dependencies have to be included)
 *       direct: "my.direct.Rule"                 // calls a direct function with this name
 *       regfct: "RF_my_Function"                 // calls a registered function with this name
 *     }
 *
 * # Initialization example:
 *
 *     var executor = sol.create("sol.common_monitoring.as.executors.SimpleExecutor", {
 *       user: "Administrator" // The default user if an action specifies none
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.01.000
 *
 * @eloas
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.TranslateTerms
 * @requires sol.common.Template
 */
sol.define("sol.common_monitoring.as.executors.SimpleExecutor", {

  /**
   * @cfg {String} user (optional) If set, this user will be used for all actions (but will be overridden, if an action itself defines a user)
   */

  /**
   * @private
   * @property {String} _todayIso The current date cached as ISO string
   */

  /**
   * @private
   * @property {Object} _userConnectionCache Caches user specific connections
   */
  _userConnectionCache: {},

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me._todayIso = sol.common.DateUtils.dateToIso(new Date());
    me.getConnection(me.user); // initializes a user connection in the cache for later re-use (if there is a user configured)
  },

  /**
   * Evaluates a result set and executes actions if the results contain any.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} results
   * @param {Object} ctx
   */
  execute: function (sord, results, ctx) {
    var me = this;

    me.logger.enter("execute", { objId: sord.id, name: String(sord.name) });

    if (results && (results.length > 0)) {
      results.forEach(function (r) {
        if (r.action) {
          me.executeAction(sord, r.action, ctx);
        }
      });
    }

    me.logger.exit("execute");
  },

  /**
   * Performes cleanup. Closes all opened user connections.
   */
  dispose: function () {
    var me = this;

    Object.keys(me._userConnectionCache || {})
      .map(me.getValueAtKey.bind(me, me._userConnectionCache))
      .map(me.disposeUserConnection);
  },

  /**
   * @private
   * get value at key
   * @param {Object} source
   * @param {String} key
   * @returns {Object} the object at provided key
   */
  getValueAtKey: function (source, key) {
    return source[key];
  },


  /**
   * @private
   * Closes an user cconnection
   * @param {de.elo.ix.client.IXConnection} userConnection
   */
  disposeUserConnection: function (userConnection) {
    userConnection.close();
  },

  /**
   * @private
   * Executes an individual action.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} action
   * @param {Object} ctx
   */
  executeAction: function (sord, action, ctx) {
    var me = this,
        fct = me.ACTIONS[action.type];

    me.logger.debug("execute action", action);

    if (fct && sol.common.ObjectUtils.isFunction(fct)) {
      fct.call(me, sord, action, ctx);
    } else {
      throw "ActionExecutionFailed: unsupported action type: " + action.type;
    }
  },

  /**
   * @private
   * Retrieves a connection for a specific user, using an internal cache.
   * If no user is defined, it returns the standard connection.
   * @param {String} user
   * @return {de.elo.ix.client.IXConnection}
   */
  getConnection: function (user) {
    var me = this;

    if (!user) {
      return ixConnect;
    }
    if (!me._userConnectionCache[user]) {
      me._userConnectionCache[user] = ixConnect.createConnectionForUser(user);
    }
    return me._userConnectionCache[user];
  },

  /**
   * @private
   * Builds the name from a template using the sord data. Fallback is `sord.name`.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} ctx
   * @param {String} nameTemplate (optional)
   * @return {String}
   */
  buildName: function (sord, ctx, nameTemplate) {
    var me = this,
        name;
    try {
      if (nameTemplate) {
        sord = sol.common.SordUtils.getTemplateSord(sord).sord;
        name = sol.create("sol.common.Template", { source: nameTemplate }).apply({ sord: sord, ctx: ctx });
      } else {
        name = sord.name;
      }
    } catch (ex) {
      name = sord.name;
      me.logger.warn("error generating name, use 'sord.name'", ex);
    }
    return name;
  },

  /**
   * @private
   * Retrieves the value from a action using handlebars applying the sord and the context.
   * @param {String} value
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} ctx
   * @return {String}
   */
  eveluateActionProperty: function (value, sord, ctx) {
    var me = this,
        result = value;
    if (value.indexOf("{{") > -1) {
      try {
        sord = sol.common.SordUtils.getTemplateSord(sord).sord;
        result = sol.create("sol.common.Template", { source: value }).apply({ sord: sord, ctx: ctx });
      } catch (ignore) {
        me.logger.debug("error evaluating handlebars action property", ignore);
      }
    }
    return result;
  },

  /**
   * @private
   * @property
   * Lookup object for the different functions supported by this executor.
   * All functions will be called with a `de.elo.ix.client.Sord` as first, an object (representing the action which should be executed) as second parameter and an context object possibly containing additional informations.
   */
  ACTIONS: {
    WORKFLOW: function (sord, action, ctx) {
      var me = this,
          flowTemplate, flowName, flowUser, conn, flowId;

      flowName = me.buildName(sord, ctx, action.nameTemplate);
      flowTemplate = me.eveluateActionProperty(action.templateId, sord, ctx);
      flowUser = (action.user) ? me.eveluateActionProperty(action.user, sord, ctx) : me.user;
      conn = me.getConnection(flowUser);
      flowId = conn.ix().startWorkFlow(flowTemplate, flowName, sord.id);
      me.logger.info(["workflow started: flowId={0}, flowName={1}, flowOwner={2}", flowId, flowName, flowUser]);
    },
    TECHNICAL_WORKFLOW: function (sord, action, ctx) {
      var me = this,
          flowTemplate, flowName, flowUser, conn, flowId, activeWorkflows, flowFinished;

      flowName = me.buildName(sord, ctx, action.nameTemplate);
      flowTemplate = me.eveluateActionProperty(action.templateId, sord, ctx);
      flowUser = (action.user) ? me.eveluateActionProperty(action.user, sord, ctx) : me.user;
      conn = me.getConnection(flowUser);
      flowId = conn.ix().startWorkFlow(flowTemplate, flowName, sord.id);
      me.logger.info(["workflow started: flowId={0}, flowName={1}, flowOwner={2}", flowId, flowName, flowUser]);

      activeWorkflows = sol.common.WfUtils.getActiveWorkflows(sord.id, { template: flowTemplate });
      flowFinished = !activeWorkflows.some(function (wf) {
        return wf.id === flowId;
      });
      if (flowFinished) {
        me.logger.info(["delete finished workflow: flowId={0}, flowName={1}, flowOwner={2}", flowId, flowName, flowUser]);
        me.getConnection(flowUser).ix().deleteWorkFlow(flowId, WFTypeC.FINISHED, LockC.NO);
      }

    },
    REMINDER: function (sord, action, ctx) {
      var me = this,
          user, reminder;

      user = (action.user) ? me.eveluateActionProperty(action.user, sord, ctx) : me.user;

      if (user) {
        reminder = ixConnect.ix().createReminder(sord.id);
        reminder.name = me.buildName(sord, ctx, action.nameTemplate);
        reminder.promptDateIso = me._todayIso;
        //reminder.prio = UserTaskPriorityC.HIGHEST;
        //reminder.desc = "...";
        ixConnect.ix().checkinReminder(reminder, [user], false, LockC.NO);
        me.logger.info(["reminder created: objId={0}, user={1}", sord.id, user]);
      }
    },
    FUNCTION: function (sord, action, ctx) {
      // TODO: can this result in a new "nextRun"?  --> see e.g. File
      var me = this,
          paramObj = { objId: sord.id };
      if (action.regfct) {
        sol.common.IxUtils.execute(action.regfct, paramObj);
        me.logger.info(["refistered function executed: {0}", action.regfct]);
        return;
      }
      if (action.direct) {
        if (ruleExecutor.hasDirectRule(action.direct)) {
          ruleExecutor.runDirectRule(action.direct, sord.id, JSON.stringify(paramObj), "");
        } else {
          me.logger.debug(["Direct rule '{0}' not found.", action.direct]);
        }
        return;
      }
      if (action.module) {
        sol.create(action.module, paramObj).process();
        me.logger.info(["function module executed: {0}", action.module]);
      }
    }
  }

});
