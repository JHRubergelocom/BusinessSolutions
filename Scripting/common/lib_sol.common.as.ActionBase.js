
/**
 * @abstract
 *
 * Base class for AS actions.
 *
 * # Implementation example
 *
 * Actions must be provided as DIRECT rules.
 *
 *     sol.define("sol.my.as.actions.MyAction", {
 *       extend: "sol.common.as.ActionBase",
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
 *     <ruleset>
 *       <base>
 *         ...
 *       </base>
 *       <rule>
 *         <name>Regel1</name>
 *         <condition></condition>
 *         <script>
 *           sol.common.as.Utils.requiresUserSession(this);
 *           var myAction = sol.create("sol.my.MyAction", {objId: "4711"});
 *           ruleset.setStatusMessage(myAction.execute());
 *           sol.common.as.Utils.cleanupUserSession(this);
 *         </script>
 *       </rule>
 *     </ruleset>
 *
 * # Executing AS actions from clients
 *
 * Actions can be executed thanks to handler implementations in the Java Client and Web Client. Refer to
 * sol.common.jc.ActionHandler#execute and sol.common.web.ActionHandler#execute for more information.
 *
 *     sol.common.jc.ActionHandler.executeAS("sol.pubsec.as.actions.PrepareDocument", { ...ELOas config... }, "", params);
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.03.006
 *
 * @eloas
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.TranslateTerms
 * @requires sol.common.WfUtils
 */
sol.define("sol.common.as.ActionBase", {
  extend: "sol.common.ActionBase",

  initialize: function (config) {
    var me = this, renderedConfig;

    if (me.$className === "sol.common.as.ActionBase") {
      throw "can not create instance of abstract class 'sol.common.as.ActionBase'";
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
    throw "cannot call 'name' of abstract class 'sol.common.as.ActionBase'";
  },

  /**
   * @abstract
   * Implementation of the action. Has to be implemented by subclass.
   */
  process: function () {
    throw "cannot call 'process' of abstract class 'sol.common.as.ActionBase'";
  },

  /**
   * @protected
   * @inheritdoc sol.common.ActionBase#addActionEvent
   */
  addActionEvent: function (directRule, params, on) {
    var me = this,
        eventCfg = { directRule: directRule, params: params, solution: me.solution };

    me._registeredEvents.push(me.createEvent(sol.common.IxUtils.CONST.EVENT_TYPES.ACTION, eventCfg, on));
  },

  /**
   * @private
   * @inheritdoc sol.common.ActionBase#createEvent
   */
  createEvent: function (type, params, on) {
    var event = { ID: type, COMPONENT: sol.common.IxUtils.CONST.COMPONENTS.AS, obj: {} },
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
