importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js

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
 */
sol.define("sol.common.ix.services.StandardPreconditions", {
  extend: "sol.common.ix.ServiceBase",
  mixins: [
    "sol.common.mixins.Inject",
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
   *
   * @param {*} config
   */
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  isValid: function (sord, conditions) {
    var me = this,
      generatedConditions;

    if (!me.hasConditions(conditions)) {
      // no conditions - precondition should always be valid.
      return true;
    }

    generatedConditions = me.generateConditions(conditions);
    logger.debug(["generatedConditions: {0}", generatedConditions]);

    // from mixin sol.common.mixins.ObjectFilter
    return me.matchObject(generatedConditions, sord);
  },

  /**
   * generatedConditions has same structure like foreach or sordprovider filter
  *  but in this context condition is better naming for the purposes.
   * @param {*} conditions
   */
  generateConditions: function (conditions) {
    var me = this;
    // from mixin sol.common.mixins.ObjectFilter
    return me.generateFilter(conditions);
  },

  hasConditions: function (conditions) {
    return conditions
      && sol.common.ObjectUtils.isArray(conditions)
      && conditions.length > 0;
  },

  translateNotAllowedMessage: function (message) {
    var me = this;
    return sol.common.TranslateTerms.getTerm(me.ci,
        message || "sol.common.ix.actions.notAllowedMessage"
    );
  },

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
      result = { valid: false, targetId: me.targetId };

    if (me.isValid(me.targetSord, me.conditions || [])) {
      result.valid = true;
     } else {
      result.msg = me.translateNotAllowedMessage(me.notAllowedMessage);
    }

    logger.info(["precondition check result: {1}", sol.common.ix.RfUtils.stringify(result)]);
    return result;
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
