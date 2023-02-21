
// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require, for, $$sol */
(function () {
  'use strict';

   angular.module('sol.datev.accounting.apps.Configuration')
      .directive('configHeaderDatev', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                cfName: "=?"
            },
            controller: ['$document', '$rootScope', '$scope', '$filter', '$log', '$q', '$timeout', '$parse', '$uibModal', 'baseProvider', 'pageProvider', 'appState',
                function ($document, $rootScope, $scope, $filter, $log, $q, $timeout, $parse, $uibModal, baseProvider, pageProvider, appState) {
                    $scope.collapsed = true;
                    $scope.showTabMenu = false;
                    $scope.folderData = [];
                    $scope.showFolder = "";

                    $timeout(function () {
                        if ($rootScope.pageType === 'configFolder' && $scope.folderData.length === 0) {
                            for (var key in $rootScope.loadConfigFolder.page.visibility) {
                                if ($rootScope.loadConfigFolder.page.visibility.hasOwnProperty(key)) {
                                    if (!!$rootScope.loadConfigFolder.page.visibility[key][$rootScope.loadConfigFolder.baseConfigPath]) {
                                        $scope.folderData.push(key);
                                    }
                                }
                            }
                            if (!$scope.showFolder) {
                                $scope.showFolder = $scope.folderData[0];
                                $scope.loadFolderData();
                            }
                        }
                    });

                    $scope.changeFolder = function (source) {
                        if (!$rootScope.dirty) {
                            $scope.showFolder = source;
                            $scope.loadFolderData();
                        } else {
                            $scope.configChanged(source);
                        }
                    };

                    $scope.configChanged = function (source) {
                        $uibModal.open({
                            templateUrl: sol.common.apps.configurations.relativeUrl + 'directives/modal/configChanged.html',
                            controller: 'configChangedCtrl',
                            windowClass: 'config-modal',
                            appendTo: angular.element(document.querySelector('.config-header-datev'))
                        }).result.then(
                            function () {
                                $scope.showFolder = source;
                                $scope.loadFolderData();
                            },
                            function () {
                                /* nothing to do */
                            }
                        );
                    };

                    $scope.loadFolderData = function () {
                        if (!!$scope.showFolder) {
                            elo.webapps.WebApp.showLoadingScreen();
                            pageProvider.loadConfigFolderElements($rootScope.loadConfigFolder.baseConfigPath, $rootScope.loadConfigFolder.page, $scope.showFolder);
                        }
                    };

                    $scope.getLocaleText = function (text) {
                        return baseProvider.getLocaleText(text);
                    };

                    $rootScope.config = $rootScope.config || {};
                    $rootScope.config.brandName = $scope.getLocaleText($scope.cfName) || api.helpers.Text.getText("APP.NAME");
                    $rootScope.config.isExpert = $rootScope.expertMode || false;

                    $scope.selectNav = function (item) {
                        $rootScope.config.selected = item;
                        $scope.collapsed = !$scope.collapsed;
                    };

                    $scope.expertClick = function () {
                        $rootScope.expertMode = $rootScope.config.isExpert;
                        if (!$rootScope.config.isExpert) {
                            if (!!$rootScope.config.navBar && $rootScope.config.navBar.hasOwnProperty($rootScope.config.selected) && $rootScope.config.navBar[$rootScope.config.selected].isExpert) {
                                $rootScope.config.selected = Object.keys($rootScope.config.navBar)[0];
                            }
                        }
                    };

                    $scope.hasMoreConfigs = pageProvider.hasMoreConfigs();

                    $scope.backToOverview = function () {
                        $rootScope.config = {};
                        baseProvider.setStandalone(false);
                        $rootScope.page = -1;
                    };

                    $scope.showTab = function (value) {
                        var ret = true;
                        if ($rootScope.config.hasExpertMode && value.isExpert) {
                            ret = $rootScope.config.isExpert;
                        }
                        return ret;
                    };

                    $scope.getItemShow = function (item) {
                        return item;
                    };

                    $scope.save = function () {
                        baseProvider.saveConfig();
                    };

                    $scope.update = function () {
						if(api.helpers.Configuration.has('app_config')){
								var config = api.helpers.Configuration.get('app_config');
								return new Promise(function (resolve, reject) {
								sol.common.IxUtils.execute('RF_sol_datev_accounting_service_GetWLCodes', {
										"path":  config.wlcode.path + config.wlcode.package + "/" + config.wlcode.source
									},
									function (result) {
										resolve(result);
										location.reload();
									},
									function (error) {
										reject(error);
										var title = $scope.getLocaleText("SOL.DATEV.ACCOUNTING.WLCODE.HEADER.BUTTON.UPDATE.ERROR.TITLE");
										var text = $scope.getLocaleText("SOL.DATEV.ACCOUNTING.WLCODE.HEADER.BUTTON.UPDATE.ERROR.MESSAGE");
										api.webapps.WebApp.showToast(title, text, api.webapps.WebApp.TOAST_TYPE.ERROR, 5 );
									}
								);
							});
						}else{
							var title = $scope.getLocaleText("SOL.DATEV.ACCOUNTING.WLCODE.HEADER.BUTTON.UPDATE.ERROR.TITLE");
							var text = $scope.getLocaleText("SOL.DATEV.ACCOUNTING.WLCODE.HEADER.BUTTON.UPDATE.ERROR.MESSAGE");
							api.webapps.WebApp.showToast(title, text, api.webapps.WebApp.TOAST_TYPE.ERROR, 5 );
						}
						
                    };

                    $scope.isCustom = function () {
                        return (!!$rootScope.customElements && $rootScope.customElements.length > 0);
                    };

                    $scope.$watch('$root.loaded', function () {
                        if ($rootScope.loaded) {
                            $scope.showCustom = baseProvider.getShowCustom();
                            $timeout(function () {
                                if (!!$rootScope.config.navBar && Object.keys($rootScope.config.navBar).length > 0) {
                                    $scope.showTabMenu = true;
                                    for (var key in $rootScope.config.navBar) {
                                        $rootScope.config.selected = key;
                                        break;
                                    }
                                } else if ($rootScope.config.hasExpertMode) {
                                    $scope.showTabMenu = true;
                                }
                            });
                        }
                    });

                    $scope.$watch('checkShowCustom', function () {
                        $timeout(function () {
                            $scope.showCustom = baseProvider.getShowCustom();
                        });
                    });

                    $scope.$on('solConfigToggleButtonDeleteElement', function (ev, args) {
                        baseProvider.toggleButtonDeleteElement(args);
                    });
                }
            ],
            templateUrl:'app/compositions/configHeaderDatev.html?_build=' + elo.data.server.appBuild,
            link: function (scope, elem, attr) {
                if (attr.hasOwnProperty('readOnly')) {
                    if (attr.readOnly !== undefined && attr.readOnly !== "false") {
                        scope.readOnly = true;
                    }
                }
                if (attr.hasOwnProperty('hideCustom')) {
                    if (attr.hideCustom !== undefined && attr.hideCustom !== "false") {
                        scope.hideCustom = true;
                    }
                }
            }
        };
    });
})();

