
//@include lib_Class.js
//@include lib_sol.common.Template.js
//@include lib_sol.learning.ix.dynKwl.generators.Base.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * dynamic keyword list for enrollment short description generator
 *
 * @author ELO Digital Office GmbH
 * @version 1.0
 *
 * @requires sol.common.Template
 * @requires sol.learning.ix.dynKwl.generators.Base
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.dynkwl.generators.EnrollmentShortDescGen", {
  extend: "sol.learning.ix.dynKwl.generators.Base",
  kwlPath: "entities.enrollment.functions.generateenrollmentshortdescription"
});

/**
 * Implements a dynamic keyword list for enrollment short description generator
 * @static
 * @member sol.learning.ix.dynkwl.generators.EnrollmentShortDescGen
 * @returns {DynamicKeywordDataProvider}
 */
function getDataIterator() {
  var className = "sol.learning.ix.dynkwl.generators.EnrollmentShortDescGen",
      log = sol.create("sol.Logger", { scope: className }), iterator;

  try {
    log.info("DynamicKeywordList  (");
    iterator = sol.create(className, {});
    return new DynamicKeywordDataProvider(iterator);
  } finally {
    log.info(")getDataIterator");
  }
}
