
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 *
 * @eloall
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordTypeUtils
 * @requires sol.common.SordMap
 */
sol.define("sol.pubsec.Utils", {
  singleton: true,

  /**
   * @property {Object} TYPES
   * Constants which indicate a certain element type, when set in index field 'SOL_TYPE'
   */
  TYPES: {
    FILING_PLAN: "FILING_PLAN",
    FILING_PLAN_STRUCT: "FILING_PLAN_STRUCT",
    FILE: "FILE",
    PROCESS: "PROCESS",
    CIRCULATION_FOLDER: "CIRCULATION_FOLDER",
    DOCUMENT: "DOCUMENT"
  },

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/pubsec/Configuration/pubsec.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/pubsec/Configuration/pubsec.config" }).config;
  },

  /**
   * Creates a new folder.
   * @param {String} target The target for the new folder (objId, GUID, static or dynamic arcpath).
   * @param {String} mask
   * @param {String} name
   * @param {Object} params (optional) Additional parameters
   * @param {String} params.typeName (optional) Name of the sord type which should be used for the new folder
   * @param {Number} params.typeId (optional) ID of the sord type which should be used for the new folder (has priority over `typeName`)
   * @param {Boolean} [params.grantAccesToOwner=false] (optional)
   * @param {de.elo.ix.client.IXConnection} params.conn (optional) A different IXConnection which will be used instead of ´ixConnect´
   * @return {String} The objId of the new folder
   */
  createFolder: function (target, mask, name, params) {
    var conn = (params && params.conn) ? params.conn : ixConnect,
        objId, sord, ownerAcl, newAclItems;

    objId = sol.common.RepoUtils.preparePath(target, { data: {} });
    sord = conn.ix().createSord(objId, mask, EditInfoC.mbSord).sord;
    sord.name = name;

    if (params) {
      if (params.typeName && !params.typeId) {
        params.typeId = sol.common.SordTypeUtils.getSordTypeId(params.typeName);
      }
      if (params.typeId) {
        sord.type = params.typeId;
      }
      if (params.grantAccesToOwner === true) {
        ownerAcl = new AclItem();
        ownerAcl.id = sord.ownerId;
        ownerAcl.type = AclItemC.TYPE_USER;
        ownerAcl.access = AccessC.LUR_READ | AccessC.LUR_WRITE | AccessC.LUR_EDIT | AccessC.LUR_LIST;

        newAclItems = Array.prototype.slice.call(sord.aclItems);
        newAclItems.push(ownerAcl);
        sord.aclItems = newAclItems;
      }
    }

    return conn.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
  },

  /**
   * Creates a references to elements inside a folder.
   * @param {String} targetId The ID, where the references should be stored
   * @param {String[]} refObjIds The IDs of all objects, which should be stored in the target
   */
  referenceElements: function (targetId, refObjIds) {
    if (refObjIds && refObjIds.length > 0) {
      refObjIds.forEach(function (refObjId) {
        ixConnect.ix().refSord(null, targetId, refObjId, -1);
      });
    }
  },

  /**
   * Determines on which kind of element this was started.
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {String} See {@link #TYPES} for the types
   */
  determineType: function (sord) {
    var me = this,
        type = null;
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    if (me.isFilingPlan(sord)) {
      type = me.TYPES.FILING_PLAN;
    }
    if (me.isFilingPlanStructure(sord)) {
      type = me.TYPES.FILING_PLAN_STRUCT;
    }
    if (me.isFile(sord)) {
      type = me.TYPES.FILE;
    }
    if (me.isProcess(sord)) {
      type = me.TYPES.PROCESS;
    }
    if (me.isDocument(sord)) {
      type = me.TYPES.DOCUMENT;
    }
    return type;
  },

  /**
   * Retrieves the mask for the temporary request folder from the 'pubsec.config'.
   * Uses the property `config.requests.<requestType>.maskName`. If there is no property defined the method returns an empty string.
   * @param {String} requestType
   * @return {String}
   */
  retrieveRequestMask: function (requestType) {
    var me = this,
        mask = "";

    config = me.loadConfig();

    if (config && config.requests && config.requests[requestType] && config.requests[requestType].maskName) {
      mask = config.requests[requestType].maskName;
    }

    return mask;
  },

  /**
   * Checks, if an element is from type filing plan
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isFilingPlan: function (sord) {
    var me = this;
    return me.isOfType(sord, me.TYPES.FILING_PLAN);
  },

  /**
   * Checks, if an element is from type filing plan structure
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isFilingPlanStructure: function (sord) {
    var me = this;
    return me.isOfType(sord, me.TYPES.FILING_PLAN_STRUCT);
  },

  /**
   * Checks, if an element is a file
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isFile: function (sord) {
    var me = this;
    return me.isOfType(sord, me.TYPES.FILE);
  },

  /**
   * Checks, if an element is a process
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isProcess: function (sord) {
    var me = this;
    return me.isOfType(sord, me.TYPES.PROCESS);
  },

  /**
   * Checks, if an element is a document
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isDocument: function (sord) {
    var me = this;
    return me.isOfType(sord, me.TYPES.DOCUMENT);
  },

  /**
   * @private
   * @param {Object} sord
   * @param {String} type
   * @return {Boolean}
   */
  isOfType: function (sord, type) {
    var sordUtils = sol.common.SordUtils;

    if (!sordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    return sordUtils.getObjKeyValue(sord, "SOL_TYPE") == type;
  },

  /**
   * Copies the metadata of an array of objIds to the parent objects map fields so they can be displayed in the workflow form.
   * @param {String} parentObjId
   * @param {String[]} objIds
   * @param {Object[]} mappings
   */
  copyMetadataToMap: function (parentObjId, objIds, mappings) {
    var requestMap;

    if (mappings && objIds && (mappings.length > 0) && (objIds.length > 0)) {

      requestMap = sol.create("sol.common.SordMap", { objId: parentObjId });

      objIds.forEach(function (objId, idx) {
        var sord = sol.common.RepoUtils.getSord(objId);

        mappings.forEach(function (mapping) {
          var key = mapping.to + (idx + 1),
              value = sol.common.SordUtils.getValue(sord, mapping.from);
          if (value) {
            requestMap.setValue(key, value);
          }
        });

      });

      requestMap.write();
    }
  }

});
