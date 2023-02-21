
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.functions.CreateMeetingHeadless" });

/**
 * This function can be used to create meetings without user interaction.
 *
 * The function used to create new meetings is called `RF_sol_meeting_function_CreateMeetingHeadless` and has a defined interface.
 * To create a meeting this function needs a {@link #sordMetadata} object, which has to be a template sord containing the new meetings metadata.
 * Further a {@link #template} configuration is needed to determine the template which will be used to create the new meeting.
 *
 * ### Examples
 *
 * ### Configuration for createing a meeting
 *
 *     {
 *       meetingBoardId: 4713,
 *       template: { name: "Default" },
 *       sordMetadata: {
 *         objKeys: {
 *           MEETING_NAME: "Meetingname",
 *           MEETING_STARTDATE: "20200101",
 *           MEETING_ENDDATE: "20200101"
 *         },
 *         mapKeys: {
 *           MEETING_TIMESLOT_DAY1: "20200101",
 *           MEETING_TIMESLOT_START1: "0900",
 *           MEETING_TIMESLOT_END1: "1700"
 *         }
 *       }
 *     }
 *
 *
 * @eloix
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.RepoUtils
 * @requires sol.common.Template
 * @requires sol.common.ix.FunctionBase
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.meeting.ix.functions.CreateMeetingHeadless", {
  extend: "sol.common.ix.FunctionBase",

  requiredConfig: ["meetingBoardId", "meetingId", "template", "sordMetadata"],

  /**
   * @cfg {Object} sordMetadata (required) A template sord containing the meeting information.
   */

  /**
   * @cfg {Object} template (required) Configuration to determine the meeting template.
   * @cfg {String} template.name (required) Name of the meeting template.
   */

  /**
   * @cfg {String} meetingBoardId (required) Id of meetingboard.
   * @cfg {String} meetingId (required) Id of meeting.
   */

  mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    meetingFields: { config: "meeting", prop: "entities.meeting.fields" },
    templatesFolder: { config: "meeting", prop: "entities.meeting.functions.createheadless.const.templatesFolder" },
    workflow: { config: "meeting", prop: "entities.meeting.functions.createheadless.workflow", template: true },
    meetingBoard: { sordIdFromProp: "meetingBoardId", optional: false },
    sord: { sordIdFromProp: "meetingId", optional: false }
  },

  /**
   * Creates the meeting.
   * @return {Object}
   */
  process: function () {
    var me = this,
      fillSordConfig, meeting;

    me.prepareTemplate();
    me.prepareMetadata();

    fillSordConfig = {
      source: {
        templateSord: me.sordMetadata,
        copySordKeys: ["desc"]
      },
      target: {
        fromService: {
          name: "RF_sol_function_CreateSord",
          params: {
            sourceElement: {
              objId: me.template.id,
              options: {
                copySourceAcl: true
              }
            },
            targetFolder: {
              objId: "0"
            },
            onCreatedElement: {}
          }
        },
        startWorkflow: {
          name: me.getWfName(),
          title: me.getWfTitle(),
          concluding: true
        }
      },
      options: {
        mandatoryFields: [
          {
            type: "GRP",
            id: "MEETING_NAME"
          },
          {
            type: "GRP",
            id: "MEETING_STARTDATE"
          },
          {
            type: "GRP",
            id: "MEETING_ENDDATE"
          },
          {
            type: "GRP",
            id: "MEETING_TIMESLOT_DAY"
          },
          {
            type: "GRP",
            id: "MEETING_TIMESLOT_START"
          },
          {
            type: "GRP",
            id: "MEETING_TIMESLOT_END"
          },
          {
            type: "MAP",
            id: "MEETING_TIMESLOT_DAY1"
          },
          {
            type: "MAP",
            id: "MEETING_TIMESLOT_START1"
          },
          {
            type: "MAP",
            id: "MEETING_TIMESLOT_END1"
          }
        ]
      }
    };

    meeting = sol.common.IxUtils.execute("RF_sol_function_FillSord", fillSordConfig);

    return { code: "success", data: meeting, info: "Meeting created successfully" };
  },

  /**
   * @private
   * Retrieves the template for the meeting.
   * Ensures that the template at least has a 'name' and an 'id'
   */
  prepareTemplate: function () {
    var me = this;
    if (!me.template.name) {
      throw "Headless Create: No parameter `name` defined in `template`";
    }

    me.template.id = sol.common.RepoUtils.getObjIdFromRelativePath(me.templatesFolder, "/" + me.template.name);

    if (!me.template.id) {
      throw "Headless Create: No template found for name '" + me.template.name + "'";
    }
  },

  /**
   * @private
   * Prepares the metadata object.
   * Ensures that the SOL_TYPE and the meeting type is set.
   */
  prepareMetadata: function () {
    var me = this;

    //meetingboard
    me.sordMetadata.objKeys.SOL_TYPE = me.meetingFields.SOL_TYPE.defaultValue;
    me.sordMetadata.objKeys.MEETING_BOARD_NAME = me.meetingBoard.objKeys.MEETING_BOARD_NAME;
    me.sordMetadata.objKeys.MEETING_BOARD_REFERENCE = me.meetingBoard.guid;
    me.sordMetadata.objKeys.MEETING_PROVIDED_PROPOSALTYPES = me.meetingBoard.objKeys.MEETING_PROVIDED_PROPOSALTYPES;
    me.sordMetadata.objKeys.MEETING_BOARD_CODE = me.meetingBoard.objKeys.MEETING_BOARD_CODE;

    //meeting
    me.sordMetadata.objKeys.MEETING_LOCATION = me.sord.objKeys.MEETING_LOCATION;
    me.sordMetadata.objKeys.MEETING_ROOM = me.sord.objKeys.MEETING_ROOM;
    me.sordMetadata.objKeys.MEETING_PRESENTER = me.sord.objKeys.MEETING_PRESENTER;
    me.sordMetadata.objKeys.MEETING_MINUTE_TAKER = me.sord.objKeys.MEETING_MINUTE_TAKER;
    me.sordMetadata.desc = me.sord.desc;
    
  },

  /**
   * @private
   * Creates the workflow title.
   * @return {String}
   */
  getWfTitle: function () {
    var me = this;
    return me.workflow.title;
  },

  /**
   * @private
   * Retrieves the headless workflow.
   * @return {String}
   */
  getWfName: function () {
    var me = this;
    return me.workflow.name;
  }

});

/**
 * @member sol.common.ix.functions.ChangeRights
 * @method RF_sol_meeting_function_CreateMeetingHeadless
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_meeting_function_CreateMeetingHeadless(ec, args) {
  var params, module, result;

  logger.enter("RF_sol_meeting_function_CreateMeetingHeadless", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "meetingBoardId", "template", "sordMetadata");
  params.user = ec.user;
  module = sol.create("sol.meeting.ix.functions.CreateMeetingHeadless", params);
  result = JSON.stringify(module.process());

  logger.exit("RF_sol_meeting_function_CreateMeetingHeadless");
  return result;
}
