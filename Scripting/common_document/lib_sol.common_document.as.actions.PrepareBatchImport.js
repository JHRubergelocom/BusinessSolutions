/**
 * Prepare an import file for the batch import.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.05.000
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.ExcelDocument
 * @requires sol.common_document.BatchImport
 */
sol.define("sol.common_document.as.actions.PrepareBatchImport", {
  extend: "sol.common.as.ActionBase",

  requiredConfig: ["objId"],

  getName: function () {
    return "PrepareBatchImport";
  },

  process: function () {
    var me = this,
        provider, serviceDesc;

    provider = me.prepareContent();

    if (me.logger.debugEnabled) {
      me.logger.debug("HEADER: " + JSON.stringify(provider.getHeader()));
      while (provider.hasNext()) {
        me.logger.debug(JSON.stringify(provider.next()));
      }
    }

    if (me.serviceId) {
      serviceDesc = sol.common.IxUtils.execute("RF_sol_common_service_ServiceRegistry_Query", {
        serviceId: me.serviceId
      });
      if (serviceDesc && (serviceDesc.length === 1)) {
        provider.setConfig({
          service: {
            id: me.serviceId,
            fct: serviceDesc[0].serviceDescription.service
          }
        });
      }
    }

    provider.save();

    me.addGotoIdEvent(me.objId);
  },

  prepareContent: function () {
    var me = this,
        parser, content;

    parser = sol.create("sol.common_document.as.CsvParser");

    content = sol.create("sol.common_document.BatchImportData", {
      sourceId: me.objId,
      parser: parser,
      forceReloadFromSource: true
    });

    return content;
  }

});


sol.define("sol.common_document.as.CsvParser", {

  /**
   * @cfg {String} delimiter
   */

  supportedTypes: ["csv", "xls", "xslx"],

  supportsFileType: function (extension) {
    var me = this;
    return (me.supportedTypes.indexOf(extension) > -1);
  },

  parse: function (objId) {
    var me = this,
        importFile, fileExtension, excelDocument, csvContent, delimiter, content;

    importFile = ixConnect.ix().checkoutSord(objId, EditInfoC.mbSordDocAtt, LockC.NO).sord;
    fileExtension = String(importFile.docVersion.ext.toLowerCase());

    if (fileExtension == "xls" || fileExtension == "xlsx") {
      excelDocument = sol.create("sol.common.as.ExcelDocument", {});
      excelDocument.openFromRepo({ objId: objId });
      csvContent = excelDocument.saveAsString({ format: "csv" });
      delimiter = ";";
    } else if (fileExtension == "csv") {
      csvContent = sol.common.RepoUtils.downloadToString(objId);
    } else {
      throw "unsupported file type '" + fileExtension + "'";
    }

    if (csvContent) {
      delimiter = me.delimiter || delimiter;
      content = me.csvToArray(csvContent, delimiter);
    }

    return content;
  },

  /*
   * ref: http://stackoverflow.com/a/1293163/2343
   * This will parse a delimited string into an array of
   * arrays. The default delimiter is the comma, but this
   * can be overriden in the second argument.
   */
  csvToArray: function (strData, strDelimiter) {
    var objPattern, arrData, arrMatches, strMatchedDelimiter, strMatchedValue;

    strDelimiter = (strDelimiter || ",");

    objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );

    arrData = [[]];
    arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
      strMatchedDelimiter = arrMatches[ 1 ];

      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        arrData.push([]);
      }

      if (arrMatches[2]) { // quoted value
        strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
      } else { // non-quoted value
        strMatchedValue = arrMatches[3];
      }

      arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
  }

});
