
importPackage(Packages.java.io);
importPackage(Packages.java.util);
importPackage(Packages.de.elo.ix.client);
importPackage(Packages.org.apache.commons.io);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.SordProvider.js

var logger = sol.create("sol.Logger", { scope: "sol.unittest.ix.services.ExecuteLib4" });

/**
 * Unittests of Methods in className.
 *
 * Examples
 *
 *
 *     sol.common.IxUtils.execute('RF_sol_unittest_service_ExecuteLib4', {
 *       className: 'sol.unittest.ix.ActionBase',
 *       classConfig: {}
 *       method: 'getName',
 *       params: []
 *     });
 *
 * *
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 */
sol.define("sol.unittest.ix.services.ExecuteLib4", {
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
        cls, func,
        findInfo, findChildren, findByType, findDirect;

    me.classConfig.ec = me.ec;

    cls = sol.create(me.className, me.classConfig);
    func = cls[me.method];

    switch (me.className) {
      case "sol.common.SordProvider":
        findInfo = new FindInfo();
        findChildren = new FindChildren();
        findByType = new FindByType();
        findChildren.parentId = 1;
        findChildren.mainParent = false;
        findChildren.endLevel = 1;
        findByType.typeStructures = true;
        findByType.typeDocuments = true;
        findInfo.findChildren = findChildren;
        findInfo.findByType = findByType;
        switch (me.method) {
          case "ACCESS_CODE_CONVERTER":
          case "ACCESS_RIGHTS_CONVERTER":
            func = cls.CONVERTERS[me.method];
            me.params[0] = ixConnect.ix().checkoutSord(me.params[0], new SordZ(SordC.mbAll), LockC.NO);
            break;
          case "find":
          case "pageFind":
            me.params[0] = findInfo;
            me.params[3] = new SordZ();
            break;
          case "findAll":
            me.params[0] = findInfo;
            me.params[2] = new SordZ();
            return result;
          case "findIds":
            me.params[0] = findInfo;
            me.params[2] = { idSordZ: new SordZ() };
            return result;
          case "formBlobsExtractor":
            return result;
          case "getAvailableTerms":
            me.params[3] = findInfo;
            break;
          case "getContextTerms":
            findInfo = new FindInfo();
            findDirect = new FindDirect();
            findDirect.query = "(*) ( ( (sord_maskName:\"mask1\") OR (sord_maskName:\"mask2\") ) (LINE_SOL_TYPE: \"RECRUITING_CANDIDATE\") ( (LINE_DEPARTMENTS: \"Sales\") OR (LINE_DEPARTMENTS: \"Purchasing\") ) )";
            findDirect.searchInMemo = true;
            findDirect.searchInFulltext = true;
            findDirect.searchInIndex = true;
            findDirect.searchInSordName = true;
            findInfo.findDirect = findDirect;
            me.params[0] = findInfo;
            return result;
          case "getSearchCriteriaQuery":
            findInfo = new FindInfo();
            findDirect = new FindDirect();
            findDirect.query = "query1";
            findDirect.searchInMemo = true;
            findDirect.searchInFulltext = true;
            findDirect.searchInIndex = true;
            findDirect.searchInSordName = true;
            findInfo.findDirect = findDirect;
            me.params[2] = findInfo;
            break;
          case "getSord":
            me.params[1] = new SordZ();
          case "performSearch":
          case "searchViaIndex":
          case "searchFor":
            me.params[2] = { idSordZ: new SordZ() };
            return result;
          case "process":
            return result;
          default:
        }
        break;
      default:
    }


    if (sol.common.ObjectUtils.isFunction(func)) {
      result = func.apply(cls, me.params);
    } else {
      throw "IllegalMethodException: Method '" + me.method + "' not supported in Class '" + me.className + "'";
    }

    switch (me.className) {
      case "sol.common.SordProvider":
        switch (me.method) {
          case "buildRegEx":
          case "stringToRegExp":
            result = String(result);
            break;
          default:
        }
        break;
      default:
    }

    return result;
  }
});

/**
 * @member sol.unittest.ix.services.ExecuteLib4
 * @method RF_sol_unittest_service_ExecuteLib4
 * @static
 * @inheritdoc sol.unittest.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_unittest_service_ExecuteLib4(ec, args) {
  var params, service, result;
  logger.enter("RF_sol_unittest_service_ExecuteLib4", args);

  params = sol.common.ix.RfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "className", "classConfig", "method", "params");
  params.ec = ec;
  service = sol.create("sol.unittest.ix.services.ExecuteLib4", params);
  result = service.process();
  logger.exit("RF_sol_unittest_service_ExecuteLib4", result);
  return sol.common.JsonUtils.stringifyAll(result);
}

