
//@include lib_Class.js

/**
 * Helper functions for dynamic ad-hoc workflows
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 *
 * @requires sol.common.UserUtils
 * @requires sol.common.WfMap
 * @requires sol.common.MapTable
 */
sol.define("sol.common.ix.DynAdHocFlowUtils", {
  singleton: true,

  /**
   * @private
   */
  logger: sol.create("sol.Logger", { scope: "sol.common.ix.DynAdHocFlowUtils" }),

  /**
   * Creates a new routing
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Array} userEntries User entries
   * @param {Object} config Configuration
   * @param {String} config.userNameKey User name key
   * @param {String} config.userIdKey User ID key
   * @param {String} config.append Append users
   */
  createDynAdHocFlow: function (flowId, objId, userEntries, config) {
    var me = this,
        wfMapTable, userEntry, userNames, i, userName;

    if (!flowId) {
      throw "Flow ID is empty";
    }

    if (!objId) {
      throw "Object ID is empty";
    }

    if (!userEntries) {
      throw "User entries are empty";
    }

    config = config || {};
    config.reset = false;

    config = me.buildConfig(config);
    wfMapTable = me.loadTable(flowId, objId, !config.append, config);

    for (i = 0; i < userEntries.length; i++) {
      userEntry = userEntries[i];

      if (!userEntry.name) {
        continue;
      }

      try {
        userNames = ixConnect.ix().getUserNames([userEntry.name], CheckoutUsersC.BY_IDS_RAW);
      } catch (ex) {
        userNames = undefined;
      }

      if (!userNames || (userNames.length == 0)) {
        throw "User '" + userEntry.name + "' doesn't exist.";
      }

      userName = userNames[0];

      wfMapTable.appendRow();
      wfMapTable.setValue(config.userNameKey, userName.name);
      wfMapTable.setValue(config.userIdKey, userName.id);
      wfMapTable.setValue(config.mandatoryKey, userEntry.mandatory ? "1" : "0");
    }

    wfMapTable.write();
  },

  /**
   * Loads the routing table
   * @private
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Boolean} initEmpty
   * @param {Object} config Configuration
   * @param {Object} config.reset Reset iterator
   * @return {sol.common.MapTable}
   */
  loadTable: function (flowId, objId, initEmpty, config) {
    var wfMap, wfMapTable;

    if (!flowId) {
      throw "Flow ID is emtpy";
    }
    if (!objId) {
      throw "Object ID is empty";
    }
    if (!config) {
      throw "Configuration is empty";
    }

    config = config || {};
    config.reset = (config.reset == false) ? false : true;

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: objId });

    wfMapTable = sol.create("sol.common.MapTable", { map: wfMap, reset: config.reset, columnNames: [config.userNameKey, config.userIdKey, config.mandatoryKey], initEmpty: initEmpty });

    return wfMapTable;
  },

  /**
   * @private
   * Builds the DynAdHocFlow configuration
   * @param {Object} config Configuration
   * @return {Object} Complete configuration
   */
  buildConfig: function (config) {
    config = config || {};
    config.userNameKey = config.userNameKey || "USER";
    config.userIdKey = config.userNameKey + "_ID";
    config.mandatoryKey = config.userNameKey + "_MANDATORY";
    config.currentUserKey = config.currentUserKey || "CURRENT_USER";
    config.previousUserKey = config.previousUserKey || "PREVIOUS_USER";
    config.append = (config.append == true) ? true : false;
    return config;
  },

  /**
   * Returns the first user and removes the first row of the user table
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Object} config Configuration
   * @param {String} config.currentUserKey
   * @return {String} userName User name
   */
  shiftUser: function (flowId, objId, config) {
    var me = this,
        userName = "",
        wfMapTable, currentUser;

    if (!flowId) {
      throw "Flow ID is empty";
    }

    if (!objId) {
      throw "Object ID is empty";
    }

    config = me.buildConfig(config);

    wfMapTable = me.loadTable(flowId, objId, false, config);
    wfMapTable.map.read();

    currentUser = wfMapTable.map.getValue(config.currentUserKey);
    if (currentUser) {
      wfMapTable.map.setValue(config.currentUserKey, "");
      wfMapTable.map.write();
      return currentUser;
    }

    if (wfMapTable.hasNextRow()) {
      wfMapTable.nextRow();
      userName = wfMapTable.getValue(config.userNameKey);
      wfMapTable.shift();
    }
    wfMapTable.write();

    wfMapTable.map.setValue(config.currentUserKey, userName);
    wfMapTable.map.write();

    return userName;
  },

  /**
   * Checks whether there is a next user in the table
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Object} config Configuration
   * @param {String} config.userNameKey
   * @return {Boolean}
   */
  hasNextUser: function (flowId, objId, config) {
    var me = this,
        wfMapTable, userName;

    config = me.buildConfig(config);

    wfMapTable = me.loadTable(flowId, objId, false, config);
    if (wfMapTable.hasNextRow()) {
      wfMapTable.nextRow();
      userName = wfMapTable.getValue(config.userNameKey);
      if (userName) {
        return true;
      }
    }
    return false;
  },

  /**
   * Checks whether a current user is set
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Object} config Configuration
   * @param {String} config.currentUserKey
   * @return {Boolean}
   */
  hasCurrentUser: function (flowId, objId, config) {
    var me = this,
        wfMap, currentUser, hasCurrentUser;

    config = me.buildConfig(config);

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: objId });
    wfMap.read();
    currentUser = wfMap.getValue(config.currentUserKey);
    hasCurrentUser = !!currentUser;

    return hasCurrentUser;
  },

  /**
   * Clears the current user
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Object} config Configuration
   * @param {String} config.currentUserKey
   */
  clearCurrentUser: function (flowId, objId, config) {
    var me = this,
        wfMap, previousUserName;

    config = me.buildConfig(config);

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: objId });
    wfMap.read();
    previousUserName = wfMap.getValue(config.currentUserKey);
    wfMap.setValue(config.previousUserKey, previousUserName);
    wfMap.setValue(config.currentUserKey, "");
    wfMap.write();
  },

  /**
   * Sets the current user
   * @param {String} objId Object ID
   * @param {String} flowId Flow ID
   * @param {String} userName User name
   * @param {Object} config Configuration
   * @param {String} config.currentUserKey
   */
  setCurrentUser: function (objId, flowId, userName, config) {
    var me = this,
        wfMap;

    if (!flowId) {
      throw "Flow ID is empty";
    }

    if (!objId) {
      throw "Object ID is empty";
    }

    if (!userName) {
      throw "Username is empty";
    }

    config = me.buildConfig(config);

    wfMap = sol.create("sol.common.WfMap", { flowId: flowId, objId: objId });
    wfMap.setValue(config.currentUserKey, userName);
    wfMap.write();
  },

  /**
   * Back to previous user
   * @param {String} flowId Flow ID
   * @param {String} objId Object ID
   * @param {Object} config Configuration
   * @param {String} config.userNameKey User name key
   * @param {String} config.currentUserKey Current user key
   * @param {String} config.previousUserKey Previous user key
   */
  backToPreviousUser: function (flowId, objId, config) {
    var me = this,
        wfMapTable, currentUserName, previousUserName;

    config = me.buildConfig(config);

    wfMapTable = me.loadTable(flowId, objId, false, config);
    wfMapTable.map.read();

    previousUserName = wfMapTable.map.getValue(config.previousUserKey);
    if (previousUserName) {
      wfMapTable.insertRow();
      wfMapTable.nextRow();
      wfMapTable.setValue(config.userNameKey, previousUserName);
    }

    currentUserName = wfMapTable.map.getValue(config.currentUserKey);
    wfMapTable.insertRow();
    wfMapTable.nextRow();
    wfMapTable.setValue(config.userNameKey, currentUserName);
    wfMapTable.write();
  }
});
