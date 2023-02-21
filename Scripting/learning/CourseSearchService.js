

(function () {

  sol.learning.apps.Courses.app.factory(
    "CourseSearchService", [
      "$q",
      "$location",
      function ($q) {
        var courseSearchService = {
          search: null,
          getSearch: function () {
            var me = this;
            return me.search || me.createSearch();
          },
          resetSearch: function () {
            var me = this;
            me.createSearch();
          },
          createSearch: function () {
            var me = this;
            me.search = {
              searchParams: {
                searchId: null,
                hasMore: false,
                enrolled: false,
                paging: {
                  enabled: true,
                  pageSize: 18,
                  currentPosition: 0,
                  currentPage: 0
                },
                query: {},
                filter: {}
              },
              contextTermsParams: {
                groupBy: []
              },
              $contextTerms: null,
              $contextTermsPromise: null,
              getContextTerms: courseSearchService.getContextTerms,
              get: courseSearchService.execute,
              execute: courseSearchService.execute,
              more: courseSearchService.more,
              afterGet: courseSearchService.afterGet,
              hasMore: courseSearchService.hasMore,
              setFilter: courseSearchService.setFilter,
              getFilter: courseSearchService.getFilter,
              addFilter: courseSearchService.addFilter,
              removeFilter: courseSearchService.removeFilter,
              setFilterGroups: courseSearchService.setFilterGroups,
              setPaging: courseSearchService.setPaging,
              getPaging: courseSearchService.getPaging,
              setQuery: courseSearchService.setQuery,
              getQuery: courseSearchService.getQuery,
              setEnrolled: courseSearchService.setEnrolled,
              getEnrolled: courseSearchService.getEnrolled,
              $subscribe: courseSearchService.$subscribe,
              $subscribeContextTerms: courseSearchService.$subscribeContextTerms
            };
            return me.search;
          },
          getContextTerms: function () {
            var me = this,
                deferred = $q.defer(),
                params = me.contextTermsParams;

            params.filter = me.searchParams.filter;
            params.query = me.searchParams.query;

            me.RF_function = me.searchParams.enrolled
              ? "RF_sol_learning_service_GetEnrolledCourses"
              : "RF_sol_learning_service_GetCourses";

            if (me.$contextTermSubscriptions && me.$contextTermSubscriptions.length > 0) {
              me.$contextTermSubscriptions.forEach(function (subscription) {
                if (typeof subscription == "function") {
                  subscription(deferred.promise);
                }
              });
            }

            sol.common.IxUtils.execute(
              me.RF_function,
              params,
              function (result) {
                if (result) {
                  me.$contextTerms = result.groups;
                  deferred.resolve(result.groups);
                  me.$contextTermsPromise = undefined;
                } else {
                  deferred.resolve([]);
                }
              },
              function (error) {
                deferred.reject(error);
              }
            );
            me.$contextTermsPromise = deferred.promise;
            me.$contextTerms = undefined;
            return deferred.promise;
          },
          execute: function () {
            var me = this,
                deferred = $q.defer(),
                params = {
                  paging: me.searchParams.paging.enabled,
                  pageSize: me.searchParams.paging.pageSize,
                  query: me.searchParams.query,
                  filter: me.searchParams.filter,
                  enrollments: true
                };
            me.RF_function = me.searchParams.enrolled
              ? "RF_sol_learning_service_GetEnrolledCourses"
              : "RF_sol_learning_service_GetCourses";

            if (me.$subscriptions && me.$subscriptions.length > 0) {
              me.$subscriptions.forEach(function (subscription) {
                if (typeof subscription == "function") {
                  subscription(deferred.promise);
                }
              });
            }

            sol.common.IxUtils.execute(
              me.RF_function,
              params,
              function (result) {
                if (result) {
                  me.searchParams.searchId = result.searchId;
                  me.searchParams.hasMore = !!result.searchId && result.moreResults;
                  me.searchParams.paging.currentPosition = (result.sords || []).length;
                  deferred.resolve(me.afterGet(result.sords));

                  me.getContextTerms();
                } else {
                  deferred.resolve([]);
                }
              },
              function (error) {
                deferred.reject(error);
              });

            return deferred.promise;
          },
          more: function () {
            var me = this,
                deferred = $q.defer(),
                params = {};

            me.RF_function = me.searchParams.enrolled
              ? "RF_sol_learning_service_GetEnrolledCourses"
              : "RF_sol_learning_service_GetCourses";

            params = {
              searchId: me.searchParams.searchId,
              startFrom: me.searchParams.paging.currentPosition,
              pageSize: me.searchParams.paging.pageSize,
              enrollments: true
            };

            sol.common.IxUtils.execute(
              me.RF_function,
              params,
              function (result) {
                if (result) {
                  me.searchParams.searchId = result.searchId;
                  me.searchParams.hasMore = !!result.searchId && result.moreResults;
                  me.searchParams.paging.currentPosition += (result.sords || []).length;
                  deferred.resolve(me.afterGet(result.sords));
                } else {
                  deferred.resolve([]);
                }
              },
              function (error) {
                deferred.reject(error);
              });

            return deferred.promise;
          },
          afterGet: function (courses) {
          // !! will be overwritte in CourseDataService
            return courses;
          },
          hasMore: function () {
            var me = this;
            return me.searchParams.hasMore;
          },
          setPaging: function (paging) {
            var me = this;
            if (paging !== null) {
              me.searchParams.paging = paging;
            }

            return me;
          },
          getPaging: function () {
            var me = this;

            return me.searchParams.paging;
          },
          getFilter: function () {
            var me = this;

            return me.searchParams.filter;
          },
          setFilter: function (filter) {
            var me = this;

            me.searchParams.filter = filter || {};

            return me;
          },
          addFilter: function (filter) {
            var me = this;

            Object.keys(filter)
              .forEach(function (key) {
                me.searchParams.filter[key] = Array.isArray(filter[key]) && filter[key].length == 0
                  ? undefined
                  : filter[key];
              });

            return me;
          },
          setFilterGroups: function (filterGroups) {
            var me = this;

            me.contextTermsParams.groupBy = filterGroups || [];

            return me;
          },
          setQuery: function (query) {
            var me = this;

            me.searchParams.query = query || {};

            return me;
          },
          getQuery: function () {
            var me = this;

            return me.searchParams.query;
          },
          setEnrolled: function (enrolled) {
            var me = this;

            me.searchParams.enrolled = enrolled || false;

            return me;
          },
          getEnrolled: function () {
            var me = this;

            return me.searchParams.enrolled;
          },
          $subscribe: function (subscriber) {
            var me = this;

            me.$subscriptions = me.$subscriptions || [];
            me.$subscriptions.push(subscriber);
          },
          $subscribeContextTerms: function (subscriber) {
            var me = this,
                deferred;

            me.$contextTermSubscriptions = me.$contextTermSubscriptions || [];
            me.$contextTermSubscriptions.push(subscriber);

            if (me.$contextTermsPromise) {
              subscriber(me.$contextTermsPromise);
            } else if (me.$contextTerms) {
              deferred = $q.defer();
              subscriber(deferred.promise);
              deferred.resolve(me.$contextTerms);
            }
          }
        };

        return courseSearchService;
      }
    ]);
})();