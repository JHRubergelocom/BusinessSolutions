
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", {
    scope: "RF_sol_meeting_service_MeetingApprovalPreCondition"
});

/**
* @method RF_sol_meeting_service_MeetingApprovalPreCondition
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_MeetingApprovalPreCondition(context, args) {
    var params, preconditionResult,
        defaultConditions = [
            { "prop" : "sords.$length", "value": "[^0]"}
        ],
        elementService = {
            "name": "RF_sol_common_service_SordProvider",
            "args": {
                "masks": ["Meeting"],
                "search": [
                    {"key": "SOL_TYPE", "value": ["MEETING"]},
                    {"key": "MEETING_BOARD_CODE", "value": "{{sord.objKeys.MEETING_BOARD_CODE}}"},
                    {"key": "MEETING_STARTDATE", "value": "{{now pattern='YYYYMMDD'}}...", "type": "date"}
                ],
                "output": [
                    { "source": { "type": "SORD", "key": "id" }, "target": { "prop": "id" } }
                ],
                "options": {
                        "formatAsTemplateSord": true
                }
            }
        };

    params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
    params.conditions = params.conditions || defaultConditions;
    params.elementService = params.elementService || elementService;
    params.options = {
        "renderArgsWithElement" : true
    };

    params.notAllowedMessage = "sol.meeting.preconditions.meetingApproval.notAllowed";


    try {
        preconditionResult = sol.common.IxUtils.execute(
                "RF_sol_common_service_StandardPreconditions",
                params
        )
    } catch (ex) {
        logger.error("could not execute precondition function", ex);
        // we have some technical issues here, so elo doesn't work correctly properly
        preconditionResult = {
            valid: false,
            msg: "Could not execute precondition function"
        }
    }

    return sol.common.JsonUtils.stringifyQuick(preconditionResult);
}
