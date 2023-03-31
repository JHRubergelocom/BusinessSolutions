// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require */
/*
 * Here you can start writing the JavaScript code for your app.
 * You also can generate additional script files in the same folder.
 */
(function () {
  'use strict';

  var appNamespace = sol.common.apps.namespace;

  appNamespace.onLoad = function () {
    // if (!elo.IX.getLoginResult().clientInfo.timeZone) {
    //   elo.IX.getLoginResult().clientInfo.timeZone = elo.data.server.clientTimezone;
    // }
  };

  appNamespace.app.filter('removeHTMLTags', function () {
    return function (text) {
      if (text) {
        text = String(text).replace(/<[^>]+>/gm, '');
        if (text.length > 250) {
          text = text.substr(0, 250) + " ...";
        }

      } else {
        text = '';
      }
      return text;
    };
  });

  appNamespace.app.config(['$compileProvider', '$routeProvider', '$locationProvider', function ($compileProvider, $routeProvider, $locationProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|elodms):/);
    $compileProvider.debugInfoEnabled(elo.data.server.isDebug);
    $routeProvider
      .when('/', { templateUrl: 'app/directives/KnowledgeBoard.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/post/:guid', { templateUrl: 'app/directives/post/post.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/post/:guid/reference/:reference', { templateUrl: 'app/directives/post/post.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/post/:guid/reply/:replyguid', { templateUrl: 'app/directives/post/post.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/editpost/:guid', { templateUrl: 'app/directives/post/editpost.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/editpost/:guid/:space', { templateUrl: 'app/directives/post/editpost.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/addpost/:type', { templateUrl: 'app/directives/post/editpost.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/addpost/:type/:space', { templateUrl: 'app/directives/post/editpost.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/error', { templateUrl: 'app/directives/shared/error.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .when('/error/:errorid', { templateUrl: 'app/directives/shared/error.html?_build=' + elo.data.server.appBuild, reloadOnSearch: false })
      .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(false).hashPrefix('');
  }]);

  appNamespace.app.controller('KnowledgeBoardCtrl', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$q', '$log', '$timeout', '$window',
    'baseProvider', 'utilsProvider', 'searchProvider', 'filterProvider', 'errorProvider', 'subscription', 'cacheProvider',
    'urlProvider', 'clientProvider', 'postProvider', '$sanitize', '$sce',
    function ($scope, $rootScope, $route, $routeParams, $location, $q, $log, $timeout, $window, baseProvider, utilsProvider, searchProvider, filterProvider,
      errorProvider, subscription, cacheProvider, urlProvider, clientProvider, postProvider, $sanitize, $sce) {
      var me = this,
        solKnowledgeSelectedSpaceWatcher,
        solKnowledgeTotalItemsWatcher,
        solKnowledgeInitReloadWatcher,
        solKnowledgeHomeSelectWatcher,
        solKnowledgeReloadConfigWatcher,
        solKnowledgeChangeBoardOrSpaceWatcher,
        solKnowledgeUploadWatcher,
        solKnowledgeDeleteWatcher,
        solKnowledgeUploadClearGUIDsWatcher,
        routeChangeSuccessWatcher;

      $scope.boardType = baseProvider.getBoardType();
      $scope.initializeDone = false;
      $scope.isDebug = elo.data.server.isDebug;
      $scope.route = $route;
      $scope.location = $location;
      $scope.routeParams = $routeParams;
      $scope.searchForUser = false;
      $scope.loading = true;
      $scope.filterSearch = true;
      $scope.guid = api.helpers.Parameters.getParameter("guid") || "";
      $scope.selectedSpace = '';
      $scope.selectedType = '';
      $scope.count = 0;
      $scope.ownerId = -1;
      $scope.ownerName = '';
      $scope.owner = {};
      $scope.searchText = '';
      $scope.loadingGUID = true;
      $scope.spaceSubscription = false;
      $scope.allUploadGUIDs = [];
      $scope.allDeletedGUIDs = [];
      $scope.settings = {
        collapseDesc: false
      }

      if ($scope.location.$$url.indexOf("&ref=true") > -1) {
        $location.url($scope.location.$$url.substring(0, $scope.location.$$url.indexOf("&ref=true")));
      }

      me.$onInit = function () {
        filterProvider.clearSessionFilter();
        $scope.checkInitializeState();
        $scope.setBoardClasses();
        $scope.initializeKnowledgeBoard();
      }

      $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope.boardData = baseProvider.getBoardData();
      });

      $scope.$watch('selectedSpace', function (space) {
        $scope.selectedSpaceData = baseProvider.getSpaceData(space);
        $scope.spaceImageGuid = $scope.selectedSpaceData.previewImage;
        $scope.setBoardClasses();
      });

      $scope.deliverDesc = function (desc) {
        var sanitizedDesc = clientProvider.isClient()
          ? baseProvider.checkHtmlELOEmbedded($sanitize(desc), clientProvider.getGuidLevel())
          : $sanitize(baseProvider.checkHtmlStandalone(desc));

        return $sce.trustAsHtml(sanitizedDesc);
      };

      $rootScope.$watch('initCount', function (newValue, oldValue) {
        if (newValue === 3) {
          $scope.checkInitializeState();
        }
      });

      $scope.$on('solKnowledgeSpace', function (ev, args) {
        var newFilter = true;
        $scope.loadPostList(newFilter);
        $scope.loadLinkedPosts();
        $scope.setBoardClasses();
      });

      $scope.$on('solKnowledgeReload', function (ev) {
        var newFilter;
        newFilter = true;
        $scope.loadPostList(newFilter);
        $scope.loadLinkedPosts();
        $scope.setBoardClasses();
      });

      $rootScope.$on('solKnowledgeReloadRoute', function (ev) {
        var newFilter = true;
        if ($scope.initializeDone) {
          $scope.loadRouteParams();
          $scope.loadPostList(newFilter);
          $scope.loadLinkedPosts();
          $scope.setBoardClasses();
        } else {
          $scope.initializeKnowledgeBoard();
        }
      });

      $scope.$on('solKnowledgeType', function (ev, args) {
        var newFilter;
        newFilter = true;
        $scope.loadPostList(newFilter);
        $scope.loadLinkedPosts();
        $scope.setBoardClasses();
      });

      $scope.$on('solKnowledgePage', function (ev, args) {
        var newFilter;
        newFilter = false;
        filterProvider.setPage(args.page);
        $scope.currentPage = filterProvider.getPage();
        $scope.boardName = baseProvider.getBoardName();
        $scope.loadPostList(newFilter);
        $scope.setBoardClasses();
      });

      $scope.$on('solKnowledgeRefresh', function (ev) {
        $scope.loadPostList(false);
        $scope.loadLinkedPosts();
        $scope.setBoardClasses();
      });

      $rootScope.$on('solSetSpaceSubscription', function (ev, args) {
        $scope.spaceSubscription = args.subscription;
      });

      $scope.initializeKnowledgeBoard = function () {
        if ($location.$$path.indexOf('error') === -1 && !($scope.location.$$path.indexOf('/post/') === 0 || $scope.location.$$path.indexOf('/editpost/') === 0 ||
          $scope.location.$$path.indexOf('/addpost/') === 0 || $scope.location.$$path.indexOf('/error/') === 0)) {
          $scope
            .loadRouteParams()
            .then(function () {
              // $scope.loading = true;
              $scope.loadingGUID = true;

              return clientProvider
                // get GuidData
                .getGuidData()
                // set loadingGuid to false
                .then(function (guidData) {
                  $scope.loadingGUID = false;
                  return guidData;
                })
                // check GuidData
                .then(function (guidData) {
                  return clientProvider
                    .checkGUIDData(guidData)
                    // return guidData (not last response)
                    .then(function () {
                      return guidData;
                    });
                })
                // set Url
                .then(function (guidData) {
                  if ($scope.location.$$path.indexOf('/post/') === 0 || $scope.location.$$path.indexOf('/editpost/') === 0 ||
                    $scope.location.$$path.indexOf('/addpost/') === 0 || $scope.location.$$path.indexOf('/error/') === 0) {
                    return;
                  }
                  return urlProvider.setUrl(guidData);
                });
            })
            .catch(function (error) {
              if (error && error.msg) {
                if (error.msg.indexOf('missing guid') === -1
                  && (
                    // wrong format
                    error.msg.indexOf('ELOIX:2000') != -1
                    // not existing
                    || error.msg.indexOf('ELOIX:5023') != -1)
                  && $location.$$path.indexOf('error') === -1) {
                  window.location.href = urlProvider.getBaseUrl()
                    + urlProvider.getEloEmbeddedDependingUrlPart()
                    + '#/error/1000';
                }
              }
              $scope.loadingGUID = false;
            })
            .finally(function () {
              // finally and always set loading false
              $timeout(
                function () {
                  $scope.loadingGUID = false;
                  $scope.checkInitializeState();
                }, 0);
            });
        }
      }

      postProvider.subscribeCurrentPost(function (post) {
        $scope.currentPost = post;
        $scope.setBoardClasses();
      });

      $scope.setBoardClasses = function () {
        var replaceWord,
          classes,
          typeClass;

        $scope.boardData = baseProvider.getBoardData();
        $scope.selectedSpace = filterProvider.getSpace();
        if ($scope.boardType || !($scope.maindiv || {}).classes) {
          replaceWord = $scope.boardType == 'INFORMATION' ? 'information' : 'community';
          classes = [replaceWord];
          typeClass = "";
          if (baseProvider.getBoardData().O_KNOWLEDGE_BOARD_REFERENCE) {
            classes.push("board-reference-" + baseProvider.getBoardData().O_KNOWLEDGE_BOARD_REFERENCE);
            typeClass = "page-type-board";
          }
          if ($scope.selectedSpace) {
            classes.push("space-reference-" + $scope.selectedSpace);
            typeClass = "page-type-space";
          }
          if ($scope.currentPost) {
            classes.push("post-reference-" + $scope.currentPost.sord.objKeys.KNOWLEDGE_POST_REFERENCE);
            classes.push("content-type-" + $scope.currentPost.sord.objKeys.KNOWLEDGE_CONTENT_TYPE);
            classes.push("post-type-" + $scope.currentPost.sord.objKeys.KNOWLEDGE_POST_TYPE);
            typeClass = "page-type-post";
          }
          classes.push(typeClass);
          if (classes != ($scope.maindiv || {}).classes) {
            $scope.maindiv = {
              classes: [classes]
            };
          }
        } else if ($scope.showHome()) {
          $scope.maindiv = {
            classes: []
          };
        }
      };

      $scope.toggleCollapseDesc = function () {
        var descriptionContainer,
          collapseHeight = 110,
          shouldCollapse = false,
          showCollapseButton = false;

        function getDescriptionContainer() {
          return angular.element(document.querySelector("#boardDescContainer"))[0]
            || angular.element(document.querySelector('#spaceDescContainer'))[0];
        }

        descriptionContainer = getDescriptionContainer();

        if (descriptionContainer) {
          if ($scope.isUserSearch) {
            if (descriptionContainer.offsetHeight > collapseHeight * 1.5) {
              showCollapseButton = true;
              shouldCollapse = true;
            }
            if (descriptionContainer.offsetHeight == collapseHeight) {
              showCollapseButton = true;
              shouldCollapse = false;
            }
          }

          $scope.showCollapseButton = showCollapseButton;
          $scope.settings.collapseDesc = shouldCollapse;

          if ($scope.settings.collapseDesc) {
            descriptionContainer.style.height = collapseHeight + "px";
            descriptionContainer.style.overflow = 'hidden';
          } else {
            descriptionContainer.style.height = "inherit";
            descriptionContainer.style.overflow = 'inherit';
          }
        } else {
          $timeout($scope.toggleCollapseDesc, 0);
          return;
        }
      }

      $scope.loadPostList = function (newFilter) {
        var promise, promisetopic, boardName,
          promises = [], loadPostList1, loadPostList2;

        if ($scope.searchForUser || $scope.loadingGUID || !$rootScope.initializeProvider) {
          return;
        }

        if ($scope.showHome()) {
          $scope.loading = false;
          $scope.loadingGUID = false;
          return;
        }

        // get currentPage
        $scope.currentPage = filterProvider.getPage();
        $scope.boardName = baseProvider.getBoardName();

        // set totalItems (move to postlist?)
        if (!$scope.totalItems && $scope.currentPage > 1) {
          // because of browser-back-button and the need of reload a different page than 1
          $scope.totalItems = ($scope.currentPage - 1) * $scope.postPerPage + 1;
        }
        $scope.loading = true;

        $scope.board = filterProvider.getBoard();
        $scope.boardData = baseProvider.getBoardData();
        $scope.selectedSpace = filterProvider.getSpace();

        $scope.ownerName = filterProvider.getUserName();
        $scope.ownerId = filterProvider.getUserId();
        $scope.searchText = filterProvider.getQuery();
        $scope.spacelist = baseProvider.getSpaceList();
        $scope.boardType = baseProvider.getBoardType();

        if (!!$scope.ownerName) {
          $scope.owner = baseProvider.getUserInfo($scope.ownerId);
          if (!$scope.owner) {
            promise = utilsProvider.getUserInfo($scope.ownerId);
            promises.push(promise);
            promise.then(
              function success(user) {
                $scope.owner = user;
                $scope.ownerName = user.name;
                baseProvider.setUserInfo($scope.ownerId, user);
              },
              function error(err) {
                errorProvider.checkError(err);
              }
            );
          }
        }
        $scope.filterSearch = !$scope.searchText;

        $window.document.title = !!$scope.selectedSpace
          ? baseProvider.getSpacesVisibleName($scope.selectedSpace) + ' | ' + baseProvider.getBoardName()
          : baseProvider.getBoardName();
        filterProvider.setUrlFilter();
        boardName = baseProvider.getBoardName();
        if (!!$scope.selectedSpace) {
          $window.document.title = baseProvider.getSpacesVisibleName($scope.selectedSpace) + ' | ' + boardName;
        } else {
          $window.document.title = boardName;
        }

        $scope.pinnedList = [];
        $scope.postlist = [];

        if ($scope.filterSearch) {
          $scope.userslist = {};
          if (parseInt($scope.currentPage, 10) === 1) {
            loadPostList1 = searchProvider.loadPostList(true, true, 'loadPostList1');
            promises.push(loadPostList1);
            loadPostList2 = searchProvider.loadPostList(newFilter, undefined, 'loadPostList2');
            promises.push(loadPostList2);
            $q.all([loadPostList1, loadPostList2])
              .then(function (sords) {
                $scope.shownPage = baseProvider.getShownPage();
                $scope.pinnedList = !!sords[0] ? sords[0] : [];
                $scope.postlist = !!sords[1] ? sords[1] : [];
                $timeout(function () {
                  $rootScope.$emit('solKnowledgeFilterChange');
                });
              }).catch(function (err) {
                errorProvider.checkError(err);
              }).finally(function (err) { });
          } else {
            promise = searchProvider.loadPostList(newFilter);
            promises.push(promise);
            promise.then(
              function success(sords) {
                $scope.shownPage = baseProvider.getShownPage();
                $scope.postlist = !!sords ? sords : [];
                $timeout(function () {
                  $rootScope.$emit('solKnowledgeFilterChange');
                });
              },
              function error(err) {
                errorProvider.checkError(err);
              }
            );
          }

          promisetopic = baseProvider.loadTopicList(30, true, "", "", "");
          $scope.loadingTopiclist = true;
          promisetopic.then(
            function success(topics) {
              $scope.topiclist = topics;
              $scope.loadingTopiclist = false;
            },
            function error(err) {
              $scope.loadingTopiclist = false;
            }
          );
        } else {
          promise = searchProvider.loadPostListQuery(newFilter, $scope.searchText);
          promises.push(promise);
          promise.then(
            function success(data) {
              $scope.shownPage = baseProvider.getShownPage();
              $scope.postlist = !!data.sords ? data.sords : [];
              $scope.userslist = !!data.users ? data.users : [];
              $timeout(function () {
                $rootScope.$emit('solKnowledgeFilterChange');
              });
            },
            function error(err) {
              if (!newFilter) {
                $scope.loadPostList(true);
              }
            }
          );

          promisetopic = baseProvider.loadTopicList(30, true, "", "", $scope.searchText);
          promises.push(promisetopic);
          promisetopic.then(
            function success(topics) {
              $scope.topiclist = topics;
            },
            function error(err) {

            }
          );
        }
        $q.all(
          promises
        )
          .finally(function () {
            $scope.loading = false;
            $scope.loadingGUID = false;

            $scope.isUserSearch = !!filterProvider.getTopic().length || !!filterProvider.getQuery();
            if (!$scope.toggleCollapseDescRecalcuating) {
              $scope.toggleCollapseDescRecalcuating = true;
              $timeout(function () {
                $scope.toggleCollapseDesc();
                $scope.toggleCollapseDescRecalcuating = false;
              }, 0);
            }
          });
      };

      $scope.getEditorOptions = function (addOptions) {
        var options = {};
        if (!$scope.isNewPost) {
          options = {
            focusEnd: true
          };
        }
        if (!addOptions) {
          addOptions = {};
        }
        angular.merge(options, addOptions, baseProvider.getEditorOptions());
        return options;
      };

      $scope.openEditBoardDesc = function () {
        $scope.$broadcast('solEditorAutoSaveEnable');
        $scope.editBoardDescEnabled = true;
      }

      $scope.openEditSpaceDesc = function () {
        $scope.$broadcast('solEditorAutoSaveEnable');
        $scope.editSpaceDescEnabled = true;
      }

      $scope.hasRightEditBoard = function () {
        if ($scope.boardData) {
          return $scope.boardData.rights.e;
        }
        return false;
      }

      $scope.hasRightEditSpace = function () {
        if ($scope.selectedSpaceData) {
          return $scope.selectedSpaceData.rights.e;
        }
        return false;
      };

      $scope.upload = function (files) {
        var deferred = $q.defer(),
          data = new FormData(),
          name = "file";

        data.append(name, files[0]);

        $R.ajax.post({
          url: angular.merge({}, baseProvider.getEditorOptions()).imageUpload,
          data: data,
          success: function (response) {
            deferred.resolve(response.guid);
            $rootScope.$emit("solKnowledgeUpload", { guid: response.guid });
          },
          error: function (error) {
            deferred.reject(error);
          }
        });

        return deferred.promise;
      };

      $scope.uploadSpaceImage = function () {
        var input = document.getElementById('spaceImage');

        input.onchange = function (e) {
          // check if max size reached
          if ($scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB) {
            var maxFileSize = Number.parseInt($scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB) * 1000000;

            if (input.files[0].size > maxFileSize) {
              api.webapps.WebApp.showToast(
                api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.GENERAL'),
                api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.MAX_TILE_FILE_SIZE_EXCEEDED', $scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB),
                api.webapps.WebApp.TOAST_TYPE.ERROR,
                5
              );
              return;
            }
          }

          $scope.upload(input.files)
            .then(function (guid) {
              $scope.spaceImageGuid = guid;
              $scope.shouldRemoveSpaceImage = false;
            });
        };

        input.click();
      };

      $scope.removeSpaceImage = function () {
        $scope.spaceImageGuid = null;
        $scope.shouldRemoveSpaceImage = true;
      };

      $scope.saveBoard = function () {
        $scope.$broadcast('solEditorGetContent');
        $timeout(function () {
          var params = {
            objId: $scope.boardData.guid,
            content: $scope.boardData.desc,
            createdFiles: $scope.allUploadGUIDs
          };

          $scope.saveBoardOrSpace(params)
            .finally(function () {
              $scope.editBoardDescEnabled = false;
              $scope.toggleCollapseDesc();
            });
        });
      }

      $scope.saveSpace = function () {
        $scope.$broadcast('solEditorGetContent');
        $timeout(function () {
          var params = {
            objId: $scope.selectedSpaceData.guid,
            content: $scope.selectedSpaceData.desc,
            previewImage: $scope.spaceImageGuid,
            removePreviewImage: !$scope.spaceImageGuid,
            createdFiles: $scope.allUploadGUIDs
          };
          $scope.saveBoardOrSpace(params)
            .finally(function () {
              $scope.editSpaceDescEnabled = false;
              $scope.toggleCollapseDesc();
            });
        });
      }

      $scope.saveBoardOrSpace = function (params) {
        var deferred = $q.defer();
        $scope.$broadcast('solEditorGetContent');
        $timeout(function () {
          sol.common.IxUtils.execute("RF_sol_knowledge_service_EditBoardOrSpace",
            params,
            function (_result) {
              $rootScope.$emit('solKnowledgeUploadClearGUIDs');
              $rootScope.inEditMode = false;
              baseProvider.getConfig(true, true, false);
              $scope.$apply(function (scope) {
                scope.$broadcast('solEditorAutoSaveDisable');
              });
              deferred.resolve();
            },
            function (_error) {
              $rootScope.$emit('solKnowledgeUploadClearGUIDs');
              $rootScope.inEditMode = false;
              $scope.$apply(function (scope) {
                scope.$broadcast('solEditorAutoSaveDisable');
              });
              deferred.reject();
            })
        });
        return deferred.promise;
      }

      $scope.cancelEditBoardDesc = function () {
        $rootScope.$emit('solKnowledgeUploadClearGUIDs');
        $scope.$broadcast('solEditorAutoSaveDisable');
        $scope.editBoardDescEnabled = false;
        $scope.toggleCollapseDesc();
      }

      $scope.cancelEditSpaceDesc = function () {
        $rootScope.$emit('solKnowledgeUploadClearGUIDs');
        $scope.$broadcast('solEditorAutoSaveDisable');
        $scope.editSpaceDescEnabled = false;
        $scope.toggleCollapseDesc();
      }

      $scope.loadLinkedPosts = function () {
        var id = baseProvider.getSpacesId(filterProvider.getSpace()),
          promise;
        if (!id || id == -1) {
          id = baseProvider.getBoardId();
        }
        if (id && id != -1) {
          promise = postProvider.loadLinkedPosts(id);
          promise.then(
            function success(result) {
              $scope.linkedPosts = result.linkedPosts;
            },
            function error(err) { }
          );
        }
      };

      $scope.checkInitializeState = function () {
        if ($scope.location.$$path.indexOf('/post/') === 0 || $scope.location.$$path.indexOf('/editpost/') === 0 ||
          $scope.location.$$path.indexOf('/addpost/') === 0 || $scope.location.$$path.indexOf('/error/') === 0) {
          return;
        }
        if (!$scope.initializeDone && $rootScope.initCount === 3 && !$scope.searchForUser && !$scope.loadingGUID) {
          if (cacheProvider.getInitBoardCacheCalled()) {
            $scope.currentPage = filterProvider.getPage();
            $scope.boardName = baseProvider.getBoardName();
            $scope.topiclist = baseProvider.getTopicList();
            $scope.spacelist = baseProvider.getSpaceList();
            $scope.languagelist = baseProvider.getAllowedLanguages();
            $scope.languagesActivated = baseProvider.checkLanguagesActivated();
            $scope.languageCount = baseProvider.getLanguageCount();
            $scope.shownPage = baseProvider.getShownPage();
            $scope.postPerPage = baseProvider.getPostPerPage();

            $timeout(function () {
              $scope.loadPostList(false);
              $scope.loadLinkedPosts();
              $scope.initializeDone = true;
            });
          } else {
            $timeout(function () {
              $scope.checkInitializeState();
            }, 1);
          }
        }
      };

      $scope.loadRouteParams = function (deferred) {
        var i,
          relocate = false,
          tmptopic = [],
          tmpCategory = [],
          tmptype = [],
          promise,
          userId;

        deferred = deferred || $q.defer();

        // if function initBoardCache in cacheProvider is called, the boards-list is initialized
        if (!cacheProvider.getInitBoardCacheCalled()) {
          $timeout(function () {
            $scope.loadRouteParams(deferred);
          });
          return deferred.promise;
        }
        filterProvider.clearSessionFilter(true);

        if (!!$scope.location.$$search.board) {
          if (baseProvider.checkBoard($scope.location.$$search.board)) {
            filterProvider.setBoard($scope.location.$$search.board);
          }
        }
        if (!!$scope.location.$$search.space) {
          if (baseProvider.checkSpace($scope.location.$$search.space)) {
            if (baseProvider.countBoards() > 0 && !filterProvider.getBoard()) {
              if (!!baseProvider.getBoardFromSpace($scope.location.$$search.space)) {
                filterProvider.setBoard(baseProvider.getBoardFromSpace($scope.location.$$search.space));
                relocate = true;
              }
            }
            filterProvider.setSpace($scope.location.$$search.space);
            $scope.selectedSpace = $scope.location.$$search.space;
            $scope.setBoardClasses();
            $scope.loadLinkedPosts();
          }
        }
        if (!!$scope.location.$$search.page) {
          filterProvider.setPage($scope.location.$$search.page);
          $scope.currentPage = $scope.location.$$search.page;
        }
        if (!!$scope.location.$$search.query) {
          filterProvider.setQuery($scope.location.$$search.query);
          $scope.searchText = $scope.location.$$search.query;
          $scope.filterSearch = false;
        }
        if (!!$scope.location.$$search.topic && $scope.location.$$search.topic.length > 0) {
          tmptopic = $scope.location.$$search.topic.split(',');
          for (i = 0; i < tmptopic.length; i++) {
            filterProvider.setTopic(tmptopic[i]);
          }
        }
        if (!!$scope.location.$$search.category && $scope.location.$$search.category.length > 0) {
          tmpCategory = $scope.location.$$search.category.split(',');
          for (i = 0; i < tmpCategory.length; i++) {
            filterProvider.setCategory(tmpCategory, 'add');
          }
        }
        if (!!$scope.location.$$search.type && $scope.location.$$search.type.length > 0) {
          tmptype = $scope.location.$$search.type.split(',');
          for (i = 0; i < tmptype.length; i++) {
            if (baseProvider.checkType(tmptype[i])) {
              filterProvider.setType(tmptype[i]);
            }
          }
        }
        if (!!$scope.location.$$search.user) {
          userId = parseInt($scope.location.$$search.user, 10);
          $scope.owner = baseProvider.getUserInfo(userId);

          if (!$scope.owner) {
            $scope.searchForUser = true;
            promise = utilsProvider.getUserInfo(userId);
            promise.then(
              function success(user) {
                filterProvider.setUser(userId, user.name);
                $scope.owner = user;
                $scope.ownerName = user.name;
                $scope.ownerId = userId;
                baseProvider.setUserInfo(userId, user);
                $scope.searchForUser = false;
                $scope.checkInitializeState();
                $scope.$emit('solKnowledgeReload');
              },
              function error(err) {
                $scope.searchForUser = false;
                $scope.checkInitializeState();
                errorProvider.checkError(err);
              }
            );
          } else {
            filterProvider.setUser(userId, $scope.owner.name);
            $scope.checkInitializeState();
          }
        }
        if (!!$scope.location.$$search.flag) {
          if ($scope.location.$$search.flag === 'noanswer') {
            filterProvider.setNoAnswer();
          }
          if ($scope.location.$$search.flag === 'nosolution') {
            filterProvider.setNoSolution();
          }
        }
        if (relocate) {
          $scope.$emit('solKnowledgeReload');
        }
        deferred.resolve();
        return deferred.promise;
      };

      $scope.removeOwnerSelection = function () {
        filterProvider.changeUser(-1, '');
        $scope.$emit('solKnowledgeReload');
      };

      $scope.checkSpaceSubscription = function () {
        $scope.spaceSubscription = baseProvider.getSpacesSubscription($scope.selectedSpace);
        return $scope.spaceSubscription;
      };

      $scope.subscribeSpace = function (value) {
        var id = baseProvider.getSpacesId($scope.selectedSpace),
          promise = subscription.subscribe(id, value);

        promise.then(
          function success(res) {
            baseProvider.setSpacesSubscription($scope.selectedSpace, value);
          },
          function error(err) {
            errorProvider.checkError(err);
          }
        );
      };

      $scope.showHome = function () {
        if ($scope.loadingGUID) {
          return false;
        }
        var countBoards = baseProvider.countBoards(),
          countSingleSpaces = baseProvider.getSingleSpaces().length,
          hasFilterBoard = !!filterProvider.getBoard(),
          hasFilterSpace = !!filterProvider.getSpace(),
          setBoardFilter = countBoards === 1 && countSingleSpaces === 0,
          boards,
          _showHome;

        if (setBoardFilter && !hasFilterBoard) {
          boards = baseProvider.getBoards();
          hasFilterBoard = true;
          filterProvider.setBoard(Object.keys(boards)[0]);
        }

        _showHome =
          // es gibt mir als 1 board bzw. es gibt singleSpaces
          (countBoards > 1 || (countBoards === 1 && countSingleSpaces > 0))
          // board ist nicht gesetzt
          && !hasFilterBoard
          // filterSpace ist nicht gesetzt oder es gibt es ein board für space
          && (!hasFilterSpace || !!baseProvider.getBoardFromSpace($scope.location.$$search.space));

        return _showHome;
      };

      $scope.showSpaceList = function () {
        var noSingleSpace = true, countBoards, filterSpace;
        countBoards = baseProvider.countBoards();
        filterSpace = filterProvider.getSpace();
        noSingleSpace = (countBoards > 0 && (!filterSpace || (!!filterSpace && !baseProvider.checkSingleSpace(filterSpace)))) || countBoards === 0;
        return clientProvider.hasAccess(0) && noSingleSpace;
      };


      solKnowledgeSelectedSpaceWatcher = $rootScope.$on('solKnowledgeSelectedSpace', function (ev, args) {
        $scope.selectedSpace = args.selectedSpace;
        $scope.loadPostList(true);
        $scope.loadLinkedPosts();
      });

      solKnowledgeTotalItemsWatcher = $rootScope.$on('solKnowledgeTotalItems', function (ev, args) {
        $scope.totalItems = args.totalItems;
      });

      solKnowledgeInitReloadWatcher = $rootScope.$on('solKnowledgeInitReload', function (ev, args) {
        var newFilter;
        newFilter = true;
        $scope.searchText = filterProvider.getQuery();
        if (!!$scope.searchText) {
          $scope.filterSearch = false;
        }
        $scope.currentPage = 1;
        $scope.loadPostList(newFilter);
        $scope.loadLinkedPosts();
      });

      solKnowledgeHomeSelectWatcher = $rootScope.$on('solKnowledgeHomeSelect', function (ev, args) {
        var newFilter;
        newFilter = true;
        $scope.currentPage = 1;
        filterProvider.setPage(1);
        $scope.loadPostList(newFilter);
        $scope.loadLinkedPosts();
      });

      solKnowledgeReloadConfigWatcher = $rootScope.$on('solKnowledgeReloadConfig', function (ev) {
        $scope.currentPage = filterProvider.getPage();
        $scope.boardName = baseProvider.getBoardName();
        $scope.topiclist = baseProvider.getTopicList();
        $scope.spacelist = baseProvider.getSpaceList();
        $scope.languagelist = baseProvider.getAllowedLanguages();
        $scope.languagesActivated = baseProvider.checkLanguagesActivated();
        $scope.languageCount = baseProvider.getLanguageCount();
        $scope.shownPage = baseProvider.getShownPage();
        $scope.postPerPage = baseProvider.getPostPerPage();
        $scope.replyPerPage = baseProvider.getReplyPerPage();
        $scope.$apply();
      });

      solKnowledgeChangeBoardOrSpaceWatcher = $rootScope.$on('solKnowledgeChangeBoardOrSpace', function (ev) {
        // reset postlist if home
        // execute at end of stack
        $scope.editBoardDescEnabled = false;
        $scope.editSpaceDescEnabled = false;
        $timeout(
          function () {
            if ($scope.showHome()) {
              $scope.postlist = null;
            }
          }
        );
        $scope.boardType = baseProvider.getBoardType();
        $scope.setBoardClasses();
      });

      solKnowledgeUploadWatcher = $rootScope.$on('solKnowledgeUpload', function (ev, args) {
        $scope.allUploadGUIDs.push(args.guid);
      });

      solKnowledgeDeleteWatcher = $rootScope.$on('solKnowledgeDelete', function (ev, args) {
        $scope.allDeletedGUIDs.push(args.guid);
      });

      solKnowledgeUploadClearGUIDsWatcher = $rootScope.$on('solKnowledgeUploadClearGUIDs', function (ev) {
        $scope.allUploadGUIDs = [];
      });

      // listen for route change success (change from post to knowledge board vice versa)
      routeChangeSuccessWatcher = $scope.$on('$routeChangeSuccess', $scope.checkInitializeState);

      $scope.$on("$destroy", function () {
        solKnowledgeUploadWatcher();
        solKnowledgeDeleteWatcher();
        solKnowledgeUploadClearGUIDsWatcher();
        solKnowledgeSelectedSpaceWatcher();
        solKnowledgeTotalItemsWatcher();
        solKnowledgeInitReloadWatcher();
        solKnowledgeReloadConfigWatcher();
        solKnowledgeHomeSelectWatcher();
        solKnowledgeChangeBoardOrSpaceWatcher();
        routeChangeSuccessWatcher();
      });
    }
  ])
    .directive('draganddrop', function () {
      return {
        scope: {
          drag: '&',
          drop: '&',
          delete: '&',
          draganddropOptions: '='
        },
        link: function ($scope, element) {
          // again we need the native object
          var el = element[0];

          // this gives us the native JS object
          var el = element[0],
            handleElement,
            deleteElement,
            target = false,
            dropzone;

          if (!el) {
            return;
          }

          if (($scope.draganddropOptions || {}).handle) {
            handleElement = el.querySelectorAll("[draganddrop-handle]")[0];
            if (!handleElement) {
              handleElement = document.createElement("div");
              handleElement.innerHTML = '<span class="fa fa-bars action-icon"></span>';
              el.appendChild(handleElement);
            }
            handleElement.classList.add("dragable-item-handle");
          }

          if (($scope.draganddropOptions || {}).delete) {
            deleteElement = el.querySelectorAll("[draganddrop-delete]")[0];
            if (!deleteElement) {
              deleteElement = document.createElement("div");
              deleteElement.innerHTML = '<span class="fa fa-times action-icon"></span>';
              el.appendChild(deleteElement);
            }
            deleteElement.classList.add("dragable-item-delete");
            deleteElement.addEventListener("click", function () {
              $scope.delete();
            })
          }

          if (($scope.draganddropOptions || {}).dropzone) {
            dropzone = $scope.draganddropOptions.dropzone;
          } else {
            dropzone = "dragandrop"
          }

          el.classList.add("dragable-item");
          el.draggable = true;

          element.bind('mousedown', function (e) {
            target = e.target;
          });


          function listenToDrag(e) {
            if (e && e.dataTransfer) {
              e.dataTransfer.clearData();
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData("dragandrop", "");
            }

            el.classList.add('drag');
            // call the passed drop function
            $scope.$apply(function (scope) {
              scope.drag(e);
            });

            return false;
          }
          function listenToDrop(e) {
            if (e.stopPropagation) e.stopPropagation();
            $scope.$apply(function (scope) {
              scope.drop();
            });
            $scope.$root.$emit("onDragEnded");
          }
          function listenToDragEnter(e) {
            if (e.preventDefault) e.preventDefault();

            if (e.dataTransfer.types.indexOf(dropzone) != -1) {
              el.classList.add('over');
            }
            return false;
          }
          function listenToDragLeave(e) {
            if (e.preventDefault) e.preventDefault();

            el.classList.remove('over');
            return false;
          }
          function listenToDragOver(e) {
            if (e.preventDefault) e.preventDefault();
            el.classList.add('over');
            return false;
          }


          el.addEventListener('dragstart', listenToDrag, false);
          el.addEventListener("drop", listenToDrop, false);
          el.addEventListener("dragenter", listenToDragEnter, false);
          el.addEventListener("dragleave", listenToDragLeave, false);

          el.onDragOver = function (event) { }
          el.addEventListener("dragover", listenToDragOver);

          var onDragEnded = function () {
            el.classList.remove('drag');
            el.classList.remove('over');
          }
          $scope.$root.$on("onDragEnded", onDragEnded);
        }
      }
    });
}()
);
