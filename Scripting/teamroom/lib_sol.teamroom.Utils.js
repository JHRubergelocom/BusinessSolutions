
//@include lib_Class.js
//@include lib_sol.common.HttpUtils.js

/**
 * Utility functions for teamroom.
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 *
 */
sol.define("sol.teamroom.Utils", {
  singleton: true,

  undefinedParams: function (mandatory, o) {
    return mandatory.filter(function (prop) {
      return o[prop] == undefined;
    });
  },

  encode: function (s) {
    return Packages.java.net.URLEncoder.encode(s, "UTF-8");
  },

  sendRequest: function (cfg) {
    var me = this, url, enc = me.encode, cmd,
        mandatory = ["service", "token", "name", "guid", "cmd"],
        missingParams;

    cmd = (cfg || (cfg = {}).cmd);
    if (cmd == "create") {
      mandatory.push("owner");
    } else if (cmd == "close") {
      mandatory.push("date");
    }

    if ((missingParams = me.undefinedParams(mandatory, cfg)).length) {
      throw "Mandatory url params were missing: " + missingParams;
    }

    url = cfg.service
      + "Main?ticket=" + cfg.token
      + "&guid=" + cfg.guid
      + "&name=" + enc(cfg.name)
      + "&owner=" + enc(cfg.owner)
      + "&cmd=" + cfg.cmd
      + "&date=" + cfg.date;

    return sol.common.HttpUtils.sendRequest({
      url: url
    });

  },

  useDatabase: function (query, mode, info) {
    var me = this, buildQuery;
    me.logger.debug(mode + ": " + info + " query:" + query);
    buildQuery = me.buildQuery(mode, query);
    return buildQuery.execute();
  },

  select: function (query, info) {
    var me = this;
    return me.useDatabase(query, "select", info);
  },

  update: function (query, info) {
    var me = this;
    return me.useDatabase(query, "update", info);
  },

  buildQuery: function (mode, query) {
    var me = this;
    me.logger.debug("Teamroom buildQuery returning");
    return {
      execute: function () {
        me.logger.debug("Teamroom buildQuery executing");
        if (mode == "select") {
          return me.queryDb(query);
        } else if (mode == "update") {
          return me.updateDb(query);
        }
      },
      query: query
    };
  },

  queryDb: function (query) {
    var me = this, result, db = new Packages.de.elo.ix.jscript.DBConnection();
    result = db.query(query);
    me.logger.debug("Teamroom queryDb result: " + result);
    return result;
  },

  updateDb: function (query) {
    return (new Packages.de.elo.ix.jscript.DBConnection()).update(query);
  },

  verifySqlParam: function (param) {
    param = String(param);
    if (~param.indexOf("'")) {
      throw "Invalid SQL Param: " + param;
    }
    return param;
  },

  // Used in Teamroom Remote
  checkIfAdmin: function (ec, adminGroup) {
    for (var i = 0; i < ec.user.groupList.length; i += 1) {
      if (ec.user.groupList[i] === adminGroup.id) {
        return true;
      }
    }
  },

  getRoleGroups: function (system, role) {
    var me = this, systemSord = ixConnect.ix().checkoutSord(system, EditInfoC.mbSord, LockC.NO).sord,
        namePart = systemSord.name.length() > 30
          ? systemSord.name.substring(0, 20) + "-" + systemSord.name.substring(systemSord.name.length() - 10)
          : systemSord.name,
        adminGroupName = ["TR_", namePart, "_Admin"].join(""),
        targetGroupName = adminGroupName;

    if ((role === "member") || (role === "guest")) { // change role
      targetGroupName = ["TR_", namePart, "_", role.substring(0, 1).toUpperCase(), role.substring(1)].join("");
    }

    me.logger.info("admin group: " + adminGroupName);
    me.logger.info("target group: " + targetGroupName);

    return ixConnect.ix().checkoutUsers([adminGroupName, targetGroupName], CheckoutUsersC.BY_IDS, LockC.NO);
  }
});
