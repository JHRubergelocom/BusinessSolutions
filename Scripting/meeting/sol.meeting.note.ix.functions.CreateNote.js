importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.FunctionBase.js
//@include lib_sol.meeting.note.ix.NoteUtils.js
//@include lib_sol.meeting.note.mixins.Configuration.js


/**
 *
 * Create a new note object
 *
 * @eloix
 *
 * {
 *    source: {
 *      "name" : "Sord Name PU V",
 *      "note": "Notiz beschreibung",
 *      "title": "Test",
 *      "meetingMinutesRelevant" : true,
 *      "visibility" : "PU"
 *   }
 * }
 *
 * @requires sol.common.IxUtils
 * @requires sol.common.Template
 * @requires sol.common.Injection
 * @requires sol.common.ix.FunctionBase
 * @requires sol.meeting.note.ix.NoteUtils
 * @requires sol.meeting.note.ix.mixins.Configuration
 *
 */
sol.define("sol.meeting.note.ix.functions.CreateNote", {
  extend: "sol.common.ix.FunctionBase",

  mixins: [
    "sol.meeting.note.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  /**
  * @cfg templateSord
  */

  /**
  * @cfg $dryRun
  * When $dryRun is set to true then nothing will committed to the server
  */

  /**
   * @private
   * TODO: this can be declared in a generic way
   */
  sordKeys: ["name", "desc"],

  inject: {
    service: { config: "note", prop: "note.services.createNote", template: true },
    templateSord: { config: "note", prop: "note.templates.default", template: true },
    metadataMapping: { config: "note", prop: "note.services.createNote.options.metadataMapping" },
    source: { prop: "source" },
    params: { prop: "params" }
  },

  initialize: function (config) {
    var me = this, notesFolder;
    me.params = {}; // reset
    config.options = config.options || {};

    if (config.params && config.params.rootId) {
      notesFolder = sol.meeting.note.ix.NoteUtils.findNotesFolder(config.params.rootId);
      if (sol.meeting.note.ix.NoteUtils.findNotesFolder(config.params.rootId)) {
        config.params.targetFolder = notesFolder.id;
      } else {
        throw Error("Could not determine targetFolder. Has your item an notes folder");
      }
    }

    me.$super("sol.common.ix.FunctionBase", "initialize", [config]);
    sol.create("sol.common.Injection").inject(me);
  },

  process: function () {
    var me = this;

    if (!me.isDryRun()) {
      // TODO: error handling created object should be deleted when error occured
      return me.commit();
    } else {
      return me.emulate();
    }

  },

  isDryRun: function () {
    var me = this;
    return me.$dryRun === true;
  },

  commit: function () {
    var me = this, result;
    result = sol.common.IxUtils.execute(me.getMutatorFunction(), me.buildArgs());

    if (!result.objId) {
      throw Error("objId is missing in mutation result. Something went wrong...");
    }

    if (me.shouldIncludeResult()) {
      result.sord = sol.meeting.note.ix.NoteUtils.getNoteById(result.objId);
    }

    return result;
  },

  shouldIncludeResult: function () {
    var me = this;
    return me.options.includeResult === true;
  },

  emulate: function () {
    var me = this;
    me.logger.warn(["sords won't be updated because operation is running in $dryRun mode."]);
    return {
      source: me.source,
      name: me.getMutatorFunction(),
      args: me.buildArgs()
    };
  },

  getMutatorFunction: function () {
    return "RF_sol_function_FillSord";
  },

  buildArgs: function () {
    var me = this;

    return {
      source: { templateSord: me.templateSord, copySordKeys: me.useCopySordKeys() },
      target: {
        fromService: me.getFromService(),
        startWorkflow: me.getWorkflow()
      },
      metadataMapping: me.metadataMapping
    };
  },

  getFromService: function () {
    var me = this;
    return me.service && me.service.fromService;
  },

  getWorkflow: function () {
    var me = this;
    return me.service && me.service.workflow;
  },

  /**
   * TODO: this could be implemented in FillSord directly
   * @private
   * @returns {Array} copySordKeys for fillSord
   */
  useCopySordKeys: function () {
    var me = this;
    // calculate dynamically all sordKeys which should be set via templateSord
    // this is necessary because FillSord need sordKeys to copy as well
    return me.sordKeys.filter(function (sordKey) {
      return me.templateSord[sordKey];
    });
  }
});

/**
* @member
* @method RF_sol_meeting_note_function_CreateNote
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_note_function_CreateNote(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "source"),
      noteService, result;

  noteService = sol.create("sol.meeting.note.ix.functions.CreateNote", rfParams);
  result = noteService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}