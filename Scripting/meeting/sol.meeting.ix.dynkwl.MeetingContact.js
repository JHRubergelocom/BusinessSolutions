
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.common.ix.DynKwlSearchIterator.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.dynkwl.Contact.Base.js

/**
 * Dynamic keyword list that returns the sord content of contacts selected by solution object type
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
 * @requires sol.meeting.ix.dynkwl.Contact.Base
 */
sol.define("sol.meeting.ix.dynkwl.MeetingContact", {
  extend: "sol.meeting.ix.dynkwl.Contact.Base",

  inject: {
    tableTitle: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.tableTitle", template: true },
    tableHeaders: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.tableHeaders", template: true },
    tableKeyNames: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.tableKeyNames" },
    searchParams: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.searchParams" },
    rowDataFields: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.rowDataFields" },
    solType: { config: "meeting", prop: "entities.meetingBoard.dynkwls.meetingContact.solType" }
  }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.meeting.ix.dynkwl.MeetingContact
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.MeetingContact" }),
      iterator;
  try {
    log.info("DynamicKeywordList (");
    iterator = sol.create("sol.meeting.ix.dynkwl.MeetingContact", {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
