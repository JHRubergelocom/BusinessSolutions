importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.TranslateTerms.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
* Retrieves available meeting types.
*
* @author SDi, ELO Digital Office GmbH
*
* @eloix
* @requires sol.common.Config
* @requires sol.common.JsonUtils
* @requires sol.common.IxUtils
* @requires sol.common.ix.RfUtils
* @requires sol.common.ix.ServiceBase
* @requires sol.common.UserUtils
* @requires sol.meeting.mixins.Configuration
* @requires sol.common.Injection
*/
sol.define("sol.meeting.ix.services.GetMeetingTypes", {
    extend: "sol.common.ix.ServiceBase",

    _optimize: {}, // enables optimization. Will store optimization cache ID

    mixins: ["sol.meeting.mixins.Configuration", "sol.common.mixins.Inject"],

    inject: {
        _typePath: {config: "meeting", prop: "entities.meeting.actions.createheadless.const.templateServiceArgs"},
        _getMeetingTypesConfig: {config: "meeting", prop: "entities.meeting.services.getmeetingtypes.cmdLink"}, // {}
        _getMeetingTypeInfosConfig: { config: "meeting", prop: "entities.meeting.services.getmeetingtypes.infos" } // {}
    },

    toObjId: function (obj) {
        return (obj || {}).objId;
    },

    truthy: function (x) {
        return x;
    },

    getStandardTypes: function(path) {
        return sol.common.IxUtils.execute("RF_sol_common_service_StandardTypes", {$types: {path: path}}) || [];
    },

    getTypes: function(objIds, infos) {
        var me = this, config = infos ? me._getMeetingTypeInfosConfig : me._getMeetingTypesConfig;

        config.ids = objIds;

        return sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", config, me._optimize, infos ? "meetingTypeInfos" : "meetingTypes", ["output"]).sords;
    },

    translate: function (s) {
        return sol.common.TranslateTerms.translate(s || "");
    },

    toLocalizedType: function(type) {
        var me = this, locales, desc;

        sol.common.ObjectUtils.type(type, "object") || (type = {});
        type.specificMeetingType = type.name;

        locales = {
            name: me.translate(type.locale_name),
            desc: me.translate(type.locale_desc)
        };

        (desc = locales.desc || type.desc) && (type.desc = desc.substr(0, 254));
        locales.name && (type.name = locales.name);

        return type;
    },

    startsWith: function (search) {
        return function (s) {
            return s.indexOf(search) === 0;
        };
    },

    buildObj: function (keys, src, translate) {
        var me = this, obj = {};

        if (translate) {
            keys.forEach(function (key) {
                obj[key] = me.translate(src[key]);
            });
        } else {
            keys.forEach(function (key) {
                obj[key] = src[key];
            });
        }

        return obj;
    },

    toInfo: function (type) {
        var me = this, mapKeys = type.mapKeys, keys = Object.keys(mapKeys || {}),
        isLocale = me.startsWith("LOCALE_"),
        isSetting = me.startsWith("SETTING_");

        return {
            id: type.id,
            guid: type.guid,
            name: type.name,
            desc: type.desc,
            specificMeetingType: type.specificMeetingType,
            locales: me.buildObj(keys.filter(isLocale), mapKeys, true),
            settings: me.buildObj(keys.filter(isSetting), mapKeys)
        };
    },

    process: function () {
        var me = this, objIds, types;

        objIds = me.getStandardTypes(me._typePath).map(me.toObjId).filter(me.truthy);
        types = me.getTypes(objIds, me.infos).map(me.toLocalizedType.bind(me));

        return me.infos ? types.map(me.toInfo.bind(me)) : types;
    }
});

/**
* @member sol.meeting.ix.services.GetMeetingTypes
* @method RF_sol_meeting_service_GetMeetingTypes
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetMeetingTypes(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);

    return sol.common.JsonUtils.stringifyQuick((sol.create("sol.meeting.ix.services.GetMeetingTypes", rfParams)).process());
}

/**
* @member sol.meeting.ix.services.GetMeetingTypes
* @method RF_sol_meeting_service_GetCourseTypeInfos
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_meeting_service_GetMeetingTypeInfos(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
    rfParams.infos = true;

    return sol.common.JsonUtils.stringifyQuick((sol.create("sol.meeting.ix.services.GetMeetingTypes", rfParams)).process());
}