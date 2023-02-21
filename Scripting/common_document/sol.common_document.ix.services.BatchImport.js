
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_document.BatchImportData.js

var logger = sol.create("sol.Logger", { scope: "sol.common_document.ix.services.BatchImport" });

/**
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloix
 * @requires  sol.common.Config
 * @requires  sol.common.IxUtils
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.StringUtils
 * @requires  sol.common.DateUtils
 * @requires  sol.common.ix.ServiceBase
 * @requires  sol.common_document.BatchImportData
 */
sol.define("sol.common_document.ix.services.BatchImport", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   */

  /**
   * @cfg {Object} header
   */

  /**
   * @cfg {Object} data
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.statusProvider = sol.create("sol.common_document.BatchImportStatus", {
      objId: me.objId
    });
  },

  run: function () {
    var me = this,
        dirty = false,
        dataProvider, header, service, currentRow, currentServiceData, exceptionDetails;

    dataProvider = sol.create("sol.common_document.BatchImportData", { sourceId: me.objId });
    header = dataProvider.getHeader();
    service = dataProvider.getConfig().service;

    me.statusProvider.start(dataProvider.getExecutionRowCount());

    while (dataProvider.hasNext() && !me.statusProvider.isStopping(me.statusProvider.getStatus())) {
      currentRow = dataProvider.next();

      if (dataProvider.shouldExecute(currentRow)) {
        try {
          currentServiceData = me.prepareServiceData(header, currentRow);

          me.callService(service.fct, currentServiceData.tplSord, currentServiceData.serviceConfig);

          currentRow.status = sol.common_document.BatchImportConst.STATUS.finished;
          dirty = true;
        } catch (ex) {
          me.logger.warn("Error importing dataset", ex);
          exceptionDetails = me.getExceptionDetails(ex);
          currentRow.status = exceptionDetails.status;
          currentRow.errorMsg = exceptionDetails.msg;
          dirty = true;
        } finally {
          me.statusProvider.proceed();
        }
      }
    }

    if (dirty) {
      dataProvider.save();
    }

    me.statusProvider.stop();
  },

  /*
   * @private
   */
  prepareServiceData: function (header, row) {
    var me = this,
        tplSord, serviceConfig, columnIdx, currentHeader, currentValue, currentMapping, value;

    tplSord = {
      objKeys: {},
      mapKeys: {}
    };

    serviceConfig = {};

    for (columnIdx = 0; columnIdx < header.length; columnIdx++) {
      currentHeader = header[columnIdx];
      currentValue = row.columns[columnIdx];
      currentMapping = currentHeader.mapping;

      if (!currentMapping || !currentMapping.key || (currentMapping.key === "---")) {
        continue;
      }

      me.validateValue(currentHeader, currentValue);
      value = me.convertValue(currentHeader, currentValue);

      switch (currentMapping.type) {
        case "GRP":
          tplSord.objKeys[currentMapping.key] = value;
          break;
        case "MAP":
          tplSord.mapKeys[currentMapping.key] = value;
          break;
        case "CONFIG":
          me.enhanceConfig(serviceConfig, currentMapping.key, currentValue);
          break;
        default:
          throw "IllegalArgumentException: error in mapping definition: type='" + currentMapping.type + "'";
      }
    }

    return {
      tplSord: tplSord,
      serviceConfig: serviceConfig
    };
  },

  /*
   * @privat
   */
  getExceptionDetails: function (ex) {
    var exStr, status, msg;

    exStr = String(ex);
    if ((exStr.indexOf("[VALIDATION]") === 0) || (exStr.indexOf("[CONVERSION]") === 0)) {
      status = sol.common_document.BatchImportConst.STATUS.invalid;
      msg = exStr.substring(13, exStr.length);
    } else {
      status = sol.common_document.BatchImportConst.STATUS.error;
      msg = exStr;
    }

    return {
      status: status,
      msg: msg
    };
  },

  /**
   * @private
   * Validates a value using the corresponding definition from the header.
   * @param {Object} headerDef
   * @param {String} value
   */
  validateValue: function (headerDef, value) {
    var me = this;

    if (headerDef && headerDef.validators && (headerDef.validators.length > 0)) {
      headerDef.validators.forEach(function (validator) {
        var validateFunction = me.validatorFunctions[validator.type.toLowerCase()];

        if (validateFunction && sol.common.ObjectUtils.isFunction(validateFunction)) {
          validateFunction.call(me, headerDef, validator, value);
        }
      });
    }
  },

  /**
   * @private
   * Converts a value using the corresponding definition from the header.
   * @param {Object} headerDef
   * @param {String} value
   * @returns {String}
   */
  convertValue: function (headerDef, value) {
    var me = this;

    if (headerDef && headerDef.converter && (headerDef.converter.length > 0)) {
      headerDef.converter.forEach(function (converter) {
        var convertFunction = me.converterFunctions[converter.type.toLowerCase()];

        if (convertFunction && sol.common.ObjectUtils.isFunction(convertFunction)) {
          value = convertFunction.call(me, headerDef, converter, value);
        }
      });
    }

    return value;
  },

  /* @private */
  enhanceConfig: function (serviceConfig, key, value) {
    var me = this,
        current;

    if (typeof key === "string") {
      key = key.split(".");
    }

    if (key.length > 1) {
      current = key.shift();
      serviceConfig[current] = serviceConfig[current] || {};
      me.enhanceConfig(serviceConfig[current], key, value);
    } else {
      serviceConfig[key[0]] = value;
    }
  },

  validatorFunctions: {

    /**
     * @private
     * Validates that a value is not empty/blank.
     * @param {Object} header
     * @param {Object} cfg
     * @param {String} value
     */
    notempty: function (header, cfg, value) {
      if (sol.common.StringUtils.isBlank(value)) {
        throw "[VALIDATION] Field '" + header.mapping.key + "' (type=" + header.mapping.type + ") can not be empty";
      }
    }

  },

  converterFunctions: {

    /**
     * @private
     * Converts a String value to an ISO date for ELO date fields.
     * @param {Object} header
     * @param {Object} cfg
     * @param {String} value
     * @returns {String}
     */
    date: function (header, cfg, value) {
      var date;
      if (cfg && cfg.pattern && value) {
        date = sol.common.DateUtils.parse(value, cfg.pattern);
      }
      if (value && !date) {
        throw "[CONVERSION] Could not convert '" + value + "' to an ISO date using pattern '" + cfg.pattern + "'";
      }
      return (date) ? sol.common.DateUtils.dateToIso(date) : "";
    }

  },

  /*
   * @private
   */
  callService: function (serviceName, tplSord, config) {
    config = config || {};

    config.template = config.template || {};
    config.template.name = config.template.name || "Default";

    config.sordMetadata = tplSord;

    sol.common.IxUtils.execute(serviceName, config);
  },

  readData: function () {
    var me = this,
        dataProvider, result;

    dataProvider = sol.create("sol.common_document.BatchImportData", { sourceId: me.objId });

    result = {
      header: dataProvider.getHeader(),
      data: dataProvider.getRows(),
      config: dataProvider.getConfig(),
      lastModified: dataProvider.getLastModified()
    };

    return result;
  },

  updateData: function () {
    var me = this,
        dataProvider;

    dataProvider = sol.create("sol.common_document.BatchImportData", {
      sourceId: me.objId,
      sourceData: me.data,
      header: me.header,
      config: me.config
    });

    dataProvider.save(true);
  }

});

/**
 * @member sol.common_document.ix.services.BatchImport
 * @method RF_sol_common_document_service_BatchImport_Run
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_BatchImport_Run(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_common_document_service_BatchImport_Run", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.common_document.ix.services.BatchImport", params);
  result = service.run();

  logger.exit("RF_sol_common_document_service_BatchImport_Run", result);

  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common_document.ix.services.BatchImport
 * @method RF_sol_common_document_service_BatchImport_Read
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_BatchImport_Read(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_common_document_service_BatchImport_Read", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.common_document.ix.services.BatchImport", params);
  result = service.readData();

  logger.exit("RF_sol_common_document_service_BatchImport_Read", result);

  return sol.common.JsonUtils.stringifyAll(result);
}

/**
 * @member sol.common_document.ix.services.BatchImport
 * @method RF_sol_common_document_service_BatchImport_Update
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_document_service_BatchImport_Update(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_common_document_service_BatchImport_Update", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId", "header", "data", "config");
  service = sol.create("sol.common_document.ix.services.BatchImport", params);
  result = service.updateData();

  logger.exit("RF_sol_common_document_service_BatchImport_Update", result);

  return sol.common.JsonUtils.stringifyAll(result);
}
