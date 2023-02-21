(function () {

  sol.learning.apps.Courses.app.component("coursesStatistics", {
    controller: function ($scope, $filter, $errorHandler) {
      var courseGroups = ["COURSE_CATEGORY"],
          enrollmentGroups = ["COURSE_CATEGORY", "COURSE_DIFFICULTY", "COURSE_ENROLLMENT_STATUS"];

      $scope.splitMiddle = function (s) {
        if (s && s.length > 15) {
          var p = s.slice(s.length / 2).split(" ").slice(1).join(" ").length;
          return [s.slice(0, s.length - p).trim(), s.slice(s.length - p).trim()];
        }
        return s;
      };

      $scope.translateProperty = function (type, prop) {
        if (type === "COURSE_DIFFICULTY") {
          return prop.indexOf(' - ') !== -1
            ? $filter('specificCourseTypeLocales')('kwls._coursedifficulty.' + prop)
            : prop;
        } else if (type === "COURSE_ENROLLMENT_STATUS") {
          return $filter('eloLocales')('SOL.LEARNING.COURSE.STATUS.' + prop);
        }
        return prop;
      };

      $scope.toggleZoom = function (chart) {
        if (this.zoom === chart) {
          this.zoom = undefined;
        } else {
          this.zoom = chart;
        }
      };

      // TODO: move to config
      $scope.chartOptions = {
        category: {
          scale: {
            ticks: {
              beginAtZero: true,
              min: 0,
              stepSize: 1
            },
            pointLabels: {
              fontSize: 14
            }
          }
        },
        difficulty: {
          zoomOutPercentage: 55,
          plugins: {
            legend: false,
            outlabels: {
              text: "%l %p",
              color: "white",
              stretch: 45,
              font: {
                resizable: true,
                minSize: 12,
                maxSize: 14
              }
            }
          }
        },
        status: {
          layout: {
            padding: {
              left: 15,
              right: 25,
              top: 15,
              bottom: 10
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true,
                min: 0,
                stepSize: 1
              }
            }],
            yAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      };

      // reading statistics of all courses for comparison
      sol.common.IxUtils.execute("RF_sol_learning_service_GetCoursesFilters", {
        groupBy: courseGroups
      }, function (courseResults) {
        // reading statistics for enrolled courses
        sol.common.IxUtils.execute("RF_sol_learning_service_GetEnrolledCoursesFilters", {
          groupBy: enrollmentGroups,
          filters: $scope.completedCoursesFilter
        }, function (result) {
          var statistics = {},
              statisticsCompared = {},
              prop, i;
          if (!result || !result.groups) {
            return;
          }
          for (i = 0; i < enrollmentGroups.length; i += 1) {
            statistics[enrollmentGroups[i]] = {
              labels: [],
              data: []
            };
            for (prop in result.groups[enrollmentGroups[i]]) {
              if (result.groups[enrollmentGroups[i]].hasOwnProperty(prop)) {
                statistics[enrollmentGroups[i]].labels.push($scope.translateProperty(enrollmentGroups[i], prop));
                statistics[enrollmentGroups[i]].data.push(result.groups[enrollmentGroups[i]][prop]);
              }
            }
          }
          for (i = 0; i < courseGroups.length; i += 1) {
            statisticsCompared[courseGroups[i]] = {
              labels: [],
              data: []
            };
            for (prop in courseResults.groups[courseGroups[i]]) {
              if (courseResults.groups[courseGroups[i]].hasOwnProperty(prop) && !!result.groups[courseGroups[i]][prop]) {
                statisticsCompared[courseGroups[i]].labels.push($scope.splitMiddle(prop));
                statisticsCompared[courseGroups[i]].data.push(result.groups[enrollmentGroups[i]][prop] || 0);
              }
            }
          }
          $scope.$apply(function (scope) {
            scope.statistics = statistics;
            scope.statisticsCompared = statisticsCompared;
          });
        }, function (error) {
          $errorHandler.showToast();
        });

      }, function (error) {
        $errorHandler.showToast();
      });

    },
    bindings: {},
    templateUrl: "app/components/courses-statistics/courses-statistics.html"
  });

}());