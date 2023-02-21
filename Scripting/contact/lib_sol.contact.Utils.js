
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Contact management utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.05.002
 *
 * @eloix
 * @eloas
 *
 * @requires handlebars
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.Template
 */
sol.define("sol.contact.Utils", {
  singleton: true,

  /**
   * Loads (and merges) the contact configuration from the JSON file: `/Administration/Business Solutions/contact/Configuration/contact.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/contact/Configuration/contact.config" }).config;
  },

  /**
   * Get config part
   * @param {Object} config Configuration
   * @param {de.elo.ix.client.Sord} sord
   * @return {Object} Configuration part
   */
  getConfigPart: function (config, sord) {

    if (!config) {
      throw "Configuation is empty";
    }

    if (!sord) {
      throw "Sord is empty";
    }

    if (sol.contact.Utils.isContactList(sord)) {
      return config.contactlist;
    } else if (sol.contact.Utils.isCompany(sord)) {
      return config.company;
    } else if (sol.contact.Utils.isContact(sord)) {
      return config.contact;
    }
    throw "Type must be contact list, company or contact";
  },

  /**
   * Checks, if an element is from type contactlist
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isContactList: function (sord) {
    var me = this;
    return me.getSolType(sord) === me.loadConfig().contactlist.solType;
  },

  /**
   * Searches the repository hierarchy to find the parent contactlist (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentContactList: function (objId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        isContactList = me.isContactList(sord);

    if (!isContactList && sord.id !== 1 && sord.parentId !== 0) {
      return me.getParentContactList(sord.parentId);
    }
    return (isContactList) ? sord : null;
  },

  /**
   * Checks, if an element is from type company
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isCompany: function (sord) {
    var me = this;
    return me.getSolType(sord) === me.loadConfig().company.solType;
  },

  /**
   * Searches the repository hierarchy to find the parent company (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentCompany: function (objId) {
    var me = this,
        sord,
        isCompany, isContactList;

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    isCompany = me.isCompany(sord);
    isContactList = me.isContactList(sord);

    if (!isCompany && !isContactList && sord.id !== 1 && sord.parentId !== 0) {
      return me.getParentCompany(sord.parentId);
    }
    return (isCompany) ? sord : null;
  },

  /**
   * Checks, if an element is from type contact
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isContact: function (sord) {
    var me = this;
    return me.getSolType(sord) === me.loadConfig().contact.solType;
  },

  /**
   * Searches the repository hierarchy to find the parent contact (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentContact: function (objId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        isContact = me.isContact(sord);

    if (!isContact && sord.id !== 1 && sord.parentId !== 0) {
      return me.getParentContact(sord.parentId);
    }
    return (isContact) ? sord : null;
  },

  /**
   * Checks, if an element is from type of contact management object
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isContactManagementObject: function (sord) {
    var me = this;
    return me.isContactList(sord) || me.isCompany(sord) || me.isContact(sord);
  },

  /**
   * Searches the registerfolder for a prefix.
   * @param {String} objId
   * @param {String} regPrefix, e.g. 'A'
   * @return {String} objId of registerfolder
   */
  getIdRegisterFolder: function (objId, regPrefix) {
    var repoPath = sol.common.RepoUtils.getPathFromObjId(objId),
        regId;

    repoPath = repoPath + "/" + regPrefix;
    regId = sol.common.RepoUtils.preparePath(repoPath);
    return (regId);
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @return {String}
   */
  getSolType: function (sord) {
    var solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");
    return (solType) ? solType + "" : null;
  },

  /**
   * Creates a new company in the chaos cabinet.
   * @param {String} companyType Used to determine the company template.
   * @param {Object} params (optional)
   * @param {de.elo.ix.client.UserInfo} params.owner (optional) This user will be granted full access to the new company element
   * @param {Boolean} [params.fromService=false] (optional) This will be reflected in the new elements name (used for further processing)
   * @return {Object} Result contains `objId` of the new element and `name` of the new element
   */
  createCompany: function (companyType, params) {
    var me = this,
        result = {},
        aclCfg = null;

    me.logger.enter("create_company", arguments);

    result.name = me.buildCompanyTempName(companyType, (params && params.fromService) ? params.fromService : false);

    if (params && params.owner) {
      aclCfg = {
        mode: "ADD",
        entries: [
          { userName: params.owner.name, rights: { r: true, w: true, d: true, e: true, l: true } }
        ]
      };
    }

    result.objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me.getCompanyTemplateObjId(companyType),
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: result.name,
      asAdmin: true,
      useQuickCopy: true,
      acl: aclCfg
    });

    me.logger.exit("create_company", result);

    return result;
  },

  /**
   * @private
   * Retrieves the path of the company template.
   * @param {String} companyType
   * @return {String}
   */
  getCompanyTemplateObjId: function (companyType) {
    var me = this;
    return sol.common.RepoUtils.getObjIdFromRelativePath(me.loadConfig().company.templateFolderId, "/" + companyType);
  },

  /**
   * Retrieves the company reference.
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {String} The company reference or `null` if no reference was found
   */
  getCompanyReference: function (sord) {
    var me = this,
        companyRef = null;

    me.logger.enter("getCompanyReference", { objId: sord.id || sord });

    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }

    companyRef = sol.common.SordUtils.getObjKeyValue(sord, me.loadConfig().company.referenceField);
    companyRef = (companyRef && !sol.common.StringUtils.isBlank(companyRef)) ? String(companyRef) : null;

    me.logger.exit("getCompanyReference", { companyReference: companyRef });

    return companyRef;
  },

  /**
   * @private
   * Creates the new company (temporary) name.
   * @param {String} companyType
   * @param {Boolean} [fromService=false] (optional) If `true`, a prefix will be set that the element / workflow can be recoqnised (uses {@link sol.common.WfUtils#createServiceWfName})
   * @return {String}
   */
  buildCompanyTempName: function (companyType, fromService) {
    var me = this,
        name;
    name = sol.create("sol.common.Template", { source: me.loadConfig().company.createWorkflowNameTemplate }).apply({ companyType: companyType });
    if (fromService === true) {
      name = sol.common.WfUtils.createServiceWfName(name);
    }
    return name;
  },

  /**
   * Creates a new contact in the chaos cabinet.
   * @param {String} contactType Used to determine the contact template.
   * @param {Object} params (optional)
   * @param {de.elo.ix.client.UserInfo} params.owner (optional) This user will be granted full access to the new contact element
   * @param {Boolean} [params.fromService=false] (optional) This will be reflected in the new elements name (used for further processing)
   * @return {Object} Result contains `objId` of the new element and `name` of the new element
   */
  createContact: function (contactType, params) {
    var me = this,
        result = {},
        aclCfg = null;

    me.logger.enter("create_contact", arguments);

    result.name = me.buildContactTempName(contactType, (params && params.fromService) ? params.fromService : false);

    if (params && params.owner) {
      aclCfg = {
        mode: "ADD",
        entries: [
          { userName: params.owner.name, rights: { r: true, w: true, d: true, e: true, l: true } }
        ]
      };
    }

    result.objId = sol.common.IxUtils.execute("RF_sol_function_CopyFolderContents", {
      objId: "0",
      source: me.getContactTemplateObjId(contactType),
      copySourceAcl: false,
      inheritDestinationAcl: false,
      name: result.name,
      asAdmin: true,
      useQuickCopy: true,
      acl: aclCfg
    });

    me.logger.exit("create_contact", result);

    return result;
  },

  /**
   * @private
   * Retrieves the path of the contact template.
   * @param {String} contactType
   * @return {String}
   */
  getContactTemplateObjId: function (contactType) {
    var me = this;
    return sol.common.RepoUtils.getObjIdFromRelativePath(me.loadConfig().contact.templateFolderId, "/" + contactType);
  },

  /**
   * Retrieves the contact reference.
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {String} The contact reference or `null` if no reference was found
   */
  getContactReference: function (sord) {
    var me = this,
        contactRef = null;

    me.logger.enter("getContactReference", { objId: sord.id || sord });

    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }

    contactRef = sol.common.SordUtils.getObjKeyValue(sord, me.loadConfig().contact.referenceField);
    contactRef = (contactRef && !sol.common.StringUtils.isBlank(contactRef)) ? String(contactRef) : null;

    me.logger.exit("getContactReference", { contactReference: contactRef });

    return contactRef;
  },

  /**
   * @private
   * Creates the new contact (temporary) name.
   * @param {String} contactType
   * @param {Boolean} [fromService=false] (optional) If `true`, a prefix will be set that the element / workflow can be recoqnised (uses {@link sol.common.WfUtils#createServiceWfName})
   * @return {String}
   */
  buildContactTempName: function (contactType, fromService) {
    var me = this,
        name;
    name = sol.create("sol.common.Template", { source: me.loadConfig().contact.createWorkflowNameTemplate }).apply({ contactType: contactType });
    if (fromService === true) {
      name = sol.common.WfUtils.createServiceWfName(name);
    }
    return name;
  },

  /**
   * Maps the data from the batch importer so it can be used by the existing createX RFs.
   * @param {Object} templateSord
   * @return {Object[]} An input object array for the {@link sol.common.SordUtils#updateSord updateSord} method.
   */
  mapData: function (templateSord) {
    var result = [],
        mapSubObj;

    mapSubObj = function (obj, type) {
      var key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          result.push({ key: key, type: type, value: obj[key] });
        }
      }
    };

    if (!templateSord) {
      return result;
    }

    if (templateSord.objKeys) {
      mapSubObj(templateSord.objKeys, "GRP");
    }

    if (templateSord.mapKeys) {
      mapSubObj(templateSord.mapKeys, "MAP");
    }

    return result;
  }

});
