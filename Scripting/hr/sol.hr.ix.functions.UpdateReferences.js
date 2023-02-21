
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include sol.hr.ix.functions.FillSordByApi.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.ix.functions.FillSordByApi
 *
 * @eloix
 *
 * This function searches for sords using `search` parameters. (`mask` and/or objKeys `keys`)
 * It then changes metadata on all found sords using `update` parameters.
 *
 * ## Possible Update Parameters
 *
 * - byProp: Uses an injected property (a property stored in me/this) as value for setting
 *
 * - set: sets a field `id` of `type` to a `value`. The value may contain a template.
 *
 * - mappings: stores a value of the source sord in a field of each found sord.
 *
 * You can define multiple search+update pairs.
 *
 * ## Example
 *
 * searches for sords having SOL_TYPE "PERSONNELFILE" and a HR_PERSONNEL_MENTOR_GUID matching the guid of the local objId.
 * It then updates all found sords by setting the HR_PERSONNEL_SUPERIOR field to the rendered superior name.
 * The property superior is a variable injected into me/this.
 *
 *     {
 *       "configs": [
 *         {
 *           "search": { "mask": "Personnel file", keys": { "SOL_TYPE": "PERSONNELFILE" , "HR_PERSONNEL_MENTOR_GUID": "{{sord.guid}}" } },
 *           "update": {
 *             "byProp": { "superior": { "id": "HR_PERSONNEL_SUPERIOR", "type": "GRP" } },
 *             "mappings": [ { "source": { "id": "HR_PERSONNEL_ELOUSERID", "type": "GRP" }, "target": { "id": "HR_PERSONNEL_SUPERIORUSERID", "type": "MAP" } } ]
 *           }
 *         }
 *       ]
 *     }
 */
sol.define("sol.hr.ix.functions.UpdateReferences", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    authority: { config: "hr", prop: "entities.file.dynkwls.authority.displayNameTemplate", template: true },
    deputy: { config: "hr", prop: "entities.file.dynkwls.deputy.displayNameTemplate", template: true },
    mentor: { config: "hr", prop: "entities.file.dynkwls.mentor.displayNameTemplate", template: true },
    superior: { config: "hr", prop: "entities.file.dynkwls.superior.displayNameTemplate", template: true },
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", log: false }
  },

  genericFind: function (opts) {
    var findInfo, findByIndex, objKeys = [], findResult, ids;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();

    findInfo.findByIndex = findByIndex;
    if (opts.keys) {
      Object.keys(opts.keys).forEach(function (fieldName) {
        var value = opts.keys[fieldName], objKey = new ObjKey();
        objKey.name = fieldName;
        objKey.data = [value];
        objKeys.push(objKey);
      });
    }

    findByIndex.objKeys = objKeys;
    findByIndex.maskId = opts.mask || ""; //ignore mask

    findResult = ixConnect.ix().findFirstSords(findInfo, 10000, SordC.mbOnlyId);
    ids = findResult && findResult.ids && findResult.ids.length > 0 && findResult.ids;
    return ids || [];
  },

  process: function () {
    var me = this;
    Array.isArray(me.configs) && me.configs.forEach(function (config) {
      var references = [], fillSordByApiConfig = {};
      if (config.search && config.update) {
        if (config.search.mask || config.search.keys) {
          config.search = sol.common.TemplateUtils.render(config.search, me.$templatingData);
          references = me.genericFind({ mask: config.search.mask, keys: config.search.keys });
        }
        if (references.length > 0) {
          fillSordByApiConfig = {
            api: {
              dataSources: {
                sordReferenceForTemplating: {
                  type: "objId",
                  value: me.sord.guid
                }
              },
              mapping: []
            },
            references: [],
            target: { type: "objId", value: undefined }
          };
          if (config.update.byProp) {
            Object.keys(config.update.byProp).forEach(function (propName) {
              var settings = config.update.byProp[propName], prop = me[propName] || "";
              fillSordByApiConfig.references.push({ type: settings.type, id: settings.id, value: prop });
            });
          }

          if (Array.isArray(config.update.set)) {
            fillSordByApiConfig.references = fillSordByApiConfig.references.concat(config.update.set);
          }

          if (Array.isArray(config.update.mappings)) {
            fillSordByApiConfig.api.mapping = config.update.mappings;
          }

          references.forEach(function (id) {
            fillSordByApiConfig.target.value = id;
            (sol.create("sol.hr.ix.functions.FillSordByApi", fillSordByApiConfig)).process();
          });
        }
      }
    });
  }
});

/**
 * @member sol.hr.ix.functions.UpdateReferences
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.hr.ix.functions.UpdateReferences", params);

  fun.process();
}

/**
 * @member sol.hr.ix.functions.UpdateReferences
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  fun = sol.create("sol.hr.ix.functions.UpdateReferences", params);

  fun.process();
}


/**
 * @member sol.hr.ix.functions.UpdateReferences
 * @method RF_sol_hr_function_UpdateReferences
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_UpdateReferences(iXSEContext, args) {
  var rfParams, fun;

  rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

  fun = sol.create("sol.hr.ix.functions.UpdateReferences", rfParams);

  fun.process();
}
