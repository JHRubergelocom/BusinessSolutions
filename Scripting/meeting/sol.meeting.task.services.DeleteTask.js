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

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.DeleteTask" });

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
sol.define("sol.meeting.task.ix.services.DeleteTask", {
    extend: "sol.common.ix.ServiceBase",

    requiredConfig: ["objId"],

    mixins: [
        "sol.meeting.task.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    _optimize: {},

    inject: {
        deleteWorkflow: { config: "task", prop: "tasks.services.deleteTask.workflow" }
    },

    deleteTask: function () {
        var me = this, task, result;

        // validate automatically if the object is a meeting task
        task = sol.create("sol.meeting.task.ix.Task", me.objId);

        task.checkPermissions({ rights: { d: true } });

        // start workflow which should have the delete function node
        result = sol.common.WfUtils.startWorkflow(me.deleteWorkflow.name, me.deleteWorkflow.title, me.objId);
        return { flowId: result, objId: me.objId };
    }
});

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_GetTask
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Delete(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
        taskService, result;

    taskService = sol.create("sol.meeting.task.ix.services.DeleteTask", rfParams),
    result = taskService.deleteTask();
    return sol.common.JsonUtils.stringifyQuick(result);
};