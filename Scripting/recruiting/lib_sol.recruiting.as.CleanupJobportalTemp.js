/**
 * Performs a cleanup of the temporary jobportal files to remove any orphanated (older than {@link #threshold}) documents.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloas
 *
 * @requires sol.common.Cache
 * @requires sol.common.DateUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.Config
 */
sol.define("sol.recruiting.as.CleanupJobportalTemp", {

  /**
   * @private
   * @property {Number}
   * Max number of days to keep temporary documents
   */
  threshold: 1,

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.config = sol.create("sol.common.Config", { compose: "/recruiting_jobportal/Configuration/recruiting.jobportal.services.config" }).config.entities.jobportaluser.as.cleanupUploads;
    if (me.config.threshold) {
      me.threshold = me.config.threshold;
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
        objId = me.config.path;

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
