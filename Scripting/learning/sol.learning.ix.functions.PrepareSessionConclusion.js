
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Stores participants in a formtable. (WfMap or Map)
 *
 * @author ESt, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.learning.ix.functions.PrepareSessionConclusion", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId", "flowId", "search", "setting"],

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    preparationSettings: { config: "learning", prop: "entities.session.functions.preparesessionconclusion.preparationsettings" }, // {}
    sord: { sordIdFromProp: "objId" },
    searchSettings: { prop: "search", template: true }
  },

  defaultTableType: "WFMAP",

  toEntry: function (tableType, participant, propCounters, entries, prop) {
    return entries.push({
      type: tableType,
      key: prop + (propCounters[prop]++),
      value: participant[prop]
    }), entries;
  },

  toEntries: function (tableType, propsInParticipant, propCounters, participant) {
    var me = this, toEntry = me.toEntry.bind(me, tableType, participant, propCounters);
    return propsInParticipant
      .reduce(toEntry, []);
  },

  concatInto: function (flattenedArray, arr) {
    return (flattenedArray = flattenedArray.concat(arr));
  },

  fillEmptyValueInParticipant: function (participant, field) {
    var me = this;
    !participant[field] && (participant[field] = me.newEmptyValue);
  },

  toFilled: function (participant) {
    var me = this;
    return me.fillEmptyValues.forEach(me.fillEmptyValueInParticipant.bind(me, participant)), participant;
  },

  generateSETConfig: function (participants) {
    var me = this, keys = Object.keys(participants[0] || {}), // all participants have the same props. Cache
        propCounters = keys.reduce(function (acc, key) {  // for keeping track of the table row for each column (prop)
          return (acc[key] = 1), acc;
        }, {}),
        config = { objId: me.objId, flowId: me.flowId },
        toEntries = me.toEntries.bind(me, (me.tableType || me.defaultTableType), keys, propCounters);

    config.entries = (Array.isArray(me.fillEmptyValues) ? participants.map(me.toFilled.bind(me)) : participants)
      .map(toEntries) // [{}] => [[]]
      .reduce(me.concatInto, []); // [[]] => []

    me.participantCount = participants.length;

    return config;
  },

  removeSessionFilter: function (config) {
    if (Array.isArray(config.search)) {
      config.search = config.search
      .filter(function (searchObj) {
        return searchObj && (searchObj.key !== "SESSION_REFERENCE");
      });
    }
  },

  generateSearchConfig: function () {
    var me = this, searchConfig = {
          masks: me.masks,
          search: me.searchSettings,
          options: me.options,
          output: me.preparationSettings[me.setting]
        };

    if (!Array.isArray(me.search)) {
      throw "`search` Parameter must be an Array. Look up RF_sol_common_service_SordProvider's search parameter for examples.";
    }
    if (!searchConfig.output) {
      throw "`setting` " + me.setting + " not found in preparationSettings. Possible settings are defined in the learning.config.";
    }

    if (me.sord.objKeys.SOL_TYPE === "COURSE") {
      me.removeSessionFilter(searchConfig);
    }
    return searchConfig;
  },

  searchParticipants: function () {
    var me = this;
    return sol.common.IxUtils.optimizedExecute(
      "RF_sol_common_service_SordProvider",
      me.generateSearchConfig(),
      me._optimize,
      me.setting,
      ["output"]
    ).sords;
  },

  addParticipantsToFormTable: function (config) {
    config.entries.length
      && sol.common.IxUtils.execute("RF_sol_function_Set", config);
    return config.entries.length;
  },

  setWfStatus: function (availableParticipants) {
    var me = this;
    sol.common.WfUtils.getNode(me.wfDiagram, 0)
      .yesNoCondition = availableParticipants ? "PARTICIPANTS_AVAILABLE" : "NO_PARTICIPANTS_AVAILABLE";
  },

  process: function () {
    var me = this;
    me.addParticipantsToFormTable(me.generateSETConfig(me.searchParticipants()));
    me.setWfStatus(me.participantCount);  //participantCount set in generateSETConfig
  }
});

/**
 * @member sol.learning.ix.functions.PrepareSessionConclusion
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
function onEnterNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId),

  params.objId = String(wfDiagram.objId);
  params.flowId = String(wfDiagram.id);
  params.wfDiagram = wfDiagram;
  fun = sol.create("sol.learning.ix.functions.PrepareSessionConclusion", params);

  fun.process();
}

/**
 * @member sol.recruiting.ix.functions.PrepareSessionConclusion
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wfDiagram, nodeId) {
  var params, fun;

  sol.common.WfUtils.checkMainAdminWf(wfDiagram);
  params = sol.common.WfUtils.parseAndCheckParams(wfDiagram, nodeId);

  params.objId = String(wfDiagram.objId);
  params.flowId = String(wfDiagram.id);
  params.wfDiagram = wfDiagram;
  fun = sol.create("sol.learning.ix.functions.PrepareSessionConclusion", params);

  fun.process();
}