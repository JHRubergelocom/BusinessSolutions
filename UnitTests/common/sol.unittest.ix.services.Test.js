
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_decimal-light.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.DecimalUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.Test" });

/**
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.Test", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["text"],

  /**
   * @cfg {String} text text.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  /**
   * Call the method and returns the result
   * @return {String|Object} result of method
   */
  process: function () {
    var me = this,
        des, encrypted, decrypted;

    if (me.encrypt) {
      des = new Packages.de.elo.utils.sec.DesEncryption();
      encrypted = des.encrypt(me.text);  
      return { text: me.text, encrypted: encrypted };
    } else {
      des = new Packages.de.elo.utils.sec.DesEncryption();
      decrypted = des.decrypt(me.text);
      return { text: me.text, decrypted: decrypted };    
    }
  }
});

/**
 * @member sol.unittest.ix.services.Test
 * @method RF_sol_unittest_service_Test
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_Test(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_Test", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "text");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.Test", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_Test", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
