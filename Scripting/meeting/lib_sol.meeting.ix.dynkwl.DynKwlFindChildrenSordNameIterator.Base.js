
importPackage(Packages.de.elo.ix.jscript);
importPackage(Packages.de.elo.ix.scripting);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.Injection.js
//@include lib_sol.common.ix.DynKwlFindChildrenIterator.js
//@include lib_sol.meeting.mixins.Configuration.js

/**
 * Basic child search iterator extension of "sol.common.ix.DynKwlFindChildrenIterator" to return only the sord names of the search results.
 *
 * @author EOe, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @requires sol.common.Config
 * @requires sol.common.Injection
 * @requires sol.common.ix.DynKwlFindChildrenIterator
 * @requires sol.meeting.mixins.Configuration
 */
sol.define("sol.meeting.ix.dynkwl.DynKwlFindChildrenSordNameIterator.Base", {
    extend: "sol.common.ix.DynKwlFindChildrenIterator",

    mixins: [
        "sol.meeting.mixins.Configuration",
        "sol.common.mixins.Inject"
    ],

    /**
     * Basic implementation for search results.
     * This returns the content of the sord index fields.
     * @param {de.elo.ix.client.Sord} sord
     * @return {Object}
     */
    getRowData: function (sord) {
        return [sord.name];
    }
});
