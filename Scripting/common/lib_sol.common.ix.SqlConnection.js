
//@include lib_Class.js

/**
 * SQL utilities
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ExceptionUtils
 *
 */
sol.define("sol.common.ix.SqlConnection", {

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  dbConfigs: {
    postgresql: {
      filePrefix: "pg",
      delimiterRegex: /;\s*$/m
    },
    "microsoft sql server": {
      filePrefix: "mssql",
      delimiterRegex: /^\s*go\s*$/mi
    },
    oracle: {
      filePrefix: "ora",
      delimiterRegex: /;\s*$/m
    },
    "db2/nt64": {
      filePrefix: "db2",
      delimiterRegex: /;\s*$/m
    }
  },

  /**
   * Opens a database connection
   * @param {String} resourceName Resource name
   * @param {Object} dbConfig Database configuration
   */
  open: function (resourceName, dbConfig) {
    var me = this,
        db;

    resourceName += "";
    db = new Packages.de.elo.ix.jscript.DBConnection();
    me.sqlConnection = db.open();
    me.dbProductName = db.databaseProductName.toLowerCase() + "";

    me.dbConfig = dbConfig || me.dbConfigs[me.dbProductName];

    if (!me.dbConfig) {
      throw "Unknown database product name: " + me.dbProductName;
    }

    me.logger.debug(["Open db connection: dbTypeString={0}, dbConfig={1}", me.dbTypeString, JSON.stringify(me.dbConfig)]);
  },

  /**
   * Returns the database type file prefix
   * @return {String} Database type file prefix
   */
  getDbTypeFilePrefix: function () {
    var me = this,
        dbTypePrefix;

    dbTypePrefix = me.dbConfig.filePrefix;

    return dbTypePrefix;
  },

  /**
   * Execute SQL script
   * @param {String} scriptContent Script content
   * @param {Object} params Parameters
   * @return {Object} Result
   */
  executeSqlScript: function (scriptContent, params) {
    var me = this,
        exceptionStrings = [],
        exceptionString, exceptionMessage, statements, i, statement, jdbcStatement, counter, resultCountersJavaArr, result,
        javaException, nextExceptionIterator, nextException;

    result = {
      resultCounters: []
    };

    scriptContent += "";

    if (!scriptContent) {
      throw "SQL script content is empty";
    }

    if (!me.sqlConnection) {
      throw "No open SQL connection";
    }

    jdbcStatement = me.sqlConnection.createStatement();
    me.sqlConnection.autoCommit = true;

    statements = me.parseStatements(scriptContent);

    result.statements = statements;

    for (i = 0; i < statements.length; i++) {
      statement = statements[i];
      me.logger.debug("Add SQL statement: {0}", statement);
      try {
        jdbcStatement.addBatch(statement);
      } catch (ex) {
        exceptionMessage = "Exception while adding a sql statement: statement=" + statement + ", exception=" + sol.common.ExceptionUtils.parseException(ex);
        throw exceptionMessage;
      }
    }

    try {
      resultCountersJavaArr = jdbcStatement.executeBatch();
    
      for (i = 0; i < resultCountersJavaArr.length; i++) {
        counter = resultCountersJavaArr[i] + "";
        result.resultCounters.push(counter);
      }

      me.logger.debug(["SQL batch result: {0}", result]);

    } catch (ex) {
      exceptionString = ex.toString() + "";
      exceptionStrings = [exceptionString];
      
      javaException = ex.javaException;
      if (javaException) {
        nextExceptionIterator = javaException.iterator();
        while (nextExceptionIterator.hasNext()) {
          nextException = nextExceptionIterator.next();
          exceptionString = nextException.toString();
          exceptionStrings.push(exceptionString);
        }
      }

      exceptionString = exceptionStrings.join("\r\n");

      throw exceptionString;
    } finally {
      jdbcStatement.close();  
    }

    return result;
  },

  /**
   * Close
   */
  close: function () {
    var me = this;

    me.sqlConnection.close();
  },

  /**
   * @private
   * @param {String} scriptContent
   * @return {String} Statements
   */
  parseStatements: function (scriptContent) {
    var me = this,
        statements = [],
        lines = [],
        linesWithoutComments = [],
        i, line, scriptContentWithoutComments, statementsWithoutDelimiter, statement;

    scriptContent += "";
    lines = scriptContent.split(/\r?\n/);

    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      line = line.replace(/--.*/, "");
      line = line.trim();
      if (line && (line.toLowerCase().indexOf("commit") != 0)) {
        linesWithoutComments.push(line);
      }
    }

    scriptContentWithoutComments = linesWithoutComments.join("\r\n");

    statementsWithoutDelimiter = scriptContentWithoutComments.split(me.dbConfig.delimiterRegex);

    for (i = 0; i < statementsWithoutDelimiter.length; i++) {
      statement = statementsWithoutDelimiter[i];
      statement = sol.common.StringUtils.replaceAll(statement, "\s*\r?\n", " ");
      statement = statement.trim();
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }
});
