
//@include lib_Class.js

/**
 * Contains HTML-Logging capabilities.
 *
 * This class generates an HTML report.
 *
 * {@img sol.invoice.exporter.datev-example1-log-html.png image}
 *
 * <b>Only for ELOas</b>
 *
 * @author Jan-Hendrik Ruberg, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires  sol.invoice_datev.as.Utils
 * @eloas
 */
sol.define("sol.invoice_datev.as.export.HtmlLog", {
  singleton: true,

  /**
   * Creates and saves HTML-logfile
   * @param {Array} logFileTableMessages Table log protocol messages
   * @param {Date} timeDateJava Timestamp log protocol
   * @param {Number} totalDataSets Total amount data sets
   * @param {Number} correctDataSets Amount correct exported data sets
   * @param {Array} logFileTableDataSets Table log protocol exported data sets
   * @param {String} arcPathDatevExport Archive path DATEV-Export
   * @return {String} contentHTML Content of HTML-Logfile
   */
  saveExportLog: function (logFileTableMessages, timeDateJava, totalDataSets, correctDataSets, logFileTableDataSets, arcPathDatevExport) {
    var me = this,
        isoDate, f, DateTextLocal, logFileName, datevFileName, contentHTML, i, j, grpEloGuid, setTdl, windowsPathDatevExport, logger;

    logger = sol.create("sol.Logger", { scope: this.$className });
    logger.enter("saveExportLog");

    me.invoiceDatevConfig = sol.invoice_datev.as.Utils.getConfig();

    isoDate = sol.common.DateUtils.nowIso();
    f = Packages.java.text.DateFormat.getDateTimeInstance(Packages.java.text.DateFormat.FULL, Packages.java.text.DateFormat.FULL);
    if (me.invoiceDatevConfig.Parameter.DefaultLanguage == "DE") {
      f = Packages.java.text.DateFormat.getDateTimeInstance(Packages.java.text.DateFormat.FULL, Packages.java.text.DateFormat.FULL, Packages.java.util.Locale.GERMANY);
    } else {
      f = Packages.java.text.DateFormat.getDateTimeInstance(Packages.java.text.DateFormat.FULL, Packages.java.text.DateFormat.FULL, Packages.java.util.Locale.ENGLISH);
    }

    DateTextLocal = f.format(timeDateJava);

    logFileName = "LOG_" + isoDate;
    datevFileName = "DATEV_" + isoDate;

    contentHTML = "<html>" + "\r\n";
    contentHTML += "  <head>" + "\r\n";
    contentHTML += "    <title>" + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("Exportprotocol") + "</title>" + "\r\n";
    contentHTML += "  </head>" + "\r\n";
    contentHTML += "    <style>" + "\r\n";
    contentHTML += this.HTMLSTYLES.css;
    contentHTML += "    </style>" + "\r\n";

    contentHTML += "  <body>" + "\r\n";
    contentHTML += "    <h1>" + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("Exportprotocol") + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("Langfor") + " " + datevFileName + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("on") + " " + DateTextLocal + "</h1>" + "\r\n";

    // overview imported records
    if (correctDataSets != totalDataSets) {
      contentHTML += "    <p class = 'export_msg failure'>" + correctDataSets + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("totalof") + " " + totalDataSets + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("errorfreeExport") + "!" + "</p>" + "\r\n";
    } else {
      contentHTML += "    <p class = 'export_msg success'>" + correctDataSets + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("totalof") + " " + totalDataSets + " " + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("errorfreeExport") + "!" + "</p>" + "\r\n";
    }

    contentHTML += "    <div class='container'>" + "\r\n";
    contentHTML += "    <table border='2'>" + "\r\n";
    contentHTML += this.getHtmlTableColgroup(["100", "100", "100", "400", "200", "100", "100", "100", "400"]);

    for (i = 0; i < logFileTableDataSets.length; i++) {
      contentHTML += "      <tr>" + "\r\n";
      for (j = 0; j < logFileTableDataSets[i].length; j++) {
        switch (j) {
          case 0:
            contentHTML += this.getHtmlTableCell(i, "tdhl", "td1l", "td2l", "left", "top", logFileTableDataSets[i][j], i == (logFileTableDataSets.length - 1));
            break;
          case (logFileTableDataSets[i].length - 1):
            contentHTML += this.getHtmlTableCell(i, "tdhr", "td1r", "td2r", "left", "top", logFileTableDataSets[i][j], i == (logFileTableDataSets.length - 1));
            break;
          default:
            contentHTML += this.getHtmlTableCell(i, "tdh", "td1", "td2", "left", "top", logFileTableDataSets[i][j], i == (logFileTableDataSets.length - 1));
        }
      }
      contentHTML += "      </tr>" + "\r\n";
    }
    contentHTML += "    </table>" + "\r\n";
    contentHTML += "    </div>" + "\r\n";

    // errorprotocol
    contentHTML += "    <h1>" + sol.invoice_datev.as.Utils.getLanguageTextEscapeHTML("Errorprotocol") + "</h1>" + "\r\n";
    contentHTML += "    <div class='container'>" + "\r\n";
    contentHTML += "    <table border='2'>" + "\r\n";
    contentHTML += this.getHtmlTableColgroup(["100", "100", "100", "400", "100", "100", "100", "100", "400"]);

    grpEloGuid = "00";
    setTdl = false;
    for (i = 0; i < logFileTableMessages.length; i++) {
      // report GUID if group change
      if (i != 0) {
        if (logFileTableMessages[i][9] != grpEloGuid) {
          contentHTML += "      <tr>" + "\r\n";
          contentHTML += "        <td class = 'tdt' align='left' valign='top' colspan='8'>" + logFileTableMessages[i][8] + " , GUID " + logFileTableMessages[i][9] + "</td>" + "\r\n";
          contentHTML += "      </tr>" + "\r\n";
          grpEloGuid = logFileTableMessages[i][9];
        }
      }
      contentHTML += "      <tr>" + "\r\n";
      for (j = 0; j < logFileTableMessages[i].length; j++) {
        // set tdl before group change GUID and at end of table
        setTdl = false;
        if (i > 0) {
          if (i < (logFileTableMessages.length - 1)) {
            if (logFileTableMessages[i][9] != logFileTableMessages[i + 1][9]) {
              setTdl = true;
            }
          }
          if (i == (logFileTableMessages.length - 1)) {
            setTdl = true;
          }
        }

        switch (j) {
          case 0: // row
            contentHTML += this.getHtmlTableCell(i, "tdhl", "td1l", "td2l", "right", "top", logFileTableMessages[i][j], setTdl);
            break;
          case 1: // column
            contentHTML += this.getHtmlTableCell(i, "tdh", "td1", "td2", "right", "top", logFileTableMessages[i][j], setTdl);
            break;
          case 6: // message
            contentHTML += this.getHtmlTableCell(i, "tdh", "td1red", "td2red", "left", "top", logFileTableMessages[i][j], setTdl);
            break;
          case 7: // datev fieldcontent
            contentHTML += this.getHtmlTableCell(i, "tdhr", "td1violet", "td2violet", "left", "top", logFileTableMessages[i][j], setTdl);
            break;
          case 8: // report elo document if group change
            break;
          case 9: // report elo guid if group change
            break;
          default:
            contentHTML += this.getHtmlTableCell(i, "tdh", "td1", "td2", "left", "top", logFileTableMessages[i][j], setTdl);
        }
      }
      contentHTML += "      </tr>" + "\r\n";
    }
    contentHTML += "    </table>" + "\r\n";
    contentHTML += "    </div>" + "\r\n";

    contentHTML += "  </body>" + "\r\n";
    contentHTML += "</html>";

    // save contentHTML in archive and windows directory
    if (me.invoiceDatevConfig.Parameter.storeDatexHtmlLogInElo) {
      sol.invoice_datev.as.Utils.createArchiveDocument(arcPathDatevExport, logFileName, "html", contentHTML);
    }

    windowsPathDatevExport = me.invoiceDatevConfig.Parameter.HtmlLogDirectory;
    if (sol.invoice_datev.as.Utils.existsWindowsPath(windowsPathDatevExport)) {
      sol.invoice_datev.as.Utils.createWindowsDocument(windowsPathDatevExport, logFileName, "html", contentHTML);
    }

    logger.exit("saveExportLog", contentHTML);
    return contentHTML;
  },

  /**
   * HTML Table Colgroup
   * @param  {String[]}  colsWidth  column width
   * @return {String} styletext HTML-Style tags
   */
  getHtmlTableColgroup: function (colsWidth) {
    var i, styletext;

    i = 0;
    styletext = "      <colgroup>" + "\r\n";
    for (i = 0; i < colsWidth.length; i++) {
      styletext += "        <col width='" + colsWidth[i] + "'>" + "\r\n";
    }
    styletext += "      </colgroup>" + "\r\n";
    return styletext;
  },

  /**
   * HTML Table Cell
   * @param  {Number}  line  actual row number
   * @param  {String}  classnTdh  style class table cell
   * @param  {String}  classnTd1  style class table cell
   * @param  {String}  classnTd2  style class table cell
   * @param  {String}  alignTd    alignment table cell
   * @param  {String}  valignTd   vertical alignment table cell
   * @param  {String}  valueTd    value table cell
   * @param  {Boolean} boolTdl    status style group change
   * @return {String} styletext HTML-Style tags
   */
  getHtmlTableCell: function (line, classnTdh, classnTd1, classnTd2, alignTd, valignTd, valueTd, boolTdl) {
    var styletext = "";

    if (boolTdl) {
      classnTdh += " tdl";
      classnTd1 += " tdl";
      classnTd2 += " tdl";
    }

    valueTd = Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(valueTd);

    // Header
    if (line == 0) {
      styletext = "        <td class = '" + classnTdh + "' align='" + alignTd + "' valign='" + valignTd + "'>" + valueTd + "</td>" + "\r\n";
    } else {
      if ((line % 2) == 1) {
        styletext = "       <td class = '" + classnTd1 + "' align='" + alignTd + "' valign='" + valignTd + "'>" + valueTd + "</td>" + "\r\n";
      } else {
        styletext = "       <td class = '" + classnTd2 + "' align='" + alignTd + "' valign='" + valignTd + "'>" + valueTd + "</td>" + "\r\n";
      }
    }
    return styletext;
  },

  /**
   * HTML-Styles body
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleBody: function () {
    var styletext = "      body {" + "\r\n";

    styletext += "      font-family: 'Segoe UI', Verdana, 'sans serif';" + "\r\n";
    styletext += "      margin: 15px;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles table
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleTable: function () {
    var styletext = "      table {" + "\r\n";

    styletext += "      padding-left: 10px;" + "\r\n";
    styletext += "      border-width: 0px;" + "\r\n";
    styletext += "      border-collapse: collapse;" + "\r\n";
    styletext += "      border-color: #F2F2F2;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles table td
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleTableTd: function () {
    var styletext = "      table td {" + "\r\n";

    styletext += "      padding: 3px 7px;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles table tr
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleTableTr: function () {
    var styletext = "      table tr {" + "\r\n";

    styletext += "      white-space: nowrap;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles Classes td
   * @param   {String} classnTd        Classname
   * @param   {String} fontweight      font-weight
   * @param   {String} padding         padding
   * @param   {String} fontcolor       color text
   * @param   {String} backgroundcolor color background
   * @param   {Object} borderwidth     JSON-Object {top: t, left: l, right: r, bottom: b}
   * @param   {Object} bordercolor     JSON-Object {top: t, left: l, right: r, bottom: b}
   * @return  {String} styletext HTML-Style tags
   */
  getHtmlStyleClassesTd: function (classnTd, fontweight, padding, fontcolor, backgroundcolor, borderwidth, bordercolor) {
    var styletext = "     ." + classnTd + " {";

    if (fontweight) {
      styletext += "      font-weight:" + fontweight + ";" + "\r\n";
    }
    if (padding) {
      styletext += "      padding:" + padding + ";" + "\r\n";
    }
    if (fontcolor) {
      styletext += "      color: " + fontcolor + ";" + "\r\n";
    }
    if (backgroundcolor) {
      styletext += "      background-color: " + backgroundcolor + ";" + "\r\n";
    }
    if (borderwidth) {
      styletext += "      border-top-width: " + borderwidth.top + ";" + "\r\n";
      styletext += "      border-left-width: " + borderwidth.left + ";" + "\r\n";
      styletext += "      border-right-width: " + borderwidth.right + ";" + "\r\n";
      styletext += "      border-bottom-width: " + borderwidth.bottom + ";" + "\r\n";
    }
    if (bordercolor) {
      styletext += "      border-top-color: " + bordercolor.top + ";" + "\r\n";
      styletext += "      border-left-color: " + bordercolor.left + ";" + "\r\n";
      styletext += "      border-right-color: " + bordercolor.right + ";" + "\r\n";
      styletext += "      border-bottom-color: " + bordercolor.bottom + ";" + "\r\n";
    }
    styletext += "      border-style: solid;" + "\r\n";
    styletext += "      border-collapse: collapse;" + "\r\n";
    styletext += "    }" + "\r\n";

    return styletext;
  },

  /**
   * HTML-Attributes top. left, right, bottom
   * @param   {String} t top
   * @param   {String} l left
   * @param   {String} r right
   * @param   {String} b bottom
   * @return  {Object} attrib JSON-Object {top: t, left: l, right: r, bottom: b}
   */
  getTLRB: function (t, l, r, b) {
    var attrib;

    attrib = {
      top: t,
      left: l,
      right: r,
      bottom: b
    };

    return attrib;
  },

  /**
   * HTML-Styles Classes tdl
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleClassesTdl: function () {
    var styletext = "     .tdl {";

    styletext += "      border-bottom-color: #dcdcdc;" + "\r\n";
    styletext += "      border-bottom-width: 1px;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles Classes tdt
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleClassesTdt: function () {
    var styletext = "     .tdt {";

    styletext += "      font-weight: normal;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles h1
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleH1: function () {
    var styletext = "    h1 {" + "\r\n";

    styletext += "      padding: 30px 0px 0px 0px;" + "\r\n";
    styletext += "      font-size: 28px;" + "\r\n";
    styletext += "      font-weight: 100;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles h2
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleH2: function () {
    var styletext = "    h2 {" + "\r\n";

    styletext += "      background-color: #F2F2F2;" + "\r\n";
    styletext += "      padding: 20px 15px 15px 0px;" + "\r\n";
    styletext += "      font-size: 18px;" + "\r\n";
    styletext += "      margin: 0;" + "\r\n";
    styletext += "    }" + "\r\n";
    return styletext;
  },

  /**
   * HTML-Styles Classes export_msg
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleClassesExportMsg: function () {
    var styletext = "     .export_msg {";

    styletext += "      padding: 0px 15px 25px 0px;" + "\r\n";
    styletext += "      font-size: 18px;" + "\r\n";
    styletext += "      font-weight: bold;" + "\r\n";
    styletext += "    }" + "\r\n";

    styletext += "     .export_msg.success {";
    styletext += "      color: green;" + "\r\n";
    styletext += "    }" + "\r\n";

    styletext += "     .export_msg.failure {";
    styletext += "      color: red;" + "\r\n";
    styletext += "    }" + "\r\n";

    return styletext;
  },

  /**
   * Complete HTML-Styles CSS
   * @return {String} styletext HTML-Style tags
   */
  getHtmlStyleCSS: function () {
    var styletext = [
      "     body {" + "\r\n",
      "       font-family: 'Segoe UI', Verdana, 'sans serif';" + "\r\n",
      "      margin: 15px;" + "\r\n",
      "      }" + "\r\n",
      "      table {" + "\r\n",
      "      padding-left: 10px;" + "\r\n",
      "        border-width: 0px;" + "\r\n",
      "        border-collapse: collapse;" + "\r\n",
      "      border-color: #F2F2F2;" + "\r\n",
      "      }" + "\r\n",
      "    table td {" + "\r\n",
      "      padding: 3px 7px;" + "\r\n",
      "    }" + "\r\n",
      "    table tr {" + "\r\n",
      "      white-space: nowrap;" + "\r\n",
      "    }" + "\r\n",
      "      .tdt," + "\r\n",
      "    .tdh," + "\r\n",
      "    .tdhr," + "\r\n",
      "    .tdhl {" + "\r\n",
      "      font-weight: bold;" + "\r\n",
      "     padding: 20px 5px 5px 5px;" + "\r\n",
      "       background-color: #F2F2F2;" + "\r\n",
      "       border-top-width: 0px;" + "\r\n",
      "       border-left-width: 0px;" + "\r\n",
      "       border-right-width: 0px;" + "\r\n",
      "       border-bottom-width: 1px;" + "\r\n",
      "       border-color: #dcdcdc;" + "\r\n",
      "       border-style: solid;" + "\r\n",
      "       border-collapse: collapse;" + "\r\n",
      "     border-top-width: 1px;" + "\r\n",
      "     }" + "\r\n",
      "      .td1red {" + "\r\n",
      "        color: red;" + "\r\n",
      "        background-color: white;" + "\r\n",
      "        border-top-width: 1px;" + "\r\n",
      "        border-left-width: 0px;" + "\r\n",
      "        border-right-width: 0px;" + "\r\n",
      "        border-bottom-width: 1px;" + "\r\n",
      "        border-top-color: black;" + "\r\n",
      "        border-left-color: black;" + "\r\n",
      "        border-right-color: black;" + "\r\n",
      "        border-bottom-color: #F2F2F2;" + "\r\n",
      "        border-style: solid;" + "\r\n",
      "        border-collapse: collapse;" + "\r\n",
      "      }" + "\r\n",
      "       .td1violet {" + "\r\n",
      "      color: darkviolet;" + "\r\n",
      "        background-color: white;" + "\r\n",
      "        border-top-width: 1px;" + "\r\n",
      "        border-left-width: 0px;" + "\r\n",
      "        border-right-width: 0px;" + "\r\n",
      "        border-bottom-width: 1px;" + "\r\n",
      "        border-top-color: black;" + "\r\n",
      "        border-left-color: black;" + "\r\n",
      "        border-right-color: black;" + "\r\n",
      "        border-bottom-color: #F2F2F2;" + "\r\n",
      "        border-style: solid;" + "\r\n",
      "        border-collapse: collapse;" + "\r\n",
      "      }" + "\r\n",
      "    .td1," + "\r\n",
      "    .td1r," + "\r\n",
      "      .td1l {" + "\r\n",
      "      background-color: white;" + "\r\n",
      "        border-top-width: 1px;" + "\r\n",
      "        border-left-width: 0px;" + "\r\n",
      "        border-right-width: 0px;" + "\r\n",
      "        border-bottom-width: 1px;" + "\r\n",
      "        border-top-color:  #F2F2F2;" + "\r\n",
      "        border-bottom-color: #F2F2F2;" + "\r\n",
      "        border-style: solid;" + "\r\n",
      "        border-collapse: collapse;" + "\r\n",
      "      }" + "\r\n",

      "       .td2," + "\r\n",
      "     .td2red," + "\r\n",
      "     .td2violet," + "\r\n",
      "     .td2l," + "\r\n",
      "     .td2r   {      background-color: #F9F9F9;" + "\r\n",
      "        border-top-width: 0px;" + "\r\n",
      "        border-left-width: 0px;" + "\r\n",
      "        border-right-width: 0px;" + "\r\n",
      "        border-bottom-width: 1px;" + "\r\n",
      "        border-bottom-color: #F2F2F2;" + "\r\n",
      "        border-style: solid;" + "\r\n",
      "        border-collapse: collapse;" + "\r\n",
      "      }" + "\r\n",
      "      .td2red {" + "\r\n",
      "      color: red;" + "\r\n",
      "      }" + "\r\n",
      "      .td2violet {" + "\r\n",
      "      color: darkviolet;" + "\r\n",
      "      }" + "\r\n",
      "    .tdt," + "\r\n",
      "    .tdhl," + "\r\n",
      "    .td1l," + "\r\n",
      "    .td2l" + "\r\n",
      "    {" + "\r\n",
      "      border-left-color: #dcdcdc;" + "\r\n",
      "        border-left-width: 1px;" + "\r\n",
      "    }" + "\r\n",
      "    .tdt," + "\r\n",
      "    .tdhr," + "\r\n",
      "    .td1r," + "\r\n",
      "      .td2r  {" + "\r\n",
      "      border-right-color: #dcdcdc;" + "\r\n",
      "        border-right-width: 1px;" + "\r\n",
      "    }" + "\r\n",
      "    .tdl {" + "\r\n",
      "      border-bottom-color: #dcdcdc;" + "\r\n",
      "        border-bottom-width: 1px;" + "\r\n",
      "    }" + "\r\n",
      "      .tdt {" + "\r\n",
      "      font-weight: normal;" + "\r\n",
      "    }" + "\r\n",
      "      h1 {" + "\r\n",
      "      padding: 30px 0px 0px 0px;" + "\r\n",
      "      font-size: 28px;" + "\r\n",
      "      font-weight: 100;" + "\r\n",
      "      }" + "\r\n",
      "    h2 {" + "\r\n",
      "      background-color: #F2F2F2;" + "\r\n",
      "      padding: 20px 15px 15px 0px;" + "\r\n",
      "      font-size: 18px;" + "\r\n",
      "      margin: 0;" + "\r\n",
      "    }" + "\r\n",
      "    .export_msg {" + "\r\n",
      "      padding: 0px 15px 25px 0px;" + "\r\n",
      "      font-size: 18px;" + "\r\n",
      "      font-weight: bold;" + "\r\n",
      "    }" + "\r\n",
      "      .export_msg.success {" + "\r\n",
      "      color: green;" + "\r\n",
      "    }" + "\r\n",
      "    .export_msg.failure {" + "\r\n",
      "      color: red;" + "\r\n",
      "    }" + "\r\n"
    ].join("");

    return styletext;
  }
});

/**
 * @cfg {Object}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES             Format HTML-Logfile datev export
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.body        HTML-Style Class body
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.table       HTML-Style Class table
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.tabletd     HTML-Style Class table td
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.tabletr     HTML-Style Class table tr
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.tdh         HTML-Style Class tdh
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td1         HTML-Style Class td1
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td1red      HTML-Style Class td1red
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td1violet   HTML-Style Class td1violet
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td2         HTML-Style Class td2
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td2red      HTML-Style Class td2red
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.td2violet   HTML-Style Class td2violet
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.tdl         HTML-Style Class tdl
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.tdt         HTML-Style Class tdt
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.h1          HTML-Style Class h1
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.h2          HTML-Style Class h2
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.exportmsf   HTML-Style Class export_msg
 * @cfg {String}   sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES.css         Complete HTML-Style CSS
 * HTML-Styles for HTML files
 */
sol.invoice_datev.as.export.HtmlLog.HTMLSTYLES = {
  body: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleBody(),
  table: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleTable(),
  tabletd: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleTableTd(),
  tabletr: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleTableTr(),
  tdh: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("tdh",
    "bold",
    "20px 5px 5px 5px",
    null,
    "#F2F2F2",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "1px", "1px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#dcdcdc", "#dcdcdc", "#dcdcdc", "#dcdcdc")),
  td1: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td1",
    null,
    null,
    null,
    "white",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  td1red: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td1red",
    null,
    null,
    "red",
    "white",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  td1violet: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td1violet",
    null,
    null,
    "darkviolet",
    "white",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  td2: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td2",
    null,
    null,
    null,
    "#F9F9F9",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  td2red: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td2red",
    null,
    null,
    "red",
    "#F9F9F9",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  td2violet: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTd("td2violet",
    null,
    null,
    "darkviolet",
    "#F9F9F9",
    sol.invoice_datev.as.export.HtmlLog.getTLRB("1px", "0px", "0px", "1px"),
    sol.invoice_datev.as.export.HtmlLog.getTLRB("#F2F2F2", "#F2F2F2", "#F2F2F2", "#F2F2F2")),
  tdl: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTdl(),
  tdt: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesTdt(),
  h1: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleH1(),
  h2: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleH2(),
  exportmsf: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleClassesExportMsg(),
  css: sol.invoice_datev.as.export.HtmlLog.getHtmlStyleCSS()

};