
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js

/**
 *
 * @eloall
 * @requires sol.common.Config
 */
sol.define("sol.common_document.Utils", {
  singleton: true,

  /**
   * Loads the export configuration from the JSON file: `/Administration/Business Solutions/common_document/Configuration/PdfExport.config`
   * @return {Object}
   */
  loadConfigExport: function () {
    return sol.create("sol.common.Config", { compose: "/common_document/Configuration/PdfExport.config" }).config;
  },

});
