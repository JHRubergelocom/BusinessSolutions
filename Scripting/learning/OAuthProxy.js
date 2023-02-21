/*
 * Here you can start writing the JavaScript code for your app.
 * You also can generate additional script files in the same folder.
 */
(function () {
    'use strict';

    api.namespace('sol.learning.OAuthProxy');

    sol.learning.OAuthProxy.app.filter('locales', function () {
       return function (input) {
           return api.helpers.Text.getText(input) || input;
       };
    });

    sol.learning.OAuthProxy.app.controller('OAuthProxyCtrl', ['$scope', '$q', function ($scope, $q) {
        $scope.loading = true;

        var url = api.helpers.Parameters.getParameter('state');

        var param = {
            code: api.helpers.Parameters.getParameter('code'),
            state: url,
            error: api.helpers.Parameters.getParameter('error') || api.helpers.Parameters.getParameter('err')
        };
        sol.common.apps.IxUtils.execute($q,"RF_sol_learning_function_OAuthorize", param).then(function (success) {
            $scope.success = true;
            $scope.loading = false;

            if (!!api.helpers.Parameters.getParameter('debug')) {
                debugger;
                
                setTimeout(function () {
                    window.location = decodeURIComponent(url);
                }, 15000);
                return;
            }

            if (!url) {
                console.error("State parameter nicht vorhanden.");
                debugger;
                
                return;
            }

            window.location = decodeURIComponent(url);
        }, function (error) {
            $scope.loading = false;
            $scope.error = true;
            console.error(error);
            console.error('Error while calling RF_sol_learning_service_OAuthorize');
            console.error(JSON.stringify(param, null, 2));

            $scope.errorText = JSON.stringify(error, null, 2);
        });

    }]);
}());
