
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Creates a session based on the passed templateSord and a template.
 * Uses the same service and templates as the standard CreateSession Action.
 * Returns the created session's objId.
 *
 * Please only use workflow-functions or RF_sol_learning_function_CreateSessionHeadlessStrict.
 * If you use RF_sol_learning_function_CreateSessionHeadless, important fields are not protected.
 *
 * ### Example
 *
 * #### Arguments
 *     {
 *          "template": {
 *            "name": "Online"
 *          },
 *          "sordMetadata": {
 *            "objKeys": {
 *              "COURSE_REFERENCE": "0001"
 *              "SESSION_START_TIME": "201801010000000"
 *            }
 *          }
 *     }
 *
 * #### Returns
 *
 *     { code: "success", data: { objId: "12345", flowId: "33" }, info: "Session created successfully" }
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.functions.CreateSessionHeadless", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  _optimize: {},

  inject: {
    _templateService: { config: "learning", prop: "entities.session.actions.createheadless.const.templateService" }, // ""
    _templateServiceTargetPath: { config: "learning", prop: "entities.session.actions.createheadless.const.templateServiceTargetPath" }, // ""
    _standardWorkflow: { config: "learning", prop: "entities.session.actions.createheadless.const.standardWorkflow" }, // ""
    _workflowMessage: { config: "learning", prop: "entities.session.actions.createheadless.const.workflowMessage", template: true }, // ""
    _protectedFields: { config: "learning", prop: "entities.session.actions.createheadless.protectedFields" }, // []
    _mandatoryFields: { config: "learning", prop: "entities.session.actions.createheadless.mandatoryFields" }, // []
    _course: { config: "learning", prop: "entities.session.actions.createheadless.findCourse" } // {}
  },

  getTemplates: function (serviceName, serviceArgs) {
    return sol.common.IxUtils.execute(serviceName, serviceArgs);
  },

  getTemplateObjIdByName: function (templateName) {
    var me = this, template;
    template = sol.common.ObjectUtils.getProp(me.getTemplates(me._templateService, { $types: { path: me._templateServiceTargetPath } }), templateName, "name");
    if (template && template.objId) {
      return String(template.objId);
    } else {
      throw "Could not determine template objId for template `" + templateName + "`";
    }
  },

  getTemplateObjId: function (templateConfig) {
    var me = this;
    if (templateConfig.objId) {
      return (templateConfig.objId.indexOf("{{") < 0) ? templateConfig.objId : sol.common.TemplateUtils.render(templateConfig.objId, me.getSord(me.objId, me.flowId));
    } else if (templateConfig.name) {
      return me.getTemplateObjIdByName(
        (templateConfig.name.indexOf("{{") < 0) ? templateConfig.name : sol.common.TemplateUtils.render(templateConfig.name, me.getSord(me.objId, me.flowId))
      );
    }
  },

  getSource: function () {
    var me = this, source = {};
    if (me.sordMetadata) {
      source.templateSord = me.sordMetadata;
    } else if (me.objId) {
      source.objId = String(me.objId);
      if (me.flowId) {
        source.flowId = String(me.flowId);
      }
    } else {
      throw "No parameters `sordMetadata` or `objId` defined. FillSord requires one of these.";
    }
    return source;
  },

  getSord: function (objId, flowId) {
    if (objId) {
      return { sord:
        sol.common.WfUtils.getTemplateSord(ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO), flowId).sord
      };
    } else {
      throw "No parameter `objId` defined. Therefore, no sord can be checked out.";
    }
  },

  determineCriterion: function (param, key, desc, throws) {
    var me = this, criterionMapping, criterion;
    if (me[param]) {
      criterion = me[param];
    } else if (me.sordMetadata && me.sordMetadata.objKeys) {
      criterion = me.sordMetadata.objKeys[key];
    } else if (me.metadataMapping) {
      me.metadataMapping
        .some(function (mapping) {
          return (mapping.target && (mapping.target.id === key)) && (criterionMapping = mapping);
        });
      if (criterionMapping) {
        criterion = criterionMapping.target.value;
      }
    }

    if (throws && !criterion) {
      throw "Call did not contain a " + desc + "! (`" + param + "` paramenter)";
    }

    return criterion;
  },

  courseExists: function (course) {
    var me = this;

    me._course.search.push(
      { key: "COURSE_REFERENCE", value: course }
    );

    return !!(sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._course, me._optimize, "findExistingCourse", ["output"]).sords[0]);
  },

  process: function () {
    var me = this, fillSordConfig, createSordConfig, createdSession, course, throws = true;

    course = me.determineCriterion("course", "COURSE_REFERENCE", "course reference", throws);

    if (!me.courseExists(course)) {
      throw "Course `" + course + "` does not exist! Did not create session.";
    }

    createSordConfig = {
      sourceElement: {
        options: {
          copySourceAcl: true
        }
      },
      targetFolder: {
        objId: "0"
      },
      onCreatedElement: {
        setName: me._shortDescription
      }
    };

    createSordConfig.sourceElement.objId = me.getTemplateObjId(me.template);
    if (!createSordConfig.sourceElement.objId) {
      throw "Headless Create: No parameters `objId` or `name` defined in `template`!";
    } else {
      createSordConfig.sourceElement.objId = String(createSordConfig.sourceElement.objId);
    }

    fillSordConfig = {
      source: me.getSource(),
      target: {
        fromService: {
          name: "RF_sol_function_CreateSord",
          params: createSordConfig
        },
        startWorkflow: {
          name: me._standardWorkflow,
          title: me._workflowMessage,
          concluding: true  // after Session has been filled with metadata
          // this means, you can't set WFMAP fields in Mapping as target.
        }
      },
      options: {}
    };

    // in workflows we typically don't want to include arbitrary wf-temporary fields in the set instructions
    // since we would've to map (exclude) each possible field which could be impossible
    fillSordConfig.options.onlyWriteMappings = me.flowId && !(me.sordMetadata);

    fillSordConfig.metadataMapping = (me.metadataMapping || []);
    fillSordConfig.options.protectedFields = me.protectFields ? me._protectedFields : [];
    fillSordConfig.options.mandatoryFields = (Array.isArray(me._mandatoryFields) && me._mandatoryFields.length > 0) ? me._mandatoryFields : [];

    createdSession = sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);

    return { code: "success", data: createdSession, info: "Session created successfully" };
  }
});

/**
 * @member sol.learning.ix.functions.CreateSessionHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.learning.ix.functions.CreateSessionHeadless", params);

  fun.process();
}

/**
 * @member sol.learning.ix.functions.CreateSessionHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.learning.ix.functions.CreateSessionHeadless", params);

  fun.process();
}


/**
 * @member sol.learning.ix.functions.CreateSessionHeadless
 * @method RF_sol_learning_function_CreateSessionHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateSessionHeadless(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  rfArgs.protectFields = false;  // writing to all fields is allowed

  fun = sol.create("sol.learning.ix.functions.CreateSessionHeadless", rfArgs);

  return JSON.stringify(fun.process());
}

/**
 * @member sol.learning.ix.functions.CreateSessionHeadlessStrict
 * @method RF_sol_learning_function_CreateSessionHeadlessStrict
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_learning_function_CreateSessionHeadlessStrict(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  rfArgs.protectFields = true;  // only certain fields can be included in the templateSord/mapping

  fun = sol.create("sol.learning.ix.functions.CreateSessionHeadless", rfArgs);

  return JSON.stringify(fun.process());
}
