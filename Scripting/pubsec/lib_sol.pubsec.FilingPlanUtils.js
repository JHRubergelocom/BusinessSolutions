
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 *
 * @eloix
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.SordTypeUtils
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.FilingPlanUtils", {
  singleton: true,

  /**
   * Builds the name of a filing plan element.
   * @param {String} reference The filing plan reference number
   * @param {String} name The filing plan elements name
   * @returns {String} The full name of the filing plan element
   */
  buildFullName: function (reference, name) {
    return reference + sol.pubsec.Utils.loadConfig().filingPlan.nameSeparator + name;
  },

  /**
   * Creates a filing plan element.
   * @param {String} parentId The target folder id
   * @param {String} name Name of the new element
   * @param {Object} keywording (optional) Object with key value pairs holding GroupField:[data] or GroupField:dataString
   * @param {Boolean} asAdmin (optional) If 'true' the element will be created in admin context
   * @param {de.elo.ix.client.AclItem[]} aclItems (optional) If this is set, and contains `AclItems` these will override the defaults
   * @param {String} type (optional) If this is setthe type of the element will be set to this
   * @returns {String} The new objId
   */
  createElement: function (parentId, name, keywording, asAdmin, aclItems, type) {
    var me = this,
        connection, sord, key, val;

    connection = (asAdmin && (typeof ixConnectAdmin !== "undefined")) ? ixConnectAdmin : ixConnect;

    sord = connection.ix().createSord(parentId, sol.pubsec.Utils.loadConfig().filingPlan.maskName, EditInfoC.mbSord).sord;
    if (name.length > 128) {
      me.logger.warn("Short description exceeds maximum length of 128 characters.", name);
      name = name.substring(0, 128);
    }
    sord.name = name;

    if (keywording) {
      for (key in keywording) {
        if (keywording.hasOwnProperty(key)) {
          if (key === "SORD_DESC") {
            sord.desc = keywording[key];
          } else {
            val = keywording[key];
            if (val.length > 254) {
              me.logger.warn("Value of field '" + key + "' exceeds maximum length of 254 characters.", keywording);
              val = val.substring(0, 254);
            }
            sol.common.SordUtils.setObjKeyValue(sord, key, val);
          }
        }
      }
    }

    if (aclItems && (aclItems.length > 0)) {
      sord.aclItems = aclItems;
    }

    if (type) {
      sord.type = sol.common.SordTypeUtils.getSordTypeId(type) || sord.type;
    }

    return connection.ix().checkinSord(sord, SordC.mbAll, LockC.NO);
  },

  /**
   * Checks, if custom ACL inheritance should be used on an element.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isAclInheritanceApplicable: function (sord) {
    var fpConfig = sol.pubsec.Utils.loadConfig(),
        getSolType, solType;

    getSolType = function () {
      var objKeys, i, max, objKey;

      objKeys = sord.objKeys;
      max = objKeys.length;

      for (i = 0; i < max; i++) {
        objKey = objKeys[i];
        if (objKey.name == "SOL_TYPE") {
          return (objKey.data[0]) ? String(objKey.data[0]) : null;
        }
      }
      return null;
    };

    if (!sord || !sord.objKeys || (sord.objKeys.length <= 0) || !fpConfig.filingPlan.aclInheritanceBreaker.enabled) {
      return false;
    }
    solType = getSolType(sord);
    if (!solType || fpConfig.filingPlan.aclInheritanceBreaker.processedSolTypes.indexOf(solType) < 0) {
      return false;
    }
    return true;
  }

});
