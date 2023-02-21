
//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.AsyncUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.SordTypeUtils.js

/**
 * Shared utility functions used in HR solutions.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.1
 *
 *
 * @requires sol.common.Config
 * @requires lib_sol.common.TranslateTerms.js
 */
sol.define("sol.hr.shared.Utils", {
  singleton: true,

  translationPath: "sol.hr",

  /**
   * translate a `term`
   * optional: define `lang` as the second parameter. If no language is passed, the clients language will be used.
   */
  translate: function (term, lang) {
    var me = this;
    (!me.translationsLoaded || term.indexOf(me.translationPath) < 0) && sol.common.TranslateTerms.require(term);
    return lang ? String(sol.common.TranslateTerms.getTerm(lang, term)) : sol.common.TranslateTerms.translate(term);
  },


  /**
   * retrieves template sord of objId/guid & flowId
   * make sure the objId/guid exists first!
   */
  getSordData: function (objId, flowId, asAdmin) {
    return sol.common.WfUtils.getTemplateSord(
      ((asAdmin && typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect).ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
      flowId,
      { asAdmin: asAdmin }
    ).sord;
  },

  // Indexserver helpers start here
  // Useful in actions

  /**
   * lets a sord inherit Data from another sord using a descriptive api
   * `sourceId` - data source objectId
   * `targetId` - objId of sord which should inherit from `sourceId`
   * `apiPath`  - usually, apis are stored in config-files. e.g. "solconfigs.hr.apis.mygreatapi"
   */
  inheritData: function (opts, workflowOpts, dataSourceAsAdm) {
    var fillSordByApiConfig, inheritOpts, sourceSord, api, refs = [];

    opts = opts || {};

    if (!opts.sourceId) {
      return;
    }
    sourceSord = ((dataSourceAsAdm && typeof ixConnectAdmin !== "undefined") ? ixConnectAdmin : ixConnect).ix().checkoutSord(opts.sourceId, SordC.mbAllIndex, LockC.NO);

    inheritOpts = (
      (opts.inheritanceActiveForSoltypes && sol.common.ObjectUtils.getProp(opts.inheritanceActiveForSoltypes, String(sol.common.SordUtils.getObjKeyValue(sourceSord, "SOL_TYPE")).trim()))
      || { apiPath: opts.apiPath }
    );

    if (inheritOpts) {
      if (inheritOpts.apiPath && opts.apisBase) {
        api = sol.common.ObjectUtils.getProp(opts.apisBase, inheritOpts.apiPath);
      } else {
        api = { mapping: [] };
      }
      fillSordByApiConfig = {
        api: api,
        flowId: workflowOpts.flowId,
        target: { type: "objId", value: opts.targetId },
        writeDataHistory: api.writeDataHistory
      };

      if (inheritOpts.customizeWfSettings && workflowOpts) {
        workflowOpts.useStandardWf = inheritOpts.customizeWfSettings.customWf ? false : true;
        workflowOpts.customWf = (inheritOpts.customizeWfSettings.customWf || workflowOpts.customWf) || "";
        workflowOpts.wfMessage = (inheritOpts.customizeWfSettings.message || workflowOpts.wfMessage) || "";
      }

      refs = Array.isArray(inheritOpts.addReferences) ? refs.concat(inheritOpts.addReferences) : refs;
      refs = Array.isArray(opts.addReferences) ? refs.concat(opts.addReferences) : refs;

      fillSordByApiConfig.dataSourceAsAdmin = dataSourceAsAdm;
      fillSordByApiConfig.references = [];

      refs.forEach(function (r) {
        fillSordByApiConfig.references.push({ id: r.fieldName, type: r.fieldType, value: (sol.common.ObjectUtils.type(r.value, "string") ? r.value : (r.refType === "GUID" ? sourceSord.guid : sourceSord.id)) });
      });


      fillSordByApiConfig.api.dataSources = { sordReferenceForTemplating: { type: "objId", value: sourceSord.id } };

      // apply data to sord
      sol.common.IxUtils.execute("RF_sol_hr_function_FillSordByApi", fillSordByApiConfig);
    }
  },


  /**
   * prepares a new sord
   */
  prepareFolder: function (targetId, targetMask, shortDescription, typeName) {
    var sord;
    sord = ixConnectAdmin.ix().createSord(targetId, targetMask || "", EditInfoC.mbSord).sord;
    sord.name = shortDescription;
    if (typeName) {
      sord.type = sol.common.SordTypeUtils.getSordTypeId(typeName);
    }
    sord.id = ixConnectAdmin.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
    return sord.id;
  },

  /**
   * prepares a new sord based on a template as defined in me.shorthandConfig
   * optional: `rights` can be passed to apply rights to the created sord.
   */
  prepareFolderViaTemplate: function (opts) {
    var me = this, newId;
    me.logger.enter("prepareFolderViaTemplate", opts);
    opts = opts || {};
    newId = opts.typeSource
      ? sol.common.IxUtils.execute(
        "RF_sol_function_CopyFolderContents",
        {
          objId: opts.target,
          source: sol.common.RepoUtils.getObjIdFromRelativePath(opts.typeSource, "/" + opts.typeSourceName),
          copySourceAcl: false,
          inheritDestinationAcl: false,
          name: opts.shortDescription,
          asAdmin: true
        }
      )
      : sol.hr.shared.Utils.prepareFolder(opts.target, opts.typeTargetMaskName, opts.shortDescription, opts.typeTargetSordTypeName);

    newId && opts.rights && sol.common.AclUtils.changeRightsInBackground(newId, opts.rights);


    me.logger.exit("prepareFolderViaTemplate", newId + "");
    return newId;
  },

  /**
   * starts the workflow as defined in me.shorthandConfig and fires dialog and goto events
   */
  startWorkflowAndEvents: function (classContext, objId, opts) {
    opts = opts || {};
    classContext.flowId = (
      opts.useStandardWf
      ? classContext.startMaskStandardWorkflow(objId, { name: opts.wfMessage, field: opts.standardWfField })
      : opts.customWf && classContext.startWorkflow(objId, opts.customWf, opts.wfMessage)
    );

    opts.flowId = classContext.flowId;  // so inheritData can read the flowId

    opts.inheritDataFunction && opts.inheritDataFunction();

    //attach events
    classContext.flowId && classContext.addWfDialogEvent(classContext.flowId, { objId: objId, dialogId: classContext.getName() });
    opts.refresh && classContext.addRefreshEvent(objId, { type: "WF_STATUS", value: "CREATED", flowId: classContext.flowId });
    classContext.addGotoIdEvent(objId, null, { type: "WF_STATUS", value: "CREATED", flowId: classContext.flowId });
  },

  // useful in services
  /**
   * @private please use wrappedSordsToTypes
   */
  getTemplateFoldersAsWrappedSords: function (templateFolders) {
    var collectedWrappedSords = [], sords = [], wrappedSords;
    function getAdditionalTypeData(id, sord) {
      return {
        desc: sol.common.SordUtils.getObjKeyValue(sord, "desc"),
        sourceFolder: id
      };
    }
    function getSearchConfig() {
      var searchConfig = {};
      searchConfig.includeFolders = true;
      searchConfig.includeDocuments = false;
      searchConfig.includeReferences = true;
      searchConfig.sordZ = SordC.mbAllIndex;
      return searchConfig;
    }

    templateFolders.forEach(function (id) {
      id = id.trim();
      if (id && typeof id === "string") {
        sords = sol.common.RepoUtils.findChildren(id, getSearchConfig());
        wrappedSords = [];
        sords.forEach(function (sord) {
          wrappedSords.push({ sord: sord, data: getAdditionalTypeData(id, sord) });
        });
        collectedWrappedSords = collectedWrappedSords.concat(wrappedSords);
      }
    });
    return collectedWrappedSords;
  },

  /**
   * creates types from template-Folders (e.g. for action selection dialog)
   * this is useful because usually, you don't get the sord-Id of a type
   */
  templateFoldersToTypes: function (folders) {
    var me = this, converted = [], wrappedSords;
    wrappedSords = me.getTemplateFoldersAsWrappedSords(folders);
    if (wrappedSords) {
      wrappedSords.forEach(function (wrappedSord) {
        var sord = wrappedSord.sord, data = wrappedSord.data;
        converted.push({
          objId: sord.id,
          name: sord.name,
          desc: data.desc,
          source: data.sourceFolder,
          sourceName: sord.name
        });
      });
    }
    return converted;
  },

  /**
   * creates types from a configuration object
   */
  getTypesByContext: function (contextSoltype, opts) {
    var result = [];

    (contextSoltype
    && (
      sol.common.ObjectUtils.getProp(opts, "availability.notAvailableIn.soltypes").indexOf(contextSoltype) < 0 // soltype is allowed
      ? sol.common.ObjectUtils.getProp(opts, "availability.bySoltype." + contextSoltype)
      : []  // no types, if soltype is forbidden
    )
    || sol.common.ObjectUtils.getProp(opts, "availability.fallbacks") // deliver fallbacks if no soltype was defined or bySoltype-prop was not defined
    )
    .forEach(function (typeName) {
      var type = typeName ? sol.common.ObjectUtils.getProp(opts, "types." + typeName) : undefined;
      type && result.push(type);
    });

    return result;
  }
});