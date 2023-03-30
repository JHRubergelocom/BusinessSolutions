// eslint-disable-next-line no-unused-vars
/*globals angular, elo, sol, api, console, moment, require */
(function () {
  "use strict";
  angular.module(sol.common.apps.name)
    .factory('postProvider', postProviderFactory);

  postProviderFactory.$inject = ['$q', '$log', '$rootScope', '$injector', 'baseProvider'];
  function postProviderFactory($q, $log, $rootScope, $injector, baseProvider) {
    var LOADER_CLASSNAME = sol.common.apps.name + '.PostProvider';
    sol.define(LOADER_CLASSNAME, {

      loadMainPost: function (guid, isReload) {
        var me = this,
            deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Get",
          {
            objId: guid,
            isReload: isReload || false
          },
          function (data) {
            me.setCurrentPost(data);
            deferred.resolve(data);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      setCurrentPost: function(post) {
        var me = this;
        
        me.currentPost = post;
        (me.currentPostSubscriptions || [])
          .forEach(function(subscription) {
            subscription(post);
          })
      },

      getCurrentPost: function() {
        var me = this;

        return me.currentPost;
      },

      subscribeCurrentPost: function(subscription) {
        var me = this;
        me.currentPostSubscriptions = me.currentPostSubscriptions || [];
        me.currentPostSubscriptions.push(subscription);
      },

      loadChildPosts: function (guid) {
        var deferred;
        deferred = $q.defer();
        
        sol.common.IxUtils.execute(
          "RF_sol_knowledge_service_ChildrenDataCollector",
          {
            parentId: guid,
            formatter: "sol.common.ObjectFormatter.StatisticSord",
            sordKeys: baseProvider.getSordKeys(),
            objKeys: baseProvider.getObjKeys(),
            filter: [{ key: "SOL_TYPE", val: "KNOWLEDGE_POST" }]
          },
          function (data) {
            (data.sords || [])
              .forEach(function(childPost) {
                if(!Array.isArray(childPost.O_KNOWLEDGE_POST_AUTHORS_IDS)) {
                  childPost.O_KNOWLEDGE_POST_AUTHORS_IDS = childPost.O_KNOWLEDGE_POST_AUTHORS_IDS 
                  ? childPost.O_KNOWLEDGE_POST_AUTHORS_IDS.split("¶")
                  : [];
                }
              })
            deferred.resolve(data);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      loadLinkedPosts: function (objId, maxUsers, maxRelatedPosts, filterLangs) {
        var me = this,
          deferred = $q.defer();

        // objKeys werden hier aus der config genommen. Dort müssen sie auch gegebenenfalls erweitert werden
        sol.common.IxUtils.execute("RF_sol_knowledge_services_GetLinkedPosts",
          {
            objId: objId
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

      loadAdditionInfo: function (postId, maxUsers, maxRelatedPosts, filterLangs) {
        var me = this,
          deferred, filter, boardFilter = [], spaceFilter = [];
        deferred = $q.defer();

        if (!me.baseProvider) {
          me.baseProvider = $injector.get('baseProvider');
        }
        if (!me.filterProvider) {
          me.filterProvider = $injector.get('filterProvider');
        }
        boardFilter.push(me.filterProvider.getBoard());
        spaceFilter.push(me.filterProvider.getSpace());
        filter = [];
        if (!!boardFilter) {
          filter.push({ type: 'FIELD_OBJ_KEY', key: 'KNOWLEDGE_BOARD_REFERENCE', values: boardFilter });
        } else if (!!spaceFilter && me.baseProvider.countBoards > 0 && me.baseProvider.checkSingleSpace(spaceFilter)) {
          filter.push({ type: 'FIELD_OBJ_KEY', key: 'KNOWLEDGE_SPACE_REFERENCE', values: spaceFilter });
        }

        // objKeys werden hier aus der config genommen. Dort müssen sie auch gegebenenfalls erweitert werden
        sol.common.IxUtils.execute("RF_sol_knowledge_services_GetAdditionalInfo",
          {
            postObjId: postId,
            maxUsers: maxUsers,
            maxRelatedPosts: maxRelatedPosts,
            filterLangs: filterLangs,
            filter: filter
          },
          function (data) {
            $rootScope.searchValid = true;
            deferred.resolve(data);
          },
          function (err) {
            $rootScope.searchValid = false;
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      createNewPost: function (type, subject, content, label, spaceFolderId, topics, allUploadGUIDs, allDeletedGUIDs, lang,
        createReferences, deleteReferences, newPins, teaserImageGuid, removeTeaserImage, authors, contactpersons) {
        var me = this,
          deferred;

        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Create",
          {
            type: type,
            subject: subject,
            content: content,
            label: label,
            spaceFolderId: spaceFolderId,
            topics: topics,
            createdFiles: allUploadGUIDs,
            deletedFiles: allDeletedGUIDs,
            createReferences: createReferences,
            deleteReferences: deleteReferences,
            pinnedAt: newPins,
            lang: lang,
            teaserImageGuid: teaserImageGuid,
            removeTeaserImage: removeTeaserImage
          },
          function (data) {
            me.setAuthors(data.guid, authors)
              .then(function() {
                me.setContactpersons(data.guid, contactpersons)
                  .then(function() {
                    deferred.resolve(data);
                  })
              })
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      editPost: function (guid, subject, content, label, topics, allUploadGUIDs, allDeletedGUIDs, lang, elementMoved, 
        childPosts, createReferences, deleteReferences, newPins, teaserImageGuid, removeTeaserImage, 
        authors, contactpersons) {
        var me = this,
          deferred;

        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Edit",
          {
            objId: guid,
            subject: subject,
            content: content,
            label: label,
            topics: topics,
            createdFiles: allUploadGUIDs,
            deletedFiles: allDeletedGUIDs,
            elementMoved: elementMoved,
            childPosts: childPosts,
            createReferences: createReferences,
            deleteReferences: deleteReferences,
            pinnedAt: newPins,
            lang: lang,
            teaserImageGuid: teaserImageGuid,
            removeTeaserImage: removeTeaserImage
          },
          function (data) {
            me.setAuthors(guid, authors)
              .then(function() {
                me.setContactpersons(guid, contactpersons)
                  .then(function() {
                    deferred.resolve(data);
                  })
              })
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
      },

      openPost: function (guid) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Open",
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

      closePost: function (guid) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Closed",
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

      setLabel: function (guid, label) {

        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_SetLabel",
          {
            objId: guid,
            label: label
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

      setAuthors: function (guid, authors) {
        var deferred = $q.defer();

        sol.common.IxUtils.execute(
          "RF_sol_knowledge_service_Post_SetAuthors",
          {
            objId: guid,
            authors: authors
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

      setContactpersons: function (guid, contactpersons) {
        var deferred = $q.defer();

        sol.common.IxUtils.execute(
          "RF_sol_knowledge_service_Post_SetContactpersons",
          {
            objId: guid,
            contactpersons: contactpersons
          },
          function (data) {
            deferred.resolve(data);
          },
          function (err) {
            deferred.resolve();
          }
        );
        return deferred.promise;
      },

      removePost: function (guid) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Delete",
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

      changePostType: function (guid, type, solutionId) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_ChangeType",
          {
            objId: guid,
            type: type,
            solutionId: solutionId
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

      moveToSpace: function (guid, spaceId, comment, changeDate) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Post_Move",
          {
            postGuid: guid,
            spaceGuid: spaceId,
            comment: comment,
            changeDate: changeDate
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

      linkPost: function (guid, linkPosts, unlinkPosts) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute("RF_sol_knowledge_service_Link_Posts",
          {
            fromPostGuid: guid,
            toPostGuids: linkPosts,
            unlinkPostGuids: unlinkPosts
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

      pinPost: function (guid, pins) {
        var deferred;
        deferred = $q.defer();

        sol.common.IxUtils.execute(
          "RF_sol_function_Set",
          {
            objId: guid,
            entries: pins
          },
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
