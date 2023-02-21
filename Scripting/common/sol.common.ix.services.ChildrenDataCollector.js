
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ChildrenDataCollector" });

/**
 * Collects all child sords for a given parent in an optimized way.
 *
 * This should be used by dashboards if a larger amount of Sords should be retrieved. In addition information of
 * required keyword forms and the user locale is returned.
 *
 * Please gather information carefully. Only the required objKeys and sordKeys should be collected by this service due
 * to performance improvements. e.g.
 *
 * Collecting 10,000 invoices for the invoice dashboard takes ~15s and creates ~80MB of traffic using the IX JS-API since
 * deserializing objects might be expensive. Since only a view information is required this service brings down
 * the execution time to ~5-6s and reduces data traffic to ~6MB. This is done by creating a minimized json-data structure
 * with the help of a string builder.
 *
 * # Example
 *
 * By default StatisticSord formatter is used for generating objects that are optimized for statistical
 * operations. Refer to sol.common.ObjectFormatter.StatisticSord for more information.
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_ChildrenDataCollector", {
 *       parentId: '1213',
 *       objKeys: ["INVOICE_DATE", "INVOICE_AMOUNT"]
 *     });
 *
 * # Result
 *
 *     {
 *       version: '1',
 *       formatter: 'sol.common.ObjectFormatter.StatisticSord',
 *       locale: {
 *         language: 'de',
 *         dateFormat: 'dd.MM.yyyy',
 *         decimalSeperator: ',',
 *         groupingSeperator: '.'
 *       },
 *       sords: [{
 *        id: '5669',
 *        name: 'Invoice 123',
 *        O_INVOICE_DATE: '20151202'
 *       }, {
 *         // more sords ...
 *       }],
 *       docMasks: {
 *         'Incoming Invoice': {
 *           fields: {
 *             INVOICE_DATE: { name: 'Invoice Date', type: 'text' }
 *           }
 *         }
 *       }
 *     }
 */
sol.define("sol.common.ix.services.ChildrenDataCollector", {
  extend: "sol.common.ix.ServiceBase",

  collectorVersion: "1.00.000",

  /**
   * @cfg {String} maskName
   * Restricts search results to a given keywording mask
   */
  maskName: null,

  /**
   * @cfg {String} maskNames
   * Restricts search results to the given keywording masks
   */
  maskNames: null,

  /**
   * @cfg {String} parentId
   * id of the parent element (guid, objId or archivepath)
   */
  parentId: null,

  /**
   * @cfg {int} endLevel
   * Search child objects up to this level below parentId.
   *
   * Please note that recursively collecting child nodes is expensive and should be handled with care.
   *
   * A value of 0 or 1 means, that only the sub entries directly under the parent are included.
   * Set this value to -1, to search over all levels.
   * In this case the level is internally constrained to 32 to avoid an endless loop,
   * if the tree under the parent contains recursive references.
   */
  endLevel: 1,

  /**
   * @cfg {Boolean} [mainParent=false]
   * Return no references
   */
  mainParent: false,

  /**
   * @cfg {Class} formatter (required)
   * Sord object formatter implementation.
   *
   * e.g. `sol.common.ObjectFormatter.StatisticSord` or `sol.common.ObjectFormatter.TemplateSord`
   */
  formatter: "sol.common.ObjectFormatter.StatisticSord",

  /**
   * @cfg {Array} sordKeys
   * List of required sord keys.
   *
   * This only returns the given sord keys. This is required in order to limit traffic for not required keys.
   *
   *     sordKeys: ["id", "guid", "name", "desc"],
   */
  sordKeys: ["id", "name"],

  /**
   * @cfg {Array} objKeys
   * List of required objKeys.
   *
   * This only returns the given objKeys. This is required in order to limit traffic for not required keys.
   *
   *     objKeys: ["INVOICE_DATE", "INVOICE_AMOUNT"],
   */
  objKeys: [],

  /**
   * @cfg {Array} filter
   * List of metadata that limit search results.
   *
   * This limits search results to a given list of metadata. This list is passed as an FindByIndex ObjKey-Array while
   * collecting search results.
   *
   *     filter: [{ key: 'INVOICE_DATE', val: 'x*' }],
   *
   */
  filter: [],

  /**
   * @cfg {Boolean} [returnDataDefinition=false]
   * If `true`, the service returns the data definition for the object, which is necessary for the convertion to XML.
   */
  returnDataDefinition: false,

  /**
   * @cfg {Boolean} [addSordTypeKind=false]
   * If `true`, the service returns the kind of the sord type, e.g. "REPOSITORY", "FOLDER" or "DOCUMENT".
   */
  addSordTypeKind: false,

  /**
    * @cfg {Boolean} [onlyFolders=undefined]
    * Restricts search to include folders.
    * If true and onlyDocuments is false or unset, only folders will be returned.
    * If true and onlyDocuments is also true, folders and documents will be returned.
    * If set to false or unset no restriction will be applied.
    */
  onlyFolders: undefined,

  /**
    * @cfg {Boolean} [onlyDocuments=undefined]
    * Restricts search to include documents.
    * If true and onlyFolders is alse or unset, only documents will be returned.
    * If true and onlyFolders is also true, documents and folders will be returned.
    * If set to false or unset no restriction will be applied.
    */
  onlyDocuments: undefined,

  /**
   * @property {Object} dataDefinition for xml transformation
   * This contains the data definition for the result if json objects should be transformed to XML.
   */
  dataDefinition: {
    rootElementName: "data",
    dataProperties: ["sord", "sords"],
    arrayElementTagNames: { sords: "sord" }
  },

  /**
   * @property {Number} maxFind
   * Amount of sords that is collected in one step.
   * This is used by the FindFirstSords, FindNextSords function calls.
   */
  maxFind: 1000,

  /**
   * @property {Number} totalCount
   * The search is terminated if this number of objects is found. If the number of results should not be constrained,
   * set this value to 232-1 = 2147483647 (maximum value of a positive 32bit integer minus 1).
   *
   * Please note that collecting huge amounts of data might lead to performance issues.
   */
  totalCount: 10000,

  sordKeyMap: {
    id: { elementSelector: ObjDataC.mbId },
    maskName: { elementSelector: ObjDataC.mbMask },
    guid: { elementSelector: ObjDataC.mbGuid },
    name: { elementSelector: ObjDataC.mbName },
    IDateIso: { elementSelector: ObjDataC.mbIDate },
    XDateIso: { elementSelector: ObjDataC.mbXDate },
    desc: { elementSelector: SordC.mbDesc },
    ownerName: { elementSelector: SordC.mbOwnerName }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.maskName = config.maskName || me.maskName;
    me.parentId = config.parentId || me.parentId;
    me.formatter = config.formatter || me.formatter;
    me.sordKeys = config.sordKeys || me.sordKeys;
    me.objKeys = config.objKeys || me.objKeys;
    me.hiddenObjKeys = config.hiddenObjKeys || me.hiddenObjKeys;
    me.hiddenObjKeyPrefix = config.hiddenObjKeyPrefix || me.hiddenObjKeyPrefix;
    me.allObjKeys = config.allObjKeys || me.allObjKeys;
    me.ec = config.ec || me.ec;
    me.endLevel = config.endLevel || me.endLevel;
    me.returnDataDefinition = config.returnDataDefinition || me.returnDataDefinition;
    me.addSordTypeKind = config.addSordTypeKind || me.addSordTypeKind;
    me.onlyFolders = config.onlyFolders;
    me.onlyDocuments = config.onlyDocuments;
    me.filter = config.filter || me.filter;

    me.objKeyMap = {};
    me.jsonData = [];
    me.docMasks = {};
  },

  /**
   * Starts the collection of the desired data
   * @return {Array}
   */
  execute: function () {
    var me = this;
    me.rfUtils = sol.common.ix.RfUtils;
    me.computeSordElementSelector();
    me.getTypeConstants();

    // add data collector version and formatting information
    me.jsonData.push("{");
    me.jsonData.push('"version":' + JSON.stringify(me.collectorVersion) + ",");
    me.jsonData.push('"formatter":' + JSON.stringify(me.formatter) + ",");
    if (me.returnDataDefinition === true) {
      me.jsonData.push('"dataDefinition":' + JSON.stringify(me.dataDefinition) + ",");
    }

    // add locale information
    me.jsonData.push('"locale":');
    me.addLocale();

    // add current sord
    me.collectSord();

    // add child sords
    me.jsonData.push(",");
    me.jsonData.push('"sords":');
    me.collectChildren();

    // add doc masks information
    me.jsonData.push(",");
    me.jsonData.push('"docMasks":');
    me.jsonData.push(JSON.stringify(me.docMasks));

    me.jsonData.push("}");

    return me.jsonData.join("");
  },

  /**
   * @private
   *
   * Computes a SordZ selector for information that is required.
   */
  computeSordElementSelector: function () {
    var me = this,
        sordKey, elementSelector, i, objKeyName;
    me.sordZ = new SordZ(ObjDataC.mbMask);
    if (me.sordKeys) {
      me.sordKeys.forEach(function (key) {
        sordKey = me.sordKeyMap[key];
        if (sordKey) {
          elementSelector = sordKey.elementSelector;
        }
        if (elementSelector) {
          me.sordZ.add(elementSelector);
        }
      });
    }
    if (me.objKeys) {
      me.sordZ.add(SordC.mbObjKeys);
      for (i = 0; i < me.objKeys.length; i++) {
        objKeyName = me.objKeys[i];
        me.objKeyMap[objKeyName] = true;
      }
    }
  },

  /**
   * @private
   */
  collectSord: function () {
    var me = this,
        sord,
        formatter = me.getSordFormatter(),
        editInfoZ = new EditInfoZ();

    if (!me.parentId) {
      return;
    }
    editInfoZ.sordZ = me.sordZ;
    sord = ixConnect.ix().checkoutSord(me.parentId, editInfoZ, LockC.NO).sord;
    if (!me.docMasks[sord.maskName]) {
      me.addDocMaskData(sord.maskName);
    }
    me.jsonData.push(",");
    me.jsonData.push('"sord":');

    me.jsonData.push(me.getFormattedJson(formatter, sord, me.docMasks[sord.maskName]));
  },

  /**
   * @private
   */
  collectChildren: function () {
    logger.enter("collectChildren");
    var me = this,
        i, filter, objKey, idx, length,
        formatter = me.getSordFormatter(),
        jsonData = [],
        findInfo = new FindInfo(),
        objKeyFilters = [],
        findResult;

    if (me.parentId) {
      findInfo.findChildren = new FindChildren();
      findInfo.findChildren.parentId = me.parentId;
      findInfo.findChildren.endLevel = me.endLevel;
      findInfo.findChildren.mainParent = me.mainParent;
    }

    // apply optional mask filter
    if (me.maskName) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      findInfo.findByIndex.maskId = me.maskName;
    }

    if (me.shouldSearchOnlyFolders()) {
      me.searchOnlyFolders(findInfo);
    }

    if (me.shouldSearchOnlyDocuments()) {
      me.searchOnlyDocuments(findInfo);
    }

    if (me.maskNames) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      findInfo.findByIndex.maskIds = me.maskNames;
    }

    // apply filter
    if (me.filter && me.filter.length > 0) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      for (i = 0; i < me.filter.length; i++) {
        filter = me.filter[i];
        objKey = new ObjKey();
        objKey.name = filter.key;
        objKey.data = [filter.val];
        logger.info("applied filter:", objKey);
        objKeyFilters.push(objKey);
      }
      findInfo.findByIndex.objKeys = objKeyFilters;
    }

    // apply find options
    findInfo.findOptions = new FindOptions();
    findInfo.findOptions.totalCount = me.totalCount;

    try {
      idx = 0;
      findResult = ixConnect.ix().findFirstSords(findInfo, me.maxFind, me.sordZ);
      while (true) {
        for (i = 0, length = findResult.sords.length; i < length; i++) {
          if (!me.docMasks[findResult.sords[i].maskName]) {
            me.addDocMaskData(findResult.sords[i].maskName);
          }
          jsonData.push(
            me.getFormattedJson(
              formatter,
              findResult.sords[i],
              me.docMasks[findResult.sords[i].maskName],
              { addSordTypeKind: me.shouldIncludeSordType() }
            ));
        }
        if (!findResult.moreResults) {
          break;
        }
        idx += findResult.sords.length;
        findResult = ixConnect.ix().findNextSords(findResult.searchId, idx, me.maxFind, me.sordZ);
      }
    } finally {
      if (findResult) {
        ixConnect.ix().findClose(findResult.searchId);
      }
    }

    me.jsonData.push("[");
    me.jsonData.push(jsonData.join(","));
    me.jsonData.push("]");
    logger.exit("collectChildren");
  },

  /**
   * @private
   * @return {boolean}
   */
  shouldSearchOnlyFolders: function () {
    var me = this;

    return me.onlyFolders;
  },

  /**
   * @private
   * @param {de.elo.ix.client.FindInfo} findInfo
   */
  searchOnlyFolders: function (findInfo) {
    var me = this;

    findInfo.findByType = findInfo.findByType || new FindByType();
    findInfo.findByType.typeStructures = me.onlyFolders;
  },

  /**
   * @private
   * @return {boolean}
   */
  shouldSearchOnlyDocuments: function () {
    var me = this;

    return me.onlyDocuments;
  },

  /**
   * @private
   * @param {de.elo.ix.client.FindInfo} findInfo
   */
  searchOnlyDocuments: function (findInfo) {
    var me = this;

    findInfo.findByType = findInfo.findByType || new FindByType();
    findInfo.findByType.typeDocuments = me.onlyDocuments;
  },

  /**
   * @private
   * @param {Object} formatter
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} maskName
   * @param {Object} params
   * @return {String} formatted json
   */
  getFormattedJson: function (formatter, sord, maskName, params) {
    return formatter.buildJson(
      sord,
      maskName || null,
      params || null
    );
  },

  /**
   * @private
   * @return {boolean}
   */
  shouldIncludeSordType: function () {
    var me = this;

    return me.addSordTypeKind;
  },

  /**
   * @private
   * @return {Object}
   */
  getSordFormatter: function () {
    var me = this;

    return sol.create(me.formatter, {
      config: {
        objKeys: me.objKeys,
        hiddenObjKeys: me.hiddenObjKeys,
        hiddenObjKeyPrefix: me.hiddenObjKeyPrefix,
        sordKeys: me.sordKeys
      }
    });
  },

  /**
   * @private
   */
  addLocale: function () {
    var me = this;
    me.userFormats = sol.create("sol.common.Locale", { ec: me.ec });
    me.userFormats.read();

    me.jsonData.push('{"language": "');
    me.jsonData.push(me.userFormats.language);
    me.jsonData.push('", "dateFormat": "');
    me.jsonData.push(me.userFormats.dateFormat);
    me.jsonData.push('", "decimalSeparator": "');
    me.jsonData.push(me.userFormats.decimalSeparator);
    me.jsonData.push('", "groupingSeparator": "');
    me.jsonData.push(me.userFormats.groupingSeparator);
    me.jsonData.push('"}');
  },

  /**
   * @private
   * Adds document mask data
   * @param {String} maskName
   * @return {Object}
   */
  addDocMaskData: function (maskName) {
    var me = this;
    if (!me.docMasks[maskName]) {
      me.docMasks[maskName] = me.buildDocMaskData(maskName);
    }
    return me.docMasks[maskName];
  },

  /**
   * @private
   * Builds the document mask data
   * @param {String} docMaskName Document mask name
   * @return {Object}
   */
  buildDocMaskData: function (docMaskName) {
    var me = this,
        docMask, docMaskData;

    docMaskData = { fields: {} };

    try {
      docMask = sol.common.SordUtils.getDocMask(docMaskName, me.ec.ci.language);
      docMask.lines.forEach(function (docMaskLine) {
        if (me.objKeyMap[docMaskLine.key]) {
          docMaskData.fields[docMaskLine.key] = { name: String(docMaskLine.name), type: me.docMaskLineTypes[docMaskLine.type] };
        }
      });
    } catch (ex) {
      me.logger.warn(["Can't get mask info: mask={0}, ec.ci.language={1}, exception={2}", docMaskName, me.ec.ci.language, ex]);
    }

    return docMaskData;
  },

  /**
   * @private
   */
  getTypeConstants: function () {
    var me = this,
        i, field, docMaskLineC, fields;
    me.docMaskLineTypes = {};
    docMaskLineC = new DocMaskLineC();
    fields = docMaskLineC.class.declaredFields;
    for (i = 0; i < fields.length; i++) {
      field = fields[i];
      field.accessible = true;
      if (field.name.startsWith("TYPE_")) {
        me.docMaskLineTypes[String(field.getInt(docMaskLineC))] = String(field.name.substring(5));
      }
    }
  }

});

/**
 * @member sol.common.ix.services.ChildrenDataCollector
 * @method RF_sol_common_services_ChildrenDataCollector
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_ChildrenDataCollector(ec, configAny) {
  var config, jsonDataCollector, ecLang, ixConnectLang, result;

  ecLang = String(ec.ci.language);
  ixConnectLang = String(ixConnect.loginResult.clientInfo.language);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
  config.ec = ec;

  log.info("ec.ci.language=" + ecLang);
  log.info("ixConnect.loginResult.clientInfo.language=" + ixConnectLang);

  jsonDataCollector = sol.create("sol.common.ix.services.ChildrenDataCollector", config);
  result = jsonDataCollector.execute();
  return result;
}
