
//@include lib_Class.js

/**
 * Utility functions for file handling.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.pubsec.Utils
 */
sol.define("sol.pubsec.ix.FileUtils", {
  singleton: true,
  
  /**
   * Checks, if an element is a file, and if that file is in 'open' state
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isOpen: function (sord) {
    var fileStatus, config;
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    config = sol.pubsec.Utils.loadConfig();
    fileStatus = sol.common.SordUtils.getObjKeyValue(sord, config.fields.fileStatus) + "";
    return fileStatus === config.file.status.open;
  },
  
  /**
   * Checks, if an element is a file, and if that file is in 'closed' state
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isClosed: function (sord) {
    var fileStatus, config;
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    config = sol.pubsec.Utils.loadConfig();
    fileStatus = sol.common.SordUtils.getObjKeyValue(sord, config.fields.fileStatus) + "";
    return fileStatus === config.file.status.closed;
  },
  
  /**
   * This method returns a file or a filing plan element, if object is inside one of those.
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @param {Object} params (optional)
   * @param {Boolean} [params.inclSelf=false] (optional) The check starts with the element (`sord` parameter) itself
   * @return {de.elo.ix.client.Sord}
   */
  findLegalParent: function (sord, params) {
    var me = this,
        parentSord, isFilingPlan, isFilingPlanStruct, isFile;
    
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    
    parentSord = ixConnect.ix().checkoutSord((params && (params.inclSelf === true)) ? sord.id : sord.parentId, SordC.mbAllIndex, LockC.NO);
    isFilingPlan = sol.pubsec.Utils.isFilingPlan(parentSord);
    isFilingPlanStruct = sol.pubsec.Utils.isFilingPlanStructure(parentSord);
    isFile = sol.pubsec.Utils.isFile(parentSord);
    
    if (!isFile && !isFilingPlan && !isFilingPlanStruct && (parentSord.id > 1)) { // search the hierarchy until a file or a filing plan is found, stop search on archive root
      return me.findLegalParent(parentSord.parentId, { inclSelf: true });
    }
    return (isFile || isFilingPlan || isFilingPlanStruct) ? parentSord : null;
  }
  
});
