importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.meeting.ObjectFormatter.MapTable.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetResolutionActionTypes" });


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
* @requires sol.meeting.ObjectFormatter.MapTable
* TODO: implement BaseStandardType to provide selection types
*   via templateObjects or virtual config object or something else
*/
sol.define("sol.meeting.ix.services.GetResolutionActionTypes", {
    extend: "sol.common.ix.ServiceBase",

    /**
    * @cfg {Object} shortenDesc (optional) Description text will be limited to 70 characters.
    */

    mixins: [
        "sol.meeting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    /**
    * description texts are cut at this length.
    */
    maxDescLength: 70,

    _optimize: {},

    inject: {
        actions: { config: "resolutions", prop: "actions", template: true },
        proposalTemplateSearch: { config: "proposals", prop: "services.GetProposalTemplateObject", template: true },
        proposalActionOutput: { config: "proposals", prop: "outputs.proposalActions" },
        sord: { sordIdFromProp: "objId", optional: false },
    },

    process: function () {
        var me = this, result, formatter, actions,
            args = {
                masks: me.proposalTemplateSearch.masks,
                search: me.proposalTemplateSearch.search,
                output: me.proposalActionOutput,
                options: {
                    formatAsTemplateSord: true
                }
            };

            result = sol.common.IxUtils
                .optimizedExecute("RF_sol_common_service_SordProvider",
                    args, me._optimize, "templateProposal", ["output"]);

            if (result && result.sords.length === 0) {
                throw Error("Meeting Proposal Template doesn't exist, objId=" + me.objId);
            } else if (result && result.sords.length > 1) {
                throw Error("SordProvider should actually return only one value. The result has " + result.sords.length + "elements")
            }

            formatter = sol.create("sol.meeting.ObjectFormatter.MapTable", {
                output: [
                    { source: { key: "MEETING_PROPOSAL_ACTION_TEXT" }, target: { prop: "name" } },
                    { source: { key: "MEETING_PROPOSAL_ACTION_DESC" }, target: { prop: "desc" } },
                    { source: { key: "MEETING_PROPOSAL_ACTION_WORKFLOW" }, target: { prop: "workflow.template" } }
                ]
            });

            actions = formatter.format(result.sords[0]);

            return !sol.common.ObjectUtils.isEmpty(actions)
                 ? me.convertToArray(actions)
                 : [];
    },

    convertToArray: function (actions) {
        var me = this;
        return Object.keys(actions)
            .map(function (key) {
                return actions[key];
            }).map(function (action) {
                action.desc = me.getConvertedDescription(action.desc);
                action.$shorten = me.shortenDesc;
                return action;
            });
    },

    /**
    * @private
    * Converts a description
    * @param {String} description
    * @returns {String}
    */
    getConvertedDescription: function (description) {
        var me = this;

        return (me.shouldShortenDescription(description)
        ? me.shortDescription(description)
        : description) || "";
    },

    /**
    * @private
    * Determines if a description should be shorten
    * @param {StringLike} description
    * @returns {Boolean}
    */
    shouldShortenDescription: function (description) {
        var me = this;
        return me.shortenDesc && (description || "").length > me.maxDescLength;
    },

    /**
    * @private
    * shorts a description
    * @param {StringLike} description
    * @returns {String}
    * 
    * TODO: implement sol.common.StringUtils.shortenDescription(str, {maxLength, suffix})?
    */
    shortDescription: function (description) {
        var me = this;
        return (description || "").substr(0, me.maxDescLength - 3) + "...";
  }
});


/**
* @member sol.meeting.ix.services.GetResolutionActionTypes
* @method RF_sol_meeting_service_GetResolutionActionType
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetResolutionActionType(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        service = sol.create("sol.meeting.ix.services.GetResolutionActionTypes", rfParams);

    // TODO: we can implement some generic converter/adapter code to
    // return a Info Object for the Selection Dialog handler
    var result = service
        .process();
    return sol.common.JsonUtils.stringifyQuick(result);
}