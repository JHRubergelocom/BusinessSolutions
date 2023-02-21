// start of namespace db
var db = new Object();
db = {

  init: function (connectId) {
    if (EM_connections[connectId].initdone == true) {
      return;
    }

    log.debug("Now init JDBC driver");
    var driverName = EM_connections[connectId].driver;
    var dbUrl = EM_connections[connectId].url;
    var dbUser = EM_connections[connectId].user;
    var dbPassword = EM_connections[connectId].password;
    if (emConnect.decryptAs) {
      dbPassword = emConnect.decryptAs(dbPassword);
    }
    try {
      if (!EM_connections[connectId].classloaded) {
        Class.forName(driverName).newInstance();

        log.debug("Register driver JDBC");
        //DriverManager.registerDriver(new JdbcOdbcDriver());
        EM_connections[connectId].classloaded = true;
      }

      log.debug("Get Connection");
      EM_connections[connectId].dbcn = DriverManager.getConnection(dbUrl, dbUser, dbPassword);

      log.debug("Init done.");
    } catch (e) {
      log.debug("ODBC Exception: " + e);
    }

    EM_connections[connectId].initdone = true;
  },

  exitRuleset: function () {
    log.debug("dbExit");

    for (i = 0; i < EM_connections.length; i++) {
      if (EM_connections[i].initdone) {
        if (EM_connections[i].dbcn) {
          try {
            EM_connections[i].dbcn.close();
            EM_connections[i].initdone = false;
            log.debug("Connection closed: " + i);
          } catch (e) {
            log.info("Error closing database " + i + ": " + e);
          }
        }
      }
    }
  },

  doUpdate: function (connection, sqlCommand) {
    db.init(connection);

    log.debug("createStatement for update: " + sqlCommand);
    var p = EM_connections[connection].dbcn.createStatement();

    log.debug("executeUpdate");
    var rss = p.executeUpdate(sqlCommand);

    p.close();
  },

  getLine: function (connection, qry) {
    function dbResult(qry) {
      db.init(connection);

      log.debug("createStatement");
      var p = EM_connections[connection].dbcn.createStatement();

      log.debug("executeQuery");
      var rss = p.executeQuery(qry);

      log.debug("read result");
      if (rss.next()) {
        var metaData = rss.getMetaData();
        var cnt = metaData.getColumnCount();
        for (var i = 1; i <= cnt; i++) {
          var name = String(metaData.getColumnLabel(i));
          var value = String(rss.getString(i) || "");

          this[name] = value;
          if (i == 1) {
            this.first = value;
          }
        }
      }

      rss.close();
      p.close();
    }

    var res = new dbResult(qry);

    log.debug("getLine done.");
    return res;
  },

  getColumn: function (connection, qry) {
    var res = db.getLine(connection, qry);
    return res.first;
  },

  getColumnWithDefault: function (connection, qry, defaultValue) {
    var res = db.getLine(connection, qry);
    return (res.first) ? res.first : defaultValue;
  },

  getMultiLine: function (connection, qry, maxRows) {
    function makeRow(metaData, rss) {
      var cnt = metaData.getColumnCount();
      for (var col = 1; col <= cnt; col++) {
        var name = String(metaData.getColumnLabel(col));
        var value = String(rss.getString(col) || "");
        this[name] = value;
      }
    }

    db.init(connection);

    log.debug("createStatement");
    var p = EM_connections[connection].dbcn.createStatement();

    log.debug("executeQuery");
    var rss = p.executeQuery(qry);

    log.debug("read result");
    var result = new Array();
    if (rss.next()) {
      var metaData = rss.getMetaData();
      for (var i = 0; i < maxRows; i++) {
        result[i] = new makeRow(metaData, rss);
        if (!rss.next()) {
          break;
        }
      }
    }

    rss.close();
    p.close();

    return result;
  }

}
// end of namespace db

function dbExitRuleset() {
  return db.exitRuleset();
}