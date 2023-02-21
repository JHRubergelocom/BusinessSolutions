//@include lib_class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js

/**
 * Provide utility functions of proposals
 *
 * @eloix
 */
sol.define("sol.meeting.ix.ProposalUtils", {

    singleton: true,

    _optimize: {},

    /**
     *
     * @param {*} templateSordSearchParams
     * @param {Object} options
     * @param {Boolean} [options.throwError=true] throw an exception when function is throwing an exception
     * @returns proposal
     * @throws when no proposal was found
     */
    findProposalByItem: function (templateSordSearchParams, options) {
        var opt = sol.common.ObjectUtils
              .mergeObjects({ throwError: true }, options);

        try {
          return sol.common.IxUtils.execute("RF_sol_meeting_service_GetProposal", {
            source: templateSordSearchParams,
            options: {
              elementArg: "proposal" // target prop name of the searchresult
            }
          }).proposal;
        } catch (ex) {
            if (opt.throwError) {
                throw ex;
            }
            return null;
        }
    },

    /**
     *
     * @param {*} boardService
     * @param {*} boardOutput
     * @param {Object} options
     * @param {String} options.optimizationName identifier in the optimization cache
     * @returns all meeting boards
     * @throws if no meeting board was found
     */
    findAllMeetingBoards: function (boardService, boardOutput, options) {
        var me = this;
        options.returnFirst = false;
        return me.findMeetingBoard(boardService, boardOutput, options);
    }
});