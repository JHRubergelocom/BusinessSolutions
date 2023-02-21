/**
 * Performs a cleanup of the temporary image folders to remove any orphanated (older than {@link #threshold}) documents.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloas
 *
 * @requires sol.common.Cache
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.Config
 * @requires sol.knowledge.as.Utils
 */
sol.define("sol.knowledge.as.CleanupImages", {

  /**
   * @private
   * @property {Number}
   * Max number of days to keep temporary documents
   */
  threshold: 7,

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.config = sol.knowledge.as.Utils.loadKnowledgeConfig();
    if (me.config.cleanupImages.threshold) {
      me.threshold = me.config.cleanupImages.threshold;
    }
  },

  /**
   * Performs the cleanup.
   */
  run: function () {
    var me = this,
        delCount = 0,
        documents;

    me.logger.enter("run");

    me.logger.debug("cleanup temporary file folder");
    documents = me.retrieveFileDocuments();
    delCount += me.deleteObsolete(documents);

    documents = null;

    me.logger.debug("cleanup temporary image folder");
    documents = me.retrieveImageDocuments();
    delCount += me.deleteObsolete(documents);

    me.logger.debug(["deleted {0} documents", delCount]);

    me.logger.exit("run");
  },

  /**
   * @private
   * Retrives all documents from the temporary file folder.
   * @return {de.elo.ix.client.Sord[]}
   */
  retrieveFileDocuments: function () {
    var me = this,
        objId = me.config.boardUpload.fileUpload;

    return me.collectDocuments(objId);
  },

  /**
   * @private
   * Retrives all documents from the temporary image folder.
   * @return {de.elo.ix.client.Sord[]}
   */
  retrieveImageDocuments: function () {
    var me = this,
        objId = me.config.boardUpload.imageUpload;

    return me.collectDocuments(objId);
  },

  /**
   * @private
   * Collects all children documents
   * @param {String} objId
   * @return {de.elo.ix.client.Sord[]}
   */
  collectDocuments: function (objId) {
    var me = this,
        result, docCount;

    result = sol.common.RepoUtils.findChildren(objId, {
      includeFolders: false,
      includeDocuments: true,
      sordZ: SordC.mbMin
    });

    docCount = (result) ? result.length : 0;
    me.logger.debug(["found {0} documents in '{1}'", docCount, objId]);

    return result;
  },

  /**
   * @private
   * Deletes all obsolete documents.
   * @param {de.elo.ix.client.Sord[]} documents
   * @return {Number} Number od deleted documents
   */
  deleteObsolete: function (documents) {
    var me = this,
        now = new Date(),
        delCount = 0,
        checkDate;

    me.logger.enter("deleteObsolete");

    checkDate = sol.common.DateUtils.shift(now, -Math.abs(me.threshold));

    if (documents && (documents.length > 0)) {
      documents.forEach(function (doc) {
        var docDate = sol.common.DateUtils.isoToDate(doc.IDateIso);
        if (docDate < checkDate) {
          me.logger.debug(["delete doc: name={0}, objId={1}", doc.name, doc.id]);
          delCount++;
          sol.common.RepoUtils.deleteSord(doc.id, { parentId: doc.parentId });
        }
      });
    }
    me.logger.exit("deleteObsolete");

    return delCount;
  }

});
