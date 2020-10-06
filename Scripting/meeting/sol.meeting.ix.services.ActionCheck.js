
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
 * @author SDi, ELO Digital Office GmbH
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
        actions: {config: "meeting", prop: "entities.meetingitem.services.actioncheck", template: true},
        sord: {sordIdFromProp: "targetId"}
    },

    /**
     * @private
     * Contains the calculation rules.
     */
    fct: {
        EQUALS: function(param1, param2) {
            return param1 == param2;
        },
        CONTAINS: function(param1, param2) {
            param1 = (param1 || "") + "";
            param2 = (param2 || "") + "";
            return (param1.indexOf(param2) > -1);        
        },
        STARTSWITH: function(param1, param2) {
            param1 = (param1 || "") + "";
            param2 = (param2 || "") + "";
            return (param1.indexOf(param2) == 0);
        }
    },

    withdraw: function(action) {
        var me = this,
            result = {valid: true},
            meeting, allowed, match, i;

        meeting = me.getMeetingData(action);
        
        if(meeting) {
            allowed = me.getAllowedByStatus(action, meeting);
        
            if(allowed) {
                match = false;

                for(i = 0; i < allowed.rules.length; i++) {
                    if(me.fct[allowed.rules[i].mode](allowed.rules[i].key, allowed.rules[i].value) === true) {
                        match = true;
                        break; 
                    }
                }

                if(match === false) result = {msg: allowed.message};
            } else {
                result = {msg: action.message};
            }
        } else {
            result = {msg: action.meeting.message};
        }

        return result;
    },

    register: function(action) {
        var me = this,
            result = {valid: true},
            meeting, allowed, match, i;

        meeting = me.getMeetingData(action);

        if(meeting) {
            result = {msg: action.meeting.message};
        } else {
            allowed = action.allowed;
            match = false;

            for(i = 0; i < allowed.rules.length; i++) {
                if(me.fct[allowed.rules[i].mode](allowed.rules[i].key, allowed.rules[i].value) === true) {
                    match = true;
                    break; 
                }
            }

            if(match === false) result = {msg: allowed.message};
        }

        return result;
    },

    check: function(action) {
        var me = this;
        return me[action](me.actions[action]);
    },

    getMeetingData: function(action) {
        var me = this,
            meeting = sol.common.RepoUtils.findInHierarchy(me.sord.id, {objKeyName: action.meeting.key, objKeyValues: action.meeting.value, connection: ixConnect, sordZ: SordC.mbAll}),
            result;

        if(meeting) {
            result = sol.common.ObjectFormatter.format({
                meeting: {formatter: "sol.common.ObjectFormatter.TemplateSord", data: meeting, config: {sordKeys: ["ownerName"]}}
            });
        }

        return result;
    },

    getAllowedByStatus: function(action, meeting) {
        var me = this,
            template = sol.create("sol.common.Template", {source: JSON.stringify(action)}),
            data, value, i, result;
        
        data = JSON.parse(template.apply(meeting));
        
        data.allowed.forEach(function(statusRule) {
            if(me.fct[statusRule.mode]) {
                value = Array.isArray(statusRule.value) ? statusRule.value : [statusRule.value];

                for(i = 0; i < value.length; i++) {
                    if(me.fct[statusRule.mode](statusRule.key, value[i]) === true) {
                        result = statusRule;
                    }
                }
            } else {
                throw "function '" + item.mode + "' not supported";
            }
        });

        return result;
    },

    process: function () {
        var me = this;

        return me.check(me.action);
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