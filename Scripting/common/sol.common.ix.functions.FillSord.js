
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

/**
 * Fills a sord with data using another sord, pulled by objId/flowId or predefined templateSord.
 * Returns the objId (and flowId, if a workflow has been started) of the created element which has been written to.
 *
 * This function can be used in conjunction with {@link sol.common.ix.functions.CreateSord CreateSord}, which
 * can be used to create a sord. This means, you can create a sord and fill it with data all in one step if you
 * use the CreateSord RF as the `target`-service
 *
 * ### Filling a sord using an objId
 *
 * Writing all fields from one sord to another
 *     {
 *       source: { objId: "12341" },
 *       target: { objId: "64432" }
 *     }
 *
 * To only write specific fields, add the following:
 *
 *     {
 *       source: { objId: "12341" },
 *       metadataMapping: [
 *         { source: { id: "MY_FIELD", type: "GRP" }, target: { id: "MY_FIELDB", type: "GRP" } },
 *         { source: { id: "MY_MAPFIELD", type: "MAP" }, target: { id: "MY_MAPFIELD", type: "MAP" } }
 *       ],
 *       options: { onlyWriteMappings: true },
 *       target: { objId: "64432" }
 *     }
 *
 * ### Starting a workflow on target after all fields have been written
 *
 * If you'd like to start a workflow on the target sord after all fields have been written,
 * define the following
 *
 *     {
 *       source: { objId: "12341" },
 *       target: {
 *         objId: "64432",
 *         startWorkflow: {
 *           name: "sol.mysolution.Caniddate.CreateHeadless",
 *           title: "sol.wf.localization.message",
 *           concluding: true
 *         }
 *       }
 *     }
 *
 *
 * ### Starting a workflow on target before writing metadata
 *
 * If you'd like to start a workflow on the target sord before the data
 * is being written to it (e.g. if setting WF-fields is required),
 * you can omit the "concluding" option from the `startWorkflow` definition.
 *
 * Attention! Fields will then be written concurrently to the started/running workflow.
 * This means, that the workflow must start with a user-node.
 * Otherwise, the workflow might be over, before FillSords can write anything
 * to the sord.
 *
 * ### Examples
 *
 * ### Create a sord from another sord, templateSord as data source, mandatory field and workflow
 *
 * #### Arguments
 *
 *     {
 *       "source": {
 *         "templateSord": {
 *           "mapKeys": {
 *             "RECRUITING_CANDIDATE_PRIVATEEMAIL": "es@elo.com",
 *             "RECRUITING_CANDIDATE_PRIVATEPHONE": "0711071133"
 *           },
 *           "objKeys": {
 *             "RECRUITING_CANDIDATE_FIRSTNAME": "Max",
 *             "RECRUITING_CANDIDATE_LASTNAME": "Mustermann",
 *             "RECRUITING_CANDIDATE_CITY": "Stuttgart"
 *           }
 *         }
 *       },
 *       "target": {
 *         "fromService": {
 *           "name": "RF_sol_function_CreateSord",
 *           "params": {
 *             "sourceElement": {
 *               "options": {
 *                 "copySourceAcl": true
 *               },
 *               "objId": "3674"
 *             },
 *             "targetFolder": {
 *               "objId": "0"
 *             },
 *             "onCreatedElement": {}
 *           }
 *         },
 *         "startWorkflow": {
 *           "name": "sol.mysolution.Candidate.CreateHeadless",
 *           "title": "sol.wf.localization.message",
 *           "concluding": true
 *         }
 *       },
 *       "options": {
 *         "mandatoryFields": [
 *           {
 *             "type": "GRP",
 *             "id": "RECRUITING_CANDIDATE_LASTNAME"
 *           }
 *         ]
 *       }
 *     }
 *
 * #### Return value
 *
 *     {
 *       objId: "3982",
 *       flowId: "89"
 *     }
 *
 * ### Create a sord from scratch, use the sord active in a workflow as data source, start a workflow
 *
 * #### Arguments
 *
 *     {
 *       "source": {
 *         "objId": "fromParams",
 *         "flowId": "fromParams"
 *       },
 *       "target": {
 *         "fromService": {
 *           "name": "RF_sol_function_CreateSord",
 *           "params": {
 *             "sourceElement": { "fromScratch": { "mask": "My Keywording Form", "type": "MyType" } }
 *           }
 *         },
 *         "startWorkflow": {
 *           "name": "sol.mysolution.Candidate.DoSomething",
 *           "title": "sol.wf.localization.message",
 *           "concluding": true
 *         }
 *       },
 *       "metadataMapping": [
 *         { "source": { "id": "MY_FIELD", "type": "GRP" }, "target": { "id": "MY_FIELDB", "type": "GRP" } },
 *         { "source": { "id": "MY_MAPFIELD", "type": "MAP" }, "target": { "id": "MY_MAPFIELD", "type": "MAP" } }
 *       ],
 *       "options": { "onlyWriteMappings": true }
 *     }
 *
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.Template
 * @requires sol.common.ObjectUtils
 *
 */
sol.define("sol.common.ix.functions.FillSord", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {Object} source Defines, which sord should be used as a data source for setting data on the target sord
   * @cfg {String} source.objId objId/ARCPATH/GUID of sord to use as data source. If "fromParams" is defined, the objId parameter will be used as the value (e.g. in workflow nodes).
   * @cfg {String} source.flowId flowId of the sord (optional) if workflow fields of data source should be available. If "fromParams" is defined, the flowId parameter will be used as the value (e.g. in workflow nodes).
   * @cfg {String} source.templateSord (optional) a templateSord which can be used as data source instead of an objId. Either templateSord or objId must be defined!
   * @cfg {Object} source.fromService (optional) defines a service which must return an Object containing an `objId`(, `flowId`) or `templateSord`
   * @cfg {String} source.fromService.name IX-RF name
   * @cfg {Boolean} [source.fromService.template = false] (optional) When true then `source.fromService.params` will be resolved by Handlebar renderer. Currently only the Id (objId or the id "fromParams") is loaded into the context
   * @cfg {Object} [source.fromService.params = {}] (optional) argument which will be passed to the defined service
   */

  /**
   * @cfg {Object[]} metadataMapping (optional) if any fields from the data-source should be mapped to a different field/value (see {@link sol.common.ix.services.GetSetInstructions GetSetInstructions}
   * @cfg {Object} metadataMapping.Object
   * @cfg {Object} metadataMapping.Object.source (optional)
   * @cfg {String} metadataMapping.Object.source.id name of source field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} metadataMapping.Object.source.type type of field
   * @cfg {Object} metadataMapping.Object.target (optional)
   * @cfg {String} metadataMapping.Object.target.id name of target field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} metadataMapping.Object.target.type type of field
   * @cfg {String} metadataMapping.Object.target.value (optional) fixed or template String. This is completely optional!
   */

  /**
   * @cfg {Object} target (optional) Defines the sord, on which the data will be set
   * @cfg {String} target.objId objId/ARCPATH/GUID of folder to put created sord in. If "fromParams" is defined, the objId parameter will be used as the value (e.g. in workflow nodes).
   * @cfg {String} target.flowId flowId of the sord (optional) if workflow fields of data source should be available. If "fromParams" is defined, the flowId parameter will be used as the value (e.g. in workflow nodes).
   * @cfg {Object} target.fromService (optional) defines a service which must return an Object containing an `objId` (or `path` not implemented yet, see above) definition
   * @cfg {String} target.fromService.name IX-RF name
   * @cfg {Object} [target.fromService.params = {}] (optional) argument which will be passed to the defined service
   * @cfg {Object} target.startWorkflow (optional) starts a workflow on the target sord before setting data
   * @cfg {String} target.startWorkflow.name workflow template name
   * @cfg {String} [target.startWorkflow.title = "Workflow"] (optional) specifies the workflow-title
   * @cfg {Boolean} [target.startWorkflow.concluding = false] (optional) if set to true, the workflow will be startet after all values have been set. Hence, no WF-fields can be set
   */

  /**
   * @cfg {Object} options (optional)
   * @cfg {Boolean} [options.reverseSourceAndTarget = false] (optional) switches `source` and `target` definitions
   * @cfg {Boolean} [options.reverseMetadataMapping = false] (optional) switches `source` and `target` definitions inside the `metadataMapping`
   * @cfg {Boolean} [options.escapeHTML = false] (optional) if true, HTML characters will be escaped
   * @cfg {Boolean} [options.onlyWriteMappings = false] (optional) only fields defined in the `metadataMapping` will be set on the target.
   * @cfg {Boolean} [options.emptyNonRenderedTemplates = true] (optional) empty set-value if handlebars could not render template
   * @cfg {Object[]} options.protectedFields (optional) any fields which will not be written, even if they appear in the mapping or templateSord (see {@link sol.common.ix.services.GetSetInstructions GetSetInstructions}
   * @cfg {Object} options.protectedFields.Object
   * @cfg {String} options.protectedFields.Object.id name of the protected field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} options.protectedFields.Object.type type of the protected field
   * @cfg {Object[]} options.mandatoryFields (optional) fields which must be defined in the templateSord or mapping. Throws an exception if one of these fields is missing. (see {@link sol.common.ix.services.GetSetInstructions GetSetInstructions}
   * @cfg {Object} options.mandatoryFields.Object
   * @cfg {String} options.mandatoryFields.Object.id name of the mandatory field
   * @cfg {String|"GRP"|"MAP"|"WFMAP"|"FORMBLOB"} options.mandatoryFields.Object.type type of the mandatory field
   */

  _generatorParams: {},

  _setParams: {},

  parseOptions: function (opts) {
    var me = this;
    opts = opts || {};
    if (opts.reverseSourceAndTarget) {
      me._target = {
        objId: me.source.objId,
        flowId: me.source.flowId,
        fromService: me.source.fromService
      };
      me._source = {
        objId: me.target.objId,
        flowId: me.target.flowId,
        fromService: me.target.fromService
      };
    }

    me._generatorParams.reverseMapping = opts.reverseMetadataMapping || false;
    me._generatorParams.returnMappingsOnly = opts.onlyWriteMappings || false;
    me._generatorParams.protectedFields = Array.isArray(opts.protectedFields) ? opts.protectedFields : [];
    me._generatorParams.mandatoryFields = Array.isArray(opts.mandatoryFields) ? opts.mandatoryFields : [];
    me._generatorParams.renderOptions = { emptyNonRendered: !(opts.emptyNonRenderedTemplates === false) }; // standard: empty non rendered
    me._generatorParams.escapeHTML = (opts.escapeHTML === true);
  },

  prepareSource: function (src) {
    var me = this, objId, flowId, sourceFromService, fromServiceParams;
    if (!src) {
      throw "FillSord: `source` parameter not defined.";
    }
    if (src.objId && (objId = String(src.objId)) && (objId === "fromParams")) {
      objId = String(me.objId || "");
    }

    if (objId) {
      me._generatorParams.dataSource = objId;

      if (src.flowId && (flowId = String(src.flowId)) && (flowId === "fromParams")) {
        flowId = String(me.flowId || "");
      }
      if (flowId) {
        me._generatorParams.dataSourceFlowId = flowId;
      }
    } else if (src.templateSord) {
      me._generatorParams.dataSource = src.templateSord;
    } else if (src.fromService && src.fromService.name) {

      fromServiceParams = src.fromService.params;
      if (src.fromService.options && src.fromService.options.template === true) {

        // TODO: context could be pulluted with full templateSord object
        // only when template option is set to true we want to resolve fromService params
        fromServiceParams = !sol.common.ObjectUtils.isEmpty(src.fromService.params)
          ? sol.common.TemplateUtils.render(src.fromService.params, { sord: { id: me.objId } })
          : {};
      }

      sourceFromService = sol.common.IxUtils.execute(src.fromService.name, fromServiceParams || {}) || {};
      sourceFromService = sourceFromService.sords || sourceFromService;

      sourceFromService = Array.isArray(sourceFromService) ? sourceFromService[0] || {} : sourceFromService || {};

      if (sol.common.ObjectUtils.type(sourceFromService, "string")) {
        sourceFromService = { objId: sourceFromService };
      }

      me.prepareSource(sourceFromService);
    } else {
      throw "Could not determine source in FillSord. Source config must contain a property `objId` (optional: `flowId`), `templateSord` or `fromService` which defines a service returning said properties.";
    }
  },

  startWorkflowOn: function (config) {
    return sol.common.WfUtils.startWorkflow(config.workflow.name, config.workflow.title, config.objId);
  },

  determineTarget: function (tgt) {
    var me = this, target = {}, objId, flowId;
    if (!tgt) {
      throw "FillSord: `target` parameter not defined.";
    }
    if (tgt.objId && (objId = String(tgt.objId)) && (objId === "fromParams")) {
      objId = String(me.objId || "");
    }
    if (objId) {
      target.objId = objId;

      if (tgt.flowId && (flowId = String(tgt.flowId)) && (flowId === "fromParams")) {
        flowId = String(me.flowId || "");
      }
      if (flowId) {
        target.flowId = flowId;
      }
    } else if (tgt.fromService && tgt.fromService.name) {
      target = me.determineTarget(sol.common.IxUtils.execute(tgt.fromService.name, tgt.fromService.params || {}));
    }
    if (!target.objId) {
      throw "Could not determine target in FillSord. Target config must contain a property `objId` (optional: `flowId`), or `fromService` which defines a service returning said property.";
    }
    if (tgt.startWorkflow && !(tgt.startWorkflow.concluding === true) && tgt.startWorkflow.name) {
      target.flowId = me.startWorkflowOn({ objId: target.objId, workflow: tgt.startWorkflow });
    }
    return target;
  },

  finalizeGeneratorParams: function () {
    var me = this;
    me._generatorParams.mapping = me.metadataMapping;
    me._generatorParams.returnRendered = true; // because we don't want templatestrings being written to our sord.
  },

  pepareSetParams: function (target, entries) {
    var me = this;
    me._setParams = {
      objId: target.objId,
      entries: entries
    };
    if (target.flowId) {
      me._setParams.flowId = target.flowId;
    }
  },

  storeResult: function (target, fieldDef) {
    var me = this;
    try {

      fieldDef.value = target.objId;

      sol.common.IxUtils.execute("RF_sol_function_Set", {
        objId: me.objId,
        entries: [fieldDef]
      });

    } catch (ex) {
      me.logger.error(["Could not store targetSord information to {0}", me.objId]);
      throw ex;
    }
  },

  process: function () {
    var me = this, target, generatorResult;
    me._generatorParams = {};
    me._setParams = {};

    me._source = me.source;
    me._target = me.target;

    me.parseOptions(me.options);
    me.prepareSource(me._source);
    me.finalizeGeneratorParams();
    generatorResult = sol.common.IxUtils.execute("RF_sol_common_service_GenerateSetInstructions", me._generatorParams) || {};

    if (Array.isArray((me.source || {}).copySordKeys)) {
      (me.source || {}).copySordKeys.map(function (sordKey) {
        if (me._generatorParams.dataSource[sordKey]) {
          generatorResult.instructions.push({
            type: "SORD",
            key: sordKey,
            value: me._generatorParams.dataSource[sordKey],
            useTemplating: true
          });
        }
      });

    }

    target = me.determineTarget(me._target);
    if (Array.isArray(generatorResult.instructions)) {
      me.pepareSetParams(target, generatorResult.instructions);
      sol.common.IxUtils.execute("RF_sol_function_Set", me._setParams);
    }
    if (me._target.startWorkflow && (me._target.startWorkflow.concluding === true) && me._target.startWorkflow.name) {
      target.flowId = me.startWorkflowOn({ objId: target.objId, workflow: me._target.startWorkflow });
    }

    if (me.storeTargetSord && me.storeTargetSord.field) {
      // { field: { type: "GRP", key: "MEETING_ITEM_LINK", value:"" }}
      me.storeResult(target, me.storeTargetSord.field);
    }

    return target;
  }
});

/**
 * @member sol.common.ix.functions.FillSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.source = params.source || { objId: wfDiagram.objId, flowId: wfDiagram.id };
  params.target = params.target || { objId: wfDiagram.objId, flowId: wfDiagram.id };

  fun = sol.create("sol.common.ix.functions.FillSord", params);

  fun.process();
}

/**
 * @member sol.common.ix.functions.FillSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.source = params.source || { objId: wfDiagram.objId, flowId: wfDiagram.id };
  params.target = params.target || { objId: wfDiagram.objId, flowId: wfDiagram.id };

  fun = sol.create("sol.common.ix.functions.FillSord", params);

  fun.process();
}


/**
 * @member sol.common.ix.functions.FillSord
 * @method RF_sol_function_FillSord
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 * @return {Object}
 * @return {String} return.objId objId of the sord which has been written to
 * @return {String} return.flowId (optional) flowId, if a workflow has been started on the sord
 */
function RF_sol_function_FillSord(iXSEContext, args) {
  var rfParams, fun;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.common.ix.functions.FillSord", rfParams);

  return JSON.stringify(fun.process());
}
