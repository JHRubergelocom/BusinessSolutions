importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.SordProvider.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.ix.MeetingRepository.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.ItemContainer" });


/**
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
*/
sol.define("sol.meeting.ix.services.ItemContainer", {
    extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.meeting.mixins.Configuration"
    ],

    inject: {
        itemContainerOutput: { config: "meetingItem", prop: "meetingItem.outputs.itemContainer" },
        templateItemContainer: { config: "meetingItem", prop: "meetingItem.services.createContainerItem.defaultTemplateSord"},
        createFromService: { config: "meetingItem", prop: "meetingItem.services.createContainerItem.fromService", template: false },
        workflow: { config: "meetingItem", prop: "meetingItem.services.createContainerItem.workflow" },
        params: { prop: "params" }
    },

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
        sol.create("sol.common.Injection").inject(me);
    },

    createContainer: function () {
        var me = this, result, searchResult, fillSordConfig, targetFolder = me.targetFolder,
            searchResult,
            templateSord = sol.common.ObjectUtils.clone(me.templateItemContainer);

        sol.common.ObjectUtils.merge(templateSord, me.templateSord);

        fillSordConfig = {
                source: {
                    templateSord: templateSord
                },
                target: {
                    fromService: me.createFromService,
                    startWorkflow: me.workflow
                }
            };

        if (!targetFolder) {
            targetFolder = sol.meeting.ix.MeetingRepository
                .findMeetingItemListFolder(me.meetingId);

        }

        fillSordConfig.target.fromService.params.targetFolder.objId = targetFolder.id;

        me.logger.debug(["create container with fillsord config"], fillSordConfig);

        result = sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);
        if (me.includeResult && result.objId) {
            // TODO: implement MeetinItemRepository getItem function
            searchResult = sol.common.SordProviderUtils.run({
                ids: [result.objId],
                output: me.itemContainerOutput,
                options: {
                    maxResults: 1
                }
            });

            if (searchResult.sords.length === 0) {
                throw Error("could not find created object " + result.objId);
            }

            result.sord = searchResult.sords[0];
        }

        return result;
    }
});

/**
* @member
* @method RF_sol_meeting_service_Item_CreateContainer
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_Item_CreateContainer(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        itemService = sol.create("sol.meeting.ix.services.ItemContainer", rfParams),
     result = itemService.createContainer();
    return sol.common.JsonUtils.stringifyQuick(result);
}