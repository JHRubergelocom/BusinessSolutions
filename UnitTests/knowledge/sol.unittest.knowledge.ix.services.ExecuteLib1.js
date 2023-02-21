
importPackage(Packages.java.io);
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.ix.ServiceBase.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.knowledge.ix.services.ExecuteLib1" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_knowledge_service_ExecuteLib1', {
 *       className: 'sol.knowledge.Utils',
 *       classConfig: {}
 *       method: 'getPathOfUsersPersonnelFile',
 *       params: [["Administrator", {}]]
 *     });
 *
 *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.knowledge.ix.services.ExecuteLib1", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["className", "classConfig", "method", "params"],

  /**
   * @cfg {String} className Class name.
   */

  /**
   * @cfg {Object} classConfig configuration for class initialization.
   */

  /**
   * @cfg {String} method Method name.
   */

  /**
   * @cfg {Object[]} params Method parameters array.
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
        result = {},
        cls, func;

    switch (me.className) {
      case "sol.knowledge.ix.dynkwl.generators.PostReference":
      case "sol.knowledge.ix.dynkwl.generators.ReplyReference":
      case "sol.knowledge.ix.functions.Reputation":
      case "sol.knowledge.ix.functions.SetSolvedFlag":
      case "sol.knowledge.ix.functions.generators.GenerateBoardReference":
      case "sol.knowledge.ix.functions.generators.GeneratePostReference":
      case "sol.knowledge.ix.functions.generators.GenerateReplyReference":
      case "sol.knowledge.ix.functions.generators.GenerateSpaceReference":
      case "sol.knowledge.ix.services.ChangePostType":
      case "sol.knowledge.ix.services.Comment":
      case "sol.knowledge.ix.services.CreatePost":
      case "sol.knowledge.ix.services.CreateReply":
      case "sol.knowledge.ix.services.DeletePost":
      case "sol.knowledge.ix.services.DeleteReply":
      case "sol.knowledge.ix.services.EditPost":
      case "sol.knowledge.ix.services.EditReply":
      case "sol.knowledge.ix.services.GetAdditionalInfo":
      case "sol.knowledge.ix.services.GetConfig":
      case "sol.knowledge.ix.services.GetSubscription":
      case "sol.knowledge.ix.services.GetSubscriptions":
      case "sol.knowledge.ix.services.HandleTempUploadFile":
      case "sol.knowledge.ix.services.Label":
      case "sol.knowledge.ix.services.LinkPosts":
      case "sol.knowledge.ix.services.MovePost":
      case "sol.knowledge.ix.services.Post":
      case "sol.knowledge.ix.services.Rating":
      case "sol.knowledge.ix.services.Reply":
      case "sol.knowledge.ix.services.Search":
      case "sol.knowledge.ix.services.SolType":
      case "sol.knowledge.ix.services.Space":
      case "sol.knowledge.ix.services.UserInfo":
        return result;
      default:
    }

    me.classConfig.ec = me.ec;

    switch (me.className) {
      case "sol.knowledge.ix.services.GetAdditionalInfo":
        me.classConfig.postSord = sol.common.RepoUtils.getSord(me.classConfig.postObjId);
        break;
      case "sol.knowledge.ix.services.Post":
        switch (me.method) {
          case "formatSord":
          case "getSolution":
          case "hasSolution":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.knowledge.ix.services.Reply":
        switch (me.method) {
          case "checkSameSolvedStatus":
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            me.params[1] = ixConnect.ix().checkoutSord(me.params[1], new SordZ(SordC.mbAll), LockC.NO);
            break;
          default:
        }
        break;
      case "sol.knowledge.ix.services.Search":
        me.classConfig.sordZ = new SordZ(ObjDataC.mbMask);
        break;
      default:
    }

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    return result;
  }
});

/**
 * @member sol.unittest.knowledge.ix.services.ExecuteLib1
 * @method RF_sol_unittest_knowledge_service_ExecuteLib1
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_knowledge_service_ExecuteLib1(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_knowledge_service_ExecuteLib1", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.knowledge.ix.services.ExecuteLib1", params);
  result = service.process();
  logger.exit("RF_sol_unittest_knowledge_service_ExecuteLib1", result);
  return sol.common.JsonUtils.stringifyAll(result);
}
