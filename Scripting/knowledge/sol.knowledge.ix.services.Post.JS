
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.SubscriptionUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js
//@include lib_sol.knowledge.ix.ReputationUtils.js


var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.Post" });

/**
 * Provides service functions for Posts.
 *
 * # Read a post data
 *
 * posts can either be of type QUESTION, ARTICLE or IDEA.
 *
 *     sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Get", {
 *       // pass objId oder GUID
 *       objId: "4711"
 *     });
 *
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.03.000
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.AclUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.Post", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @private
   * @property {de.elo.ix.client.SordZ}
   */
  sordZ: SordC.mbAllIndex,

  pilcrow: "\u00b6",

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/knowledge/Configuration/knowledge.config" }).config;
  },

  /**
   * Retrieves a post.
   * @return {Object}
   */
  getPost: function () {
    var me = this,
      post, views, sord, space, result, solution;

    post = sol.common.RepoUtils.getSord(me.objId);

    if (!post || !"KNOWLEDGE_POST".equals(sol.common.SordUtils.getObjKeyValue(post, "SOL_TYPE"))) {
      throw "Reading post failed. Passed object with name '" + post.name + "' is not of type post.";
    }

    if (post.deleted === true) {
      throw "Reading post failed. Object with id '" + me.objId + "' has been deleted.";
    }

    space = sol.knowledge.ix.KnowledgeUtils.findSpace(post.id);

    try {
      if (me.isReload !== true) {
        sord = ixConnectAdmin.ix().checkoutSord(me.objId, me.sordZ, LockC.NO);
        views = sol.common.SordUtils.getObjKeyValueAsNumber(sord, "KNOWLEDGE_COUNT_VIEWS");
        views++;
        sol.common.SordUtils.setObjKeyValueAsNumber(sord, "KNOWLEDGE_COUNT_VIEWS", views);
        ixConnectAdmin.ix().checkinSord(sord, me.sordZ, LockC.NO);
      }
    } catch (e) {
    }

    result = {
      sord: me.formatSord(post),
      access: {
        space: sol.knowledge.ix.KnowledgeUtils.getAccessRights(space),
        post: sol.knowledge.ix.KnowledgeUtils.getAccessRights(post)
      }
    };

    if (result.sord.objKeys.KNOWLEDGE_POST_AUTHORS_IDS.length > 0) {
      result.sord.objKeys.KNOWLEDGE_POST_AUTHORS_IDS = (result.sord.objKeys.KNOWLEDGE_POST_AUTHORS_IDS || "").split(me.pilcrow);
    } else {
      result.sord.objKeys.KNOWLEDGE_POST_AUTHORS_IDS = [];
    }

    if (result.sord.objKeys.KNOWLEDGE_POST_AUTHORS.length > 0) {
      result.sord.objKeys.KNOWLEDGE_POST_AUTHORS = (result.sord.objKeys.KNOWLEDGE_POST_AUTHORS || "").split(me.pilcrow);
    } else {
      result.sord.objKeys.KNOWLEDGE_POST_AUTHORS = [];
    }
    
    if (result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS.length > 0) {
      result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS = (result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS || "").split(me.pilcrow);
    } else {
      result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS = [];
    }

    if (result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS.length > 0) {
      result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS = (result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS || "").split(me.pilcrow);
    } else {
      result.sord.objKeys.KNOWLEDGE_POST_CONTACTPERSONS = [];
    }

    if (me.hasSolution(post)) {
      solution = me.getSolution(post);
      if (solution) {
        result.solution = me.formatSord(solution);
      }
    }

    result.subscription = {
      subscribed: sol.common.ix.SubscriptionUtils.hasSubscription(post.guid)
    };

    return result;
  },

  /**
   * @private
   * Formats a sord aobject for the answer.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object}
   */
  formatSord: function (sord) {
    return sol.common.ObjectFormatter.format({
      sord: {
        formatter: "sol.common.ObjectFormatter.TemplateSord",
        data: sord,
        config: {
          sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName", "ownerId"],
          feedActions: true,
          feedActionTypes: ["UserComment"]
        }
      }
    }).sord;
  },

  /**
   * @private
   * Chacks, if a post has a solution.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  hasSolution: function (sord) {
    var solvedValue;
    solvedValue = sol.common.SordUtils.getObjKeyValue(sord, "KNOWLEDGE_SOLVED");
    return (solvedValue == "1");
  },

  /**
   * @private
   * Retrieves the solution of a post, if there is any.
   * @param {de.elo.ix.client.Sord} sord
   * @return {de.elo.ix.client.Sord}
   */
  getSolution: function (sord) {
    var solution = null,
      solutions;

    solutions = sol.common.RepoUtils.findChildren(sord.id, {
      includeFolders: true,
      includeDocuments: false,
      sordZ: SordC.mbAllIndex,
      objKeysObj: { KNOWLEDGE_SOLVED: "1" }
    });

    if (solutions && (solutions.length > 0)) {
      solution = solutions[0];
    }

    return solution;
  },

  /**
   * @private
   * @param {String} sordName
   * @param {Boolean} statusClosed
   * @return {String}
   */
  buildElementName: function (sordName, statusClosed) {
    var me = this,
      wfName;

    if (statusClosed) {
      wfName = sol.create("sol.common.Template", { source: me.config.workflows.postClosed.workflowNameTemplate }).apply({ sordName: sordName });
    } else {
      wfName = sol.create("sol.common.Template", { source: me.config.workflows.postOpen.workflowNameTemplate }).apply({ sordName: sordName });
    }

    if (wfName.length > 120) {
      wfName = wfName.substr(0, 120);
    }
    return wfName;
  },

  /**
   * @private
   * @param {Boolean} statusClosed
   * @return {String}
   */
  getWfTemplate: function (statusClosed) {
    var me = this,
      wfTemplate;

    if (statusClosed) {
      wfTemplate = me.config.workflows.postClosed.workflowTemplateName;
    } else {
      wfTemplate = me.config.workflows.postOpen.workflowTemplateName;
    }
    return wfTemplate;
  },

  /**
   * Starts a workflow and returns the new workflow Id.
   * Uses {@link sol.common.WfUtils#startWorkflow WfUtils.startWorkflow}.
   *
   * @param {String} objId
   * @param {String} templateId
   * @param {String} name The workflow name
   * @return {String} The workflow ID
   */
  startWorkflow: function (objId, templateId, name) {
    return sol.common.WfUtils.startWorkflow(templateId, name, objId);
  },

  /**
   * Set status open post.
   * @return {Object} Result check
   */
  openPost: function () {
    var me = this,
      postSord, spaceSord, name, wfTemplate, flowIdPost,
      hasWriteRightsSpace, hasWriteRightsPost;

    postSord = sol.common.RepoUtils.getSord(me.objId);
    spaceSord = sol.knowledge.ix.KnowledgeUtils.findSpace(postSord.id);
    // Check, if currrent user has w right, set status open in space
    if (spaceSord) {
      hasWriteRightsSpace = sol.common.AclUtils.hasEffectiveRights(spaceSord, { rights: { w: true } });
      hasWriteRightsPost = sol.common.AclUtils.hasEffectiveRights(postSord, { rights: { w: true } });
      if (hasWriteRightsSpace && hasWriteRightsPost) {
        name = me.buildElementName(postSord.name);
        wfTemplate = me.getWfTemplate();
        flowIdPost = me.startWorkflow(postSord.id, wfTemplate, name);
        return { success: true, flowIdPost: flowIdPost };
      }
    }
    return { success: false };
  },

  /**
   * Set status closed post.
   * @return {Object} Result check
   */
  closedPost: function () {
    var me = this,
      postSord, spaceSord, name, wfTemplate, flowIdPost,
      hasWriteRightsSpace, hasWriteRightsPost;

    postSord = sol.common.RepoUtils.getSord(me.objId);
    spaceSord = sol.knowledge.ix.KnowledgeUtils.findSpace(postSord.id);

    // Check, if currrent user has w right, set status closed in space
    if (spaceSord) {
      hasWriteRightsSpace = sol.common.AclUtils.hasEffectiveRights(spaceSord, { rights: { w: true } });
      hasWriteRightsPost = sol.common.AclUtils.hasEffectiveRights(postSord, { rights: { w: true } });
      if (hasWriteRightsSpace && hasWriteRightsPost) {
        name = me.buildElementName(postSord.name, true);
        wfTemplate = me.getWfTemplate(true);
        flowIdPost = me.startWorkflow(postSord.id, wfTemplate, name);
        return { success: true, flowIdPost: flowIdPost };
      }
    }
    return { success: false };
  },

  /**
   * Set label string in post.
   * @return {Object} Result check
   */
  setLabelPost: function () {
    var me = this,
      postSord, spaceSord, sord,
      hasWriteRightsSpace, hasWriteRightsPost;

    postSord = sol.common.RepoUtils.getSord(me.objId);
    spaceSord = sol.knowledge.ix.KnowledgeUtils.findSpace(postSord.id);

    // Check, if currrent user has w right, set status closed in space
    if (spaceSord) {
      hasWriteRightsSpace = sol.common.AclUtils.hasEffectiveRights(spaceSord, { rights: { w: true } });
      hasWriteRightsPost = sol.common.AclUtils.hasEffectiveRights(postSord, { rights: { w: true } });
      if (hasWriteRightsSpace || hasWriteRightsPost) {
        if (me.label) {
          try {
            sord = ixConnectAdmin.ix().checkoutSord(me.objId, me.sordZ, LockC.NO);
            sol.common.SordUtils.setObjKeyValue(sord, "KNOWLEDGE_LABEL", me.label);
            ixConnectAdmin.ix().checkinSord(sord, me.sordZ, LockC.NO);
            sol.knowledge.ix.ReputationUtils.grant("RECEIVE_POST_LABEL_" + me.label, postSord.ownerId);
            return { success: true, label: me.label };
          } catch (e) {

          }
        }
      }
    }
    return { success: false };
  },

  /**
   * Set Authors in post.
   * @return {Object} Result check
   */
  setAuthors: function () {
    var me = this,
      postSord = sol.common.RepoUtils.getSord(me.objId);
    if (Array.isArray(me.authors)) {
      if (sol.common.AclUtils.hasEffectiveRights(postSord, { rights: { w: true } })) {
        return me.setPersons(postSord, me.authors, "KNOWLEDGE_POST_AUTHORS", "KNOWLEDGE_POST_AUTHORS_IDS");
      } else {
        return { success: false, message: "User has not the rights to set authors" }
      }
    } else {
      return { success: false, message: "authors not provided" }
    }
  },

  /**
   * Set Authors in post.
   * @return {Object} Result check
   */
  setContactpersons: function () {
    var me = this,
      postSord = sol.common.RepoUtils.getSord(me.objId);
    if (Array.isArray(me.contactpersons)) {
      if (sol.common.AclUtils.hasEffectiveRights(postSord, { rights: { w: true } })) {
        return me.setPersons(postSord, me.contactpersons, "KNOWLEDGE_POST_CONTACTPERSONS", "KNOWLEDGE_POST_CONTACTPERSONS_IDS");
      } else {
        return { success: false, message: "User has not the rights to set contactpersons" }
      }
    } else {
      return { success: false, message: "contactpersons not provided" }
    }
  },

  setPersons: function (sord, list, nameField, idField) {
    var me = this,
        names, 
        ids;

    try {
      if(list.length > 0) {
        names = list.map(function (person) { return person.name }).reduce(function (names, name) { return names + me.pilcrow + name });
        sol.common.SordUtils.setObjKeyValue(sord, nameField, names);
  
        ids = list.map(function (person) { return person.id }).reduce(function (ids, id) { return ids + me.pilcrow + id });
        sol.common.SordUtils.setObjKeyValue(sord, idField, ids);
      } else {
        // delete field
        sol.common.SordUtils.setObjKeyValue(sord, nameField, "");
        sol.common.SordUtils.setObjKeyValue(sord, idField, "");
      }

      ixConnectAdmin.ix().checkinSord(sord, me.sordZ, LockC.NO);

      return { success: true, users: list, ids: ids, names: names };
    } catch (e) {
      return { success: false, error: e };
    }
  }

});

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Get
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Get(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Get", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.getPost());

  logger.exit("RF_sol_knowledge_service_Post_Get", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Open
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Open(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Open", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.openPost());

  logger.exit("RF_sol_knowledge_service_Post_Open", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Closed
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_Closed(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_Closed", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.closedPost());

  logger.exit("RF_sol_knowledge_service_Post_Closed", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_SetLabel
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_SetLabel(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_SetLabel", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "label");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.setLabelPost());

  logger.exit("RF_sol_knowledge_service_Post_SetLabel", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_SetAuthors
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_SetAuthors(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_SetAuthors", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "authors");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.setAuthors());

  logger.exit("RF_sol_knowledge_service_Post_SetAuthors", result);

  return result;
}

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_SetContactpersons
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_Post_SetContactpersons(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_Post_SetContactpersons", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "contactpersons");
  service = sol.create("sol.knowledge.ix.services.Post", params);
  result = rfUtils.stringify(service.setContactpersons());

  logger.exit("RF_sol_knowledge_service_Post_SetContactpersons", result);

  return result;
}
