
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.hr.mixins.Configuration.js

/**
 * Creates a personnel file based on a sord-definition (templatesord).
 *
 * This class contains two Indexserver Functions. Both functions accept the same parameters.
 *
 * ### RF_sol_hr_function_CreatePersonnelFileHeadless
 *
 * Creates a personnel file.
 *
 * ### RF_sol_hr_function_CreatePersonnelFileHeadlessStrict
 *
 * Before creating the file, this function checks, if the sord-definition (templatesord)
 * contains any metadata-fields which are protected.
 *
 * Protected fields are defined in the hr.config. (see `_protectedFields` injection in source code for exact config-property)
 *
 * Note: "Mandatory fields" (`_mandatoryFields` injection), unlike protected fields, will be checked not only in the strict, but also in the non-strict version.
 *
 * ## Templates
 *
 * Personnel files must be created based on the personnel file templates located in the repository path:
 *
 *     Business Solutions Custom/hr/Configuration/Personnel file types
 *
 * To specify which template to use, the templates folder name (short description) must be passed as a parameter. Please take a look at the exemplary function calls below.
 *
 * ## Mapping metadata
 *
 * If the `sordMetadata` parameter is defined, the data which is passed to the function should (preferably) already be compatible to the personnel file data-model.
 *
 * However, one can also define an additional {@link sol.common.ix.services.GenerateSetInstructions mapping}, e.g. if the data for the new personnel file should be fetched from an existing sord using the `objId`-Parameter.
 *
 * ### Examples
 *
 * ### Create a personnel file by sord-definition (templatesord)
 *
 *     {
 *       template: { name: "Default" }
 *       sordMetadata: {
 *         objKeys: {
 *           HR_PERSONNEL_FIRSTNAME: "Max",
 *           HR_PERSONNEL_LASTNAME: "Mustermann",
 *         }.
 *         mapKeys: {
 *           HR_PERSONNEL_STREETADDRESS: "Schwabstrasse"
 *         }
 *       }
 *     }
 *
 * ### Create a personnel file based on a sord (fetch templateSord by objId/flowId)
 *
 *     {
 *       template: { name: "Trainee" },
 *       metadataMapping: [
 *         { source: { id: "RECRUITING_CANDIDATE_FIRSTNAME", type: "GRP" }, target: { id: "HR_PERSONNEL_FIRSTNAME", type: "GRP" } }
 *       ],
 *       objId: "12345",
 *       flowId: "323"
 *     }
 *
 * ### Return value
 *
 * Both functions return an object on success:
 *
 *     { code: "success", data: { "objId": "499293", flowId: 12 } , info: "Personnel file created successfully" }
 *
 * A flow Id is returned only, if a workflow has been started on the created file.
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
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.hr.ix.functions.CreatePersonnelFileHeadless", {
  extend: "sol.common.ix.FunctionBase",
  /**
  * @cfg {Object} template Defines, which personnel file type should be used as the template for creating a new personnel file
  * @cfg {String} template.name Short-description/folder name of the template
  *
  * @cfg {Object} sordMetadata This data will be written to the new personnel file (`sordMetadata` has precedence over `objId`)
  * @cfg {Object} sordMetadata.objKeys (optional) These fields will be written as GRP-fields (object keys). These fields must exist in the template!
  * @cfg {String} sordMetadata.objKeys.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  * @cfg {String} sordMetadata.mapKeys (optional) These fields will be written as MAP-fields (map items)
  * @cfg {String} sordMetadata.mapKeys.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  * @cfg {String} sordMetadata.formBlobs (optional) These fields will be written as BLOB-fields
  * @cfg {String} sordMetadata.formBlobs.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  *
  * @cfg {String} objId If no `sordMetadata` is defined, sord-data will be fetched from this objId/ARCPATH/GUID
  * @cfg {String} flowId (optional) if fields which are stored in the workflow map of the sord are required in the `metadataMapping`
  *
  * @cfg {Object[]} metadataMapping (optional) {@link sol.common.ix.services.GenerateSetInstructions Mappings}, which specify how data from the templatesord should be mapped to the target sord.
  */

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _shortDescription: { config: "hr", prop: "entities.file.actions.create.const.temporaryAttributes.shortDescription", template: true }, // ""
    _templateService: { config: "hr", prop: "entities.file.actions.createheadless.const.templateService" }, // ""
    _standardWorkflow: { config: "hr", prop: "entities.file.actions.createheadless.const.standardWorkflow" }, // ""
    _workflowMessage: { config: "hr", prop: "entities.file.actions.createheadless.const.workflowMessage", template: true }, // "",
    _protectedFields: { config: "hr", prop: "entities.file.actions.createheadless.protectedFields" }, // []
    _mandatoryFields: { config: "hr", prop: "entities.file.actions.createheadless.mandatoryFields" } // []
  },

  getTemplates: function (serviceName) {
    return sol.common.IxUtils.execute(serviceName, {});
  },

  getTemplateObjIdByName: function (templateName) {
    var me = this, template;
    template = sol.common.ObjectUtils.getProp(me.getTemplates(me._templateService), templateName, "name");
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

  process: function () {
    var me = this, fillSordConfig, createSordConfig, createdFile;

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
          concluding: true  // after personnel file has been filled with metadata
          // this means, you can't set WFMAP fields in Mapping as target.
        }
      },
      options: {}
    };

    // in workflows we typically don't want to include arbitrary wf-temporary fields in the set instructions
    // since we would've to map (exclude) each possible field which could be impossible
    fillSordConfig.options.onlyWriteMappings = me.flowId && !(me.sordMetadata);

    fillSordConfig.metadataMapping = me.metadataMapping || [];
    fillSordConfig.options.protectedFields = me.protectFields ? me._protectedFields : [];
    fillSordConfig.options.mandatoryFields = (Array.isArray(me._mandatoryFields) && me._mandatoryFields.length > 0) ? me._mandatoryFields : [];

    createdFile = sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);

    return { code: "success", data: createdFile, info: "Personnel file created successfully" };
  }
});


/**
 * @member sol.hr.ix.functions.CreatePersonnelFileHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.hr.ix.functions.CreatePersonnelFileHeadless", params);

  fun.process();
}

/**
 * @member sol.hr.ix.functions.CreatePersonnelFileHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.hr.ix.functions.CreatePersonnelFileHeadless", params);

  fun.process();
}


/**
 * @member sol.hr.ix.functions.CreatePersonnelFileHeadless
 * @method RF_sol_hr_function_CreatePersonnelFileHeadless
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_CreatePersonnelFileHeadless(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  rfArgs.protectFields = false;

  fun = sol.create("sol.hr.ix.functions.CreatePersonnelFileHeadless", rfArgs);

  return JSON.stringify(fun.process());
}

/**
 * @member sol.hr.ix.functions.CreatePersonnelFileHeadless
 * @method RF_sol_hr_function_CreatePersonnelFileHeadlessStrict
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_CreatePersonnelFileHeadlessStrict(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  rfArgs.protectFields = true;

  fun = sol.create("sol.hr.ix.functions.CreatePersonnelFileHeadless", rfArgs);

  return JSON.stringify(fun.process());
}
