
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.StringUtils.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.DownloadFileContent" });

/**
 * Downloads a small file content as text from a document that is stored in elo.
 *
 * This service is useful if information should be downloaded from web applications.
 *
 * # As IX service call
 *
 * Download content of work version:
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_DownloadFileContent', {
 *       objId: '123'
 *     });
 *
 * Download content of a specific version:
 *
 *     sol.common.IxUtils.execute('RF_sol_common_service_DownloadFileContent', {
 *       docId: '123'
 *     });
 *
 * Returns content as followed:
 *
 *     {
 *       content: " --- FILE CONTENT GOES HERE --- "
 *     }
 *
 * @author NM, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.common.Cache
 * @requires  sol.common.ObjectUtils
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.AclUtils
 * @requires  sol.common.RepoUtils
 * @requires  sol.common.SordUtils
 * @requires  sol.common.ObjectFormatter
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.ServiceBase
 */

sol.define("sol.common.ix.services.DownloadFileContent", {
  extend: "sol.common.ix.ServiceBase",

  /**
   * @cfg {String} objId
   */

  /**
   * @cfg {String} docId
   */

  /**
   * @cfg {Boolean} preserveBOM
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
    if (!me.objId && !me.docId) {
      throw "IllegalArgumentException: 'sol.common.ix.services.DownloadFileContent' needs either an objId or a docId";
    }
  },

  process: function () {
    var me = this,
        params, content;

    params = {
      preserveBOM: me.preserveBOM,
      charsets: me.charsets
    };

    if (me.objId) {
      content = sol.common.RepoUtils.downloadToString(me.objId, null, params);
    } else if (me.docId) {
      content = sol.common.RepoUtils.downloadToString(null, me.docId, params);
    }

    return {
      content: content
    };
  }
});

/**
 * @member sol.common.ix.services.DownloadFileContent
 * @method RF_sol_common_service_DownloadFileContent
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_service_DownloadFileContent(iXSEContext, args) {
  logger.enter("RF_sol_common_service_DownloadFileContent", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  service = sol.create("sol.common.ix.services.DownloadFileContent", params);
  result = sol.common.JsonUtils.stringifyAll(service.process());

  logger.exit("RF_sol_common_service_DownloadFileContent", result);

  return result;
}
