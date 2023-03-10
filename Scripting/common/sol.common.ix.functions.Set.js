
importPackage(Packages.de.elo.ix.client);


//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.CounterUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.Set" }); // eslint-disable-line one-var

/**
 * Edits an existing object by changing the mask or setting different values.
 *
 * # As workflow node
 *
 * ObjId is set based on the element that the workflow is attached to.
 *
 * Following configuration should be applied to the comments field for a mask and field update:
 *
 * ## Example
 *
 *     {
 *       "entries": [{
 *         "type": "MASK",        // changes the mask of the sord, if defined more than once, the first one will be used
 *         "value": "Basic Entry"
 *       }, {
 *         "type": "SORD",
 *         "key": "name",
 *         "value": "Contract {{sord.objKeys.CONTRACT_NAME}} - {{count 'MY_CONTRACT_COUNTER'}}",
 *         "useTemplating": true
 *       }, {
 *         "type": "GRP",
 *         "key": "CONTRACT_STATUS",
 *         "value": "D",
 *         "useDynKwl": true,
 *         "dynKwlCfg": {
 *           "filterColumn": 0,
 *           "returnColumn": 2
 *         },
 *         "onlyIfEmpty": true
 *       }, {
 *         "type": "MAP",
 *         "key": "USER",
 *         "value": "Bill Gates",
 *       }, {
 *         "type": "WFMAP",
 *         "key": "USER",
 *         "value": "Steve Jobs"
 *       }]
 *     }
 *
 * Following configuration should be applied to the comments field and will set a value from the fields KWL starting with '3'
 *
 *     {
 *       "entries": [{
 *         "type": "GRP",
 *         "key": "INVOICE_STATUS",
 *         "value": "3",
 *         "useKwl": true
 *        }]
 *     }
 *
 * Following configuration will set a field from the fields dynamic KWL staring with 'M' (e.g. M - month) from a localized dynamic KWL
 *
 *     {
 *       "type": "GRP",
 *       "key": "REMINDER_PERIOD_UNIT",
 *       "value": "M",
 *       "useDynKwl": true,
 *       "dynKwlCfg": {
 *         "returnColumn": 2,
 *         "filterColumn": 0
 *       }
 *     }
 *
 * # As IX function call
 *
 * In addition to the workflow node configuration the objId must be passed.
 *
 *     sol.common.IxUtils.execute("RF_sol_function_Set", {
 *       objId: "4711",
 *       entries: [{
 *         type: "GRP",
 *         key: "INVOICE_STATUS",
 *         value: "3",
 *         useKwl: true
 *       }]
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.02.004
 *
 * @eloix
 * @requires sol.Logger
 * @requires sol.common.SordUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.CounterUtils
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.Set", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "entries"],

  types: ["MASK", "SORD", "GRP", "MAP", "FORMBLOB", "WFMAP"],


  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {Object[]} entries (required)
   * Entries that contains the values to set
   */

  /**
   * @cfg {String} flowId
   * Flow ID
   */

  /**
   * @cfg {String} timeZone
   * Time zone
   */

  /**
   * @cfg {String} setParent
   * If set parent sord is setted
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    me.sordMaskChanged = false;
  },

  /**
   * Sets a field value
   */
  process: function () {
    var me = this,
        i, entry, type, func, entries;

    if (!me.entries) {
      return;
    }

    me.logger.debug(["sol.common.ix.functions.Set: entries={0}", JSON.stringify(me.entries)]);

    me.entries = sol.common.ObjectUtils.clone(me.entries);

    me.separatedEntries = {};

    me.sordData = [];

    me.sordMapKeyValues = [];
    me.sordFormdataValues = []; //blob
    me.wfMapKeyValues = [];

    if (me.timeZone) {
      me.savedTimeZone = ixConnect.loginResult.clientInfo.timeZone;
      ixConnect.loginResult.clientInfo.timeZone = me.timeZone;
      me.logger.debug(["user.name={0}, timeZone={1}", ixConnect.loginResult.user.name, ixConnect.loginResult.clientInfo.timeZone]);
    }

    me.sord = sol.common.RepoUtils.getSord(me.objId, { sordZ: SordC.mbAllIndex });

    if (me.setParent) {
      if (me.sord.id === 1 || me.sord.parentId === 0) {
        me.logger.info(["me.sord.id={0}, me.sord.parentId={1} Parent cannot be set", me.sord.id, me.sord.parentId]);
        throw "me.sord.id=" + me.sord.id + ", me.sord.parentId=" + me.sord.parentId + " Parent cannot be set";
      }
      me.sord = sol.common.RepoUtils.getSord(me.sord.parentId, { sordZ: SordC.mbAllIndex });
    }

    for (i = 0; i < me.entries.length; i++) {
      entry = me.entries[i];
      type = entry.type.toUpperCase();
      if (me.types.indexOf(entry.type) < 0) {
        throw "Unsupported type: " + entry.type;
      }
      if (!me.filterEntry(me.sord, entry)) {
        me.separatedEntries[type] = me.separatedEntries[type] || [];
        me.separatedEntries[type].push(entry);
      }
    }

    for (i = 0; i < me.types.length; i++) {
      type = me.types[i];
      func = me["processType" + type];
      entries = me.separatedEntries[type];
      me.logger.debug(["separatedEntries[{0}]={1}", type, JSON.stringify(entries)]);
      if (func && entries) {
        func.call(me, me.separatedEntries[type]);
      }
    }

    me.saveSordValues();
    me.saveWorkflowValues();

    if (me.savedTimeZone) {
      ixConnect.loginResult.clientInfo.timeZone = me.savedTimeZone;
    }
  },

  emptyFilterTypes: ["GRP", "MAP"],

  filterEntry: function (sord, entry) {
    var me = this;
    return !!(
      ~me.emptyFilterTypes.indexOf(entry.type)
      && entry.onlyIfEmpty
      && String(sol.common.SordUtils.getValue(sord, entry) || "")
    );
  },

  processTypeMASK: function (maskEntries) {
    var me = this,
        mask;

    if (maskEntries.length > 0) {
      mask = maskEntries[0].value;
      if (mask && sol.common.SordUtils.docMaskExists(mask)) {
        me.sord = ixConnect.ix().changeSordMask(me.sord, mask, EditInfoC.mbSord).sord;
        me.sordMaskChanged = true;
      }
    }
  },

  processTypeSORD: function (sordEntries) {
    var me = this;
    me.applyTemplates(sordEntries);
    me.sordData = me.sordData.concat(sordEntries);
  },

  processTypeGRP: function (grpEntries) {
    var me = this,
        i, entry;

    me.applyTemplates(grpEntries);

    for (i = 0; i < grpEntries.length; i++) {
      entry = grpEntries[i];
      if (entry.useKwl) {
        entry.value = me.getValueFromKwl(entry.key, entry.value);
      } else if (entry.useDynKwl) {
        entry.value = me.getValueFromDynKwl(me.sord.maskName, entry.key, entry.value, entry.dynKwlCfg, entry.useForeignKey);
      }
    }
    me.sordData = me.sordData.concat(grpEntries);
  },

  processTypeMAP: function (sordMapEntries) {
    var me = this,
        i, entry;
    me.applyTemplates(sordMapEntries);

    for (i = 0; i < sordMapEntries.length; i++) {
      entry = sordMapEntries[i];
      me.sordMapKeyValues.push(new KeyValue(entry.key, entry.value));
    }
  },

  processTypeFORMBLOB: function (sordMapEntries) {
    var me = this, blb,
        i, entry;
    me.applyTemplates(sordMapEntries);

    for (i = 0; i < sordMapEntries.length; i++) {
      entry = sordMapEntries[i];

      if (entry.asJSON) {
        try {
          entry.value = JSON.stringify(entry.value);
        } catch (e) {
          throw "SET: could not stringify value marked with option 'asJSON'. Writing to FORMBLOB field `" + entry.key + "` failed.";
        }
      }

      blb = new MapValue((new java.lang.String(entry.key)), (new FileData("text/plain", (new java.lang.String(entry.value)).getBytes(java.nio.charset.StandardCharsets.UTF_8))));
      me.sordFormdataValues.push(blb);
    }
  },

  processTypeWFMAP: function (wfMapEntries) {
    var me = this,
        i, entry;
    me.applyTemplates(wfMapEntries);

    for (i = 0; i < wfMapEntries.length; i++) {
      entry = wfMapEntries[i];
      me.wfMapKeyValues.push(new KeyValue(entry.key, entry.value));
    }
  },

  applyTemplates: function (entries) {
    var me = this,
        i, entry;

    for (i = 0; i < entries.length; i++) {
      entry = entries[i];
      if (entry.useTemplating && entry.value) {
        me.tplSord = me.tplSord || sol.common.WfUtils.getTemplateSord(me.sord, me.flowId);
        entry.value = sol.create("sol.common.Template", { source: entry.value }).apply(me.tplSord);
      }
    }
  },

  /**
   * @private
   */
  saveSordValues: function () {
    var me = this,
        sordDirty = me.sordMaskChanged;

    if (me.sordData && (me.sordData.length > 0)) {
      sol.common.SordUtils.updateSord(me.sord, me.sordData);
      sordDirty = true;
    }
    if (sordDirty) {
      ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
    }
    if (me.sordMapKeyValues && (me.sordMapKeyValues.length > 0)) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sord.id || me.objId, me.sord.id || me.objId, me.sordMapKeyValues, LockC.NO);
    }
    if (me.sordFormdataValues && (me.sordFormdataValues.length > 0)) { // blob
      ixConnect.ix().checkinMap("formdata", me.sord.id || me.objId, me.sord.id || me.objId, me.sordFormdataValues, LockC.NO);
    }
  },

  /**
   * @private
   */
  saveWorkflowValues: function () {
    var me = this;
    if (me.wfMapKeyValues && (me.wfMapKeyValues.length > 0)) {
      if (!me.flowId) {
        throw "Flow ID is empty";
      }
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_WORKFLOW_ACTIVE, me.flowId, me.sord.id || me.objId, me.wfMapKeyValues, LockC.NO);
    }
  },

  /**
   * @private
   * Retrieves a value from the keyword list of the specified field.
   * It checks, if one of the entries in the keyword list starts with the valuePrefix.
   * @param {String} fieldName
   * @param {String} valuePrefix
   * @return {String} The found item from the keyword list or the valuePrefix, if nothing was found
   */
  getValueFromKwl: function (fieldName, valuePrefix) {
    var kwl, items, i, item;

    kwl = ixConnect.ix().checkoutKeywordList(fieldName, KeywordC.mbView, 30, LockC.NO);

    if (kwl) {
      items = kwl.children;
      for (i = 0; i < items.length; i++) {
        item = items[i].text;
        if (item.startsWith(valuePrefix)) {
          return item;
        }
      }
    } else {
      this.logger.warn(["No keywordlist for field '{0}'", fieldName]);
    }

    this.logger.warn(["No keywordlist match for: '{0}'", valuePrefix]);
    return valuePrefix;
  },

  /**
   * @private
   * Retrieves a value from the dynamic keyword list of the spezified field.
   * It checks, if one of the entries in the keyword list starts with the valuePrefix.
   * @param {String} maskName
   * @param {String} fieldName
   * @param {String} valuePrefix
   * @param {Object} config
   * @param {Object} foreignKeyConfig
   * @return {String} The found item from the keyword list or the valuePrefix, if nothing was found
   */
  getValueFromDynKwl: function (maskName, fieldName, valuePrefix, config, foreignKeyConfig) {
    var me = this, params, result;

    params = { data: valuePrefix };

    if (config) {
      params.returnColumn = config.returnColumn;
      params.filterColumn = config.filterColumn;
    }

    if (foreignKeyConfig) {
      foreignKeyConfig.value === undefined
        && me.entries.some(function (entry) {
          return (entry.key === foreignKeyConfig.key)
            && ((foreignKeyConfig.value = entry.value), true); // empty strings are ok
        });
      if (foreignKeyConfig.value === undefined) {
        throw "No value found for foreignKey " + foreignKeyConfig.key + ". Please define an array-entry having said key or define a value directly in `useForeignKey`";
      }
      params.useForeignKey = foreignKeyConfig;
    }

    result = sol.common.SordUtils.getDynamicKeywordlistValue(maskName, fieldName, params);

    if (result.length <= 0) {
      this.logger.warn(["No keywordlist match for: '{0}'", valuePrefix]);
    } else if (result.length > 1) {
      this.logger.warn(["No unique keywordlist match for: '{0}'", valuePrefix]);
    } else {
      valuePrefix = result[0];
    }

    return result;
  }
});

/**
 * @member sol.common.ix.functions.Set
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onEnterNode_Set", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "entries");

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  module = sol.create("sol.common.ix.functions.Set", params);

  module.process();

  logger.exit("onEnterNode_Set");
}

/**
 * @member sol.common.ix.functions.Set
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clientInfo, userId, wfDiagram, nodeId) {
  var params, module;

  logger.enter("onExitNode_Set", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId, "entries");

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  module = sol.create("sol.common.ix.functions.Set", params);

  module.process();

  logger.exit("onExitNode_Set");
}


/**
 * @member sol.common.ix.functions.Set
 * @method RF_sol_function_Set
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_Set(ec, args) {
  var params, module;

  logger.enter("RF_sol_function_Set", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "entries");
  module = sol.create("sol.common.ix.functions.Set", params);

  module.process();

  logger.exit("RF_sol_function_Set");
}
