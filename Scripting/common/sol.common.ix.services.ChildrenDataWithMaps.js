
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.RepoUtils.js
//@include sol.common.ix.services.ChildrenDataCollector.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ChildrenDataWithMaps" });

/**
 * Collects all child sords for a given parent with all objKeys, all mapFields and the maskFieldnames of all objKeys.
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_ChildrenDataWithMaps", {  
 *        "parentId": "ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/Business Solutions/common/Configuration",
 *        "sordKeys": ["name", "id", "maskName", "guid", "parentId", "type", "desc"]
 *     });
 * 
 * # Result
 * {
 *   "sord": {
 *      "name": "Configuration",
 *      "id": "1838",
 *      "maskName": "Folder",
 *      "guid": "(5EE11DB8-CBE5-F0F6-4C8C-F9D292AEDD79)",
 *      "parentId": "1788",
 *      "type": "47",
 *      "desc": ""
 *    },
 *    "sords": [
 *      {
 *        "name": "as.config",
 *        "id": "1841",
 *        "maskName": "ELO Business Solution Configuration",
 *        "guid": "(89A52C86-6DF6-4EB6-1A7A-F9E84A016C0D)",
 *        "parentId": "1838",
 *        "type": "254",
 *        "desc": "",
 *        "mapKeys": {},
 *        "objKeys": {
 *          "BS_CONFIG_NAME": "ELO AS settings",
 *          "BS_CONFIG_VERSION": "1.0",
 *          "BS_CONFIG_TYPE": "",
 *          "SOL_TYPE": "",
 *          "ELO_FNAME": "as.config.json"
 *        }
 *      },
 *      {
 *         ...
 *      }
 *    ],
 *    "masks": {
 *      "ELO Business Solution Configuration": {
 *        "fields": {
 *          "BS_CONFIG_NAME": {
 *            "name": "Name",
 *            "type": "TEXT"
 *          },
 *          "BS_CONFIG_VERSION": {
 *            "name": "Version",
 *            "type": "TEXT"
 *          },
 *          "BS_CONFIG_TYPE": {
 *            "name": "Type",
 *            "type": "TEXT"
 *          },
 *          "SOL_TYPE": {
 *            "name": "Solution object type",
 *            "type": "TEXT"
 *          }
 *        }
 *      }
 *    }
 *  }
 */

sol.define("sol.common.ix.services.ChildrenDataWithMaps", {
  extend: "sol.common.ix.ServiceBase",

  collectorVersion: "1.00.000",

  /**
   * @property {Number} totalCount
   * The search is terminated if this number of objects is found. If the number of results should not be constrained,
   * set this value to 232-1 = 2147483647 (maximum value of a positive 32bit integer minus 1).
   *
   * Please note that collecting huge amounts of data might lead to performance issues.
   */
  totalCount: 10000,
  
  
  /**
   * @cfg {Array} sordKeys
   * List of required sord keys.
   *
   * This only returns the given sord keys. This is required in order to limit traffic for not required keys.
   *
   *     sordKeys: ["id", "guid", "name", "desc"],
   */
  sordKeys: ["id", "guid", "name", "desc"],

  docMasks: {},

  /**
   * Starts the collection of the desired data
   * @return {Array}
   */
  execute: function () {
    var me = this,
      i;

    me.getTypeConstants();
    if (me.maskNames && me.maskNames.length > 0) {
      for (i = 0; i < me.maskNames.length; i++) {
        me.addDocMaskData(me.maskNames[i]);
      }
    }
    var result = me.collectChildren();

    return result;
  },
  
  /**
   * @private
   * helpers for collectChildren
   */
  getSord: function (objId) {
    
    try {
      return ixConnect.ix().checkoutSord(objId, SordC.mbAll, LockC.NO);
    } catch (e) {
      throw "ChildrenDataWithMaps: could not checkout sord with objId/guid `" + objId + "`";
    }
    return null;
  },

  /**
   * @private
   * helpers for collectChildren
   */
  addMapKeys: function (resultObj) {
    var me = this;

    return (resultObj.sords || [])
      .map(function (formattedSord) {
        var result = sol.common.ObjectFormatter.format({
          sord: {
            formatter: 'sol.common.ObjectFormatter.TemplateSord',
            data: me.getSord(formattedSord.id),
            config: {
              allMapFields: true,
              allObjKeys: true
            }
          }
        });
        
        formattedSord.mapKeys = (result || {sord: {}}).sord.mapKeys;
        formattedSord.objKeys = (result || { sord: {} }).sord.objKeys;
        if (!me.docMasks[result.sord.maskName]) {
          me.addDocMaskData(result.sord.maskName);
        }
        return formattedSord;
      });
  },
  
  
  /**
   * @private
   */
  collectChildren: function () {
    var me = this,
        tmpConfig, jsonDataCollector, resultString, result, resultObj;

    tmpConfig = { ec: me.ec, user: me.user, parentId: me.parentId, sordKeys: me.sordKeys };
    
    jsonDataCollector = sol.create("sol.common.ix.services.ChildrenDataCollector", tmpConfig);
    
    resultString = jsonDataCollector.execute();
    resultObj = JSON.parse(resultString);
    
    result = { sord: resultObj.sord, sords: me.addMapKeys(resultObj), masks: me.docMasks };

    return JSON.stringify(result);
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
        docMaskData.fields[docMaskLine.key] = { name: String(docMaskLine.name), type: me.docMaskLineTypes[docMaskLine.type] };
      });
    } catch (ex) {
      logger.warn(["Can't get mask info: mask={0}, ec.ci.language={1}, exception={2}", docMaskName, me.ec.ci.language, ex]);
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
 * @member sol.common.ix.services.ChildrenDataWithMaps
 * @method RF_sol_common_services_ChildrenDataWithMaps
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_ChildrenDataWithMaps(ec, configAny) {
  var config, jsonDataCollector, ecLang, ixConnectLang, result;

  ecLang = String(ec.ci.language);
  ixConnectLang = String(ixConnect.loginResult.clientInfo.language);

  config = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny),
  config.ec = ec;

  log.info("ec.ci.language=" + ecLang);
  log.info("ixConnect.loginResult.clientInfo.language=" + ixConnectLang);

  jsonDataCollector = sol.create("sol.common.ix.services.ChildrenDataWithMaps", config);
  result = jsonDataCollector.execute();
  return result;
}
