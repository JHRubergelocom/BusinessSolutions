// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require */
(function () {
  'use strict';

  var appNamespace = sol.common.apps.namespace;

  appNamespace.onLoad = function () {
  };

  appNamespace.app.config(
    function (tagsInputConfigProvider) {
      tagsInputConfigProvider.setDefaults('tagsInput', {
        placeholder: api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.TOPICS.PLACEHOLDER'),
        removeTagSymbol: '✖',
        maxTags: 5,
        replaceSpacesWithDashes: 'false'
      });
    }
  );

  appNamespace.app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  }]);

  appNamespace.app.controller('EditPostCtrl', ['$scope', '$rootScope', '$log', '$route', '$routeParams', '$timeout', 'appState',
    '$location', '$window', '$q', 'baseProvider', 'postProvider', 'utilsProvider', 'filterProvider', 'cacheProvider', 'errorProvider', 'clientProvider', 'searchProvider', '$filter',
    function ($scope, $rootScope, $log, $route, $routeParams, $timeout, appState,
      $location, $window, $q, baseProvider, postProvider, utilsProvider, filterProvider, cacheProvider, errorProvider, clientProvider, searchProvider, $filter) {
      $scope.initializeDone = false;
      $scope.postPerPage = 10;
      $scope.route = $route;
      $scope.location = $location;
      $scope.routeParams = $routeParams;
      $scope.spaceButton = api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.SPACE.PLACEHOLDER');
      $scope.spaceButtonTag = "";
      $scope.isNewPost = true;
      $scope.titleFocus = false;
      $scope.selectedSpace = '';
      $scope.allUploadGUIDs = [];
      $scope.allDeletedGUIDs = [];
      $scope.noMoreTopics = false;
      $scope.loading = true;
      $scope.URLLoaded = false;
      $scope.languagesActivated = false;
      $scope.topicTagMinLength = baseProvider.getTopicTagMinLength();
      $scope.searchText = "";
      $scope.fillingerror = false;
      $scope.topics = [];
      $scope.topicNames = [];

      $scope.elementMoved = false;
      $scope.boardType = baseProvider.getBoardType();
      $scope.boardData = baseProvider.getBoardData();

      var getPostType,
        getKnowledgeTopics,
        solKnowledgeUploadWatcher = $rootScope.$on('solKnowledgeUpload', function (ev, args) {
          $scope.allUploadGUIDs.push(args.guid);
        }),
        solKnowledgeDeleteWatcher = $rootScope.$on('solKnowledgeDelete', function (ev, args) {
          $scope.allDeletedGUIDs.push(args.guid);
        }),

        solKnowledgeUploadErrorWatcher = $rootScope.$on('solKnowledgeUploadError', function (ev, args) {
          api.webapps.WebApp.showToast(
            api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.GENERAL'),
            api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.UPLOADERROR'),
            api.webapps.WebApp.TOAST_TYPE.ERROR
          );
        }),

        solKnowledgeUploadClearGUIDsWatcher = $rootScope.$on('solKnowledgeUploadClearGUIDs', function (ev) {
          $scope.allUploadGUIDs = [];
        }),

        solKnowledgeReloadConfigWatcher = $rootScope.$on('solKnowledgeReloadConfig', function (ev) {
          $scope.currentPage = filterProvider.getPage();
          $scope.shownPage = baseProvider.getShownPage();
          $scope.postPerPage = baseProvider.getPostPerPage();

          $scope.boardType = baseProvider.getBoardType();
          $scope.boardData = baseProvider.getBoardData();
        }),
        solKnowledgeChangeBoardOrSpaceWatcher = $rootScope.$on('solKnowledgeChangeBoardOrSpace', function () {
          $scope.boardType = baseProvider.getBoardType();
          $scope.boardData = baseProvider.getBoardData();
        });

      $scope.checkInitializeState = function () {
        if ($rootScope.initializeProvider && !$scope.initializeDone) {
          $scope.currentPage = filterProvider.getPage();
          $scope.shownPage = baseProvider.getShownPage();
          $scope.postPerPage = baseProvider.getPostPerPage();
          $scope.initializeDone = true;
        }
      };

      $scope.checkInitializeState();
      searchProvider.resetLastRequest();

      $scope.checkTags = function () {
        $scope.topics.invalid = !!document.querySelector('#taginput .input.invalid-tag');
        return (($scope.topics.invalid || $scope.topics.length === 0 || $scope.topics.length > 5) && $scope.fillingerror);
      };

      $scope.post = function () {
        var promise, i, pos, id, topicarr, createReferences, deleteReferences, newPins;
        $scope.topics.invalid = !!document.querySelector('#taginput .input.invalid-tag');
        $scope.$broadcast('solEditorGetContent');
        $timeout(function () {
          if ($scope.topics.invalid || !$scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT || !$scope.editpost.desc || !$scope.spaceButtonTag || $scope.topics.length === 0 || $scope.topics.length > 5 || $scope.authors.length === 0) {
            $scope.fillingerror = true;
            return;
          }
          topicarr = [];
          for (i = 0; i < $scope.topics.length; i++) {
            topicarr.push($scope.topics[i].text);
          }
          createReferences = [];
          deleteReferences = [];
          newPins = [];
          if ($scope.pins.boardPin) {
            newPins.push('board');
          }
          if ($scope.pins.spacePin) {
            newPins.push('space');
          }
          if ($scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE === "GUIDE") {
            var childPostsTmp = angular.copy($scope.childPosts);
            for (i = 0; i < childPostsTmp.length; i++) {
              pos = $scope.childPostsOriginal.indexOf(childPostsTmp[i].guid);
              if (pos > -1) {
                childPostsTmp.splice(i, 1);
                $scope.childPostsOriginal.splice(pos, 1);
                i--;
              }
            }
            if ($scope.childPostsOriginal.length > 0) {
              deleteReferences = angular.copy($scope.childPostsOriginal);
              $scope.elementMoved = true;
            }
            if (childPostsTmp.length > 0) {
              for (i = 0; i < childPostsTmp.length; i++) {
                createReferences.push(childPostsTmp[i].guid);
              }
              $scope.elementMoved = true;
            }
          }
          $scope.loading = true;
          if (!$scope.isNewPost) {
            promise = postProvider.editPost(
              $scope.editpost.guid,
              $scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT,
              $scope.editpost.desc,
              $scope.editpost.objKeys.KNOWLEDGE_LABEL,
              topicarr,
              $scope.allUploadGUIDs,
              $scope.allDeletedGUIDs,
              $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE,
              $scope.elementMoved, 
              $scope.childPosts,
              createReferences,
              deleteReferences,
              newPins,
              $scope.teaserImageGuid,
              $scope.shouldRemoveTeaserImage,
              $scope.authors,
              $scope.contactpersons
            );
            promise.then(
              function success(sords) {
                $scope.$broadcast('solEditorAutoSaveDisable');
                $location.path('/post/' + sords.objId);
                appState.setPristine();
                $rootScope.inEditMode = false;
                $rootScope.$emit('solKnowledgeUploadClearGUIDs');
              },
              function error(err) {
                $scope.loading = false;
                $rootScope.$emit('solKnowledgeUploadClearGUIDs');
                errorProvider.checkError(err);
              }
            );
          } else {
            id = baseProvider.getSpacesId($scope.spaceButtonTag);
            promise = postProvider.createNewPost(
              $scope.editpost.type,
              $scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT,
              $scope.editpost.desc,
              $scope.editpost.objKeys.KNOWLEDGE_LABEL,
              id,
              topicarr,
              $scope.allUploadGUIDs,
              $scope.allDeletedGUIDs,
              $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE,
              createReferences,
              deleteReferences,
              newPins,
              $scope.teaserImageGuid,
              $scope.shouldRemoveTeaserImage,
              $scope.authors,
              $scope.contactpersons
            );
            promise.then(
              function success(sords) {
                var board = filterProvider.getBoard();
                if (!!board) {
                  cacheProvider.addBoardActivity(board, 'writePost');
                }
                $scope.$broadcast('solEditorAutoSaveDisable');
                $location.path('/post/' + sords.objId);
                appState.setPristine();
                $rootScope.inEditMode = false;
                $rootScope.$emit('solKnowledgeUploadClearGUIDs');
              },
              function error(err) {
                $scope.loading = false;
                $rootScope.$emit('solKnowledgeUploadClearGUIDs');
                errorProvider.checkError(err);
              }
            );
          }
        });
      };

      $scope.$on('elementChange', function (evt, opt) {
        if (opt.name === 'elementList') {
          $scope.elementMoved = opt.hasChange;
        }
      });

      $scope.onSelectPostsUpdate = function() {
        $scope.elementMoved = true;
      }

      $scope.upload = function (files) {
        var deferred = $q.defer(),
          data = new FormData(),
          name = "file";

        data.append(name, files[0]);

        $R.ajax.post({
          url: $scope.getEditorOptions().imageUpload,
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

      $scope.uploadTeaserImage = function () {
        var input = document.getElementById('teaserImage');

        input.onchange = function (e) {
          // check if max size reached
          if ($scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB) {
            var maxFileSize = Number.parseInt($scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB) * 1000000;

            if (input.files[0].size > maxFileSize) {
              api.webapps.WebApp.showToast(
                api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.GENERAL'),
                api.helpers.Text.getText('SOL.KNOWLEDGE.ERROR.MAX_TILE_FILE_SIZE_EXCEEDED', $scope.boardData.SETTING_MAX_TILE_FILE_SIZE_IN_MB),
                api.webapps.WebApp.TOAST_TYPE.ERROR
              );
              return;
            }
          }

          $scope.upload(input.files)
            .then(function (guid) {
              $scope.teaserImageGuid = guid;
              $scope.shouldRemoveTeaserImage = false;
            });
        };

        input.click();
      };

      $scope.removeTeaserImage = function () {
        $scope.teaserImageGuid = null;
        $scope.shouldRemoveTeaserImage = true;
      };

      $scope.cancel = function () {
        $rootScope.$emit('solKnowledgeUploadClearGUIDs');
        $scope.$broadcast('solEditorAutoSaveDisable');
        if ($scope.isNewPost) {
          $location.url('/' + filterProvider.getUrlFilter());
        } else {
          $location.path('/post/' + $scope.editpost.guid);
        }
      };

      $scope.getPostTypeLocaleField = function (type, field, contentType) {
        return baseProvider.getPostTypeLocaleField(type, field, contentType);
      };

      $scope.getTopicMaxLength = function () {
        return baseProvider.getTopicMaxLength();
      };

      $scope.getTopicDescription = function () {
        return api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.TOPICS.DESC', $scope.getTopicMaxLength());
      };

      $scope.changeLanguage = function (languageKey) {
        if ($scope.editpost && $scope.editpost.objKeys && $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE) {
          $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE = languageKey;
        }
      };

      $scope.loadLanguageList = function () {
        $scope.languages = baseProvider.getAllowedLanguages();
      };

      $scope.changeSpace = function (space) {
        $scope.spaceButton = $scope.getSpacesVisibleName(space);
        $scope.spaceButtonTag = space;
        $scope.selectedSpace = space;
        $scope.spaceRights = baseProvider.getSpacesRights($scope.selectedSpace);
        if ($scope.labels.length > 0 && !$scope.spaceRights.w && !!$scope.isNewPost) {
          $scope.editpost.objKeys.KNOWLEDGE_LABEL = $scope.labels[0].key;
        }
        $scope.loadSuggestedTopics();
      };

      $scope.mayChangeSpace = function () {
        return clientProvider.hasAccess(0);
      };

      $scope.loadSpaceList = function (type) {
        $scope.spaces = baseProvider.getSpaceListEditPost(type);
        if ($scope.editpost && $scope.editpost.objKeys && $scope.editpost.objKeys.KNOWLEDGE_SPACE_REFERENCE) {
          $scope.spaceButton = $scope.getSpacesVisibleName($scope.editpost.objKeys.KNOWLEDGE_SPACE_REFERENCE);
          $scope.spaceButtonTag = $scope.editpost.objKeys.KNOWLEDGE_SPACE_REFERENCE;
        }
      };

      $scope.loadRelatedTopics = function () {
        var i,
          promise,
          board,
          choosenTopics = [],
          filter = [];

        for (i = 0; i < $scope.topics.length; i++) {
          choosenTopics.push($scope.topics[i].text);
        }
        board = filterProvider.getBoard();
        if (!!board) {
          filter = [{ key: 'KNOWLEDGE_BOARD_REFERENCE', type: 'FIELD_OBJ_KEY', values: [board] }];
        }
        promise = baseProvider.loadRelatedTopicList($scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT, choosenTopics, filter);
        promise.then(
          function success(data) {
            while (data.length > 10) {
              data.splice(data.length - 1, 1);
            }

            data.sort(function (a, b) {
              return a.localeCompare(b);
            });
            $scope.tmpSuggestedTopics = angular.copy(data);
            if ($scope.tmpSuggestedTopics.length < 10) {
              $scope.loadTopicList($scope.selectedSpace);
            } else {
              $scope.suggestedTopics = angular.copy($scope.tmpSuggestedTopics);
            }
          },
          function error(err) {
          }
        );
      };

      $scope.loadTopicList = function (space) {
        var promise, pos;

        promise = baseProvider.loadTopicList(15, false, "", space || "", "");
        promise.then(
          function success(data) {
            for (var i = 0; i < $scope.topics.length; i++) {
              pos = data.indexOf($scope.topics[i].text);
              if (pos > -1) {
                data.splice(pos, 1);
              }
            }
            while ($scope.tmpSuggestedTopics.length < 10 && data.length > 0) {
              if ($scope.tmpSuggestedTopics.indexOf(data[0]) === -1) {
                $scope.tmpSuggestedTopics.push(data[0]);
              }
              data.splice(0, 1);
            }
            $scope.tmpSuggestedTopics.sort(function (a, b) {
              return a.localeCompare(b);
            });
            if ($scope.tmpSuggestedTopics.length < 10 && !!space) {
              $scope.loadTopicList("");
            } else {
              $scope.suggestedTopics = angular.copy($scope.tmpSuggestedTopics);
            }
          },
          function error(err) {
          }
        );
      };

      $scope.loadSuggestedTopics = function () {
        if (!!$scope.topics && $scope.topics.length < 5) {
          $scope.tmpSuggestedTopics = [];
          if (!!$scope.editpost && !!$scope.editpost.objKeys && $scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT && $scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT.length > 0) {
            $scope.loadRelatedTopics();
          } else {
            $scope.loadTopicList($scope.selectedSpace);
          }
        }
      };

      $scope.selectTag = function (tag) {
        var i,
          taginput,
          tagscope;

        for (i = 0; i < $scope.topics.length; i++) {
          if ($scope.topics[i].text === tag) {
            return;
          }
        }
        $scope.topics.push({ text: tag });
        taginput = document.getElementById('taginput');
        tagscope = angular.element(taginput.getElementsByClassName('host')[0]).scope();
        if (tagscope) {
          tagscope.text = "";
        }
      };

      $scope.checkEnableInput = function () {
        var max = 5;
        if ($scope.topics.length > max) {
          $scope.topics.splice(max);
        }
        if ($scope.topics.length == max) {
          $scope.tagsPlaceholder = "";
        } else {
          $scope.tagsPlaceholder = api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.TOPICS.PLACEHOLDER');
        }
        return $scope.topics.length == max;
      }

      $scope.getSpacesVisibleName = function (item) {
        return baseProvider.getSpacesVisibleName(item);
      };

      $scope.loadTags = function ($query) {
        var i,
          tmpTopics = [];
        for (i = 0; i < $scope.topics.length; i++) {
          tmpTopics.push($scope.topics[i].text);
        }
        return baseProvider.loadTopicSearchList($query, $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE, tmpTopics);
      };

      getPostType = function (type) {
        return baseProvider.getPostTypeProperty(type);
      };

      getKnowledgeTopics = function (obj) {
        var i, tmp, topics, topicstmp = [];
        topics = obj.sord.objKeys.KNOWLEDGE_TOPICS.split("¶");
        for (i = 0; i < topics.length; i++) {
          tmp = {};
          tmp.text = topics[i];
          topicstmp.push(tmp);
        }
        return topicstmp;
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

      $scope.getLabelLocale = function (key) {
        return baseProvider.getLabelLocale(key);
      };

      $scope.getLabelColor = function (key) {
        return baseProvider.getLabelColor(key);
      };

      $scope.changeLabel = function (key) {
        $scope.editpost.objKeys.KNOWLEDGE_LABEL = key;
      };

      $scope.authorSelect = "";

      $scope.availableAuthors;

      $scope.getAvailableAuthors = function ($viewValue) {
        var deferred = $q.defer();

        function filterSelected() {
          return $scope.availableAuthors
            .filter(function (availableAuthor) {
              return !$scope.authors.find(function (selectedAuthor) {
                return selectedAuthor.id == availableAuthor.id;
              });
            })
            .filter(function(availableAuthor) {
              function toLowerCase(value) {
                return (value || "").toLowerCase();
              }
              return toLowerCase(availableAuthor.name).indexOf(toLowerCase($viewValue)) != -1;
            });
        }

        if ($scope.availableAuthors) {
          deferred.resolve(filterSelected());
        } else {
          sol.common.IxUtils.execute("RF_sol_knowledge_service_UserInfo_ResolveGroup",
            {
              group: "authors"
            },
            function (data) {
              $scope.availableAuthors = data.users || [];
              deferred.resolve(filterSelected());
            },
            function (err) {
              deferred.reject(err);
            }
          );
        }

        return deferred.promise;
      }

      $scope.onAuthorsUpdate = function (authors) {
        $scope.editpost.objKeys.KNOWLEDGE_POST_AUTHORS_IDS = authors.map(function (author) { return author.id });
        $scope.editpost.objKeys.KNOWLEDGE_POST_AUTHORS = authors.map(function (author) { return author.name });
        $scope.authors = authors;
      }

      $scope.setNewAuthor = function ($item) {
        $scope.authors.splice($scope.authors.length, 0, $item);
        $scope.authorSelect = "";
      };

      $scope.getMaximalNumberOfAuthors = function () {
        return baseProvider.getPostTypeSettingField(
          $scope.editpost.objKeys.KNOWLEDGE_POST_TYPE,
          "SETTING_MAX_AUTHORS",
          $scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE
        ) || 3;
      }

      $scope.isAuthorsSelectDisabled = function () {
        return ($scope.authors || []).length >= $scope.getMaximalNumberOfAuthors();
      }

      $scope.contactpersonsSelect = "";

      $scope.availableContactpersons;

      $scope.getAvailableContactpersons = function ($viewValue) {
        var deferred = $q.defer();

        function filterSelected() {
          return $scope.availableContactpersons
            .filter(function (availableContactperson) {
              return !$scope.contactpersons.find(function (selectedContactperson) {
                return selectedContactperson.id == availableContactperson.id;
              })
            })
            .filter(function(availableContactperson) {
              function toLowerCase(value) {
                return (value || "").toLowerCase();
              }
              return toLowerCase(availableContactperson.name).indexOf(toLowerCase($viewValue)) != -1;
            });
        }

        if ($scope.availableContactpersons) {
          var availableContacts = filterSelected();
          deferred.resolve(availableContacts);
        } else {
          sol.common.IxUtils.execute("RF_sol_knowledge_service_UserInfo_ResolveGroup",
            {
              group: "contactpersons"
            },
            function (data) {
              $scope.availableContactpersons = data.users || [];
              var availableContacts = filterSelected();
              deferred.resolve(availableContacts);
            },
            function (err) {
              deferred.reject(err);
            }
          );
        }

        return deferred.promise;
      }

      $scope.onContactpersonsUpdate = function (contactpersons) {
        $scope.contactpersons = contactpersons;
        $scope.editpost.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS = contactpersons.map(function (author) { return author.id });
        $scope.editpost.objKeys.KNOWLEDGE_POST_CONTACTPERSONS = contactpersons.map(function (author) { return author.name });
      }

      $scope.setNewContactperson = function ($item) {
        $scope.contactpersons.splice($scope.contactpersons.length, 0, $item);
        $scope.contactpersonsSelect = "";
      };

      $scope.getMaximalNumberOfContactpersons = function () {
        return baseProvider.getPostTypeSettingField(
          $scope.editpost.objKeys.KNOWLEDGE_POST_TYPE,
          "SETTING_MAX_CONTACTPERSONS",
          $scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE
        ) || 1;
      }

      $scope.isContactpersonSelectDisabled = function () {
        return ($scope.contactpersons || []).length >= $scope.getMaximalNumberOfContactpersons();
      }

      $scope.getContactpersonPlaceholderLocale = function(){
        if($scope.getMaximalNumberOfContactpersons() > 1){
          return $filter('eloLocales')('SOL.KNOWLEDGE.EDITPOST.CONTACTPERSONS.PLACEHOLDER', $scope.getMaximalNumberOfContactpersons());
        }else{
          return api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.CONTACTPERSONS.PLACEHOLDER.SINGULAR');
        };
      };

      $scope.getAuthorPlaceholderLocale = function(){
        if($scope.getMaximalNumberOfAuthors() > 1){
          return $filter('eloLocales')('SOL.KNOWLEDGE.EDITPOST.AUTHORS.PLACEHOLDER', $scope.getMaximalNumberOfAuthors());
        }else{
          return api.helpers.Text.getText('SOL.KNOWLEDGE.EDITPOST.AUTHORS.PLACEHOLDER.SINGULAR');
        };
      };


      $scope.checkURL = function () {
        var promise,
          promise2,
          lang;
        if ($scope.initializeDone && ($rootScope.initCount >= 3 && !$scope.URLLoaded)) {
          $scope.URLLoaded = true;
          if (!!$routeParams.guid || !!$routeParams.type) {
            $scope.languagesActivated = baseProvider.checkLanguagesActivated();
            if ($routeParams.guid && $routeParams.guid.match("^[{(]?[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$")) {
              $scope.mainGuid = $routeParams.guid;
              promise = postProvider.loadMainPost($routeParams.guid, true);
              promise.then(
                function success(result) {
                  var board,
                    subject;
                  $scope.editpost = result.sord;
                  $scope.teaserImageGuid = (result.sord.objKeys || {}).KNOWLEDGE_POST_TEASER_IMAGE;
                  $scope.shouldRemoveTeaserImage = false;
                  $scope.childPosts = [];
                  $scope.$broadcast('solEditorAutoSaveEnable');
                  $scope.childPosts = [];
                  $scope.childPostsOriginal = [];
                  if ($scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE === "GUIDE") {
                    promise2 = postProvider.loadChildPosts($routeParams.guid);

                    // TODO : Fix shadowed variable
                    // eslint-disable-next-line no-shadow
                    promise2.then(
                      function (result) {
                        var i;

                        // NOTE: This part is recurring, move to services
                        for (i = 0; i < result.sords.length; i++) {
                          result.sords[i].objKeys = {};
                          $scope.childPostsOriginal.push(result.sords[i].guid);
                          angular.forEach(
                            result.sords[i],
                            function (index, value, key) {
                              if (key.indexOf("O_") === 0) {
                                result.sords[index].objKeys[key.substring(2)] = value;
                              }
                            }.bind(null, i));
                        }
                        $scope.childPosts = result.sords;
                      },
                      function error(err) {
                        errorProvider.checkError(err);
                      });
                  }

                  board = filterProvider.getBoard();
                  if (!board || board !== $scope.editpost.objKeys.KNOWLEDGE_BOARD_REFERENCE) {
                    if (!!$scope.editpost.objKeys.KNOWLEDGE_BOARD_REFERENCE) {
                      filterProvider.setBoard($scope.editpost.objKeys.KNOWLEDGE_BOARD_REFERENCE);
                    }
                  }
                  if (!result.access.post.w) {
                    $location.path('/post/' + $routeParams.guid);
                  }

                  subject = result.sord.objKeys.KNOWLEDGE_POST_SUBJECT;
                  if (subject.length > 50) {
                    subject = subject.substring(0, 50) + '...';
                  }
                  $window.document.title = subject + " | " + baseProvider.getBoardName();
                  $scope.editpost.type = getPostType(result.sord.objKeys.KNOWLEDGE_POST_TYPE);
                  $scope.topics = getKnowledgeTopics(result);
                  $scope.topicNames = $scope.topics.map(function (topic) {
                    return topic.text;
                  });
                  $scope.loadSpaceList($scope.editpost.type);
                  $scope.loadLanguageList();
                  $scope.selectedSpace = $scope.editpost.objKeys.KNOWLEDGE_SPACE_REFERENCE;
                  $scope.isNewPost = false;
                  $scope.loading = false;
                  $scope.pins = {};
                  $scope.pins.boardPin = (result.sord.objKeys.KNOWLEDGE_PINNED_AT.indexOf('board') > -1);
                  $scope.pins.spacePin = (result.sord.objKeys.KNOWLEDGE_PINNED_AT.indexOf('space') > -1);
                  $scope.labels = baseProvider.getLabels(result.sord.objKeys.KNOWLEDGE_CONTENT_TYPE, result.sord.objKeys.KNOWLEDGE_POST_TYPE);

                  $scope.authors = ($scope.editpost.objKeys.KNOWLEDGE_POST_AUTHORS_IDS || [])
                    .map(function (id, index) {
                      return {
                        id: id,
                        name: $scope.editpost.objKeys.KNOWLEDGE_POST_AUTHORS[index]
                      }
                    });

                  $scope.contactpersons = ($scope.editpost.objKeys.KNOWLEDGE_POST_CONTACTPERSONS_IDS || [])
                    .map(function (id, index) {
                      return {
                        id: id,
                        name: $scope.editpost.objKeys.KNOWLEDGE_POST_CONTACTPERSONS[index]
                      }
                    });

                  $scope.spaceRights = result.access.space;

                  $scope.data = {
                    id: $scope.isNewPost ? api.userId : $scope.editpost.ownerId,
                    name: $scope.isNewPost ? api.userName : $scope.editpost.ownerName
                  };
                },
                function error(err) {
                  errorProvider.checkError(err);
                });
            } else if ($routeParams.type && !!baseProvider.getPostTypeProperty($routeParams.type)) {
              var i, topicfilter;

              $window.document.title = baseProvider.getPostTypeLocaleField(getPostType($routeParams.type), 'LOCALE_POST_NEWLABEL') + " | " + baseProvider.getBoardName();
              $scope.editpost = $scope.editpost || {};
              $scope.editpost.desc = baseProvider.getPostTypeDescription($routeParams.type);
              $scope.topics = [];
              $scope.topicNames = $scope.topics.map(function (topic) { return topic.text; });
              topicfilter = filterProvider.getTopic();
              for (i = 0; i < topicfilter.length; i++) {
                $scope.topics.push({ text: topicfilter[i] });
              }
              $scope.editpost.objKeys = $scope.editpost.objKeys || {};
              $scope.editpost.objKeys.KNOWLEDGE_POST_SUBJECT = "";
              $scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE = baseProvider.getContentType($routeParams.type);
              $scope.editpost.objKeys.KNOWLEDGE_POST_TYPE = $routeParams.type;
              $scope.labels = baseProvider.getLabels($scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE, $scope.editpost.objKeys.KNOWLEDGE_POST_TYPE);
              $scope.editpost.objKeys.KNOWLEDGE_LABEL = $scope.labels.length > 0 ? $scope.labels[0].key : "";
              if ($scope.languagesActivated) {
                lang = api.helpers.Text.getLanguage();
                $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE = baseProvider.checkAllowedLanguage(lang) ? lang : baseProvider.getDefaultLanguage();
              } else {
                $scope.editpost.objKeys.KNOWLEDGE_LANGUAGE = baseProvider.getDefaultLanguage();
              }
              $scope.editpost.type = getPostType($routeParams.type);
              $scope.loadSpaceList($scope.editpost.type);
              $scope.loadLanguageList();
              $scope.selectedSpace = filterProvider.getSpace();
              if (!!$scope.selectedSpace) {
                $scope.spaceButton = $scope.getSpacesVisibleName($scope.selectedSpace);
                $scope.spaceButtonTag = $scope.selectedSpace;
                $scope.spaceRights = baseProvider.getSpacesRights($scope.selectedSpace);
              }
              $scope.data = { id: api.userId, name: api.userName };
              $scope.childPosts = [];
              $scope.childPostsOriginal = [];
              $scope.isNewPost = true;
              $scope.loading = false;
              $scope.pins = {};
              $scope.pins.boardPin = false;
              $scope.pins.spacePin = $scope.editpost.objKeys.KNOWLEDGE_CONTENT_TYPE === 'GUIDE' ? true : false;
              $scope.authors = [];
              $scope.contactpersons = [];
            } else {
              $location.path('/error/9999');
            }
          }
        }
      };

      $scope.checkURL();

      $scope.$watch('topics', function (newValue, oldValue) {
        $scope.loadSuggestedTopics();
      }, true);

      $rootScope.$watch('initCount', function (newValue, oldValue) {
        if (newValue === 3) {
          $scope.currentPage = filterProvider.getPage();
          $scope.shownPage = baseProvider.getShownPage();
          $scope.postPerPage = baseProvider.getPostPerPage();
          $scope.initializeDone = true;
          $scope.checkURL();
        }
      });

      $scope.$on("solEditorLoaded", function () {
        if($scope.authors && $scope.authors.length === 0){
          $scope.authors.push($scope.data);
        }
        $scope.$broadcast('solEditorAutoSaveEnable');
      });

      $scope.$on("$destroy", function () {
        solKnowledgeUploadWatcher();
        solKnowledgeDeleteWatcher();
        solKnowledgeUploadErrorWatcher();
        solKnowledgeUploadClearGUIDsWatcher();
        solKnowledgeReloadConfigWatcher();
        solKnowledgeChangeBoardOrSpaceWatcher();
      });
    }
  ]);
}());
