
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Locale.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.QueryUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.GetAdditionalInfo" });

/**
 * Returns additional info of a post
 *
 * Example:
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_services_GetAdditionalInfo", {
 *       postObjId: "1234",
 *       maxUsers: 10,
 *       maxRelatedPosts: 8,
 *       filterLangs: ["de"],
 *       filter:[{
 *         type: "FIELD_OBJ_KEY",
 *         key: "KNOWLEDGE_BOARD_REFERENCE",
 *         values: ["KBDB001"]
 *       }]
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.Locale
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.GetAdditionalInfo", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["postObjId"],

  /**
   * @cfg {String} postObjId
   * Post object ID
   */

  /**
   * @cfg {Number} [maxUsers=10] (optional)
   * Maximum number of users
   */

  /**
   * @cfg {Number} [maxRelatedPosts=8] (optional)
   * Maximum number of users
   */

  /**
   * @cfg {Array} [objKeys]
   * Object key names
   */

  /**
   * @cfg {Array} [sordKeys]
   * Sord key names
   */

  /**
   * @cfg {Number} [topicsStartBoostFactor=2]
   * Start topics boost factor
   */

  /**
   * @cfg {Number [topicsBoostFactorDecrement=0.1]
   * Topics boost factor decrement
   */

  /**
   * @cfg {Number} [subjectStartBoostFactor=1]
   * Start subject boost factor
   */

  /**
   * @cfg {Number} [subjectBoostFactorDecrement=0.1]
   * Subject boost factor subtrahend
   */

  /**
   * @cfg {Array} filterLangs
   * Filter languages
   */

  /**
   * @cfg {Array} filter
   * Filters
   *
   * Example:
   *   "filter":[{
   *     "type": "FIELD_OBJ_KEY",
   *     "key": "KNOWLEDGE_BOARD_REFERENCE",
   *     "values": ["KBDB001"]
   *   }]   */
  sordOwnerIdFieldName: "sord_ownerid",

  initialize: function (config) {
    var me = this;

    me.maxUsers = me.maxUsers || 10;
    me.maxRelatedPosts = me.maxRelatedPosts || 8;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.knowledgeConfig = sol.knowledge.ix.KnowledgeUtils.loadKnowledgeConfig();
  },

  /**
   * @private
   * @return {String}
   */
  execute: function () {
    var me = this,
      result, linkedPostsResult;

    me.postSord = sol.common.RepoUtils.getSord(me.postObjId);

    me.postReference = sol.common.SordUtils.getObjKeyValue(me.postSord, me.knowledgeConfig.fields.knowledgePostReference);

    if (!me.postReference) {
      throw "Post reference is empty";
    }

    me.sordKeys = me.sordKeys || me.knowledgeConfig.services.getAdditionalInfo.sordKeys;
    me.objKeys = me.objKeys || me.knowledgeConfig.services.getAdditionalInfo.objKeys;

    result = {};
    try {
      result.users = me.getParticipants();
      linkedPostsResult = me.getLinkedPosts();
      result.linkedPosts = linkedPostsResult.posts;
      result.relatedPosts = me.getRelatedPosts(linkedPostsResult.guids);
      result.referenceInPosts = me.getReferenceInPosts();
    } catch (ex) {
      me.logger.warn("Elastic search not available", ex);
      result.users = [];
      result.relatedPosts = [];
      result.linkedPosts = [];
      result.referenceInPosts = [];
    }

    return JSON.stringify(result);
  },

  executeRelatedTopics: function () {
    var me = this,
      result;

    me.sordKeys = me.sordKeys || me.knowledgeConfig.services.getAdditionalInfo.sordKeys;
    me.objKeys = me.objKeys || me.knowledgeConfig.services.getAdditionalInfo.objKeys;

    result = {};
    try {
      result.topics = me.getRelatedTopics();
    } catch (ex) {
      me.logger.warn("Elastic search not available", ex);
      result.topics = [];
    }

    return JSON.stringify(result);
  },

  executeLinkedPosts: function () {
    var me = this,
      result;

    me.postSord = sol.common.RepoUtils.getSord(me.postObjId || me.objId);

    me.sordKeys = me.sordKeys || me.knowledgeConfig.services.getAdditionalInfo.sordKeys;
    me.objKeys = me.objKeys || me.knowledgeConfig.services.getAdditionalInfo.objKeys;

    result = {};
    try {
      result.linkedPosts = me.getLinkedPosts();
    } catch (ex) {
      me.logger.warn("Elastic search not available", ex);
      result.linkedPosts = [];
    }

    return JSON.stringify(result);
  },

  /**
   * Retrieves the participants of a post
   * @private
   * @return {String}
   */
  getParticipants: function () {
    var me = this,
      participants = [],
      ownerIds = [],
      query, findInfo, i,
      contextTerms, contextTerm, num, userInfo, ownerName, ownerId;

    query = "(" + ixConnect.CONST.FIND_DIRECT.FIELD_OBJ_KEY + me.knowledgeConfig.fields.knowledgePostReference + ':"' + me.postReference + '")';

    findInfo = new FindInfo();
    findInfo.findDirect = new FindDirect();
    findInfo.findDirect.query = query;
    findInfo.findDirect.searchInIndex = true;

    contextTerms = ixConnect.ix().getContextTerms(findInfo, me.sordOwnerIdFieldName, me.maxUsers);

    for (i = 0; i < contextTerms.length; i++) {
      contextTerm = contextTerms[i];
      ownerId = contextTerm.term + "";
      ownerIds.push(ownerId);
    }

    sol.common.UserUtils.requireUserInfos(ownerIds);

    for (i = 0; i < contextTerms.length; i++) {
      contextTerm = contextTerms[i];
      num = Number(contextTerm.docNum);
      ownerId = contextTerm.term + "";
      userInfo = sol.common.UserUtils.getUserInfo(ownerId);
      ownerName = userInfo.name + "";
      participants.push({
        name: ownerName,
        id: ownerId,
        num: num
      });
    }

    return participants;
  },

  /**
   * Retrieves related posts
   * @private
   * @param {Object} linkedPosts (optional) Linked posts guid lookup object
   * @return {String}
   */
  getRelatedPosts: function (linkedPosts) {
    var me = this,
      suppressedPostsCount, query, relatedPosts, filteredRelatedPosts;

    linkedPosts = linkedPosts || {};
    linkedPosts[me.postSord.guid] = true;
    suppressedPostsCount = Object.keys(linkedPosts).length;

    query = me.buildQueryConfig(suppressedPostsCount);

    relatedPosts = sol.knowledge.ix.QueryUtils.executeQuery(query);

    filteredRelatedPosts = [];
    if (relatedPosts && (relatedPosts.length > 0)) {
      relatedPosts.forEach(function (relatedPost) {
        if (!linkedPosts[relatedPost.sord.guid]) {
          filteredRelatedPosts.push(relatedPost);
        }
      });
    }

    return filteredRelatedPosts.slice(0, me.maxRelatedPosts);
  },

  getRelatedTopics: function () {
    var me = this,
      suppressedPostsCount, query, contextTopics, resultTopics;

    suppressedPostsCount = 0;

    query = me.buildQueryConfig(suppressedPostsCount);
    query.fieldName = me.fieldNameTopics || "LINE_KNOWLEDGE_TOPICS.tokenized";

    contextTopics = sol.knowledge.ix.QueryUtils.executeContextTerms(query);

    resultTopics = contextTopics.filter(function (topic) {
      return (me.topics.indexOf(topic.toLowerCase()) < 0);
    });

    return resultTopics;
  },

  buildQueryConfig: function (suppressedPostsCount) {
    var me = this,
      topics, subject, language, words, query, i, filter;

    me.maxRelatedPosts = me.maxRelatedPosts || 8;
    me.topicsStartBoostFactor = me.topicsStartBoostFactor || 2;
    me.topicsBoostFactorDecrement = me.topicsBoostFactorDecrement || 0.1;
    me.subjectStartBoostFactor = me.subjectStartBoostFactor || 1;
    me.subjectBoostFactorDecrement = me.subjectBoostFactorDecrement || 0.1;
    me.filter = me.filter || [];

    topics = me.topics || sol.common.SordUtils.getObjKeyValues(me.postSord, me.knowledgeConfig.fields.knowledgeTopics);
    subject = me.subject || sol.common.SordUtils.getObjKeyValue(me.postSord, me.knowledgeConfig.fields.knowledgePostSubject) + "";
    language = me.language || sol.common.SordUtils.getObjKeyValue(me.postSord, me.knowledgeConfig.fields.knowledgeLanguage) || "";
    language = (language || me.ec.ci.language) + "";

    words = sol.knowledge.ix.QueryUtils.filterStopWords(subject, {
      stopWordDefaultListRepoPath: me.knowledgeConfig.services.getAdditionalInfo.stopWordDefaultListRepoPath,
      language: language
    });

    query = {
      filter: [{
        type: "FIELD_OBJ_KEY",
        key: me.knowledgeConfig.fields.objectType,
        values: [me.knowledgeConfig.objectTypes.post]
      }],
      should: [{
        type: "FIELD_OBJ_KEY",
        key: me.knowledgeConfig.fields.knowledgeTopics,
        values: topics,
        startBoostFactor: me.topicsStartBoostFactor,
        boostFactorDecrement: me.topicsBoostFactorDecrement
      }, {
        type: "FIELD_OBJ_KEY_TOKENIZED",
        key: me.knowledgeConfig.fields.knowledgePostSubject,
        values: words,
        startBoostFactor: me.subjectStartBoostFactor,
        boostFactorDecrement: me.subjectBoostFactorDecrement
      }],
      max: me.maxRelatedPosts + suppressedPostsCount,
      sordKeys: me.sordKeys,
      objKeys: me.objKeys
    };

    for (i = 0; i < me.filter.length; i++) {
      filter = me.filter[i];
      query.filter.push(filter);
    }

    if (me.filterLangs) {
      query.filter.push({
        type: "FIELD_OBJ_KEY",
        key: me.knowledgeConfig.fields.knowledgeLanguage,
        valuesType: "OR",
        values: me.filterLangs
      });
    }

    return query;
  },

  /**
   * @private
   * Retrieves linked posts
   * @return {Object}
   */
  getLinkedPosts: function () {
    var me = this,
      linkedPosts = [],
      linkedPostsGuids = {},
      objIds, sords, i, sord, tplSord;


    objIds = sol.common.SordUtils.getLinks(me.postSord);
    sords = sol.common.RepoUtils.getSords(objIds);

    for (i = 0; i < sords.length; i++) {
      sord = sords[i];
      tplSord = sol.common.ObjectFormatter.format({
        sord: {
          formatter: "sol.common.ObjectFormatter.TemplateSord",
          data: sord,
          config: {
            sordKeys: me.sordKeys,
            allObjKeys: false,
            objKeys: me.objKeys
          }
        }
      });
      linkedPosts.push(tplSord);
      linkedPostsGuids[tplSord.sord.guid] = true;
    }

    return {
      posts: linkedPosts,
      guids: linkedPostsGuids
    };
  },

  /**
   * @private
   * Retrieves linked posts
   * @return {Object}
   */
  getReferenceInPosts: function () {
    var me = this,
      referenceInPosts = [],
      sord, tplSord;

    me.postSord.parentIds.forEach(function (parentId) {
      if (parentId != me.postSord.parentId) {
        sord = sol.common.RepoUtils.getSord(parentId);
        if (sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") == "KNOWLEDGE_POST") {
          tplSord = sol.common.ObjectFormatter.format({
            sord: {
              formatter: "sol.common.ObjectFormatter.TemplateSord",
              data: sord,
              config: {
                sordKeys: me.sordKeys,
                allObjKeys: false,
                objKeys: me.objKeys
              }
            }
          });
          referenceInPosts.push(tplSord);
        }
      }
    });
    return referenceInPosts;
  }
});

/**
 * @member sol.knowledge.ix.services.GetAdditionalInfo
 * @method RF_sol_knowledge_services_GetAdditionalInfo
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_services_GetAdditionalInfo(ec, configAny) {
  var config, additionalInfoService, result;

  logger.enter("RF_sol_knowledge_services_GetAdditionalInfo");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  additionalInfoService = sol.create("sol.knowledge.ix.services.GetAdditionalInfo", config);
  result = additionalInfoService.execute();

  logger.exit("RF_sol_knowledge_services_GetAdditionalInfo");

  return result;
}

/**
 * @member sol.knowledge.ix.services.GetAdditionalInfo
 * @method RF_sol_knowledge_services_GetRelatedTopics
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 *
 * Example:
 *
 *     RF_sol_knowledge_services_GetRelatedTopics
 *     {
 *       "subject": "elo"
 *       "topics": ["server"],
 *     }
 */
function RF_sol_knowledge_services_GetRelatedTopics(ec, configAny) {

  var config, relatedTopicsService, result;

  logger.enter("RF_sol_knowledge_services_GetRelatedTopics");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  relatedTopicsService = sol.create("sol.knowledge.ix.services.GetAdditionalInfo", config);
  result = relatedTopicsService.executeRelatedTopics();

  logger.exit("RF_sol_knowledge_services_GetRelatedTopics");

  return result;
}

/**
 * @member sol.knowledge.ix.services.GetAdditionalInfo
 * @method RF_sol_knowledge_services_GetRelatedTopics
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 *
 * Example:
 *
 *     RF_sol_knowledge_services_GetLinkedPosts
 *     {
 *       "objId": "4711"
 *     }
 */
function RF_sol_knowledge_services_GetLinkedPosts(ec, configAny) {

  var config, linkedPosts, result;

  logger.enter("RF_sol_knowledge_services_GetLinkedPosts");

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);
  config.ec = ec;

  linkedPosts = sol.create("sol.knowledge.ix.services.GetAdditionalInfo", config);
  result = linkedPosts.executeLinkedPosts();

  logger.exit("RF_sol_knowledge_services_GetLinkedPosts");

  return result;
}
