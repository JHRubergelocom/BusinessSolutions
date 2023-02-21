
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Updates a personnel file's metadata based on a sord-definition (templatesord).
 *
 * This class contains two Indexserver Functions. Both functions accept the same parameters.
 *
 * ### RF_sol_hr_function_UpdatePersonnelFileMetadata
 *
 * Updates a personnel file's metadata.
 *
 * ### RF_sol_hr_function_UpdatePersonnelFileMetadataStrict
 *
 * Before updating the file, this function checks, if the sord-definition (templatesord)
 * contains any metadata-fields which are protected.
 *
 * Protected fields are defined in the hr.config. (see `_protectedFields` injection in source code for exact config-property)
 *
 * Note: "Mandatory fields" (`_mandatoryFields` injection), unlike protected fields, will be checked not only in the strict, but also in the non-strict version.
 *
 * ## Mapping metadata
 *
 * If the `sordMetadata` parameter is defined, the data which is passed to the function should (preferably) already be compatible to the personnel file data-model.
 *
 * However, one can also define an additional {@link sol.common.ix.services.GenerateSetInstructions mapping}, e.g. if the data for the new personnel file should be fetched from an existing sord using the `objId`-Parameter.
 *
 * ### Examples
 *
 * ### Update a personnel file by sord-definition (templatesord)
 *
 *     {
 *       file: "(14606C0A-A583-4FC3-6D72-E9BF3A36E326)",
 *       sordMetadata: {
 *         objKeys: {
 *           HR_PERSONNEL_FIRSTNAME: "Max",
 *           HR_PERSONNEL_LASTNAME: "Mustermann",
 *         }.
 *         mapKeys: {
 *           HR_PERSONNEL_STREETADDRESS: "Schwabstrasse"
 *         }
 *       },
 *       startWorkflow: { name: "sol.hr.personnel.File.Update" }
 *     }
 *
 * Instead of a GUID. It is also possible to pass a personnel no.
 *
 * ### Return value
 *
 * Both functions return an object on success:
 *
 *     { code: "success" }
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
sol.define("sol.hr.ix.functions.UpdatePersonnelFileMetadata", {
  extend: "sol.common.ix.FunctionBase",
  /**
  * @cfg {Object} sordMetadata This data will be written to the new personnel file
  * @cfg {Object} sordMetadata.objKeys (optional) These fields will be written as GRP-fields (object keys). These fields must exist in the target personnel file!
  * @cfg {String} sordMetadata.objKeys.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  * @cfg {String} sordMetadata.mapKeys (optional) These fields will be written as MAP-fields (map items)
  * @cfg {String} sordMetadata.mapKeys.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  * @cfg {String} sordMetadata.formBlobs (optional) These fields will be written as BLOB-fields
  * @cfg {String} sordMetadata.formBlobs.* The property-name will be used as the target field-name. The property-value will be written to the target field.
  *
  * @cfg {Object[]} metadataMapping (optional) {@link sol.common.ix.services.GenerateSetInstructions Mappings}, which specify how data from the templatesord should be mapped to the target sord.
  *
  * @cfg {Object} startWorkflow (optional) starts a workflow on the target sord before setting data
  * @cfg {String} startWorkflow.name workflow template name
  * @cfg {String} [startWorkflow.title = "Workflow"] (optional) specifies the workflow-title
  */

  _optimize: {}, // enables optimization. Will store optimization cache IDs

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _targetConfigs: { config: "hr", prop: "entities.file.functions.updatefilemetadata.targetConfigs" }, // {}
    _protectedFields: { config: "hr", prop: "entities.file.functions.updatefilemetadata.protectedFields" }, // []
    _mandatoryFields: { config: "hr", prop: "entities.file.functions.updatefilemetadata.mandatoryFields" } // []
  },

  optimizedExecute: function (rf, config, optimization) {
    var me = this, result;
    optimization = optimization || "_";
    config.optimize = me._optimize[optimization] || true;  // add optimize === true or (in consecutive runs) optimization cache ID to config
    if (me._optimize[optimization]) {
      config.output = undefined;  // output will be ignored by target function anyways, since it is stored in the cache
    }
    result = sol.common.IxUtils.execute(rf, config);
    me._optimize[optimization] = result.optimization;  // store optimization cache ID in class cache
    return result;
  },

  getTargetConfig: function (file) {
    var me = this, rfConfig, id, objId, result;

    if (file) {
      id = String(file);
      if (id.search(/^\(\w+-\w+-\w+-\w+-\w+\)$/g) === 0) {
        rfConfig = me._targetConfigs.byGuid; // checkout via guid -> get objId
        rfConfig.id = id;
        objId = me.optimizedExecute("RF_sol_common_service_SordProvider", rfConfig, "byGuid").sords[0];
      } else {
        rfConfig = me._targetConfigs.byNo; // search using personnelno -> get objId
        rfConfig.search.push({ key: me._targetConfigs.byNo.personnelNoField, value: id });
        objId = me.optimizedExecute("RF_sol_common_service_SordProvider", rfConfig, "byNo").sords[0];
      }
    } else {
      throw "`file` parameter must contain a proper guid or personnel file number";
    }

    result = { objId: objId };
    if (sol.common.ObjectUtils.type(me.startWorkflow, "object")) {
      me.startWorkflow.concluding = true;
      result.startWorkflow = me.startWorkflow;
    }

    return result;
  },

  process: function () {
    var me = this, fillSordConfig;

    fillSordConfig = {
      source: me.sordMetadata ? { templateSord: me.sordMetadata } : { objId: me.objId, flowId: me.flowId },
      target: me.getTargetConfig(me.file),
      options: {}
    };

    fillSordConfig.metadataMapping = me.metadataMapping || [];
    fillSordConfig.options.protectedFields = me.protectFields ? me._protectedFields : [];
    fillSordConfig.options.mandatoryFields = (Array.isArray(me._mandatoryFields) && me._mandatoryFields.length > 0) ? me._mandatoryFields : [];

    sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);

    return { code: "success" };
  }
});

/**
 * @member sol.hr.ix.functions.UpdatePersonnelFileMetadata
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  fun = sol.create("sol.hr.ix.functions.UpdatePersonnelFileMetadata", params);

  fun.process();
}

/**
 * @member sol.hr.ix.functions.UpdatePersonnelFileMetadata
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.hr.ix.functions.UpdatePersonnelFileMetadata", params);

  fun.process();
}

/**
 * @member sol.hr.ix.functions.UpdatePersonnelFileMetadata
 * @method RF_sol_hr_function_UpdatePersonnelFileMetadata
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_UpdatePersonnelFileMetadata(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  rfArgs.protectFields = false;

  fun = sol.create("sol.hr.ix.functions.UpdatePersonnelFileMetadata", rfArgs);

  return JSON.stringify(fun.process());
}

/**
 * @member sol.hr.ix.functions.UpdatePersonnelFileMetadata
 * @method RF_sol_hr_function_UpdatePersonnelFileMetadataStrict
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_UpdatePersonnelFileMetadataStrict(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);

  rfArgs.protectFields = true;

  fun = sol.create("sol.hr.ix.functions.UpdatePersonnelFileMetadata", rfArgs);

  return JSON.stringify(fun.process());
}
