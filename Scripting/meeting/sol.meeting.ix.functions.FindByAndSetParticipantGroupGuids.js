importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.FindParticipantGroups" });




/**
 * Retrieves available meetings.
 *
 *
 * @author MHe, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.common.UserUtils
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.functions.FindParticipantGroups", {
  extend: "sol.common.ix.FunctionBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    sord: { sordIdFromProp: "objId", flowIdFromProp: "flowId" }
  },


  process: function () {
    var me = this, result, searchConfig;

    try {
      searchConfig = me.prepareFindParticipantGroupsSearch();
      result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", searchConfig, me._optimize, "getParticipantGroup", ["output"]);
      me.logger.info(["Find partgroups {0}", JSON.stringify(result)]);
      return me.executeSet(me.prepareSetFunction(result));
    } catch (e) {
      if (e.code === "NO_PARTICIPANTS") {
        me.logger.info([e.message]);
      } else {
        throw e;
      }
    }
  },

  prepareFindParticipantGroupsSearch: function () {
    var me = this, searchConfig, searchValues = [], key;

    // prepare search values
    for (key in me.sord.mapKeys) {
      key.startsWith("PARTICIPANTGROUP_REFERENCE")
          && searchValues.push(me.sord.mapKeys[key]);
    }

    if (searchValues.length === 0) {
      throw { code: "NO_PARTICIPANTS", message: "no participants groups was added. Skipping function" };
    }

    me.logger.info(["searchValues {0}", JSON.stringify(searchValues)]);
    
    // TODO: should be refactor to config
    searchConfig = {
      masks: ["Meeting ParticipantGroup"],
      search: [
        { key: "MEETING_PARTICIPANTGROUP_REFERENCE", value: searchValues }
      ],
      output: [
        { source: { type: "SORD", key: "guid" }, target: { prop: "guid" } },
        { source: { type: "SORD", key: "id" }, target: { prop: "objId" } },
        { source: { type: "SORD", key: "name" }, target: { prop: "name" } }
      ],
      options: {
        allowEmptyMask: false,
        formatAsTemplateSord: true,
        maxResults: searchValues.length
      }
    };

    return searchConfig;
  
  },

  prepareSetFunction: function (searchResult) {
    var me = this, setInstructions;

    setInstructions = sol.common.ObjectUtils.map(searchResult.sords, function (sordResult, index) {
      var fieldName = "PARTICIPANTGROUP_GUID" + (index + 1);
      return { type: "MAP", key: fieldName, value: sordResult.guid };
    });
    me.logger.info(["setInstructions {0}", JSON.stringify(setInstructions)]);
    return setInstructions;
  },

  // TODO: implement as external configuration, so we can implement dryRun
  executeSet: function (setInstructions) {
    var me = this;
    return sol.common.IxUtils.execute("RF_sol_function_Set", {
      objId: me.objId,
      flowId: me.flowId,
      entries: setInstructions
    });
  }


});

/**
 * @member sol.common.ix.functions.generators.GenerateFileReference
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(info, userId, diagram, nodeId) {
  logger.enter("onExitNode_FindParticipantGroups", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId), service;

  params.objId = diagram.objId;
  params.flowId = diagram.id;
  service = sol.create("sol.meeting.ix.functions.FindParticipantGroups", params);

  service.process();

  logger.exit("onExitNode_FindParticipantGroups");
}

/**
 * @member sol.meeting.ix.services.GetMeetings
 * @method RF_sol_meeting_service_GetMeetings
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_meeting_service_GetMemberOfParticipantGroup(context, args) {
  logger.enter("RF_sol_meeting_function_FindParticipantGroups", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);
  delete params._optimize;

  service = sol.create("sol.meeting.ix.functions.FindParticipantGroups", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_function_FindParticipantGroups", result);
  return result;
}
