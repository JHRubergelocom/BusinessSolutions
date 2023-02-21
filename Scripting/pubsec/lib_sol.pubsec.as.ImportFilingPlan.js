/**
 * Filing plan importer
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.02.002
 *
 * @eloas
 * @requires sol.common.Config
 * @requires sol.common.IxUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.XmlUtils
 * @requires sol.common.UserUtils
 * @requires sol.common.as.ExcelDocument
 * @requires sol.pubsec.Utils
 * @requires sol.pubsec.FilingPlanUtils
 */
sol.define("sol.pubsec.as.ImportFilingPlan", {

  requiredConfig: ["templObjId", "startFolderId"],

  importGroup: "sol.pubsec.admin.FilingPlan",

  execute: function () {
    var me = this,
        templateSord, extension, excelDocument, csvContent;

    if (!sol.common.UserUtils.isMainAdmin(me.userId) && !sol.common.UserUtils.isInGroup(me.importGroup, { userId: me.userId })) {
      throw "IllegalAccess: only main admins and members of '" + me.importGroup + "' can import a new filing plan.";
    }

    me.config = sol.pubsec.Utils.loadConfig();

    me.sortByFieldName = me.config.fields.filingPlanSort;
    me.referenceFieldName = me.config.fields.filingPlanReference;

    templateSord = ixConnect.ix().checkoutSord(me.templObjId, EditInfoC.mbSordDocAtt, LockC.NO).sord;
    extension = templateSord.docVersion.ext.toLowerCase();

    if (extension == "xlsx") {
      excelDocument = sol.create("sol.common.as.ExcelDocument", {});
      excelDocument.openFromRepo({ objId: templateSord.id });
      csvContent = excelDocument.saveAsString({ format: "csv" });
    } else {
      csvContent = sol.common.RepoUtils.downloadToString(me.templObjId);
    }

    me.convertCsvToTable(csvContent);
    me.data.sort(function (a, b) {
      if (a[me.sortByFieldName] > b[me.sortByFieldName]) {
        return 1;
      }
      if (a[me.sortByFieldName] < b[me.sortByFieldName]) {
        return -1;
      }
      return 0;
    });

    me.data.forEach(function (element, index) {
      element.objId = me.createElement(element, index);
    });

    return { state: "OK" };
  },

  convertCsvToTable: function (csvContent) {
    var me = this,
        lines, columns, i, cells, entry, j, key, value, values;

    lines = me.csvToArray(csvContent, ";");
    columns = lines[0].map(function (column) {
      return column.trim();
    });
    me.data = [];
    for (i = 1; i < lines.length; i++) {
      cells = lines[i];
      if (cells.length != columns.length) {
        continue;
      }
      entry = {};
      for (j = 0; j < cells.length; j++) {
        key = columns[j];
        value = (cells[j]) ? cells[j].trim() : "";
        if (key == me.referenceFieldName) {
          values = value.split(me.config.filingPlan.referenceSeparator);
        } else if (me.config.filingPlan.rightFields.indexOf(key) > -1) {
          values = value.split(me.config.filingPlan.userSeparator);
        } else {
          values = [value];
        }
        entry[key] = values;
      }
      me.data.push(entry);
    }
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
  },

  /**
   * Creates a filing plan folder
   * @param {Object} element
   * @param {String} index
   * @return {Object}
   */
  createElement: function (element, index) {
    var me = this,
        filingPlanUtils = sol.pubsec.FilingPlanUtils,
        name, references, desc, parentId, aclItems;

    name = element[me.config.fields.filingPlanName][0];
    references = element[me.config.fields.filingPlanReference];
    desc = references.join(me.config.filingPlan.referenceSeparator) + me.config.filingPlan.nameSeparator + name;
    parentId = me.findParentId(references[0], index);
    aclItems = me.createInitialAclItems();

    return filingPlanUtils.createElement(parentId, desc, element, null, aclItems, me.config.filingPlan.import.standardSordType);
  },

  /**
   * Finds the parent folder in the data array from the index position backwards
   * @param {String} reference File reference
   * @param {Number} index Index of the current element in the data array
   * @return {String} Object ID of the parent folder
   */
  findParentId: function (reference, index) {
    var me = this,
        i, element;
    for (i = index; i >= 0; i--) {
      element = me.data[i];
      if (element.objId && me.checkIfParent(reference, element[me.referenceFieldName])) {
        return element.objId;
      }
    }
    return me.startFolderId;
  },

  /**
   * Checks if the current reference starts with the parent reference.
   * @param {String} srcRef reference File reference of the current element.
   * @param {String} dstRefs referenceToCheck File reference of the element to check.
   * @return {Boolean} True if the checked element is the parent element.
   */
  checkIfParent: function (srcRef, dstRefs) {
    var i;
    if (!srcRef || !dstRefs) {
      return false;
    }
    for (i = 0; i < dstRefs.length; i++) {
      if (srcRef.indexOf(dstRefs[i]) === 0) {
        return true;
      }
    }
    return false;
  },

  /**
   * @private
   * @return {Object}
   */
  createInitialAclItems: function () {
    var me = this,
        fullAccessGroups = (me.config && me.config.filingPlan && me.config.filingPlan.import) ? me.config.filingPlan.import.fullAccessGroups : null,
        readAccessGroups = (me.config && me.config.filingPlan && me.config.filingPlan.import) ? me.config.filingPlan.import.readAccessGroups : null,
        aclItems = [];

    if (fullAccessGroups && (fullAccessGroups.length > 0)) {
      fullAccessGroups.forEach(function (group) {
        var aclItem = new AclItem();
        aclItem.name = group;
        aclItem.type = AclItemC.TYPE_GROUP;
        aclItem.access = AccessC.LUR_ALL;
        aclItems.push(aclItem);
      });
    }

    if (readAccessGroups && (readAccessGroups.length > 0)) {
      readAccessGroups.forEach(function (group) {
        var aclItem = new AclItem();
        aclItem.name = group;
        aclItem.type = AclItemC.TYPE_GROUP;
        aclItem.access = AccessC.LUR_READ;
        aclItems.push(aclItem);
      });
    }

    return (aclItems.length > 0) ? aclItems : null;
  }

});

