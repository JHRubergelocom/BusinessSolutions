
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 * Base library class of MeetingContact dynkwls.
 * Do not use this directly. Default implementations are sol.meeting.ix.dynkwl.MeetingContact, sol.meeting.ix.dynkwl.MeetingContactTypeMember, sol.meeting.ix.dynkwl.MeetingContactWorkflowMap
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.SordUtils
 * @requires sol.common.UserUtils.js
 * @requires sol.common.ix.DynKwlSearchIterator
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.dynkwl.Contact.Base", {
  extend: "sol.common.ix.DynKwlSearchIterator",

  mixins: [
    "sol.meeting.mixins.Configuration",
    "sol.common.mixins.Inject"
  ],

  /**
   * Implements a find by type search that is filtered by name.
   * @param {Array} filterList
   * @return {de.elo.ix.client.FindInfo}
   */
  getFindInfo: function (filterList) {
    this.log.enter("getFindInfo");
    var me = this,
        findInfo, findByIndex, okeys, okey, i, param, filter;

    findInfo = new FindInfo();
    findByIndex = new FindByIndex();
    okeys = [];

    if (me.solType) {
      okey = new ObjKey();
      okey.name = "SOL_TYPE";
      okey.data = [me.solType];
      okeys.push(okey);
    }

    if (filterList && filterList.length > 0) {
      for (i = 0; i < filterList.length; i++) {
        param = me.searchParams[i];
        filter = filterList[i];
        if (param.name && filter && (filter != "")) {
          okey = new ObjKey();
          okey.name = param.searchName || param.name;
          okey.data = [filter];
          okeys.push(okey);
        }
      }
    }

    findByIndex.objKeys = okeys;
    findInfo.findByIndex = findByIndex;

    this.log.exit("getFindInfo");
    return findInfo;
  },

  /**
   * Basic implementation for search results.
   * This returns the content of the sord index fields.
   * @param {de.elo.ix.client.Sord} sord
   * @return {String}
   */
  getRowData: function (sord) {
    var me = this,
        data = [],
        i,
        userInfo,
        fieldName,
        sordKeys = ["id", "guid", "maskName", "name", "desc", "IDateIso", "XDateIso", "ownerName"],
        userIdentifier,
        userInfoField,
        value;

    for (i = 0; i < me.rowDataFields.length; i++) {
      value = "";
      fieldName = me.rowDataFields[i];
      if (fieldName.indexOf("USERINFO.") == 0) {
        try {
          if (!userInfo) {
            userIdentifier = sol.common.SordUtils.getObjKeyValue(sord, "CONTACT_USERNAME");
            userInfo = userIdentifier
              ? sol.common.UserUtils.getUserInfo(userIdentifier)
              : null;
          }
          if (userInfo) {
            userInfoField = fieldName.split(".")[1];
            value = sordKeys.indexOf(userInfoField) != -1
              ? userInfo[userInfoField]
              : sol.common.SordUtils.getObjKeyValue(userInfo, userInfoField);
          }
        } catch (error) { }
      } else {
        value = sol.common.SordUtils.getObjKeyValue(sord, fieldName);
      }
      data.push(value);
    }

    return data;
  },

  getUserInfo: function (sord, userIdentifierKey) {
    var userIdentifier = sol.common.SordUtils.getObjKeyValue(sord, userIdentifierKey);
    return userIdentifier
      ? sol.common.UserUtils.getUserInfo(userIdentifier)
      : null;
  }
});