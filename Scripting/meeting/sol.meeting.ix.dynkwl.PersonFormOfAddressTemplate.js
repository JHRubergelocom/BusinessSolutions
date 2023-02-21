
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.meeting.mixins.Configuration.js
//@include lib_sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base.js

/**
 *Dynamic keyword list that returns a list of the configured form of addresses.
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.meeting.mixins.Configuration
 * @requires sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base
 */
sol.define("sol.meeting.ix.dynkwl.PersonFormOfAddressTemplate", {
    extend: "sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base",

    inject: {
        tableTitle: { config: "meeting", prop: "entities.person.dynkwls.formOfAddress.tableTitle", template: true },
        tableHeaders: { config: "meeting", prop: "entities.person.dynkwls.formOfAddress.tableHeaders", template: true },
        tableKeyNames: { config: "meeting", prop: "entities.person.dynkwls.formOfAddress.tableKeyNames" },
        parentId: { config: "meeting", prop: "entities.person.dynkwls.formOfAddress.parentId" }
    }
});

/**
 * Implements a DynamicKeywordDataProvider for this keyword list that can be used by checkoutKeywordsDynamic.
 * @static
 * @member sol.meeting.ix.dynkwl.PersonFormOfAddressTemplate
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
    var log = sol.create("sol.Logger", { scope: "sol.meeting.ix.dynkwl.PersonFormOfAddressTemplate" }),
        iterator;
    try {
        log.info("DynamicKeywordList (");
        iterator = sol.create("sol.meeting.ix.dynkwl.PersonFormOfAddressTemplate", {});
        return new DynamicKeywordDataProvider(iterator);
    } finally {
        log.info(")getDataIterator");
    }
}
