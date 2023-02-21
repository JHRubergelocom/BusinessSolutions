//@include lib_class.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.TemplateSordUtils.js
//@include lib_sol.common.AclUtils.js

 var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.Meeting" });

 /**
  * Represent a Meeting Object in the elo environenment
  *
  * @deprecated
  *
  * @eloix
  * @requires sol.common.SordUtils
  * @requires sol.common.RepoUtils
  * @requires sol.common.AclUtils
  */
sol.define("sol.meeting.ix.Meeting", {

    _optimized: {},

    initialize: function (objId) {
        var me = this;
        me.sord = me.validateAndGet(objId);
        me.$super("sol.Base", "initialize", [objId]);
        me.logger.warn(["'sol.meeting.ix.Meeting' is deprecated. Dont use it anymore."]);
    },

    /**
     *
     * @param {*} objId
     * @returns
     *
     * @private
     */
    validateAndGet: function (objId) {
        var meeting = sol.common.RepoUtils.getSord(objId);
        if (!meeting || !"MEETING".equals(sol.common.SordUtils.getObjKeyValue(meeting, "SOL_TYPE"))) {
            throw Error("Reading meeting failed. Passed object with id '" + objId + "' is not of type meeting");
        }
        if (meeting.deleted === true) {
            throw Error("Reading meeting failed. Object with id '" + objId + " has been deleted");
        }
        return meeting;
    },

    getReference: function () {
        var me = this;
        return sol.common.SordUtils.getObjKeyValue(me.sord, "MEETING_REFERENCE");
    },


     /**
     * @private
     * Formats a sord aobject for the answer.
     * @param {de.elo.ix.client.Sord} sord
     * @return {Object}
    */
    getFormattedSord: function (output) {
        var me = this, outputConfig;
        if (!me.sord) {
            throw Error("sord could not format to templateSord. It is not defined");
        }

        outputConfig = (output && sol.common.ObjectUtils.isArray(output))
            ? output
            : {
                formatter: "sol.common.ObjectFormatter.TemplateSord",
                config: {
                    sordKeys: ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName", "ownerId"],
                    allMapFields: true
                }
            };

        return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", {
                ids: [me.sord.id],
                output: outputConfig
        }, me._optimized, "meeting", ["output"]).sords[0];

    },

    /**
     * @private
     * @deprecated
     */
    getAccessRights: function () {
        var me = this;
        me.logger.info(["'sol.meeting.ix.Meeting' is deprecated. Dont use it anymore"]);
        if (!me.sord) {
            throw Error("Could not read access rights. sord is not checked out");
        }
        return sol.common.AclUtils.getAccessRights(me.sord);
    }

});

sol.define("sol.meeting.entity.Meeting", {

    requiredConfig: ["data"],

    initialize: function (config) {
        var me = this;
        me.id = config.data.id;
        me.guid = config.data.guid;
        me.$super("sol.Base", "initialize", [config]);

        if (!me.isMeeting()) {
            throw Error("obj is not a meeting sord, id=" + me.id);
        }
    },

    isMeeting: function () {
        return this.get("solType") === "MEETING";
    },

    get: function (key) {
        return key ? this.data[key] : this.data;
    },

    getReference: function () {
        return this.get("referenceId");
    }

});