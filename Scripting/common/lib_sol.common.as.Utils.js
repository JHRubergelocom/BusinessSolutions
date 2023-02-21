
//@include lib_Class.js

// Nashorn
if (typeof Java != "undefined") {
  Object.defineProperty(this, "global", {
    configurable: true, enumerable: false, writable: true,
    value: this
  });
}

/**
 * Utility methods for the ELOas.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 */
sol.define("sol.common.as.Utils", {
  singleton: true,

  /**
   * Checks if the current execution is in an users context and throws an exception if that is not the case.
   *
   * If an EM_USERID is set, `ixConnect` will be initialized for this user, while the original connection will be availabe via `ixConnectAdmin`.
   *
   * @param {Object} scope The ruleset object
   */
  requiresUserSession: function (scope) {
    var me = this,
        param3Obj, logTicket, ticketUserId;

    try {
      param3Obj = JSON.parse(EM_PARAM3 || "{}");
    } catch (ex) {
      // ignore
    }

    param3Obj = param3Obj || {};

    if (param3Obj.ticket) {
      logTicket = param3Obj.ticket.substr(0, 10) + "...";

      if (ixConnect.loginResult.clientInfo.ticket == param3Obj.ticket) {
        me.logger.debug(["User ticket corresponds to ELOas service ticket: ticket={0}", logTicket]);
        return;
      }

      ticketUserId = sol.common.UserUtils.getUserIdFromTicket(param3Obj.ticket);
      me.logger.debug(["Set current user from user ticket: ticket={0}, userId={1}", logTicket, ticketUserId]);

      EM_USERID = ticketUserId;
    }

    if (EM_USERID === -1) {
      throw "user ticket required";
    }
    if (typeof Java != "undefined") {
      global.ixConnectAdmin = ixConnect; // Nashorn
    } else {
      scope.__parent__.ixConnectAdmin = ixConnect; // Rhino
    }

    try {
      me.ensureRelogin(ixConnectAdmin);
      ixConnect = ixConnectAdmin.createConnectionForUser(EM_USERID);
    } catch (ex) {
      ixConnectAdmin = undefined;
      me.logger.error(["Error creating connection for user '{0}'", EM_USERID], ex);
      throw "Executing ELOas rules in the current users context is not supported by this AM version. 'CreateConnectionForUser' does not support local ELO accounts if LDAP is used for authentification.";
    }

    if (param3Obj.language) {
      ixConnect.loginResult.clientInfo.language = param3Obj.language;
    }

    if (param3Obj.timeZone) {
      ixConnect.loginResult.clientInfo.timeZone = param3Obj.timeZone;
    } else {
      me.logger.warn("The given time zone should not be empty.");
    }

    me.logger.info(["User session: user.id={0}, user.name={1}, language={2}, timeZone={3}, callId={4}]", ixConnect.loginResult.user.id + "", ixConnect.loginResult.user.name + "", ixConnect.loginResult.clientInfo.language + "", ixConnect.loginResult.clientInfo.timeZone + "", ixConnect.loginResult.clientInfo.callId + ""]);
  },

  /**
   * @private
   * Ensure a re-login if necessary
   * @param {de.elo.ix.client.IXConnection} [conn=ixConnect] Connection
   */
  ensureRelogin: function (conn) {
    conn = conn || ixConnect;
    conn.ix().createSord("0", "", EditInfoC.mbOnlyId);
  },

  /**
   * Changed connection settings (see {@link #requiresUserSession}) will be reseted and the user connection will be closed.
   */
  cleanupUserSession: function () {
    if (typeof ixConnectAdmin !== "undefined") {
      if (ixConnect !== ixConnectAdmin) { // do only reset if 'ixConnect' was created by 'requiresUserSession'
        ixConnect.close();
        ixConnect = ixConnectAdmin;
      }
      ixConnectAdmin = undefined; // always reset ixConnectAdmin variable
    }
  },

  /**
   * Executes an function
   * @param {String} funcName Function name
   * @param {Object} config Configuration
   * @param {Object} config.params Parameters
   * @param {Object} [config.adminOnly=false] If true then the function can only be called by an user with administrative rights
   * @param {Boolean} config.rawResult Returns the raw result
   */
  executeFunction: function (funcName, config) {
    var me = this,
        func, result;

    if (!funcName) {
      throw "Function name is empty";
    }

    config = config || {};

    me.logger = sol.create("sol.Logger", { scope: "sol.common.as.Utils" });

    if (!config.params) {

      if (!EM_PARAM2) {
        me.logger.info("EM_PARAM2 is empty.");
        return;
      }

      try {
        config.params = JSON.parse(EM_PARAM2);
      } catch (ex) {
        me.logger.info("Can't parse configuration: EM_PARAM2=" + EM_PARAM2);
        return;
      }
    }

    me.logger.enter(funcName, config.params);

    try {
      me.checkAdminOnly(funcName, config);

      me.logger.info("executeFunction(): timeZone=" + ixConnect.loginResult.clientInfo.timeZone + ", callId=" + ixConnect.loginResult.clientInfo.callId);

      func = sol.create(funcName, config.params);
      result = func.process();
    } catch (ex) {
      sol.common.ExceptionUtils.logAsException(ex, { logger: me.logger });
      result = { exception: sol.common.ExceptionUtils.parseException(ex) };
    }

    me.logger.exit(funcName, result);

    if (!result) {
      me.logger.info("Function '" + funcName + "' must provide a result");
    }

    if (config.rawResult) {
      result = new java.lang.String(result);
    } else {
      result = JSON.stringify(result);
    }
    me.logger.info("result=" + result);
    ruleset.statusMessage = result;
  },

  /**
   * Checks wether the function is called by an administrative user
   * @param {String} funcName Function name
   * @param {Object} config Configuration
   */
  checkAdminOnly: function (funcName, config) {
    var me = this,
        isAdmin = false,
        param3Obj, ticket, logTicket;

    config = config || {};

    if (config.adminOnly) {
      if (EM_PARAM3) {
        try {
          param3Obj = JSON.parse(EM_PARAM3);
        } catch (ignore) {
        }
      }

      if (param3Obj && param3Obj.ticket) {
        ticket = param3Obj.ticket + "";
        logTicket = ticket.substr(0, 10) + "...";
        param3Obj.ticket = logTicket;
        isAdmin = sol.common.UserUtils.isMainAdminTicket(ticket);
        me.logger.debug(["checkAdminOnly: ticket={0}, result={1}", logTicket, isAdmin]);

        if (!isAdmin) {
          throw "The ELOas function '" + funcName + "' can only be called with administrative rights. ticket=" + logTicket;
        }
      } else {
        if (EM_USERID > -1) {
          isAdmin = sol.common.UserUtils.isMainAdmin(EM_USERID);
        }
        me.logger.debug(["checkAdminOnly: userId={0}, result={1}", EM_USERID, isAdmin]);

        if (!isAdmin) {
          throw "The ELOas function '" + funcName + "' can only be called with administrative rights. userId=" + EM_USERID;
        }
      }
    }
  },

  /**
   * Returns the version of the ELOas
   * @return {String}
   */
  getAsVersion: function () {
    return String(Packages.de.elo.mover.main.ASConstants.VERSION);
  },

  /**
   * Returns true if the code runs within the ELOas debugger
   * @return {Boolean}
   */
  isDebugger: function () {
    return !!Packages.de.elo.mover.main.DebuggerConstants;
  },

  /**
   * Download fonts
   * @param {Object} params Parameters
   * @param {String[]} params.fontFolderRepoPaths Font folder repository path
   * @return {String[]} Font temporary directory paths
   */
  downloadFonts: function (params) {
    var me = this,
        downloadCounter = 0,
        fontFiles, fontFolderObjId, i, fontFolderRepoPath, j, fontFile;

    params = params || {};
    params.fontFolderRepoPaths = params.fontFolderRepoPaths || ["ARCPATH[(E10E1000-E100-E100-E100-E10E10E10E00)]:/ELOas Base/Fonts"];

    me.fontFolderRepoPathDownloaded = me.fontFolderRepoPathDownloaded || [];
    me.fontTempDirPath = me.fontTempDirPath || sol.common.FileUtils.getTempDirPath() + File.separator + "ELOasFonts";


    for (i = 0; i < params.fontFolderRepoPaths.length; i++) {
      fontFolderRepoPath = params.fontFolderRepoPaths[i];

      me.logger.debug("cache={0}, fontFolderRepoPath={1}", me.fontFolderRepoPathDownloaded, fontFolderRepoPath);

      if (me.fontFolderRepoPathDownloaded.indexOf(fontFolderRepoPath) > -1) {
        me.logger.debug(["Fonts already downloaded: fontFolderRepoPath={0}", fontFolderRepoPath]);
        continue;
      }

      fontFolderObjId = sol.common.RepoUtils.getObjId(fontFolderRepoPath);
      if (!fontFolderObjId) {
        me.logger.warn(["Font folder not found: {0}", fontFolderRepoPath]);
        continue;
      }

      me.logger.debug(["Download font files: fontFolderRepoPath={0}", fontFolderRepoPath]);

      fontFiles = sol.common.FileUtils.downloadDocuments(fontFolderObjId, me.fontTempDirPath, { makeDstDirs: true, includeReferences: true });
      for (j = 0; j < fontFiles.length; j++) {
        fontFile = fontFiles[j];
        me.logger.debug(["Font file downloaded: {0}", fontFile.canonicalPath]);
        downloadCounter++;
      }

      me.fontFolderRepoPathDownloaded.push(fontFolderRepoPath);
    }

    me.logger.info(["Downloaded font files available: fontDir={0}, numberOfDownloadedFonts={1}", me.fontTempDirPath, downloadCounter]);

    return me.fontTempDirPath;
  }
});
