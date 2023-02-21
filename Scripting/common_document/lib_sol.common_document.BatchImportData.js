
//@include lib_Class.js

sol.define("sol.common_document.BatchImportConst", {
  singleton: true,

  LASTMODIFIED_KEY: "SOL_BATCHIMPORT_LASTMODIFIED",

  STATUS: {
    new: "NEW",
    invalid: "INVALID",
    error: "ERROR",
    finished: "FINISHED"
  },

  RUN_STATUS: {
    idle: "IDLE",
    running: "RUNNING",
    stopping: "STOPPING"
  },

  extractMapValue: function (entry) {
    var value = null;
    if (entry) {
      if (entry.blobValue && entry.blobValue.stream) {
        value = JSON.parse(Packages.org.apache.commons.io.IOUtils.toString(entry.blobValue.stream, java.nio.charset.StandardCharsets.UTF_8));
        entry.blobValue.stream.close();
      } else {
        value = entry.value;
      }
    }
    return value;
  },

  createMapValue: function (key, data) {
    var blobData, mapValue;
    blobData = JSON.stringify(data);
    blobData = new java.lang.String(blobData).getBytes(java.nio.charset.StandardCharsets.UTF_8);
    mapValue = new MapValue(key, "text", blobData);
    return mapValue;
  }

});

/**
 * Wrapper for batch import data.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.04.000
 *
 * @eloix
 * @eloas
 * @elojc
 * @requires sol.common.ObjectUtils
 */
sol.define("sol.common_document.BatchImportData", {

  /**
   * @cfg {String[]|Object[]} header
   * If set, this will be used as a header.
   * If not it will be assumed, that the data contains the header as first row.
   */

  /**
   * @cfg {String} sourceId
   */

  /**
   * @cfg {Array[]} sourceData
   */

  /**
   * @cfg {Object} parser
   */

  /**
   * @cfg {Boolean} [forceReloadFromSource=false]
   */

  MAP_PREFIX: "SOL_BATCHIMPORT_",
  CONFIG_KEY: "SOL_BATCHIMPORT_CONFIG",
  HEADER_KEY: "SOL_BATCHIMPORT_HEADER",
  DATA_KEY: "SOL_BATCHIMPORT_DATA",

  currentIdx: -1,
  current: null,

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);

    if (!me.sourceId && !me.sourceData) {
      throw "at least 'sourceId' or 'sourceData' has to be defined";
    }

    if (me.sourceId) {
      me.sourceId = ixConnect.ix().checkoutSord(me.sourceId, SordC.mbOnlyId, LockC.NO).id;
    }

    me.setConfig(config.config);
    me.setHeader(config.header);
    me.dataContainsHeader = !config.header;

    me.importStatus = sol.create("sol.common_document.BatchImportStatus", { objId: me.sourceId });

    me.loadData();
  },

  getLastModified: function () {
    var me = this;
    return me.$lastModified;
  },

  setLastModified: function (timestamp) {
    var me = this;
    me.$lastModified = timestamp;
  },

  getHeader: function () {
    var me = this;
    return me.$header;
  },

  setHeader: function (headers) {
    var me = this,
        preparedHeaders = [];

    if (headers && (headers.length > 0)) {
      headers.forEach(function (header) {
        header = (sol.common.ObjectUtils.isObject(header)) ? header : me.createNewHeaderEntry(header);
        preparedHeaders.push(header);
      });
    }

    me.$header = preparedHeaders;
  },

  getConfig: function () {
    var me = this;
    return me.$config;
  },

  setConfig: function (config) {
    var me = this;
    me.$config = config;
  },

  clear: function () {
    var me = this;
    me.$data = [];
  },

  reset: function () {
    var me = this;
    me.currentIdx = -1;
    me.current = null;
  },

  hasNext: function () {
    var me = this;
    return !!me.$data[me.currentIdx + 1];
  },

  next: function () {
    var me = this;
    me.currentIdx++;
    me.current = me.$data[me.currentIdx];
    return me.current;
  },

  getRows: function () {
    var me = this;
    return me.$data;
  },

  getRowCount: function () {
    var me = this;
    return (me.$data) ? me.$data.length : 0;
  },

  getExecutionRowCount: function () {
    var me = this,
        count = 0;

    if (me.$data && (me.$data.length > 0)) {
      me.$data.forEach(function (row) {
        if (me.shouldExecute(row)) {
          count++;
        }
      });
    }

    return count;
  },

  shouldExecute: function (row) {
    return ((row.execute === true) && (row.status === sol.common_document.BatchImportConst.STATUS.new));
  },

  loadData: function () {
    var me = this,
        importFile, fileExtension;

    me.clear();

    if (me.sourceData) {
      me.prepareData(me.sourceData);
    } else if (me.sourceId) {
      if (me.forceReloadFromSource !== true) {
        me.loadFromMap();
      }

      if (!me.isDataLoaded()) {
        importFile = ixConnect.ix().checkoutSord(me.sourceId, EditInfoC.mbSordDocAtt, LockC.NO).sord;
        fileExtension = String(importFile.docVersion.ext.toLowerCase());

        if (!sol.common.ObjectUtils.isFunction(me.parser.supportsFileType)) {
          throw "parser has to define a 'supportsFileType' function";
        }
        if (!sol.common.ObjectUtils.isFunction(me.parser.parse)) {
          throw "parser has to define a 'parse' function";
        }
        if (!me.parser.supportsFileType(fileExtension)) {
          throw "parser does not support '" + fileExtension + "'";
        }

        me.prepareData(me.parser.parse(me.sourceId));
      }
    }
  },

  save: function () {
    var me = this,
        cfg = me.getConfig(),
        header = me.getHeader(),
        data = me.getRows(),
        mapitems = [];

    if (!me.sourceId || !data || (data.length <= 0)) {
      return;
    }

    if (me.importStatus.isRunning(me.importStatus.getStatus())) {
      throw "Can't save as long as process is running";
    }

    if (cfg) {
      mapitems.push(sol.common_document.BatchImportConst.createMapValue(me.CONFIG_KEY, cfg));
    }

    if (header) {
      mapitems.push(sol.common_document.BatchImportConst.createMapValue(me.HEADER_KEY, header));
    }

    if (data && (data.length > 0)) {
      mapitems.push(sol.common_document.BatchImportConst.createMapValue(me.DATA_KEY, data));
    }

    if (mapitems.length > 0) {
      mapitems.push(new KeyValue(sol.common_document.BatchImportConst.LASTMODIFIED_KEY, sol.common.DateUtils.nowIso()));
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.sourceId, me.sourceId, mapitems, LockC.NO);
    }
  },

  /*
   * @private
   */
  prepareData: function (data) {
    var me = this;

    if (me.dataContainsHeader && data && (data.length > 0)) {
      me.setHeader(data.shift());
    }

    if (data && (data.length > 0)) {
      data.forEach(me.put, me);
    }
  },

  /*
   * @private
   */
  isDataLoaded: function () {
    var me = this,
        data;
    data = me.getRows();
    return data && (data.length > 0);
  },

  /*
   * @private
   */
  setData: function (data) {
    var me = this;
    me.$data = data;
  },

  /*
   * @private
   */
  put: function (row) {
    var me = this;
    if (!me.$data) {
      me.$data = [];
    }
    row = (sol.common.ObjectUtils.isArray(row)) ? me.createNewRow(row) : row;
    me.$data.push(row);
  },

  /*
   * @private
   */
  createNewHeaderEntry: function (title) {
    return {
      title: title,
      mapping: { type: "GRP", key: "---" },
      converter: null
    };
  },

  /*
   * @private
   */
  createNewRow: function (rowData) {
    var me = this,
        isValid, status;

    isValid = me.validateRow(rowData);
    status = (isValid) ? sol.common_document.BatchImportConst.STATUS.new : sol.common_document.BatchImportConst.STATUS.invalid;

    return {
      status: status,
      execute: false,
      columns: rowData
    };
  },

  /*
   * @private
   */
  validateRow: function (row) {
    var me = this;
    return (me.getHeader().length === row.length);
  },

  /*
   * @private
   */
  loadFromMap: function () {
    var me = this,
        mapitems, entries, entryIterator, entry, key, value;

    if (!me.sourceId) {
      return;
    }

    mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.sourceId, [me.MAP_PREFIX + "*"], LockC.NO).mapItems;

    if (mapitems && (mapitems.size() > 0)) {
      entries = mapitems.entrySet();
      entryIterator = entries.iterator();

      while (entryIterator.hasNext()) {
        entry = entryIterator.next();
        key = String(entry.key);
        value = sol.common_document.BatchImportConst.extractMapValue(entry.value);

        switch (key) {
          case me.CONFIG_KEY:
            me.setConfig(value);
            break;
          case me.HEADER_KEY:
            me.setHeader(value);
            break;
          case me.DATA_KEY:
            me.setData(value);
            break;
          case sol.common_document.BatchImportConst.LASTMODIFIED_KEY:
            me.setLastModified(value);
            break;
          default:
            break;
        }
      }
    }
  }

});


/**
 * Wrapper for batch import status.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @eloas
 * @elojc
 * @requires sol.common.ObjectUtils
 */
sol.define("sol.common_document.BatchImportStatus", {

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId
   */

  STATUS_KEY: "SOL_BATCHIMPORT_STATUS",

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);

    me.objId = ixConnect.ix().checkoutSord(me.objId, SordC.mbOnlyId, LockC.NO).id;
  },

  getStatus: function () {
    var me = this,
        mapitems, statusObj, lastModified;

    // TODO internal, temporary status cache

    mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, me.objId, [me.STATUS_KEY, sol.common_document.BatchImportConst.LASTMODIFIED_KEY], LockC.NO).mapItems;

    if (mapitems && (mapitems.size() > 0)) {
      statusObj = sol.common_document.BatchImportConst.extractMapValue(mapitems.get(me.STATUS_KEY));
      lastModified = sol.common_document.BatchImportConst.extractMapValue(mapitems.get(sol.common_document.BatchImportConst.LASTMODIFIED_KEY));
    }

    if (!statusObj) {
      statusObj = me.initStatus();
      me.saveStatus(statusObj);
    }

    statusObj.lastModified = lastModified;

    return statusObj;
  },

  isRunning: function (statusObj) {
    // TODO should use internal state
    return (statusObj.status === sol.common_document.BatchImportConst.RUN_STATUS.running);
  },

  isStopping: function (statusObj) {
    // TODO should use internal state
    return (statusObj.status === sol.common_document.BatchImportConst.RUN_STATUS.stopping);
  },

  start: function (total) {
    var me = this,
        statusObj;

    statusObj = me.getStatus();

    if (me.isRunning(statusObj)) {
      throw "Already running";
    }

    statusObj.status = sol.common_document.BatchImportConst.RUN_STATUS.running;
    statusObj.progress = { done: 0, total: total };

    me.saveStatus(statusObj);

    return statusObj;
  },

  stop: function () {
    var me = this,
        statusObj;

    statusObj = me.initStatus();

    me.saveStatus(statusObj);
  },

  proceed: function (count) {
    var me = this,
        statusObj;

    statusObj = me.getStatus();

    if (me.isStopping(statusObj)) {
      return statusObj;
    }

    if (!me.isRunning(statusObj)) {
      throw "Not started yet";
    }

    count = (typeof count === "number") ? count : 1;

    statusObj.progress.done += count;

    if (statusObj.progress.done >= statusObj.progress.total) {
      statusObj = me.initStatus();
    }

    me.saveStatus(statusObj);

    return statusObj;
  },

  setStopFlag: function () {
    var me = this,
        statusObj;

    statusObj = { status: sol.common_document.BatchImportConst.RUN_STATUS.stopping };

    me.saveStatus(statusObj);
  },

  /* internal */
  initStatus: function () {
    var statusObj;

    statusObj = {
      status: sol.common_document.BatchImportConst.RUN_STATUS.idle
    };

    return statusObj;
  },

  /* internal */
  saveStatus: function (statusObj) {
    var me = this;
    delete statusObj.lastModified;
    ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, me.objId, me.objId, [sol.common_document.BatchImportConst.createMapValue(me.STATUS_KEY, statusObj)], LockC.NO);
  }

});
