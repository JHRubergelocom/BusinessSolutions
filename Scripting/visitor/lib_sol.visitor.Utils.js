
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Visitor management utilities
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 */
sol.define("sol.visitor.Utils", {
  singleton: true,

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/visitor/Configuration/visitor.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/visitor/Configuration/visitor.config" }).config;
  },

  /**
   * Checks, if an element is from type visitor
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isVisitor: function (sord) {
    var me = this,
        solType;

    solType = String(sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE") || "");

    return sol.common.SordUtils.isSord(sord) && (me.loadConfig().visitor.typeOfVisitors.indexOf(solType) > -1);
  },

  /**
   * Searches the repository hierarchy to find the parent visitor (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentVisitor: function (objId) {
    var me = this,
        sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO),
        isVisitor = me.isVisitor(sord);

    if (!isVisitor && sord.id !== 1) {
      return me.getParentVisitor(sord.parentId);
    }
    return (isVisitor) ? sord : null;
  }

});
