//@include lib_class.js
//@include lib_sol.common.Cache.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.SordProvider.js

/**
 * @requires sol.common.SordProvider
 */
sol.define("sol.meeting.ix.MeetingItemRepository", {

    singleton: true,

    _optimized: {},

    /**
     * @private
     * @property {sol.common.Cache} cache
     */

    referenceCache: sol.create("sol.common.Cache"),

    findMeetingItem: function (id, output, optimizationName) {
        var me = this;
        return sol.common.RepoUtils.isRepoId(id)
            ? me.findMeetingItemById(id, output, optimizationName)
            : me.findMeetingItemByRef(id, output, optimizationName);
    },

    findMeetingItemById: function (id, output, optimizationName) {
        var me = this, result, item;

        result = sol.common.SordProviderUtils
            .create({ optimizationCache: me._optimized, optimizationName: optimizationName })
            .useId(id)
            .addOutputs(output)
            .run({ copy: false });

        if (result.sords.length == 0) {
            throw Error("item object was not found id=" + id);
        }

        item = sol.create("sol.meeting.entity.MeetingItem", { data: result.sords[0] });

        if (item.guid && me.referenceCache.containsKey(item.getReference())) {
            me.logger.info(["Meeting Item Reference Cache: put key={0} into reference cache", item.getReference()]);
            me.referenceCache.put(item.getReference(), item.guid);
        }

        return item;
    },

    findMeetingItemByRef: function (ref, output, optimizationName) {
        var me = this, guid, item, cacheInvalid = false, result;

        if (me.referenceCache.containsKey(ref)) {
            guid = me.referenceCache.get(ref);
            me.logger.info(["Meeting Item Reference Cache: read key={0} from cache, value={1}", ref, guid]);
            item = me.findMeetingItemById(guid, output, optimizationName);

            if (!item) {
                cacheInvalid = true;
                me.logger.warn(["Reference cache seems to be invalid. Try to find sord by ref {0}", ref]);
            }
        }

        if (!item) {

            result = sol.common.SordProviderUtils
                .create({ optimizationCache: me._optimized, optimizationName: optimizationName })
                .addMasks("Meeting Item")
                .addSearchCriteria("SOL_TYPE", ["MEETING_ITEM", "MEETING_ITEM_TOPIC"])
                .addSearchCriteria("MEETING_ITEM_ID", ref)
                .addOutputs(output)
                .run({ copy: false });

            if (result.sords.length == 0) {
                throw Error("item object was not found ref=" + ref);
            }

            item = sol.create("sol.meeting.entity.MeetingItem", { data: result.sords[0] });

            // cache is invalid when the cache is invalid (with a reference/guid pair we couldn't find the regular object)
            if (item.guid && (cacheInvalid === true || !me.referenceCache.containsKey(item.getReference()))) {
                me.logger.info(["put key={0} into cache", item.getReference()]);
                me.referenceCache.put(item.getReference(), item.guid);
            }
        }

        return item;
    },

    findAttachmentsByItem: function (id) {
        var children = sol.common.IxUtils.execute("RF_sol_common_services_ChildrenDataCollector", {
            parentId: id,
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

        return children.sords || [];
    },


    /**
     *
     * @param {String} meetingRef
     * @param {Array<Object>} output
     * @param {String} outputOptimizationName
     * @returns {Array<Object>} items object
     */
    findItemsByMeeting: function (meetingRef, output, optimizationName) {
        var me = this, config, opts = { copy: false };

        config = {
            masks: ["Meeting Item"],
            search: [
                {
                    key: "SOL_TYPE",
                    value: [
                        "MEETING_ITEM",
                        "MEETING_ITEM_TOPIC",
                        "STRUCTURAL_ITEM",
                        "MEETING_ITEM_CONTAINER"
                    ]
                },
                {
                    key: "MEETING_REFERENCE",
                    value: meetingRef
                }
            ],
            // When no output is defined general templateSord will be checked out
            output: output || {
                formatter: "sol.common.ObjectFormatter.TemplateSord",
                config: {}
            }
        };

        return config.output.hasOwnProperty("formatter")
            ? sol.common.SordProviderUtils.run(config, opts)
            : sol.common.SordProviderUtils.runOptimized(config, me._optimized, optimizationName, opts);

    }
});

sol.define("sol.meeting.entity.MeetingItem", {
    requiredConfig: ["data"],

    initialize: function (config) {
        var me = this;
        me.id = config.data.id;
        me.guid = config.data.guid;
        me.$super("sol.Base", "initialize", [config]);

        if (!me.isMeetingItem()) {
            throw Error("obj is not a meeting item sord, id=" + me.id);
        }
    },

    isMeetingItem: function () {
        // all meeting item types starts with MEETING_ITEM*
        return this.get("solType").indexOf("MEETING_ITEM") > -1;
    },

    get: function (key) {
        return key ? this.data[key] : this.data;
    },

    getReference: function () {
        return this.get("itemId");
    }
});