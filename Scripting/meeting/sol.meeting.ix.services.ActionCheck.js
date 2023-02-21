
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_moment.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.Template.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Checks for Action Definitions
 *
 *
 * @author SDi, ELO Digital Office GmbH
 * @private
 * This class will be replaced in the future
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.services.ActionCheck", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    actions: { config: "meeting", prop: "entities.meetingitem.services.actioncheck", template: true },
    _GetBoard: { config: "meetingBoard", prop: "meetingBoards.services.GetBoard", template: false },
    sord: { sordIdFromProp: "targetId" }
  },

  /**
     * @private
     * Contains the calculation rules.
     */
  fct: {
    EQUALS: function (param1, param2) {
      return param1 == param2;
    },
    CONTAINS: function (param1, param2) {
      param1 = (param1 || "") + "";
      param2 = (param2 || "") + "";
      return (param1.indexOf(param2) > -1);
    },
    STARTSWITH: function (param1, param2) {
      param1 = (param1 || "") + "";
      param2 = (param2 || "") + "";
      return (param1.indexOf(param2) == 0);
    },
    NOT_EQUALS: function (param1, param2) {
      // eslint-disable-next-line consistent-this
      var fct = this;
      return !fct.EQUALS(param1, param2);
    },
    NOT_CONTAINS: function (param1, param2) {
      // eslint-disable-next-line consistent-this
      var fct = this;
      return !fct.CONTAINS(param1, param2);
    },
    NOT_STARTSWITH: function (param1, param2) {
      // eslint-disable-next-line consistent-this
      var fct = this;
      return !fct.STARTSWITH(param1, param2);
    }
  },

  process: function () {
    var me = this;
    return me[me.action](me.actions[me.action]);
  },

  withdraw: function (action) {
    var me = this,
        result = { valid: true },
        meeting,
        allowed,
        match;

    meeting = me.getMeetingData(action);

    if (meeting) {
      allowed = me.getAllowedByStatus(action, meeting);
      if (allowed) {
        match = me.resolve(allowed.rules, "OR");
        if (match === false) {
          result = { msg: allowed.message };
        }
      } else {
        result = { msg: action.message };
      }
    } else {
      result = { msg: action.meeting.message };
    }

    return result;
  },

  register: function (action) {
    var me = this,
        result = { valid: true },
        meeting, allowed, match;

    meeting = me.getMeetingData(action);

    if (meeting) {
      result = { msg: action.meeting.message };
    } else {
      allowed = me.template(action.allowed, { proposal: me.getProposal() });
      if (allowed) {
        match = me.resolve(allowed.rules, "OR");
      }

      if (match === false) {
        result = { msg: allowed.message };
      }
    }

    return result;
  },

  getMeetingData: function (action) {
    var me = this,
        meeting = sol.common.RepoUtils.findInHierarchy(me.sord.id, { objKeyName: action.meeting.key, objKeyValues: action.meeting.value, connection: ixConnect, sordZ: SordC.mbAll }),
        result;
    if (meeting) {
      result = sol.common.ObjectFormatter.format({
        meeting: { formatter: "sol.common.ObjectFormatter.TemplateSord", data: meeting, config: { sordKeys: ["ownerName"] } }
      });
      result.proposal = me.getProposal();
      result.meetingBoard = me.getMeetingBoard(result.meeting);
    }

    return result;
  },

  getMeetingBoard: function (meeting) {
    var me = this,
        args = sol.common.TemplateUtils.render(me._GetBoard.args, { sord: meeting });
    args.output = {
      formatter: 'sol.common.ObjectFormatter.TemplateSord',
      config: {}
    };
    try {
      return sol.common.IxUtils.execute(
        me._GetBoard.name,
        args
      ).sords[0] || {};
    } catch (error) {
    }
  },

  getProposal: function () {
    var me = this;

    try {
      return (sol.common.IxUtils.execute("RF_sol_meeting_service_GetProposal", {
        source: me.sord,
        options: {
          formatAsTemplateSord: true
        }
      }) || {}).proposal;
    } catch (error) {
      return null;
    }
  },

  getAllowedByStatus: function (action, meeting) {
    var me = this,
        data, value, i, result;

    data = me.template(action, meeting);

    data.allowed.forEach(function (statusRule) {
      if (me.fct[statusRule.mode]) {
        value = Array.isArray(statusRule.value) ? statusRule.value : [statusRule.value];

        for (i = 0; i < value.length; i++) {
          if (me.fct[statusRule.mode](statusRule.key, value[i]) === true) {
            result = statusRule;
          }
        }
      } else {
        throw "function '" + statusRule.mode + "' not supported";
      }
    });

    return result;
  },

  resolve: function (rules, mode) {
    var me = this;

    return (rules || [])
      .map(function (rule) {
        return {
          rule: rule,
          result: ["AND", "OR"].indexOf(rule.mode) !== -1
            ? me.resolve(rule.rules, rule.mode)
            : me.fct[rule.mode](rule.key, rule.value)
        };
      })
      .reduce(function (acc, ruleContainer) {
        acc = mode == "AND" ? acc && ruleContainer.result : acc || ruleContainer.result;
        return acc;
      }, mode == "AND");
  },

  template: function (source, data) {
    return JSON.parse(sol.create("sol.common.Template", { source: JSON.stringify(source) }).apply(data));
  }
});

/**
* @member sol.meeting.ix.services.ActionCheck
* @method RF_sol_meeting_service_WithdrawMeetingItemPrecondition
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_WithdrawMeetingItemPrecondition(context, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  params.action = "withdraw";
  params.userInfo = context.user;

  return sol.common.JsonUtils.stringifyQuick((sol.create("sol.meeting.ix.services.ActionCheck", params)).process());
}

/**
* @member sol.meeting.ix.services.ActionCheck
* @method RF_sol_meeting_service_RegisterMeetingItemPrecondition
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_RegisterMeetingItemPrecondition(context, args) {
  var params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args, "targetId");
  params.action = "register";
  params.userInfo = context.user;

  return sol.common.JsonUtils.stringifyQuick((sol.create("sol.meeting.ix.services.ActionCheck", params)).process());
}