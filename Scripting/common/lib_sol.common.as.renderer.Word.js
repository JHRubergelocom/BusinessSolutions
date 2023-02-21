
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

  /**
   * @cfg {Boolean} [fillContentControls=true] (optional)
   * If `true`, the content controls will be filled.
   */

  /**
   * @cfg {String} partIdsFromMapTableKey (optional)
   * Map field name key from which the part IDs are read, e.g. `CLAUSE_ID`
   */

  /**
   * @cfg {String} searchPartIdFieldName (optional)
   * Part ID field name to find the requested part
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    if (!me.saveToStream && !me.objId && !me.targetId) {
      throw "IllegalArgumentException: either 'saveToStream', 'targetId' or 'objId' has to defined";
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

    if (typeof me.fillContentControls == "string") {
      me.fillContentControls = (me.fillContentControls === "true");
    }

    config.fillContentControls = typeof me.fillContentControls == "undefined" ? true : me.fillContentControls;

    if (typeof me.updateParts == "string") {
      me.updateParts = (me.updateParts === "true");
      config.updateParts = me.updateParts;
    }

    if (me.editParts) {
      config.editParts = me.editParts;
      config.partIdsFromMapTableKey = me.partIdsFromMapTableKey;
      config.searchPartIdFieldName = me.searchPartIdFieldName;
      config.partIds = me.getPartIds(me.partIdsFromMapTableKey);
      me.writePartIds(me.objId, me.partIdsTargetFieldName, config.partIds);
    }

    if (me.updateParts) {
      config.updateParts = me.updateParts;
      config.searchPartIdFieldName = me.searchPartIdFieldName;
    }

    if (me.saveToStream) {
      config.saveToStream = me.saveToStream;
    }

    config.format = me.format || "docx";
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

    me.logger.info(["Render Word: editParts={0}({1}), fillContentControls={2}({3}), updateParts={4}({5})", config.editParts, typeof config.editParts, config.fillContentControls,
      typeof config.fillContentControls, config.updateParts, typeof config.updateParts]);

    try {
      wordDocument = sol.create("sol.common.as.WordDocument", {});
      wordDocument.openFromRepo({ objId: me.templateId });

      if (config.fillContentControls) {
        wordDocument.fillContentControls(data);
      }

      config.partsConfig = config.partsConfig || {};

      if (config.editParts) {
        wordDocument.editParts(config.partIds, { searchPartIdFieldName: config.searchPartIdFieldName });
      }

      if (config.updateParts) {
        wordDocument.updateParts();
      }

      if (config.saveToStream) {
        result.inputStream = wordDocument.saveToStream(config);
      }

      if (config.objId || config.parentId) {
        result.objId = wordDocument.saveToRepo(config);
      }
    } catch (ex) {
      me.logger.error(["error rendering report '{0}' (templateId='{1}')", config.name, me.templateId], ex);
    }

    return result;
  },

  getPartIds: function (partIdsFromMapTableKey) {
    var me = this,
        partIds = [],
        sordMap, sordMapTable, partId;

    me.logger.info(["getPartIds: objId={0}, mapKey={1}", me.objId, partIdsFromMapTableKey]);

    sordMap = sol.create("sol.common.SordMap", { objId: me.objId });
    sordMapTable = sol.create("sol.common.MapTable", { map: sordMap, columnNames: [partIdsFromMapTableKey] });
    while (sordMapTable.hasNextRow()) {
      sordMapTable.nextRow();
      partId = sordMapTable.getValue(partIdsFromMapTableKey);
      partIds.push(partId);
    }

    me.logger.info(["getPartIds: partIds={0}", partIds]);

    return partIds;
  },

  writePartIds: function (objId, partIdsTargetFieldName, partIds) {
    var me = this,
        sord;

    if (!partIdsTargetFieldName) {
      return;
    }

    me.logger.info(["writePartIds: objId={0}, fieldName={1}, partIds={2}", objId, partIdsTargetFieldName, partIds]);

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    sol.common.SordUtils.setObjKeyValues(sord, partIdsTargetFieldName, partIds);
    ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
  }
});
