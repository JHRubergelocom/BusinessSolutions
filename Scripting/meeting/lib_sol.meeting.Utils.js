
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

var logger = sol.create("sol.Logger", {
    scope: "sol.meeting.Utils"
});


/**
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ix.FunctionBase
 */
sol.define("sol.meeting.Utils", {
    singleton: true,

    masks: {
        MEETING_TYPE: "Meeting Type",
        MEETING: "Meeting"
    },

    solTypes: {
        MEETING: "MEETING"
    },

    /**
     * Return true if the passed templateSord object has the mask "Meeting"
     *  and SOL_TYPE === Meeting Type
     * @param {Object} templateSord
     * @returns {Boolean}
     */
    isMeeting: function(templateSord) {
        var me = this;
        logger.info(["checks meetings {0} , {1}", JSON.stringify(me.masks), JSON.stringify(templateSord)]);
        return templateSord && templateSord.maskName === me.masks.MEETING
            && templateSord.objKeys.SOL_TYPE === me.solTypes.MEETING
    }

});