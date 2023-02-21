//@include lib_Class.js
//@include lib_sol.common.Injection.js


/**
 *  @author MHe, ELO Digital Office GmbH
 *  @version 1.0
 *
 */
sol.define("sol.datev.accounting.mixins.LocalizedKwlList", {
    mixin: true,

    mixins: ["sol.common.mixins.Inject"],


    getLocalizedKey: function(value, options){
        var me = this, delimiter, regExp;
        options = options = {};
        delimiter = options.delimiter || "-",
        regExp = new RegExp("([^\\s]+)\\s" + delimiter + "\\s", "m");
        return me.extract(value, regExp);
    },

    getLocalizedValue: function(value, options){
        var me = this, delimiter, regExp;
        options = options = {};
        delimiter = options.delimiter || "-",
        regExp = new RegExp(delimiter + "\\s(.*)", "m");
        return me.extract(value, regExp);
    },


    /**
     * @private
     */
    extract: function(text, regExp) {
        var m,
            matchValue = (text === undefined) ? "" : String(text);

        if (regExp && (m = regExp.exec(text)) !== null){
            // The result can be accessed through the 'm' variable.
            if (m.length > 0) {
                matchValue = m[1];
            }
        }

        return matchValue.trim();
    }
});
