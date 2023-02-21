importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.common.ix.services.Encrypt" });

/**
 * Encrypt strings
 *
 * # Example
 *
 *     var result = sol.common.IxUtils.execute("RF_sol_common_services_Encrypt", {
 *       "text": "Dies ist ein Text"
 *     });
 *
 * # Result
 *
 *     {
 *       "text": "Dies ist ein Text",
 *       "encrypted": "185-106-46-93-233-36-251-195-206-98-247-59-215-247-166-116-83-51-36-94-29-49-2-148"
 *     }
 * 
 * @author JHR Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 *
 * @requires sol.common.JsonUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.services.Encrypt", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["text"],

  /**
   * @cfg {String} text text to encrypt.
   */

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
  },

  encrypt: function () {
    var me = this,
        des, encrypted;

    des = new Packages.de.elo.utils.sec.DesEncryption();
    encrypted = des.encrypt(me.text);  
    return { text: me.text, encrypted: encrypted };
  }

});

/**
 * @member sol.common.ix.services.Encrypt
 * @method RF_sol_common_services_Encrypt
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_common_services_Encrypt(ec, args) {
  var params, service, result;

  logger.enter("RF_sol_common_services_Encrypt", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "text");
  params.ec = ec;
  service = sol.create("sol.common.ix.services.Encrypt", params);
  result = service.encrypt();
  logger.exit("RF_sol_common_services_Encrypt", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
