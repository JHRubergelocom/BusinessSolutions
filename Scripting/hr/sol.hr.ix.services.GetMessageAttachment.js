
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js

/**
 * Retrieves attachments for the hr corespondence form via guid/objId
 * returns object with
 * boolean isDoc true if attachment is a Document,
 * int size if attachment is a Document,
 * hr.config entry which contains maxSize when requested with param getConfig = true
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @retrun {Object}
 *
 * @eloix
 * @requires sol.common.Injection
 * @requires sol.common.SordUtils
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.ix.ServiceBase
 */


sol.define("sol.hr.ix.services.GetMessageAttachment", {
  extend: "sol.common.ix.ServiceBase",

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    attachmentConfig: { config: "hr", prop: "entities.file.services.getMessageAttachment" }
  },

  /**
  * @cfg {String} guid
  * the obj which should be checked out
  */

  /**
  * @cfg {Boolean} getConfig
  * should the configuration for maxSize be returned, used for buffering in form
  * in order to reduce traffic when multiple rows are added in one go
  */

  process: function () {
    var me = this,
        bufferSord = ixConnect.ix().checkoutSord(me.guid, EditInfoC.mbSord, LockC.NO),
        result = {};
    result.isDoc = sol.common.SordUtils.isDocument(bufferSord.sord);
    if (result.isDoc) {
      result.size = bufferSord.sord.docVersion.size;
    }
    if (!!me.getConfig && me.getConfig) {
      result.config = me.attachmentConfig;
    }
    return result;
  }
});

/**
 * @member sol.hr.ix.services.GetMessageAttachment
 * @method RF_sol_hr_service_GetMessageAttachment
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_hr_service_GetMessageAttachment(iXSEContext, args) {
  var rfArgs, fun;
  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  fun = sol.create("sol.hr.ix.services.GetMessageAttachment", rfArgs);

  return JSON.stringify(fun.process());
}