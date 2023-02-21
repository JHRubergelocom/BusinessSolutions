//@include lib_class.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ObjectUtils.js

/**
 * Provide utility functions of a meeting board
 *
 * @eloix
 */
sol.define("sol.meeting.ix.MeetingBoardUtils", {

    singleton: true,

    _optimize: {},

    /**
     *
     * @param {*} boardService
     * @param {*} boardOutput
     * @param {Object} options
     * @param {String} options.optimizationName identifier in the optimization cache
     * @returns meeting board
     * @throws if no meeting board was found
     */
    findMeetingBoard: function (boardService, boardOutput, options) {
        var me = this, result,
            opt = options || {},
            provider = boardService.name || "RF_sol_common_service_SordProvider",
            providerArgs = sol.common.ObjectUtils.clone(boardService.args);

        opt.optimizationName = options.optimizationName || "meetingBoard";

        opt.returnFirst = options.returnFirst;
        if (opt.returnFirst == undefined) {
            opt.returnFirst = true;
        }

        // use specific output here and override args params within
        // service configuration when output should be set explicitly
        if (boardOutput) {
            providerArgs.output = boardOutput;
        }

        result = sol.common.IxUtils
            .optimizedExecute(provider, providerArgs, me._optimize, opt.optimizationName, ["output"]);

        me.logger.info(["meeting board search result (size={0}, search={1})", result.sords.length, JSON.stringify(result)]);

        if (result.sords.length === 0) {
            throw Error("meeting board could not find");
        }

        if (!opt.returnFirst) {
            return result.sords;
        } else {
            return result.sords[0];
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