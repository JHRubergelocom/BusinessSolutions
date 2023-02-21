/**
 * Prepares a document for the template generating.
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
sol.define("sol.contract.as.actions.PrepareDocument", {
  extend: "sol.common.as.ActionBase",

  solution: "contract",

  requiredProperty: ["parentId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    sol.common.TranslateTerms.require("sol.contract");
  },

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
    if (me.userId) {
      aclConfig.users = [me.userId];
    }

    sol.common.AclUtils.changeRightsInBackground(objId, aclConfig);

    flowId = me.startMaskStandardWorkflow(objId, { name: name, field: "STANDARD_WORKFLOW" });

    if (flowId) {
      me.addWfDialogEvent(flowId, { objId: objId, title: name, dialogId: me.getName() });
    }

    me.addActionEvent("sol.contract.as.actions.CreateDocument", {
      objId: objId,
      templateId: me.templateId,
      editParts: true,
      partIdsFromMapTableKey: "CLAUSE_ID",
      searchPartIdFieldName: "CLAUSE_ID",
      partIdsTargetFieldName: "CONTRACT_CLAUSES"
    }, {
      type: "WF_STATUS",
      value: "CREATE",
      flowId: flowId
    });
  },

  createEmptyDocument: function (name, sord) {
    var me = this,
        objId, mapKeys, objKeys, config;

    objKeys = sol.common.SordUtils.getTemplateSord(sord).sord.objKeys;

    objKeys.SOL_TYPE = "CONTRACT_DOCUMENT";

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
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Word
 */
sol.define("sol.contract.as.actions.CreateDocument", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["objId", "templateId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/contract/Configuration/contract.config" }).config;

    sol.common.TranslateTerms.require("sol.contract");
  },

  getName: function () {
    return "CreateDocument";
  },

  process: function () {
    var me = this,
        name = sol.create("sol.common.Template", { source: me.config.document.defaultName }).apply(),
        generator, result, sord, extension;

    sord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbAll });
    extension = String(sord.docVersion.ext).toLowerCase();

    // this means this is a new document
    if (extension.indexOf("do") != 0) {
      sord = sol.common.RepoUtils.getSord(me.templateId, { sordZ: SordC.mbAll });
    }

    extension = String(sord.docVersion.ext).toLowerCase();
    if (extension.indexOf("do") != 0) {
      me.addErrorEvent("sol.contract.msg.wrongDocType", null, null, ixConnect.loginResult.clientInfo.language);
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
        templateId: sord.id,
        editParts: me.editParts,
        updateParts: me.updateParts,
        fillContentControls: me.fillContentControls,
        partIdsFromMapTableKey: me.partIdsFromMapTableKey,
        searchPartIdFieldName: me.searchPartIdFieldName,
        partIdsTargetFieldName: me.partIdsTargetFieldName
      }
    });

    result = generator.process();

    if (result.objId) {
      me.addGotoIdEvent(result.objId, true);
    }
  }
});
