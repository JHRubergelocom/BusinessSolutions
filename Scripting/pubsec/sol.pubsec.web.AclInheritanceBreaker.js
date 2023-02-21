
api.require({
  namespace: ["sol"]
}, function () {

  sol.define("sol.pubsec.web.AclInheritanceBreaker", {
    singleton: true,

    initialize: function (config) {
      var me = this;
      me.$super("sol.Base", "initialize", [config]);
      me.ACL_CACHE = {};
      me.enabled = false;
      sol.common.IxUtils.execute(
        "RF_sol_pubsec_service_FilingPlanAclChange_Enabled",
        {},
        function (checkResult) {
          me.enabled = (checkResult && (checkResult.enabled === true)) ? true : false;
        },
        function (ex) {
          console.error(ex);
        }
      );
    },

    onShow: function (scope, state) {
      if (sol.pubsec.web.AclInheritanceBreaker.isEnabled(state)) {
        console.log("AclInheritanceBreaker is enabled: remember initial ACL");
        sol.pubsec.web.AclInheritanceBreaker.rememberAcl(state.sord.get("guid"), state.sord.get("aclItems"));
      }
    },

    onSave: function (scope, state, syncEvent) {
      var finish, guid, previousAcl;

      finish = function () {
        syncEvent.setSuccess(true);
      };

      if (!sol.pubsec.web.AclInheritanceBreaker.isEnabled(state)) {
        finish();
      }

      guid = state.sord.get("guid");
      previousAcl = sol.pubsec.web.AclInheritanceBreaker.retrieveAcl(guid);
      sol.pubsec.web.AclInheritanceBreaker.cleanupAclCache(guid);

      if (!previousAcl) {
        finish();
      }

      sol.pubsec.web.AclInheritanceBreaker.checkFilingPlanAclChangeEnabled(state, previousAcl)
        .then(sol.pubsec.web.AclInheritanceBreaker.calcAclChanges)
        .then(sol.pubsec.web.AclInheritanceBreaker.registerAclUpdate)
        .then(finish)
        .catch(finish);

    },

    isEnabled: function (state) {
      var me = this;
      return me.enabled && state && state.sord && (state.sord.get("id") > -1);
    },

    /**
     * @private
     * @param {String} guid
     * @param {de.elo.ix.client.AclItem[]} acl
     */
    rememberAcl: function (guid, acl) {
      var me = this;
      me.ACL_CACHE[guid] = acl;
    },

    /**
     * @private
     * @param {String} guid
     */
    cleanupAclCache: function (guid) {
      var me = this;
      if (me.ACL_CACHE[guid]) {
        delete me.ACL_CACHE[guid];
      }
    },

    /**
     * @private
     * @param {String} guid
     * @return {de.elo.ix.client.AclItem[]}
     */
    retrieveAcl: function (guid) {
      var me = this;
      return me.ACL_CACHE[guid] || null;
    },

    /**
     * @private
     * @param {de.elo.ix.client.AclItem[]} aclItems
     * @return {String[]}
     */
    convertToJson: function (aclItems) {
      var jsonAclItems = [];
      if (aclItems && (aclItems.length > 0)) {
        aclItems.forEach(function (aclItem) {
          jsonAclItems.push(JSON.stringify({
            access: aclItem.access,
            id: aclItem.id,
            name: aclItem.name,
            type: aclItem.type,
            changedMembers: aclItem.changedMembers
          }));
        });
      }
      return jsonAclItems;
    },

    /**
     * @private
     * @param {Object} state
     * @param {Object[]} previousAcl
     * @return {Promise}
     */
    checkFilingPlanAclChangeEnabled: function (state, previousAcl) {
      var currentAcl;

      return new Promise(function (resolve, reject) {
        sol.common.IxUtils.execute(
          "RF_sol_pubsec_service_FilingPlanAclChange_Enabled",
          { objId: String(state.sord.get("id")) },
          function (checkResult) {
            if (checkResult && (checkResult.enabled === true)) {
              console.log("AclInheritanceBreaker is enabled: start custom ACL inheritance");

              currentAcl = state.sord.get("aclItems");

              resolve({ objId: String(state.sord.get("id")), previousAcl: previousAcl, currentAcl: currentAcl });
              state.sord.set("aclItems", previousAcl);
            } else {
              reject();
            }
          },
          function (ex) {
            console.error(ex);
            reject();
          }
        );
      });
    },

    /**
     * @private
     * @param {Object} params
     * @param {String} params.objId
     * @param {de.elo.ix.client.AclItem[]} params.previousAcl
     * @param {de.elo.ix.client.AclItem[]} params.currentAcl
     * @return {Promise}
     */
    calcAclChanges: function (params) {
      return new Promise(function (resolve, reject) {
        api.Webclient.getIXConnection().ix().combineAcl(params.previousAcl, params.currentAcl, null, function (combineResult) {
          var addedAcl, removedAcl;
          addedAcl = combineResult.inverseDifference;
          removedAcl = combineResult.difference;
          resolve({
            objId: params.objId,
            addedAcl: sol.pubsec.web.AclInheritanceBreaker.convertToJson(addedAcl),
            removedAcl: sol.pubsec.web.AclInheritanceBreaker.convertToJson(removedAcl)
          });
        });
      });
    },

    /**
     * @private
     * @param {Object} params
     * @param {String} params.objId
     * @param {String[]} params.addedAcl
     * @param {String[]} params.removedAcl
     * @return {Promise}
     */
    registerAclUpdate: function (params) {
      return new Promise(function (resolve, reject) {
        sol.common.IxUtils.execute(
          "RF_sol_pubsec_service_RegisterFilingPlanAclChange",
          { startObjId: params.objId, aclChanges: { addedAcl: params.addedAcl, removedAcl: params.removedAcl } },
          function (result) {
            console.log("ACL change registered");
            resolve();
          },
          function (ex) {
            console.error(ex);
            reject();
          }
        );
      });
    }

  });

  api.EventManager.addComponentListener("CMP_INDEXEDIT", "onShow", sol.pubsec.web.AclInheritanceBreaker.onShow);
  api.EventManager.addComponentListener("CMP_INDEXEDIT", "onSave", sol.pubsec.web.AclInheritanceBreaker.onSave, true);
});

//# sourceURL=sol.pubsec.web.AclInheritanceBreaker.js
