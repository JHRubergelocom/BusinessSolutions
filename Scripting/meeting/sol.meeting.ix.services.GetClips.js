importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetClips" });

/**
 * Retrieves Clips of a specific profile.
 *
 * The profiles could be declare in notification.config
 *
 * A clip must have the following structure
 *
 *   {
 *      "clip-key": {
 *         "title": "{{translate 'sol.common.clip'}}",
 *         "html": "Content which is filled into the editor after user select clip"
 *       }
 *   }
 *
 * Currently the result format is a specific expected format of redactor
 * so the clips could be rendered into redactor
 *
 * @eloix
 *
 * @requires sol.common.Template
 * @requires sol.common.Injection
 * @requires sol.common.ix.ServiceBase
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.services.GetClips", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["profile"],

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    clips: { config: "notification", prop: "entries.notification.clips", template: false }
  },

  process: function () {
    var me = this, resolvedClips, renderedTitle, clipsOfProfile;

    clipsOfProfile = me.clips[me.profile];

    if (!clipsOfProfile) {
      throw Error(me.profile + " is not a valid clip profile");
    }

    resolvedClips = Object.keys(clipsOfProfile)
      .map(function (key) {
         return clipsOfProfile[key];
      }).map(function (clip) {
         renderedTitle = sol.common.TemplateUtils.render(clip.title, {});
         return [renderedTitle, clip.html || ""];
      });

    return {
      clips: resolvedClips
    };
  }
});

/**
 * @member sol.meeting.ix.services.GetClips
 * @method RF_sol_meeting_service_GetClips
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
 function RF_sol_meeting_service_GetClips(context, args) {
  logger.enter("RF_sol_meeting_service_GetClips", args);
  var params, service, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(context, arguments.callee.name, args);

  service = sol.create("sol.meeting.ix.services.GetClips", params);
  result = JSON.stringify(service.process());

  logger.exit("RF_sol_meeting_service_GetClips", result);
  return result;
}
