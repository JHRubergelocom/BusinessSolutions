
//@include lib_Class.js

/**
 * Utility functions for process and circulation folder handling.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.StringUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.WfMap
 * @requires sol.common.AsyncUtils
 * @requires sol.common.AclUtils
 * @requires sol.common.Template
 * @requires sol.common.CounterUtils
 * @requires sol.pubsec.Utils
 */

sol.define("sol.pubsec.ix.ProcessUtils", {
  singleton: true,

  /**
   * Loads the configuration from the JSON file: `/Administration/Business Solutions/pubsec_process/Configuration/pubsec_proc.config`
   * @return {Object}
   */
  loadConfig: function () {
    return sol.create("sol.common.Config", { compose: "/pubsec_process/Configuration/pubsec_proc.config" }).config;
  },

  /**
   * Checks, if the `pubsec_process` package is installed
   * @return {Boolean}
   */
  isProcessesInstalled: function () {
    var me = this,
        cfg = me.loadConfig();
    return !!cfg;
  },

  /**
   * Searches the repository hierarchy to find the parent process (if there is any).
   * @param {String} objId
   * @return {de.elo.ix.client.Sord}
   */
  getParentProcess: function (objId) {
    var process = sol.common.RepoUtils.findObjectTypeInHierarchy(objId, [sol.pubsec.Utils.TYPES.PROCESS, sol.pubsec.Utils.TYPES.CIRCULATION_FOLDER]);
    return (process) ? process : null;
  },

  /**
   * Checks, if an element is a process, and if that process is in 'open' state
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isOpen: function (sord) {
    var me = this,
        processStatus, config;
    if (!me.isProcessesInstalled()) {
      return false;
    }
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    config = me.loadConfig();
    processStatus = sol.common.SordUtils.getObjKeyValue(sord, config.fields.processStatus) + "";
    return processStatus === config.process.status.open;
  },

  /**
   * Checks, if an element is a process, and if that process is in 'closed' state
   * @param {String|de.elo.ix.client.Sord} sord This can either be a objId or a Sord object
   * @return {Boolean}
   */
  isClosed: function (sord) {
    var me = this,
        processStatus, config;
    if (!me.isProcessesInstalled()) {
      return false;
    }
    if (!sol.common.SordUtils.isSord(sord)) {
      sord = ixConnect.ix().checkoutSord(sord, SordC.mbAllIndex, LockC.NO);
    }
    config = me.loadConfig();
    processStatus = sol.common.SordUtils.getObjKeyValue(sord, config.fields.processStatus) + "";
    return processStatus === config.process.status.closed;
  },

  /**
   * Retrieves the location where the circulation folders are stored.
   * Reads the localtion from the configuration: `circulationFolder.folderId`
   * @return {String}
   */
  getCirculationFolderArcpath: function () {
    var me = this;
    return me.loadConfig().circulationFolder.folderId;
  },

  /**
   * Creates a name for a circulation create workflow using the template from configuration: `circulationFolder.createWorkflowNameTemplate`.
   * @return {String}
   */
  getCirculationFolderName: function () {
    var me = this,
        nameTemplate = me.loadConfig().workflows.createCirculationFolder.workflowNameTemplate;

    return sol.create("sol.common.Template", { source: nameTemplate }).apply({ wfDate: new Date() });
  },

  /**
   * Creates a new circulation folder.
   * Uses mask from configuration: `circulationFolder.maskName`. Uses {@link #getCirculationFolderArcpath} to determine the location.
   * @param {String} name
   * @return {String} The objId of the new folder
   */
  createCirculationFolder: function (name) {
    var me = this,
        maskName, target;

    maskName = me.loadConfig().circulationFolder.maskName;
    target = me.getCirculationFolderArcpath();

    return sol.pubsec.Utils.createFolder(target, maskName, name);
  },

  /**
   * Checks, if the routines will be stored or in the map (as BLOB) or in a separate object.
   *
   * If `routine.forceExternalElement` is `true` the use of an external element for routine storage will be forced.
   * Otherwise the function will check the IX version:
   *
   * - versions older than `10.00.020.007` will use an external element
   * - versions newer than `10.00.020.007` will use the BLOB map
   *
   * @return {Boolean} `true` if the routine will be stored in the BLOB map of an object
   */
  useMapForRoutines: function () {
    var me = this;
    if (typeof me.$useMapForRoutines === "undefined") {
      if (me.loadConfig().routine.forceExternalElement) {
        me.$useMapForRoutines = false;
      } else {
        me.$useMapForRoutines = sol.common.RepoUtils.checkVersion(ixConnect.implVersion, "10.00.020.007");
      }
    }
    return me.$useMapForRoutines;
  },

  /**
   * Increments the count of current signings on the process.
   * @param {String|de.elo.ix.client.Sord} process Can either be an objId or a Sord
   */
  incrementSigningCounter: function (process) {
    var me = this;
    me.updateSigningCounter(process, true);
  },

  /**
   * Decrements the count of current signings on the process.
   * @param {String|de.elo.ix.client.Sord} process Can either be an objId or a Sord
   */
  decrementSigningCounter: function (process) {
    var me = this;
    me.updateSigningCounter(process, false);
  },

  /**
   * Retrieves the number of current signings on the process.
   * @param {String|de.elo.ix.client.Sord} process Can either be an objId or a Sord
   * @return {String}
   */
  getSigningCount: function (process) {
    if (!sol.common.SordUtils.isSord(process)) {
      process = sol.common.RepoUtils.getSord(process);
    }
    return sol.common.SordUtils.getObjKeyValueAsNumber(process, "ROUTINE_COUNT");
  },

  /**
   * @private
   * Decrements the count of current signings on the process.
   * @param {String|de.elo.ix.client.Sord} process Can either be an objId or a Sord
   * @param {Boolean} inc If `true`, the counter will be incremented, else it will be decremented
   */
  updateSigningCounter: function (process, inc) {
    var me = this,
        conf = me.loadConfig(),
        signingCount;

    if (!sol.common.SordUtils.isSord(process)) {
      process = sol.common.RepoUtils.getSord(process);
    }

    signingCount = me.getSigningCount(process);

    if (inc === true) {
      if (signingCount === 0) {
        sol.common.IxUtils.execute("RF_sol_function_ChangeColor", { objId: process.id, save: conf.mapFields.signingPreviousColor, color: conf.signing.activeColor });
      }
      signingCount += 1;
    } else {
      signingCount -= 1;
      if (signingCount <= 0) {
        sol.common.IxUtils.execute("RF_sol_function_ChangeColor", { objId: process.id, restore: conf.mapFields.signingPreviousColor });
      }
    }

    process = sol.common.RepoUtils.getSord(process.id);
    sol.common.SordUtils.setObjKeyValue(process, "ROUTINE_COUNT", signingCount);
    ixConnectAdmin.ix().checkinSord(process, SordC.mbAllIndex, LockC.NO);
  },

  /**
   * Retrieves the routine id from a wf or sord map.
   *
   * If the routine id is read from a sord map (no flow id defined), the map field will be deleted (cleanup because the sord map entries are only temporary for the wf start).
   * @param {String} objId
   * @param {String} flowId
   * @param {Number} defaultReturnValue This will be returned if there is nothing found
   * @return {Number} Returns `default` if there is no routine id defined in workflow or sord
   */
  retrieveCurrentRoutineIdFromWorkflowOrSord: function (objId, flowId, defaultReturnValue) {
    var me = this,
        mapKey, mapClass, map, routineId;

    mapKey = me.getMapKeyForRoutineId(flowId);
    mapClass = (flowId !== undefined) ? "sol.common.WfMap" : "sol.common.SordMap";

    map = sol.create(mapClass, {
      objId: objId,
      flowId: flowId
    });

    map.read([mapKey]);
    routineId = map.getValue(mapKey);

    return (routineId && !isNaN(+routineId)) ? +routineId : defaultReturnValue;
  },

  /**
   * Moves the routine id from the temporary sord map field to the workflow map for future use.
   * @param {String} objId
   * @param {String} flowId
   */
  moveRoutineIdToFlow: function (objId, flowId) {
    var me = this,
        sordMapKey, sordMap, routineId, wfMap;

    sordMapKey = me.getMapKeyForRoutineId();
    sordMap = sol.create("sol.common.SordMap", {
      objId: objId
    });
    sordMap.read([sordMapKey]);

    routineId = sordMap.getNumValue(sordMapKey);

    if (routineId || routineId === 0) {
      sordMap.setValue(sordMapKey, "");
      sordMap.write();

      wfMap = sol.create("sol.common.WfMap", {
        objId: objId,
        flowId: flowId
      });
      wfMap.setNumValue(me.getMapKeyForRoutineId(flowId), routineId);
      wfMap.write();
    }
  },

  /**
   * Builds the map key for the routine id storage
   * @param {String} flowId
   * @return {String}
   */
  getMapKeyForRoutineId: function (flowId) {
    var me = this,
        cfg = me.loadConfig(),
        id;

    id = (flowId !== undefined) ? flowId : ixConnect.loginResult.user.id;

    return cfg.mapFields.routineId + "_" + id;
  },

  /**
   * Checks if a routine step is not yet finished.
   * @param {Object} step
   * @return {Boolean}
   */
  isNotDone: function (step) {
    return !step.done || (step.done === "");
  },

  /**
   * Checks if a routine step is currently active.
   * @param {Object} step
   * @return {Boolean}
   */
  isActive: function (step) {
    var me = this;
    return step.activated && (step.activated !== "") && me.isNotDone(step);
  }

});
