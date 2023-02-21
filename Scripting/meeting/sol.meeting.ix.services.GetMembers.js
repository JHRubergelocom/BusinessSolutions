importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js


var logger = sol.create("sol.Logger", {scope: "sol.meeting.ix.services.GetMembers"});

/**
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.meeting.ix.services.GetMembers", {
    extend: "sol.common.ix.ServiceBase",
    requiredConfig: ["objId"],
    mixins: [
        "sol.meeting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],
    inject: {
        memberSearch: { config: "meetingBoard" , prop: "meetingBoards.services.GetMembers", template: true },
        sord: {sordIdFromProp: "objId", optional: true },
        source: { prop: "sord" } // pass sord: {objKeys: {...}} as object directly
    },

    _optimize: {}, // enables optimization. Will store optimization cache ID

    isSordProvider: function(provider) {
        return provider === "RF_sol_common_service_SordProvider";
    },

    getProvider: function(search) {
        return search.provider || "RF_sol_common_service_SordProvider";
    },

    getOptimizationName: function(search) {
        return search.optimization || "";
    },

    process: function (){
        var me = this, optimizatioName = me.getOptimizationName(me.memberSearch),
            provider = me.getProvider(me.memberSearch),
            args = me.memberSearch.args,
            result = {};

        if (me.isSordProvider(provider)) {

            if (optimizatioName) {
                result =  sol.common.IxUtils
                    .optimizedExecute(provider,
                        args, me._optimize, optimizatioName, ["output"]);
                    me.$debug && (result.useOptimization = true);
                } else {
                result = sol.common.IxUtils.execute(provider, args);
                me.$debug && (result.useOptimization = false);
            }

        } else {
            throw Error("not yet supported - only SordProvider is currently supported");
        }

        if (me.$debug) {
            result.searchParams = me.memberSearch;
        }

        return result
    }
});

/**
 * @member sol.meeting.ix.services.GetMembers
 * @method RF_sol_meeting_service_GetMembers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_meeting_service_GetMembers(context, args) {
    logger.enter("RF_sol_meeting_service_GetMembers", args);
    var params, service, result;

    params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);

    service = sol.create("sol.meeting.ix.services.GetMembers", params);
    result = JSON.stringify(service.process());

    logger.exit("RF_sol_meeting_service_GetMembers", result);
    return result;
}
