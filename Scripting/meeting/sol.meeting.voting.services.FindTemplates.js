importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.meeting.voting.mixins.Configuration.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.FindTemplates" });

/**
*
* @author JK, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.IxUtils
* @requires sol.common.JsonUtils
* @requires sol.common.ObjectUtils
* @requires sol.common.Template
* @requires sol.common.SordUtils
* @requires sol.common.RepoUtils
* @requires sol.common.Injection
* @requires sol.common.ix.ServiceBase
* @requires sol.meeting.voting.mixins.Configuration
*/
sol.define("sol.meeting.voting.ix.services.FindTemplates", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.voting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  inject: {
    templateFolderId: { config: "voting", prop: "voting.templateFolderId" },
    findTemplateCfg: { config: "voting", prop: "voting.services.findTemplates" }
  },

  process: function () {
    var me = this, votingTemplates, votingTypes;

    votingTemplates = sol.common.RepoUtils.findChildren(me.templateFolderId, {
      includeDocuments: false,
      includeFolders: true,
      includeReferences: true,
      level: 2,
      maskIds: me.findTemplateCfg.masks
    });

    votingTypes = (votingTemplates || []).map(function (sord) {
      return sol.common.SordUtils.getTemplateSord(sord).sord;
    }).map(function (tplSord) {
      (me.findTemplateCfg.enableTemplating || []).forEach(function (translateProp) {
        var translateValue = sol.common.TemplateUtils.render(sol.common.ObjectUtils.getProp(tplSord, translateProp), {});
        sol.common.ObjectUtils.setProp(tplSord, translateProp, translateValue);
      });
      return tplSord;
    });

    return {
      sords: votingTypes
    };
  }

});

/**
* @member sol.meeting.voting.ix.services.FindTemplates
* @method RF_sol_meeting_voting_service_Find_Templates
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_voting_service_Find_Templates(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      votingService;

  votingService = sol.create("sol.meeting.voting.ix.services.FindTemplates", rfParams);
  return sol.common.JsonUtils.stringifyQuick(votingService.process());
}