
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.meeting.ix.services.ExecuteRFs" });

/**
 * Execute RFs.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_meeting_service_ExecuteRFs', {
 *       RFs: [{ function: "RF_1", params: ["user1"] }, { function: "RF_2", params: ["user2"] }, { function: "RF_3", params: ["user3"] }]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.meeting.ix.services.ExecuteRFs", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["RFs"],

  /**
   * @cfg {Array} RFs to create.
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
        result = [];

    me.RFs.forEach(function (RF) {
      var RFresult;

      RFresult = sol.common.IxUtils.execute(RF.function, RF.params);
      if (RFresult != undefined) {
        logger.debug["RFresult: '{0}', RF.function: '{1}', RF.params: '{2}' executed", RFresult, RF.function, RF.params];
        result.push({ RFresult: RFresult, RFfunction: RF.function, RFparam: RF.params });
      } else {
        logger.debug["RF.function: '{0}' not executed", RF.function];
        result.push({ RFfunction: RF.function, Message: "not executed" });
      }
    });
    
    return result;
  }
});

/**
 * @member sol.unittest.meeting.ix.services.ExecuteRFs
 * @method RF_sol_unittest_meeting_service_ExecuteRFs
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_meeting_service_ExecuteRFs(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_meeting_service_ExecuteRFs", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "RFs");
  params.ec = ec;
  service = sol.create("sol.unittest.meeting.ix.services.ExecuteRFs", params);
  result = service.process();
  logger.exit("RF_sol_unittest_meeting_service_ExecuteRFs", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
