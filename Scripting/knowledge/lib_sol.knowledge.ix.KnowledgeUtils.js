
//@include lib_Class.js

/**
 * Knowledge utilities
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 */
sol.define("sol.knowledge.ix.KnowledgeUtils", {
  singleton: true,

  /**
   * Loads (and merges) the reputation configuration from the JSON file: `/Administration/Business Solutions/knowledge/Configuration/knowledge.config`
   * @return {Object}
   */
  loadKnowledgeConfig: function () {
    return sol.create("sol.common.Config", { compose: "/knowledge/Configuration/knowledge.config" }).config;
  },

  /**
   * Returns the board of the space
   * @param {String} objId Object ID
   * @return {de.elo.ix.client.Sord} Board
   *
   */
  findBoard: function (objId) {
    var me = this,
        board, space, knowledgeConfig;

    if (!objId) {
      throw "Object ID is empty";
    }

    knowledgeConfig = me.loadKnowledgeConfig();
    space = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    space = sol.common.RepoUtils.findObjectTypeInHierarchy(space.id, [knowledgeConfig.objectTypes.space], { sordZ: SordC.mbAllIndex });
    board = sol.common.RepoUtils.getSord(space.parentId, { sordZ: SordC.mbAllIndex });

    return board;
  },

  /**
   * Returns the space of the post
   * @param {String} objId Object ID
   * @return {de.elo.ix.client.Sord} Space
   *
   */
  findSpace: function (objId) {
    var me = this,
        post, space, knowledgeConfig;

    if (!objId) {
      throw "Object ID is empty";
    }

    knowledgeConfig = me.loadKnowledgeConfig();
    post = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    space = sol.common.RepoUtils.findObjectTypeInHierarchy(post.id, [knowledgeConfig.objectTypes.space], { sordZ: SordC.mbAllIndex });

    return space;
  },

  /**
   * Returns the post of the reply
   * @param {String} objId Object ID
   * @return {de.elo.ix.client.Sord} Post
   *
   */
  findPost: function (objId) {
    var me = this,
        reply, post, knowledgeConfig;

    if (!objId) {
      throw "Object ID is empty";
    }

    knowledgeConfig = me.loadKnowledgeConfig();
    reply = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    post = sol.common.RepoUtils.findObjectTypeInHierarchy(reply.id, [knowledgeConfig.objectTypes.post], { sordZ: SordC.mbAllIndex });

    return post;
  },

  /**
   * Updates XDateIso in post and reply.
   * @param {String} objId Object ID
   * @param {Object} knowledgeConfig
   */
  updateXdate: function (objId, knowledgeConfig) {
    var sord, objectTypeValue, post, reply;

    if (!objId) {
      throw "Object ID is empty";
    }

    if (!knowledgeConfig) {
      throw "knowledgeConfig is empty";
    }

    sord = sol.common.RepoUtils.getSord(objId);
    objectTypeValue = sol.common.SordUtils.getObjKeyValue(sord, knowledgeConfig.fields.objectType);
    if (objectTypeValue) {
      if (objectTypeValue == knowledgeConfig.services.createReply.objectType) {
        reply = ixConnectAdmin.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
        reply.XDateIso = sol.common.SordUtils.nowIsoForConnection();
        ixConnectAdmin.ix().checkinSord(reply, SordC.mbAllIndex, LockC.NO);
        post = ixConnectAdmin.ix().checkoutSord(sord.parentId, SordC.mbAllIndex, LockC.NO);
        post.XDateIso = sol.common.SordUtils.nowIsoForConnection(ixConnectAdmin);
        ixConnectAdmin.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);
      }
      if (objectTypeValue == knowledgeConfig.services.createPost.objectType) {
        post = ixConnectAdmin.ix().checkoutSord(sord.id, SordC.mbAllIndex, LockC.NO);
        post.XDateIso = sol.common.SordUtils.nowIsoForConnection();
        ixConnectAdmin.ix().checkinSord(post, SordC.mbAllIndex, LockC.NO);
      }
    }
  },

  /**
   * Get Content Type Permissions.
   * @param {String} contentType Content Type ("QUESTION", "ARTICLE", "IDEA")
   * @return {Object} permissions for Content Type
   */
  getContentTypePermissions: function (contentType) {
    var configContentTypes;

    configContentTypes = {
      QUESTION: {
        permissions: {
          replies: true,
          solved: true,
          closed: true
        }
      },
      ARTICLE: {
        permissions: {
          replies: false,
          solved: false,
          closed: false
        }
      },
      IDEA: {
        permissions: {
          replies: true,
          solved: false,
          closed: true
        }
      }
    };
    if (!contentType) {
      throw "Content Type is empty";
    }
    if (!configContentTypes[contentType].permissions) {
      throw "Permissions for Content Type '" + contentType + "' not available";
    }
    return configContentTypes[contentType].permissions;
  },

    /**
   * Returns an object with the access rights of the current user on a sord.
   * @param {de.elo.ix.client.Sord} sord
   * @returns {Object}
   */
  getAccessRights: function (sord) {
    var aclAccessInfo, accessCode, accessRights;

    aclAccessInfo = new AclAccessInfo();
    aclAccessInfo.aclItems = sord.aclItems;
    accessCode = ixConnect.ix().getAclAccess(aclAccessInfo).access;

    accessRights = {
      r: sol.common.AclUtils.containsRights(accessCode, { r: true }),
      w: sol.common.AclUtils.containsRights(accessCode, { w: true }),
      d: sol.common.AclUtils.containsRights(accessCode, { d: true }),
      e: sol.common.AclUtils.containsRights(accessCode, { e: true }),
      l: sol.common.AclUtils.containsRights(accessCode, { l: true }),
      p: sol.common.AclUtils.containsRights(accessCode, { p: true })
    };

    return accessRights;
  },

  /**
   * Create references in post
   * @param {Array} refIds Object IDs to insert as references in post
   * @param {String} objId Object ID of post
   */
  createReferences: function (refIds, objId) {
    if (!refIds) {
      return;
    }
    refIds.forEach(function (refId) {
      sol.common.IxUtils.execute("RF_sol_function_Move", {
        objId: refId,
        referenceIds: [objId]
      });
    });
  },

  /**
   * Delete references in post
   * @param {Array} refIds Object IDs to remove as references from post
   * @param {String} objId Object ID of post
   */
  deleteReferences: function (refIds, objId) {
    if (!refIds) {
      return;
    }
    refIds.forEach(function (refId) {
      sol.common.IxUtils.execute("RF_sol_function_Delete", {
        objId: refId,
        parentId: [objId]
      });
    });
  }

});
