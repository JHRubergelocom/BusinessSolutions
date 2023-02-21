importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.ix.Meeting.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.AgendaPool" });

/**
* Provides service functions for meeting
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.ix.services.AgendaPool", {
    extend: "sol.common.ix.ServiceBase",

    /**
     *
     * @cfg {Boolean} excludeAgendaPool if set to true all agenda items with MEETING_ITEM_DAYINDEX=0 will ignore
     */

    requiredConfig: ["objId"],

    mixins: [
        "sol.meeting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    inject: {
        itemOutput: { config: "meeting", prop: "entities.meetingitem.outputs.itemFull", template: false },
        agendapoolSearchConfig: { config: "meeting", prop: "entities.meeting.services.getAgendaPool", template: true },
        sord: { sordIdFromProp: "objId", optional: true }
    },

    _optimizations: {},

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
        me.meeting = sol.create("sol.meeting.ix.Meeting", me.objId);
    },

    getAgendaPool: function () {
        var me = this, result;

        result = {
            agendapool: me.findItems()
        };

        return result;
    },

    findItems: function () {
        var me = this, itemsConfig, result,
            reference = me.meeting.getReference();

        if (!reference) {
            throw Error("missing field value MEETING_REFERENCE in object " + me.objId);
        }

        logger.debug("find meeting reference", reference);

        itemsConfig = {
            masks: me.agendapoolSearchConfig.masks,
            search: me.agendapoolSearchConfig.search,
            options: {
                formatAsTemplateSord: false
            },
            output: me.itemOutput
        };

        result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider",
            itemsConfig, me._optimizations, "agendapool", ["output"]);

        return result;
    }
});

/**
* @member sol.meeting.ix.services.GetMeeting
* @method RF_sol_meeting_service_GetMeeting
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_AgendaPool_Get(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
        meetingService = sol.create("sol.meeting.ix.services.AgendaPool", rfParams),
     result = meetingService.getAgendaPool();
    return sol.common.JsonUtils.stringifyQuick(result);
}