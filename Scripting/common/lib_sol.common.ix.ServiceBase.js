
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.ix.RfUtils.js

/**
 * @abstract
 *
 * Operations used by elo business solutions are modularized as ix service.
 *
 * Implementations should allow using services in different ways:
 *   - Executed as a registered function call.
 *
 * # Implementing a service
 *
 * A service must extend the class ServiceBase and should implement the registered function RF_custom_services_MyFunction on js script scope level.
 *
 *     sol.define("custom.services.MyFunction", {
 *       extend: "sol.common.ix.ServiceBase",
 *
 *       initialize: function (config) {
 *         var me = this;
 *         me.$super("sol.common.ix.ServiceBase", "initialize", [config]);
 *         me.checkMandatoryProperties("objId");
 *       },
 *
 *       process: function() {
 *         // function logic goes here
 *         var me = this;
 *         me.myParam;
 *       },
 *     });
 *
 *     function RF_custom_services_MyFunction(iXSEContext, args) {
 *       var params = sol.common.ix.RfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args, "objId", "myParam"),
 *           service;
 *         service = sol.create("custom.services.MyFunction", params);
 *         service.process();
 *     }
 *
 * # Execute service as ix registered function
 *
 * Functions can be executed with the help of sol.common.ix.RfUtils.execute. In this case the Utils class handles the
 * ix Any-Object transformation.
 *
 *     var data = sol.common.IxUtils.execute('custom.services.MyFunction', {
 *       objId: "4711",
 *       myParam: "Yeah!"
 *     });
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.1
 *
 * @eloix
 * @requires sol.common.ObjectUtils
 * @requires sol.common.JsonUtils
 * @requires sol.common.SordUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.common.ix.ServiceBase", {

  /**
   * @property {sol.Logger}
   * @protected
   * The logger for the service
   */
  logger: undefined,

  /**
   * @property {Object} data (optional)
   * Has to be in a specific form (see {@link sol.common.SordUtils#updateSord}).
   */
  data: undefined,

  /** @cfg {string}
   * Object ID for the element
   */
  objId: undefined,

  initialize: function (config) {
    var me = this,
        property;
    me.logger = sol.create("sol.Logger", { scope: me.$className });
    RhinoManager.registerClass(me.$className);
    for (property in config) {
      if (config.hasOwnProperty(property)) {
        me[property] = config[property];
      }
    }
  },

  /**
   * @protected
   * Checks if all mandatory properties have been set.
   */
  checkMandatoryProperties: function () {
    var me = this,
        args = Array.prototype.slice.call(arguments);
    args.forEach(function (arg) {
      if (!me.hasOwnProperty(arg)) {
        throw "missing mandatory argument '" + arg + "'";
      }
    });
  },

  /**
   * @protected
   * Initializes the metadata of an element (defined by `objId`) from the internal `data` object.
   *
   * The `data` property has to be in a specific {@link #data form}.
   * If there is no data object no prefilling will be performed.
   *
   * @param {String} objId
   */
  prefillMetadata: function (objId) {
    var me = this,
        sord, mapitems;

    me.logger.enter("prefillMetadata", arguments);

    if (sol.common.ObjectUtils.isEmpty(me.data)) {
      me.logger.debug("Skip prefillMetadata(): no/empty 'data' property defined");
      return;
    }

    me.logger.debug("Start prefillMetadata() using data", me.data);

    sord = ixConnect.ix().checkoutSord(objId, SordC.mbAllIndex, LockC.NO);
    mapitems = sol.common.SordUtils.updateSord(sord, me.data);

    ixConnect.ix().checkinSord(sord, SordC.mbAllIndex, LockC.NO);

    if (mapitems && (mapitems.length > 0)) {
      ixConnect.ix().checkinMap(MapDomainC.DOMAIN_SORD, objId, objId, mapitems, LockC.NO);
    }

    me.logger.exit("prefillMetadata");
  },

  /**
   * @abstract
   * Implementation of services' process. This function must be implemented by the child class and should contain the logic of the function module.
   */
  process: function () {
    throw "cannot call 'process' of abstract ServiceBase";
  },

  /**
   * Checks wether an array contains the class name
   * @param {Array} classNames
   * @return {Boolean}
   */
  containsClassName: function (classNames) {
    var me = this,
        result = false;
    result = (sol.common.ObjectUtils.isArray(classNames) && (classNames.indexOf(me.$className) > -1));
    return result;
  }
});

/**
 * @member sol.common.ix.ServiceBase
 * @method RF_ServiceBaseName
 * @static
 * @abstract
 *
 * This service can be called from an application by invoking the API function "executeRegisteredFunction" or by using
 * sol.common.IxUtils.execute which internally handles the Any-Object conversion.
 *
 * All configuration params should be passed as a configuration object to the args param.
 *
 *     sol.common.IxUtils.execute('RF_ServiceBaseName', {
 *       configParam1: 'myParam'
 *     });
 *
 * @param {de.elo.ix.client.IXServerEventsContext} Execution context
 * @param {Object} args Argument array sent by the client application.
 */