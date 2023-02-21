
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js

/**
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * Retrieves all specified keywording forms' fields of a system.
 * If no keywording forms are specified in the `masks` parameter, all forms will be retrieved.
 *
 * # Example call
 *
 *      { "masks": ["Session"] }
 *
 * # Example result
 *
 *      {
 *        "Session": {                // technical mask name
 *          "id": "39",
 *          "name": "Kurstermin",     //translated mask name
 *          "fields": {
 *            "COURSE_REFERENCE": {   //technical field name
 *              "name": "Kursnummer", //translated field name
 *              "canEdit": true,
 *              "excludeFromISearch": false,
 *              "hidden": false,
 *              "max": 255,
 *              "min": 0,
 *              "readOnly": true,
 *              "required": false,
 *              "type": 3000
 *            },
 *            "COURSE_NAME": {
 *              "canEdit": true,
 *              "excludeFromISearch": false,
 *              "hidden": false,
 *              "max": 255,
 *              "min": 0,
 *              "name": "Name",
 *              "readOnly": true,
 *              "required": false,
 *              "type": 3000
 *            }
 *          }
 *        },
 *        ...
 *      }
 *
 * @cfg {String[]} masks An array of mask names or mask ids
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.GetKeywordingForms", {
  extend: "sol.common.ix.ServiceBase",

  docMaskProps: {
    canEdit: "canEdit",
    excludeFromISearch: "excludeFromISearch",
    hidden: "hidden",
    max: "max",
    min: "min",
    name: "name",
    readOnly: "readOnly",
    required: "required",
    type: "type"
  },

  getAllMasks: function () {
    return Array.prototype.slice.call(
        ixConnect.ix().createSord(
          null,
          "",
          new EditInfoZ(EditInfoC.mbMaskNames, new SordZ())
        ).maskNames
      )
      .map(function (mask) {
        return mask.id;
      });
  },

  getMask: function (maskId) {
    function checkoutMask (selector) {
      return ixConnect.ix().checkoutDocMask(String(maskId), selector, LockC.NO)
    }
    // two calls to checkoutMask are necessary, because mbAll returns the translated mask name
    var mask = checkoutMask(DocMaskC.mbAll);
    return {
      name: checkoutMask(new DocMaskZ(DocMaskC.mbGuid)).name, // technical mask name
      id: String(mask.id),
      translated: mask.name,
      lines: mask.lines
    };
  },

  addFieldInfo: function (ixField, fieldInfo, property) {
    var me = this;
    fieldInfo[me.docMaskProps[property]] = ixField[property];
    return fieldInfo;
  },

  getMaskFields: function (maskLines) {
    var me = this;

    return maskLines.reduce(function (fields, docMaskLine) {
      fields[String(docMaskLine.key)] = Object.keys(me.docMaskProps)
        .reduce(me.addFieldInfo.bind(me, docMaskLine), {});
      return fields;
    }, {});
  },

  addMaskFields: function (results, mask) {
    var me = this, maskInfo = me.getMask(mask);
    results[maskInfo.name] = {
      id: maskInfo.id,
      name: maskInfo.translated,
      fields: me.getMaskFields(maskInfo.lines)
    };
    return results;
  },

  /**
   * Returns all fields of specified masks or all masks.
   * @return {Object} one property for each mask
   */
  process: function () {
    var me = this, masks = me.masks || [];

    if (!Array.isArray(masks)) {
      throw "value of parameter `masks` must be an array";
    }

    return (masks.length ? masks : me.getAllMasks())
      .reduce(me.addMaskFields.bind(me), {});
  }
});

/**
 * @member sol.common.ix.services.GetKeywordingForms
 * @method RF_sol_common_service_GetKeywordingForms
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_GetKeywordingForms(iXSEContext, args) {
  var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.GetKeywordingForms" }),
      stringify = sol.common.JsonUtils.stringifyQuick, params, result;
  logger.enter("RF_sol_common_service_GetKeywordingForms", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  result = stringify(sol.create("sol.common.ix.services.GetKeywordingForms", params).process());
  logger.exit("RF_sol_common_service_GetKeywordingForms");
  return result;
}