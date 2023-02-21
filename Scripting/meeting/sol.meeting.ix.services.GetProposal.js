importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.GetProposal" });

/**
* Returns the proposal object of a given meeting item
*
* @private
* This function will be replaced in future
*
* # As an ix function call
*    sol.common.IxUtils.execute("RF_sol_meeting_service_GetProposal", {
*       source: {
*         objKeys: { MEETING_ITEM_ID: "TOP-0001"}
*       }
*    });
*
* @author MHe, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.JsonUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.IxUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.ix.services.GetProposal", {
  extend: "sol.common.ix.ServiceBase",

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Injection.SordToken",
    "sol.common.mixins.Inject"
  ],

  inject: {
    getProposalConfig: { config: "proposals", prop: "services.GetProposalByItemId", template: true },
    proposalFullOutput: { config: "proposals", prop: "outputs.proposalFull" }
  },

  _optimize: {},

  throwError: false,

  process: function () {
    var me = this, proposal, proposalChildren, result = {};
    me.options = me.options || {};
    me.query = me.query || {};

    try {
      proposal = me.getProposal();

      proposalChildren = me.query.collectChildren
        ? me.collectProposalDocuments(proposal)
        : undefined;

      me.logger.debug(["collectChildren {0}", proposalChildren]);
      if (me.options.formatAsTemplateSord && me.query.proposalDoc) {
        // deprecated path, is used by pdf generation
        // This is a workaround, we need a concept to collect
        // specific data
        // append additional data to the templateSord object.
        // to another functions can use it in handlebars.
        // Maybe it would be nice to define something like computedKeys? and FillSord
        // add computedKeys also to the template context object

        // This add the data only to a virtual templateSord json object to use it in fillSord
        // without real sord object usage
        proposal.mapKeys["MEETING_PROPOSAL_CONTENT_DOC_ID"] = me.findProposalContentDocument(proposal).id;
      }
    } catch (error) {
      me.logger.warn(["An error occured in service `GetProposal` {0}", error.message]);
      if (me.throwError) {
        throw error;
      }
    }

    result[me.options.elementArg || "proposal"] = proposal;
    result.children = proposalChildren;
    return result;
  },

  getProposal: function () {
    var me = this, result, args,
        options = {
          maxResult: 1,
          formatAsTemplateSord: me.options.formatAsTemplateSord || false
        };

    args = me.objId
      ? me.prepareArgsById(me.objId, me.output || me.proposalFullOutput, options)
      : me.prepareArgsBySearch(me.getProposalConfig, me.output || me.proposalFullOutput, options);

    result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", args, me._optimize, "proposals", ["output"]);
    return me.checkAndGet(result.sords);
  },

  prepareArgsById: function (id, output, options) {
    var me = this;
    me.logger.debug(["GetProposal: prepareArgsById id={0}, options={1}", id, JSON.stringify(options)]);
    return {
      ids: [id],
      output: output,
      options: options
    };
  },

  /**
   *
   * @param {*} cfg
   * @param {Array<String>} cfg.masks
   * @param {Array<Object>} cfg.search
   * @param {Array<Object>} output
   * @param {*} options
   * @returns {Object}
   */
  prepareArgsBySearch: function (cfg, output, options) {
    var me = this;
    me.logger.debug(["GetProposal: prepareArgsBySearch cfg={0}, options={1}", JSON.stringify(cfg), JSON.stringify(options)]);
    return {
      masks: cfg.masks,
      search: cfg.search,
      output: output,
      options: options
    };
  },

  checkAndGet: function (sords) {
    var me = this;
    me.logger.debug(["check result (count={1}) {0}", JSON.stringify(sords), sords.length]);
    if (!sords || sords.length === 0) {
      if (me.options.noExceptionIfNotFound) {
        return null;
      }
      throw Error("proposals could not be dertermine");
    }

    if (sords.length > 1) {
      throw Error("found multiple proposals objects with filter", JSON.stringify(me.search));
    }

    return sords[0];
  },

  collectProposalDocuments: function (proposal) {
    var children;

    children = sol.common.IxUtils.execute("RF_sol_common_services_ChildrenDataCollector", {
      parentId: proposal.objId,
      endLevel: 1,
      mainParent: false,
      addSordTypeKind: true,
      onlyDocuments: true,
      formatter: "sol.common.ObjectFormatter.TemplateSord",
      sordKeys: [
        "id",
        "name",
        "guid",
        "IDateIso",
        "ownerName",
        "type",
        "desc",
        "parentId"
      ]
    });

    return children.sords;
  },

  findProposalContentDocument: function (proposalTemplateSord) {
    // TODO: move configuration to config, use children collector?
    // implement function in Proposal Entity class.
    var me = this, sords,
        args = {
          masks: ["Meeting Proposal Document"],
          search: [
            { type: "GRP", key: "MEETING_ITEM_ID", value: [proposalTemplateSord.objKeys.MEETING_ITEM_ID] },
            { type: "GRP", key: "MEETING_PROPOSAL_DOCTYPE", value: ["CONTENT"] }
          ],
          output: [ // use always 2 two output props at least to receive always an object instead of getting an string array
            { source: { type: "SORD", key: "id" }, target: { prop: "id" } },
            { source: { type: "SORD", key: "guid" }, target: { prop: "name" } }
          ]
        };

    sords = sol.common.IxUtils
      .optimizedExecute("RF_sol_common_service_SordProvider",
        args, me._optimize, "proposalContentDocument", ["output"]).sords;

    if (sords.length > 0) {
      return sords[0];
    } else {
      throw Error("No proposal content document found");
    }
  }
});

/**
* @member sol.meeting.ix.services.GetProposal
* @method RF_sol_meeting_service_GetProposal
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetProposal(iXSEContext, args) {
  var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args),
      itemService = sol.create("sol.meeting.ix.services.GetProposal", rfParams),
      result = itemService.process();
  return sol.common.JsonUtils.stringifyQuick(result);
}