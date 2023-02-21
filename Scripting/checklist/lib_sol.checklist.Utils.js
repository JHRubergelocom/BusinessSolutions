
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 * Checklist utilities.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloall
 *
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 */
sol.define("sol.checklist.Utils", {
  singleton: true,

  /**
   * Loads (and merges) the checklist configuration from the JSON file: `/Administration/Business Solutions/checklist/Configuration/checklist.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/checklist/Configuration/checklist.config" }).config;
  },

  /**
   * Checks, if an element is a checklist
   * @param {String|de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isChecklist: function (sord) {
    var me = this,
        solType;

    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    solType = sol.common.SordUtils.getObjKeyValue(sord, "SOL_TYPE");
    return solType == me.loadConfig().checklist.solObjectType;
  },

  /**
   * Retrieves the next available id for a checklist item.
   * @param {Object} checklist
   * @return {Number}
   */
  getNextId: function (checklist) {
    var max = 0;
    if (checklist && checklist.items && (checklist.items.length > 0)) {
      checklist.items.forEach(function (item) {
        var id = item.id;
        if (id > max) {
          max = id;
        }
      });
      return max + 1;
    }
    return 1;
  }

});
