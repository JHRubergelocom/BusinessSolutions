
//@include lib_Class.js

/**
 * Rendering Excel file from a Excel template.
 *
 * This can either be used for creating a new Document in the archive (`targetId` specified) or can create a new version on an existing object (`objId`).
 *
 * Which fields will be written, is specified by the template (first line of the data worksheet contains the ObjKeys)
 * or by the first Sord of the data.sords array (all ObjKeys).
 *
 * @author ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloas
 *
 * @requires sol.common.StringUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.as.ExcelDocument
 *
 */
sol.define("sol.common.as.renderer.Excel", {

  requiredConfig: ["templateId"],

  /**
   * @cfg {String} templateId (required)
   * The template which should be rendered
   */

  /**
   * @cfg {String} targetId
   * The target folder to store the rendered document
   */

  /**
   * @cfg {String} objId
   * The rendered document will be saved as a version of this object
   * Either `targetId` or `objId` has to be defined.
   */

  /**
   * @cfg {Boolean} copyMetaData
   * If `true`, the mask and the metadata of the template will be copied to the new document
   */

  /**
   * @cfg {String} [datasheet="Data"]
   * Specifies on which worksheet the data should be written
   */

  /**
   * @private
   * @property {String} mapPrefix
   */
  mapPrefix: "MAP_",

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    if (!me.objId && !me.targetId) {
      throw "IllegalArgumentException: either 'targetId' or 'objId' has to defined";
    }
    me.datasheet = config.datasheet || "Data";
    me._mapKeys = [];
  },

  /**
   * Starts the template rendering.
   * @param {String} name Name
   * @param {String} data Data
   * @return {Object}
   */
  render: function (name, data) {
    var me = this,
        config = {},
        templateSord;

    if (me.objId) {
      config.objId = me.objId;
    } else {
      config.name = name;
      config.parentId = me.targetId;
    }

    config.format = "xlsx";
    if (me.copyMetaData === true) {
      templateSord = ixConnect.ix().checkoutSord(me.templateId, SordC.mbAllIndex, LockC.NO);
      config.maskId = templateSord.mask;
      config.objKeysObj = sol.common.SordUtils.getTemplateSord(templateSord).sord.objKeys;
    }

    return me.renderExcel(data, config);
  },

  /**
   * @private
   * @param {Object} data Data
   * @param {Object} config Configuration
   * @return {Object}
   */
  renderExcel: function (data, config) {
    var me = this,
        result = {},
        excelDocument;

    try {
      excelDocument = sol.create("sol.common.as.ExcelDocument", {});
      excelDocument.openFromRepo({ objId: me.templateId });
      me.fillExcelSpreadsheet(excelDocument, data);
      result.objId = excelDocument.saveToRepo(config);
    } catch (ex) {
      me.logger.error(["error rendering report '{0}' (templateId='{1}')", config.name, me.templateId], ex);
    }

    return result;
  },

  /**
   * @private
   * Fills the data to an Excel spreadsheet
   * @param {sol.common.as.ExcelDocument} excelDocument Excel document
   * @param {Object} data Data   *
   */
  fillExcelSpreadsheet: function (excelDocument, data) {
    var me = this,
        workbook = excelDocument.workbook;

    me._worksheet = workbook.worksheets.get(me.datasheet);

    if (!me._worksheet) {
      return;
    }

    if (data && data.sords && (data.sords.length > 0)) {
      me.prepareColumnMapping(data.sords[0]);
      me.prepareHeader();
      me.writeData(data.sords);
    }
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord Sord
   */
  prepareColumnMapping: function (sord) {
    var me = this,
        header = me.readHeader(sord),
        columnIdx, columnDescObj;

    me._columnMapping = {};
    me._header = [];
    if (header) {
      for (columnIdx = 0; columnIdx < header.length; columnIdx++) {
        columnDescObj = header[columnIdx];
        columnDescObj.idx = columnIdx;
        me._columnMapping[columnDescObj.key] = columnDescObj;
        me._header.push(columnDescObj.key); // to preserve header order
      }
    }
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord Sord
   * @return {Array}
   */
  readHeader: function (sord) {
    var me = this,
        header = me.readHeaderFromWorksheet();
    if (!header) {
      header = me.readHeaderFromSord(sord);
    }
    return header;
  },

  /**
   * @private
   * @return {Array}
   */
  readHeaderFromWorksheet: function () {
    var me = this,
        cells = me._worksheet.getCells(),
        columnIdx = 0,
        cell = cells.getCell(0, columnIdx++),
        headerData = [],
        value;

    while (cell && cell.getValue() !== null) {
      value = {
        key: cell.getValue() + "",
        isDate: me.isDate(cell),
        isNumber: me.isNumber(cell)
      };

      headerData.push(value);

      if (sol.common.StringUtils.startsWith(value.key, me.mapPrefix)) {
        me._mapKeys.push(value.key.replace(me.mapPrefix, "") + "*");
      }

      cell = cells.getCell(0, columnIdx++);
    }

    return (headerData.length > 0) ? headerData : null;
  },

  /**
   * @private
   * Checks, if a Cell is formated as number.
   * @param {com.aspose.cells.Cell} cell
   * @return {Boolean}
   */
  isNumber: function (cell) {
    var styleNumber = cell.style.getNumber();
    return (styleNumber > 0 && styleNumber < 14) || (styleNumber > 22 && styleNumber < 45);
  },

  /**
   * @private
   * Checks, if a Cell is formated as date.
   * @param {com.aspose.cells.Cell} cell
   * @return {Boolean}
   */
  isDate: function (cell) {
    return cell.style.isDateTime();
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord Sord
   * @return {Array}
   */
  readHeaderFromSord: function (sord) {
    var headerData = [],
        objKey;
    for (objKey in sord.objKeys) {
      if (sord.objKeys.hasOwnProperty(objKey)) {
        headerData.push({ key: objKey });
      }
    }
    return (headerData.length > 0) ? headerData : null;
  },

  /**
   * @private
   */
  prepareHeader: function () {
    var me = this;

    me.writeLine(0, me._header);
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord[]} rowSords Row Sords
   */
  writeData: function (rowSords) {
    var me = this,
        line = 1;
    rowSords.forEach(function (rowSord) {
      var rows;
      if (me._mapKeys.length > 0) {
        rows = me.expandRowSord(rowSord);
        if (rows) {
          rows.forEach(function (row) {
            me.writeLine(line++, row);
          });
        }
      } else {
        me.writeLine(line++, rowSord.objKeys);
      }
    });
  },

  /**
   * @private
   * Extract the lines for the map items.
   * If there is a map value with an index, the line (the ObjKeys) will be repeated for each map index.
   * If the `rowSord` contains `mapKeys`, those will be used and the map values will not be checked out again.
   * @param {de.elo.ix.client.Sord} rowSord Row sord
   * @return {Object}
   */
  expandRowSord: function (rowSord) {
    var me = this,
        result = [],
        mapitems, mapkey, tmpRow;

    if (rowSord.mapKeys && !sol.common.ObjectUtils.isEmpty(rowSord.mapKeys)) {
      mapitems = [];
      for (mapkey in rowSord.mapKeys) {
        if (rowSord.mapKeys.hasOwnProperty(mapkey)) {
          mapitems.push(new KeyValue(mapkey, rowSord.mapKeys[mapkey]));
        }
      }
    } else {
      mapitems = ixConnect.ix().checkoutMap(MapDomainC.DOMAIN_SORD, rowSord.id, me._mapKeys, LockC.NO).items;
    }

    mapitems.forEach(function (mapitem) {
      var key = me.mapPrefix + mapitem.key,
          idx = me.getIndexFromName(key);
      if (idx) {
        if (!result[idx - 1]) {
          result[idx - 1] = me.copyObject(rowSord);
        }
        result[idx - 1][sol.common.StringUtils.removeTrailingNumber(key)] = mapitem.value + "";
      } else {
        if (!tmpRow) {
          tmpRow = me.copyObject(rowSord);
        }
        tmpRow[key] = mapitem.value + "";
      }
    });

    if (tmpRow) {
      result.push(tmpRow);
    }

    return (result.length > 0) ? result : [rowSord.objKeys];
  },


  /**
   * @private
   * @param {de.elo.ix.client.Sord} rowSord Row sord
   * @return {Object}
   */
  copyObject: function (rowSord) {
    var copy = {},
        prop;
    for (prop in rowSord.objKeys) {
      if (rowSord.objKeys.hasOwnProperty(prop)) {
        copy[prop] = rowSord.objKeys[prop];
      }
    }
    return copy;
  },

  /**
   * @private
   * @param {String} fieldName
   * @return {String}
   */
  getIndexFromName: function (fieldName) {
    if (!fieldName) {
      return null;
    }
    return sol.common.StringUtils.getTrailingNumber(fieldName);
  },

  /**
   * @private
   * @param {Number} rowIndex Row index
   * @param {Array} rowData Row data
   */
  writeLine: function (rowIndex, rowData) {
    var me = this,
        cells = me._worksheet.getCells(),
        columnIdx, column, value;

    if (sol.common.ObjectUtils.isArray(rowData)) {
      for (columnIdx = 0; columnIdx < rowData.length; columnIdx++) {
        cells.getCell(rowIndex, columnIdx).putValue(rowData[columnIdx]);
      }
    } else {
      for (column in rowData) {
        if (rowData.hasOwnProperty(column) && rowData[column] && me._columnMapping.hasOwnProperty(column)) {
          if (me._columnMapping[column].isDate === true) {
            value = new java.util.Date(sol.common.DateUtils.isoToDate(rowData[column]).getTime());
          } else if (me._columnMapping[column].isNumber === true) {
            try {
              value = java.lang.Double.parseDouble(rowData[column].replace(",", "."));
            } catch (ex) {
              value = rowData[column];
            }
          } else {
            value = rowData[column];
          }
          cells.getCell(rowIndex, me._columnMapping[column].idx).putValue(value);
        }
      }
    }
  }
});
