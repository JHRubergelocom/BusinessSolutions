importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.UserUtils.js


/**
* Retrieves user ids by usernames
*
* @author MHe, ELO Digital Office GmbH
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
sol.define("sol.common.GetUserIds", {
    extend: "sol.common.ix.ServiceBase",


    process: function () {
        var me = this, objectUtils = sol.common.ObjectUtils,
            userNames = me.userNames, userInfos;

        if (!objectUtils.isArray(userNames)){
            userNames = [userNames]
        }

        userInfos = sol.common.UserUtils.getUserInfos(userNames);
        return me.convert(userInfos);
    },

    convert: function(userInfos) {
        var me = this, objectUtils = sol.common.ObjectUtils;
        return objectUtils.map(userInfos, function(userInfo){
            return {id: userInfo.id, guid: userInfo.guid, name: userInfo.name}
        });
    }
});



/**
* @member sol.meeting.ix.services.GetUserIds
* @method RF_sol_meeting_service_GetCourseTypeInfos
* @static
* @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
*/
function RF_sol_function_GetUserInfos(iXSEContext, args) {
    var rfParams = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
    return sol.common.JsonUtils.stringifyQuick((sol.create("sol.common.GetUserIds", rfParams)).process());
}