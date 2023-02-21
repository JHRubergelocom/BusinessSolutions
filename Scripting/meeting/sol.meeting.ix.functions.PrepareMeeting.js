
//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.ix.AgendaScheduler.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.MeetingItemRepository.js



var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.PrepareMeeting" });

/**
 * @requires sol.common.IxUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.Template
 * @requires sol.common.Injection
 * @requires sol.common.ObjectUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.FunctionBase
 * @requires sol.meeting.ix.AgendaScheduler
 */
sol.define("sol.meeting.ix.functions.PrepareMeeting", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String|Number} objId
   * The objId, guid or ARCPATH of the meeting object
   */

  /**
   * @cfg {Boolean} $dryRun
   * If `$dryRun` is set to true all updated won't be performed on the fetched sord objects
   */

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    itemOutput: { config: "meeting", prop: "entities.meetingitem.outputs.itemFull", template: false },
    itemSearchConfig: { config: "meeting", prop: "entities.meeting.services.getItems", template: true },
    itemMetadataMapping: { config: "meeting", prop: "entities.meeting.functions.prepareMeeting.metadataMapping", template: true },
    useGenerator: { config: "meeting", prop: "entities.meeting.functions.prepareMeeting.useMeetingItemShortDescGenerator", template: false },
    useRefGenerator: { config: "meeting", prop: "entities.meeting.functions.prepareMeeting.useMeetingItemReferenceGenerator", template: false },
    meetingItemGenerators: { config: "meetingItem", prop: "meetingItem.generators.shortDesc", template: false },
    meetingItemRefGenerators: { config: "meetingItem", prop: "meetingItem.generators.reference", template: false },
    sord: { sordIdFromProp: "objId", optional: false }
  },


  process: function () {
    var me = this, scheduler, items, fillSordConfigs;

    items = me.findItems();

    if (sol.common.ObjectUtils.isArray(items) && items.length > 0) {
      scheduler = me.createAgendaScheduler(items);
      items = scheduler.schedule();

      fillSordConfigs = items.map(me.toFillSordConfig.bind(me));
      if (!me.$dryRun) {
        fillSordConfigs.forEach(function (cfg) {
          sol.common.IxUtils.execute("RF_sol_function_FillSord", cfg);
        });
      } else {
        return {
          code: "dryRun",
          data: items,
          updateConfigs: fillSordConfigs
        };
      }
    }

    return { code: "success", message: "updated " + items.length + " items" };
  },


  /**
   *
   * @param {*} items
   * @returns
   */
  createAgendaScheduler: function (items) {
    // currently we only have the ability to append all items to the first day
    return sol.create("sol.meeting.ix.AgendaScheduler", {
      startTime: this.sord.mapKeys.MEETING_TIMESLOT_START1,
      items: items
    });
  },

  /**
  * Find Items from the specific meeting and add it to the result
  * @private
  * @returns
  */
  findItems: function () {
    // We have to work with templateSord structure because we dont have a mechanism
    // to write back flat structure to any sord object
    var me = this, agenda;
    agenda = sol.meeting.ix.MeetingItemRepository
      .findItemsByMeeting(me.sord.objKeys.MEETING_REFERENCE);

    // this is necessary because we dont have any not filter in sordprovider
    // attenation: because we use templateSord formatter here target prop definition
    // of the itemOutput will ignore
    return (agenda.sords || [])
      .filter(function (item) {
        return item.objKeys.MEETING_ITEM_DAY != "0";
      })
      .sort(function (itemA, itemB) {
        return +itemA.objKeys.MEETING_AGENDA_POSITION > +itemB.objKeys.MEETING_AGENDA_POSITION ? 1 : -1;
      });
  },

  toFillSordConfig: function (item) {
    var me = this, additionalData;

    additionalData = me.prepareAdditionalData(item);

    item.name = additionalData.shortDesc;
    item.objKeys.MEETING_ITEM_ID = additionalData.reference;

    return {
      source: {
        templateSord: item,
        copySordKeys: ["name"]
      },
      metadataMapping: me.itemMetadataMapping,
      options: {
        onlyWriteMappings: true,
        name: item.name
      },
      target: {
        objId: item.id
      }
    };
  },

  prepareAdditionalData: function (item) {
    var me = this,
      generator = me.getGenerator(),
      refGenerator = me.getRefGenerator();

    return sol.common.TemplateUtils.render({
      shortDesc: generator.source.trim(),
      reference: refGenerator.source.trim()
    }, { item: item });
  },

  getGenerator: function () {
    var me = this,
      gen = me.meetingItemGenerators[me.useGenerator];

    if (!gen) {
      throw Error("No shortDesc generator was selected for meeting items in `sol.meeting.ix.functions.PrepareMeeting`");
    }

    return gen;
  },

  getRefGenerator: function () {
    var me = this,
      gen = me.meetingItemRefGenerators[me.useRefGenerator];

    if (!gen) {
      throw Error("No reference generator was selected for meeting items in `sol.meeting.ix.functions.PrepareMeeting`");
    }

    return gen;
  }
});

/**
 * @member sol.meeting.ix.functions.PrepareMeeting
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onEnterNode
 */
 function onEnterNode(client, userId, diagram, nodeId) {
  logger.enter("onEnterNode_PrepareMeeting", { flowId: diagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(diagram, nodeId),
      generator;

  params.objId = String(diagram.objId);
  params.flowId = String(diagram.id);
  generator = sol.create("sol.meeting.ix.functions.PrepareMeeting", params);

  generator.process();

  logger.exit("onEnterNode_PrepareMeeting");
}

/**
 * @member sol.meeting.ix.functions.PrepareMeeting
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#onExitNode
 */
function onExitNode(_clInfo, _userId, wFDiagram, nodeId) {
  logger.enter("onExitNode_PrepareMeeting", { flowId: wFDiagram.id, nodeId: nodeId });
  var params = sol.common.WfUtils.parseAndCheckParams(wFDiagram, nodeId),
      generator;

  params.objId = String(wFDiagram.objId);
  params.flowId = String(wFDiagram.id);
  generator = sol.create("sol.meeting.ix.functions.PrepareMeeting", params);

  generator.process();

  logger.exit("onExitNode_PrepareMeeting");
}


/**
* @member sol.meeting.ix.functions.PrepareMeeting
* @method RF_sol_meeting_function_PrepareMeeting
* @static
* @inheritdoc sol.common.ix.FunctionBase#RF_sol_meeting_function_PrepareMeeting
*/
function RF_sol_meeting_function_PrepareMeeting(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId"),
      result = sol.create("sol.meeting.ix.functions.PrepareMeeting", rfParams).process();

  return sol.common.JsonUtils.stringifyQuick(result);
}