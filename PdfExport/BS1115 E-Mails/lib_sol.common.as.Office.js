/*
 * Converts office documents into other formats like PDF or HTML
 *
 * ## Usage:
 *
 *     var officeConverter = sol.create("sol.common.as.functions.OfficeConverter", {
 *       openFromRepo: {
 *         objId: "3630"
 *       },
 *       saveToRepo: {
 *         format: "pdf",
 *         parentId: "ARCPATH:/Test",
 *         name: "Excel1" }
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires sol.common.RepoUtils
 * @requires sol.common.XmlUtils
 */
sol.define("sol.common.as.functions.OfficeConverter", {
  extend: "sol.common.as.FunctionBase",

  /**
   * @private
   * @property {Array} docClassNames
   * Supported extensions and the appropriate class name
   */

  docClassNames: {
    doc: "sol.common.as.WordDocument",
    docx: "sol.common.as.WordDocument",
    rtf: "sol.common.as.WordDocument",
    odt: "sol.common.as.WordDocument",

    xls: "sol.common.as.ExcelDocument",
    xlsx: "sol.common.as.ExcelDocument",
    xlsm: "sol.common.as.ExcelDocument",
    xltx: "sol.common.as.ExcelDocument",
    xltm: "sol.common.as.ExcelDocument",
    csv: "sol.common.as.ExcelDocument",
    ods: "sol.common.as.ExcelDocument",

    ppt: "sol.common.as.PowerPointDocument",
    pot: "sol.common.as.PowerPointDocument",
    pps: "sol.common.as.PowerPointDocument",
    pptx: "sol.common.as.PowerPointDocument",
    potx: "sol.common.as.PowerPointDocument",
    pptm: "sol.common.as.PowerPointDocument",
    odp: "sol.common.as.PowerPointDocument",

    msg: "sol.common.as.MapiMessage",

    vsd: "sol.common.as.VisioDocument",
    vss: "sol.common.as.VisioDocument",
    vst: "sol.common.as.VisioDocument",
    vsx: "sol.common.as.VisioDocument",
    vdw: "sol.common.as.VisioDocument",
    vdx: "sol.common.as.VisioDocument",
    vsdx: "sol.common.as.VisioDocument"
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        extension, sord, docClassName, document, objId;

    if (me.objId) {
      me.openFromRepo = { objId: me.objId };
    }

    if (!me.objId && !me.openFile && !me.openFromRepo) {
      throw "'objId', openFile' or 'openFromRepo' must be set.";
    }
    extension = "";
    if (me.openFromRepo) {
      if (!me.openFromRepo.objId) {
        throw "'openFromRepo.objId' must be set.";
      }
      sord = ixConnect.ix().checkoutSord(me.openFromRepo.objId, EditInfoC.mbSord, LockC.NO).sord;
      extension = sord.docVersion.ext.toLowerCase();
      me.openFromRepo.extension = extension;
    }

    if (me.openFile) {
      if (me.openFile.filePath) {
        me.openFile.file = new java.io.File(me.openFile.filePath);
      }
      extension = Packages.org.apache.commons.io.FilenameUtils.getExtension(me.openFile.filePath);
    }

    docClassName = me.docClassNames[extension];
    if (!docClassName) {
      me.logger.warn(["Extension '{0}' is unsupported.", extension]);
      return;
    }

    document = sol.create(docClassName);
    if (me.openFromRepo) {
      if (me.language && !me.openFromRepo.language) {
        me.openFromRepo.language = me.language;
      }
      document.openFromRepo(me.openFromRepo);
    } else {
      document.openFile(me.openFile);
    }

    if (me.hyphDicts) {
      document.hyphDicts = me.hyphDicts;
    }

    if (me.objId && !me.saveToRepo && !me.saveToFile && !me.saveToStream) {
      me.saveToRepo = { objId: me.objId, tryUpdate: true };
    }

    if (me.saveToRepo) {
      if (!me.saveToRepo.format) {
        me.saveToRepo.format = "pdf";
      }
      objId = document.saveToRepo(me.saveToRepo);
    } else if (me.saveToFile) {
      if (!me.saveToFile.format) {
        me.saveToFile.format = Packages.org.apache.commons.io.FilenameUtils.getExtension(me.saveToFile.filePath);
      }
      document.saveFile(me.saveToFile);
    } else if (me.saveToStream) {
      return document.saveToStream(me.saveToStream);
    }
    return { passOn: true, objId: objId };
  },

  /**
   * @private
   * Checks whether the extension is supported by the converter.
   * @param {String} extension Extension of the source document.
   * @return {Boolean} True if the extension is supported
   */
  isSupported: function (extension) {
    var me = this,
        docClassName;
    if (!extension) {
      return false;
    }
    docClassName = me.docClassNames[extension];
    return !!docClassName;
  }
});

/*
 * Represents an Microsoft Office document.
 *
 * This is a base class that provides core functionality of handling office documents. Please refer to child class
 * implementations for more details.
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 */
sol.define("sol.common.as.OfficeDocument", {

  /**
   * @private
   * Opens a source file.
   *
   *     officeDocument.openFile({ "file": "d:/temp/file1.docx" });
   *
   * @param {Object} openFileConfig
   */
  openFile: function (openFileConfig) {
    var me = this,
        inputStream;
    inputStream = java.io.FileInputStream(openFileConfig.file);
    me.open(inputStream);
    inputStream.close();
  },

  /**
   * @private
   * Opens a document from the repository.
   *
   *     officeDocument.openFromRepo({ objId: "ARCPATH:/Folder1/Document1" });
   *
   * @param {Object} openFromRepoConfig
   */
  openFromRepo: function (openFromRepoConfig) {
    var me = this,
        inputStream;

    inputStream = sol.common.RepoUtils.downloadToStream(openFromRepoConfig.objId);
    me.objId = openFromRepoConfig.objId;
    me.language = openFromRepoConfig.language;
    me.openExtension = openFromRepoConfig.extension;
    me.openSeparator = openFromRepoConfig.separator;
    me.open(inputStream);
    inputStream.close();
  },

  /**
   * @private
   * Checks whether the destination format is supported.
   *
   *     var result = officeDocument.checkFormat({ "format": "pdf" });
   *
   * @param {Object} saveConfig
   * @throws {UnsupportedException}
   */
  checkFormat: function (saveConfig) {
    var me = this,
        format;
    format = saveConfig.format;
    if (!me.saveFormats[format]) {
      throw "Save format '" + format + "' is unsupported";
    }
  },

  /**
   * @private
   * @param {Object} saveConfig
   * @returns {Function}
   */
  getSaveParams: function (saveConfig) {
    var me = this,
        format, func;
    format = saveConfig.format.toUpperCase();
    func = me["getSaveParams" + format];
    if (func) {
      return func.call(me, saveConfig);
    }
    return null;
  },

  /**
   * @private
   * Saves the converted document to a file.
   *
   *     officeDocument.saveFile({ format: "pdf", filePath: "c:\\Temp\\Document1.pdf" });
   *
   * @param {Object} saveFileConfig
   */
  saveFile: function (saveFileConfig) {
    var me = this,
        saveParams, outputStream;
    me.checkFormat(saveFileConfig);
    saveParams = me.getSaveParams(saveFileConfig);
    outputStream = new FileOutputStream(saveFileConfig.filePath);
    me.save(outputStream, saveParams);
    outputStream.close();
  },

  /**
   * @private
   * Saves the converted document into the repository.
   *
   *     officeDocument.getSaveParams({ format: "pdf", parentId: "ARCPATH:/Folder1" });
   *
   * @param {Object} saveToRepoConfig
   * @return {String} Object ID
   */
  saveToRepo: function (saveToRepoConfig) {
    var me = this,
        saveParams, outputStream;
    me.checkFormat(saveToRepoConfig);

    saveParams = me.getSaveParams(saveToRepoConfig);
    outputStream = new ByteArrayOutputStream();
    me.save(outputStream, saveParams);

    saveToRepoConfig.outputStream = outputStream;
    saveToRepoConfig.extension = saveToRepoConfig.format;
    return sol.common.RepoUtils.saveToRepo(saveToRepoConfig) + "";
  },

  /**
   * @private
   * Writes the converted document into a string. e.g. a CSV content.
   *
   *     officeDocument.saveAsString({ format: "pdf" });
   *
   * @param {Object} saveConfig
   * @return {String} Content
   */
  saveAsString: function (saveConfig) {
    var me = this,
        saveParams, outputStream, content;
    me.checkFormat(saveConfig);

    saveParams = me.getSaveParams(saveConfig);
    outputStream = new ByteArrayOutputStream();
    me.save(outputStream, saveParams);
    content = String(new java.lang.String(outputStream.toByteArray(), "UTF-8"));
    outputStream.close();
    return content;
  },

  /**
   * @private
   * Writes the converted document into a stream.
   *
   *     officeDocument.saveToStream({ format: "pdf" });
   *
   * @param {Object} saveConfig
   * @return {java.io.InputStream} Input stream
   *
   */
  saveToStream: function (saveConfig) {
    var me = this,
        saveParams, outputStream, inputStream;
    me.checkFormat(saveConfig);

    saveParams = me.getSaveParams(saveConfig);
    outputStream = new ByteArrayOutputStream();
    me.save(outputStream, saveParams);
    inputStream = new ByteArrayInputStream(outputStream.toByteArray());
    return inputStream;
  }
});

/*
 * Represents a Word document.
 *
 * ## Usage
 *
 * Following example shows how to open a document from the ELO Repository and converts it to a pdf document.
 *
 *     var wordDocument = sol.create("sol.common.as.WordDocument", {});
 *
 *     wordDocument.openFromRepo({
 *       objId: "123"
 *     });
 *
 *     wordDocument.mailMerge(report.getData(), report.getDataDefinition());
 *
 *     wordDocument.hyphDicts =  { "de-DE": "C:/ELOprofessional/data/as-Demo/dict/hyph_de_DE.dic" };
 *
 *     var newObjId = wordDocument.saveToRepo({
 *       format: "pdf",
 *       parentId: "ARCPATH:/Test",
 *       name: "Report1"
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 */
sol.define("sol.common.as.WordDocument", {
  extend: "sol.common.as.OfficeDocument",

  /**
   * @private
   * @cfg {Object}
   * Supported destination formats
   */
  saveFormats: {
    pdf: {},
    html: {},
    docx: {}
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.logger.debug(["Aspose.Words: product={0}, version={1}", Packages.com.aspose.words.BuildVersionInfo.product, Packages.com.aspose.words.BuildVersionInfo.version]);
  },

  /**
   * @private
   * @param {java.io.InputStream} inputStream
   */
  open: function (inputStream) {
    var me = this;
    me.document = new Packages.com.aspose.words.Document(inputStream);
  },

  /**
   * @private
   * Renders a template word document with placeholders.
   * The placeholders must be defined in 'mustache' syntax.
   * @param {Object} data JavaScript object that contains the data to fill-in
   * @param {Object} dataDefinition Data definition to resolve JavaScript arrays to XML tags
   */
  mailMerge: function (data, dataDefinition) {
    var me = this,
        mailMerge,
        xmlDoc = sol.common.XmlUtils.convertObjectToXml(data, dataDefinition);

    mailMerge = me.document.mailMerge;
    mailMerge.useNonMergeFields = true;
    mailMerge.cleanupOptions = Packages.com.aspose.words.MailMergeCleanupOptions.REMOVE_UNUSED_FIELDS;

    me.logger.debug("xml=" + sol.common.XmlUtils.toString(xmlDoc));
    mailMerge.executeWithRegions(new Packages.de.elo.mover.main.aspose.XmlMailMergeDataSet(xmlDoc));
  },

  /**
   * @private
   * Renders a template word document with content controls.
   * The placeholders must be defined in 'mustache' syntax.
   * @param {Object} data JavaScript object that contains the data to fill-in
   *
   * The tag of the content control must contain a Handlesbars string which determinates what should be filled in.
   * e.g. {{{CONTRACT.objKeys.PARTNER_NAME}}}
   */
  fillContentControls: function (data) {
    var me = this,
        value = "",
        controlIterator, control, tag, paragraph, run, font;

    controlIterator = me.document.getChildNodes(Packages.com.aspose.words.NodeType.STRUCTURED_DOCUMENT_TAG, true).iterator();

    me.logger.debug("Fill content controls: objId=" + me.objId);
    me.logger.debug("Library: " + Packages.com.aspose.words.BuildVersionInfo.product + ": " + Packages.com.aspose.words.BuildVersionInfo.version);

    while (controlIterator.hasNext()) {
      control = controlIterator.next();
      if ((control.sdtType != Packages.com.aspose.words.SdtType.PLAIN_TEXT) && (control.sdtType != Packages.com.aspose.words.SdtType.RICH_TEXT)) {
        me.logger.debug("Word content control not supported: title=" + control.title + ", sdtType=" + control.sdtType + ", tag=" + control.tag + ", value=" + value);
        continue;
      }

      tag = String(control.tag);
      if (tag.indexOf("{{") < 0) {
        continue;
      }

      value = sol.create("sol.common.Template", { source: tag }).apply(data);
      me.logger.debug("Fill word content control: title=" + control.title + ", sdtType=" + control.sdtType + ", level=" + control.level + ", tag=" + control.tag + ", value=" + value);

      run = new Packages.com.aspose.words.Run(me.document, value);

      if (control.parentNode.paragraphBreakFont) {
        font = control.parentNode.paragraphBreakFont;
      } else if (control && control.firstChild && control.firstChild.runs && (control.firstChild.runs.count > 0)) {
        font = control.firstChild.runs.get(0).font;
      }

      if (font) {
        me.copyProperties(font, run.font);
      }

      switch (control.level) {
        case Packages.com.aspose.words.MarkupLevel.INLINE:
          control.removeAllChildren();
          control.appendChild(run);
          break;
        case Packages.com.aspose.words.MarkupLevel.BLOCK:
          paragraph = control.childNodes.get(0);
          paragraph = new Packages.com.aspose.words.Paragraph(me.document);
          control.removeAllChildren();
          paragraph.appendChild(run);
          control.appendChild(paragraph);
          break;
        default:
          throw "Unsupported markup level";
      }
    }
  },

  /**
   * @private
   * Copies properties of Java objects
   * @param {java.lang.Object} srcObj
   * @param {java.lang.Object} dstObj
   */
  copyProperties: function (srcObj, dstObj) {
    var getterName, value;

    if (!srcObj.getClass) {
      throw "Source object must be a Java object";
    }
    if (!dstObj.getClass) {
      throw "Destination object must be a Java object";
    }
    if (srcObj.getClass().name != dstObj.getClass().name) {
      throw "Source and destination object must be of the same type";
    }

    dstObj.getClass().methods.forEach(function (method) {
      if ((method.name.indexOf("set") == 0) && (method.genericParameterTypes.length == 1)) {
        getterName = "get" + method.name.substring(3);
        value = srcObj[getterName]();
        dstObj[method.name](value);
      }
    });
  },

  /**
   * @private
   * @return {com.aspose.words.SaveOptions}
   */
  getSaveParamsPDF: function () {
    return Packages.com.aspose.words.SaveOptions.createSaveOptions(Packages.com.aspose.words.SaveFormat.PDF);
  },

  /**
   * @private
   * @return {com.aspose.words.SaveOptions}
   */
  getSaveParamsDOCX: function () {
    return Packages.com.aspose.words.SaveOptions.createSaveOptions(Packages.com.aspose.words.SaveFormat.DOCX);
  },

  /**
   * @private
   * @return {com.aspose.words.SaveOptions}
   */
  getSaveParamsHTML: function () {
    return Packages.com.aspose.words.SaveOptions.createSaveOptions(Packages.com.aspose.words.SaveFormat.HTML);
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   * @param {com.aspose.words.SaveOptions} saveParams
   */
  save: function (outputStream, saveParams) {
    var me = this,
        languageString, dictFilePath;

    if (me.hyphDicts) {
      for (languageString in me.hyphDicts) {
        dictFilePath = me.hyphDicts[languageString];
        me.logger.debug(["Set hypen dictionary: lang={0}, dictFilePath={1}", languageString, dictFilePath]);
        Packages.com.aspose.words.Hyphenation.registerDictionary(languageString, dictFilePath);
      }
    }

    me.document.save(outputStream, saveParams);
  }
});

/*
 * Represents an Excel document.
 *
 * ## Usage
 *
 * Following example shows how to open a document from the ELO repository and converts it to a pdf document.
 *
 *     var excelDocument = sol.create("sol.common.as.ExcelDocument", {});
 *
 *     excelDocument.openFromRepo({
 *       objId: "123"
 *       separator: "#"
 *     });
 *
 *     var newObjId = excelDocument.saveToRepo({
 *       format: "pdf",
 *       parentId: "ARCPATH:/Test",
 *       name: "ExcelDocument1"
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 */
sol.define("sol.common.as.ExcelDocument", {
  extend: "sol.common.as.OfficeDocument",

  /**
   * @private
   * @cfg {Array}
   * Supported destination formats
   */
  saveFormats: {
    csv: {},
    pdf: {},
    html: {},
    xlsx: {}
  },

  /**
   * @private
   */
  regions: {
    at: Packages.com.aspose.cells.CountryCode.AUSTRIA,
    be: Packages.com.aspose.cells.CountryCode.BELGIUM,
    ch: Packages.com.aspose.cells.CountryCode.SWITZERLAND,
    cz: Packages.com.aspose.cells.CountryCode.CZECH,
    de: Packages.com.aspose.cells.CountryCode.GERMANY,
    dk: Packages.com.aspose.cells.CountryCode.DENMARK,
    en: Packages.com.aspose.cells.CountryCode.USA,
    fi: Packages.com.aspose.cells.CountryCode.FINLAND,
    fr: Packages.com.aspose.cells.CountryCode.FRANCE,
    hu: Packages.com.aspose.cells.CountryCode.HUNGARY,
    it: Packages.com.aspose.cells.CountryCode.ITALY,
    nl: Packages.com.aspose.cells.CountryCode.NETHERLANDS,
    pl: Packages.com.aspose.cells.CountryCode.POLAND,
    pt: Packages.com.aspose.cells.CountryCode.PORTUGAL,
    sp: Packages.com.aspose.cells.CountryCode.SPAIN,
    tr: Packages.com.aspose.cells.CountryCode.TURKEY
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
    me.lineSeparator = java.lang.System.lineSeparator();
  },

  /**
   * @private
   * @param {java.io.InputStream} inputStream
   */
  open: function (inputStream) {
    var me = this,
        loadOptions, region;

    loadOptions = new Packages.com.aspose.cells.LoadOptions();

    if (me.openExtension && (me.openExtension.toLowerCase() == "csv")) {
      loadOptions = new Packages.com.aspose.cells.TxtLoadOptions(Packages.com.aspose.cells.FileFormatType.CSV);
      loadOptions.separatorString = me.openSeparator || ";";
    }

    me.workbook = new Packages.com.aspose.cells.Workbook(inputStream, loadOptions);

    if (me.language) {
      me.logger.debug(["Open workbook: language={0}, aspose.region={1}", me.language, region]);
      region = me.regions[me.language];
      me.workbook.settings.region = region;
    }
  },

  /**
   * @private
   * @return {Packages.com.aspose.cells.TxtSaveOptions}
   */
  getSaveParamsCSV: function () {
    var txtSaveOptions = new Packages.com.aspose.cells.TxtSaveOptions();
    txtSaveOptions.separator = ";";
    return txtSaveOptions;
  },

  /**
   * @private
   * @return {com.aspose.cells.PdfSaveOptions}
   */
  getSaveParamsPDF: function () {
    return new Packages.com.aspose.cells.PdfSaveOptions();
  },

  /**
   * @private
   * @return {com.aspose.cells.HtmlSaveOptions}
   */
  getSaveParamsHTML: function () {
    return new Packages.com.aspose.cells.HtmlSaveOptions();
  },

  /**
   * @private
   * @return {Number}
   */
  getSaveParamsXLSX: function () {
    return Packages.com.aspose.cells.SaveFormat.XLSX;
  },

  /**
   * Returns the excel cells
   * @param {} sheetIndex
   * @return {com.aspose.cells.Cells} Cells
   */
  getCells: function (sheetIndex) {
    var me = this,
        workSheet, cells;

    sheetIndex = sheetIndex || 0;

    workSheet = me.workbook.worksheets.get(sheetIndex);
    cells = workSheet.cells;

    return cells;
  },

  /**
   * Returns table data
   * @param {Object} params Parameters
   * @param {Number} [params.sheetIndex=0]
   * @param {String} [params.startRowIndex=0] Start row index
   * @param {String} [params.startColumnIndex=0] Start row index
   * @param {Object} columns Column names
   * @param {Objekt} columns.key Column key
   * @param {Object} columns.type Colum type, e.g. 'String', 'Date'
   * @param {Object} Table data
   */
  getTableData: function (params) {
    var me = this,
        column, cells, rowIndex, stringValue, value, rowData, rowEmpty, cell, result, i,
        dateTime;

    params = params || {};
    params.sheetIndex = params.sheetIndex || 0;
    params.startColumnIndex = params.startColumnIndex || 0;
    params.columnNames = params.columnNames || [];

    rowIndex = params.startRowIndex || 0;

    result = { data: [] };

    cells = me.getCells(params.sheetIndex);

    do {
      rowData = {};
      rowEmpty = true;
      for (i = 0; i < params.columns.length; i++) {
        column = params.columns[i];
        cell = cells.getCell(rowIndex, params.startColumnIndex + i);
        stringValue = cell.stringValueWithoutFormat + "";
        value = "";

        column.type = column.type || "String";

        if (stringValue) {
          switch (column.type.toUpperCase()) {
            case "DATE": {
              dateTime = cell.dateTimeValue;
              value = Packages.org.apache.commons.lang3.time.DateFormatUtils.format(dateTime.toDate(), "yyyyMMdd") + "";
              break;
            }
            default: {
              value = cell.stringValueWithoutFormat + "";
              break;
            }
          }

          rowData[column.key] = value;
          rowEmpty = false;
        } else {
          rowData[column.key] = "";
        }
      }

      if (!rowEmpty) {
        result.data.push(rowData);
      }
      rowIndex++;
    } while (!rowEmpty);

    return result;
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   * @param {com.aspose.cells.SaveOptions|Number} saveParams
   */
  save: function (outputStream, saveParams) {
    var me = this;
    me.workbook.save(outputStream, saveParams);
  }
});

/*
 * Represents a PowerPoint document.
 *
 * ## Usage
 *
 * Following example shows how to open a document from the ELO Repository and converts it to a pdf document.
 *
 *     var powerPointDocument = sol.create("sol.common.as.PowerPointDocument", {});
 *     powerPointDocument.openFromRepo({
 *       objId: "123"
 *     });
 *
 *     var newObjId = powerPointDocument.saveToRepo({
 *       format: "pdf",
 *       parentId: "ARCPATH:/Test",
 *       name: "PowerPointDocument1"
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 */
sol.define("sol.common.as.PowerPointDocument", {
  extend: "sol.common.as.OfficeDocument",

  /**
   * @cfg {Object}
   * Supported destination formats
   */
  saveFormats: {
    pdf: {},
    html: {}
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * @private
   * @param {java.io.InputStream} inputStream
   */
  open: function (inputStream) {
    var me = this;
    me.presentation = new Packages.com.aspose.slides.Presentation(inputStream);
  },

  /**
   * @private
   * @return {Number}
   */
  getSaveParamsPDF: function () {
    return Packages.com.aspose.slides.SaveFormat.Pdf;
  },

  /**
   * @private
   * @return {Number}
   */
  getSaveParamsHTML: function () {
    return Packages.com.aspose.slides.SaveFormat.Html;
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   * @param {Number} saveParams
   */
  save: function (outputStream, saveParams) {
    var me = this;
    me.presentation.save(outputStream, saveParams);
  }
});

/*
 * Represents an Outlook message (MSG).
 *
 * ## Usage
 *
 * Following example shows how to open an email from the ELO Repository and converts it to a pdf document.
 *
 *     var mapiMessage = sol.create("sol.common.as.MapiMessage", {});
 *
 *     mapiMessage.openFromRepo({
 *       objId: "123"
 *     });
 *
 *     var newObjId = mapiMessage.saveToRepo({
 *       format: "pdf",
 *       parentId: "ARCPATH:/Test",
 *       name: "MapiMessage1"
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 */
sol.define("sol.common.as.MapiMessage", {
  extend: "sol.common.as.OfficeDocument",

  /**
   * @private
   * @cfg {Object}
   * Supported destination formats
   */
  saveFormats: {
    pdf: {}
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * @private
   * @param {java.io.InputStream} inputStream
   */
  open: function (inputStream) {
    var me = this;
    me.mailMessage = new Packages.com.aspose.email.MailMessage.load(inputStream);
  },

  /**
   * @private
   * @return {String}
   */
  getSaveParamsPDF: function () {
    return "PDF";
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   * @param {String} saveParams
   */
  save: function (outputStream, saveParams) {
    var me = this;
    if (saveParams == "PDF") {
      me.savePDF(outputStream);
    }
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   */
  savePDF: function (outputStream) {
    var me = this,
        mhtmlOutputStream, loadOptions, mhtmlInputStream, wordDocument, saveOptions;

    mhtmlOutputStream = new ByteArrayOutputStream();
    saveOptions = Packages.com.aspose.email.SaveOptions.createSaveOptions(Packages.com.aspose.email.MailMessageSaveType.getMHtmlFormat());
    me.mailMessage.save(mhtmlOutputStream, saveOptions);
    mhtmlOutputStream.close();
    loadOptions = new Packages.com.aspose.words.LoadOptions();
    loadOptions.loadFormat = Packages.com.aspose.words.LoadFormat.MHTML;
    mhtmlInputStream = new ByteArrayInputStream(mhtmlOutputStream.toByteArray());
    wordDocument = new Packages.com.aspose.words.Document(mhtmlInputStream, loadOptions);
    mhtmlInputStream.close();
    wordDocument.save(outputStream, Packages.com.aspose.words.SaveFormat.PDF);
  }
});

/*
 * Represents a Visio document.
 *
 * ## Usage
 *
 * Following example shows how to open a document from the ELO repository and converts it to a pdf document.
 *
 *     var visioDocument = sol.create("sol.common.as.VisioDocument", {});
 *
 *     visioDocument.openFromRepo({
 *       objId: "123"
 *     });
 *
 *     var newObjId = visioDocument.saveToRepo({
 *       format: "pdf",
 *       parentId: "ARCPATH:/Test",
 *       name: "VisioDocument1"
 *     });
 *
 * @author MV, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 *
 */
sol.define("sol.common.as.VisioDocument", {

  extend: "sol.common.as.OfficeDocument",

  /**
   * @private
   * @cfg {Object}
   * Supported destination formats
   */
  saveFormats: {
    pdf: {}
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * @private
   * @param {java.io.InputStream} inputStream
   */
  open: function (inputStream) {
    var me = this;
    me.diagram = new Packages.com.aspose.diagram.Diagram(inputStream);
  },

  /**
   * @private
   * @return {com.aspose.diagram.DiagramSaveOptions}
   */
  getSaveParamsPDF: function () {
    return Packages.com.aspose.diagram.SaveFileFormat.PDF;
  },

  /**
   * @private
   * @param {java.io.OutputStream} outputStream
   * @param {com.aspose.diagram.DiagramSaveOptions} saveParams
   */
  save: function (outputStream, saveParams) {
    var me = this;
    me.diagram.save(outputStream, saveParams);
  }
});
