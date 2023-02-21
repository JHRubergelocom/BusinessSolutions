
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.Injection.js

/**
 * To be executed on a sord[1] which contains one or more fields[2] which contain handlebars templates.
 * The handlebars template may contain fields from multiple sords[3] (sord.objKeys, CANDIDATE.objKeys, POSTING.objKeys ...).
 * For each of these sords, a search instruction [4] must be defined. The search must be enriched with data of sord[1].
 * The fields'[2] handlebars template strings will then be rendered using the data which was fetched from the sords[3].
 * Finally, the rendered strings are saved to the sord[1].
 *
 * In the learning solution, this is used to render e.g. personalized e-mail templates which are sent to the course participants.
 *
 * A search instruction [4] may consist of the parameters defined in {@link sol.common.ix.services.SordProvider SordProvider}.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.RenderTemplate", {
  extend: "sol.common.ix.FunctionBase",

  mixins: ["sol.common.mixins.Inject"],

  requiredConfig: ["templateFields"],

  inject: {
    templateFields: { prop: "templateFields", forTemplating: false },
    searches: { prop: "searches", forTemplating: false, template: true, emptyNonRendered: true },
    redactor: { prop: "redactor", forTemplating: false },
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId", includeBlobs: true }
  },

  // checks if all mandatory properties are available in the sord.
  checkSordValues: function (sord, paths, optional) {
    var me = this, ok = true;
    paths
      .forEach(function (path) {
        if (!(String(sol.common.ObjectUtils.getProp(sord, path) || ""))) {
          if (optional) {
            me.logger.warn("Optional property " + path + " not found in sord! Skipping search ...");
            ok = false;
          } else {
            throw "A search field did not have a value! Aborting ... Field path:" + path;
          }
        }
      });
    return ok;
  },

  // checks if all mandatory search properties are not empty.
  finalizeSearchValues: function (search) {
    var me = this;
    return search
      .filter(function (criterion) {
        if (!criterion.value) {
          if (criterion.optional) {
            me.logger.warn("Optional property " + criterion.key + " not included in search because it was empty!");
            return false;
          } else {
            throw "A search field did not have a value! Aborting ... Field:" + criterion.key;
          }
        }
        return true;
      });
  },

  getObjIdOf: function (config) {
    var me = this;
    if (me.checkSordValues(me.sord, config.const.checkSordValues, !!config.const.optional)) {
      config.output = [{ source: { type: "SORD", key: "id" } }];
      config.search = me.finalizeSearchValues(config.search);
      config.options || (config.options = {});
      config.options.maxResults = 1;
      return sol.common.IxUtils.execute("RF_sol_common_service_SordProvider", config).sords[0];
    }
  },

  addSordsToTemplatingData: function (templatingData, sordNames) {
    var me = this;
    sordNames
      .forEach(function (sordName) {
        var config = me.searches[sordName], objId = me.getObjIdOf(config);
        if (!objId) {
          if (!config.const.optional) {
            throw "Could not find " + sordName;
          }
        } else {
          templatingData[sordName] = sol.common.WfUtils.getTemplateSord(
            ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO)
          ).sord;
        }
      });
  },

  getTplPath: function (field) {
    var t = field.type;
    return field.templatePath
      || ("sord." + (
        ((t === "GRP") && "objKeys.")
          || ((t === "MAP") && "mapKeys.")
          || ((t === "WFMAP") && "wfMapKeys.")
          || ((t === "FORMBLOB") && "formBlobs.")
          || ""
      ) + field.key
      );
  },

  renderTemplateFields: function (fields, templatingData) {
    var me = this;
    fields = fields
      .map(function (field) {
        field.value = String(sol.common.ObjectUtils.getProp(templatingData, me.getTplPath(field)) || "");
        return field;
      })
      .map(function (field) {
        field.value = me.renderValue(field, templatingData);
        return field;
      })
      .map(function (field) {
        // rerender value so that templateFields are rendered twice to support template fields which also contain handlebar expressions
        if (me.shouldRerenderValue(field)) {
          field.value = me.renderValue(field, templatingData);
        }
        return field;
      });
  },

  shouldRerenderValue: function (field) {
    var me = this;

    return (me.rerenderValues || field.rerenderValue)
    && (field.value || "").indexOf("{{");
  },

  renderValue: function (field, templatingData) {
    var me = this;

    return sol.common.TemplateUtils.render(
      field.value,
      templatingData,
      { emptyNonRendered: !me.keepUnrenderedTemplates }
    );
  },

  addRedactorTemplates: function (templateFields, templatingData, targetBlob, clips) {
    var clipStr;
    if (!targetBlob) {
      throw "A taget BLOB-fieldname must be defined in redactor.storeInBlob config property!";
    }
    clipStr = sol.common.JsonUtils.stringifyQuick((sol.common.IxUtils.execute("RF_sol_common_service_GetRedactorTemplates", {
      templates: clips,
      render: { data: templatingData }
    }) || {}).templates || []);

    templateFields.push({ type: "FORMBLOB", key: targetBlob, value: clipStr });
  },

  process: function () {
    var me = this,
        templatingData = me.$templatingData,
        templateFields = me.templateFields,
        redactor = me.redactor;

    if (!Array.isArray(templateFields) || !templateFields.length) {
      throw "No fields were defined for rendering!";
    }

    templatingData.wfOwner = me.wfOwnerName;

    me.excludeUserData || (templatingData.ELOUSER = sol.common.WfUtils.getTemplateSord(sol.common.UserUtils.getUserFolder(ixConnect.loginResult.user.name)).sord);
    me.excludeSord && (templatingData.sord = undefined);
    me.excludeStaticData || (templatingData.CUSTOM = me.staticData);
    me.dontSearchForAdditionalData || me.addSordsToTemplatingData(templatingData, Object.keys(me.searches || {}));
    me.sordIsAlso && (templatingData[String(me.sordIsAlso)] = me.sord);

    me.renderTemplateFields(templateFields, templatingData);
    redactor && me.addRedactorTemplates(templateFields, templatingData, String(redactor.storeInBlob || ""), redactor.clips);

    sol.common.IxUtils.execute("RF_sol_function_Set", {
      objId: String(me.objId),
      flowId: String(me.flowId),
      entries: templateFields
    });
  }
});

/**
 * @member sol.common.ix.functions.RenderTemplate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = params.objId || wfDiagram.objId;
  params.flowId = params.flowId || wfDiagram.id;
  params.wfOwnerName = String(wfDiagram.ownerName);

  (sol.create("sol.common.ix.functions.RenderTemplate", params)).process();
}

/**
 * @member sol.common.ix.functions.RenderTemplate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = params.objId || wfDiagram.objId;
  params.flowId = params.flowId || wfDiagram.id;
  params.wfOwnerName = String(wfDiagram.ownerName);

  (sol.create("sol.common.ix.functions.RenderTemplate", params)).process();
}