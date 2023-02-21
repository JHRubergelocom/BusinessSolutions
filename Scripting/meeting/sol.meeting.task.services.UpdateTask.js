importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.task.mixins.Configuration.js
//@include lib_sol.meeting.task.ix.Task.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.UpdateTask" });

/**
* 
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.ix.RepoUtils
* @requires sol.common.ix.AclUtils
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.task.ix.services.UpdateTask", {
    extend: "sol.common.ix.ServiceBase",

    requiredConfig: ["objId"],

    mixins: [
        "sol.meeting.task.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    initialize: function (config) {
        var me = this;
        me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
        me.inject = me.inject || {};
        me.options = me.options || {};

        if (!config.objId && !config.source) {
            throw Error("Either `objId` or `source` as templateSord must be defined");
        }

        if (config.objId) {
            me.inject.sord = { sordIdFromProp: "objId" };
        } else if (config.source) {
            // TODO: config.source should be an object at least
            me.inject.sord = { prop: "source" };
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

    updateTask: function () {
        var me = this, task, taskResult, serviceResult = {},
            templateSord = me.templateSord || {};

        // validate automatically whether the object is a meeting task
        task = sol.create("sol.meeting.task.ix.Task", me.objId);
        task.checkPermissions({ rights: { w: true } });

        taskResult = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
            source: {
                templateSord: templateSord
            },
            target: {
                objId: me.objId,
                startWorkflow: me.updateConfig.startWorkflow,
                metadataMapping: me.metadataMapping,
            }
        });

        serviceResult.result = taskResult;

         // FillSord currently not supported direclty modified sordKeys
        // so we call Set function when desc should be updated
        if (taskResult && taskResult.objId && templateSord.desc) {
            sol.meeting.task.ix.Tasks.updateDesc(taskResult.objId, templateSord.desc);
        }

        if (me.options.includeResult) {
            serviceResult.task = sol.meeting.task.ix.Tasks.get({ objId: taskResult.objId });
        }

        return serviceResult;
    }
});

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Done
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Done(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    rfParams.inject = {
        updateConfig: { config: "task", prop: "tasks.services.doneTask" },
    };

    taskService = sol.create("sol.meeting.task.ix.services.UpdateTask", rfParams),
    result = taskService.updateTask();
    return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Open
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Open(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    rfParams.inject = {
        updateConfig: { config: "task", prop: "tasks.services.openTask" },
    };

    taskService = sol.create("sol.meeting.task.ix.services.UpdateTask", rfParams),
    result = taskService.updateTask();
    return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Close
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Close(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    rfParams.inject = {
        updateConfig: { config: "task", prop: "tasks.services.closeTask" },
    };

    taskService = sol.create("sol.meeting.task.ix.services.UpdateTask", rfParams),
    result = taskService.updateTask();
    return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Edit
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Edit(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
        taskService, result;

    rfParams.inject = {
        updateConfig: { config: "task", prop: "tasks.services.editTask" },
        metadataMapping: { config: "task", prop: "tasks.mapping.createAndEdit" }
    };
    taskService = sol.create("sol.meeting.task.ix.services.UpdateTask", rfParams),
    result = taskService.updateTask();
    return sol.common.JsonUtils.stringifyQuick(result);
}