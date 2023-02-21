
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.de.elo.ix.jscript);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.RepoUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.connector.ix.services.SQLProvider" });

/**
 * Provides services to connect and query sql databases from web applications. 
 * 
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_connector_service_SQLProvider', {
 *        jdbc: "jdbc/MyMSSQL", query: "select * from kunden", "maxRows": 100 
 *     });
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires  sol.Logger
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 */
sol.define("sol.connector.ix.services.SQLProvider", {
  extend: "sol.common.ix.ServiceBase",
  
  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Provides services to connect and query sql databases via jdbc spezification in 
   * the Tomcat configuration
   * @return {Object} result of selection or error/exception messages
   */
  process: function () {
    var me = this,
        result = {};

    result = me.validateDatasource(me.jdbc);    
    if (me.query) {
      result = me.selectData(me.jdbc, me.query, me.maxRows);
    }  

    if (me.debug) {
      me.createHtmlReport(result);
    }

    result = me.convertToStandardformat(result);
    return result;
  },

  /**
   * Test jdbc connection 
   * the Tomcat configuration
   * @param {String} JDBC Data source name specified in the Tomcat configuration. E.g. "jdbc/MyMSSQL".
   * @return {Object} Result of connection test or error/exception messages
   */
  validateDatasource: function (JDBC) {
    var me = this,
        db, conn, error;

    if (!JDBC) {
      error = "[" + me.$className + "] JDBC is not supported/configured";
      logger.error(error);
      return { isValid: false, error: error };
    }
    try {
      db = new DBConnection(JDBC);  
      conn = db.open();
      conn.close();    
      return { isValid: true };
    } catch (ex) {
      logger.error("an error occurred", ex);      
      return { isValid: false, exception: ex };
    }
  },

  /**
   * Select data table from SQL SELECT
   * @param {String} JDBC Data source name specified in the Tomcat configuration. E.g. "jdbc/MyMSSQL".
   * @param {String} Query SELECT command string
   * @param {String} MaxRows Maximum number of rows to be read
   * @return {Object} result of selection or error/exception messages
   */
  selectData: function (JDBC, Query, MaxRows) {
    var me = this,
        exception, isValid, ret, colLabels, colTypes,
        db, jdbc, stmt, rs, meta, cols, row, i, error;

    if (!JDBC) {
      error = "[" + me.$className + "] JDBC is not supported/configured";
      logger.error(error);
      return { isValid: false, error: error };
    }
    
    if (!Query) {
      error = "[" + me.$className + "] Query is not supported/configured";
      logger.error(error);
      return { isValid: false, error: error };
    }

    if (!MaxRows) {
      MaxRows = 50;
    }

    try {
      isValid = true;      
      db = new DBConnection(JDBC);
      jdbc = db.open();
      stmt = jdbc.createStatement();
      stmt.setMaxRows(MaxRows);
      rs = stmt.executeQuery(Query);
      meta = rs.getMetaData();
      cols = meta.getColumnCount();
      ret = [];
      colLabels = [];
      colTypes = [];
      for (i = 1; i <= cols; i++) {
        colLabels.push(meta.getColumnLabel(i));  
        colTypes.push(meta.getColumnTypeName(i));  
      }

      while (rs.next()) {
        row = [];
        for (i = 1; i <= cols; i++) {
          row.push(rs.getString(i));
        }
        ret.push(row);
      }
    } catch (ex) {
      logger.error("an error occurred", ex);
      isValid = false;
      exception = ex;      
    } finally { 

      if (rs) {
        try { 
          rs.close(); 
        } catch (ex1) {
          isValid = false;
          exception += "rs.close():";                
          exception += ex1;                
        }
      }

      if (stmt) {
        try {
          stmt.close();
        } catch (ex2) {
          isValid = false;
          exception += "stmt.close():";                
          exception += ex2;                
        }
      }
        
      if (jdbc) {
        try {
          jdbc.close();
        } catch (ex3) {
          isValid = false;
          exception += "jdbc.close():";                
          exception += ex3;                
        }
      }
    }
    return { isValid: isValid, exception: exception, colLabels: colLabels, colTypes: colTypes, dataTable: ret };     
  },

  /**
   * Convert result to Standard format
   * @param {Object} Result of selection or error/exception messages
   * @return {Object} Standard format
   */  
  convertToStandardformat: function (Result) {
    var convertedResult = {},
        data, i, j, dataRow, dataTableRow,
        colums, colum, exceptions, exception;

    if (Boolean(Result.isValid)) {
      data = [];
      if (Result.dataTable) {
        for (i = 0; i < Result.dataTable.length; i++) {
          dataRow = {};
          dataTableRow = Result.dataTable[i];
          for (j = 0; j < dataTableRow.length; j++) {
            dataRow[Result.colLabels[j]] = dataTableRow[j];
          }
          data.push(dataRow);
        }
        convertedResult.data = data;
        colums = [];
        for (i = 0; i < Result.colLabels.length; i++) {
          colum = {};
          colum["name"] = Result.colLabels[i];
          colum["type"] = Result.colTypes[i];
          colums.push(colum);
        }  
        convertedResult.colums = colums;
      }
    } else { // error, exception case
      exceptions = [];
      if (Result.error) {
        exception = {};
        exception["type"] = "General";
        exception["text"] = Result.error;
        exceptions.push(exception);
      }
      if (Result.exception) {
        exception = {};
        exception["type"] = "SQL";
        exception["text"] = Result.exception.message;
        exceptions.push(exception);        
      }
      convertedResult.exception = exceptions;
    }

    return convertedResult;
  },  

  createHtmlReport: function (Result) {
    var htmlReport, htmlHead, htmlBody, htmlTable, i, j, dataTableRow,
        tempFile;

    htmlHead = "<head>" + 
                "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />" +
                "<title>SQL Connect</title>" +
                "<style type='text/css' >" +
                "body {" +
                "  font-family: Verdana,Arial;" +
                "  font-size: 14px;" +
                "}" +
                
                "table {" +
                "  margin-top: 20px;" +
                "  margin-bottom: 20px;" +
                "  border: 1px silver solid;" +
                "  border-collapse: collapse;" +
                "}" +
                
                "td {" +
                "  border-bottom:1px silver dotted;" +
                "  padding: 5px;" +
                "}" +
                
                ".header {" +
                "  background-color:#f0f2ff;" +
                "}" +
                
                ".urgent {" +
                "  background-color:#ffd0d0;" +
                "}" +
                
                ".group {" +
                "  background-color:#d0ffd0;" +
                "}" +

                "</style>" +
                "</head>";

    htmlBody = "<body>" +
               "<h1>SQL Connect</h1>";

    if (Boolean(Result.isValid)) {

      if (Result.dataTable) {
        htmlBody += "<h2>Datentabelle</h2>";

        htmlTable = "<table border='0'>";
        // header name
        htmlTable += "<tr>";
        for (i = 0; i < Result.colLabels.length; i++) {
          htmlTable += "<td class='header'>" + Result.colLabels[i] + "</td>";
        }  
        htmlTable += "</tr>";
        // header type
        htmlTable += "<tr>";
        for (i = 0; i < Result.colTypes.length; i++) {
          htmlTable += "<td class='header'>" + Result.colTypes[i] + "</td>";
        }  
        htmlTable += "</tr>";
        // table data
        for (i = 0; i < Result.dataTable.length; i++) {
          dataTableRow = Result.dataTable[i];
          htmlTable += "<tr>";
          for (j = 0; j < dataTableRow.length; j++) {
            htmlTable += "<td class='group'>" + dataTableRow[j] + "</td>";
          }
          htmlTable += "</tr>";
        }
        htmlTable += "</table>";
        htmlBody += htmlTable;
      }
    } else { // error, exception case

      htmlBody += "<h2>Exception</h2>";
      htmlTable = "<table border='0'>";

      htmlTable += "<tr>";
      htmlTable += "<td class='header'>Type</td>";
      htmlTable += "<td class='header'>Text</td>";
      htmlTable += "</tr>";

      if (Result.error) {

        htmlTable += "<tr>";        
        htmlTable += "<td class='urgent'>General</td>";
        htmlTable += "<td class='urgent'>" + Result.error + "</td>";
        htmlTable += "</tr>";

      }
      if (Result.exception) {

        htmlTable += "<tr>";        
        htmlTable += "<td class='urgent'>SQL</td>";
        htmlTable += "<td class='urgent'>" + Result.exception.message + "</td>";
        htmlTable += "</tr>";

      }

      htmlTable += "</table>";
      htmlBody += htmlTable;
    }


    htmlBody += "</body>";

    htmlReport = "<html>";
    htmlReport += htmlHead;
    htmlReport += htmlBody;
    htmlReport += "</html>";

    tempFile = File.createTempFile("SQL Connect", ".html");
    FileUtils.writeStringToFile(tempFile, htmlReport, "UTF-8");
    Packages.java.awt.Desktop.desktop.open(tempFile);

    return htmlReport;
  }

});

/**
 * @member sol.connector.ix.services.SQLProvider
 * @method RF_sol_connector_service_SQLProvider
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_connector_service_SQLProvider(iXSEContext, args) {
  logger.enter("RF_sol_connector_service_SQLProvider", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  service = sol.create("sol.connector.ix.services.SQLProvider", params);
  result = sol.common.JsonUtils.stringifyAll(service.process());
  logger.exit("RF_sol_connector_service_SQLProvider", result);
  return result;
}
