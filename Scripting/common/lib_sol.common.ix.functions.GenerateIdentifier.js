
//@include lib_Class.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js

/**
 * Base class to generate IDs and names by templates
 *
 * A sub class must implement the methods `getIdentifierTemplateId`, `getIdentifier` and `setIdentifier`
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.01.002
 *
 * @eloix
 *
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.WfUtils
 * @requires  sol.common.ix.FunctionBase
 */

sol.define("sol.common.ix.functions.GenerateIdentifier", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} identifierCounterTemplateId (required)
   * Object ID of the identifier counter template
   */

  /**
   * @cfg {String} identifierTemplateId (required)
   * Object ID of the identifier template
   */

  /**
   * @cfg {String} objId (required)
   * Object ID of destination object
   */

  /**
   * @cfg {String} fieldName (required)
   * Field name of the identifier field
   */

  /**
   * @cfg {Boolean} [applyIdentifier=false]
   * `True` if the identifier should be written to the object
   */

  /**
   * @cfg {Boolean} [optionalIdentifier=false]
   * If `true`, nothing will be generated if the generator field is empty
   */

  /**
   * @cfg {Boolean} [updateExisting=false]
   * If `true`, an existing value will be overridden
   */

  process: function () {
    var me = this,
        identifierTemplate, identifier;

    me.readObject();

    me.identifierTemplateId = me.identifierTemplateId || me.getIdentifierTemplateId();

    if (me.identifierTemplateId && me.updateIdentifier()) {

      identifierTemplate = sol.create("sol.common.Template", {});
      identifierTemplate.load(me.identifierTemplateId);
      identifier = identifierTemplate.apply({
        sord: me.templateSord
      });

      if (me.applyIdentifier && me.checkUpdate(identifier)) {
        me.setIdentifier(identifier);
        ixConnect.ix().checkinSord(me.sord, SordC.mbAllIndex, LockC.NO);
      }

      return JSON.stringify({ identifier: identifier });
    }
    return "";
  },

  /**
   * @private
   */
  readObject: function () {
    var me = this,
        templateSordFormatter;
    if (!me.objId) {
      throw "Object ID is empty";
    }
    me.sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);
    templateSordFormatter = sol.create("sol.common.ObjectFormatter.TemplateSord", {
      data: me.sord,
      config: {
        sordKeys: ["name", "IDateIso", "XDateIso"],
        objKeys: [],
        mapKeys: []
      }
    });
    me.templateSord = templateSordFormatter.build();
  },

  /**
   * @private
   * @return {Boolean} status
   */
  updateIdentifier: function () {
    var me = this;
    return me.updateExisting || org.apache.commons.lang.StringUtils.isBlank(me.getIdentifier());
  },

  /**
   * @private
   * @param {String} identifier
   * @return {Boolean}
   */
  checkUpdate: function (identifier) {
    var me = this;
    return (identifier != me.getIdentifier());
  },

  /**
   * @abstract
   * Must return the Object ID of the template.
   */
  getIdentifierTemplateId: function () {
    throw "Can't call abstract method 'getIdentifierTemplateId()'";
  },

  /**
   * @abstract
   * Must read the identifier from the appropriate field
   */
  getIdentifier: function () {
    throw "Can't call abstract method 'getIdentifier()'";
  },

  /**
   * Must write the identifier to the appropriate field
   * @abstract
   * @param {String} identifier Identifier
   */
  setIdentifier: function (identifier) {
    throw "Can't call abstract method 'setIdentifier()'";
  },

  /**
   * Reads the template name from generator field and determinates the object ID of the template
   * @private
   * @param {String} typeDescription
   * @param {String} templateNameField
   * @param {String} templateFolderId
   * @return {String} templateid
   */
  getTemplateId: function (typeDescription, templateNameField, templateFolderId) {
    var me = this,
        templateName;

    me.logger.debug("getTemplateId(): typeDescription=" + typeDescription + ", templateNameField=" + templateNameField + ", templateFolderId=" + templateFolderId);

    if (!templateNameField) {
      throw typeDescription + " template name field must not be empty.";
    }
    templateName = sol.common.SordUtils.getObjKeyValue(me.sord, templateNameField);

    me.logger.debug("getTemplateId(): templateName=" + templateName + ", optionalIdentifier=" + me.optionalIdentifier);
    return me.getObjIdFromRelativePath(typeDescription, templateName, templateFolderId);
  },

  /**
   * Get the ObjId of the selected templateFolder.
   *
   * @param {String} typeDescription
   * @param {String} templateFolderId
   * @param {String} templateName
   * @return {String} templateObjId
   */
  getObjIdFromRelativePath: function (typeDescription, templateName, templateFolderId) {
    var me = this;

    if (!templateName && me.optionalIdentifier) {
      return null;
    } else if (!templateName) {
      throw typeDescription + " template name must not be empty.";
    }
    if (!templateFolderId) {
      throw typeDescription + " template folder ID must not be empty.";
    }
    return sol.common.RepoUtils.getObjIdFromRelativePath(templateFolderId, "/" + templateName);
  },

  /**
   * @protected
   * Truncates a string to the appropriate length for the sord name field.
   * @param {String} name
   * @return {String}
   */
  truncateSordName: function (name) {
    var me = this,
        maxLength = ixConnect.CONST.SORD.lnName;

    name = (name) ? String(name) : name;

    if (name && (name.length > maxLength)) {
      name = name.substring(0, maxLength - 3) + "...";
      me.logger.debug("String truncated: " + name);
    }

    return name;
  }

});
