//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.IxUtils.js
/**
 *
 */
sol.define("sol.meeting.task.ix.Task", {

    initialize: function (objId) {
        var me = this;
        me.objId = objId;
        me.sord = me.validateAndGet(objId);
        me.$super("sol.Base", "initialize", [objId]);
    },


    validateAndGet: function (objId) {
        var me = this, task;

        task = sol.common.RepoUtils.getSord(objId);
        if (!task || !"MEETING_TASK".equals(sol.common.SordUtils.getObjKeyValue(task, "SOL_TYPE"))) {
            throw Error("Reading meeting task failed. Passed object with name '" + (task.name || "undefined") + "' is not of type meeting");
        }
        if (task.deleted === true) {
            throw Error("Reading meeting task failed. Object with id '" + me.objId + " has been deleted");
        }
        return task;
    },

    checkPermissions: function (permissions) {
        var me = this;
        if (!sol.common.AclUtils.hasEffectiveRights(me.objId, permissions)) {
            throw Error("Current User has no delete right to current task");
        }
    }

});


sol.define("sol.meeting.task.ix.Tasks", {

    singleton: true,

    /**
     * 
     * @param {*} options.objId
     * @returns {sol.meeting.task.ix.Task}
     */
    get: function (options) {
        options = options || {};
        if (!options.objId) {
            throw Error("objId must be set");
        }
        return sol.common.IxUtils.execute("RF_sol_meeting_task_service_Task_Get", {
            objId: options.objId
        });
    },

    updateDesc: function (objId, desc) {
        if (!objId) {
            throw Error("objId must be set");
        }

        if (!sol.common.StringUtils.isBlank(desc)) {
            sol.common.IxUtils.execute("RF_sol_function_Set", {
                objId: objId,
                entries: [
                    // TODO: sanitize content before write to elo
                    { type: "SORD", key: "desc", value: desc }
                ]
            });
        }
    },

    /**
    * Determine voting root folder within
    *
    * @param
    * @return {de.elo.ix.client.Sord} Sord
    */
    findTasksFolder: function (objId, solType) {
        var me = this, result,
        _solType = solType || "ITEM_TASKS_STRUCTURE";

        if (!objId) {
            throw Error("objId must be defined to determine voting folder");
        }

        result = sol.common.RepoUtils.findChildren(objId, {
            level: 1,
            includeDocuments: false,
            objKeysObj: {
                SOL_TYPE: _solType
            }
        });

        if (!result || result.length === 0) {
        throw Error("Tasks folder is missing in objId=" + objId + ", solType=" + _solType);
        }

        if (result && result.length > 1) {
        me.logger.warn("item folder contains multiple tasks folders. Use first match " + result[0].id);
        }

        return result[0];
  }

});