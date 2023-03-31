
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.AclUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common_monitoring.ix.MonitorUtils.js
//@include lib_sol.knowledge.ix.KnowledgeUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.knowledge.ix.services.EditBoardOrSpace" }); // eslint-disable-line one-var

/**
 * Edits a board or a space
 *
 * # Edit a post
 *
 *     result = sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Edit", {
 *       objId: "(7146D09A-3889-BE1F-EDC7-631166F86797)",
 *       content: "Content2",
 *       lang: "de",
 *       topics: ["Topic3", "Topic4"],
 *       pinnedAt: ["pin1", "pin2"],
 *       label: "Label1",
 *       createdFiles: ["(0C055DF8-9567-A640-0C01-741E5C264250)", "(BD628BE4-5951-E722-0B07-6F903756A226)"],
 *       createReferences: ["(0C055DF8-9567-A640-0C01-53A231289DD1)", "(BD628BE4-5951-E722-0B07-44FFED3412AA)"],
 *       deleteReferences: ["(0C055DF8-9567-A640-99A1-741E5C264250)", "(BD628BE4-5951-BB23-C123-6F903756A226)"]
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Config
 * @requires sol.common.DateUtils
 * @requires sol.common.Template
 * @requires sol.common.AclUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.WfUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectFormatter
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common_monitoring.ix.MonitorUtils
 * @requires sol.knowledge.ix.KnowledgeUtils
 */
sol.define("sol.knowledge.ix.services.EditBoardOrSpace", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} objId (required)
   * Object ID
   */

  /**
   * @cfg {String} content
   * Content
   */

  /**
   * @cfg {String} name
   * Name
   */

  /**
   * @cfg {String[]} createdFiles
   * Object IDs of created files
   */

  process: function () {
    var me = this,
      sord,
      previewImageValue;

    if (sol.common.AclUtils.hasEffectiveRights(me.objId, { rights: { w: true } })) {
      sord = ixConnect.ix().checkoutSord(me.objId, SordC.mbAllIndex, LockC.NO);

      if (me.content) {
        sord.desc = me.content;
      }

      if (me.name) {
        sord.name = me.name;
      }

      if (me.previewImage || me.removePreviewImage) {
        previewImageValue = me.removePreviewImage ? [""] : [me.previewImage];
        sol.common.SordUtils.setObjKeyValues(sord, "KNOWLEDGE_SPACE_PREVIEW_IMAGE", previewImageValue);
      }

      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);

      if (me.createdFiles && me.createdFiles.length > 0) {
        sol.common.RepoUtils.moveSords(me.createdFiles, me.objId);
      }

      return { objId: me.objId };
    }

    return { message: "user does not have rights to write board or space with id " + me.objId };
  }
});

/**
 * @member sol.knowledge.ix.services.Post
 * @method RF_sol_knowledge_service_Post_Edit
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_knowledge_service_EditBoardOrSpace(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
    params, service, result;

  logger.enter("RF_sol_knowledge_service_EditBoardOrSpace", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.knowledge.ix.services.EditBoardOrSpace", params);
  result = rfUtils.stringify(service.process());

  logger.exit("RF_sol_knowledge_service_EditBoardOrSpace", result);

  return result;
}
