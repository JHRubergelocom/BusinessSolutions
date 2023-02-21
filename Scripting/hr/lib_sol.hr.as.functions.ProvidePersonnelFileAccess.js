/**
 * Provides a temporary personnel file copy in the user's personal folder.
 *
 * @author ESt, ELO Digital Office GmbH
 *
 *
 * ### Process details
 *
 * If a personnelFileId is defined in the action-config, the personnelFile will be copied.
 *
 * If furthermore, a reviewerUserId is provided, the personnel file will be copied to the reviewerUserId's personal folder
 * for further inspection.
 * reviewpathId will be written to the WFMap-Field "INQUIRY_REVIEW_PATH_ID".
 *
 *
 * Otherwise, a reviewPathId is expected: the temporary personnel file will then be freed of the "(Review)" label
 * and moved to the original inquirers personal folder.
 *
 * Typically this function will be called twice in a workflow if a reviewer is defined: using the first variant and afterwards the second variant.
 *
 *
 * @eloas
 * @requires sol.common.Cache
 * @requires sol.common.Config
 * @requires sol.common.UserUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.Map
 * @requires sol.common.Template
 * @requires sol.common.AsyncUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.TranslateTerms
 * @requires sol.common.as.Utils
 * @requires sol.common.as.BarcodeUtils
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 * @requires sol.common.as.renderer.Fop
 * @requires sol.hr.as.functions.ProvidePersonnelFileAccess
 */

var logger = sol.create("sol.Logger", { scope: "sol.hr.as.functions.ProvidePersonnelFileAccess" });


sol.define("sol.hr.as.functions.ProvidePersonnelFileAccess", {
  extend: "sol.common.as.FunctionBase",

  getName: function () {
    return "ProvidePersonnelFileAccess";
  },

   /**
   * Generates a sordZ based on an array of SordC.mb* constants.
   * returns the generated sordZ and caches it in "this"
   * @param {String} name (required)
   * name for the sordZ. (basically, this is only required, because the sordZ will be stored in "this")
   * which means, that you could access the sordZ later again using this[name]
   * @param {SordC.mb[]} mbs (required / optional on consecutive uses)
   * An array of mb constants (e.g. SordC.mbRefPaths)
   * @param {String} overwrite (optional)
   * will overwrite an existing sordZ if true. returns existing sordZ whilst ignoring mbs if false
   * @return {sordZ|undefined}
   */
  genSordZ: function (name, mbs, overwrite) {
    var me = this, sordz = me[name];
    if (sordz === undefined && mbs || overwrite) {
      me[name] = new SordZ();
      sordz = me[name];
      mbs.forEach(function (mb) {
        sordz.add(mb);
      });
    }
    return sordz;
  },

   /**
   * creates a folder and returns its objId
   * @param {Object} targetConfig (required)
   * @param {String} targetConfig.id ObjId of the parent folder
   * @param {String} targetConfig.name Name for the new folder
   *
   * @return {String}
   */
  mkdir: function (targetConfig) {
    var newFolderId, sord;

    try {
      newFolderId = sol.common.RepoUtils.getObjIdFromRelativePath(targetConfig.id, sol.common.RepoUtils.pilcrow + targetConfig.name);
    } catch (ex) {
      sord = ixConnect.ix().createSord(targetConfig.id, "", EditInfoC.mbSord).sord;
      sord.name = targetConfig.name;
      newFolderId = String(ixConnect.ix().checkinSord(sord, SordC.mbAll, LockC.NO));
    }

    return newFolderId;
  },

   /**
   * returns a searchId of a findFirstSords-findResult using findInfo for the search
   * @param {Object} findInfo (required)
   * see javaDoc
   *
   * @return {objId}
   */
  getSearchId: function (findInfo) {
    var findResult;
    findResult = ixConnect.ix().findFirstSords(findInfo, 1000, SordC.mbOnlyId);
    return findResult.searchId;
  },

  /**
   * creates a javascript array from a Java (hash)map and returns it
   * @param {java.utils.Map} hashMap (required)
   * e.g. values of mapIdsSource2Copy see JavaDoc
   *
   * @return {array}
   */
  hashMapToArray: function (hashMap) {
    var result = [[], []], iterator, entry;
    if (!hashMap) {
      return result;
    }
    iterator = hashMap.entrySet().iterator();

    while (iterator.hasNext()) {
      entry = iterator.next();
      result[0].push(+entry.getKey());
      result[1].push(+entry.getValue());
    }

    return result;
  },

  /**
   * copies repository elements found by findInfo to the path targetroot
   * @param {Object} findInfo (required)
   * see JavaDoc
   * @param {ObjId}  targetRoot (required)
   * objId of the target path for the copy operation
   *
   * @return {array}
   */
  copyTreeElements: function (findInfo, targetRoot) {
    var me = this, processInfo = new ProcessInfo(),
        jobState, javaMap, jsNative;

    processInfo.desc = "RF_sol_hr_function_ProvidePersonnelFileAccess";
    processInfo.errorMode = ProcessInfoC.ERRORMODE_CRITICAL_ONLY;
    processInfo.procCopyElements = new ProcessCopyElements();
    processInfo.procCopyElements.copyOptions = new CopyOptions();
    processInfo.procCopyElements.copyOptions.copyOnlyBaseElement = false;
    processInfo.procCopyElements.copyOptions.copyStructuresAndDocuments = true;
    processInfo.procCopyElements.copyOptions.copyOnlyWorkversion = true;
    processInfo.procCopyElements.copyOptions.copyOnlyWorkAttachment = true;
    processInfo.procCopyElements.copyOptions.inclAttachments = true;
    processInfo.procCopyElements.copyOptions.keepReferences = false;
    processInfo.procCopyElements.copyOptions.newParentId = targetRoot;
    processInfo.procCopyElements.createMapping = true;
    //readonly permissions will be set in the workflow but "could" also be set here
    jobState = ixConnect.ix().processFindResult(me.getSearchId(findInfo), processInfo);
    while (jobState && jobState.jobRunning) {
      Packages.java.lang.Thread.sleep(200);
      jobState = ixConnect.ix().queryJobState(jobState.getJobGuid(), true, true, true);
    }

    javaMap = jobState.procInfo.procCopyElements.copyResult && jobState.procInfo.procCopyElements.copyResult.mapIdsSource2Copy;
    jsNative = me.hashMapToArray(javaMap);
    // [[originalIds],[idsOfCreatedCopies]]
    return jsNative;
  },

  /**
   * generates the findInfo required by copyTreeElements
   * @param {Object} sourceId (required)
   * typically the folder ObjId of the HR\Personnel files root
   * @param {String}  soltype (required)
   * Solution Type
   * @param {String}  securitylevel (required)
   * value of GRP-field "HR_PERSONNEL_SECURITY_CLASSIFICATION"
   * @param {String}  maskId (required)
   * Additional Mask filter
   *
   * @return {findInfo}
   */
  generateFindInfo: function (sourceId, soltype, securitylevel, maskId) {
    var me = this,
        findInfo = new FindInfo(), findByIndex = new FindByIndex(),
        findChildren = new FindChildren(), securityKey, soltypeKey, objKeys;

    findInfo.findByIndex = findByIndex;
    findByIndex.maskId = (maskId && maskId.trim()) || "";  //ignore mask


    securityKey = new ObjKey();
    securityKey.name = me.securityClassificationField;
    securityKey.data = [securitylevel + " -*"];

    soltypeKey = new ObjKey();
    soltypeKey.name = "SOL_TYPE";
    soltypeKey.data = [soltype];

    findInfo.findChildren = findChildren;
    findInfo.findChildren.endLevel = -1;
    findInfo.findChildren.parentId = sourceId;

    objKeys = [securityKey, soltypeKey];

    findByIndex.objKeys = objKeys;

    return findInfo;
  },

  /**
   * moves the elements created by copyTreeElements to the correct location inside the temporary personnel file
   * using the information of the source elements
   *
   * origin:
   * personnelfiles\es\test\abc.pdf
   * created:
   * personal folder\es\abc.pdf
   * personal folder\es\test\
   * this function was executed:
   * created:
   * personal folder\es\test\abc.pdf
   *
   * @param {sord} pfSord (required)
   * sord of PersonnelFile. needed for recreating the personnel name
   * @param {objId[]}  origin (required)
   * Array of objIds. These objIds point to the repository element which has been copied by copyTreeElements
   * @param {objId[]}  created (required)
   * Array of objIds. These objIds point to the repository elements which have been created by copyTreeElements
   */
  refineCreatedStructure: function (pfSord, origin, created, cfg) {
    var me = this, sordName;
    origin.forEach(function (oId, i) {
      var nId = created[i], nChaosParentId,
          oSord,
          normalized, targetPathName, targetPathId;

      oSord = ixConnect.ix().checkoutSord(oId, me.genSordZ("refSordZ", [SordC.mbRefPaths, SordC.mbMask]), LockC.NO);
      sordName = String(pfSord.name).trim();
      normalized = (String(oSord.refPaths[0])); // not needed?
      normalized = normalized.slice(normalized.indexOf(sordName) + sordName.length); // remove personnel file name and everything before it (e.g. "Napf, Karl")
      targetPathName = "ARCPATH[" + me.chaosGUID + "]:" + normalized;
      targetPathId = sol.common.RepoUtils.getObjId(targetPathName);

      if (!targetPathId) {  // this should only be required if there are documents inside folders without security level or "structure mask"
        targetPathId = sol.common.RepoUtils.preparePath(targetPathName, { mask: String(cfg.folderFallbackMask || oSord.maskName) });
      }

      nChaosParentId = ixConnect.ix().checkoutSord(nId, me.genSordZ("parentIdSordZ", [SordC.mbParentId]), LockC.NO).parentId;
      ixConnect.ix().refSord(nChaosParentId, targetPathId, nId, -1);
    });
  },

  emptyObjKeys: function (objKeys) {
    objKeys.forEach(function (key) {
      key.data = [];
    });
  },

  emptyMapItems: function (mapItems) {
    mapItems.forEach(function (item) {
      item.value = "";
    });
  },

  /**
   * removes all objKeys and Mapfields from a sord and a map
   * @param {sord} sord (optional)
   * sord which should be cleared
   * @param {String} map (optional)
   * map which should be cleared
   */
  emptyMapAndObjKeys: function (sord, map) {
    var me = this;
    sord && sord.objKeys && me.emptyObjKeys(sord.objKeys);
    map && map.items && me.emptyMapItems(map.items);
  },

  /**
   * removes all objKeys and Mapfields from an element by objId
   * (wrapper around emptyMapAndObjKeys)
   * @param {Object} objId (required)
   * objId of the element which should be cleared
   * @param {String}  customConn (optional)
   * an ixConnection for carrying out the cleaning
   */
  emptyMapAndObjKeysById: function (objId, customConn) {
    var me = this, sord, map, conn = customConn || ixConnect;

    sord = conn.ix().checkoutSord(objId, me.genSordZ("objKeysOnlySordZ", [SordC.mbObjKeys]), LockC.NO);
    map = conn.ix().checkoutMap(MapDomainC.DOMAIN_SORD, objId, null, LockC.NO);

    me.emptyMapAndObjKeys(sord, map);

    conn.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
    conn.ix().checkinMap(MapDomainC.DOMAIN_SORD, map.id, objId, map.items, LockC.NO);
  },

  excludeMAPFields: function (setInstructions, fieldNames, mapItems, MAPTemplate) {
    var all = fieldNames === "_all";
    if (all) {
      // probably has to be enhanced by also iterating through mapItems in the future.
      for (var fieldName in MAPTemplate) {
        setInstructions[fieldName] = "";
      }
    }
    fieldNames.forEach(function (fieldName) {
      setInstructions[fieldName] = "";
    });
  },

  excludeGRPFields: function (setInstructions, fieldNames, objKeys) {
    var all = fieldNames === "_all";
    objKeys.forEach(function (objKey) {
      var name = String(objKey.name);
      if (all || fieldNames.indexOf(name) > -1) {
        setInstructions[name] = "";
      }
    });
  },

  excludeOptionHandler: function (setInstructions, option, target, template) {
    var me = this;
    option.MAP && me.excludeMAPFields(setInstructions.MAP, option.MAP, target.map.items, template.sord.mapKeys);
    option.GRP && me.excludeGRPFields(setInstructions.GRP, option.GRP, target.sord.objKeys);
  },

  excludeAllOptionHandler: function (setInstructions, target, template) {
    var me = this;
    me.excludeMAPFields(setInstructions.MAP, "_all", target.map.items, template.sord.mapKeys);
    me.excludeGRPFields(setInstructions.GRP, "_all", target.sord.objKeys);
  },

  setGRPFieldValues: function (setInstructions, sord) {
    sord.objKeys.forEach(function (objKey) {
      var fieldName = String(objKey.name), value = setInstructions[fieldName];
      if (value || (value === "")) {
        objKey.data = (value === "" ? [] : [value]);
      }
    });
  },

  setMAPFieldValues: function (setInstructions, map) {
    var jsItems = Array.prototype.slice.call(map.items),
        field, value;
    for (field in setInstructions) {
      value = setInstructions[field];
      jsItems.push((new KeyValue(field, value)));
    }
    map.items = jsItems;
  },

  modifyOptionHandler: function (setInstructions, modifyConfig, target) {
    modifyConfig.forEach(function (field) {
      setInstructions[field.type][field.key] = field.value;
    });
  },

  applyInstructions: function (instructions, target) {
    var me = this,
        fieldType;
    for (fieldType in instructions) {
      me["set" + fieldType + "FieldValues"](instructions[fieldType], (fieldType === "GRP" ? target.sord : target.map));
    }
  },

  includeMAPFields: function (setInstructions, templateKeys) {
    var key, value;
    for (key in templateKeys) {
      value = templateKeys[key];
      setInstructions[key] = value;
    }
  },

  includeGRPFields: function (setInstructions, templateKeys, objKeys) {
    objKeys.forEach(function (objKey) {
      var name = String(objKey.name);
      if (templateKeys[name]) {
        setInstructions[name] = templateKeys[name];
      }
    });
  },

  includeAllOptionHandler: function (setInstructions, template, target) {
    var me = this;
    me.includeMAPFields(setInstructions.MAP, template.sord.mapKeys);
    me.includeGRPFields(setInstructions.GRP, template.sord.objKeys, target.sord.objKeys);
  },

  buildInstructions: function (setInstructions, fieldConfig, target, template) {
    var me = this;

    // for a blank sord like the personnel file, you would define "includeAll=true"
    // sords already containing data like a document or structure don't need includeAll
    if (fieldConfig.includeAll) {
      me.includeAllOptionHandler(setInstructions, template, target);
    }

    // sords already containing data like document or structure can be emptied with this switch
    // this is not required for blank sords like the personnel file.
    if (fieldConfig.excludeAll) {
      me.excludeAllOptionHandler(setInstructions, target, template);
    }

    if (fieldConfig.exclude) {
      me.excludeOptionHandler(setInstructions, fieldConfig.exclude, target, template);
    }

    fieldConfig.modify && me.modifyOptionHandler(setInstructions, fieldConfig.modify, target);
  },

  /**
   * applies sourceSord's metadata to targetSord/Map according to the configuration
   * @param {Object} fieldConfig
   * @param {de.elo.ix.client.Sord} sourceSord
   * @param {de.elo.ix.client.Sord} targetSord
   * @param {de.elo.ix.client.MapData} targetMap
   */
  setByConfig: function (fieldConfig, sourceSord, targetSord, targetMap) {
    var me = this, target = { sord: targetSord, map: targetMap },
        instructionStorage = { GRP: {}, MAP: {} },  // will collect all instructions for set
        template = {};

    template.sord = sol.common.WfUtils.getTemplateSord(sourceSord).sord;
    template.target = sol.common.WfUtils.getTemplateSord(targetSord).sord;

    sol.common.TemplateUtils.render(fieldConfig, template);
    me.buildInstructions(instructionStorage, fieldConfig, target, template);
    me.applyInstructions(instructionStorage, target);
  },

  /**
   * Wrapper around setByConfig
   * @param {fieldConfig} fieldConfig
   * configuration: which fields to set ...
   * @param {objId} sourceId
   * objId of element which will be used as the metadata source
   * @param {objId} targetId
   * objId of element which will receive the metadata of source as defined in fieldConfig
   * @param {ixConnection} customConn
   * custom ixConnection e.g. if admin rights are required for reading from/writing to either of the elements
   *   //this could be used as an RF
   */
  setByConfigById: function (fieldConfig, sourceId, targetId, customConn) {
    var me = this, sourceSord, targetSord, targetMap,
        conn = customConn || ixConnect;
    sourceSord = conn.ix().checkoutSord(sourceId, SordC.mbAllIndex, LockC.NO);
    targetSord = conn.ix().checkoutSord(targetId, SordC.mbAllIndex, LockC.NO);
    targetMap = conn.ix().checkoutMap(MapDomainC.DOMAIN_SORD, targetId, null, LockC.NO);

    try {
      me.setByConfig(fieldConfig, sourceSord, targetSord, targetMap);
      conn.ix().checkinSord(targetSord, SordC.mbAll, LockC.NO); //targetsord was altered in setByConfig
      conn.ix().checkinMap(MapDomainC.DOMAIN_SORD, targetMap.id, targetId, targetMap.items, LockC.NO);
    } catch (e) {
      // try again
      me.logger.debug(["DUPLICATE KEY ERROR. Trying one more time...: '{0}'", e]);
      me.setByConfig(fieldConfig, sourceSord, targetSord, targetMap);
      conn.ix().checkinSord(targetSord, SordC.mbAll, LockC.NO); //targetsord was altered in setByConfig
      conn.ix().checkinMap(MapDomainC.DOMAIN_SORD, targetMap.id, targetId, targetMap.items, LockC.NO);
    }
  },

  /**
   * Most important function. Manipulates/Copies all files matching security and copyConfigs from sourceRoot to targetRoot
   * This function is not generic. It reads the inquiry config and writes GRP-fields. (could be made generic obviously)
   * @param {objId} sourceRoot
   * objId of folder which contains the personnel file
   * @param {String[]} security
   * Array of security classifications (=Strings)
   * @param {copyConfigs} copyConfigs
   * object containing all parameters for the copy operation
   * @param {ixConnection} targetRoot
   * custom ixConnection e.g. if admin rights are required for reading from/writing to either of the elements
   * @return {String[]}
   */
  copyTreeTo: function (sourceRoot, security, copyConfigs, targetRoot) {
    var me = this, baseConfigId, copyTreeResult,
        targetRootId, personnelName, name, wfMap;
    personnelName = targetRoot.name;

    baseConfigId = me.accessConfig.baseConfigId;

    name = me.mainFolderName + (me.reviewerUserId ? " (Review)" : "");
    targetRootId = me.mkdir({ id: targetRoot.id, name: name });  // could also pass a sord here, since sords have the same properties
    wfMap = sol.create("sol.common.WfMap", {
      flowId: me.flowId,
      objId: me.objId
    });
    wfMap.read();
    me.reviewerUserId && wfMap.setValue(me.reviewPathField, targetRootId);
    wfMap.write();

    targetRoot.name = personnelName;
    me.chaosId = me.objId;
    me.chaosGUID = ixConnect.ix().checkoutSord(me.chaosId, SordC.mbOnlyGuid, LockC.NO).guid;

    copyConfigs.forEach(function (cfg) {
      if (cfg.id === baseConfigId) {
        me.setByConfigById(cfg, me.personnelFileId, me.chaosId, ixConnect);
      } else {
        security.forEach(function (securitylevel) {
          copyTreeResult = me.copyTreeElements(me.generateFindInfo(sourceRoot, cfg.soltype, securitylevel, cfg.mask), me.chaosId);
          if (copyTreeResult.length === 2 && Array.isArray(copyTreeResult[0]) && Array.isArray(copyTreeResult[1]) && copyTreeResult[0].length === copyTreeResult[1].length) {
            // set desired fields according to the config
            copyTreeResult[0].forEach(function (sourceId, index) {
              me.setByConfigById(cfg, sourceId, copyTreeResult[1][index], ixConnect);
            });
            me.refineCreatedStructure(ixConnect.ix().checkoutSord(me.personnelFileId, SordC.mbAllIndex, LockC.NO), copyTreeResult[0], copyTreeResult[1], cfg);
          } else if (copyTreeResult.length !== 0) {
            throw "copyTreeElements returned an unexpected value. Maybe there are more or less source than target ids, which would indicate an uncaught Error during ix().processFindResult";
          }
        });
      }
    });

    return [me.chaosId, targetRootId];
  },

  prepareTemporaryPersonnelFile: function (cfg, inquirerUserId) {
    var me = this, chaosTargetRelation, securityLevels;
    securityLevels = (me.securityLevels.split(",")).map(function (x) {
      return (x.split(" -")[0]);
    });

    chaosTargetRelation = me.copyTreeTo(me.personnelFileId, securityLevels, cfg.fieldConfigs, sol.common.UserUtils.getUserFolder(inquirerUserId));
    return chaosTargetRelation;
  },

  process: function () {
    var me = this, result, personalSubFolderId, deleteOptions = new DeleteOptions();
    if (me.personnelFileId) {
      result = me.prepareTemporaryPersonnelFile(me.accessConfig, me.reviewerUserId || me.inquirerUserId);
      ixConnect.ix().refSord(0, result[1], result[0], -1);
      sol.common.AclUtils.changeRightsInBackground(result[1], me.reviewerUserId ? me.reviewerRights : me.inquirerRights);
    } else if (me.reviewPathId) {
      personalSubFolderId = me.mkdir({ id: sol.common.UserUtils.getUserFolder(me.inquirerUserId).id, name: me.mainFolderName });
      sol.common.AclUtils.changeRightsInBackground(personalSubFolderId, me.inquirerRights);
      ixConnect.ix().refSord(me.reviewPathId, personalSubFolderId, me.objId, -1);
      try {
        deleteOptions.folderMustBeEmpty = true;
        ixConnect.ix().deleteSord(null, me.reviewPathId, LockC.NO, deleteOptions);
      } catch (ex) {
        // folder not empty ... keep it and ignore error
        me.logger.debug(["could not delete folder '{0}': {1}", me.reviewPathId, ex]);
      }
    }
    return { passOn: true };
  }
});