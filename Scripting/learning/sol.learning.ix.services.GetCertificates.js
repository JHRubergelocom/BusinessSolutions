
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.JsonUtils.js
//@include lib_sol.common.IxUtils.js
//@include lib_sol.common.ix.RfUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.common.UserUtils.js
//@include lib_sol.learning.mixins.Configuration.js
//@include lib_sol.common.Injection.js

/**
 * Retrieves available certificates for a given user.
 *
 * ### Starting a paged search
 *
 * If `{ paging: true }` is passed, the search will use pagination. A `searchId` property e.g. "(12k-1212f-1f12-12f)" and a `sords: [{}]` property will be returned.
 *
 * ### Continuing a paged search
 *
 * If `{ searchId: "(12k-1212f-1f12-12f)" }` is passed, the paged search will be continued. A `searchId` property and a `sords` property will be returned.
 * If a paged search does not return a `searchId` or a `moreResults` property, there are no more results.
 *
 * #### Getting results from a specific start index
 *
 * Define `{ searchId: "(12k-1212f-1f12-12f)", startFrom: 200, pageSize: 30 }`
 *
 * ### Manually ending a paged search
 *
 * If `{ searchId: "(12k-1212f-1f12-12f)", endPaging: true }` is passed, the paged search will be closed.
 *
 * ### Defining a page size
 *
 * For each step, you can pass e.g. `{ searchId: "(12k-1212f-1f12-12f)", pageSize: 10 }` to return 10 sords per search.
 *
 * ### Additional search criteria
 *
 * You can pass additional search criteria using
 *
 *     {
 *       filter: {
 *         "COURSE_TYPE": "E-Learn*",
 *         "COURSE_DIFFICULTY": ["Novice", "Intermediate"]
 *       }
 *     }
 *
 * ### Using DIRECT search mode
 *
 * Instead of findByIndex, you can switch the search mode to findDirect by passing `{ findDirect: true }`
 *
 *     { findDirect: true }
 *
 * If you also need to add your own query string, instead of passing `findDirect: true` simply pass
 *
 *     { query: "my term" }
 *
 * which will also use findDirect.
 *
 * ### Grouping (contextTerms)
 *
 * To group by a field (using a contextTerms search), define `{ groupBy: "MY_FIELD" }`.
 *
 *     { groupBy: "MY_FIELD" }
 *
 * The result would be
 *
 *     {
 *       groups: {
 *         MY_FIELD: { a: 1, b: 5, c: 8 }
 *       }
 *     }
 *
 * Instead of a single string, you can also define an array of strings to retrieve multiple contextTerms at once. `{ groupBy: ["MY_FIELD1", "MY_FIELD2"] }`
 *
 * The result would be
 *
 *     {
 *       groups: {
 *         MY_FIELD1: { a: 1, b: 5, c: 8 },
 *         MY_FIELD2: { yy: 3, vv: 77 }
 *       }
 *     }
 *
 * @author ESt, ELO Digital Office GmbH
 *
 * @eloix
 * @requires sol.common.Config
 * @requires sol.common.JsonUtils
 * @requires sol.common.IxUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 * @requires sol.common.UserUtils
 * @requires sol.learning.mixins.Configuration
 * @requires sol.common.Injection
 */
sol.define("sol.learning.ix.services.GetCertificates", {
  extend: "sol.common.ix.ServiceBase",

  _optimize: {}, // enables optimization. Will store optimization cache ID

  mixins: ["sol.learning.mixins.Configuration", "sol.common.mixins.Inject"],

  inject: {
    _config: { config: "learning", prop: "entities.course.services.getcertificates" } // {}
  },

  addSearchFilter: function (criteria, filter) {
    Object.keys(filter).forEach(function (field) {
      criteria.push({ key: field, value: filter[field] });
    });
  },

  parsePagingOptions: function () {
    var me = this;
    if (me.searchId || me.paging) {
      me.paging
        && (me._config.options.paging = me.paging);
      me.searchId
        && (me._config.options.searchId = me.searchId);
      me._config.options.pageSize = me.pageSize || me._config.options.pageSize;
      (me.startFrom !== undefined)
        && (me._config.options.startPagingFrom = me.startFrom);
      me.endPaging
        && (me._config.options.endPaging = me.endPaging);
    }
  },

  parseOptions: function () {
    var me = this;

    me.parsePagingOptions();

    me.findDirect
    && (me._config.options.findDirect = me.findDirect);

    me.query
      && (me._config.options.query = me.query);

    me.filter = me.filter || {};
    me.filter["COURSE_ENROLLMENT_USER"] = ixConnect.loginResult.user.name;
    me.addSearchFilter(me._config.search, me.filter);
  },

  process: function () {
    var me = this, result;

    me.parseOptions();

    me.logger.debug("Finding certificates.", me._config.search);
    result = sol.common.IxUtils.optimizedExecute("RF_sol_common_service_SordProvider", me._config, me._optimize, "certificates", ["output"]);

    return result.searchId
      ? { searchId: result.searchId, moreResults: result.moreResults, sords: result.sords }
      : (me.groupBy ? { groups: result.groups } : { sords: result.sords });
  }
});

/**
 * @member sol.learning.ix.services.GetCertificates
 * @method RF_sol_learning_service_GetCertificates
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_learning_service_GetCertificates(iXSEContext, args) {
  var rfUtils, rfParams, serviceProc, result;

  rfUtils = sol.common.ix.RfUtils;
  rfParams = rfUtils.parseAndCheckParams(iXSEContext, arguments.callee.name, args);
  delete rfParams._optimize;

  serviceProc = sol.create("sol.learning.ix.services.GetCertificates", rfParams);
  result = JSON.stringify(serviceProc.process());
  return result;
}
