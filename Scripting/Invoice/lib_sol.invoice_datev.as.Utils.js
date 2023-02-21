
//@include lib_Class.js.js

/**
 * Contains utility functions for the datev exporter
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.invoice_datev.exporter.Config
 * @eloas
 */
sol.define("sol.invoice_datev.as.Utils", {
  singleton: true,

  /**
   * Retrieves a localized text for the default language
   * @param {String} text text-key
   * @return {String} localized text
   */
  getLanguageText: function (text) {
    var me = this,
        lng, translationObj, translationtext, invoiceDatevConfig;

    invoiceDatevConfig = me.getConfig();

    lng = invoiceDatevConfig.Parameter.DefaultLanguage;
    if (!lng) {
      lng = "EN";
    }

    translationObj = invoiceDatevConfig.Language[text];

    if (!translationObj) {
      return "";
    }

    translationtext = translationObj[lng];
    if (!translationtext) {
      translationtext = "'" + text + "' is not defined";
    }
    return translationtext;
  },

  /**
   * Retrieves a localized text for the default language for HTML output
   * @param {String} text text-key
   * @return {String} localized text
   */
  getLanguageTextEscapeHTML: function (text) {
    var me = this;
    return Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(me.getLanguageText(text));
  },

  /**
   * Gets text value for a field
   * @param {Number}  length        maximum field length
   * @param {String}  fieldValue    value of this field
   * @param {Boolean} requiredfield true if field is mandatory
   * @return {String} field text
   */
  getTextValue: function (length, fieldValue, requiredfield) {
    var me = this,
        l;

    fieldValue += "";

    // check if field is mandatory
    if (!fieldValue) {
      if (requiredfield) {
        return me.getMessage("VM");
      }
      return "";
    }
    l = fieldValue.length;
    if (l > length) {
      return me.getMessage("TTL");
    }
    return "\"" + fieldValue + "\"";
  },

  /**
   * Gets a date field value
   * @param {Number}  length          maximum field length
   * @param {String}  fieldValue      value of this field
   * @param {Boolean} requiredfield   true of field is mandatory
   * @return {String} field value as date
   */
  getDateValue: function (length, fieldValue, requiredfield) {
    var me = this,
        isISODate, l, JJJJ, MM, TT;

    // check if field is mandatory
    if (!fieldValue) {
      if (requiredfield) {
        return me.getMessage("VM");
      }
      return "";
    }
    // check if field is valid ISO date
    isISODate = false;
    l = fieldValue.length();
    if (l == 14) {
      isISODate = Packages.org.apache.commons.lang.time.DateUtils.parseDate(fieldValue, ["yyyyMMddHHmmss"]);
    }
    if (l == 8) {
      isISODate = Packages.org.apache.commons.lang.time.DateUtils.parseDate(fieldValue, ["yyyyMMdd"]);
    }
    if (!isISODate) {
      return me.getMessage("NVD");
    }
    // valid ISO date, returns date in datev format
    JJJJ = fieldValue.substr(0, 4);
    MM = fieldValue.substr(4, 2);
    TT = fieldValue.substr(6, 2);
    if (length == 4) {
      fieldValue = TT + MM;
      return "\"" + fieldValue + "\"";
    }
    if (length == 8) {
      fieldValue = TT + MM + JJJJ;
      return "\"" + fieldValue + "\"";
    }
    return fieldValue;
  },

  /**
   * Returns the document within an invoice container
   * @param {de.elo.ix.client.Sord} sord Sord
   * @return {de.elo.ix.client.Sord} Document sord
   */
  getDocument: function (sord) {
    var children;

    if (!sord) {
      throw "Parent sord is empty";
    }

    children = sol.common.RepoUtils.findChildren(sord.id, { includeDocuments: true, includeFolders: false });

    if (children.length > 0) {
      return children[0];
    }
  },

  /**
   * Returns a filled template string
   * @param {String} fieldConfig Parameters
   * @param {String} fieldConfig.templateString Tempate string
   * @param {de.elo.ix.client.Sord} fieldConfig.sord Sord
   * @return {String} Filled template string
   */
  getTemplateValue: function (fieldConfig) {
    var value;

    if (!fieldConfig.templateString) {
      throw "Template string is empty";
    }
    if (!fieldConfig.sord) {
      throw "Sord is missing";
    }
    value = '"' + sol.create("sol.common.Template", { source: fieldConfig.templateString }).applySord(fieldConfig.sord) + '"';

    return value;
  },

  /**
   * Retrieves left padding s with c to a total of n chars
   * @param {String} s string
   * @param {String} c padding char
   * @param {String} n number of chars
   * @return {String} s string after padding
   */
  padding_left: function (s, c, n) {
    var max, i;

    if (!s || !c || s.length() >= n) {
      return s;
    }
    max = (n - s.length()) / c.length();
    for (i = 0; i < max; i++) {
      s = c + s;
    }
    return s;
  },

  /**
   * Retrieves right padding s with c to a total of n chars
   * @param {String} s string
   * @param {String} c padding char
   * @param {String} n number of chars
   * @return {String} s string after padding
   */
  padding_right: function (s, c, n) {
    var max, i;

    if (!s || !c || s.length() >= n) {
      return s;
    }
    max = (n - s.length()) / c.length();
    for (i = 0; i < max; i++) {
      s += c;
    }
    return s;
  },

  /**
   * Removes colons from a string
   * @param {String} str String with colons
   * @return {String} String without colons
   */
  dismissColon: function (str) {
    var regex;

    regex = new RegExp("([\"])", "gi");
    while (str.match(regex)) {
      str = str.replace("\"", "");
    }
    return str;
  },

  /**
   * Checks if a file path already exists
   * @param {String} windowsPath file path
   * @return {Boolean} true if path exists
   */
  existsWindowsPath: function (windowsPath) {
    var dir;

    dir = new File(windowsPath);
    return dir.exists();
  },

  /**
   * Gets the value of a field
   * @param {Object} fieldConfig Configuration
   * @param {String} fieldConfig.type Field type as defined by Config.MappingBelege
   * @param {Number} fieldConfig.length Field max length as defined by Config.MappingBelege
   * @param {String} fieldConfig.nks Field nks as defined by Config.MappingBelege
   * @param {String} fieldConfig.key Group name of the elo field
   * @param {String} fieldConfig.eloData Elo data (objKey) as string
   * @param {Object} fieldConfig.sord Current sord is represented by de.elo.ix.client.Sord
   * @param {Boolean} fieldConfig.requiredfield True if field is mandatory
   * @param {Boolean} fieldConfig.template Template string
   * @return {String} Field value
   */
  getFieldValue: function (fieldConfig) {
    var me = this,
        value = "",
        mapIndex, valueWithoutQuotes, documentSord;

    switch (fieldConfig.type) {
      case "Text":
        if (fieldConfig.key == "Sord.name") {
          value = '"' + fieldConfig.sord.name + '"';
        } else {
          value = me.getTextValue(fieldConfig.length, fieldConfig.eloData, fieldConfig.requiredfield);
        }
        break;
      case "Datum":
        value = me.getDateValue(fieldConfig.length, fieldConfig.eloData, fieldConfig.requiredfield);
        break;
      case "Betrag":
        value = me.getNumericValue(fieldConfig.length, fieldConfig.nks, fieldConfig.eloData, fieldConfig.requiredfield);
        break;
      case "Zahl":
        value = me.getDateValue(fieldConfig.length, fieldConfig.eloData, fieldConfig.requiredfield);
        break;
      case "Konto":
        value = me.getDateValue(fieldConfig.length, fieldConfig.eloData, fieldConfig.requiredfield);
        break;
      case "Template":
        value = me.getTemplateValue(fieldConfig);
        break;
      case "Ignore":
        value = undefined;
        break;
      case "DocumentTemplate":
        documentSord = me.getDocument(fieldConfig.sord);
        if (documentSord) {
          fieldConfig.sord = documentSord;
          value = me.getTemplateValue(fieldConfig);
        }
        break;
      default:
        throw "Unkown field type: key=" + fieldConfig.eloGroup + ", type=" + fieldConfig.type;
    }

    if (fieldConfig.mapFrom && fieldConfig.mapTo) {
      valueWithoutQuotes = sol.common.StringUtils.replaceAll(value, '"', "");
      mapIndex = fieldConfig.mapFrom.indexOf(valueWithoutQuotes);
      if (mapIndex > -1) {
        value = '"' + fieldConfig.mapTo[mapIndex] + '"';
      }
    }

    return value;
  },

  /**
   * Gets the value of a field based on its elo group name
   * @param {Object}   objKey indexvalue represented by de.elo.ix.client.ObjKey
   * @param {Object}   sord   current dataset represented by de.elo.ix.client.Sord
   * @return {String} field value
   */
  getFieldValueFromEloGroup: function (objKey, sord) {
    var me = this,
        logger, requiredField, fieldValue, eloData, eloGroup, keyFieldName, invoiceDatevConfig, fieldDefinition,
        type, length, nks, templateString;

    logger = sol.create("sol.Logger", { scope: me.$className });

    eloGroup = objKey.name + "";
    invoiceDatevConfig = me.getConfig();

    for (keyFieldName in invoiceDatevConfig.MappingBelege) {
      if (invoiceDatevConfig.MappingBelege[keyFieldName].elogroup == eloGroup) {
        fieldDefinition = invoiceDatevConfig.MappingBelege[keyFieldName];
        break;
      }
    }
    if (!fieldDefinition) {
      logger.info(["Field definition '{0}' is missing", eloGroup]);
      return "";
    }

    type = fieldDefinition.type || "Text";
    length = fieldDefinition.length;
    nks = fieldDefinition.nks;
    templateString = fieldDefinition.templateString;

    requiredField = (invoiceDatevConfig.MappingBelege[keyFieldName].required == "Ja");
    eloData = (objKey && objKey.data && (objKey.data.length > 0)) ? objKey.data[0] : "";
    if (type == "Datum") {
      length = 8;
    }
    fieldValue = me.getFieldValue({ type: type, length: length, nks: nks, key: eloGroup, eloData: eloData, sord: sord, requiredField: requiredField, templateString: templateString });

    return fieldValue;
  },

  /**
   * Gets the value of a field based on its elo map item id
   * @param {Object}   mapItem mapvalue represented by de.elo.ix.client.KeyValue
   * @param {Object}   sord   current dataset represented by de.elo.ix.client.Sord
   * @return {String} field value
   */
  getFieldValueFromMapItem: function (mapItem, sord) {
    var me = this,
        type, length, nks, requiredField, fieldValue, eloData, keyFieldName, invoiceDatevConfig, templateString;

    invoiceDatevConfig = me.getConfig();

    for (keyFieldName in invoiceDatevConfig.MappingBelege) {
      if (invoiceDatevConfig.MappingBelege[keyFieldName].elogroup == mapItem.key) {
        break;
      }
    }
    type = invoiceDatevConfig.MappingBelege[keyFieldName].type;
    length = invoiceDatevConfig.MappingBelege[keyFieldName].length;
    nks = invoiceDatevConfig.MappingBelege[keyFieldName].nks;
    requiredField = (invoiceDatevConfig.MappingBelege[keyFieldName].required == "Ja");
    eloData = mapItem.value;
    if (type == "Datum") {
      length = 8;
    }
    templateString = invoiceDatevConfig.MappingBelege[keyFieldName].templateString;
    fieldValue = me.getFieldValue({ type: type, length: length, nks: nks, key: mapItem.key, eloData: eloData, sord: sord, requiredField: requiredField, templateString: templateString });
    return fieldValue;
  },

  /**
   * Gets and normalizes a numeric field value
   * @param {String} vks precomma digits
   * @param {String} nks postcomma digits
   * @param {String} fieldValue value of the field
   * @param {Boolean} requiredfield true field is mandatory
   * @return {String} numeric field value
   */
  getNumericValue: function (vks, nks, fieldValue, requiredfield) {
    var me = this,
        val1, val2, val1Length, val2Length, l;

    if (!fieldValue) {
      if (requiredfield) {
        return me.getMessage("VM");
      }
      return "";
    }
    // replace decimalpoint
    fieldValue = fieldValue.replace(".", ",");
    // check if field is numeric
    val1 = fieldValue.replace(",", ".");
    if (isNaN(val1)) {
      return me.getMessage("NVN");
    }
    // check if field is integer
    l = fieldValue.length();
    if (nks == 0) {
      if (l > vks) {
        return me.getMessage("NTL");
      }
      return fieldValue;
    }
    // number contains decimalpoint
    if (fieldValue.split(".").length == 2) {
      val1 = fieldValue.split(".")[0];
      val2 = fieldValue.split(".")[1];
    }
    if (fieldValue.split(",").length == 2) {
      val1 = fieldValue.split(",")[0];
      val2 = fieldValue.split(",")[1];
    }
    // adjust number to amount postcomma digits
    if (fieldValue.split(",").length != 2) {
      if (fieldValue.split(".").length != 2) {
        // if no postcomma digits are avaible
        if (fieldValue.indexOf(",") == -1) {
          if (fieldValue.indexOf(".") == -1) {
            if (l > vks) {
              return me.getMessage("NTL");
            }
            fieldValue += ",";
            fieldValue += sol.invoice_datev.as.Utils.padding_right(fieldValue, "0", nks);
            return fieldValue;
          }
        }
      }
    }
    val1Length = val1.length();
    val2Length = val2.length();
    if (val1Length > vks) {
      val1 = val1.substr(val1Length - vks);
    }
    if (val2Length > nks) {
      val2 = val2.substr(1, nks);
    }
    fieldValue = val1 + "," + val2;
    return fieldValue;
  },

  /**
   * Files a new document in elo
   * @param {String} arcPathDatevExport elo archive path to the file
   * @param {String} datevFileName      name of the file
   * @param {String} datevFileExtension file extension
   * @param {String} datevFileContent   content that should be written
   */
  createArchiveDocument: function (arcPathDatevExport, datevFileName, datevFileExtension, datevFileContent) {
    var me = this,
        datevFile, editInfo, sord, document, docVersion, url, uploadResult, logger;

    logger = sol.create("sol.Logger", { scope: me.$className });
    logger.enter("createArchiveDocument");
    logger.info(["createArchiveDocument(arcPathDatevExport = {0}, datevFileName = {1}, datevFileExtension = {2}, datevFileContent = {3})", arcPathDatevExport, datevFileName, datevFileExtension, datevFileContent]);

    datevFile = File.createTempFile(datevFileName, "." + datevFileExtension);
    FileUtils.writeStringToFile(datevFile, datevFileContent, "ISO-8859-1");

    editInfo = ixConnect.ix().checkoutDoc(arcPathDatevExport, null, EditInfoC.mbSordDoc, LockC.NO);
    sord = editInfo.sord;

    editInfo = ixConnect.ix().createDoc(sord.id, "", null, EditInfoC.mbAll);
    sord = editInfo.sord;
    sord.name = datevFileName;

    document = new Document();
    docVersion = new DocVersion();
    docVersion.pathId = sord.path;
    docVersion.encryptionSet = sord.details.encryptionSet;
    docVersion.ext = datevFileExtension;
    document.docs = [docVersion];
    document = ixConnect.ix().checkinDocBegin(document);

    docVersion = document.docs[0];
    url = docVersion.url;
    uploadResult = ixConnect.upload(url, datevFile);
    docVersion.uploadResult = uploadResult;

    ixConnect.ix().checkinDocEnd(sord, SordC.mbAll, document, LockC.NO);
    logger.info(["{0}.{1} {2}!", datevFileName, datevFileExtension, sol.invoice_datev.as.Utils.getLanguageText("Created")]);
    logger.exit("createArchiveDocument");
  },

  /**
   * Files a new document in a directory on the local machine
   * @param {String} windowsPathDatevExport folder path
   * @param {String} datevFileName          name of the file
   * @param {String} datevFileExtension     file extension
   * @param {String} datevFileContent       content that should be written
   */
  createWindowsDocument: function (windowsPathDatevExport, datevFileName, datevFileExtension, datevFileContent) {
    var me = this,
        windowsFile, logger;

    logger = sol.create("sol.Logger", { scope: me.$className });
    logger.enter("createWindowsDocument");
    logger.info(["createWindowsDocument(windowsPathDatevExport = {0}, datevFileName = {1}, datevFileExtension = {2}, datevFileContent = {3})", windowsPathDatevExport, datevFileName, datevFileExtension, datevFileContent]);

    windowsFile = new File(windowsPathDatevExport + File.separator + datevFileName + "." + datevFileExtension);
    FileUtils.writeStringToFile(windowsFile, datevFileContent, "ISO-8859-1");

    logger.info(["{0}.{1} {2}!", datevFileName, datevFileExtension, sol.invoice_datev.as.Utils.getLanguageText("Created")]);
    logger.exit("createWindowsDocument");
  },

  /**
   * Set content texts for datev MappingBelege
   */
  setContentTextsDatevMappingBelege: function () {
    var me = this;

    me.getConfig();

    me.setContent("Währung", "WKZ | " + me.getLanguageText("PM") + ": EUR, CAD, CHF, CZK, DKK, GBP, HKD, HUF, JPY, NOK, PLN, SEK, TND und USD");
    me.setContent("VorzBetrag", "„" + me.getLanguageText("AM") + " | " + me.getLanguageText("ML") + " 10,2 | " + me.getLanguageText("DP") + " = , | " + me.getLanguageText("NTP"));
    me.setContent("RechNr", me.getLanguageText("ML") + " 12 | " + me.getLanguageText("AN"));

    me.setContent("Belegdatum", "ttmm | " + me.getLanguageText("ML") + " 4 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("NOS"));
    me.setContent("InterneRechNr", me.getLanguageText("ML") + " 12 | " + me.getLanguageText("AN"));
    me.setContent("LieferantName", me.getLanguageText("ML") + " 40 | " + me.getLanguageText("AN"));
    me.setContent("LieferantOrt", me.getLanguageText("ML") + " 30 | " + me.getLanguageText("AN"));
    me.setContent("LieferantKonto", me.getLanguageText("ML") + " 9 (" + me.getLanguageText("IBL") + " 10) | " + me.getLanguageText("NU") + " | " + me.getLanguageText("LDLA"));
    me.setContent("BU", me.getLanguageText("ML") + " 2 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("PBUK") + ": 7 - 9, 17 - 19, 40, 50 - 59, 91 - 95, 97 - 99");
    me.setContent("Konto", me.getLanguageText("ML") + " 8 (" + me.getLanguageText("IBL") + " 9| " + me.getLanguageText("NU") + " | " + me.getLanguageText("LDLA"));
    me.setContent("Kontobezeichnung", me.getLanguageText("ML") + " 30 | " + me.getLanguageText("AN"));
    me.setContent("Ware/Leistung", me.getLanguageText("ML") + " 30 | " + me.getLanguageText("AN"));
    me.setContent("Fällig_am", "ttmmjjjj | " + me.getLanguageText("ML") + " 8 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("NOS"));
    me.setContent("gezahlt_am", "ttmm | " + me.getLanguageText("ML") + " 8 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("NOS"));
    me.setContent("UStSatz", "Max-L&auml;nge 5 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("DP") + " = ,");
    me.setContent("USt-IdNr. Lieferant", me.getLanguageText("ML") + " 15 | " + me.getLanguageText("AN"));
    me.setContent("Kunden-Nr.", me.getLanguageText("ML") + " 15 | " + me.getLanguageText("AN"));
    me.setContent("KOST1", me.getLanguageText("ML") + " 8 | " + me.getLanguageText("AN"));
    me.setContent("KOST2", me.getLanguageText("ML") + " 8 | " + me.getLanguageText("AN"));
    me.setContent("KOSTmenge", me.getLanguageText("ML") + " 9,2 | " + me.getLanguageText("DP") + " = , | " + me.getLanguageText("NTP"));
    me.setContent("Kurs", me.getLanguageText("ML") + " 4,6 | " + me.getLanguageText("DP") + " = , | " + me.getLanguageText("NTP"));
    me.setContent("Skonto", me.getLanguageText("ML") + " 8,2 | " + me.getLanguageText("DP") + " = , | " + me.getLanguageText("NTP"));
    me.setContent("Nachricht", me.getLanguageText("ML") + " 120 | " + me.getLanguageText("AN"));
    me.setContent("Skto_Fällig_am", "ttmmjjjj | " + me.getLanguageText("ML") + " 8 | " + me.getLanguageText("NU") + " | " + me.getLanguageText("NOS") + " " + me.getLanguageText("Also") + " tt.mm.jjjj :" + me.getLanguageText("DIAO") + " ");
    me.setContent("BankKonto", me.getLanguageText("ACNU") + " " + me.getLanguageText("ML") + " 10 | " + me.getLanguageText("NU"));
    me.setContent("BankBlz", me.getLanguageText("BACO") + " " + me.getLanguageText("ML") + " 8 | " + me.getLanguageText("NU"));
    me.setContent("Bankname", me.getLanguageText("ML") + " 27 | " + me.getLanguageText("AN"));
    me.setContent("BankIban", me.getLanguageText("ML") + " 34 | " + me.getLanguageText("AN") + " (" + me.getLanguageText("GER") + ": 22 | " + me.getLanguageText("AN") + ")");
    me.setContent("BankBic", me.getLanguageText("ML") + " 11 | " + me.getLanguageText("AN"));
  },

  /**
   * @private
   * Sets the content
   * @param {String} columnName Column name
   * @param {String} content Content
   */
  setContent: function (columnName, content) {
    var me = this;
    if (me.invoiceDatevConfig.MappingBelege[columnName]) {
      me.invoiceDatevConfig.MappingBelege[columnName].content = content;
    }
  },

  /**
   * Returns the message text
   * @param {String} key
   * @return {String}
   */
  getMessage: function (key) {
    var me = this;
    return me.getLanguageText(key);
  },

  getConfig: function () {
    var me = this;
    me.invoiceDatevConfig = me.invoiceDatevConfig || sol.create("sol.common.Config", { compose: "/invoice_datev/Configuration/invoice_datev.config" }).config;
    return me.invoiceDatevConfig;
  }
});


