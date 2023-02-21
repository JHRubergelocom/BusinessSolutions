/**
 * Updates the parts of a document
 *
 * All parts are updated based on the tag of the content field, e.g.:
 *
 *     sol.common.DocumentPart.CLAUSE_ID=CL0001
 *
 * The part is updated with the Word document that has a `CLAUSE_ID` index field with the value `CL0001`.
 *
 * @eloas
 * @requires sol.common.Template
 * @requires sol.common.TranslateTerms
 * @requires sol.common.ObjectFormatter.TemplateSord
 * @requires sol.common.as.DocumentGenerator
 * @requires sol.common.as.ActionBase
 * @requires sol.common.as.renderer.Word
 */
sol.define("sol.common_document.as.actions.UpdateWordParts", {
  extend: "sol.common.as.ActionBase",

  requiredProperty: ["objId"],

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.ActionBase", "initialize", [config]);

  },

  getName: function () {
    return "UpdateWordParts";
  },

  process: function () {
    var me = this, result, renderer;

    renderer = sol.create("sol.common.as.renderer.Word", {
      objId: me.objId,
      templateId: me.objId,
      fillContentControls: false,
      editParts: false,
      updateParts: true,
      searchPartIdFieldName: me.searchPartIdFieldName
    });

    result = renderer.render(me.name, {});

    if (result.objId) {
      me.addGotoIdEvent(result.objId, true);
    }
  }
});
