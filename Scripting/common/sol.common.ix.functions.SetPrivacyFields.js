
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_moment.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.WfUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ExceptionUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.functions.SetPrivacyFields" });

/**
 * Sets the privacy fields
 *
 * Since ELO 11 there are the privacy fields `ELO_PERSONALDATA_UID` and `ELO_PERSONALDATA_DELETEAT`.
 *
 * In the field `ELO_PERSONALDATA_UID` a privacy reference, e.g. the name, can be entered. Templating is used for this.
 * The corresponding template can be defined in `personalDataUidTplString`.
 *
 * A deletion date can be entered in the privacy field `ELO_PERSONALDATA_DELETEAT`. This date is calculated from the `baseDateFields`
 * and the deletion period. The latest date is used.
 *
 * # As workflow node
 *
 * ## Example
 *
 *    {
 *      "personalReference": {
 *        "mode": "SET",
 *        "template": "{{{sord.objKeys.VISITOR_FIRSTNAME}}} {{{sord.objKeys.VISITOR_LASTNAME}}}"
 *      },
 *      "deletionDate": {
 *        "mode": "SET",
 *        "baseDateFields": [{ "type": "GRP", "key": "VISITOR_DEPARTUREDATE" }, { "type": "GRP", "key": "VISITOR_STARTDATE" }],
 *        "deletionPeriodNumber": 4,
 *        "deletionPeriodUnit": "w"
 *      }
 *    }
 *
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires moment
 * @requires sol.common.DateUtils
 * @requires sol.common.Config
 * @requires sol.common.Template
 * @requires sol.common.WfUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.ExceptionUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.common.ix.functions.SetPrivacyFields", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {Object} personalReference
   * Configuration for setting the person reference
   */

  /**
   * @cfg {String} [personalReference.mode=SET]
   * Mode of processing the setting of the personal reference, e.g. `SET` or `DELETE`
   */

  /**
   * @cfg {String} personalReference.template
   * Personal reference template string, e.g. `{{{sord.objKeys.VISITOR_FIRSTNAME}}} {{{sord.objKeys.VISITOR_LASTNAME}}}`.
   * The result is written in the privacy field `ELO_PERSONALDATA_UID`.
   */

  /**
   * @cfg {Object} deletionDate
   * Configuration for setting the deletion date
   */

  /**
   * @cfg {String} [deletionDate.mode=SET]
   * Mode of processing the setting of the deletion date, e.g. `SET` or `DELETE`
   */

  /**
   * @cfg {Array} deletionDate.baseDateFields, e.g. `[{ "type": "GRP", "key": "VISITOR_DEPARTUREDATE" }, { "type": "GRP", "key": "VISITOR_STARTDATE" }]`
   * Base date fields for calculating the deletion date. The latest date is used for calculation.
   */

  /**
   * @cfg {Number} [deletionDate.deletionPeriodNumber=4]
   * Deletion period number
   * The latest base date plus the deletion period results in the deletion date.
   */

  /**
   * @cfg {String} [deletionDate.deletionPeriodUnit=week]
   * Deletion period unit
   * The latest base date plus the deletion period results in the deletion date.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        deletionPeriod = {},
        baseDateIso = "",
        sordChanged = false,
        sord, deletionMoment, deletionDateIso, personalDataUidTpl, personalDataUid,
        i, baseDateField, currentBaseDateIso, tplSord;

    if (!sol.common.SordUtils.hiddenLineExists("NAME_PERSONALDATA_DELETEAT")) {
      me.logger.debug(["Privacy fields do not exist. Can not set privacy fields. ix.majorVerion={0}", ixConnect.majorVersion + ""]);
      return;
    }

    if (me.personalReference) {

      me.personalReference.mode = me.personalReference.mode || "SET";

      sord = sol.common.RepoUtils.getSord(me.objId);

      if (me.personalReference.mode == "DELETE") {
        personalDataUid = "";
      } else {
        tplSord = sol.common.SordUtils.getTemplateSord(sord);
        personalDataUidTpl = sol.create("sol.common.Template", { source: me.personalReference.template });
        personalDataUid = personalDataUidTpl.apply(tplSord);
      }

      me.logger.debug(["Set privacy field 'ELO_PERSONALDATA_UID': mode={0}, objId={1}, sord.name={2}, personalDataUid={3}", me.personalReference.mode, me.objId, sord.name, personalDataUid]);

      sordChanged = true;
      sol.common.SordUtils.setObjKeyValue(sord, "ELO_PERSONALDATA_UID", personalDataUid, { silent: true });
    }

    if (me.deletionDate) {

      me.deletionDate.mode = me.deletionDate.mode || "SET";

      if (me.deletionDate.mode == "DELETE") {
        deletionDateIso = "";
      } else {
        me.deletionDate.deletionPeriodNumber = me.deletionDate.deletionPeriod || 4;

        me.deletionDate.deletionPeriodUnit = me.deletionDate.deletionPeriodUnit || "weeks";

        sord = sord || sol.common.RepoUtils.getSord(me.objId);

        deletionPeriod[me.deletionDate.deletionPeriodUnit] = me.deletionDate.deletionPeriodNumber;

        me.deletionDate.baseDateFields = me.deletionDate.baseDateFields || [];

        for (i = 0; i < me.deletionDate.baseDateFields.length; i++) {
          baseDateField = me.deletionDate.baseDateFields[i];
          currentBaseDateIso = sol.common.SordUtils.getValue(sord, baseDateField);
          if (!currentBaseDateIso) {
            continue;
          }
          currentBaseDateIso = sol.common.StringUtils.padRight(currentBaseDateIso, 14, "0");
          if (currentBaseDateIso > baseDateIso) {
            baseDateIso = currentBaseDateIso;
          }
        }

        if (baseDateIso) {
          deletionMoment = sol.common.DateUtils.isoToMoment(baseDateIso, { startOfDay: true });
        } else {
          deletionMoment = new moment();
        }
        deletionMoment.add(deletionPeriod);

        deletionDateIso = sol.common.DateUtils.momentToIso(deletionMoment, { startOfDay: true });
      }

      me.logger.debug(["Set privacy field 'ELO_PERSONALDATA_DELETEAT': mode={0}, objId={1}, sord.name={2}, deletionDate={3}", me.deletionDate.mode, me.objId, sord.name, deletionDateIso]);

      sordChanged = true;
      sol.common.SordUtils.setObjKeyValue(sord, "ELO_PERSONALDATA_DELETEAT", deletionDateIso, { silent: true });
    }

    if (sordChanged) {
      ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);
    }
  }
});

/**
 * @member sol.common.ix.functions.SetPrivacyFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onEnterNode_SetPrivacyFields", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.common.ix.functions.SetPrivacyFields", params);
  module.process();

  logger.exit("onEnterNode_SetPrivacyFields");
}

/**
 * @member sol.common.ix.functions.SetPrivacyFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(ci, userId, wfDiagram, nodeId) {
  var module, params;

  logger.enter("onExitNode_SetPrivacyFields", { flowId: wfDiagram.id, nodeId: nodeId });
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.wfDiagram = wfDiagram;
  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;
  params.nodeId = nodeId;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);

  module = sol.create("sol.common.ix.functions.SetPrivacyFields", params);
  module.process();

  logger.exit("onExitNode_SetPrivacyFields");
}

/**
 * @member sol.common.ix.functions.SetPrivacyFields
 * @method RF_sol_function_SetPrivacyFields
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_function_SetPrivacyFields(ec, configAny) {
  var module, params, result;

  logger.enter("RF_sol_function_SetPrivacyFields", configAny);
  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, configAny);

  sol.common.ix.RfUtils.checkMainAdminRights(ec.user, params);

  module = sol.create("sol.common.ix.functions.SetPrivacyFields", params);
  result = module.process();

  logger.exit("RF_sol_function_SetPrivacyFields");

  return result;
}