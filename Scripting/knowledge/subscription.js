// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require */
(function () {
  "use strict";
  angular.module(sol.common.apps.name)
    .factory("subscription", subscriptionFactory);

  subscriptionFactory.$inject = ["$q", "$log"];
  function subscriptionFactory($q, $log) {
    var LOADER_CLASSNAME = sol.common.apps.name + ".Subscription";
    sol.define(LOADER_CLASSNAME, {

      subscribe: function (guid, value) {

        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_function_Subscription",
          {
            objId: guid,
            subscribe: value
          },
          function (data) {
            deferred.resolve(data);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      getSubscription: function (guid) {

        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_GetSubscription",
          {
            objId: guid
          },
          function (data) {
            deferred.resolve(data);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      getAllSubscriptions: function () {

        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_GetSubscriptions",
          {},
          function (data) {
            deferred.resolve(data);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      }
    });
    return sol.create(LOADER_CLASSNAME);
  }
})();
