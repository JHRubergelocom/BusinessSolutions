
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.learning.ix.dynKwl.generators.Base.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * dynamic keyword list for communication short description generator
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.learning.ix.dynKwl.generators.Base
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynkwl.generators.CommunicationShortDescGen", {
  extend: "sol.learning.ix.dynKwl.generators.Base",
  kwlPath: "entities.communication.functions.generatecommunicationshortdescription"
});

/**
 * Implements a dynamic keyword list for communication short description generator
 * @static
 * @member sol.learning.ix.dynkwl.generators.CommunicationShortDescGen
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var className = "sol.learning.ix.dynkwl.generators.CommunicationShortDescGen",
      log = sol.create("sol.Logger", { scope: className }), iterator;

  try {
    log.info("DynamicKeywordList  (");
    iterator = sol.create(className, {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
