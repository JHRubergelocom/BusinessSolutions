
//@include lib_Class.js
//@include lib_sol.common.ActionBase.js

/**
 * @abstract
 *
 * Base class for IX actions.
 *
 * # Implementation example
 *
 * Actions must be provided as registered functions.
 *
 *     sol.define("sol.my.ix.actions.MyAction", {
 *       extend: "sol.common.ix.ActionBase",
 *
 *       requiredConfig: ["objId"],
 *
 *       initialize: function (config) {
 *         var me = this;
 *         me.$super("sol.common.ix.ActionBase", "initialize", [config]);
 *         // some other initialization
 *       },
 *
 *       getName: function () {
 *         return "MyAction";
 *       },
 *
 *       process: function () {
 *         // do your stuff
 *         // add some events / data
 *       }
 *     });
 *
 *     function RF_sol_my_actions_MyAction(ec, configAny) {
 *       var rfUtils = sol.common.ix.RfUtils,
 *       config = rfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "objId"),
 *       closeFile;
 *
 *       config.ci = ec.ci;
 *       config.user = ec.user;
 *
 *       closeFile = sol.create("sol.my.ix.actions.MyAction", config);
 *       return closeFile.execute();
 *     }
 *
 * # Executing IX actions from clients
 *
 * Actions can be executed thanks to handler implementations in the Java Client and Web Client. Refer to
 * sol.common.jc.ActionHandler#execute and sol.common.web.ActionHandler#execute for more information.
 *
 *     sol.common.jc.ActionHandler.execute('RF_sol_my_actions_MyAction' {
 *       objId: '234'
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.006
 *
 * @eloix
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 */
sol.define("sol.common.ix.ActionBase", {
  extend: "sol.common.ActionBase",

  initialize: function (config) {
    var me = this, renderedConfig;

    if (me.$className === "sol.common.ix.ActionBase") {
      throw "can not create instance of abstract class 'sol.common.ix.ActionBase'";
    }

    if (!(config._$disableParamsTemplating === true)) {
      renderedConfig = me.renderConfig(config);
      Object.keys(renderedConfig).forEach(function (prop) {
        if ((Object.prototype.toString.call(config[prop]) !== "[object JavaObject]") || config[prop] instanceof java.lang.String) {
          config[prop] = renderedConfig[prop];
        }
      });
      config.$templating = undefined;
    }

    me.$super("sol.common.ActionBase", "initialize", [config]);
  },

  /**
   * @abstract
   * Name of the action. Has to be implemented by subclass.
   */
  getName: function () {
    throw "cannot call 'name' of abstract class 'sol.common.ix.ActionBase'";
  },

  /**
   * @abstract
   * Implementation of the action. Has to be implemented by subclass.
   */
  process: function () {
    throw "cannot call 'process' of abstract class 'sol.common.ix.ActionBase'";
  },

  /**
   * @protected
   * @inheritdoc sol.common.ActionBase#addActionEvent
   */
  addActionEvent: function (registeredFunction, params, on) {
    var me = this,
        eventCfg = { registeredFunction: registeredFunction, params: params };

    me._registeredEvents.push(me.createEvent(sol.common.IxUtils.CONST.EVENT_TYPES.ACTION, eventCfg, on));
  },

  /**
   * @private
   * @inheritdoc sol.common.ActionBase#createEvent
   */
  createEvent: function (type, params, on) {
    var event = { ID: type, COMPONENT: sol.common.IxUtils.CONST.COMPONENTS.IX, obj: {} },
        param;

    if (on) {
      event.ON = on;
    }

    for (param in params) {
      if (params.hasOwnProperty(param)) {
        event.obj[param] = params[param];
      }
    }

    return event;
  }


});

/**
 * @member sol.common.ix.ActionBase
 * @method RF_FunctionName
 * @static
 * @abstract
 *
 * This function can be called from an application by invoking the API function "executeRegisteredFunction" or by using
 * sol.common.IxUtils.execute which internally handles the Any-Object conversion.
 *
 * All configuration params should be passed as a configuration object to the args param.
 *
 *     sol.common.IxUtils.execute('RF_FunctionName', {
 *       configParam1: 'myParam'
 *     });
 *
 * @param {de.elo.ix.client.IXServerEventsContext} Execution context
 * @param {Object} args Argument array sent by the client application.
 */
