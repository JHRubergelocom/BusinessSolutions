
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.hr.mixins.Configuration.js
//@include lib_sol.common.Injection.js
//@include lib_sol.hr.shared.Utils.js

/**
 * This function replaces an old superior in all personnel files with a new superior
 *
 * ### RF_sol_hr_function_ChangeSuperiorFile
 *
 * ## Mandytory Parameters
 *
 * - sourceSuperior: guid of old superior to be replaced
 *
 * - targetSuperior: guid of new superior to replace
 *
 * ### Example
 *
 *      {
 *        sourceSuperior: "(F28DC202-E54B-88E2-2658-EF0715E29158)",
 *        targetSuperior": "(CF3BE8C9-BF8D-50EC-137C-289D1C2179F5)"
 *      }
 *
 * ### Return value
 *
 * The function returns an object on success:
 *
 *     { code: "success" }
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ObjectUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.hr.mixins.Configuration
 * @requires sol.common.Injection
 * @requires sol.hr.shared.Utils
 */
sol.define("sol.hr.ix.functions.ChangeSuperiorFile", {
  extend: "sol.common.ix.FunctionBase",
  /**
  * @cfg {String} sourceSuperior The guid of old superior to be replaced
  * @cfg {String} targetSuperior The guid of of new superior to replace
  */

  _optimize: {}, // enables optimization. Will store optimization cache IDs

  mixins: ["sol.hr.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _sourceConfigs: { config: "hr", prop: "entities.file.functions.changesuperiorfile.sourceConfigs" } // {}
  },

  optimizedExecute: function (rf, config, optimization) {
    var me = this, result;
    optimization = optimization || "_";
    config.optimize = me._optimize[optimization] || true;  // add optimize === true or (in consecutive runs) optimization cache ID to config
    if (me._optimize[optimization]) {
      config.output = undefined;  // output will be ignored by target function anyways, since it is stored in the cache
    }
    result = sol.common.IxUtils.execute(rf, config);
    me._optimize[optimization] = result.optimization;  // store optimization cache ID in class cache
    return result;
  },

  getSourceConfig: function (superior, filter) {
    var me = this, rfConfig, hrSords;
    if (superior) {
      if (filter == "bySuperiorGuid") {
        rfConfig = me._sourceConfigs.bySuperiorGuid;
        rfConfig.search[1].value = superior;
        hrSords = me.optimizedExecute("RF_sol_common_service_SordProvider", rfConfig, "bySuperiorGuid");
      } else if (filter == "byGuid") {
        rfConfig = me._sourceConfigs.byGuid; // checkout via guid -> get objId
        rfConfig.id = superior;
        hrSords = me.optimizedExecute("RF_sol_common_service_SordProvider", rfConfig, "byGuid");
      }
    } else {
      throw "`superior` parameter must contain a proper guid";
    }
    return { hrSords: hrSords };
  },

  process: function () {
    var me = this, setSordConfig, hrSords, hrSord, supSord, i, params;
    hrSords = me.getSourceConfig(me.sourceSuperior, "bySuperiorGuid").hrSords;
    supSord = me.getSourceConfig(me.targetSuperior, "byGuid").hrSords.sords[0];
    for (i = 0; i < hrSords.sords.length; i++) {
      hrSord = hrSords.sords[i];
      setSordConfig = {
        objId: hrSord.id,
        entries: [{
          type: "GRP",
          key: "HR_PERSONNEL_SUPERIOR_GUID",
          value: supSord.guid
        }, {
          type: "GRP",
          key: "HR_PERSONNEL_SUPERIOR",
          value: supSord.firstname + ", " + supSord.lastname
        }, {
          type: "MAP",
          key: "HR_PERSONNEL_SUPERIORUSERID",
          value: supSord.elouserid
        }]
      };
      params = {
        objId: hrSord.id,
        text: sol.hr.shared.Utils.translate("sol.hr.personnel.superior.changed"),
        data: [hrSord.name, hrSord.superioruserid, supSord.elouserid]
      };
      sol.common.IxUtils.execute("RF_sol_function_FeedComment", params);
      sol.common.IxUtils.execute("RF_sol_function_Set", setSordConfig);
    }
    return { code: "success" };
  }
});

/**
 * @member sol.hr.ix.functions.ChangeSuperiorFile
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun, sourceSord;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sourceSord = ixConnect.ix().checkoutSord(params.objId, SordC.mbAllIndex, LockC.NO);
  params.sourceSuperior = String(sol.common.SordUtils.getValue(sourceSord, { key: "HR_PERSONNEL_SUPERIOR_GUID", type: "GRP" }));
  params.targetSuperior = String(sol.common.WfUtils.getWfMapValue(params.flowId, "HR_PERSONNEL_SUPERIORNEW_GUID"));

  fun = sol.create("sol.hr.ix.functions.ChangeSuperiorFile", params);

  fun.process();
}

/**
 * @member sol.hr.ix.functions.ChangeSuperiorFile
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(clInfo, userId, wfDiagram, nodeId) {
  var params, fun, sourceSord;

  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = wfDiagram.objId;
  params.flowId = wfDiagram.id;

  sourceSord = ixConnect.ix().checkoutSord(params.objId, SordC.mbAllIndex, LockC.NO);
  params.sourceSuperior = String(sol.common.SordUtils.getValue(sourceSord, { key: "HR_PERSONNEL_SUPERIOR_GUID", type: "GRP" }));
  params.targetSuperior = String(sol.common.WfUtils.getWfMapValue(params.flowId, "HR_PERSONNEL_SUPERIORNEW_GUID"));

  fun = sol.create("sol.hr.ix.functions.ChangeSuperiorFile", params);

  fun.process();
}




/**
 * @member sol.hr.ix.functions.ChangeSuperiorFile
 * @method RF_sol_hr_function_ChangeSuperiorFile
 * @static
 * @return {Object}
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_hr_function_ChangeSuperiorFile(iXSEContext, args) {
  var rfArgs, fun;

  rfArgs = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  sol.common.ix.RfUtils.checkMainAdminRights(iXSEContext.user, rfArgs);
  fun = sol.create("sol.hr.ix.functions.ChangeSuperiorFile", rfArgs);

  return JSON.stringify(fun.process());
}
