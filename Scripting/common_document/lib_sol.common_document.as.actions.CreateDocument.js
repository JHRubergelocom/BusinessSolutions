/**
 * Prepares a document for the template generating.
 * This function will be called first when the as rule is executed. Afterwards CreateDocument is called
 *
 * @cfg {String} parentId (required) target folder objId
 * @cfg {String} templateId (required) template document objId
 * @cfg {String} defaultName (required) name for new document
 * @cfg {String} wfFieldName (optional) template-sord-Fieldname which contains the workflow-name

 *
 * @eloas
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.ActionBase
 */
sol.define("sol.common_document.as.actions.PrepareDocument", {
  extend: "sol.common.as.ActionBase",

  solution: "common_document",

  requiredProperty: ["parentId", "templateId", "defaultName"],

  getName: function () {
    return "PrepareDocument";
  },

  process: function () {
    var me = this,
        sord, name, objId, aclConfig, flowId;

    sord = sol.common.RepoUtils.getSord(me.templateId);
    name = sord.name;

    objId = me.createEmptyDocument(name, sord);

    aclConfig = { mode: "SET", inherit: { fromDirectParent: true }, rights: { r: true, w: true, d: true, e: true, l: true, p: true } };
    if (me.userName) {
      aclConfig.users = [me.userName];
    }

    sol.common.AclUtils.changeRightsInBackground(objId, aclConfig);

    try {
      flowId = me.startMaskStandardWorkflow(objId, { name: name, field: me.wfFieldName || "STANDARD_WORKFLOW" });
    } catch (_e) {
      flowId = me.startWorkflow(objId, "sol.common_document.createDocument", name);
    }

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    }

    me.addActionEvent("sol.common_document.as.actions.CreateDocument", {
      objId: objId,
      templateId: me.templateId,
      defaultName: me.defaultName,
      prepared: true
    }, {
      type: "WF_STATUS",
      value: "CREATE",
      flowId: flowId
    });
  },

  createEmptyDocument: function (name, sord) {
    var me = this,
        objId, mapKeys,
        objKeys = sol.common.SordUtils.getTemplateSord(sord).sord.objKeys,
        config = {
          parentId: me.parentId,
          name: name,
          maskId: sord.mask,
          objKeysObj: objKeys,
          contentString: " "
        };

    me.logger.debug("create document from template... ", objKeys);
    objId = sol.common.RepoUtils.saveToRepo(config);

    me.logger.debug("read mapKeys from template document...");
    mapKeys = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.templateId, null, LockC.NO).items;
    if (mapKeys && mapKeys.length > 0) {
      me.logger.debug("write mapKeys to new document...");
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, objId, objId, mapKeys, LockC.NO);
      me.logger.debug("applied map keys.");
    }

    return objId;
  }

});

/**
 * Creates a document from a template and saves it as new version on a prepared document.
 *
 * @cfg {String} objId (required) sord to update
 * @cfg {String} templateId (required) template document objId
 * @cfg {Boolean} prepared (optional) must be true (only if called via AS-rule)
 * @cfg {String} defaultName (optional) only if you want to change the name of the document.

 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Word
 */
sol.define("sol.common_document.as.actions.CreateDocument", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["objId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);

    sol.common.TranslateTerms.require("sol.common_document");
  },

  getName: function () {
    return "CreateDocument";
  },

  process: function () {
    var me = this,
        name,
        generator, result, templateSord, extension;

    templateSord = sol.common.RepoUtils.getSord(me.templateId, { sordZ: SordC.mbAll });
    name = (me.defaultName && sol.create("sol.common.Template", { source: "{{translate '" + me.defaultName + "'}}" }).apply()) || templateSord.name;
    extension = String(templateSord.docVersion.ext).toLowerCase();
    if (extension.indexOf("doc") != 0) {
      me.addErrorEvent("sol.common_document.msg.wrongDocType", null, null, ixConnect.loginResult.clientInfo.language);
      return;
    }

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