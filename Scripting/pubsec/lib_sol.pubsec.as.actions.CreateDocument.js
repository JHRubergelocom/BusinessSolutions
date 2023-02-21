/**
 * Prepares a document for the template generating.
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.ActionBase
 * @requires sol.common.as.ActionBase
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.actions.PrepareDocument", {
  extend: "sol.common.as.ActionBase",

  /**
   * @cfg {String} parentId (required) The target for the document
   */

  /**
   * @cfg {String} templateId (required) The template for the document
   */

  /**
   * @cfg {String} userId (optional) If set, the user will be granted full access to the new document
   */

  solution: "pubsec",

  requiredConfig: ["parentId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();

    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateDocument");
  },

  getName: function () {
    return "PrepareDocument";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.document.defaultName }).apply(),
        objId = me.createEmptyDocument(name),
        flowId, params, onCfg;

    flowId = me.startMaskStandardWorkflow(objId, { name: name, field: "STANDARD_WORKFLOW" });

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    }

    params = {
      objId: objId,
      templateId: me.templateId
    };

    onCfg = {
      type: "WF_STATUS",
      value: "CREATE",
      flowId: flowId
    };

    me.addActionEvent("sol.pubsec.as.actions.CreateDocument", params, onCfg);
  },

  createEmptyDocument: function (name) {
    var me = this,
        sord = sol.common.RepoUtils.getSord(me.templateId),
        objKeys = sol.common.SordUtils.getTemplateSord(sord).sord.objKeys,
        objId, mapKeys;

    me.logger.debug("create document from template...");
    objId = sol.common.RepoUtils.saveToRepo({
      parentId: me.parentId,
      name: name,
      maskId: sord.mask,
      objKeysObj: objKeys,
      contentString: " "
    });

    me.logger.debug("read mapKeys from template document...");
    mapKeys = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.templateId, null, LockC.NO).items;
    if (mapKeys && mapKeys.length > 0) {
      me.logger.debug("write mapKeys to new document...");
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, objId, objId, mapKeys, LockC.NO);
      me.logger.debug("applied map keys.");
    }

    if (me.userId) {
      me.logger.debug("apply user rights to new document...");
      sol.common.AclUtils.addRights(objId, [me.userId], { r: true, w: true, d: true, e: true, p: true }, { asAdmin: true });
    }

    me.logger.debug("created document.");
    return objId;
  }

});


/**
 * Creates a document from a template and saves it as new version on a prepared document.
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Word
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.as.actions.CreateDocument", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["objId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.pubsec.Utils.loadConfig();

    sol.common.TranslateTerms.require("sol.pubsec.as.actions.CreateDocument");
  },

  getName: function () {
    return "CreateDocument";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.document.defaultName }).apply(),
        generator, result;

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: name,
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Word",
      collectorConfig: {
        objId: me.objId,
        allMapFields: true
      },
      rendererConfig: {
        objId: me.objId,
        templateId: me.templateId
      }
    });

    result = generator.process();

    if (result.objId) {
      me.addGotoIdEvent(result.objId, true);
    }
  }

});
