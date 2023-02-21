
//@include lib_Class.js

/**
 * Contains the datev export functions used by the Rule
 *
 * <b>Only ELOas</b>
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.invoice_datev.as.Utils
 * @requires  sol.invoice_datev.as.export.HtmlLog
 *
 * @eloas
 *
 * Sample node configuration:
 *
 *     {
 *       "$directRule": "sol.invoice_datev.Export",
 *       "returnHtml": false
 *     }
 */
sol.define("sol.invoice_datev.as.functions.Export", {
  extend: "sol.common.as.FunctionBase",

  /**
   * @cfg [returnHtml=true]
   * Return a HTML result page
   */

  /**
   * @cfg [batch=true]
   * Batch export
   */

  /**
   * Run datev export
   * @param {String} strGuids Guids of selected invoices or null (all invoices)
   * @param {String} strLanguage localisation language
   * @return {String} contentHTML content of HTML-Logfile
   */
  process: function () {
    var me = this,
        sordInvoices, contentHTML, logger, contentString;

    logger = sol.create("sol.Logger", { scope: this.$className });
    logger.enter("process");

    if (!me.objIds && me.objId) {
      me.objIds = [me.objId];
    }

    logger.info(["process(guids={0}, language={1})", me.objIds, me.language]);

    me.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();

    sordInvoices = [];
    if (me.language) {
      me.invoiceDatevConfig.Parameter.DefaultLanguage = me.language;
    }
    sol.invoice_datev.as.Utils.setContentTextsDatevMappingBelege();

    if (me.objIds) {
      sordInvoices = sol.common.RepoUtils.getSords(me.objIds);
    } else if (me.batch) {
      sordInvoices = me.readInvoices();
    }

    contentHTML = me.exportInvoices(sordInvoices);

    logger.exit("process", contentHTML);

    if (me.returnHtml != false) {
      contentString = new java.lang.String(contentHTML);
    } else {
      contentString = JSON.stringify({ passOn: true });
    }
    return contentString;
  },

  /**
   * Reads all invoices that need to be exported.
   * Invoice status must be as defined by the config->StatusBeforeExport.
   * @return {Object[]}  invoices represented by de.elo.ix.client.Sord
   */
  readInvoices: function () {
    var me = this,
        sordInvoices, arcPathInvoice, maskId,
        objKeysObj = {};

    sordInvoices = [];
    arcPathInvoice = me.invoiceDatevConfig.Parameter.ArcPathInvoice;
    if (sol.common.RepoUtils.exists(arcPathInvoice)) {

      maskId = ixConnect.ix().checkoutDocMask(me.invoiceDatevConfig.Parameter.MaskName, DocMaskC.mbAll, LockC.NO).id;

      objKeysObj[me.invoiceDatevConfig.Parameter.StatusFieldGrpName] = me.invoiceDatevConfig.Parameter.StatusBeforeExport;

      sordInvoices = sol.common.RepoUtils.findChildren(arcPathInvoice, { maskId: maskId, objKeysObj: objKeysObj, recursive: true, level: 32 });
    }
    return sordInvoices;
  },

  /**
   * Execute export invoices
   * @param {Object[]} sordInvoices list of invoices that should be exported represented by de.elo.ix.client.Sord
   * @return {String} contentHTML content of HTML-Logfile
   */
  exportInvoices: function (sordInvoices) {
    var me = this,
        arcPathDatevExport, contentHTML, timeDateJava, datevFileName, datevFileContent, datevFileLine,
        keyFieldName, column, row, correctDataSets, boolDataSetOkay, sord, actMapEntry, objKey,
        logFileTableMessages, logFileTableDataSets, i, windowsPathDatevExport, mapItems, k, fieldCount,
        logger;

    logger = sol.create("sol.Logger", { scope: this.$className });
    logger.enter("exportInvoices");
    logger.info(["exportInvoices(sordInvoices = {0})", sordInvoices]);


    arcPathDatevExport = me.invoiceDatevConfig.Parameter.ArcPathDatev;
    contentHTML = "HTML-Log empty";

    sol.common.RepoUtils.preparePath(arcPathDatevExport);

    if (sol.common.RepoUtils.getObjId(arcPathDatevExport)) {
      timeDateJava = new java.util.Date();
      datevFileName = "DATEV_" + sol.common.DateUtils.nowIso();
      datevFileContent = [];
      datevFileLine = [];
      for (keyFieldName in me.invoiceDatevConfig.MappingBelege) {
        datevFileLine.push("\"" + keyFieldName + "\"");
      }
      datevFileContent.push(datevFileLine.join(";") + ";");
      logFileTableMessages = [];
      me.writeExportReport(logFileTableMessages,
        sol.invoice_datev.as.Utils.getLanguageText("Line"),
        sol.invoice_datev.as.Utils.getLanguageText("Column"),
        sol.invoice_datev.as.Utils.getLanguageText("DATEVFieldName"),
        sol.invoice_datev.as.Utils.getLanguageText("DATEVFieldContent"),
        sol.invoice_datev.as.Utils.getLanguageText("Message"),
        sol.invoice_datev.as.Utils.getLanguageText("ELODocument"),
        sol.invoice_datev.as.Utils.getLanguageText("ELOFieldName"),
        sol.invoice_datev.as.Utils.getLanguageText("ELOGroup"),
        sol.invoice_datev.as.Utils.getLanguageText("ELOData"),
        sol.invoice_datev.as.Utils.getLanguageText("ELOGuid"));
      logFileTableDataSets = [];
      if (sordInvoices.length > 0) {
        sord = ixConnect.ix().checkoutSord(sordInvoices[0].id, EditInfoC.mbAll, LockC.NO).sord;
        me.writeDataSet(logFileTableDataSets, sord, true);
      }
      row = 0;
      correctDataSets = 0;
      for (i = 0; i < sordInvoices.length; i++) {
        sord = ixConnect.ix().checkoutSord(sordInvoices[i].id, EditInfoC.mbAll, LockC.NO).sord;
        // get map fields of sord
        mapItems = null;
        mapItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, sord.id, null, LockC.NO).items;
        datevFileLine = [];
        column = 1;
        row += 1;
        boolDataSetOkay = true;

        fieldCount = Object.keys(me.invoiceDatevConfig.MappingBelege).length;
        datevFileLine = new Array(fieldCount - 1);

        for (keyFieldName in me.invoiceDatevConfig.MappingBelege) {
          if (me.invoiceDatevConfig.MappingBelege[keyFieldName]) {
            actMapEntry = me.invoiceDatevConfig.MappingBelege[keyFieldName].elogroup;
            objKey = sol.common.SordUtils.getObjKey(sord, actMapEntry);
            if (objKey) {
              if (!this.writeDatevExport(keyFieldName, actMapEntry, objKey, sord, logFileTableMessages, row, column, datevFileLine, false, mapItems)) {
                boolDataSetOkay = false;
              }
              column += 1;
            }
            if (!actMapEntry || (actMapEntry == "null") || (actMapEntry == "Sord.name")) {
              if (!this.writeDatevExport(keyFieldName, actMapEntry, objKey, sord, logFileTableMessages, row, column, datevFileLine, false, mapItems)) {
                boolDataSetOkay = false;
              }
              column += 1;
            }
            // check map fields
            for (k = 0; k < mapItems.length; k++) {
              if (mapItems[k].key == actMapEntry) {
                if (!this.writeDatevExport(keyFieldName, actMapEntry, objKey, sord, logFileTableMessages, row, column, datevFileLine, true, mapItems)) {
                  boolDataSetOkay = false;
                }
                column += 1;
              }
            }
          } else {
            logger.info(["Field defintion for field '{0}' is missing.", keyFieldName]);
          }
        }
        if (boolDataSetOkay) {
          correctDataSets += 1;
          this.writeDataSet(logFileTableDataSets, sord, false);
          sol.common.SordUtils.setObjKeyValue(sord, me.invoiceDatevConfig.Parameter.StatusFieldGrpName, me.invoiceDatevConfig.Parameter.StatusAfterExport);
          ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
          datevFileContent.push(datevFileLine.join(";") + ";");
        }
      }
      if (row == 0) { // log no file when no invoices avaible
        return;
      }
      datevFileContent = datevFileContent.join("\r\n");
      if (me.invoiceDatevConfig.Parameter.storeDatexExportCsvInElo) {
        sol.invoice_datev.as.Utils.createArchiveDocument(arcPathDatevExport, datevFileName, "csv", datevFileContent);
      }
      windowsPathDatevExport = me.invoiceDatevConfig.Parameter.DatevExportDirectory;
      if (sol.invoice_datev.as.Utils.existsWindowsPath(windowsPathDatevExport)) {
        sol.invoice_datev.as.Utils.createWindowsDocument(windowsPathDatevExport, datevFileName, "csv", datevFileContent);
      }
      contentHTML = sol.invoice_datev.as.export.HtmlLog.saveExportLog(logFileTableMessages, timeDateJava, row, correctDataSets, logFileTableDataSets, arcPathDatevExport);
    }
    logger.exit("exportInvoices", contentHTML);
    return contentHTML;
  },

  /**
   * Writes export report line in logFileTableMessages
   * @param {Array} logFileTableMessages  table log protocol messages
   * @param {Number} row                     row
   * @param {Number} column                  column
   * @param {String} datevFieldName          fieldname in datev
   * @param {String} datevFieldContent       fieldcontent in datev
   * @param {String} message                 protocol messages
   * @param {String} eloDocument             document in elo
   * @param {String} eloFieldName            fieldname in elo
   * @param {String} eloGroup                grpname in elo
   * @param {String} eloData                 content in elo
   * @param {String} eloGuid                 guid in elo
   */
  writeExportReport: function (logFileTableMessages, row, column, datevFieldName, datevFieldContent, message, eloDocument, eloFieldName, eloGroup, eloData, eloGuid) {
    var logFileLine = [];

    logFileLine.push(row);
    logFileLine.push(column);
    logFileLine.push(datevFieldName);
    logFileLine.push(eloFieldName);
    logFileLine.push(eloGroup);
    logFileLine.push(eloData);
    logFileLine.push(message);
    logFileLine.push(datevFieldContent);
    logFileLine.push(eloDocument);
    logFileLine.push(eloGuid);
    logFileTableMessages.push(logFileLine);
  },

  /**
   * Writes a data set
   * @param {Array} logFileTableDataSets Table exported data sets
   * @param {Object} sord Current invoice represented by de.elo.ix.client.Sord
   * @param {Boolean} boolHeader Status if header written
   */
  writeDataSet: function (logFileTableDataSets, sord, boolHeader) {
    var me = this,
        tableFieldHeader, dMask, mapItems, objKey, logFileLine, i, j, k,
        logFileColumn, tableFieldDefinitionItem, fieldValue;

    // construction invoice overview
    tableFieldHeader = [sol.invoice_datev.as.Utils.getLanguageText("CustNo"),
      sol.invoice_datev.as.Utils.getLanguageText("Creditor"),
      sol.invoice_datev.as.Utils.getLanguageText("InvoiceNo"),
      sol.invoice_datev.as.Utils.getLanguageText("DateOfInvoice"),
      sol.invoice_datev.as.Utils.getLanguageText("ShortName"),
      sol.invoice_datev.as.Utils.getLanguageText("AmountGross"),
      sol.invoice_datev.as.Utils.getLanguageText("Maturity")];

    // get indexmask from header
    dMask = null;
    if (boolHeader) {
      dMask = ixConnect.ix().checkoutDocMask(sord.maskName, DocMaskC.mbAll, LockC.NO);
    }
    // get map fields
    mapItems = null;
    mapItems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, sord.id, null, LockC.NO).items;
    // iterate field definitions
    objKey = null;
    logFileLine = [];
    logFileColumn = "";
    tableFieldDefinitionItem = "";
    fieldValue = null;
    for (i = 0; i < me.invoiceDatevConfig.logFileTableFieldDefinition.length; i++) {
      logFileColumn = "";
      for (j = 0; j < me.invoiceDatevConfig.logFileTableFieldDefinition[i].length; j++) {
        tableFieldDefinitionItem = me.invoiceDatevConfig.logFileTableFieldDefinition[i][j];
        if (boolHeader) {
          // set headers
          for (k = 0; k < dMask.lines.length; k++) {
            if (dMask.lines[k].key == tableFieldDefinitionItem) {
              logFileColumn = tableFieldHeader[i];
            }
          }
          if ("Sord.name" == tableFieldDefinitionItem) {
            logFileColumn = tableFieldHeader[i];
          }
          // iterate map fields
          if (logFileColumn == "") {
            for (k = 0; k < mapItems.length; k++) {
              if (mapItems[k].key == tableFieldDefinitionItem) {
                logFileColumn = tableFieldHeader[i];
              }
            }
          }
        } else {
          // set entries
          k = 0;
          objKey = null;
          objKey = sol.common.SordUtils.getObjKey(sord, tableFieldDefinitionItem);
          if (objKey) {
            fieldValue = sol.invoice_datev.as.Utils.getFieldValueFromEloGroup(objKey, sord);
            if (objKey.name != "ELO_FNAME") {
              if (logFileColumn == "") {
                logFileColumn = fieldValue;
              } else {
                logFileColumn = logFileColumn + " " + fieldValue;
              }
            } else {
              if (logFileColumn == "") {
                logFileColumn = sord.name;
              } else {
                logFileColumn = logFileColumn + " " + sord.name;
              }
            }
          }
          if ("Sord.name" == tableFieldDefinitionItem) {
            if (logFileColumn == "") {
              logFileColumn = sord.name;
            } else {
              logFileColumn = logFileColumn + " " + sord.name;
            }
          }
          // iterate map fields
          for (k = 0; k < mapItems.length; k++) {
            if (mapItems[k].key == tableFieldDefinitionItem) {
              fieldValue = sol.invoice_datev.as.Utils.getFieldValueFromMapItem(mapItems[k], sord);
              if (mapItems[k].key != "ELO_FNAME") {
                if (logFileColumn == "") {
                  logFileColumn = fieldValue;
                } else {
                  logFileColumn = logFileColumn + " " + fieldValue;
                }
              } else {
                if (logFileColumn == "") {
                  logFileColumn = sord.name;
                } else {
                  logFileColumn = logFileColumn + " " + sord.name;
                }
              }
            }
          }
        }
      }
      // replace undefined
      if (!logFileColumn) {
        logFileColumn = "";
      }
      logFileColumn = logFileColumn.replace("undefined", "");
      logFileColumn = logFileColumn.replace("+", "");
      // dismiss colons
      logFileColumn = sol.invoice_datev.as.Utils.dismissColon(logFileColumn);
      logFileLine.push(logFileColumn);
    }
    logFileTableDataSets.push(logFileLine);
  },

  /**
   * Writes a datev export line
   * @param {String} keyFieldName Fieldname in datev mapping
   * @param {String} actMapEntry Grpfield in elo
   * @param {Object} objKey Indexvalue represented by de.elo.ix.client.ObjKey
   * @param {Object} sord Current dataset represented by de.elo.ix.client.Sord
   * @param {Array} logFileTableMessages Table log protocol messages
   * @param {Number} row Row
   * @param {Number} column Column
   * @param {String} datevFileLine File line of datev export
   * @param {Boolean} isMapField Status if actMapEntry is Mapfield
   * @param {Object} mapItems Map items represented by de.elo.ix.client.KeyValue
   * @return {Boolean}
   */
  writeDatevExport: function (keyFieldName, actMapEntry, objKey, sord, logFileTableMessages, row, column, datevFileLine, isMapField, mapItems) {
    var me = this,
        fieldConfig = {},
        fieldValue, defaultValue, k, boolDataSetOkay, datevFieldContent, totalAmountKey, creditDebitIndex, numValue;

    fieldConfig.sord = sord;
    fieldConfig.type = me.invoiceDatevConfig.MappingBelege[keyFieldName].type;
    fieldConfig.fieldType = me.invoiceDatevConfig.MappingBelege[keyFieldName].fieldType;
    fieldConfig.length = me.invoiceDatevConfig.MappingBelege[keyFieldName].length;
    fieldConfig.nks = me.invoiceDatevConfig.MappingBelege[keyFieldName].nks;
    fieldConfig.requiredField = (me.invoiceDatevConfig.MappingBelege[keyFieldName].required == "Ja");
    fieldConfig.key = actMapEntry;
    fieldConfig.eloData = (objKey && objKey.data && (objKey.data.length > 0)) ? objKey.data[0] : "";
    fieldConfig.templateString = me.invoiceDatevConfig.MappingBelege[keyFieldName].templateString;
    fieldConfig.mapFrom = me.invoiceDatevConfig.MappingBelege[keyFieldName].mapFrom;
    fieldConfig.mapTo = me.invoiceDatevConfig.MappingBelege[keyFieldName].mapTo;
    fieldConfig.quotes = me.invoiceDatevConfig.MappingBelege[keyFieldName].quotes;

    // mapfelder
    if (isMapField) {
      fieldConfig.eloData = "";
      for (k = 0; k < mapItems.length; k++) {
        if (mapItems[k].key == actMapEntry) {
          fieldConfig.key = actMapEntry;
          fieldConfig.eloData = mapItems[k].value;
        }
      }
    }

    if (!fieldConfig.key && me.invoiceDatevConfig.MappingBelege[keyFieldName].defaultValue) {
      fieldConfig.eloData = [me.invoiceDatevConfig.MappingBelege[keyFieldName].defaultValue];
    }

    fieldValue = sol.invoice_datev.as.Utils.getFieldValue(fieldConfig);

    if (fieldValue == sol.invoice_datev.as.Utils.getMessage("VM")) {
      defaultValue = me.invoiceDatevConfig.MappingBelege[keyFieldName].defaultValue;
      if (defaultValue) {
        fieldValue = defaultValue;
      }
    }

    totalAmountKey = me.invoiceDatevConfig.Parameter.totalAmountKey;
    if (totalAmountKey && (keyFieldName == totalAmountKey)) {
      creditDebitIndex = me.getKeyIndex(me.invoiceDatevConfig.Parameter.creditDebitKey);
      if (fieldValue != "") {
        numValue = fieldValue.replace(",", ".");
        if (numValue < 0) {
          datevFileLine[creditDebitIndex] = '"' + me.invoiceDatevConfig.Parameter.creditValue + '"';
          fieldValue = fieldValue.substr(1);
        } else {
          datevFileLine[creditDebitIndex] = '"' + me.invoiceDatevConfig.Parameter.debitValue + '"';
        }

        if (fieldConfig.quotes) {
          fieldValue = '"' + fieldValue + '"';
        }
      }
    }

    datevFieldContent = me.invoiceDatevConfig.MappingBelege[keyFieldName].content;

    // protocol - log entry
    boolDataSetOkay = true;
    if (sol.invoice_datev.as.Utils.getMessage(fieldValue)) {
      me.writeExportReport(logFileTableMessages, row, column, keyFieldName, datevFieldContent, fieldValue, sord.name,
        me.invoiceDatevConfig.MappingBelege[keyFieldName].eloname,
        fieldConfig.eloGroup, fieldConfig.eloData, sord.guid);
      boolDataSetOkay = false;
    }
    if (fieldConfig.type != "Ignore") {
      datevFileLine[column - 1] = fieldValue;
    }
    return boolDataSetOkay;
  },

  getKeyIndex: function (key) {
    var me = this,
        i = 0,
        keyName;

    for (keyName in me.invoiceDatevConfig.MappingBelege) {
      if (keyName == key) {
        return i;
      }
      i++;
    }
  }
});
