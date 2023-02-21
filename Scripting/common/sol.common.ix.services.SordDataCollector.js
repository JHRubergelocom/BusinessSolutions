
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.SordDataCollector" });

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
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_SordDataCollector_FindFirst", {
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
 *       },
 *       moreResults: true,
 *       searchId: "(0E9AC245-EB29-AB61-5F81-1D744E00EDB8)"
 *     }
 *
 *  # Handling paging in search results
 *
 *  The current search might contain more results that are not returned. The amount of items returned by one search request can be defined by `maxFind`.
 *  A search is automatically closed if all items are returned. If paging is required `moreResults=true` is returned including a `searchId` for upcoming requests.
 *
 *      moreResults: true,
 *      searchId: "(0E9AC245-EB29-AB61-5F81-1D744E00EDB8)"
 *
 *  Additional results can be retrieved using a search id and the index. If `idx=50` is passed the search will return the items 50-100 items (as defined by maxFind=50).
 *
 *      var result = sol.common.IxUtils.execute("RF_sol_common_services_SordDataCollector_FindNext", {
 *        searchId: "(0E9AC245-EB29-AB61-5F81-1D744E00EDB8)",
 *        idx: 50
 *      });
 *
 * Please note that search requests must be closed if a search id was returned.
 *
 *      var result = sol.common.IxUtils.execute("RF_sol_common_services_SordDataCollector_FindClose", {
 *        searchId: "(0E9AC245-EB29-AB61-5F81-1D744E00EDB8)"
 *      });
 *
 */
sol.define("sol.common.ix.services.SordDataCollector", {
  extend: "sol.common.ix.ServiceBase",

  collectorVersion: "1.00.000",

  /**
   * @cfg {String} maskName
   * Restricts search results to a given keywording mask
   */
  maskName: null,

  /**
   * @cfg {Class} formatter (required)
   * Sord object formatter implementation.
   *
   * e.g. `sol.common.ObjectFormatter.StatisticSord` or `sol.common.ObjectFormatter.TemplateSord`
   */
  formatter: "sol.common.ObjectFormatter.TemplateSord",

  /**
   * @cfg {Array} sordKeys
   * List of required sord keys.
   *
   * This only returns the given sord keys. This is required in order to limit traffic for not required keys.
   *
   *     sordKeys: ["id", "guid", "name", "desc"],
   */
  sordKeys: ["id", "guid", "name"],

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
   * If `true`, the service returns the data definition for the object, which is necessary for the conversion to XML.
   */
  returnDataDefinition: false,

  /**
   * @cfg {String} pageOfObjId Page-of GUID
   * The returned page will be determinated by the specified object ID
   */
  pageOfObjId: undefined,

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
  maxFind: 50,

  /**
   * @property {Number} totalCount
   * The search is terminated if this number of objects is found. If the number of results should not be constrained,
   * set this value to 232-1 = 2147483647 (maximum value of a positive 32bit integer minus 1).
   *
   * Please note that collecting huge amounts of data might lead to performance issues.
   */
  totalCount: 10000,


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
   * @cfg {String} searchMode (INDEX or DIRECT)
   * Defines the search mode. Available modes are FindByIndex (Mode `INDEX`) or Direct-Search (Mode `Direct`).
   */
  searchMode: "INDEX",

  /**
   * @protected
   */
  sordKeyMap: {
    id: { elementSelector: ObjDataC.mbId },
    maskName: { elementSelector: ObjDataC.mbMask },
    ownerName: { elementSelector: SordC.mbMinMembers },
    guid: { elementSelector: ObjDataC.mbGuid },
    name: { elementSelector: ObjDataC.mbName },
    IDateIso: { elementSelector: ObjDataC.mbIDate },
    XDateIso: { elementSelector: ObjDataC.mbXDate },
    desc: { elementSelector: SordC.mbDesc }
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.maskName = config.maskName || me.maskName;
    me.formatter = config.formatter || me.formatter;
    me.sordKeys = config.sordKeys || me.sordKeys;
    me.objKeys = config.objKeys || me.objKeys;
    me.ec = config.ec || me.ec;
    me.returnDataDefinition = config.returnDataDefinition || me.returnDataDefinition;
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

    if (me.pageOfObjId) {
      me.determinatePageStartIdxByObjId();
    }

    // add child sords
    me.collectSords();

    // add doc masks information
    me.jsonData.push(",");
    me.jsonData.push('"docMasks":');
    me.jsonData.push(JSON.stringify(me.docMasks));

    me.jsonData.push("}");

    return me.jsonData.join("");
  },

  /**
   * @private
   * @param {String} objId Object ID
   * @param {Number} pageSize Page size
   */
  determinatePageStartIdxByObjId: function () {
    var me = this,
        findInfo, ids, page, idxObjId, pageStartIdx;

    me.objId += "";
    findInfo = new FindInfo();
    me.buildFindInfo(findInfo);

    ids = me.findGuids(findInfo);

    me.pageOfObjId = ixConnect.ix().checkoutSord(me.pageOfObjId, SordC.mbOnlyGuid, LockC.NO).guid + "";

    idxObjId = ids.indexOf(me.pageOfObjId);
    me.jsonData.push(', "pageOfObjId": "' + me.pageOfObjId + '"');
    me.jsonData.push(', "idxObjId": ' + idxObjId);
    me.jsonData.push(', "maxFind": ' + me.maxFind);

    if (idxObjId < 0) {
      logger.warn(["Could not find specified objId '{0}' in children requested by user '{1}'", me.pageOfObjId, ixConnect.loginResult.user.name]);
      page = -1;
      pageStartIdx = -1;
    } else {
      page = Math.floor(idxObjId / me.maxFind);
      pageStartIdx = page * me.maxFind;
    }

    me.idx = pageStartIdx;

    me.jsonData.push(', "page": ' + page);
    me.jsonData.push(', "pageStartIdx": ' + pageStartIdx);
  },

  /**
   * @private
   * @param {de.elo.ix.client.FindInfo} findInfo Find info
   * @return {Array}
   */
  findGuids: function (findInfo) {
    var me = this,
        idx = 0,
        ids = [],
        findResult, i;

    findResult = ixConnect.ix().findFirstSords(findInfo, 1000, SordC.mbOnlyGuid);

    ids = [];

    while (true) {
      for (i = 0; i < findResult.ids.length; i++) {
        ids.push(findResult.ids[i] + "");
      }
      if (!findResult.moreResults) {
        break;
      }
      idx += findResult.ids.length;
      findResult = ixConnect.ix().findNextSords(findResult.searchId, idx, 1000, SordC.mbOnlyGuid);
    }
    me.searchId = findResult.searchId + "";

    return ids;
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
  collectSords: function () {
    logger.enter("collectSords");
    var me = this,
        idx, i, length,
        formatter = me.getSordFormatter(),
        jsonData = [],
        jsonSord,
        findInfo,
        findResult;

    if (!me.searchId) {
      // find first
      findInfo = new FindInfo();

      // apply find options
      findInfo.findOptions = new FindOptions();
      findInfo.findOptions.totalCount = me.totalCount;
      //findInfo.findOptions.evalCount = true;

      me.buildFindInfo(findInfo);

      findResult = ixConnect.ix().findFirstSords(findInfo, me.maxFind, me.sordZ);
    } else if (me.idx > -1) {
      idx = me.idx;
      findResult = ixConnect.ix().findNextSords(me.searchId, idx, me.maxFind, me.sordZ);
    }

    if (findResult) {
      me.jsonData.push(",");
      if (findResult.fulltextResultItems && findResult.fulltextResultItems.length > 0) {
        for (i = 0, length = findResult.fulltextResultItems.length; i < length; i++) {
          if (!me.docMasks[findResult.fulltextResultItems[i].sord.maskName]) {
            me.addDocMaskData(findResult.fulltextResultItems[i].sord.maskName);
          }
          jsonSord = [];
          jsonSord.push('{ "summaryDesc": ');
          jsonSord.push(JSON.stringify(findResult.fulltextResultItems[i].summaryDesc + ""));
          jsonSord.push(', "relevance":');
          jsonSord.push(JSON.stringify(findResult.fulltextResultItems[i].summaryDesc + ""));
          jsonSord.push(', "relevance":');
          jsonSord.push(findResult.fulltextResultItems[i].relevance);
          jsonSord.push(', "sord":');
          jsonSord.push(formatter.buildJson(findResult.fulltextResultItems[i].sord, me.docMasks[findResult.fulltextResultItems[i].sord.maskName]));
          jsonSord.push("}");
          jsonData.push(jsonSord.join(""));
        }
        me.jsonData.push('"searchResults":');
        me.jsonData.push("[");
        me.jsonData.push(jsonData.join(","));
        me.jsonData.push("]");
      } else {
        for (i = 0, length = findResult.sords.length; i < length; i++) {
          if (!me.docMasks[findResult.sords[i].maskName]) {
            me.addDocMaskData(findResult.sords[i].maskName);
          }
          jsonData.push(formatter.buildJson(findResult.sords[i], me.docMasks[findResult.sords[i].maskName]));
        }
        me.jsonData.push('"sords":');
        me.jsonData.push("[");
        me.jsonData.push(jsonData.join(","));
        me.jsonData.push("]");
      }

      me.jsonData.push(', "searchId": "');
      me.jsonData.push(findResult.searchId);
      me.jsonData.push('", "moreResults": ');
      me.jsonData.push(findResult.moreResults);
    } else {
      logger.debug("skiped sord collection ... no 'searchResult'");
    }

    logger.exit("collectSords");
  },

  buildFindInfo: function (findInfo) {
    var me = this;
    if (me.searchMode === "DIRECT") {
      me.buildFindDirect(findInfo);
    } else {
      me.buildFindByIndex(findInfo);
    }
  },

  buildFindByIndex: function (findInfo) {
    var me = this,
        filter, objKey, i,
        objKeyFilters = [];

    // apply optional mask filter
    if (me.maskName) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      findInfo.findByIndex.maskId = me.maskName;
    }

    // apply parent Id filter
    if (me.parentId) {
      findInfo.findChildren = new FindChildren();
      findInfo.findChildren.parentId = me.parentId;
      findInfo.findChildren.endLevel = me.endLevel;
    }

    // apply filter
    if (me.filter && me.filter.length > 0) {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      for (i = 0; i < me.filter.length; i++) {
        filter = me.filter[i],
        objKey = new ObjKey();
        objKey.name = filter.key;
        objKey.data = [filter.val];
        logger.info("applied filter:", objKey);
        objKeyFilters.push(objKey);
      }
      findInfo.findByIndex.objKeys = objKeyFilters;
    }
  },

  buildFindDirect: function (findInfo) {
    var me = this,
        FIND_DIRECT = ixConnect.getCONST().FIND_DIRECT,
        query = "",
        i, filter,
        findDirect;

    if (me.parentId) {
      throw "parentIds can't be passed if using iSearch queries.";
    }

    // apply optional mask filter
    if (me.maskName) {
      query += " (" + FIND_DIRECT.FIELD_MASK_NAME + ":\"" + me.maskName + "\") ";
      findInfo.findByIndex.maskId = me.maskName;
    }

    // apply filter
    if (me.filter && me.filter.length > 0) {
      for (i = 0; i < me.filter.length; i++) {
        filter = me.filter[i];
        query += " (" + FIND_DIRECT.FIELD_OBJ_KEY + filter.key + ":\"" + filter.val + "\") ";
      }
    }

    findDirect = new FindDirect();
    if (!!me.query && query) {
      query = "(" + me.query + ") ( " + query + " )";
    } else if (query) {
      query = "(*) ( " + query + " )";
    } else if (!!me.query) {
      query = me.query;
    }
    findDirect.query = query;
    findDirect.searchInMemo = true;
    findDirect.searchInFulltext = true;
    findDirect.searchInIndex = true;
    findDirect.searchInSordName = true;
    findInfo.findDirect = findDirect;
  },

  /**
   * @private
   * @return {Object}
   */
  getSordFormatter: function () {
    var me = this;
    return sol.create(me.formatter, {
      config: {
        allObjKeys: me.allObjKeys || false,
        objKeys: me.objKeys,
        sordKeys: me.sordKeys,
        feedActions: me.feedActions || false,
        feedActionTypes: me.feedActionTypes || ["UserComment"],
        feedActionsMax: me.feedActionsMax || 500
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

    docMask = sol.common.SordUtils.getDocMask(docMaskName, me.ec.ci.language);
    docMaskData = { fields: {} };
    docMask.lines.forEach(function (docMaskLine) {
      if (me.objKeyMap[docMaskLine.key]) {
        docMaskData.fields[docMaskLine.key] = { name: String(docMaskLine.name), type: me.docMaskLineTypes[docMaskLine.type] };
      }
    });
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
 * @member sol.common.ix.services.SordDataCollector
 * @method RF_sol_common_services_SordDataCollector_FindFirst
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_SordDataCollector_FindFirst(ec, configAny) {
  var jsonDataCollector, config, ecLang, ixConnectLang, result;

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
  ecLang = String(ec.ci.language),
  ixConnectLang = String(ixConnect.loginResult.clientInfo.language);

  config.ec = ec;

  log.info("ec.ci.language=" + ecLang);
  log.info("ixConnect.loginResult.clientInfo.language=" + ixConnectLang);

  jsonDataCollector = sol.create("sol.common.ix.services.SordDataCollector", config);
  result = jsonDataCollector.execute();

  return result;
}

/**
 * @member sol.common.ix.services.SordDataCollector
 * @method RF_sol_common_services_SordDataCollector_FindNext
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_SordDataCollector_FindNext(ec, configAny) {
  var jsonDataCollector, config, ecLang, ixConnectLang, result;

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "searchId", "idx"),
  ecLang = String(ec.ci.language),
  ixConnectLang = String(ixConnect.loginResult.clientInfo.language);

  config.ec = ec;

  log.info("ec.ci.language=" + ecLang);
  log.info("ixConnect.loginResult.clientInfo.language=" + ixConnectLang);

  jsonDataCollector = sol.create("sol.common.ix.services.SordDataCollector", config);
  result = jsonDataCollector.execute();

  return result;
}

/**
 * @member sol.common.ix.services.SordDataCollector
 * @method RF_sol_common_services_SordDataCollector_FindClose
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_SordDataCollector_FindClose(ec, configAny) {
  var config;

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "searchId");
  ixConnect.ix().findClose(config.searchId);

  return "{ \"success\": true }";
}
