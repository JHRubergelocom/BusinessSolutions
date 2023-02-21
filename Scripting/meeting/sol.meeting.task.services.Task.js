importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.task.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.Task" });

/**
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
sol.define("sol.meeting.task.ix.services.Task", {
    extend: "sol.common.ix.ServiceBase",

    mixins: [
        "sol.meeting.task.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    _optimize: {},

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
        me.inject = me.inject || {};
        me.options = me.options || {
            formatAsTemplateSord: false
        };

        if (config.objId) {
            me.inject.sord = { sordIdFromProp: "objId" };
        } else if (config.source) {
            // TODO: config.source should be an object at least
            me.inject.sord = { prop: "source" };
        } else {
            throw Error("Either `objId` or `source` as templateSord must be defined");
        }

        Object.keys(config.inject)
            .forEach(function (key) {
                if (!me.inject[key]) {
                    me.inject[key] = config.inject[key];
                }
            });

        // inject is created dynamically here so we can pass an objId
        // to find reference id or pass a templateSord object
        sol.create("sol.common.Injection").inject(me);
    },

    getTask: function () {
        var me = this, result, task;

        if (me.objId) {
            result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
                ids: [me.objId],
                output: me.output
            }, me._optimize, "tasks", ["output"]);
        } else {
            result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
                masks: me.search.masks,
                search: me.search.search,
                output: me.output,
                options: {
                    maxResult: 1,
                    formatAsTemplateSord: me.options.formatAsTemplateSord
                }
            }, me._optimize, "tasks", ["output"]);

            if (!result || !result.sords || result.sords.length === 0) {
                throw Error("task could not be dertermine");
            }

        }
        task = result.sords[0];
        return task;
    },

    findTasksByReference: function () {
        var me = this, result;

        if (!me.search) {
            throw Error("Configuration Error. search prop is not defined in findTasksByReference");
        }

        result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
            masks: me.search.masks,
            search: me.search.search,
            output: me.output,
            options: {
                formatAsTemplateSord: me.options.formatAsTemplateSord
            }
        }, me._optimize, "tasks", ["output"]);

        return {
            tasks: result.sords
        };
    }

});

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_FindTasks
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_FindTasks(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    rfParams.inject = rfParams.inject || {
        output: { config: "task", prop: "tasks.outputs.taskFull", template: false },
        search: { config: "task", prop: "tasks.services.findTasksByReference", template: true },
    };

    taskService = sol.create("sol.meeting.task.ix.services.Task", rfParams),
    result = taskService.findTasksByReference();
    return sol.common.JsonUtils.stringifyQuick(result);
};

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Get
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Get(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    // will be ignore when objId is set
    rfParams.inject = rfParams.inject || {
        output: { config: "task", prop: "tasks.outputs.taskFull", template: false },
        search: { config: "task", prop: "tasks.services.getTask", template: true },
    };

    taskService = sol.create("sol.meeting.task.ix.services.Task", rfParams),
    result = taskService.getTask();
    return sol.common.JsonUtils.stringifyQuick(result);
};