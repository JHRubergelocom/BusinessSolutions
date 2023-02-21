
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.ScriptVersionReportCreate" });

/**
 * Generates a report of child entries for a given archive path.
 *
 * This report can be saved and used by `sol.common.ix.services.ScriptVersionReportValidate`
 * later in order to check for changes in files.
 *
 * # As IX service call
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_ScriptVersionReportCreate', {
 *       arcPath: "ARCPATH[1]:\\Administration\\Business Solutions"
 *     });
 *
 * # Returns data as followed
 *
 * The service creates a data structure that looks as follows.
 *
 *     {
 *       date: "20150623105541",
 *       files: [{
 *              refPath:  "¶Administration¶Business Solutions¶connector_xml¶resources",
 *              name:     "doc_import_example",
 *              filehash: "9F0FF55B9F675DBD3CE42E9B3B337DA3",
 *              guid:     "(B22ECD56-1537-3B3B-CBBA-5DAE2A66DA81)",
 *              version:  "6",
 *              editor:   "James Bond",
 *              date:     "20150414141537",
 *              deleted:  false
 *          }, {
 *              refPath:  "¶Administration¶Business Solutions¶connector_xml¶resources",
 *              name:     "standard_import_example",
 *              filehash: "6F35A6E25C927442CFD484EBBF6ECAE2",
 *              guid:     "(04089DB6-E667-EDDE-DB86-5FCB6E5F4DFB)",
 *              version:  "1",
 *              editor:   "Batman Superman",
 *              date:     "20150402162230",
 *              deleted:  false
 *          }]
 *     }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 *
 */
sol.define("sol.common.ix.services.ScriptVersionReportCreate", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {string} arcPath (required)
   * Repository start path
   */
  arcPath: undefined,

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    me.checkMandatoryProperties("arcPath");
  },

  /**
   * Generates a Version Script List in JSON-Format into a document.
   * @return {Object}
   */
  process: function () {
    var me = this,
        sordsSubEntry = [],
        arcPath = me.arcPath,
        scriptVersionList = {},
        timeDateJava = new Date(),
        isoDate = me.isoFromDate(timeDateJava),
        i,
        fileentry,
        ed,
        dv;

    sordsSubEntry = me.findFileInfo(arcPath, sordsSubEntry);
    scriptVersionList.date = isoDate;
    scriptVersionList.files = [];
    for (i = 0; i < sordsSubEntry.length; i++) {
      fileentry = {};
      ed = ixConnect.ix().checkoutDoc(sordsSubEntry[i].id, -1, EditInfoC.mbDocument, LockC.NO);
      dv = me.getWorkVersion(ed.document.docs);
      if (!dv) {
        continue;
      }
      fileentry.refPath = sordsSubEntry[i].refPaths[0].pathAsString;
      fileentry.name = sordsSubEntry[i].name;
      fileentry.guid = sordsSubEntry[i].guid;
      fileentry.filehash = dv.md5;
      fileentry.version = dv.version;
      fileentry.editor = dv.ownerName;
      fileentry.date = dv.updateDateIso;
      fileentry.deleted = dv.deleted;
      scriptVersionList.files.push(fileentry);
    }
    me.logger.debug(["JSON-object scriptVersionList = '{0}' is generated", scriptVersionList]);
    return scriptVersionList;
  },

  /**
   * List sub entries of a folder
   *
   * @param {String} arcPath archive path to start search
   * @param {Object[]} sordsSubEntry (childelements) of current folder represented by de.elo.ix.client.Sord
   * @return {Object[]} Subentries (childelements) of current folder represented by de.elo.ix.client.Sord
   */
  findFileInfo: function (arcPath, sordsSubEntry) {
    var me = this,
        ed,
        parentId,
        fi,
        sordZ,
        fr,
        frSords,
        isFolder,
        isDocument,
        isReference,
        i,
        idx;

    try {
      ed = ixConnect.ix().checkoutSord(arcPath, EditInfoC.mbOnlyId, LockC.NO);
      parentId = ed.sord.id;

      fi = new FindInfo();
      fi.findChildren = new FindChildren();
      fi.findChildren.parentId = parentId;
      fi.findChildren.endLevel = 1;
      fi.findChildren.mainParent = true;
      sordZ = SordC.mbAll;

      idx = 0;
      fr = ixConnect.ix().findFirstSords(fi, 1000, sordZ);
      while (true) {
        frSords = fr.sords;
        for (i = 0; i < frSords.length; i++) {
          isFolder = frSords[i].type < SordC.LBT_DOCUMENT;
          isDocument = frSords[i].type >= SordC.LBT_DOCUMENT && frSords[i].type <= SordC.LBT_DOCUMENT_MAX;
          isReference = frSords[i].parentId != parentId;

          if (isFolder && !isReference) {
            sordsSubEntry = me.findFileInfo(arcPath + "\\" + frSords[i].name, sordsSubEntry);
          }
          if (isDocument && !isReference) {
            me.logger.debug("Arcpath=" + arcPath + "\\" + frSords[i].name);
            sordsSubEntry.push(frSords[i]);
          }
        }
        if (!fr.isMoreResults()) {
          break;
        }
        idx += fr.sords.length;
        fr = ixConnect.ix().findNextSords(fr.searchId, idx, 1000, sordZ);
        frSords = fr.sords;
      }
    } catch (e) {
      me.logger.debug(["function findChildren (arcPath: '{0}') catch (e) name: '{1}' message: '{2}'", arcPath, e.name, e.message]);
    }
    if (fr) {
      ixConnect.ix().findClose(fr.searchId);
    }
    return sordsSubEntry;
  },

  isoFromDate: function (timeDateJava) {
    var me = this,
        isoDate = me.pad(timeDateJava.getFullYear(), 4) +
        me.pad(timeDateJava.getMonth() + 1, 2) +
        me.pad(timeDateJava.getDate(), 2) +
        me.pad(timeDateJava.getHours(), 2) +
        me.pad(timeDateJava.getMinutes(), 2) +
        me.pad(timeDateJava.getSeconds(), 2);
    return isoDate;
  },

  pad: function (val, len) {
    val = String(val);
    while (val.length < len) {
      val = "0" + val;
    }
    return val;
  },

  getWorkVersion: function (docs) {
    var dv, i;

    dv = null;
    for (i = 0; i < docs.length; i++) {
      dv = docs[i];
      if (dv.workVersion) {
        return dv;
      }
    }
    return dv;
  }

});

/**
 * @member sol.common.ix.services.ScriptVersionReportCreate
 * @method RF_sol_common_service_ScriptVersionReportCreate
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_ScriptVersionReportCreate(iXSEContext, args) {
  logger.enter("RF_sol_common_service_ScriptVersionReportCreate", args);
  var params, module, scriptVersionList;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "arcPath");
  module = sol.create("sol.common.ix.services.ScriptVersionReportCreate", params);
  scriptVersionList = module.process();
  logger.exit("RF_sol_common_service_ScriptVersionReportCreate");
  return sol.common.ix.RfUtils.stringify(scriptVersionList);
}