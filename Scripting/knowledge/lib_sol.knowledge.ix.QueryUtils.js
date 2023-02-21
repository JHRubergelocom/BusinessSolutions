
//@include lib_Class.js

/**
 * Query utilities
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 */
sol.define("sol.knowledge.ix.QueryUtils", {

  singleton: true,

  /**
   * Filter stop words
   * @param {String} str String
   * @param {Object} params Parameters
   * @params {String} params.stopWordDefaultListRepoPath Stop word default list repository path
   * @param {String} params.language Language
   * @return {Array} Filtered words
   */
  filterStopWords: function (str, params) {
    var me = this,
        stopWordListRepoPath, stopWordListConfig, filteredWords, listExists;

    str = str || "";
    params = params || {};

    if (!params.stopWordDefaultListRepoPath) {
      throw "Stop word default list repository path is empty";
    }

    if (params.language) {
      stopWordListRepoPath = params.stopWordDefaultListRepoPath + "_" + params.language;
      listExists = sol.common.RepoUtils.exists(stopWordListRepoPath);
      if (!listExists) {
        params.language = "";
      }
    }

    if (!params.language) {
      params.language = "default";
      stopWordListRepoPath = params.stopWordDefaultListRepoPath;
    }

    me.stopWords = me.stopWords || {};

    if (!me.stopWords[params.language]) {
      stopWordListConfig = sol.create("sol.common.Config", { compose: stopWordListRepoPath }).config;
      if (!stopWordListConfig) {
        throw "Can't load stop word list: " + stopWordListRepoPath;
      }
      me.stopWords[params.language] = stopWordListConfig.stopWords;
    }

    filteredWords = str.split(" ").filter(function (part) {
      var inStopWordList = (me.stopWords[params.language].indexOf(part) > -1);
      return !inStopWordList;
    });

    return filteredWords;
  },


  /**
   * Build query
   * @param {Object} config Configuration
   * @return {String} Query string
   *
   * # Example
   *     {
   *       "filter": [{
   *         "type": "FIELD_OBJ_KEY",
   *         "key": "SOL_TYPE",
   *         "values": ["KNOWLEDGE_POST"]
   *       }],
   *       "should": [{
   *         "type: "FIELD_OBJ_KEY",
   *         "key": "KNOWLEDGE_TOPICS",
   *         "values": ["TopicA", "TopicB", "TopicC"],
   *         "startBoostFactor": 2,
   *         "boostFactorDecrement": 0.1
   *       }, {
   *         "type: "FIELD_OBJ_KEY_TOKENIZED",
   *         "key": "KNOWLEDGE_SUBJECT",
   *         "values": ["Problem", "iSearch"],
   *         "startBoostFactor": 1,
   *         "boostFactorDecrement": 0.1
   *       }],
   *       "max": 5,
   *       "sordKeys":
   *       "objKeys":
   *     }
   */
  executeQuery: function (config) {
    var me = this,
        tplSords = [],
        query, findInfo, findResult, i, sord, tplSord;

    if (!config) {
      throw "Configuration is empty";
    }

    query = me.buildQuery(config);

    findInfo = new FindInfo();
    findInfo.findDirect = new FindDirect();
    findInfo.findDirect.query = query;
    findInfo.findDirect.searchInIndex = true;

    config.max = config.max || 100;

    findResult = ixConnect.ix().findFirstSords(findInfo, config.max, SordC.mbAllIndex);

    for (i = 0; i < findResult.sords.length; i++) {
      sord = findResult.sords[i];
      tplSord = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: sord,
          config: {
            sordKeys: config.sordKeys,
            allObjKeys: false,
            objKeys: config.objKeys
          }
        }
      });
      tplSords.push(tplSord);
    }

    ixConnect.ix().findClose(findResult.searchId);

    return tplSords;
  },

  /**
   * Build query
   * @param {Object} config Configuration
   * @return {String} Query string
   *
   * # Example
   *     {
   *       "filter": [{
   *         "type": "FIELD_OBJ_KEY",
   *         "key": "SOL_TYPE",
   *         "values": ["KNOWLEDGE_POST"]
   *       }],
   *       "should": [{
   *         "type: "FIELD_OBJ_KEY",
   *         "key": "KNOWLEDGE_TOPICS",
   *         "values": ["TopicA", "TopicB", "TopicC"],
   *         "startBoostFactor": 2,
   *         "boostFactorDecrement": 0.1
   *       }, {
   *         "type: "FIELD_OBJ_KEY_TOKENIZED",
   *         "key": "KNOWLEDGE_SUBJECT",
   *         "values": ["Problem", "iSearch"],
   *         "startBoostFactor": 1,
   *         "boostFactorDecrement": 0.1
   *       }],
   *       "max": 5,
   *       "sordKeys": [],
   *       "objKeys": [],
   *       "fielName": "LINE_KNOWLEDGE_TOPICS"
   *     }
   */
  executeContextTerms: function (config) {
    var me = this,
        terms = [],
        query, findInfo, contextTerms, i, contextTerm;

    if (!config) {
      throw "Configuration is empty";
    }

    query = me.buildQuery(config);

    findInfo = new FindInfo();
    findInfo.findDirect = new FindDirect();
    findInfo.findDirect.query = query;
    findInfo.findDirect.searchInIndex = true;

    config.max = config.max || 100;

    if (!config.fieldName) {
      throw "Field name is empty";
    }

    contextTerms = ixConnect.ix().getContextTerms(findInfo, config.fieldName, config.max);

    for (i = 0; i < contextTerms.length; i++) {
      contextTerm = contextTerms[i];
      terms.push(contextTerm.term + "");
    }

    return terms;
  },

  /**
   * Build a query string
   * @param {Object} config Configuration
   * @return {String} Query
   */
  buildQuery: function (config) {
    var me = this,
        queryParts = [],
        query;

    config.filter = config.filter || [];

    me.addTerms(config.filter, "AND", queryParts);
    me.addTerms(config.should, "OR", queryParts);

    query = queryParts.join(" AND ");

    return query;
  },

  /**
   * Build terms
   * @param {Object} fields fields
   * @param {String} operant Operant
   * @param {Array} queryParts Query parts
   */
  addTerms: function (fields, operant, queryParts) {
    var me = this,
        terms = [],
        field, termsString, i, j, boostFactor, value, term;

    if (!queryParts) {
      throw "Query part array is empty";
    }

    fields = fields || [];
    operant = operant || "OR";

    for (i = 0; i < fields.length; i++) {
      field = fields[i];
      if (field.valuesType == "OR") {
        term = me.buildOrValues(field.type, field.key, field.values);
        terms.push(term);
      } else {
        boostFactor = field.startBoostFactor;
        field.values = field.values || [];
        for (j = 0; j < field.values.length; j++) {
          value = field.values[j];
          term = me.buildTerm(field.type, field.key, value, boostFactor);
          terms.push(term);
          boostFactor = Math.round((boostFactor - field.boostFactorDecrement) * 10) / 10;
        }
      }
    }

    if (terms.length > 1) {
      termsString = "(" + terms.join(" " + operant + " ") + ")";
    } else {
      termsString = terms.join("");
    }

    queryParts.push(termsString);
  },

  /**
   * Builds a query term
   * @param {String} type Field Typ, e.g. `FIELD_OBJ_KEY`or `FIELD_OBJ_KEY_TOKENIZED`
   * @param {String} key Key
   * @param {String} value Value
   * @param {String} boostFactor Boost factor
   * @return {String} Term
   */
  buildTerm: function (type, key, value, boostFactor) {
    var fieldNamePrefix, boostFactorPart, term;

    if (!type) {
      throw "Field type is empty";
    }

    if (!key) {
      throw "Key is empty";
    }

    value = value || "";

    fieldNamePrefix = ixConnect.CONST.FIND_DIRECT[type];
    if (!fieldNamePrefix) {
      throw "Unkown field name prefix";
    }

    boostFactorPart = (boostFactor) ? "^" + boostFactor : "";
    term = "(" + fieldNamePrefix + key + ': "' + value + '"' + boostFactorPart + ")";

    return term;
  },

  /**
   * Builds an ´OR´ term
   * @param {String} type Field Typ, e.g. `FIELD_OBJ_KEY`or `FIELD_OBJ_KEY_TOKENIZED`
   * @param {String} key Key
   * @param {String} values Values
   * @return {String} Term
   */
  buildOrValues: function (type, key, values) {
    var fieldNamePrefix, valuesPart, term;

    if (!type) {
      throw "Field type is empty";
    }

    if (!key) {
      throw "Key is empty";
    }

    if (!values) {
      return "";
    }

    fieldNamePrefix = ixConnect.CONST.FIND_DIRECT[type];
    if (!fieldNamePrefix) {
      throw "Unkown field name prefix";
    }

    valuesPart = "(\"" + values.join("\" OR \"") + "\")";

    term = "(" + fieldNamePrefix + key + ": " + valuesPart + ")";

    return term;
  }
});

