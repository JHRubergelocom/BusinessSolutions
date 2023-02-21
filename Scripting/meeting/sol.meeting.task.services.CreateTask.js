importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.meeting.task.ix.Task.js
//@include lib_sol.meeting.task.mixins.Configuration.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ObjectUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.CreateTask" });

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
* @requires sol.meeting.task.ix.Task
* @requires sol.common.Injection
* @requires sol.common.DateUtils
* @requires sol.common.Template
* @requires sol.common.TemplateSordUtils
* @requires sol.common.UserUtils
* @requires sol.common.ObjectUtils
*/
sol.define("sol.meeting.task.ix.services.CreateTask", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.task.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  _optimize: {},

  inject: {
    createSordConfig: { config: "task", prop: "tasks.services.createTask", template: true },
    output: { config: "task", prop: "tasks.outputs.taskFull" },
    metadataMapping: { config: "task", prop: "tasks.mapping.createAndEdit" },
    params: { prop: "params" }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.options = me.options || {
      includeResult: false
    };

    // transform objId, guid, arcpath to an objId to check permissions
    me.tasksFolderId = sol.meeting.task.ix.Tasks.findTasksFolder(me.objId).id;

    me.taskAssignee = me.getTaskAssignee();

    // prepare context object for templating
    me.params = {
      tasksFolderId: me.tasksFolderId
    };

    sol.create("sol.common.Injection").inject(me);
  },

  createTaskFromScratch: function () {
    var me = this, taskResult, serviceResult;
    me.checkPermissions(me.tasksFolderId);
    taskResult = me.createTask(me.source);

    serviceResult = {
      params: me.params,
      result: taskResult,
      sord: null
    };

    sol.common.WfUtils.startWorkflow(me.createSordConfig.startWorkflow.name, me.createSordConfig.startWorkflow.title, taskResult.objId);
    if (me.options.includeResult) {
      serviceResult.sord = me.refreshTask(taskResult);
    }

    return serviceResult;
  },

  checkPermissions: function (tasksFolderId) {
    if (!sol.common.AclUtils.hasEffectiveRights(tasksFolderId, { rights: { l: true } })) {
      throw Error("Current User has no list right to current tasklist");
    }

    return true;
  },

  createTask: function (templateSord) {
    var me = this, taskResult, dateWithoutTime, validTaskAssignee, userPermissions;

    if (!templateSord) {
      throw Error("source is not defined and could not use for creating new task");
    }

    dateWithoutTime = me.removeTimeFromDueDateStr(sol.common.TemplateSordUtils.getObjKey(templateSord, "MEETING_TASK_DUEDATE"));

    if (dateWithoutTime) {
      templateSord.objKeys.MEETING_TASK_DUEDATE = dateWithoutTime;
    }

    validTaskAssignee = me.checkUser(sol.common.TemplateSordUtils.getObjKey(templateSord, "MEETING_TASK_ASSIGNEE"));

    if (validTaskAssignee) {
      userPermissions = sol.common.ObjectUtils.getProp(me.createSordConfig.fromService, "params.onCreatedElement.setPermissions.users");
      if (!sol.common.ObjectUtils.isArray(userPermissions)) {
        throw new Error("User permission config is not an array");
      }
      userPermissions.push({
        name: me.taskAssignee,
        rights: me.createSordConfig.const.assigneePermissions
      });
    }

    taskResult = sol.common.IxUtils.execute("RF_sol_function_FillSord", {
      source: { templateSord: templateSord },
      target: {
        fromService: me.createSordConfig.fromService,
        metadataMapping: me.metadataMapping
      },
      options: {
        mandatoryFields: me.createSordConfig.mandatoryFields
      }
    });

    // FillSord currently not supported direclty modified sordKeys
    // so we call Set function when desc should be updated
    if (taskResult && taskResult.objId && templateSord.desc) {
      me.updateTaskContent(taskResult.objId, templateSord.desc);
    }
    // call also to set dynKwl status field
    if (taskResult && taskResult.objId && (templateSord.objKeys || {}).MEETING_TASK_STATUS) {
      me.updateTaskStatus(taskResult.objId, templateSord.objKeys.MEETING_TASK_STATUS);
    }

    return taskResult;
  },

  updateTaskContent: function (objId, desc) {
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

  updateTaskStatus: function (objId, status) {
    status = (status || "").split("-")[0];
    if (!sol.common.StringUtils.isBlank(status)) {
      sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: objId,
        entries: [
          { type: "GRP", key: "MEETING_TASK_STATUS", value: status, useDynKwl: true }

        ]
      });
    }
  },

  refreshTask: function (taskResult) {
    if (!taskResult || !taskResult.objId) {
      throw Error("Task object could not be created or something went wrong. No objId was returned");
    }

    return sol.common.IxUtils.execute("RF_sol_meeting_task_service_Task_Get", {
      objId: taskResult.objId
    });
  },

  removeTimeFromDueDateStr: function (dateTimeStr) {
    return (dateTimeStr) ? sol.common.DateUtils.dateToIso(dateTimeStr, { withoutTime: true }) : dateTimeStr;
  },

  checkUser: function (userName) {
    var searchParams = {}, userNames;

    if (userName) {
      searchParams.name = userName;
      searchParams.visible = true;
      searchParams.excludeLockedUsers = true;
      searchParams.max = 1;
      userNames = sol.common.UserUtils.getUserNames(searchParams);
    }
    return (userNames && userNames.length === 1);
  },

  getTaskAssignee: function () {
    var me = this;
    me.source = me.source || {};
    return sol.common.TemplateSordUtils.getObjKey(me.source, "MEETING_TASK_ASSIGNEE");
  }
});

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_Create
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_Create(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "tasksFolderId"),
      taskService, result;

  taskService = sol.create("sol.meeting.task.ix.services.CreateTask", rfParams),
  result = taskService.createTaskFromScratch();
  return sol.common.JsonUtils.stringifyQuick(result);
}

/**
* @member sol.meeting.task.ix.services.Task
* @method RF_sol_meeting_task_service_Task_CreateItemTask
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_task_service_Task_CreateItemTask(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      taskService, result;

  taskService = sol.create("sol.meeting.task.ix.services.CreateTask", rfParams);
  result = taskService.createTaskFromScratch();
  return sol.common.JsonUtils.stringifyQuick(result);
}