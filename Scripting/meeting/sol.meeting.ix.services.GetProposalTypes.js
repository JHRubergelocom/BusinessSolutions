importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.ix.MeetingBoardUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetProposalTypes" });


/**
* Retrieves available propopsal types.
*
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.IxUtils
* @requires sol.common.RepoUtils
* @requires sol.common.StringUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
* @requires sol.meeting.ix.MeetingBoardUtils
*/
sol.define("sol.meeting.ix.services.GetProposalTypes", {
    extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.meeting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    pilcrow: "\u00b6",

    inject: {
        boardService: { config: "meetingBoard", prop: "meetingBoards.services.GetBoard", template: true },
        boardOutput: { config: "meetingBoard", prop: "meetingBoards.outputs.proposalTypes" },
        sord: { sordIdFromProp: "objId" }
    },

    _optimize: {},

    process: function () {
        var me = this, proposalTypes = [], meetingBoard;

        meetingBoard = sol.meeting.ix.MeetingBoardUtils.findMeetingBoard(me.boardService, me.boardOutput, {
            optimizationName: "meetingBoardProposalTypes"
        });

        // proposal types field is a multiindex field
        // so we get an string array which we can map to
        // any Info Object
        proposalTypes = me.getProvidedProposalTypes(meetingBoard);
        return proposalTypes;
    },

    /**
     * @param {*} sord
     * @return {String[]}
     */
    getProvidedProposalTypes: function (meetingBoard) {
        var me = this, proposalTypeResults = [],
            proposalTypes = meetingBoard.objKeys.MEETING_PROVIDED_PROPOSALTYPES;

        if (!sol.common.StringUtils.isEmpty(proposalTypes)) {
            proposalTypeResults = proposalTypes.split(me.pilcrow);
            me.logger.info(["supported types are {0}", proposalTypeResults]);
        } else {
            me.logger.warn(["no proposal types supported - field {0} might be empty", "MEETING_PROVIDED_PROPOSALTYPES"]);
        }

        return proposalTypeResults;
    }

});


/**
* @member sol.meeting.ix.services.GetProposalTypes
* @method RF_sol_meeting_service_GetProposalTypeInfos
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetProposalTypeInfos(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        getProposalTypesService = sol.create("sol.meeting.ix.services.GetProposalTypes", rfParams),

    // TODO: we can implement some generic converter/adapter code to
    // return a Info Object for the Selection Dialog handler
     result = getProposalTypesService
        .process()
        .map(function (type) {
            return { name: type, desc: "" };
        });

    return sol.common.JsonUtils.stringifyQuick(result);
}