/**
 * Creates a visitor badge from a template.
 *
 * @eloas
 * @requires sol.common.AclUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.visitor.as.actions.CreateVisitorBadge", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["parentId", "targetId"],

  /**
   * @cfg {Boolean} useLongtermBadgeTemplates If `true`, another base folder is used to determine the badge template
   */

  initialize: function (config) {
    var me = this;

    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;

    sol.common.TranslateTerms.require("sol.visitor.as.actions.CreateVisitorBadge");

    if (!config.templateId && !config.template) {
      throw "InitializationException: either 'templateId' or 'template' has to be defined";
    }

    me.templateId = config.templateId || me.getBadgeTemplateArcPath(config.template);

    if (!me.templateId) {
      throw "InitializationException: no template found for name '" + config.template + "'";
    }

  },

  getName: function () {
    return "CreateVisitorBadge";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.visitorBadge.visitorBadgeDefaultName }).apply(),
        generator, result;

    me.requireUserRights(me.targetId, { rights: "RWL" });

    if (me.longTermBadgeName) {
      name = sol.create("sol.common.Template", { source: me.longTermBadgeName }).apply();
    }

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_visitor_service_ParentDataCollectorGroup",
      renderer: "sol.common.as.renderer.Fop",
      collectorConfig: {
        objId: me.parentId,
        returnDataDefinition: true
      },
      rendererConfig: {
        targetId: me.targetId,
        templateId: me.templateId,
        maskId: me.config.visitor.visitorDocumentMask
      },
      returnData: true
    });

    result = generator.process();

    if (result.data && result.data.visitors && result.data.visitors.sords) {
      me.markAsPrinted(result.data.visitors.sords);
    }

    if (result.objId) {
      me.addGotoIdEvent(result.objId);
    }
  },

  alreadyPrintedKey: "VISITOR_ALREADYPRINTED",

  markAsPrinted: function (visitorSords) {
    var me = this,
        i, visitorSord, keyValues;

    keyValues = [new KeyValue(me.alreadyPrintedKey, "1")];

    for (i = 0; i < visitorSords.length; i++) {
      visitorSord = visitorSords[i];
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, visitorSord.id + "", parseInt(visitorSord.id, 10), keyValues, LockC.NO);
    }
  },

  /**
   * @private
   * @param {String} badgeTemplateName
   * @return {String}
   */
  getBadgeTemplateArcPath: function (badgeTemplateName) {
    var me = this,
        basePath;

    basePath = (me.useLongtermBadgeTemplates === true) ? me.config.visitor.longtermbadge.templateFolderId : me.config.visitorBadge.templateFolderId;

    return sol.common.RepoUtils.getObjIdFromRelativePath(basePath, "/" + badgeTemplateName);
  }

});
