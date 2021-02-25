
/**
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloas
 * @requires  sol.common.as.FunctionBase
 */
sol.define("sol.unittest.as.services.Test", {
  extend: "sol.common.as.FunctionBase",

  requiredConfig: ["objId"],

  /**
   * @cfg {String} id id.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.as.FunctionBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this, 
        mapiMessage, newObjId;
    
    mapiMessage = sol.create("sol.common.as.MapiMessage", {});
    
    mapiMessage.openFromRepo({
      objId: me.objId
    });

    newObjId = mapiMessage.saveToRepo({
      format: "pdf",
      parentId: "ARCPATH:/_Test",
      name: "MapiMessage1"
    });
   
        
    return newObjId;
  }
});
