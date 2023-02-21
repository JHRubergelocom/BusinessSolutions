importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.IxUtils.js

var logger = sol.create("sol.Logger", { scope: "sol.meeting.ix.services.SordProvider.Base" });
/**
 *
 * @abstract
 *
 * @author MHe, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloix
 *
 * @requires sol.common.ix.ServiceBase
 *
 * TODO: write tests
 *
 */
sol.define("sol.meeting.ix.services.SordProvider.Base", {
  extend: "sol.common.ix.ServiceBase",

  _optimized: undefined,

  provider: "RF_sol_common_service_SordProvider",

  search: function () {
    var me = this;
    return me.process();
  },

  /**
   * @private 
   */
  process: function () {
    var me = this, result, args, preProcessResult,
        optimizationName = me.getOptimizationName();

    preProcessResult = me.preProcessing();

    if (!preProcessResult) {
      me.logger.info("skip search because pre processing function returns falsy value");
      return {
        sords: [],
        message: "skip search because pre processing function returns falsy value"
      };
    }

    if (preProcessResult === true) {
      args = me.prepareArgs();
      if (optimizationName && me._optimized) {
        result = sol.common.IxUtils.optimizedExecute(
          me.provider,
          args,
          me.getOptimizationCache(),
          me.getOptimizationName(),
          ["output"]
        );
      } else {
        result = sol.common.IxUtils.execute(me.provider, args);
      }

      try {
        // throws an exception
        me.checkResult(result);
        result = me.prepareResult(result);
      } catch (ex) {
        me.logger.error("Validation constraints don't match", ex);
        throw ex;
      }
    } else {
      result = preProcessResult;
    }

    return result;
  },

  /**
   * This function can be implemented by the child class
   * and is called before the search is performed.
   *
   * @param
   * @returns {Object} false when no searching should be applied
   */
  preProcessing: function () {
    return true;
  },

  /**
   * This function can be implemented by the child class
   * and can processing the searchResult
   *
   * This function must return all sords object
   *
   * @param {Object} searchResult
   * @returns {Object} modified searchResult
   */
  postProcessing: function (searchResult) {
    return searchResult;
  },

  /**
   * This function can be implemented by child class.
   * You can build any validation here on the search result
   *
   * When you check should fail then you have to throw an exception
   * {@see sol.meeting.note.services.GetNoteById#checkResult}
   *
   */
  checkResult: function () {
    return true;
  },


  prepareArgs: function () {
    var me = this, directAcess = me.isDirectAccess();
    // when we would like to access sords via direct access we dont need
    // any information about mask and search for the sordprovider execution.
    // On the other hand, we can still pass the mask to initiate a check that
    // the element corresponds to the mask and we don't return something else.
    return {
      masks: !directAcess ? me.getMasks() : undefined,
      search: !directAcess ? me.getSearch() : undefined,
      ids: directAcess ? me.getIds() : undefined,
      output: me.getOutput(),
      options: me.getOptions()
    };
  },

  prepareResult: function (result) {
    var me = this,
      modifiedResult = me.postProcessing(result);
    if (me.getOptions().returnFirst) {
      return modifiedResult.sords[0];
    } else {
      // because of  'class com.google.gson.JsonArray cannot be cast to …talina.loader.ParallelWebappClassLoader
      // exception in clients like webapps we have to encapsulate the whole
      // object instead of the array (e.g sordprovider result: {sords: []})
      return modifiedResult;
    }
  },

  getMasks: function () {
    var me = this;
    return me.service.masks;
  },

  isDirectAccess: function () {
    var me = this;
    return !!me.getIds();
  },

  getSearch: function () {
    var me = this;
    return me.service.search;
  },

  getIds: function () {
    var me = this;
    return me.service.id || me.service.ids;
  },

  getOutput: function () {
    var me = this;
    return me.output;
  },

  getOptions: function () {
    var me = this;
    return me.service.options || {};
  },

  getOptimizationCache: function () {
    var me = this;
    return me._optimized;
  },

  getOptimizationName: function () {
    var me = this;
    return me.service.options && me.service.options.optimizationName;
  }
});

