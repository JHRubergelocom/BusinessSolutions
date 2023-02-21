/**
 * Collects all elements within a specified folder.
 *
 * In addition this collector provides a {@link #getContext} methode to deliver some context about the collector to the analyzers.
 * Currently only a `parentMap` property of type {@link sol.common.SordMap} will be provided if {@link #readParentMap} is configured.
 *
 * # Example
 * This collector will return all child elements in one batch and it is not possible to use paging.
 *
 *     var updateCollector = sol.create("sol.common_monitoring.as.collectors.ChildrenCollector", {
 *       objId: "ARCPATH:¶Job queues¶Updates"
 *     });
 *
 * # Post processing
 * In post processing the references in the folder will be deleted if
 *
 * a) {@link #cleanupReferences} is set to `true` (priority over analyzer results)
 *
 * b) the analyzer returns at least one `result` with a property `cleanupRef` set to `true`
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.02.000
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.Map
 */
sol.define("sol.common_monitoring.as.collectors.ChildrenCollector", {

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required) The folder which should be watched
   */

  /**
   * @cfg {String} findChildrenCfg (optional) See {@link sol.common.RepoUtils#findChildren}. The default would be {@link #defaultFindChildrenCfg}.
   */

  /**
   * @cfg {String[]} readParentMap (optional)
   * If This contains keys, all map fields from the parent map will be checked out, which start with those keys.
   * The keys in the parent map must have an dot and the objId appended, otherwise they could not be mazched to the corresonding child element.
   */

  /**
   * @cfg {Boolean} cleanupParentMap (optional) If `true`, all checked out parent map values will be deleted.
   */

  /**
   * @cfg {Boolean} cleanupReferences (optional) If `true`, all references will be deleted, regardless the results.
   */

  /**
   * @private
   * @property {de.elo.ix.client.SordZ} defaultFindChildrenCfg
   */
  defaultFindChildrenCfg: {
    includeFolders: true,
    includeDocuments: true,
    includeReferences: true,
    sordZ: SordC.mbAllIndex
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me._findChildrenCfg = config.findChildrenCfg || me.defaultFindChildrenCfg;
    me._hasMoreResults = true;
    me._parentMap = me.getParentMap();
  },

  /**
   * Checks, if this collector has additional results.
   * @return {Boolean}
   */
  hasMoreResults: function () {
    var me = this;
    return me._hasMoreResults;
  },

  /**
   * Retrieves the next batch of work items.
   * @return {de.elo.ix.client.Sord[]}
   */
  getResults: function () {
    var me = this;

    if (!me._workingSet) {
      me.logger.debug("perform find children search");
      me._workingSet = sol.common.RepoUtils.findChildren(me.objId, me._findChildrenCfg);
      me._hasMoreResults = false;
    } else {
      me.logger.debug("use chached search result");
    }
    return me._workingSet;
  },

  /**
   * Returns a prefilled context object if {@link #readParentMap} defines at least one map key.
   * @return {Object}
   */
  getContext: function () {
    var me = this,
        ctx = {};
    if (me._parentMap) {
      ctx.parentMap = me._parentMap;
    }
    return ctx;
  },

  /**
   * This collector removes the references to a sord in the watched folder if {@link #cleanupReferences} is set to `true` or one of the `results` defines a `cleanupRef` flag.
   * If {@link #cleanupParentMap} is set to `true` the parent map entries will be deleted (see {@link #readParentMap}).
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} results The result object returned by an `analyzer`
   * @param {Object} ctx Context object
   */
  postProcess: function (sord, results, ctx) {
    var me = this;

    me.logger.enter("postProcess");

    if (me.cleanupReferences === true) {
      me.deleteReference(sord);
    } else if (results && (results.length > 0)) {
      results.some(function (r) {
        if (r.cleanupRef === true) {
          me.deleteReference(sord);
          return true; // break loop, if the first 'cleanupRef' flag was found
        }
      });
    }

    if (me.cleanupParentMap === true) {
      me.cleanupMap(sord);
    }

    me.logger.exit("postProcess");
  },

  /**
   * Performes cleanup by removing the current working set.
   */
  dispose: function () {
    var me = this;
    me._workingSet = null;
    me._hasMoreResults = true;
  },

  /**
   * @private
   * Retrives the parent map if configured.
   * @return {sol.common.SordMap}
   */
  getParentMap: function () {
    var me = this,
        parentMap = null,
        mapKeys;
    if (me.readParentMap && (me.readParentMap.length > 0)) {
      parentMap = sol.create("sol.common.SordMap", { objId: sol.common.RepoUtils.getObjId(me.objId) });
      mapKeys = me.readParentMap.map(function (key) {
        return key + ".*";
      });
      parentMap.read(mapKeys);
    }
    return parentMap;
  },

  /**
   * @private
   * Deletes a Reference fron the watched folder.
   * @param {de.elo.ix.client.Sord} sord
   */
  deleteReference: function (sord) {
    var me = this,
        parentId, isReference;
    parentId = sol.common.RepoUtils.getObjId(me.objId);
    isReference = (sord.parentId != parentId);
    if (isReference) {
      me.logger.debug(["remove reference to '{0}' from folder '{1}'", sord.id, parentId]);
      ixConnect.ix().deleteSord(parentId, sord.id, LockC.NO, null);
    }
  },

  /**
   * @private
   * Removes all entries from the parent map if configured (see {@link #cleanupParentMap}).
   * @param {de.elo.ix.client.Sord} sord
   */
  cleanupMap: function (sord) {
    var me = this;
    if (me._parentMap && me.readParentMap && (me.readParentMap.length > 0)) {
      me.readParentMap.forEach(function (key) {
        me._parentMap.setValue(key + "." + sord.id, "");
      });
      me._parentMap.write();
    }
  }

});
