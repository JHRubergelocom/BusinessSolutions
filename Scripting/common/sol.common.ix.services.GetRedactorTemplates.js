
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ObjectUtils.js


/**
 * Retrieves templates (clips) for a redactor
 *
 * For an implementation using this service, please see sol.recruiting.ix.services.GetCommunicationRedactorTemplates.
 *
 * ### Get Redactor Templates. Use data from sords in templating.
 *
 *     {
 *       templates: [
 *         { desc: "{{translate 'sol.recruiting.form.candidate.no'}}", value: "{{CANDIDATE.objKeys.RECRUITING_CANDIDATE_NO}}" },
 *         { desc: "{{translate 'sol.recruiting.form.candidate.firstname'}}", value: "{{CANDIDATE.objKeys.RECRUITING_CANDIDATE_FIRSTNAME}}" },
 *         { desc: "{{translate 'sol.recruiting.form.candidate.lastname'}}", value: "{{REQUISITION.objKeys.RECRUITING_REQUISITION_NAME}}" },
 *         { desc: "{{translate 'sol.recruiting.form.candidate.privatephone'}}", value: "{{CANDIDATE.mapKeys.RECRUITING_CANDIDATE_PRIVATEPHONE}}" }
 *       ],
 *       render: {
 *         searchAdditionalData: [
 *           {
 *             targetProp: "REQUISITION",
 *             criteria: [
 *               { key: "RECRUITING_REQUISITION_NO", value: "R12345" },
 *               { key: "SOL_TYPE", value: ["RECRUITING_REQUISITION", "RECRUITING_POOL"] }
 *             ]
 *           },
 *           {
 *             targetProp: "CANDIDATE",
 *             doubleAsSord: true,
 *             masks: ["Recruiting Candidate"],
 *             criteria: [
 *               { key: "RECRUITING_CANDIDATE_NO", value: "C44312" },
 *               { key: "SOL_TYPE", value: "RECRUITING_CANDIDATE" }
 *             ]
 *           }
 *         ]
 *       }
 *     }
 *
 * We want 4 redactor templates to be available. Since they require templating data from a requisition and a candidate, we
 * define a search, which will find both and make their data available to handlebars.
 *
 * Since it is common to make a specific sord available as the `sord` property in handlebars, we use CANDIDATE as `sord` by defining `doubleAsSord`.
 *
 * This means, `sord.objKeys.RECRUITING_CANDIDATE_NO` === `CANDIDATE.objKeys.RECRUITING_CANDIDATE_NO`.
 *
 * Instead of supplying a `criteria` and optionally a `mask/masks` property, you can also define a `id` or `guid` property, if you already know, which
 * sords to use for templating.
 *
 *     {
 *       targetProp: "CANDIDATE",
 *       doubleAsSord: true,
 *       id: "44292"
 *     }
 *
 * #### Result
 *
 *     {
 *       templates: [
 *         ["Bewerbernummer", "0001"],
 *         ["Bezeichnung", "Initiativbewerbungen"],
 *         ["Telefon", "001211439123"]
 *         ["Vorname", "Test"]
 *       ]
 *     }
 *
 * ### Only render description text
 *
 * Any templating strings in the value part of the template definition will not be altered with this setting:
 *
 *     render: {
 *       onlyDescription: true
 *     }
 *
 * #### Result
 *
 *     {
 *       templates: [
 *         ["Bewerbernummer", "{{CANDIDATE.objKeys.RECRUITING_CANDIDATE_NO}}"],
 *         ["Bezeichnung", "{{REQUISITION.objKeys.RECRUITING_REQUISITION_NAME}}"],
 *         ["Telefon", "{{CANDIDATE.mapKeys.RECRUITING_CANDIDATE_PRIVATEPHONE}}"]
 *         ["Vorname", "{{CANDIDATE.objKeys.RECRUITING_CANDIDATE_FIRSTNAME}}"]
 *       ]
 *     }
 *
 * ### Loading templates from a configuration
 *
 * This service will most often be called from a workflow from or webapp.
 *
 * The `load` parameter enables loading the `templates` from a configuration instead of defining them in the call.
 *
 *     {
 *       load: {
 *         config: "/recruiting/Configuration/recruiting.config",
 *         jsonPath: "entities.myredactor.mytemplates"
 *       }
 *     }
 *
 * ### Details on Results
 *
 * Only descriptions having a value after templating will be added to the results.
 *
 * If the value of a template has no value after templating, itself and its description will not be added to the results.
 *
 * Results are ordered alphabetically by description.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 */
sol.define("sol.common.ix.services.GetRedactorTemplates", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {Object[]} load (optional if `templates` is defined)
   * @cfg {Object} load.Object
   * @cfg {String} load.Object.config path to config (e.g. /recruiting/Configuration/recruiting.config)
   * @cfg {String} load.Object.jsonPath json path to property in config containing the templates
   */

  /**
   * @cfg {Object[]} templates (optional if `load` is defined)
   * @cfg {Object} templates.Object
   * @cfg {String} templates.Object.desc description of the template (selectable in redactor clips)
   * @cfg {String} templates.Object.value value of the redactor template. Will be inserted if redactor clip is clicked.
   */

  /**
   * @cfg {Object[]} render (optional)
   * @cfg {Boolean} [render.onlyDesc = false] (optional) only renders the description while leaving the value unchanged
   * @cfg {Object} render.data (optional) data for templating
   * @cfg {Object[]} render.searchAdditionalData (optional) add sords to templating data
   * @cfg {Object} render.searchAdditionalData.Object
   * @cfg {String} render.searchAdditionalData.Object.targetProp sord's target name in templating
   * @cfg {Boolean} render.searchAdditionalData.Object.doubleAsSord this sord will also be available as `sord`
   * @cfg {String|String[]} render.searchAdditionalData.Object.id (optional) sord's objId
   * @cfg {String|String[]} render.searchAdditionalData.Object.guid (optional) sord's guid
   * @cfg {String|String[]} render.searchAdditionalData.Object.masks (optional) masks to include in search
   * @cfg {Object[]} render.searchAdditionalData.Object.criteria (optional) search criteria
   * @cfg {Object} render.searchAdditionalData.Object.criteria.Object.key search criterion key
   * @cfg {Object|String[]} render.searchAdditionalData.Object.criteria.Object.value search criterion value/s
   */

  _optimize: {}, // enables optimization. Will store optimization cache ID


  doublesAsSord: "", // will contain targetProp of sord whose config property `dobuleAsSord` is true

  getConfigProp: function (config, path) {
    var prop;
    prop = sol.common.ObjectUtils.getProp(
      (sol.create("sol.common.Config", { compose: config, copy: true })).config,
      path
    );

    if (!prop) {
      throw "Could not read property `" + path + "` from config `" + config + "`";
    }
    if (!Array.isArray(prop)) {
      throw "The property (" + (typeof prop) + ") read from the config must be an Array.";
    }

    return JSON.parse(JSON.stringify(prop));
  },

  isValidConfigDef: function (def) {
    var valid =
      (typeof def === "object")
        && def.config
        && sol.common.ObjectUtils.type(def.jsonPath, "string");

    if (!valid) {
      throw "`load` argument not defined, not an object or does not contain `config` and `jsonPath` properties";
    }

    return valid;
  },

  shouldRenderEverything: function (renderOpts) {
    return (typeof renderOpts === "object") && !renderOpts.onlyDescription;
  },

  getPredefinedData: function (renderOpts) {
    if (renderOpts.data && typeof renderOpts.data !== "object") {
      throw "If defined, `data` property must be an Object";
    }
    return renderOpts.data || {};
  },

  shouldSearchForAdditionalData: function (renderOpts) {
    if (renderOpts.searchAdditionalData) {
      if (!Array.isArray(renderOpts.searchAdditionalData)) {
        throw "If defined, `searchAdditionalData` property must be an Array of Objects";
      }
      return true;
    }
  },

  isValidEntitiesDef: function (entities) {
    entities.forEach(function (entity) {
      if (typeof entity !== "object") {
        throw "All elements of the `searchAdditionalData` Array must be objects.";
      }
      if (!sol.common.ObjectUtils.type(entity.targetProp, "string") || String(entity.targetProp) === "") {
        throw "All elements of the `searchAdditionalData` Array must contain a `targetProp` property.";
      }
      if (entity.criteria && !Array.isArray(entity.criteria)) {
        throw "If defined, `criteria` property must be an Array of Objects adhering to the sol.common.services.SordProvider `search` definitions.";
      }
      if (!entity.criteria && !entity.id && !entity.guid) {
        throw "You must define search criteria or an `id` (objId) or `guid`";
      }
      if (Array.isArray(entity.id) || Array.isArray(entity.guid)) { // sordprovider supports arrays of ids, this is unwanted here
        throw "If defined, `id`/`guid` property must be a String. Arrays are not allowed.";
      }
    });
    return true;
  },


  searchForEntity: function (entity) {
    var me = this, config = {
          id: entity.id | entity.guid,
          search: entity.criteria,
          mask: (entity.mask || entity.masks || [""]),
          output: [{ source: { type: "SORD", key: "id" } }],
          options: { allowEmptyMask: true, maxResults: 1 }
        };

    return sol.common.IxUtils.optimizedExecute(
        "RF_sol_common_service_SordProvider",
        config,
        me._optimize,
        "returnsId",
        ["output"]
      )
      .sords[0];
  },

  search: function (entities) {
    var me = this;
    return me.isValidEntitiesDef(entities)
      ? entities.map(me.searchForEntity.bind(me))
      : [];
  },

  merge: function (tData, results) {
    return Object.keys(results).reduce(function (data, resultName) {
      tData[resultName] = results[resultName];
      return data;
    }, tData);
  },

  collectSordData: function (entity, id) {
    return sol.common.WfUtils.getTemplateSord(
      ixConnect.ix().checkoutSord(id, SordC.mbAllIndex, LockC.NO),
      undefined,
      { formBlobs: entity.includeBlobs }
    )
    .sord;
  },

  collectDataFromIds: function (entities, entityIds) {
    var me = this;
    return entities.reduce(function (data, entity, i) {
      entityIds[i]
        && (data[entity.targetProp] = me.collectSordData(entity, entityIds[i]));

      (entity.doubleAsSord === true)
        && (me.doublesAsSord = entity.targetProp);

      return data;
    }, {});
  },

  searchAndIncludeSords: function (tData, entities) {
    var me = this;
    return me.merge(
      tData,
      me.collectDataFromIds(
        entities,
        me.search(entities)
      )
    );
  },

  collectTemplatingData: function (renderOpts) {
    var me = this, tData = {};
    if (renderOpts) {
      if (typeof renderOpts !== "object") {
        throw "If defined, `render` argument must be an Object";
      }
      tData = me.getPredefinedData(renderOpts);
      me.shouldSearchForAdditionalData(renderOpts)
        && me.searchAndIncludeSords(tData, renderOpts.searchAdditionalData);

      me.doublesAsSord
        && (tData.sord = tData[me.doublesAsSord]);
    }
    return tData;
  },

  renderAny: function (obj, tData) {
    return sol.common.TemplateUtils.render(obj, tData, { emptyNonRendered: true });
  },

  withRenderedDesc: function (tData, o) {
    var me = this;
    return (o.desc = me.renderAny(o.desc, tData)), o;
  },

  renderTemplates: function (configProp, tData, renderEverything) {
    var me = this;
    return renderEverything
      ? me.renderAny(configProp, tData)
      : configProp.map(me.withRenderedDesc.bind(me, tData));
  },

  getRawTemplates: function (templates, load) {
    var me = this;
    return (Array.isArray(templates) && templates)  // use templates, if defined as parameter
      || (me.isValidConfigDef(load) && me.getConfigProp(load.config, load.jsonPath));
  },

  /**
   * @return {Object} return
   * @return {String[][]} return.templates an array of all templates (each template is an array of [0] description and [1] value)
   */
  process: function () {
    var me = this;

    return me.renderTemplates(
      me.getRawTemplates(me.templates, me.load),
      me.collectTemplatingData(me.render),
      me.shouldRenderEverything(me.render)
    )
    .filter(function (obj) {  // only return templates having a desc and value
      return obj.desc && obj.value;
    })
    .map(function (obj) { // convert templates to redactor clip format
      return [obj.desc, obj.value];
    })
    .sort(function (a, b) {
      return (a[0]).localeCompare(b[0]);
    });
  }
});



/**
 * @member sol.common.ix.services.GetRedactorTemplates
 * @method RF_sol_common_service_GetRedactorTemplates
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetRedactorTemplates(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.common.ix.services.GetRedactorTemplates", rfParams);
  result = rfUtils.stringify({ templates: serviceProc.process() });
  return result;
}