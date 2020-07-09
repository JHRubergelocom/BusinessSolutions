
//@include lib_Class.js

/**
 * Rendering Word file from a Word template.
 *
 * This can either be used for creating a new Document in the archive (`objId` specified) or can create a new version on an existing object (`parentId`).
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 */
sol.define("sol.common.as.renderer.Word", {

  requiredConfig: ["templateId"],

  /**
   * @cfg {String} templateId (reqiured)
   * The template which should be rendered
   */

  /**
   * @cfg {String} targetId (optional)
   * The target folder to store the rendered document
   */

  /**
   * @cfg {String} objId (optional)
   * The rendered document will be saved as a version of this object
   * Either `targetId` or `objId` has to be defined.
   */

  /**
   * @cfg {Boolean} copyMetaData (optional)
   * If `true`, the mask and the metadata of the template will be copied to the new document
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    if (!me.objId && !me.targetId) {
      throw "IllegalArgumentException: either 'targetId' or 'objId' has to defined";
    }
  },

  render: function (name, data) {
    var me = this,
        config = {},
        templateSord;

    if (me.objId) {
      config.objId = me.objId;
    } else {
      config.name = name;
      config.parentId = me.targetId;
    }

    config.format = "docx";
    if (me.copyMetaData === true) {
      templateSord = ixConnect.ix().checkoutSord(me.templateId, SordC.mbAllIndex, LockC.NO);
      config.maskId = templateSord.mask;
      config.objKeysObj = sol.common.SordUtils.getTemplateSord(templateSord).sord.objKeys;
    }

    return me.renderWord(data, config);
  },

  /**
   * @private
   * @param {Object} data
   * @param {Object} config
   * @return {Object}
   */
  renderWord: function (data, config) {
    var me = this,
        result = {},
        wordDocument;

    try {
      wordDocument = sol.create("sol.common.as.WordDocument", {});
      wordDocument.openFromRepo({ objId: me.templateId });
      wordDocument.fillContentControls(data);

      result.objId = wordDocument.saveToRepo(config);
    } catch (ex) {
      me.logger.error(["error rendering report '{0}' (templateId='{1}')", config.name, me.templateId], ex);
    }

    return result;
  }

});
