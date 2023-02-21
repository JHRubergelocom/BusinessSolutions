
//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.Map.js
//@include lib_sol.hr.shared.Utils.js


/**
 * Utility functions for hr file handling.
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 *
 * @requires sol.common.Config
 */
sol.define("sol.hr.Utils", {
  singleton: true,
  
  /**
   * Returns the objId of a user's personnel file
   * @param {String} userId ELO-Username
   * @param {Object} request
   * @param {Object} request.name   if defined && true, the function will also save the found sord's name in the passed request object's name property
   * @returns {String} objId of the found archive folder
   */
  getPathOfUsersPersonnelFile: function (userId, request) {
    var personnelFile;
    
    personnelFile = sol.common.IxUtils.execute("RF_sol_hr_service_GetUsersPersonnelFile", { userId: userId });

    if ((typeof request !== "undefined") && request.name) {
      request.name = (personnelFile.objId ? String(personnelFile.name).trim() : false);
    }

    return personnelFile.objId || "";
  },

  getPathOfUsersPersonnelFileByGuid: function (guid) {
    var personnelFile;
    
    personnelFile = sol.common.IxUtils.execute("RF_sol_hr_service_GetUsersPersonnelFile", { fileGuid: guid });

    return personnelFile || "";
  }
});
