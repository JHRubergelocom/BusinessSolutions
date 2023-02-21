/**
 * Edits the Word parts of a Word document
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.FunctionBase
 */
sol.define("sol.common_document.as.functions.EditWordParts", {
  extend: "sol.common.as.FunctionBase",

  requiredProperty: ["objId"],

  /**
   * @cfg {String} partIdsFromMapTableKey
   * Map field name key from which the part IDs are read, e.g. `CLAUSE_ID`
   * # Sample data
   *     CLAUSE_ID1=CL0001
   *     CLAUSE_ID2=CL0002
   *     CLAUSE_ID3=CL0003
   */

  /**
   * @cfg {String} searchPartIdFieldName
   * Part ID field name to find the requested part
   */

  /**
   * @cfg {String} partIdsTargetFieldName
   * Name of the field into which the part IDs are written pilcrow-separated
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  process: function () {
    var me = this,
        generator, sord, result;

    sord = sol.common.RepoUtils.getSord(me.objId);

    generator = sol.create("sol.common.as.DocumentGenerator", {
      name: sord.name + "",
      dataCollector: "RF_sol_common_service_ParentDataCollector",
      renderer: "sol.common.as.renderer.Word",
      collectorConfig: {
        objId: me.objId,
        allMapFields: true
      },
      rendererConfig: {
        objId: me.objId,
        templateId: me.objId,
        fillContentControls: false,
        editParts: true,
        partIdsFromMapTableKey: me.partIdsFromMapTableKey,
        searchPartIdFieldName: me.searchPartIdFieldName,
        partIdsTargetFieldName: me.partIdsTargetFieldName
      }
    });

    result = generator.process();

    return result;
  }
});
