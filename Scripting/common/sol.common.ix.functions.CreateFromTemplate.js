
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_handlebars.js
//@include lib_sol.common.Template.js
//@include lib_sol.common.ObjectFormatter.js
//@include lib_sol.common.ix.FunctionBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.function.CreateFromTemplate" });

/**
 * Renders a template string or template document
 *
 * # As IX function call:
 *   Loads a template from the repository, applys the data of a given sord and
 *   saves the result as a new document into the repository.
 *
 *     sol.common.IxUtils.execute("RF_sol_common_functions_CreateFromTemplate", {
 *       templateObjId: "111",
*        objId: "222",
 *       saveToRepoConfig: { parentId: "ARCPATH:/Test", "name": "FilledTemplate1" }
 *     });
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 * @requires  sol.Logger
 * @requires  sol.common.JsonUtils
 * @requires  sol.common.ix.RfUtils
 * @requires  sol.common.ix.FunctionBase
 *
 */
sol.define("sol.common.ix.functions.CreateFromTemplate", {
  extend: "sol.common.ix.FunctionBase",

  /**
   * @cfg {String} templateObjId (required)
   * Object ID of the template
   */

  /**
   * @cfg {String} templateString (required)
   * String that contains placeholders
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * Fills the template
   * @return {Object}
   * @return {String} return.result Result
   */
  process: function () {
    var me = this,
        json = sol.common.JsonUtils,
        template, result;
    if (!me.templateObjId && !me.templateString) {
      throw "Template object ID or template string must be set.";
    }
    template = sol.create("sol.common.Template", {});
    if (me.templateObjId) {
      template.load(me.templateObjId);
    } else {
      template.setSource(me.templateString);
    }
    if (me.objId) {
      template.applySord(me.objId);
    } else {
      template.apply(me.data);
    }
    result = template.getResult();
    if (me.saveToRepoConfig) {
      return json.stringifyAll(me.saveResult(result, me.saveToRepoConfig));
    } else {
      return json.stringifyAll({ result: result });
    }
  },

  saveResult: function (result, saveToRepoConfig) {
    var objId;
    saveToRepoConfig = saveToRepoConfig || {};
    saveToRepoConfig.ext = saveToRepoConfig.ext || ".txt";
    saveToRepoConfig.file = java.io.File.createTempFile("Template_", saveToRepoConfig.ext);
    Packages.org.apache.commons.io.FileUtils.writeStringToFile(saveToRepoConfig.file, result, "UTF-8");
    objId = sol.common.RepoUtils.saveToRepo(saveToRepoConfig);
    return { objId: objId };
  }
});


/**
 * @member sol.common.ix.functions.CreateFromTemplate
 * @method RF_sol_common_functions_CreateFromTemplate
 * @static
 * @inheritdoc sol.common.ix.FunctionBase#RF_FunctionName
 */
function RF_sol_common_functions_CreateFromTemplate(iXSEContext, args) {
  logger.enter("RF_sol_common_functions_CreateFromTemplate", args);
  var params, module, result;

  params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  module = sol.create("sol.common.ix.functions.CreateFromTemplate", params);
  result = module.process();
  logger.exit("RF_sol_common_functions_CreateFromTemplate");
  return result;
}
