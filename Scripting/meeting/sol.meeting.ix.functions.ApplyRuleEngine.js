//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.ElementService.js
//@include lib_sol.meeting.ix.ExecutionProcessor.js
//@include lib_sol.meeting.ix.RuleEngineJsonParser.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js


var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.RuleEngineProcessor" });

/**
 * Apply a set of rules and execute a thenCallback when a rule is evaluated to true
 *
 * @eloix
 *
 * @author ELO Digital Office GmbH
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.meeting.ix.RuleEngine
 */
sol.define("sol.meeting.ix.functions.RuleEngineProcessor", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg ruleKeys {Array<String>} An array of rule keys which match to a rule configuration in rules.config.json
   */

  mixins: [
    "sol.common.mixins.ElementService",
    "sol.meeting.mixins.Configuration"
  ],

  defaultInjections: {
    rules: { config: "rules", prop: "rules", template: false },
    sord: { sordIdFromProp: "objId", optional: true }
  },

  inject: {},

  initialize: function (config) {
    var me = this;

    me.inject = sol.common.ObjectUtils.clone(me.defaultInjections);

    if (config.injectConfig) {
      // inject all provided inject configs automatically
      Object.keys(config.injectConfig)
        .forEach(function (injectKey) {
          me.inject[injectKey] = sol.common.ObjectUtils.clone(config.injectConfig[injectKey]);
        });
    }

    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.logger.debug(["init {0}", JSON.stringify(me.inject || {})]);
    sol.create("sol.common.Injection").inject(me);
  },

  process: function () {
    var me = this,
        options = me.options || {},
        sords = [];

    me.logger.debug(["options {0}", JSON.stringify(options)]);

    if (!me.hasRules()) {
      me.logger.info(["RuleEngine will be skipped because no rules are passed to the RuleEngine"]);
      return { status: "SKIP" };
    }

    if (!Array.isArray(me.ruleKeys)) {
      throw Error("`ruleKeys` prop must be an array");
    }

    me.logger.debug(["use ruleKeys {0}, elementService={1}", JSON.stringify(me.ruleKeys), JSON.stringify(me.elementService || {})]);

    sords = me.getSords(me.elementService);

    if (sol.common.ObjectUtils.type(sords, "array")) {
      if (me.shouldExecuteOnEmptyElement(sords, options)) {
        return me.executeOnEmptyElements(me.createContext(options), options);
      } else {
        me.buildContextAndApplyRules(sords, options);

      }
    } else {
      throw Error("Your elementService must return an array");
    }

    me.$configs = undefined;
    me.$templateData = undefined;
    me.elementService = undefined;

    return { success: true };
  },

  /**
   * @private
   * @returns {boolean}
   */
  hasRules: function () {
    var me = this;
    return !sol.common.ObjectUtils.isEmpty(me.rules);
  },

  /**
   * @private
   * @param {*} elementService
   * @returns {*} sords
   */
  getSords: function (elementService) {
    var me = this;

    if (elementService && !me.options.useCurrentSord) {
      elementService = sol.common.ObjectUtils.clone(me.elementService || {});
      return me.performElementService(elementService, me.options) || [];
    } else {
      return [me.sord];
    }
  },

  shouldExecuteOnEmptyElement: function (sords, options) {
    return sol.common.ObjectUtils.type(sords, "array")
        && sords.length == 0
        && options.onEmptyElements;
  },

  /**
    * @private
    * TODO: refactor to mixin class `sol.common.mixins.ElementService`
    * @param {*} elementServiceCfg
    * @returns {*} elementServiceResult
    * @returns {TemplateSord[]} elementServiceResult.sords
    */
  performElementService: function (elementServiceCfg) {
    var me = this,
        config;

    if (!elementServiceCfg) {
      return null;
    }

    config = me.sanitizeElementServiceConfig(elementServiceCfg);

    me.logger.debug(["performElementService {0}", JSON.stringify(config)]);
    return me.executeElementService(config);
  },

  /**
     * @private
     * @param {*} options
     * @param {*} element
     * @returns {*} context
     */
  createContext: function (options, element) {
    var me = this,
        context = {};
    context[options.elementArg || "element"] = element;
    context.sord = me.sord;
    return context;
  },

  /**
     * @private
     * @param {*} context
     * @param {*} result
     * @returns {*} context
     */
  createResultSet: function (context, result) {
    return {
      context: context,
      result: result
    };
  },

  /**
     * @private
     * @param {*} templateData
     * @param {*} options
     * @returns {*} context
     */
  executeOnEmptyElements: function (templateData, options) {
    var me = this;

    me.logger.debug(["execute on empty elements with parameters {0}", JSON.stringify((options.onEmptyElements || {}) || {})]);

    sol.common.IxUtils.execute(
      options.onEmptyElements.name,
      sol.common.TemplateUtils.render(options.onEmptyElements.args, templateData)
    );
  },

  buildContextAndApplyRules: function (sords, options) {
    var me = this;
    (sords || [])
      .map(me.createContext.bind(me, options))
      .map(function (context) {
        return me.applyRules(me.ruleKeys, context);
      });
  },

  /**
     * Apply each rule
     * @param {*} ruleKeys
     * @param {*} context
     * @returns {*} result
     */
  applyRules: function (ruleKeys, context) {
    var me = this;

    return ruleKeys
      .map(function (key) {
        if (me.rules[key]) {
          me.rules[key]._ruleKey = key;
        }
        return me.rules[key]
          ? sol.common.ObjectUtils.clone(me.rules[key])
          : null;
      }).filter(function (rule) {
        // remove all undefined rules
        return rule;
      })
      .map(function (rule) {
        // render when block with handlebar and append it to the rule
        rule.when = sol.common.TemplateUtils.render(
          rule.when,
          context
        );
        return rule;
      })
      .map(function (rule) {
        // apply each rule
        me.logger.debug(["apply rule {0}", JSON.stringify(rule)]);
        return {
          rule: rule._ruleKey,
          status: me.applyRule(rule, context).status
        };
      });
  },

  applyRule: function (rule, context) {
    var me = this,
        condition = me.performComparison(rule, context);

    if (condition) {
      if (sol.common.ObjectUtils.isEmpty(rule.then)) {
        me.logger.info(["Expression of rule {0} is evaluated to true but no thenStatement is defined. Rule will be skipped", rule._ruleKey]);
        me.logger.debug(["Rule {0}", JSON.stringify(rule)]);
        return { status: "SKIP", rule: rule };
      } else {
        me.logger.info(["Expression of rule {0} is evaluated to true. Rule will be executed", rule._ruleKey]);
        me.logger.debug(["Rule {0}", JSON.stringify(rule)]);
        return { status: "EXECUTED", result: me.execute(rule.then, context), rule: rule };
      }
    } else {
      me.logger.info(["Expression of rule {0} is evaluated to false. Rule will not be executed", rule._ruleKey]);
      me.logger.debug(["Rule {0}", JSON.stringify(rule)]);
      return { status: "NOT_FULLFILLED", rule: rule };
    }
  },

  performComparison: function (rule, context) {
    var me = this,
        parser,
        expression,
        result;

    if (rule.when) {
      parser = sol.create("sol.meeting.ix.RuleEngineJsonParser", {
        context: context,
        conditions: rule.when
      });

      // parse return an expression tree we can execute
      // and determine the expression result
      expression = parser.parse();
      result = expression.process();
      me.logger.debug(["conditionResult {0}", result]);
      return result;
    } else {
      throw Error("Could not perform comparison. Maybe when block is missing in configuration?");
    }
  },

  /**
     * This function is called when the when condition
     * is evaluated to true and a then block in the
     * RuleDefinition is defined
     * @param {*} node
     * @param {String} thenNode.callback name of the RF callback function.
     * @param {Object} thenNode.args args which will be passed to the callback function
     * @param {*} context
     * @returns {*} result
     */
  execute: function (node, context) {
    var me = this,
        executionProcessor = me.getExecutionProcessor(context);

    return executionProcessor.process(node);
  },

  /**
     * @private
     * @param {*} context
     * @returns {*} ExecutionProcessor
     */
  getExecutionProcessor: function (context) {
    var me = this;
    me.logger.debug(["create execution processor {0}", JSON.stringify(context)]);
    return sol.create("sol.meeting.ix.ExecutionProcessor", {
      $templateData: sol.common.ObjectUtils.clone(context),
      options: {
        renderArgsWithElement: true
      }
    });
  }
});

/**
 * @member
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("RF_sol_meeting_function_ApplyRuleEngine", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId), fun;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  fun = sol.create("sol.meeting.ix.functions.RuleEngineProcessor", params);
  fun.process();
  logger.exit("RF_sol_meeting_function_ApplyRuleEngine");
}

/**
 * @member sol.common.ix.functions.Generators
 * @method
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_ApplyRuleEngine(iXSEContext, args) {
  logger.enter("RF_sol_meeting_function_ApplyRuleEngine", args);
  var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      genProc = sol.create("sol.meeting.ix.functions.RuleEngineProcessor", params),
      result;
  result = genProc.process();
  logger.exit("RF_sol_meeting_function_ApplyRuleEngine");
  return JSON.stringify(result);
}
