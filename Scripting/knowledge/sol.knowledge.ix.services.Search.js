
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserProfile.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.QueryUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Search" });

/**
 * Contains the search functionality for the knowledge app.
 *
 * Currently supports the search for topics, posts und users.
 *
 * # Topics
 * Retrieves all topics as configured.
 *
 * Used configuration properties:
 *
 * - {@link #maskName}
 * - {@link #filter}
 * - {@link #max}
 *
 * Example:
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_FindTopics", {
 *       maskName: "My Mask", // optional
 *       filter: [ {}, ...],  // optional
 *       max: 25              // optional
 *     });
 *
 * Renames all topics as configured.
 *
 * Used configuration properties:
 *
 * - {@link #oldTopics}
 * - {@link #newTopic}
 *
 * Example:
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_RenameTopics", {
 *       oldTopics: ["TopicRename12", "TopicRename22"], // required
 *       newTopic: "TopicRename2"                       // required
 *     });
 *
 * # Posts
 * Retrieves all post as configured.
 *
 * Used configuration properties:
 *
 * - {@link #formatter}
 * - {@link #sordKeys}
 * - {@link #objKeys}
 * - {@link #maskName}
 * - {@link #owner}
 * - {@link #filter}
 * - {@link #idx}
 * - {@link #max}
 * - {@link #orderBy}
 * - {@link #maxUsers}
 *
 * Examples:
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_FindPosts", {
 *       maskName: "My Mask", // optional
 *       owner: 5, // optional
 *       filter: [ {}, ...],  // optional
 *       max: 25              // optional
 *     });
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_FindPosts", {
 *       searchMode: "DIRECT",
 *       maskName: "Knowledge Post",
 *       owner: 5,
 *       filter: [
 *         { key: "KNOWLEDGE_POST_TYPE", val: "ARTICLE" },
 *         { key: "KNOWLEDGE_TOPICS", val: '"Topic1" OR "Topic2"' }],
 *       query: "Bla"
 *     });
 *
 * # Users
 * Retrieves all user as configured.
 *
 * Used configuration properties:
 *
 * - {@link #userName}
 * - {@link #maxUsers}
 *
 * Examples:
 *
 *     find all user
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_FindUsers", {
 *     });
 *
 *     find user starting with J
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_Search_FindUsers", {
 *       userName: "J"
 *     });
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.UserProfile
 * @requires sol.common.UserUtils
 * @requires sol.common.Locale
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 * @requires sol.knowledge.ix.QueryUtils
 */
sol.define("sol.knowledge.ix.services.Search", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["ec"],

  /**
   * @private
   * @property {String} SEARCH_TIMEOUT_ERRORCODE The IX code for a timed out search
   */
  SEARCH_TIMEOUT_ERRORCODE: "[ELOIX:5023]",

  /**
   * @private
   * @property {Object} SEARCH_ESCAPINGS
   */
  SEARCH_ESCAPINGS: {
    "\\[": " ",
    "\\]": " ",
    "\\{": " ",
    "\\}": " ",
    "\\+": " ",
    "-": " ",
    "=": " ",
    "&": " ",
    "\\|": " ",
    "!": " ",
    "\\(": " ",
    "\\)": " ",
    "\\^": " ",
    "\\\"": " ",
    "~": " ",
    "\\?": " ",
    ":": " ",
    "\\\\": " ",
    "/": " ",
    "<": " ",
    ">": " "
  },

  /**
   * @cfg {String} [formatter="sol.common.ObjectFormatter.TemplateSord"] (optional)
   * Sord object formatter implementation.
   *
   * E.g. `sol.common.ObjectFormatter.StatisticSord` or `sol.common.ObjectFormatter.TemplateSord`
   */
  formatter: "sol.common.ObjectFormatter.TemplateSord",

  /**
   * @cfg {String[]} sordKeys (optional)
   * List of required sord keys.
   *
   * This only returns the given sord keys. This is required in order to limit traffic for not required keys.
   *
   *     sordKeys: ["id", "guid", "name", "desc"],
   */
  sordKeys: ["id", "guid", "name", "ownerId", "ownerName", "desc"],

  /**
   * @cfg {Number} descMaxLen
   * Maximum length of the sord description
   */
  descMaxLen: undefined,

  /**
   * @cfg {String[]} objKeys (optional)
   * List of required objKeys.
   *
   * This only returns the given objKeys. This is required in order to limit traffic for not required keys.
   *
   *     objKeys: ["INVOICE_DATE", "INVOICE_AMOUNT"],
   */
  objKeys: [],

  /**
   * @cfg {String} maskName (optional)
   * Restricts search results to a given keywording mask
   */
  maskName: null,

  /**
   * @cfg {String|Number} owner (optional)
   * Restricts search results to elements of a given owner. Can be user name (string) or ID (number).
   */
  owner: null,

  /**
   * @cfg {Object[]} filter (optional)
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
   * @cfg {Number} searchId (optional)
   */

  /**
   * @cfg {Number} [idx=0] (optional)
   */
  idx: 0,

  /**
   * @cfg {Number} [max=25] (optional)
   */
  max: 25,

  /**
   * @cfg {String} orderBy (optional) A SQL ORDER BY clause (see `FindOptions.orderBy`)
   */

  /**
   * @cfg {String} userName (optional)
   * Restricts search results to a given username
   */
  userName: null,

  /**
   * @cfg {Number} [maxUsers=10] (optional)
   */
  maxUsers: 10,

  /**
   * @cfg {Boolean} [includeOnlyPostTopics=false] (optional)
   * If `true` the topic search will return only topics of elements with `SOL_TYPE=KNOWLEDGE_POST`.
   * If neither `includeOnlyPostTopics` nor `includeOnlyAnswerTopics` is defined ALL topics regardless any elements SOL_TYPE will be returned.
   * If both are true both topics of posts and replies will be returned.
   */
  includeOnlyPostTopics: false,

  /**
   * @cfg {Boolean} [includeOnlyAnswerTopics=false] (optional)
   * If `true` the topic search will return only topics of elements with `SOL_TYPE=KNOWLEDGE_REPLY`.
   * If neither `includeOnlyPostTopics` nor `includeOnlyAnswerTopics` is defined ALL topics regardless any elements SOL_TYPE will be returned.
   * If both are true both topics of posts and replies will be returned.
   */
  includeOnlyAnswerTopics: false,

  /**
   * @private
   * @property {String} collectorVersion
   */
  collectorVersion: "1.00.000",

  /**
   * @private
   * @property {Number} totalCount
   * The search is terminated if this number of objects is found. If the number of results should not be constrained,
   * set this value to 232-1 = 2147483647 (maximum value of a positive 32bit integer minus 1).
   *
   * Please note that collecting huge amounts of data might lead to performance issues.
   */
  totalCount: 10000,

  /**
   * @private
   * @property {String}
   * The field to load the topics from.
   *
   * This should be tLINE_ in ElasticSearch 5.1
   */
  topicsField: "LINE.KNOWLEDGE_TOPICS",

  /**
   * @private
   * @property {String}
   */
  queryWildcard: "*",

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

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * Retrieves all posts specified by the object configuration.
   * @private
   * @return {String}
   */
  findPosts: function () {
    var me = this;

    me.objKeyMap = {};
    me.jsonData = [];
    me.docMasks = {};

    me.computeSordElementSelector();
    me.getTypeConstants();

    // add data collector version and formatting information
    me.jsonData.push("{");
    me.jsonData.push('"version":' + JSON.stringify(me.collectorVersion) + ",");
    me.jsonData.push('"formatter":' + JSON.stringify(me.formatter) + ",");

    // add locale information
    me.jsonData.push('"locale":');
    me.addLocale();

    // add child sords
    me.jsonData.push(",");
    me.collectPosts();

    // add user names
    me.collectUsers();

    // add doc masks information
    me.jsonData.push(",");
    me.jsonData.push('"docMasks":');
    me.jsonData.push(JSON.stringify(me.docMasks));

    me.jsonData.push("}");

    return me.jsonData.join("");
  },

  /**
   * Retrieves the topics specified in the object configuration
   * @private
   * @return {String}
   */
  findTopics: function () {
    var me = this,
        findInfo = new FindInfo(),
        terms = [],
        termsResult, i;

    me.buildTopicsFindInfo(findInfo);
    termsResult = ixConnect.ix().getContextTerms(findInfo, me.topicsField, me.max);

    for (i = 0; i < termsResult.length; i += 1) {
      terms.push({
        docNum: Number(termsResult[i].docNum),
        term: String(termsResult[i].term)
      });
    }

    return JSON.stringify({ contextTerms: terms });
  },

  /**
   * Retrieves users specified in the object configuration
   * @private
   * @return {Object[]}
   */
  findUsers: function () {
    var me = this,
        params = {},
        userNames = [],
        users = [],
        i;

    if (me.query) {
      params.name = ("*" + me.query + "*");
    }
    if (me.userName) {
      params.name = (me.userName + "*");
    }
    params.max = me.maxUsers;
    params.visible = true;
    userNames = sol.common.UserUtils.getUserNames(params);
    for (i = 0; i < userNames.length; i += 1) {
      users.push({
        name: String(userNames[i].name),
        id: String(userNames[i].id)
      });
    }

    return users;
  },

  buildTopicsFindInfo: function (findInfo) {
    var me = this,
        filterValue;

    if (me.includeOnlyPostTopics === true && me.includeOnlyAnswerTopics === true) {
      filterValue = "\"KNOWLEDGE_POST\" OR \"KNOWLEDGE_REPLY\"";
    } else if (me.includeOnlyPostTopics === true) {
      filterValue = "KNOWLEDGE_POST";
    } else if (me.includeOnlyAnswerTopics === true) {
      filterValue = "KNOWLEDGE_REPLY";
    }

    if (filterValue) {
      if (!me.filter) {
        me.filter = [];
      }
      me.filter.push({ key: "SOL_TYPE", val: filterValue });
    }

    me.buildPostsFindDirect(findInfo);
  },

  /**
   * @private
   * Computes a SordZ selector for information that is required.
   */
  computeSordElementSelector: function () {
    var me = this,
        sordKey, elementSelector;
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
      me.objKeys.forEach(function (objKeyName) {
        me.objKeyMap[objKeyName] = true;
      });
    }
  },

  /**
   * @private
   */
  collectPosts: function () {
    logger.enter("collectPosts");
    var me = this,
        formatter = me.getSordFormatter(),
        jsonData = [],
        i, length, jsonSord, findResult;

    findResult = me.collectPostFindResult();

    if (findResult.fulltextResultItems && findResult.fulltextResultItems.length > 0) {
      for (i = 0, length = findResult.fulltextResultItems.length; i < length; i++) {
        if (!me.docMasks[findResult.fulltextResultItems[i].sord.maskName]) {
          me.addDocMaskData(findResult.fulltextResultItems[i].sord.maskName);
        }
        jsonSord = [];
        jsonSord.push('{ "relevance": "');
        jsonSord.push(findResult.fulltextResultItems[i].relevance + "");
        jsonSord.push('" , "sord": ');
        jsonSord.push(formatter.buildJson(findResult.fulltextResultItems[i].sord, me.docMasks[findResult.fulltextResultItems[i].sord.maskName], { dataAsString: ["KNOWLEDGE_TOPICS","KNOWLEDGE_PINNED_AT"] }));
        jsonSord.push(" }");
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
        jsonData.push(formatter.buildJson(findResult.sords[i], me.docMasks[findResult.sords[i].maskName], { dataAsString: ["KNOWLEDGE_TOPICS","KNOWLEDGE_PINNED_AT"] }));
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

    me.jsonData.push(', "estimatedCount": ');
    me.jsonData.push(findResult.estimatedCount);

    logger.exit("collectPosts");
  },

  /**
   * @private
   */
  collectUsers: function () {
    var me = this,
        users = [];

    logger.enter("collectUsers");

    if (!me.searchId || (me.searchId === -1)) {
      // find users only first find
      users = me.findUsers();
      if (users.length > 0) {
        me.jsonData.push(",");
        me.jsonData.push('"users":' + JSON.stringify(users));
      }
    }

    logger.exit("collectUsers");
  },

  /**
   * @private
   * @return {de.elo.ix.client.FindResult}
   */
  collectPostFindResult: function () {
    var me = this,
        findInfo, findResult;

    if (!me.searchId || (me.searchId === -1)) {
      // find first
      findInfo = new FindInfo();

      // apply find options
      findInfo.findOptions = new FindOptions();
      findInfo.findOptions.totalCount = me.totalCount;
      //findInfo.findOptions.evalCount = true;

      if (me.orderBy) {
        findInfo.findOptions.orderBy = me.orderBy;
      }

      me.buildPostsFindInfo(findInfo);

      if (!me.idx || (me.idx === 0)) {
        findResult = ixConnect.ix().findFirstSords(findInfo, me.max, me.sordZ); // get first results
      } else {
        findResult = ixConnect.ix().findFirstSords(findInfo, me.idx + me.max, me.sordZ); // init a new search
        findResult = ixConnect.ix().findNextSords(findResult.searchId, me.idx, me.max, me.sordZ); // return a resultset different from the first one
      }
    } else {
      try {
        findResult = ixConnect.ix().findNextSords(me.searchId, me.idx, me.max, me.sordZ);
      } catch (ex) {
        if (String(ex).indexOf(me.SEARCH_TIMEOUT_ERRORCODE) > -1) {
          // in case the search has timed out, reset and start a new one with the same parameters
          me.searchId = -1;
          findResult = me.collectPostFindResult();
        } else {
          // make sure unknown Exceptions do not get lost
          throw ex;
        }
      }
    }

    return findResult;
  },

  buildPostsFindInfo: function (findInfo) {
    var me = this;
    if (me.searchMode === "DIRECT") {
      me.buildPostsFindDirect(findInfo);
    } else {
      me.buildPostsFindByIndex(findInfo);
    }
  },

  buildPostsFindDirect: function (findInfo) {
    var me = this,
        query = "",
        FIND_DIRECT, i, filter, ownerQueryParam, findDirect;

    FIND_DIRECT = ixConnect.getCONST().FIND_DIRECT;

    if (me.parentId) {
      throw "Parent IDs can't be passed if using iSearch queries.";
    }

    findInfo.findByIndex = new FindByIndex();

    // apply optional mask filter
    if (me.maskName) {
      query += " (" + FIND_DIRECT.FIELD_MASK_NAME + ":\"" + me.maskName + "\") ";
      findInfo.findByIndex.maskId = me.maskName;
    }

    // apply optional owner filter
    if (me.owner) {
      ownerQueryParam = (typeof me.owner === "number") ? FIND_DIRECT.FIELD_OWNER_ID : FIND_DIRECT.FIELD_OWNER;
      query += " (" + ownerQueryParam + ":\"" + me.owner + "\") ";
      findInfo.findByIndex.ownerId = me.owner;
    }

    // apply filter
    if (me.filter && me.filter.length > 0) {
      for (i = 0; i < me.filter.length; i++) {
        filter = me.filter[i];
        if ((filter.val && (filter.val.indexOf('"') < 0)) || (filter.val === "")) {
          filter.val = '"' + filter.val + '"';
        }
        query += " (" + FIND_DIRECT.FIELD_OBJ_KEY + filter.key + ": " + filter.val + ") ";
      }
    }

    findDirect = new FindDirect();
    if (!!me.query && query) {
      query = "(" + me.optimizeQuery(me.escapeQuery(me.query)) + ") ( " + query + " )";
    } else if (query) {
      query = "(" + me.queryWildcard + ") ( " + query + " )";
    } else if (!!me.query) {
      query = me.optimizeQuery(me.escapeQuery(me.query));
    } else if (!!me.queryWildcard) {
      query = me.queryWildcard;
    } else {
      return;
    }

    logger.info("build search query.", query);

    findDirect.query = query;
    findDirect.searchInMemo = !!me.query ? true : false;
    findDirect.searchInFulltext = !!me.query ? true : false;
    findDirect.searchInIndex = true;
    findDirect.searchInSordName = !!me.query ? true : false;
    findInfo.findDirect = findDirect;
  },

  buildPostsFindByIndex: function (findInfo) {
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

    // apply optional owner filter
    if (typeof me.owner !== "undefined") {
      if (!findInfo.findByIndex) {
        findInfo.findByIndex = new FindByIndex();
      }
      findInfo.findByIndex.ownerId = me.owner;
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
        feedActionsMax: me.feedActionsMax || 500,
        descMaxLen: me.descMaxLen
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
  },

  /**
   * @private
   * Escapes illegal characters for an elestic search query using {@link #SEARCH_ESCAPINGS}.
   * @param {String} query
   * @return {String}
   */
  escapeQuery: function (query) {
    var me = this,
        regex;
    regex = new RegExp(Object.keys(me.SEARCH_ESCAPINGS).join("|"), "gi");
    return query.replace(regex, function (matched) {
      return me.SEARCH_ESCAPINGS[matched] || "";
    });
  },

  /**
   * Optimizes a given query for better search results.
   *
   * * Filters replies that contain all relevant keywords of a given query.
   *
   * @param {String} query query
   * @return {String} optimized query
   */
  optimizeQuery: function (query) {
    var me = this,
        terms = [],
        words, i;

    if (!query) {
      return query;
    }

    words = sol.knowledge.ix.QueryUtils.filterStopWords(query, {
      stopWordDefaultListRepoPath: me.knowledgeConfig.services.getAdditionalInfo.stopWordDefaultListRepoPath,
      language: me.ec.ci.language
    });

    me.logger.info("optimizing search query", {
      query: query,
      relevantTerms: words
    });

    if (words && words.length > 0) {
      query += " NOT (";
      for (i = 0; i <= words.length; i++) {
        if (words[i]) {
          terms.push("("
             + sol.knowledge.ix.QueryUtils.buildTerm("FIELD_OBJ_KEY_TOKENIZED", "KNOWLEDGE_POST_SUBJECT", words[i])
             + " OR "
             + sol.knowledge.ix.QueryUtils.buildTerm("FIELD_OBJ_KEY_TOKENIZED", "KNOWLEDGE_TOPICS", words[i])
             + ")");
        }
      }
      terms.push(sol.knowledge.ix.QueryUtils.buildTerm("FIELD_OBJ_KEY", "SOL_TYPE", "KNOWLEDGE_REPLY"));
      query += terms.join(" AND ");
      query += " )";
    }

    me.logger.info("optimized search query", {
      query: query
    });

    return query;
  },

  /**
   * Replaces the old topic items with new topic item
   * @private
   * @param {String[]} currentTopics current topics
   * @param {String[]} oldTopics old topic items to be replaced
   * @param {String} newTopic new topic item which replaces old topic items
   * @return {String[]} new replaced current topics
   */
  replaceTopicItems: function (currentTopics, oldTopics, newTopic) {
    var replacedTopics = [],
        i, topicItem;

    for (i = 0; i < currentTopics.length; i++) {
      topicItem = currentTopics[i];
      if (oldTopics.indexOf(topicItem) > -1) {
        if (replacedTopics.indexOf(newTopic) < 0) {
          replacedTopics.push(newTopic);
        }
      } else {
        replacedTopics.push(topicItem);
      }
    }
    return replacedTopics;
  },

  /**
   * Processes current topics
   * @private
   * @param {String} objId objId of post
   * @param {String[]} oldTopics old topic items to be replaced
   * @param {String} newTopic new topic item which replaces old topic items
   */
  processCurrentTopics: function (objId, oldTopics, newTopic) {
    var me = this,
        sord, currentTopics, newCurrentValues, i;

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    currentTopics = sol.common.SordUtils.getObjKeyValues(sord, "KNOWLEDGE_TOPICS");
    newCurrentValues = [];
    for (i = 0; i < currentTopics.length; i++) {
      newCurrentValues.push(String(currentTopics[i]));
    }
    currentTopics = newCurrentValues;
    currentTopics = me.replaceTopicItems(currentTopics, oldTopics, newTopic);
    sol.common.SordUtils.setObjKeyValues(sord, "KNOWLEDGE_TOPICS", currentTopics);
    ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
  },

  /**
   * Processes posts
   * @private
   * @param {de.elo.ix.client.Sord[]} sords posts
   * @param {String[]} oldTopics old topic items to be replaced
   * @param {String} newTopic new topic item which replaces old topic items
   */
  processPosts: function (sords, oldTopics, newTopic) {
    var me = this,
        sord, i;

    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      me.processCurrentTopics(sord.id, oldTopics, newTopic);
    }
  },

  /**
   * Replaces the old topics new topic
   * @private
   * @param {String[]} oldTopics old topic items to be replaced
   * @param {String} newTopic new topic item which replaces old topic items
   */
  processOldTopics: function (oldTopics, newTopic) {
    var me = this,
        result, sords, oldTopic, i;

    for (i = 0; i < oldTopics.length; i++) {
      oldTopic = oldTopics[i];
      me.filter = [{ key: "KNOWLEDGE_TOPICS", val: oldTopic }];
      result = me.findPosts();
      if (result) {
        result = JSON.parse(result);
        if (result.sords) {
          sords = result.sords;
          if (sol.common.ObjectUtils.isArray(sords)) {
            me.processPosts(sords, oldTopics, newTopic);
          }
        }
        if (result.searchId) {
          ixConnect.ix().findClose(result.searchId);
        }
      }
    }
  },

  /**
   * Renames the topics specified in the object configuration
   * @private
   * @return {String}
   */
  renameTopics: function () {
    var me = this,
        oldTopics, newTopic;

    if (!me.oldTopics) {
      throw "oldTopics is not defined";
    }
    if (!me.newTopic) {
      throw "newTopic is not defined";
    }

    if (sol.common.ObjectUtils.isString(me.oldTopics)) {
      oldTopics = [me.oldTopics];
    } else if (sol.common.ObjectUtils.isArray(me.oldTopics)) {
      oldTopics = me.oldTopics;
    } else {
      throw "oldTopics has incorrect datatype";
    }

    if (sol.common.ObjectUtils.isString(me.newTopic)) {
      newTopic = me.newTopic;
    } else {
      throw "newTopic has incorrect datatype";
    }
    me.processOldTopics(oldTopics, newTopic);
    return JSON.stringify({ success: true });
  }
});


/**
 * @member sol.knowledge.ix.services.Search
 * @method RF_sol_knowledge_services_Search_FindPosts
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_Search_FindPosts(ec, configAny) {
  var config, searchService, result;

  logger.enter("RF_sol_knowledge_services_Search_FindPosts");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  searchService = sol.create("sol.knowledge.ix.services.Search", config);
  result = searchService.findPosts();

  logger.exit("RF_sol_knowledge_services_Search_FindPosts");

  return result;
}

/**
 * @member sol.knowledge.ix.services.Search
 * @method RF_sol_knowledge_services_Search_FindTopics
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_Search_FindTopics(ec, configAny) {
  var config, searchService, result;

  logger.enter("RF_sol_knowledge_services_Search_FindTopics");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  searchService = sol.create("sol.knowledge.ix.services.Search", config);
  result = searchService.findTopics();

  logger.exit("RF_sol_knowledge_services_Search_FindTopics");

  return result;
}

/**
 * @member sol.knowledge.ix.services.Search
 * @method RF_sol_knowledge_services_Search_FindUsers
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_Search_FindUsers(ec, configAny) {
  var config, searchService, result, users;

  logger.enter("RF_sol_knowledge_services_Search_FindUsers");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  searchService = sol.create("sol.knowledge.ix.services.Search", config);
  users = searchService.findUsers();
  result = JSON.stringify({ Users: users });
  logger.exit("RF_sol_knowledge_services_Search_FindUsers");

  return result;
}

/**
 * @member sol.knowledge.ix.services.Search
 * @method RF_sol_knowledge_services_Search_Close
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_Search_Close(ec, configAny) {
  var config;

  if (!configAny) {
    throw "Args are empty";
  }

  logger.enter("RF_sol_knowledge_services_Search_Close");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "searchId");

  ixConnect.ix().findClose(config.searchId);

  logger.exit("RF_sol_knowledge_services_Search_Close");

  return "{ \"success\": true }";
}

/**
 * @member sol.knowledge.ix.services.Search
 * @method RF_sol_knowledge_services_Search_RenameTopics
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_Search_RenameTopics(ec, configAny) {
  var config, searchService, result;

  logger.enter("RF_sol_knowledge_services_Search_RenameTopics");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny, "oldTopics", "newTopic");
  config.ec = ec;

  searchService = sol.create("sol.knowledge.ix.services.Search", config);
  result = searchService.renameTopics();

  logger.exit("RF_sol_knowledge_services_Search_RenameTopics");

  return result;
}
