importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ElementService.js
//@include lib_sol.common.Template.js

var logger = sol.create("sol.Logger", {
  scope: "sol.common.ix.services.StandardPreconditions"
});



/**
 * Checks whether certain conditions match at the selected Sord.
 * Both objKeys and mapKeys are supported.
 *
 * The Sord object is available as a TemplateSord object.
 * {
 *   "objKeys": {
 *       "MEETING_STATUS" : "D - Draft"
 *   },
 *   "mapKeys": {
 *       "MEETING_TYPE": "Test"
 *   }
 * }
 *
 * Within the conditions, the individual fields can be accessed via a JSON object path.
 * For example: objKeys.MEETING_STATUS or mapKeys.MEETING_TYPE
 *
 * #### Example
 *
 *     {
 *       "targetId": "4711"
 *       "conditions": [
 *         { "prop" : "objKeys.MEETING_STATUS", value: "D -*"}
 *       ],
 *       "notAllowedMessage": "sol.meeting.actions.createItem.notAllowed"
 *     }
 *
 * #### Applying a condition with multiple condition values
 *
 *     {
 *       "conditions": [
 *          { "prop" : "objKeys.MEETING_STATUS", value: ["D -*", "S -*"]}
 *       ]
 *     }
 *
 * #### Result: Valid precondition check
 *
 *     {
 *       valid: true
 *     }
 *
 * #### Result: Invalid precondition check
 *
 *    {
 *       valid: false
 *       msg: "errorMessage"
 *    }
 *
 * #### Using an elementService as data provider instead of the targetSord Object
 *
 *
 *
 *    {
 *       "conditions": [ { "prop": "sords.$length" , value: "[^0]"}],
 *       "elementService": {
 *            "name": "RF_sol_common_service_SordProvider",
 *            "args": {
 *                 ...
 *                 search: [
 *                    {  {"key": "MEETINGTYPE_CODE", "value": "{{sord.objKeys.MEETINGTYPE_CODE}}"} }
 *                 ]
 *            }
 *        },
 *        "options": {
 *            "renderArgsWithElement": true
 *        }
 *    }
 *
 *
 * @author MH, ELO Digital Office GmbH
 * @author PB, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @since 1.12.000
 *
 * @eloix
 * @requires sol.common.ObjectUtils
 * @requires sol.common.Injection
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.Template
 */
sol.define("sol.common.ix.services.StandardPreconditions", {
  extend: "sol.common.ix.ServiceBase",
  mixins: [
    "sol.common.mixins.Inject",
    "sol.common.mixins.ElementService", //  search sords provider
    "sol.common.mixins.ObjectFilter" // condition generator
  ],

  requiredConfig: ["targetId", "ci"],

  inject: {
    targetSord: { sordIdFromProp: "targetId" }
  },

  /**
   * @cfg {String} targetId is the targetSord to check
   */

  /**
   * @cfg {String} notAllowedMessage (optional) localization key to use if the check is invalid.
   */

  /**
    * @cfg {Array<Object>} conditions
    */


  /**
    * Performes the checks and retrieves the data as spezified in the configuration.
    *
    * Returns the value in the format:
    *   {
    *     valid: Boolean,
    *     message: String
    *   }
    * @returns {Object}
  */
  process: function () {
    var me = this,
        context = me.getContext(),
        result = { valid: false, targetId: me.targetId };

    // user has the ability to do a precondition about a set of sords
    // instead of the current sord object

    me.logger.debug(["context {0}", JSON.stringify(context)]);
    if (me.isValid(context, me.conditions || [])) {
      result.valid = true;
    } else {
      result.msg = me.translateNotAllowedMessage(me.notAllowedMessage);
    }

    if (me.$debug) {
      result.context = context;
      result.search = sol.common.TemplateUtils.render(me.elementService.args, { sord: me.targetSord });
    }

    logger.debug(["precondition check result: {0}", sol.common.ix.RfUtils.stringify(result)]);
    return result;
  },

  getContext: function () {
    var me = this,
        sords;

    if (me.elementService) {
    // use elementservice result as context
    // condition could check array size as well (props: sords.$length, value: "[^0]")
    // otherwise the sord object itself is the context
      sords = me.performElementService(me.elementService, { sord: me.targetSord }, me.options);
    }

    return sords
      ? { sords: sords }
      : me.targetSord;
  },

  isValid: function (sord, conditions) {
    var me = this;

    if (!me.hasConditions(conditions)) {
      // no conditions - precondition should always be valid.
      return true;
    }

    // from mixin sol.common.mixins.ObjectFilter
    return me.matchObject(me.generateConditions(conditions), sord);
  },

  /**
   * @private
   * @param {*} conditions
   * @returns {Boolean}
   */
  hasConditions: function (conditions) {
    return conditions
      && sol.common.ObjectUtils.isArray(conditions)
      && conditions.length > 0;
  },

  /**
   * generatedConditions has same structure like foreach or sordprovider filter
  *  but in this context condition is better naming for the purposes.
   * @param {*} conditions
   * @returns {Object} the generated filters
   */
  generateConditions: function (conditions) {
    var me = this;
    // from mixin sol.common.mixins.ObjectFilter
    return me.generateFilter(conditions);
  },

  translateNotAllowedMessage: function (message) {
    return sol.common.TranslateTerms.translate(
      message || "sol.common.ix.actions.notAllowedMessage"
    );
  },

  /**
   * @private
   * @param {Object} elementServiceCfg
   * @param {Object} templateData
   * @param {Object} options
   * @returns {{sords:Array<Object>}} elements
   */
  performElementService: function (elementServiceCfg, templateData, options) {
    var me = this, config, freshArgs;


    if (options.renderArgsWithElement) {
      freshArgs = sol.common.TemplateUtils.render(elementServiceCfg.args, templateData);
      elementServiceCfg.args = freshArgs;
    }
    me.logger.debug(["performElementService"]);
    config = me.sanitizeElementServiceConfig(elementServiceCfg);
    return me.executeElementService(config);
  }
});

/**
 * @member sol.common.ix.services.StandardPreconditions
 * @method RF_sol_common_service_StandardPreconditions
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_StandardPreconditions(ec, args) {
  var config, service, result;

  logger.enter("RF_sol_common_service_StandardPreconditions", args);

  config = sol.common.ix.RfUtils.parseAndCheckParams(
    ec,
    arguments.callee.name,
    args
  );
  config.ci = ec.ci;
  config.user = ec.user;
  service = sol.create("sol.common.ix.services.StandardPreconditions", config);
  result = sol.common.ix.RfUtils.stringify(service.process());

  logger.exit("RF_sol_common_service_StandardPreconditions", result);

  return result;
}
