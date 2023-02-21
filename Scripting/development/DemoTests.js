de.elo.ix.client.initPromiseDefaultImpl();
/**
 * This class contains convinience methods for working with UnitTest.
 *
 * @author JHR, ELO Digital Office GmbH
 * @version 1.0
 *
 * @eloall
 */
sol.define("test.Utils", {
  singleton: true,

  bom: "\uFEFF", // ByteOrderMark (BOM);

  /**
   * @private
   * @property {Integer} TESTROOT Rootfolder for temporary objects
   */
  TESTROOT: 0,

  /**
   * @private
   * @property {String} TESTNAME Default name for sord Objects
   */
  TESTNAME: "_ELO Business Solution Unit Test",

  /**
   * @private
   * @property {String} TESTTEMPPATH Temp path for test sord Objects
   */
  TESTTEMPFOLDER: "ARCPATH:/_TestTemp",

  CONST: {
    EVENT_TYPES: {
      ACTION: "ACTION",
      REFRESH: "REFRESH",
      GOTO: "GOTO",
      SELECT: "SELECT",
      VIEW: "VIEW",
      DIALOG: "DIALOG",
      ERROR: "ERROR",
      FEEDBACK: "FEEDBACK"
    },
    COMPONENTS: {
      IX: "IX",
      AS: "AS"
    }
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#   AclUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {de.elo.ix.client.AclItem[]} newAclList
   * @return {Promise} promise
   */
  addSordRights: function (sord, newAclList) {
    var ix = elo.IX.ix(),
        oldAclList = sord.aclItems,
        promise, promisecombineAcl, promiseCheckInSord;

    promise = new Promise (function (resolve, reject) {
      promisecombineAcl = ix.combineAcl(oldAclList, newAclList, null);
      promisecombineAcl.then(function success(combineAclResult) {
        try {
          sord.aclItems = combineAclResult.sum;
          promiseCheckInSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
          promiseCheckInSord.then(function success1(checkinSordResult) {
            try {
              resolve(checkinSordResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Adds rights to an archive entry/entries.
   *
   * The following example grants read and write rights to the users "baum" and "renz" on exactly one object
   *
   *     addRights(
   *       "4711",
   *       ["baum, renz"],
   *       { r: true, w: true, d: false, e: false, l: false, p: false},
   *       true
   *     );
   *
   * @param {String} objId The object which should be edited (if config has a `recursive` flag set to `true`, this object will be the starting point)
   * @param {String[]} users Array with user names, which should recive the new rights, if empty, all existing ACL entries will be edited
   * @param {Object} rights Object with flags for each right that should be added
   * @param {Boolean} recursive command (see config parameter) this is the starting point from which all sub-elements will ne processed.
   * @return {Promise} promise
   */
  addRights: function (objId, users, rights, recursive) {
    var me = this,
        accessCode,
        promise, promiseRetrieveUserAcl, promiseRetrieveElements,
        promisesAddSordRights, promiseAddSordRights;

    promise = new Promise (function (resolve, reject) {
      accessCode = me.createAccessCode(rights);
      promiseRetrieveUserAcl = me.retrieveUserAcl(users, accessCode);
      promiseRetrieveUserAcl.then(function success(userAcl) {
        try {
          promiseRetrieveElements = me.retrieveElements(objId, recursive);
          promiseRetrieveElements.then(function success1(elements) {
            try {
              promisesAddSordRights = [];
              elements.forEach(function (sord) {
                promiseAddSordRights = me.addSordRights(sord, userAcl);
                promiseAddSordRights.then(function success2(addSordRightsResult) {
                  try {
                    resolve(addSordRightsResult);
                  } catch (ex) {
                    reject(ex);
                  }
                }, function error(err) {
                  reject(err);
                });
                promisesAddSordRights.push(promiseAddSordRights);
              });
              Promise.all(promisesAddSordRights).then(function success2(allResult) {
                try {
                  resolve(allResult);
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Compare rights from two archive entry/entries.
   *
   * The following example will remove all rights (exept for read) for all users, having access to the object (and all sub-objects)
   * and store the original right to an map field (OLC_ACL) for a later restore.
   *
   *     compareRights("4711", "4713");
   *
   * @param {String} objId1 The object1
   * @param {String} objId2 The object2
   * return {Number} Compare result.  Negative if ACL object1 is less than object2. Posiitve if ACL object1 is greater than object2. Zero if ACLs are equal.
   * @return {Promise} promise
   */
  compareRights: function (objId1, objId2) {
    var ix = elo.IX.ix(),
        sord1, sord2,
        promise, promiseSord1, promiseSord2, promiseCombineAcl,
        compareCode;

    promise = new Promise (function (resolve, reject) {
      promiseSord1 = ix.checkoutSord(objId1, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
      promiseSord1.then(function success(sord11) {
        try {
          sord1 = sord11;
          promiseSord2 = ix.checkoutSord(objId2, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
          promiseSord2.then(function success1(sord22) {
            try {
              sord2 = sord22;
              promiseCombineAcl = ix.combineAcl(sord1.aclItems, sord2.aclItems, null);
              promiseCombineAcl.then(function success2(combineAclResult) {
                try {
                  compareCode = combineAclResult.compareCode;
                  resolve(compareCode);
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * @private
   * @param {Object} rights
   * @return {Number}
   */
  createAccessCode: function (rights) {
    var code = 0;
    if (!rights) {
      console.error("Rights are empty");
      throw "Rights are empty";
    }

    if ((rights.read === true) || (rights.r === true)) {
      code |= elo.CONST.ACCESS.LUR_READ;
    }
    if ((rights.write === true) || (rights.w === true)) {
      code |= elo.CONST.ACCESS.LUR_WRITE;
    }
    if ((rights.del === true) || (rights.d === true)) {
      code |= elo.CONST.ACCESS.LUR_DELETE;
    }
    if ((rights.edit === true) || (rights.e === true)) {
      code |= elo.CONST.ACCESS.LUR_EDIT;
    }
    if ((rights.list === true) || (rights.l === true)) {
      code |= elo.CONST.ACCESS.LUR_LIST;
    }
    if ((elo.CONST.ACCESS.LUR_PERMISSION !== "undefined") && ((rights.perm === true) || (rights.p === true))) { // additional check is necessary if property does not exist (prior to ELO12)
      code |= elo.CONST.ACCESS.LUR_PERMISSION;
    }
    return code;
  },

  /**
   * @private
   * @param {de.elo.ix.client.UserInfo} userInfo
   * @param {Number} accessCode
   * @return {de.elo.ix.client.AclItem}
   */
  createAclItemFromUserInfo: function (userInfo, accessCode) {
    var aclItem = new de.elo.ix.client.AclItem();
    aclItem.id = userInfo.id;
    aclItem.type = (userInfo.type == elo.CONST.USER_INFO.TYPE_GROUP) ? elo.CONST.ACL_ITEM.TYPE_GROUP : elo.CONST.ACL_ITEM.TYPE_USER;
    aclItem.access = accessCode;
    return aclItem;
  },

  /**
   * @private
   * @param {de.elo.ix.client.Sord} sord
   * @param {de.elo.ix.client.AclItem[]} newAclList
   * @return {Promise} promise
   */
  removeSordRights: function (sord, newAclList) {
    var ix = elo.IX.ix(),
        oldAclList = sord.aclItems,
        promise, promisecombineAcl, promiseCheckInSord;

    promise = new Promise (function (resolve, reject) {
      promisecombineAcl = ix.combineAcl(oldAclList, newAclList, null);
      promisecombineAcl.then(function success(combineAclResult) {
        try {
          sord.aclItems = combineAclResult.difference;
          promiseCheckInSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
          promiseCheckInSord.then(function success1(checkinSordResult) {
            try {
              resolve(checkinSordResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Removes rights from an archive entry/entries.
   *
   * The following example will remove all rights (exept for read) for all users, having access to the object (and all sub-objects)
   * and store the original right to an map field (OLC_ACL) for a later restore.
   *
   *     removeRights(
   *       "4711",
   *       [],
   *       { read: false, write: true, del: true, edit: true, list: true, perm: true},
   *       true
   *     );
   *
   * @param {String} objId The object which should be edited (if config has a `recursive` flag set to `true`, this object will be the starting point)
   * @param {String[]} users Array with user names, which should recieve the new rights, if empty, all existing ACL entries will be edited
   * @param {Object} rights Object with flags for each right that should be removed
   * @param {Boolean} recursive command (see config parameter) this is the starting point from which all sub-elements will ne processed.
   * @return {Promise} promise
   */
  removeRights: function (objId, users, rights, recursive) {
    var me = this,
        accessCode,
        promise, promiseRetrieveUserAcl, promiseRetrieveElements,
        promisesRemoveSordRights, promiseRemoveSordRights;

    promise = new Promise (function (resolve, reject) {
      // for backwards compatibility: remove p-right if nothing is specified
      if (!rights.hasOwnProperty("perm") && !rights.hasOwnProperty("p")) {
        rights.p = true;
      }
      accessCode = me.createAccessCode(rights);
      promiseRetrieveUserAcl = me.retrieveUserAcl(users, accessCode);
      promiseRetrieveUserAcl.then(function success(userAcl) {
        try {
          promiseRetrieveElements = me.retrieveElements(objId, recursive);
          promiseRetrieveElements.then(function success1(elements) {
            try {
              promisesRemoveSordRights = [];
              elements.forEach(function (sord) {
                promiseRemoveSordRights = me.removeSordRights(sord, userAcl);
                promiseRemoveSordRights.then(function success2(removeSordRightsResult) {
                  try {
                    resolve(removeSordRightsResult);
                  } catch (ex) {
                    reject(ex);
                  }
                }, function error(err) {
                  reject(err);
                });
                promisesRemoveSordRights.push(promiseRemoveSordRights);
              });
              Promise.all(promisesRemoveSordRights).then(function success2(allResult) {
                try {
                  resolve(allResult);
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * @private
   * @param {String[]|Object[]} users If this contains strings, they serve as user names. If it contains objects, they have to contain a `name` property and an `rights` object
   * @param {Number} accessCode
   * return {de.elo.ix.client.AclItem[]}
   * @return {Promise} promise
   */
  retrieveUserAcl: function (users, accessCode) {
    var me = this,
        ix = elo.IX.ix(),
        userAcl, ua,
        promise, promiseCheckOutUsers;

    promise = new Promise (function (resolve, reject) {
      if (users && users.length > 0) {
        userAcl = [];
        promiseCheckOutUsers = ix.checkoutUsers(users, elo.CONST.CHECKOUT_USERS.BY_IDS, elo.CONST.LOCK.NO);
        promiseCheckOutUsers.then(function success(userInfos) {
          try {
            userInfos.forEach(function (userInfo) {
              ua = me.createAclItemFromUserInfo(userInfo, accessCode);
              userAcl.push(ua);
            });
            resolve(userAcl);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      } else {
        resolve(null);
      }
    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#    AsUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Executes an ELOas ruleset and handles the response in a standardized way.
   *
   * If spezial handling is needed a custom callback can be spezified as parameter.
   * This callback get's the result Object of the registered function as only parameter.
   *
   * Executes an ELO AS Business Solution action without the need of running an ELO AS instance in the DMZ.
   *
   * This service is useful if AS actions should be executed from web applications (e.g. ELO Web Client).
   *
   * # Configuration
   *
   * requires the solution name and rule name. A configuration object can be passed
   * as defined by the action. e.g.
   *
   *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
   *       solution: 'pubsec',
   *       action: 'sol.pubsec.as.actions.CreateFilesReport',
   *       config: {
   *         templateId: templateId,
   *         fileId: fileId,
   *         targetId: targetId
   *       }
   *     }, function(data) {
   *        // process result
   *     }, function (err) {
   *        // error handling
   *     });
   *
   * @param {String} solution Name used to determine the ELOas configuration (see {@link sol.common.Config#loadEloAsConfig loadEloAsConfig})
   * @param {String} action
   * @param {Object} params (optional) The configuration object which will be send to the ELOas rule as PARAM2 (JSON String)
   * @param {Object[]} jsonResults Array of previous handle events
   * @return {Object[]} jsonResults. Array with updated handle events
   */
  _executeASActionHandler: function (solution, action, params, jsonResults) {
    var me = this,
        resultObj;

    resultObj = me.execute("RF_sol_common_service_ExecuteAsAction", {
      solution: solution,
      action: action,
      config: params
    }, function (resultObj) {
      if (resultObj && resultObj.content) {
        try {
          resultObj = JSON.parse(resultObj.content);
        } catch (ex) {
          if (!resultObj.events) {
            console.error(resultObj);
            api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden.");
            return;
          }
        }
      }
      if (resultObj && resultObj.events && resultObj.events.length > 0 && resultObj.events[0].ID && resultObj.events[0].ID === "ERROR") {
        // handle IX Exceptions
        console.error(resultObj);
        if (resultObj.events[0].obj && resultObj.events[0].obj.msg) {
          var error = resultObj.events[0].obj.msg;
          api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden. " + error);
        }
        return;
      }
      if (resultObj && resultObj.events) {
        return me.handleEvents(resultObj.events);
        // loading indicator is hidden by event handler
      }
    }, function (err) {
      // error
      api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden.");
      console.error(err);
    });
    if (resultObj) {
      console.info("resultObj", resultObj);
      try {
        resultObj = JSON.parse(resultObj.content) || {};
      } catch (ex) {
        console.error(resultObj);
        console.error("Ungültige Rückgabe aus AS. Aktion konnte nicht ausgeführt werden.");
        return jsonResults;
      }

      if (resultObj.events && (resultObj.events.length > 0)) {
        resultObj.events.forEach(function (event) {
          event.solutionName = solution;
        });
      }
      jsonResults.push(resultObj);
    }
    return jsonResults;
  },

  /**
   * Executes an ELOas ruleset and handles the response in a standardized way.
   *
   * If spezial handling is needed a custom callback can be spezified as parameter.
   * This callback get's the result Object of the registered function as only parameter.
   *
   * Executes an ELO AS Business Solution action without the need of running an ELO AS instance in the DMZ.
   *
   * This service is useful if AS actions should be executed from web applications (e.g. ELO Web Client).
   *
   * # Configuration
   *
   * requires the solution name and rule name. A configuration object can be passed
   * as defined by the action. e.g.
   *
   *     sol.common.IxUtils.execute('RF_sol_common_service_ExecuteAsAction', {
   *       solution: 'pubsec',
   *       action: 'sol.pubsec.as.actions.CreateFilesReport',
   *       config: {
   *         templateId: templateId,
   *         fileId: fileId,
   *         targetId: targetId
   *       }
   *     }, function(data) {
   *        // process result
   *     }, function (err) {
   *        // error handling
   *     });
   *
   * @param {String} solution Name used to determine the ELOas configuration (see {@link sol.common.Config#loadEloAsConfig loadEloAsConfig})
   * @param {String} action
   * @param {Object} params (optional) The configuration object which will be send to the ELOas rule as PARAM2 (JSON String)
   * @param {Object[]} jsonResults Array of previous handle events
   * return {Object[]} jsonResults. Array with updated handle events
   * @return {Promise} promise
   */
  executeASActionHandler: function (solution, action, params, jsonResults) {
    var me = this,
        promise, promiseExecute;


    promise = new Promise (function (resolve, reject) {
      try {
        promiseExecute = me.execute("RF_sol_common_service_ExecuteAsAction", {
          solution: solution,
          action: action,
          config: params
        }, function (resultObj) {
          if (resultObj && resultObj.content) {
            try {
              resultObj = JSON.parse(resultObj.content);
            } catch (ex) {
              if (!resultObj.events) {
                console.error(resultObj);
                api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden.");
                return;
              }
            }
          }
          if (resultObj && resultObj.events && resultObj.events.length > 0 && resultObj.events[0].ID && resultObj.events[0].ID === "ERROR") {
            // handle IX Exceptions
            console.error(resultObj);
            if (resultObj.events[0].obj && resultObj.events[0].obj.msg) {
              var error = resultObj.events[0].obj.msg;
              api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden. " + error);
            }
            return;
          }
          if (resultObj && resultObj.events) {
            return me.handleEvents(resultObj.events);
            // loading indicator is hidden by event handler
          }
        }, function (err) {
          // error
          api.Webclient.alert("Unerwarteter Fehler", "Aktion konnte nicht ausgeführt werden.");
          console.error(err);
        });
        promiseExecute.then(function success(resultObj) {
          try {
            if (resultObj) {
              console.info("resultObj", resultObj);
              try {
                resultObj = JSON.parse(resultObj.content) || {};
              } catch (ex) {
                console.error(resultObj);
                console.error("Ungültige Rückgabe aus AS. Aktion konnte nicht ausgeführt werden.");
                resolve(jsonResults);
              }

              if (resultObj.events && (resultObj.events.length > 0)) {
                resultObj.events.forEach(function (event) {
                  event.solutionName = solution;
                });
              }
              jsonResults.push(resultObj);
            }
            resolve(jsonResults);
          } catch (ex) {
            console.error(ex);
            reject(ex);

          }
        }, function error(err) {
          console.error(err);
          reject(err);
        }
        );
      } catch (ex) {
        console.error("throw exception", ex);
        reject(ex);
      }
    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#    IxUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  execute: function (funcName, paramObj) {
    var me = this,
        any,
        promiseResult, promise;

    any = (typeof Any !== "undefined") ? new Any() : new de.elo.ix.client.Any();
    any.type = (typeof CONST !== "undefined") ? CONST.ANY.TYPE_STRING : ((typeof ixConnect !== "undefined") ? ixConnect.CONST.ANY.TYPE_STRING : elo.CONST.ANY.TYPE_STRING);
    any.stringValue = me.json ? me.json.stringifyAll(paramObj) : JSON.stringify(paramObj);

    promise = new Promise (function (resolve, reject) {
      promiseResult = api.IX.ix().executeRegisteredFunction(funcName, any);
      promiseResult.then(function success(anyResult) {
        var jsonResult;
        jsonResult = (anyResult && anyResult.stringValue) ? String(anyResult.stringValue) : "{}";
        try {
          jsonResult = JSON.parse(jsonResult);
          resolve(jsonResult);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

  /**
   * Executes a IX registered function and handles the response in a standardized way.
   *
   * @param {String} registeredFunctionName
   * @param {Object} params (optional) The configuration object which will be send to the registered function
   * @param {Object[]} jsonResults Array of previous handle events
   * @return {Object[]} jsonResults. Array with updated handle events
   */
  _executeIxActionHandler: function (registeredFunctionName, params, jsonResults) {
    var me = this,
        resultObj;

    try {
      resultObj = me.execute(registeredFunctionName, params);

      if (resultObj) {
        console.info("resultObj", resultObj);
        jsonResults.push(resultObj);
      }

    } catch (ex) {
      console.error("throw exception", ex);
    }
    return jsonResults;
  },
  /**
   * Executes a IX registered function and handles the response in a standardized way.
   *
   * @param {String} registeredFunctionName
   * @param {Object} params (optional) The configuration object which will be send to the registered function
   * @param {Object[]} jsonResults Array of previous handle events
   * return {Object[]} jsonResults. Array with updated handle events
   * @return {Promise} promise
   */
  executeIxActionHandler: function (registeredFunctionName, params, jsonResults) {
    var me = this,
        promise, promiseExecute;

    promise = new Promise (function (resolve, reject) {
      try {
        promiseExecute = me.execute(registeredFunctionName, params);
        promiseExecute.then(function success(resultObj) {
          try {
            if (resultObj) {
              console.info("resultObj", resultObj);
              jsonResults.push(resultObj);
            }
            resolve(jsonResults);
          } catch (ex) {
            console.error(ex);
            reject(ex);

          }
        }, function error(err) {
          console.error(err);
          reject(err);
        }
        );
      } catch (ex) {
        console.error("throw exception", ex);
        reject(ex);
      }
    });
    return promise;
  },

  /**
   * @private
   * @param {Object} event
   * return {Object} wfInfo
   * @return {Promise} promise
   */
  handleEvent: function (event) {
    var me = this,
        eventTypes = me.CONST.EVENT_TYPES,
        wfInfo = {},
        promise, promiseJsonResults, promiseHandleAllEvents;

    promise = new Promise (function (resolve, reject) {
      switch (event.ID) {
        case eventTypes.GOTO:
          console.info("GOTO event", event);
          wfInfo.objId = event.obj.objId;
          resolve(wfInfo);
          break;
        case eventTypes.DIALOG:
          console.info("DIALOG event", event);
          wfInfo.flowId = event.obj.flowId;
          wfInfo.nodeId = event.obj.nodeId;
          wfInfo.title = event.obj.title;
          resolve(wfInfo);
          break;
        case eventTypes.ERROR:
          console.info("ERROR event", event);
          resolve(wfInfo);
          break;
        case eventTypes.REFRESH:
          if (event.obj) {
            if (event.obj.objId) {
              wfInfo.objId = event.obj.objId;
            }
          }
          if (event.ON) {
            if (event.ON.flowId) {
              wfInfo.flowId = event.ON.flowId;
            }
            if (event.ON.nodeId) {
              wfInfo.nodeId = event.ON.nodeId;
            }
          }
          console.info("REFRESH event", event);
          resolve(wfInfo);
          break;
        case eventTypes.ACTION:
          if (event.COMPONENT === me.CONST.COMPONENTS.IX) {
            promiseJsonResults = me.executeIxActionHandler(event.obj.registeredFunction, event.obj.params, []);
          } else if (event.COMPONENT === me.CONST.COMPONENTS.AS) {
            promiseJsonResults = me.executeASActionHandler(event.solutionName, event.obj.directRule, event.obj.params, []);
          }
          promiseJsonResults.then(function success(jsonResults) {
            promiseHandleAllEvents = me.handleAllEvents(jsonResults);
            promiseHandleAllEvents.then(function success1(wfInfo1) {
              wfInfo = me.merge(wfInfo, wfInfo1);
              resolve(wfInfo);
            }, function error(err) {
              reject(err);
            });
          }, function error(err) {
            reject(err);
          });
          break;
        case eventTypes.FEEDBACK:
          console.info("FEEDBACK event", event);
          resolve(wfInfo);
          break;
        default:
          console.error("No handler for event of type event.ID", event.ID);
          // throw "No handler for event of type event.ID = '" + event.ID + "'";
          reject("No handler for event of type event.ID = '" + event.ID + "'");
      }
    });
    return promise;
  },

  /**
   * @private
   * @param {Object[]} events
   * return {Object} wfInfo
   * @return {Promise} promise
   */
  handleEvents: function (events) {
    var me = this,
        wfInfoEvents = {},
        event, promise, promiseHandleEvent, promiseHandleEvents;

    promise = new Promise (function (resolve, reject) {
      if (events.length > 0) {
        event = events.shift();
        promiseHandleEvent = me.handleEvent(event);
        promiseHandleEvent.then(function success(wfInfo) {
          try {
            wfInfoEvents = me.merge(wfInfoEvents, wfInfo);
            promiseHandleEvents = me.handleEvents(events);
            promiseHandleEvents.then(function success1(wfInfoEvents1) {
              try {
                wfInfoEvents = me.merge(wfInfoEvents, wfInfoEvents1);
                resolve(wfInfoEvents);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      } else {
        resolve(wfInfoEvents);
      }
    });
    return promise;
  },

  /**
   * @private
   * @param {Object[]} jsonResults
   * return {Object} wfInfo
   * @return {Promise} promise
   */
  handleEventsResults: function (jsonResults) {
    var me = this,
        wfInfoTotal = {},
        jsonResult, events,
        promise, promiseHandleEvents, promiseHandleEventsResults;

    promise = new Promise (function (resolve, reject) {
      if (jsonResults.length > 0) {
        jsonResult = jsonResults.shift();
        events = jsonResult.events;
        promiseHandleEvents = me.handleEvents(events);
        promiseHandleEvents.then(function success(wfInfoEvents) {
          wfInfoTotal = me.merge(wfInfoTotal, wfInfoEvents);
          promiseHandleEventsResults = me.handleEventsResults(jsonResults);
          promiseHandleEventsResults.then(function success1(wfInfoTotalOld) {
            try {
              wfInfoTotal = me.merge(wfInfoTotal, wfInfoTotalOld);
              resolve(wfInfoTotal);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        }, function error(err) {
          reject(err);
        });
      } else {
        resolve(wfInfoTotal);
      }
    });
    return promise;
  },

  /**
   * @private
   * @param {Object[]} jsonResults
   * return {Object} wfInfo
   * @return {Promise} promise
   */
  handleAllEvents: function (jsonResults) {
    var me = this,
        promise, promiseHandleEvents;


    promise = new Promise (function (resolve, reject) {
      try {
        promiseHandleEvents = me.handleEventsResults(jsonResults);
        promiseHandleEvents.then(function success(wfInfo) {
          try {
            resolve(wfInfo);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      } catch (ex) {
        reject(ex);
      }

    });
    return promise;
  },

   /**
   * This function execute RF with any type of paramObj
   * @param {String} funcName RF-Function
   * @param {Object} paramObj paramObj
   * @return {Promise} promise
   */
  executeRF: function (funcName, paramObj) {
    var any, objs, results, i, obj, jsonResult,
        promiseResult, promise;

    promise = new Promise (function (resolve, reject) {
      objs = [];
      if (paramObj) {
        objs.push(paramObj);
      }
      any = de.elo.ix.client.AnyToObject.fromObject(objs);
      promiseResult = api.IX.ix().executeRegisteredFunction(funcName, any);
      promiseResult.then(function success(anyResult) {
        objs = de.elo.ix.client.AnyToObject.toObject(anyResult);
        results = [];
        for (i = 0; i < objs.length; i++) {
          obj = String(objs[i]);
          results.push(obj);
        }
        try {
          results = JSON.stringify(results);
          jsonResult = JSON.parse(results);
          resolve(jsonResult);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

   /**
   * This function execute RF with any type of jsonParams
   * @param {String} funcName RF-Function
   * @param {Object} paramObj paramObj
   * @param {Object} jsonParam1 jsonParam1
   * @param {Object} jsonParam2 jsonParam2
   * @return {Promise} promise
   */
  executeRFParams: function (funcName, paramObj, jsonParam1, jsonParam2) {
    var any, objs, results, i, obj, jsonResult,
        promiseResult, promise;

    promise = new Promise (function (resolve, reject) {
      jsonParam1 = JSON.stringify(jsonParam1);
      jsonParam2 = JSON.stringify(jsonParam2);

      any = de.elo.ix.client.AnyToObject.fromObject([paramObj, jsonParam1, jsonParam2]);
      promiseResult = api.IX.ix().executeRegisteredFunction(funcName, any);
      promiseResult.then(function success(anyResult) {
        console.info("anyResult: ", anyResult);
        objs = de.elo.ix.client.AnyToObject.toObject(anyResult);
        results = [];
        for (i = 0; i < objs.length; i++) {
          obj = String(objs[i]);
          results.push(obj);
        }
        try {
          results = JSON.stringify(results);
          jsonResult = JSON.parse(results);
          resolve(jsonResult);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  JsonConfig  #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

 /**
   * This function reloads the configuration from the repository
   * @param {String} objId
   * @return {Promise} promise
   */
  loadConfig: function (objId) {
    var me = this,
        configJson = {},
        configStr, promise, promiseExecute;

    promise = new Promise (function (resolve, reject) {
      if (objId) {
        promiseExecute = me.execute("RF_sol_common_service_DownloadFileContent", {
          objId: objId
        });
        promiseExecute.then(function success(jsonResult) {
          try {
            configStr = jsonResult.content;
            configJson = JSON.parse(configStr);
            resolve(configJson);
          } catch (ex) {
            console.error("could not parse configuration", configStr);
            console.error("Configuration error: " + ex);
            reject(ex);
          }
        }, function error(err) {
          console.error(err);
          reject(err);
        }
        );
      } else {
        resolve(configJson);
      }
    });
    return promise;
  },

  /**
   * This function saves changes to the `config` property to the repository
   * @param {String} objId
   * @param {Object} configJson
   * @return {Promise} promise
   */
  saveConfig: function (objId, configJson) {
    var me = this,
        configStr, promise, promiseExecute;

    if (!objId) {
      console.error("no target path");
      throw "no target path";
    }

    configStr = JSON.stringify(configJson, null, 2);
    promise = new Promise (function (resolve, reject) {
      promiseExecute = me.execute("RF_sol_common_service_UploadFileContent", {
        objId: objId,
        content: configStr
      });
      promiseExecute.then(function success(jsonResult) {
        resolve(jsonResult);
      }, function error(err) {
        console.error(err);
        reject(err);
      }
      );
    });
    return promise;
  },

/**
   * Saves a new configuration file to the repository.
   *
   * - <b>The path has to contain the element name</b>
   * - <b>The path needs to exist (except for the element name), i.e. no new folders will be created</b>
   *
   * @param {String} arcPath An repositoty path.
   * @param {Object} configJson
   * @return {Promise} promise
   */
  saveNewConfig: function (arcPath, configJson) {
    var me = this,
        objId, promise, promiseExecute;
    if (!arcPath) {
      console.error("Repository path is missing.");
      throw "Repository path is missing.";
    }

    promise = new Promise (function (resolve, reject) {
      promiseExecute = me.execute("RF_sol_dev_service_CreateRepoEntry", {
        saveToRepoConfig: { repoPath: arcPath, maskId: elo.CONST.DOC_MASK.GUID_ELOSCRIPTS, contentObject: configJson, withoutBom: true }
      });
      promiseExecute.then(function success(jsonResult) {
        try {
          objId = jsonResult.objId;
          resolve(objId);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        console.error(err);
        reject(err);
      }
      );
    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  ObjectUtils #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //


  /**
   * Merges all properties in base into custom. Existing properties in custom will be preserved, but only
   * if they match the type of the property in base. Otherwise the property of base will be used
   * and a log will be written to array parameter log.
   *
   * This function does not support functions. It does support Array, Object and Date and creates a clone from it.
   * @param {Object} custom The object containing all merged data (object will be altered)
   * @param {Object} base The object from which will be copied to the `custom` object
   * @param {String[]} [log=[]] (optional) Logging messages will be pushed to this array
   * @param {String} [path=''] (optional) Startpath/objectname, used for logging
   * @param {Function} assignCallback (optional) Will be called for every property assignment (if set, this function has to take care of the assignment itself)
   * @param {Function} recursionCheck (optional) This function is called for every property and decides if the property has to be merged recursively (returns `true`) or not (returns `false`)
   * @returns {Object} The merged object (`custom`)
   */
  merge: function (custom, base, log, path, assignCallback, recursionCheck) {
    var me = this,
        prop;
    log = log || [];
    path = path || "";

    recursionCheck = recursionCheck || function (custom, base, prop) {
      return base[prop] instanceof Object && !(base[prop] instanceof Array) && !(base[prop] instanceof Date);
    };

    assignCallback = assignCallback || function (target, source, propertyName) {
      target[propertyName] = source[propertyName];
    };

    for (prop in base) {
      if (base.hasOwnProperty(prop)) {
        //check for same type (array must be checked separately) and use default property instead
        if (typeof custom[prop] !== "undefined" && ((typeof custom[prop] !== typeof base[prop]) ||
            (Array.isArray(base[prop]) !== Array.isArray(custom[prop])))) {
          log.push("Warning: The type of custom property " + path + "." + prop + " is not the same as in the target. Custom property is ignored.");
          custom[prop] = me.clone(base[prop]);
        } else if (recursionCheck(custom, base, prop)) {
          //recursion
          custom[prop] = me.merge(custom[prop] || {}, base[prop], log, path + "." + prop, assignCallback, recursionCheck); //return empty object if p does not exist in target
        } else if (custom[prop] === undefined) {
          //copy default property only if not exist in custom
          if (base[prop] instanceof Date) {
            custom[prop] = new Date(base[prop]);
          } else if (base[prop] instanceof Array) {
            custom[prop] = me.clone(base[prop]);
          } else {
            assignCallback(custom, base, prop);
          }
        }
      }
    }
    return custom;
  },


  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  RepoUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Creates all sords of a repository path.
   *
   * If the path contains dynamic content, use {@link #preparePath} instead.
   *
   * @param {String} parentId Parent Id of repository path
   * @param {String} mask (optional) If set, newly created parts of the path get that mask
   * @param {String[]} sordNames Sord names of repository path
   * @param {de.elo.ix.client.Sords[]} sords
   * @return {Promise} promise
   */
  createSords: function (parentId, mask, sordNames, sords) {
    var me = this,
        ix = elo.IX.ix(),
        promise, promiseCreateSord, newSordNames,
        promiseCreateSords;

    promise = new Promise (function (resolve, reject) {
      if (sordNames.length > 0) {
        promiseCreateSord = ix.createSord(parentId, mask, elo.CONST.SORD.mbAll);
        promiseCreateSord.then(function success(sord) {
          sord.name = sordNames[0];
          sords.push(sord);
          newSordNames = sordNames.slice(1);
          promiseCreateSords = me.createSords(parentId, mask, newSordNames, sords);
          promiseCreateSords.then(function success1(sords1) {
            try {
              resolve(sords1);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        }, function error(err) {
          reject(err);
        });
      } else {
        resolve(sords);
      }

    });
    return promise;
  },

  /**
   * Creates a repository path.
   *
   * If the path contains dynamic content, use {@link #preparePath} instead.
   *
   * @param {String} repoPath A path. The path separator is defined by the first character or the first charcter after "ARCPATH:"
   * @param {String} mask (optional) If set, newly created parts of the path get that mask
   * @return {Promise} promise
   */
  createPath: function (repoPath, mask) {
    var ix = elo.IX.ix(),
        me = this,
        delim, sordNames, sords, parentIdMatch, parentId,
        promise, promiseCreateSords, promiseCheckinSordPath;

    parentIdMatch = repoPath.match(/^ARCPATH\[([\(\)\-0-9E-F]*)\]/);
    parentId = parentIdMatch ? parentIdMatch[1] : "1";
    repoPath = me.normalizePath(repoPath);
    delim = me.getPathSeparator(repoPath);
    sordNames = repoPath.substring(1).split(delim);
    sords = [];

    mask = mask || "UnitTest";

    promise = new Promise (function (resolve, reject) {
      promiseCreateSords = me.createSords(parentId, mask, sordNames, sords);
      promiseCreateSords.then(function success(sords1) {
        promiseCheckinSordPath = ix.checkinSordPath(parentId, sords1, elo.CONST.SORD.mbAll);
        promiseCheckinSordPath.then(function success1(ids) {
          try {
            resolve(ids[ids.length - 1]);
          } catch (ex) {
            console.error("error creating archive path: ", ex);
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

 /**
   * Finds first sords of an element.
   * @param {de.elo.ix.client.FindInfo} findInfo
   * @param {elo.CONST.SORD.mbAll} sordZ
   * @returns {Promise} promise
   */
  findFirstSords: function (findInfo, sordZ) {
    var me = this,
        children = [],
        idx = 0,
        ix = elo.IX.ix(),
        result,
        promise, promiseFindFirstSords, promiseFindNextSords;

    promise = new Promise (function (resolve, reject) {
      promiseFindFirstSords = ix.findFirstSords(findInfo, 1000, sordZ);
      promiseFindFirstSords.then(function success(findResult) {
        try {
          findResult.sords.forEach(function (sord) {
            children.push(sord);
          });
          result = { children: children, findResult: findResult };
          promiseFindNextSords = me.findNextSords(result, idx, sordZ);
          promiseFindNextSords.then(function success1(result1) {
            try {
              resolve(result1);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

 /**
   * Finds next sords of an element.
   * @param {Object} result
   * @param {Number} idx
   * @param {elo.CONST.SORD.mbAll} sordZ
   * @returns {Promise} promise
   */
  findNextSords: function (result, idx, sordZ) {
    var me = this,
        ix = elo.IX.ix(),
        promise, promiseFindResult, promiseResult;

    promise = new Promise (function (resolve, reject) {
      if (result.findResult.moreResults) {
        idx += result.findResult.sords.length;
        promiseFindResult = ix.findNextSords(result.findResult.searchId, idx, 1000, sordZ);
        promiseFindResult.then(function success(findResult) {
          result.findResult = findResult;
          try {
            result.findResult.sords.forEach(function (sord) {
              result.children.push(sord);
            });
            promiseResult = me.findNextSords(result, idx, sordZ);
            promiseResult.then(function success1(result1) {
              try {
                resolve(result1);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
        result.findResult.sords.forEach(function (sord) {
          result.children.push(sord);
        });
        result = me.findNextSords(result, idx, sordZ);
      } else {
        resolve(result);
      }
    });
    return promise;
  },

 /**
   * Closes the find call.
   * @param {de.elo.ix.client.FindResult} findResult
   * @returns {Promise} promise
   */
  findClose: function (findResult) {
    var ix = elo.IX.ix(),
        promise, promiseFindClose;

    promise = new Promise (function (resolve, reject) {
      if (findResult) {
        promiseFindClose = ix.findClose(findResult.searchId);
        promiseFindClose.then(function success(closeResult) {
          try {
            resolve(closeResult);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      } else {
        resolve(null);
      }
    });
    return promise;
  },

 /**
   * Finds the children of an element.
   * @param {String} objId
   * returns {de.elo.ix.client.Sord[]}
   * @returns {Promise} promise
   */
  findChildren: function (objId) {
    var me = this,
        findInfo = new de.elo.ix.client.FindInfo(),
        findChildren = new de.elo.ix.client.FindChildren(),
        findByType = new de.elo.ix.client.FindByType(),
        includeReferences = true,
        sordZ = elo.CONST.SORD.mbAll,
        recursive = true,
        level = -1,
        promise, promiseFindFirstSords, promiseFindClose;


    // find subentries
    findChildren.parentId = objId;
    findChildren.mainParent = !includeReferences;
    findChildren.endLevel = (recursive) ? level : 1;

    findByType.typeStructures = true;
    findByType.typeDocuments = true;

    findInfo.findChildren = findChildren;
    findInfo.findByType = findByType;

    promise = new Promise (function (resolve, reject) {
      promiseFindFirstSords = me.findFirstSords(findInfo, sordZ);
      promiseFindFirstSords.then(function success(result) {
        promiseFindClose = me.findClose(result.findResult);
        promiseFindClose.then(function success1(closeResult) {
          try {
            resolve(result.children);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Finds sords
   * @param {Object} params Parameters
   * @param {Object} params.objKeysObj Map that contains key-value pairs
   * @param {de.elo.ix.client.SordZ} [params.sordZ=elo.CONST.SORD.mbAll] (optional) `elo.CONST.SORD.mbOnlyId` and `elo.CONST.SORD.mbOnlyGuid` are not working
   * @param {String} [params.maskId] (optional) If set, find objects related to this mask ID
   * @param {de.elo.ix.client.IXConnection} ixConn (optional) This will be used instead of `ìxConnect` (usfull when the search should run in a different user context)
   * returns {de.elo.ix.client.Sord[]}
   * @returns {Promise} promise
   */
  findSords: function (params) {
    var me = this,
        objKeys = [],
        findInfo, sordZ, key,
        promise, promiseFindFirstSords, promiseFindClose;

    params = params || {};
    sordZ = params.sordZ || elo.CONST.SORD.mbAll;
    findInfo = new de.elo.ix.client.FindInfo();
    if (params.objKeysObj) {
      findInfo.findByIndex = new de.elo.ix.client.FindByIndex();
      for (key in params.objKeysObj) {
        if (params.objKeysObj.hasOwnProperty(key)) {
          objKeys.push(me.createObjKey("", key, params.objKeysObj[key]));
        }
      }
      findInfo.findByIndex.objKeys = objKeys;
    }
    if (params.maskId) {
      findInfo.findByIndex.maskId = params.maskId;
    }
    promise = new Promise (function (resolve, reject) {
      promiseFindFirstSords = me.findFirstSords(findInfo, sordZ);
      promiseFindFirstSords.then(function success(result) {
        promiseFindClose = me.findClose(result.findResult);
        promiseFindClose.then(function success1(closeResult) {
          try {
            resolve(result.children);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Returns the repository path separator character
   * @param {String} repoPath Repository path
   * @return {String} Repository path separator
   */
  getPathSeparator: function (repoPath) {
    var me = this;
    repoPath = me.normalizePath(repoPath);
    if (repoPath && (repoPath.length > 0)) {
      return String(repoPath).substring(0, 1);
    }
    return "/";
  },

  /**
   * Creates a de.elo.ix.client.Sord folder if not exist
   * @param {String} TESTTEMPFOLDER arcpath of tempfolder
   * return {de.elo.ix.client.Sord}
   * @return {Promise} promise
   */
  getTempfolder: function () {
    var me = this,
        promise, promiseGetSord, promiseCreatePath;

    promise = new Promise (function (resolve, reject) {
      promiseGetSord = me.getSord(me.TESTTEMPFOLDER);
      promiseGetSord.then(function success(tempId) {
        if (!tempId) {
          promiseCreatePath = me.createPath(me.TESTTEMPFOLDER);
          promiseCreatePath.then(function success1(objPath) {
            try {
              resolve(objPath);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });

        } else {
          resolve(tempId.id);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return (promise);
  },

  /**
   * Normalizes a repository path
   * @param {String} repoPath Repository path
   * @param {Boolean} withPrefix If true the ARCPATH: prefix will be added.
   * @return {String} Normalized repository path
   */
  normalizePath: function (repoPath, withPrefix) {
    repoPath = String(repoPath);
    if (repoPath.indexOf("ARCPATH") == 0) {
      if (withPrefix) {
        return repoPath;
      } else {
        return repoPath.replace(/^ARCPATH[^:]*:/, "");
      }
    } else {
      if (withPrefix) {
        return "ARCPATH:" + repoPath;
      } else {
        return repoPath;
      }
    }
  },

  /**
   * Returns the name part of a repository path
   * @param {String} repoPath Repository path
   * @return {String} Name part of the repository path
   */
  getNameFromPath: function (repoPath) {
    var me = this,
        separator, _result;
    console.info("enter getNameFromPath", arguments);
    repoPath = me.normalizePath(repoPath);
    separator = me.getPathSeparator(repoPath);
    _result = String(repoPath).split(separator).pop();
    console.info("exit getNameFromPath", _result);
    return _result;
  },

  /**
   * Returns the parent repository path
   * @param {String} repoPath Repository path
   * @return {String} Repository path of the parent folder
   */
  getParentPath: function (repoPath) {
    var me = this,
        separator, _result;
    console.info("enter getParentPath", arguments);
    separator = me.getPathSeparator(repoPath);
    _result = String(repoPath).substring(0, repoPath.lastIndexOf(separator));
    console.info("exit getParentPath", _result);
    return _result;
  },

  /**
   * Returns the object ID of a given repository path
   * @param {String} path Repository path. The path separator is defined by the first character or the first charcter after "ARCPATH:"
   * @return {String} The ID of the new element, or null if it does not exist
   */
  _getObjId: function (path) {
    var me = this,
        ix = elo.IX.ix(),
        editInfo;

    console.info("enter getObjId", arguments);
    if (me.isObjId(path) || me.isGuid(path)) {
      console.info("exit getObjId", path);
      return path;
    }
    path = me.normalizePath(path, true);
    try {
      editInfo = ix.checkoutSord(path, elo.CONST.EDIT_INFO.mbOnlyId, elo.CONST.LOCK.NO);
      console.info("exit getObjId", editInfo.sord.id);
      return editInfo.sord.id;
    } catch (ignore) {
      // object not found
    }
    console.info("exit getObjId");
  },

  /**
   * Returns true if the given string is an object ID
   * @param {String} str Input string
   * @return {Boolean}
   */
  isObjId: function (str) {
    return /^[\d]{1,20}$/.test(String(str));
  },

  /**
   * Returns true if the given string is an object ID
   * @param {String} str Input string
   * @return {Boolean}
   */
  isGuid: function (str) {
    return /^\(\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\)$/.test(String(str));
  },

  /**
   * @private
   * Creates an ObjKey object
   * @param {String} id ID of the ObjKey
   * @param {String} name Name of the ObjKey
   * @param {String} value
   * @return {de.elo.ix.client.ObjKey} Created ObjKey
   */
  createObjKey: function (id, name, value) {
    var objKey = new de.elo.ix.client.ObjKey();
    if (id) {
      objKey.id = id;
    }
    objKey.name = name;
    objKey.data = [value];
    return objKey;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  SordUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //


  /**
   * Updates all of Sord attributes
   * @param {de.elo.ix.client.Sord} sord
   * @returns {Promise} promise
   */
  checkinSord: function (sord) {
    var ix = elo.IX.ix(),
        promise, promiseCheckInSord;

    promise = new Promise (function (resolve, reject) {
      promiseCheckInSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.YES);
      promiseCheckInSord.then(function success(checkinSordResult) {
        try {
          resolve(null);
        } catch (ex) {
          // object not found
          resolve(null);
        }
      }, function error(err) {
        // object not found
        resolve(null);
      });

    });
    return promise;
  },

  createRef: function (objId) {
    var ix = elo.IX.ix(),
        promise, promiseRefSord;

    promise = new Promise (function (resolve, reject) {
      promiseRefSord = ix.refSord("", 1, objId, -1);
      promiseRefSord.then(function success(refSordResult) {
        try {
          resolve(refSordResult);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Create a new de.elo.ix.client.Sord object
   * @param {String} parentId parent id
   * @param {String} mask name of document mask
   * @param {String} sordname  sord name
   * @param {Object} indexData Key-value-pairs with key=field and value=new value
   * @param {Object} mapData   Key-value-pairs with key=field and value=new value
   * @param {Object} params Parameters
   * @param {String} params.sortOrder Sort order
   * @param {String} params.containerDocument Container document
   * @return {Promise} promise
   *
   * for example
   *  objId = test.Utils.createSord(4711, 'UnitTest', 'Mitarbeiter 4711', {
   *     UNITTEST_FIELD1 : 'Hugo',
   *     UNITTEST_FIELD2 : 'Egon'
   *   },
   *   {
   *     UNITTEST_MAP1 : 'Bemerkung1',
   *     UNITTEST_MAP2 : 'Bemerkung2'
   *   });
   *
   *
   */
  createSord: function (parentId, mask, sordname, indexData, mapData, params) {
    var ix = elo.IX.ix(),
        me = this,
        sord,
        promise, promiseCreateSord, promiseUpdateKeyWording, promiseCheckinSord, promiseUpdateMapData;

    mask = mask || "UnitTest";

    promise = new Promise (function (resolve, reject) {
      // create a demo Sord
      promiseCreateSord = ix.createSord (parentId === null ? me.TESTROOT : parentId, mask, elo.CONST.EDIT_INFO.mbAll);
      promiseCreateSord.then(function success(editInfo) {
        try {
          sord = editInfo.sord;
          sord.name = sordname || me.TESTNAME;
          if (indexData) {
            promiseUpdateKeyWording = me.updateKeywording(sord, indexData);
            promiseUpdateKeyWording.then(function success1(updateKeyWordingResult) {
              try {
                params = params || {};
                if (typeof params.sortOrder != "undefined") {
                  if (params.sortOrder == "MANUAL") {
                    sord.details.sortOrder = elo.CONST.SORT_ORDER.MANUAL;
                  } else {
                    sord.details.sortOrder = params.sortOrder;
                  }
                }
                if (typeof params.documentContainer != "undefined") {
                  sord.details.documentContainer = params.documentContainer;
                }
                promiseCheckinSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.YES);
                promiseCheckinSord.then(function success2(objId) {
                  try {
                    if (mapData) {
                      promiseUpdateMapData = me.updateMapData(objId, mapData);
                      promiseUpdateMapData.then(function success3(updateMapDataResult) {
                        try {
                          resolve(objId);
                        } catch (ex) {
                          reject(ex);
                        }
                      }, function error(err) {
                        reject(err);
                      });
                    } else {
                      resolve(objId);
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                }, function error(err) {
                  reject(err);
                });
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });

          } else {
            promiseCheckinSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.YES);
            promiseCheckinSord.then(function success1(objId) {
              try {
                if (mapData) {
                  promiseUpdateMapData = me.updateMapData(objId, mapData);
                  promiseUpdateMapData.then(function success3(updateMapDataResult) {
                    try {
                      resolve(objId);
                    } catch (ex) {
                      reject(ex);
                    }
                  }, function error(err) {
                    reject(err);
                  });
                } else {
                  resolve(objId);
                }
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          }
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Create a temporary de.elo.ix.client.Sord object
   * Removes at first an older object with the same name
   * @param {String} sordname  sord name
   * @param {Object} indexData Key-value-pairs with key=field and value=new value
   * @param {Object} mapData   Key-value-pairs with key=field and value=new value
   * @return {Promise} promise
   *
   */
  createTempSord: function (sordname, indexData, mapData) {
    var me = this,
        promise, promiseGetTempfolder, promiseGetSord, promiseDeleteSord, promiseCreateSord;

    promise = new Promise (function (resolve, reject) {
      promiseGetTempfolder = me.getTempfolder();
      promiseGetTempfolder.then(function success(tempFolderId) {
        promiseGetSord = me.getSord(me.TESTTEMPFOLDER + "/" + sordname);
        promiseGetSord.then(function success1(objTempId) {
          if (objTempId) {
            objTempId = objTempId.id;
            promiseDeleteSord = me.deleteSord(objTempId);
            promiseDeleteSord.then(function success2(deleteResult) {
              promiseCreateSord = me.createSord(tempFolderId, null, sordname, indexData, mapData);
              promiseCreateSord.then(function success3(objTempId1) {
                try {
                  resolve(objTempId1);
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            });
          } else {
            promiseCreateSord = me.createSord(tempFolderId, null, sordname, indexData, mapData);
            promiseCreateSord.then(function success3(objTempId1) {
              try {
                resolve(objTempId1);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          }
        }, function error(err) {
          console.error(err);
          reject(err);
        }
        );
      }, function error(err) {
        console.error(err);
        reject(err);
      }
      );
    });
    return (promise);
  },

  /**
   * Changes the sord mask
   * @param {de.elo.ix.client.Sord} sord Sord
   * @param {Number|String} newMask New mask ID or name
   * return {de.elo.ix.client.Sord}
   * @return {Promise} promise
   */
  changeMask: function (sord, newMask) {
    var ix = elo.IX.ix(),
        changedSord,
        promise, promiseChangeSordMask;

    promise = new Promise (function (resolve, reject) {
      if (!sord) {
        reject("Sord is empty");
      }
      if (typeof newMask == "undefined") {
        reject("New mask is empty");
      }
      promiseChangeSordMask = ix.changeSordMask(sord, newMask, elo.CONST.EDIT_INFO.mbSord);
      promiseChangeSordMask.then(function success(editInfo) {
        changedSord = editInfo.sord;
        resolve(changedSord);
      }, function error(err) {
        reject(err);
      });

    });
    return (promise);
  },

  /**
   * Copies a de.elo.ix.client.Sord object
   * @param {String} objId object id of source object
   * @return {String} object id of destination object
   *
   */
  _copySord: function (objId) {
    var me = this,
        objTempFolderId, objName;

    objTempFolderId = me.getTempfolder();
    objId = me.getSord(objId);
    objName = objId.name;
    objId = objId.id;

    me.execute("RF_sol_function_CopyFolderContents", {
      objId: objTempFolderId,
      source: objId,
      copySourceAcl: false,
      inheritDestinationAcl: true
    });
    objId = me.getSord(me.TESTTEMPFOLDER + "/" + objName);
    objId = objId.id;

    return objId;
  },

  /**
   * Copies a de.elo.ix.client.Sord object
   * @param {String} objId object id of source object
   * return {String} object id of destination object
   * @return {Promise} promise
   *
   */
  copySord: function (objId) {
    var me = this,
        objName,
        promise, promiseGetTempFolder, promiseGetSord,
        promiseCopyFolderContents, promiseGetSord1;

    promise = new Promise (function (resolve, reject) {
      promiseGetTempFolder = me.getTempfolder();
      promiseGetTempFolder.then(function success(objTempFolderId) {
        promiseGetSord = me.getSord(objId);
        promiseGetSord.then(function success1(objSord) {
          objName = objSord.name;
          objId = objSord.id;
          promiseCopyFolderContents = me.execute("RF_sol_function_CopyFolderContents", {
            objId: objTempFolderId,
            source: objId,
            copySourceAcl: false,
            inheritDestinationAcl: true
          });
          promiseCopyFolderContents.then(function success2(jsonResult) {
            promiseGetSord1 = me.getSord(me.TESTTEMPFOLDER + "/" + objName);
            promiseGetSord1.then(function success3(objSord1) {
              objId = objSord1.id;
              resolve(objId);
            }, function error(err) {
              reject(err);
            });
          }, function error(err) {
            reject(err);
          });
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Removes logically a de.elo.ix.client.Sord object
   * @param {String} objId object id
   * @return {Promise} promise
   *
   */
  deleteSord: function (objId) {
    var ix = elo.IX.ix(),
        promiseResult, promise;

    promise = new Promise (function (resolve, reject) {
      promiseResult = ix.deleteSord(null, objId, elo.CONST.LOCK.NO, null);
      promiseResult.then(function success(deleteResult) {
        try {
          resolve(deleteResult);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

   /**
   * Removes logically a de.elo.ix.client.Sord objects
   * @param {String[]} objIds object ids
   * @return {Promise} promise
   */
  deleteSords: function (objIds) {
    var ix = elo.IX.ix(),
        promise, promisesDeleteSords, promiseDeleteSord;

    promise = new Promise (function (resolve, reject) {
      try {
        promisesDeleteSords = [];
        objIds.forEach(function (objId) {
          promiseDeleteSord = ix.deleteSord(null, objId, elo.CONST.LOCK.NO, null);
          promiseDeleteSord.then(function success(deleteResult) {
            try {
              resolve(deleteResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
          promisesDeleteSords.push(promiseDeleteSord);
        });
        Promise.all(promisesDeleteSords).then(function success(allResult) {
          try {
            resolve(allResult);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });

      } catch (ex) {
        reject(ex);
      }
    });
    return promise;
  },

  /**
   * Returns a de.elo.ix.client.DocVersion of current work version
   * @param {String} objId object id
   * return {de.elo.ix.client.DocVersion}
   * @return {Promise} promise
   */
  getCurrentWorkVersion: function (objId) {
    var ix = elo.IX.ix(),
        promise, promiseCheckOutDoc;

    promise = new Promise (function (resolve, reject) {
      try {
        promiseCheckOutDoc = ix.checkoutDoc(objId, null, elo.CONST.EDIT_INFO.mbSordDoc, elo.CONST.LOCK.NO);
        promiseCheckOutDoc.then(function success(editInfo) {
          resolve(editInfo.document.docs[0]);
        }, function error(err) {
          resolve(null);
        });
      } catch (ignore) {
        resolve(null);
      }
    });
    return promise;
  },

  /**
   * Returns the value of an map entry field
   * @param {String} objId object id
   * @param {String} keyname Name of the map entry field
   * return {String} The field value
   * @return {Promise} promise
   */
  getMapValue: function (objId, keyname) {
    var ix = elo.IX.ix(),
        data = {}, i, items,
        promise, promiseCheckOutMap;

    promise = new Promise (function (resolve, reject) {
      promiseCheckOutMap = ix.checkoutMap(elo.CONST.MAP_CONFIG.DOMAIN_SORD, objId, null, elo.CONST.LOCK.NO);
      promiseCheckOutMap.then(function success(mapData) {
        try {
          items = mapData.items;
          for (i = 0; i < items.length; i++) {
            data[items[i].key] = items[i].value;
          }
          resolve(data[keyname]);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },


  /**
   * Returns the value of an blob entry field
   * @param {String} objId object id
   * @param {String} keyname Name of the blob entry field
   * return {String} The field value
   * @return {Promise} promise
   */
  getBlobValue: function (objId, keyname) {
    var ix = elo.IX.ix(),
        data = {}, i, items,
        promise, promiseCheckOutMap;

    promise = new Promise (function (resolve, reject) {
      promiseCheckOutMap = ix.checkoutMap("formdata", objId, null, elo.CONST.LOCK.NO);
      promiseCheckOutMap.then(function success(mapData) {
        try {
          items = mapData.items;
          for (i = 0; i < items.length; i++) {
            data[items[i].key] = items[i].value;
          }
          resolve(data[keyname]);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

  /**
   * Retrieves (and caches) the definition of document masks by their name
   * @param {String} name
   * returns {de.elo.ix.client.DocMask} mask
   * @return {Promise} promise
   */
  getDocMask: function (name) {
    var ix = elo.IX.ix(),
        promise, promiseCheckOutDocMask;


    promise = new Promise (function (resolve, reject) {
      if (!name) {
        reject("Document mask name is empty");
      }
      promiseCheckOutDocMask = ix.checkoutDocMask(name, elo.CONST.DOC_MASK.mbAll, elo.CONST.LOCK.NO);
      promiseCheckOutDocMask.then(function success(docMask) {
        try {
          resolve(docMask);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

  /**
   * Returns the ObjKey for a field
   * @param {de.elo.ix.client.Sord} sord
   * @param {string} keyName Name of the index field
   * @return {de.elo.ix.client.ObjKey} The ObjKey, or null if none was found
   */
  getObjKey: function (sord, keyName) {
    var me = this,
        keys, key, i;

    if (me.isIndexdataLoaded(sord) && keyName) {
      keys = sord.objKeys;
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (key.name == keyName) {
          return key;
        }
      }
    }
    return null;
  },

  /**
   * Returns the values of an ObjKey for a field as array
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} keyName Name of the index field
   * @return {String[]} The field values
   */
  getObjKeyValues: function (sord, keyName) {
    var key = this.getObjKey(sord, keyName);
    if (key && (key.data.length > 0)) {
      return key.data;
    }
    return null;
  },

  /**
   * Returns the value of an ObjKey for a field
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} keyName Name of the index field
   * @return {String} The field value
   */
  getObjKeyValue: function (sord, keyName) {
    var values = this.getObjKeyValues(sord, keyName);
    if (values) {
      return values[0];
    }
    return null;
  },

  /**
   * Returns the value of an ObjKey for a field as number.
   * The method takes care of wrong decimal separators.
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} keyName Name of the index field
   * @return {Number} The field value as number
   */
  getObjKeyValueAsNumber: function (sord, keyName) {
    var value = this.getObjKeyValue(sord, keyName);
    if (value) {
      value = value.replace(",", ".");
      return parseFloat(value);
    }
    return null;
  },

  /**
   * Returns a de.elo.ix.client.Sord
   * @param {String} objId object id
   * @return {Promise} promise
   */
  getSord: function (objId) {
    var ix = elo.IX.ix(),
        promiseResult, promise;

    promise = new Promise (function (resolve, reject) {
      try {
        promiseResult = ix.checkoutSord(objId, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
      } catch (ignore) {
      }
      promiseResult.then(function success(sord) {
        try {
          resolve(sord);
        } catch (ex) {
          resolve(null);
        }
      }, function error(err) {
        resolve(null);
      });
    });
    return promise;
  },

  /**
   * Checks, if the index data (objKeys) is loaded
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  isIndexdataLoaded: function (sord) {
    return sord && sord.objKeys && (sord.objKeys.length > 0);
  },

  /**
   * @private
   * @param {String} objId
   * @param {Boolean} recursive
   * return {de.elo.ix.client.Sord[]}
   * @return {Promise} promise
   */
  retrieveElements: function (objId, recursive) {
    var ix = elo.IX.ix(),
        me = this,
        elements = [],
        i, max,
        promise, promiseCheckOutSord, promiseChildren;

    promise = new Promise (function (resolve, reject) {
      promiseCheckOutSord = ix.checkoutSord(objId, elo.CONST.SORD.mbAll, elo.CONST.LOCK.NO);
      promiseCheckOutSord.then(function success(element) {
        try {
          elements.push(element);
          if (recursive === true) {
            promiseChildren = me.findChildren(objId);
            promiseChildren.then(function success1(children) {
              try {
                if (children && children.length > 0) {
                  max = children.length;
                  for (i = 0; i < max; i++) {
                    elements.push(children[i]);
                  }
                }
                resolve(elements);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          }
          resolve(elements);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

 /**
   * Sets the value of an ObjKey for a field
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} keyName Name of the index field
   * @param {String|String[]} value
   * @return {de.elo.ix.client.ObjKey} The changed ObjKey
   */
  setObjKeyValue: function (sord, keyName, value) {
    var me = this;

    if (!Array.isArray(value)) {
      value = [value];
    }
    return me.setObjKeyValues(sord, keyName, value);
  },

 /**
   * Sets the values of an ObjKey for a field
   * @param {de.elo.ix.client.Sord} sord
   * @param {String} keyName Name of the index field
   * @param {String[]} values
   * @return {de.elo.ix.client.ObjKey} The changed ObjKey
   */
  setObjKeyValues: function (sord, keyName, values) {
    var me = this,
        key = me.getObjKey(sord, keyName);

    if (!key) {
      console.error("cannot set objkey '", keyName, "': key does not exist");
      throw "cannot set objkey '" + keyName + "': key does not exist";
    }
    key.data = values;

    return key;
  },

  /**
   * Updates a bunch of index data at once.
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object} indexData Key-value-pairs with key=field and value=new value
   * @param {Boolean} write determines if changes written to sord object to be checked in
   * @return {Promise} promise
   */
  updateKeywording: function (sord, indexData, write) {
    var me = this,
        ix = elo.IX.ix(),
        property,
        promise, promiseCheckInSord;

    for (property in indexData) {
      if (indexData.hasOwnProperty(property)) {
        me.setObjKeyValue(sord, property, indexData[property]);
      }
    }
    promise = new Promise (function (resolve, reject) {
      if (write) {
        try {
          promiseCheckInSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.YES);
          promiseCheckInSord.then(function success(checkinSordResult) {
            try {
              resolve(checkinSordResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }
      resolve(sord.id);
    });
    return promise;
  },

  /**
   * Updates a bunch of map data at once.
   * @param {Object} objId
   * @param {Object} mapData Key-value-pairs with key=field and value=new value
   * @return {Promise} promise
   */
  updateMapData: function (objId, mapData) {
    var ix = elo.IX.ix(),
        mapEntries = [],
        key, containsKey, i,
        promise, promiseMapData, promiseCheckinMap;

    promise = new Promise (function (resolve, reject) {
      promiseMapData = ix.checkoutMap(elo.CONST.MAP_CONFIG.DOMAIN_SORD, objId, null, elo.CONST.LOCK.NO);
      promiseMapData.then(function success(mapData1) {
        try {
          mapEntries = mapData1.items;
          for (key in mapData) {
            containsKey = false;
            for (i = 0; i < mapEntries.length; i++) {
              if (mapEntries[i].key == key) {
                containsKey = true;
                mapEntries[i].value = mapData[key];
              }
            }
            if (!containsKey) {
              mapEntries.push(new de.elo.ix.client.KeyValue(key, mapData[key]));
            }
          }
          promiseCheckinMap = ix.checkinMap(elo.CONST.MAP_CONFIG.DOMAIN_SORD, objId, objId, mapEntries, elo.CONST.LOCK.NO);
          promiseCheckinMap.then(function success1(checkinMapResult) {
            try {
              resolve(checkinMapResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Updates all of Sord attributes
   * @param {de.elo.ix.client.Sord} sord
   * @param {Object[]} data
   *
   *     {
   *       key: "name",
   *       value: "hallo welt"
   *     }
   *
   * @returns {de.elo.ix.client.KeyValue[]}
   */
  updateSord: function (sord, data) {
    var ix = elo.IX.ix(),
        promise, promiseCheckinSord;

    if (!data) {
      return;
    }
    if (!Array.isArray(data)) {
      console.error("data has to be an Array", data);
      throw "data has to be an Array";
    }
    data.forEach(function (entry) {
      if (!entry || !entry.key || !entry.value) {
        console.error("illegal object: ", data);
        throw "illegal object: " + JSON.stringify(data);
      }
      sord[entry.key] = entry.value;
    });

    promise = new Promise (function (resolve, reject) {
      try {
        promiseCheckinSord = ix.checkinSord(sord, elo.CONST.SORD.mbAll, elo.CONST.LOCK.YES);
      } catch (ignore) {
      }
      promiseCheckinSord.then(function success(sordId) {
        try {
          resolve(null);
        } catch (ex) {
          resolve(null);
        }
      }, function error(err) {
        resolve(null);
      });
    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  StringUtils #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Checks, if a string ends with another string
   * @param {String} str
   * @param {String} pattern
   * @returns {Boolean}
   */
  endsWith: function (str, pattern) {
    var postfixLength;
    str += "";
    pattern += "";
    postfixLength = (pattern.length < str.length) ? pattern.length : str.length;
    return str.indexOf(pattern) === (str.length - postfixLength);
  },

  /**
   * Checks, if a string starts with another string
   * @param {String} str
   * @param {String} pattern
   * @returns {Boolean}
   */
  startsWith: function (str, pattern) {
    return str.indexOf(pattern) === 0;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#   WfUtils    #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Changes the user of a node.
   * @param {String} flowId The workflows ID
   * @param {de.elo.ix.client.WFNode} node The node to be changed
   * @param {String} user The user which should be set
   */
  _changeNodeUser: function (flowId, node, user) {
    var me = this,
        ix = elo.IX.ix(),
        wfDiagram, wfNodes, i;

    wfDiagram = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.ACTIVE, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
    if (node) {
      if (node.userName != user) {
        node.userName = user;
        // node.userId = -1;
        node.userId = me.getUserInfo(user).id;
        wfNodes = wfDiagram.nodes;
        for (i = 0; i < wfNodes.length; i++) {
          if (wfNodes[i].id == node.id) {
            wfNodes[i].userName = node.userName;
            wfNodes[i].userId = node.userId;
          }
        }
        ix.checkinWorkFlow(wfDiagram, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
      }
    } else {
      console.error("'node' cannot be empty, no user set.", node);
    }
  },

  /**
   * Changes the user of a node.
   * @param {String} flowId The workflows ID
   * @param {de.elo.ix.client.WFNode} node The node to be changed
   * @param {String} user The user which should be set
   * @return {Promise} promise
   */
  changeNodeUser: function (flowId, node, user) {
    var me = this,
        ix = elo.IX.ix(),
        wfNodes, i,
        promise, promiseCheckoutWorkFlow, promiseGetUserInfo, promiseCheckinWorkFlow;

    promise = new Promise (function (resolve, reject) {
      promiseCheckoutWorkFlow = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.ACTIVE, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
      promiseCheckoutWorkFlow.then(function success(wfDiagram) {
        try {
          if (node) {
            if (node.userName != user) {
              node.userName = user;
              // node.userId = -1;
              promiseGetUserInfo = me.getUserInfo(user);
              promiseGetUserInfo.then(function success1(userInfo) {
                try {
                  node.userId = userInfo.id;
                  wfNodes = wfDiagram.nodes;
                  for (i = 0; i < wfNodes.length; i++) {
                    if (wfNodes[i].id == node.id) {
                      wfNodes[i].userName = node.userName;
                      wfNodes[i].userId = node.userId;
                    }
                  }
                  promiseCheckinWorkFlow = ix.checkinWorkFlow(wfDiagram, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
                  promiseCheckinWorkFlow.then(function success2(checkinWorkFlowResult) {
                    try {
                      resolve(checkinWorkFlowResult);
                    } catch (ex) {
                      reject(ex);
                    }
                  }, function error(err) {
                    reject(err);
                  });
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            }
          } else {
            console.error("'node' cannot be empty, no user set.", node);
            reject("'node' cannot be empty, no user set.");
          }
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Changes the priority of a workflow.
   * @param {String} flowId The workflows ID
   * @param {Number} prio The new priority (0=high, 1=medium, 2=low)
   */
  // TODO promise
  _changeWorkflowPriority: function (flowId, prio) {
    var ix = elo.IX.ix(),
        wfDiagram;

    if ((typeof prio !== "undefined") && (Object.prototype.toString.call(prio) === "[object Number]") && (prio >= 0) && (prio <= 2)) {
      wfDiagram = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.ACTIVE, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
      if (wfDiagram.prio !== prio) {
        wfDiagram.prio = prio;
        ix.checkinWorkFlow(wfDiagram, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
      }
    }
  },
// TODO promise

  /**
   * Finds the first active Node of a specific object and workflow
   * @param {String} objId Object ID
   * @param {String} flowId Flow ID
   * @return {de.elo.ix.client.WFCollectNode} wfCollectNode. Found active node.
   */
  _findFirstActiveNode: function (objId, flowId) {
    var ix = elo.IX.ix(),
        findTasksInfo, idx, findResult, tasks, i, wfCollectNode;

    findTasksInfo = new de.elo.ix.client.FindTasksInfo();
    findTasksInfo.inclWorkflows = true;
    findTasksInfo.lowestPriority = elo.CONST.USER_TASK_PRIORITY.LOWEST;
    findTasksInfo.highestPriority = elo.CONST.USER_TASK_PRIORITY.HIGHEST;
    findTasksInfo.objId = objId;

    idx = 0;
    findResult = ix.findFirstTasks(findTasksInfo, 100);

    while (true) {
      tasks = findResult.tasks;
      for (i = 0; i < tasks.length; i++) {
        wfCollectNode = tasks[i].wfNode;
        if (wfCollectNode.flowId == flowId) {
          return wfCollectNode;
        }
      }

      if (!findResult.isMoreResults()) {
        break;
      }

      idx += findResult.tasks.length;
      findResult = ix.findNextTasks(findResult.searchId, idx, 100);
    }

    if (findResult) {
      ix.findClose(findResult.searchId);
    }
    return "";
  },

  /**
   * Finds the first active Node of a specific object and workflow
   * @param {String} objId Object ID
   * @param {String} flowId Flow ID
   * return {de.elo.ix.client.WFCollectNode} wfCollectNode. Found active node.
   * @return {Promise} promise
   */
  findFirstActiveNode: function (objId, flowId) {
    var me = this,
        max = 100,
        findTasksInfo,
        promise, promiseFindFirstTasks, promiseFindClose;

    promise = new Promise (function (resolve, reject) {
      findTasksInfo = new de.elo.ix.client.FindTasksInfo();
      findTasksInfo.inclWorkflows = true;
      findTasksInfo.lowestPriority = elo.CONST.USER_TASK_PRIORITY.LOWEST;
      findTasksInfo.highestPriority = elo.CONST.USER_TASK_PRIORITY.HIGHEST;
      findTasksInfo.objId = objId;

      promiseFindFirstTasks = me.findFirstTasks(findTasksInfo, max, flowId);
      promiseFindFirstTasks.then(function success(result) {
        promiseFindClose = me.findClose(result.findResult);
        promiseFindClose.then(function success1(closeResult) {
          try {
            resolve(result.wfCollectNode);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Finds the usertask of first active Node of a specific object and workflow
   * @param {String} objId Object ID
   * @param {String} flowId Flow ID
   * return {de.elo.ix.client.UserTask} userTask. Usertask of found active node.
   * @return {Promise} promise
   */
  findFirstActiveNodeUserTask: function (objId, flowId) {
    var me = this,
        max = 100,
        findTasksInfo,
        promise, promiseFindFirstTasks, promiseFindClose;

    promise = new Promise (function (resolve, reject) {
      findTasksInfo = new de.elo.ix.client.FindTasksInfo();
      findTasksInfo.inclWorkflows = true;
      findTasksInfo.lowestPriority = elo.CONST.USER_TASK_PRIORITY.LOWEST;
      findTasksInfo.highestPriority = elo.CONST.USER_TASK_PRIORITY.HIGHEST;
      findTasksInfo.objId = objId;

      promiseFindFirstTasks = me.findFirstTasks(findTasksInfo, max, flowId);
      promiseFindFirstTasks.then(function success(result) {
        promiseFindClose = me.findClose(result.findResult);
        promiseFindClose.then(function success1(closeResult) {
          try {
            resolve(result.userTask);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

   /**
   * Find first tasks with a search request.
   * @param {de.elo.ix.client.FindTasksInfo} findTasksInfo Defines the search
   * @param {Number} max
   * @param {String} flowId Flow ID
   * @return {Promise} promise
   */
  findFirstTasks: function (findTasksInfo, max, flowId) {
    var me = this,
        idx = 0,
        ix = elo.IX.ix(),
        tasks, i, wfCollectNode,
        result,
        promise, promiseFindFirstTasks, promiseFindNextTasks;

    promise = new Promise (function (resolve, reject) {
      promiseFindFirstTasks = ix.findFirstTasks(findTasksInfo, max);
      promiseFindFirstTasks.then(function success(findResult) {
        try {
          tasks = findResult.tasks;
          for (i = 0; i < tasks.length; i++) {
            wfCollectNode = tasks[i].wfNode;
            if (wfCollectNode.flowId == flowId) {
              result = { wfCollectNode: wfCollectNode, findResult: findResult, userTask: tasks[i] };
              resolve(result);
            }
          }
          result = { wfCollectNode: "", findResult: findResult, userTask: "" };
          promiseFindNextTasks = me.findNextTasks(result, idx, max, flowId);
          promiseFindNextTasks.then(function success1(result1) {
            try {
              resolve(result1);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject (ex);
        }

      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Find next tasks with a search request.
   * @param {Object} result
   * @param {Number} idx
   * @param {Number} max
   * @param {String} flowId Flow ID
   * @return {Promise} promise
   */
  findNextTasks: function (result, idx, max, flowId) {
    var me = this,
        ix = elo.IX.ix(),
        tasks, i, wfCollectNode,
        promise, promiseFindResult, promiseResult;

    promise = new Promise (function (resolve, reject) {
      if (result.findResult.moreResults) {
        idx += result.findResult.tasks.length;
        promiseFindResult = ix.findNextTasks(result.findResult.searchId, idx, max);
        promiseFindResult.then(function success(findResult) {
          result.findResult = findResult;
          try {
            tasks = findResult.tasks;
            for (i = 0; i < tasks.length; i++) {
              wfCollectNode = tasks[i].wfNode;
              if (wfCollectNode.flowId == flowId) {
                result = { wfCollectNode: wfCollectNode, findResult: findResult, userTask: tasks[i] };
                resolve(result);
              }
            }
            result = { wfCollectNode: "", findResult: findResult, userTask: "" };
            promiseResult = me.findNextTasks(result, idx, max, flowId);
            promiseResult.then(function success1(result1) {
              try {
                resolve(result1);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
        tasks = result.findResult.tasks;
        for (i = 0; i < tasks.length; i++) {
          wfCollectNode = tasks[i].wfNode;
          if (wfCollectNode.flowId == flowId) {
            result = { wfCollectNode: wfCollectNode, findResult: result.findResult, userTask: tasks[i] };
            resolve(result);
          }
        }
        result = { wfCollectNode: "", findResult: result.findResult, userTask: "" };
        result = me.findNextTasks(result, idx, max, flowId);
      } else {
        resolve(result);
      }
    });
    return promise;
  },

  /**
   * Find first workflows with a search request.
   * @param {de.elo.ix.client.FindWorkflowInfo} findWorkflowInfo Defines the search
   * @param {Number} max
   * @return {Promise} promise
   */
  findFirstWorkflows: function (findWorkflowInfo, max) {
    var me = this,
        workflows = [],
        idx = 0,
        ix = elo.IX.ix(),
        result,
        promise, promiseFindFirstWorkflows, promiseFindNextWorkflows;

    promise = new Promise (function (resolve, reject) {
      promiseFindFirstWorkflows = ix.findFirstWorkflows(findWorkflowInfo, max, elo.CONST.WORKFLOW.mbLean);
      promiseFindFirstWorkflows.then(function success(findResult) {
        try {
          findResult.workflows.forEach(function (wf) {
            workflows.push(wf);
          });
          result = { workflows: workflows, findResult: findResult };
          promiseFindNextWorkflows = me.findNextWorkflows(result, idx, max);
          promiseFindNextWorkflows.then(function success1(result1) {
            try {
              resolve(result1);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Find next workflows with a search request.
   * @param {Object} result
   * @param {Number} idx
   * @param {Number} max
   * @return {Promise} promise
   */
  findNextWorkflows: function (result, idx, max) {
    var me = this,
        ix = elo.IX.ix(),
        promise, promiseFindResult, promiseResult;

    promise = new Promise (function (resolve, reject) {
      if (result.findResult.moreResults) {
        idx += result.findResult.workflows.length;
        promiseFindResult = ix.findNextWorkflows(result.findResult.searchId, idx, max);
        promiseFindResult.then(function success(findResult) {
          result.findResult = findResult;
          try {
            result.findResult.workflows.forEach(function (wf) {
              result.workflows.push(wf);
            });
            promiseResult = me.findNextWorkflows(result, idx, max);
            promiseResult.then(function success1(result1) {
              try {
                resolve(result1);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
        result.findResult.workflows.forEach(function (wf) {
          result.workflows.push(wf);
        });
        result = me.findNextWorkflows(result, idx, max);
      } else {
        resolve(result);
      }
    });
    return promise;
  },

  /**
   * Retrieves workflows with a search request.
   * @param {de.elo.ix.client.FindWorkflowInfo} findWorkflowInfo Defines the search
   * return {de.elo.ix.client.WFDiagram[]}
   * @return {Promise} promise
   */
  findWorkflows: function (findWorkflowInfo) {
    var me = this,
        max = 100,
        promise, promiseFindFirstWorkflows, promiseFindClose;

    promise = new Promise (function (resolve, reject) {
      promiseFindFirstWorkflows = me.findFirstWorkflows(findWorkflowInfo, max);
      promiseFindFirstWorkflows.then(function success(result) {
        promiseFindClose = me.findClose(result.findResult);
        promiseFindClose.then(function success1(closeResult) {
          try {
            resolve(result.workflows);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Forwarding workflow task to selected successors of the node
   * @param {String} flowId Flow ID
   * @param {String} nodeId The ID of the node
   * @param {String[]} arrEnterNodesIds IDs of selected successors
   * @param {String} nodeComment (optional) comment node
   * @param {Boolean} takeWorkflowTask (optional) Assume workflow task to current user if set
   * @return {Promise} promise
   */
  forwardWorkflowTask: function (flowId, nodeId, arrEnterNodesIds, nodeComment, takeWorkflowTask) {
    var ix = elo.IX.ix(),
        me = this,
        currentUser,
        promise, promiseEditNode, promiseTakeWorkFlowNode, promiseEndEditWorkFlowNode;

    promise = new Promise (function (resolve, reject) {
      promiseEditNode = ix.beginEditWorkFlowNode(flowId, nodeId, elo.CONST.LOCK.FORCE);
      promiseEditNode.then(function success(editNode) {
        try {
          if (takeWorkflowTask) {
            currentUser = me.getCurrentUserName();
            promiseTakeWorkFlowNode = ix.takeWorkFlowNode(flowId, nodeId, currentUser, elo.CONST.TAKE_NODE.RESET_IN_USE_DATE, elo.CONST.LOCK.FORCE);
            promiseTakeWorkFlowNode.then(function success1(takeWorkFlowNodeResult) {
              try {
                promiseEndEditWorkFlowNode = ix.endEditWorkFlowNode(flowId, nodeId, false, false, editNode.node.name, nodeComment, arrEnterNodesIds);
                promiseEndEditWorkFlowNode.then(function success2(endEditWorkFlowNodeResult) {
                  try {
                    resolve(endEditWorkFlowNodeResult);
                  } catch (ex) {
                    reject(ex);
                  }
                }, function error(err) {
                  reject(err);
                });
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } else {
            promiseEndEditWorkFlowNode = ix.endEditWorkFlowNode(flowId, nodeId, false, false, editNode.node.name, nodeComment, arrEnterNodesIds);
            promiseEndEditWorkFlowNode.then(function success1(endEditWorkFlowNodeResult) {
              try {
                resolve(endEditWorkFlowNodeResult);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          }
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Returns all active workflow nodes with assigned users or groups.
   * @param {de.elo.ix.client.WFDiagram} workflow
   * @returns {de.elo.ix.client.WFNode[]}
   */
  getActiveUserNodes: function (workflow) {
    var nodes = [],
        i, node;
    for (i = 0; i < workflow.nodes.length; i++) {
      node = workflow.nodes[i];
      if (node.exitDateIso == "" && node.userName != "") {
        if ((node.enterDateIso != "" && workflow.parentFlowId == "0") || (node.enterDateIso == "" && workflow.parentFlowId != "0")) {
          nodes.push(node);
        }
      }
    }
    return nodes;
  },

  /**
   * Retrieves finished workflows for an object.
   * @param {String} objId
   * return {de.elo.ix.client.WFDiagram[]}
   * @return {Promise} promise
   */
  getFinishedWorkflows: function (objId) {
    var me = this,
        findInfo = new de.elo.ix.client.FindWorkflowInfo(),
        promise, promiseFindWorkflows, promiseCurrentUserId;

    if (objId) {
      findInfo.objId = objId;
    }
    findInfo.type = elo.CONST.WORKFLOW_TYPE.FINISHED;

    promise = new Promise (function (resolve, reject) {
      if (!objId) {
        promiseCurrentUserId = me.getCurrentUserId();
        promiseCurrentUserId.then(function success(userId) {
          findInfo.ownerIds = [userId];

          promiseFindWorkflows = me.findWorkflows(findInfo);
          promiseFindWorkflows.then(function success1(workflows) {
            try {
              resolve(workflows);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        }, function error(err) {
          reject(err);
        });
      } else {
        promiseFindWorkflows = me.findWorkflows(findInfo);
        promiseFindWorkflows.then(function success(workflows) {
          try {
            resolve(workflows);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });

      }
    });
    return promise;
  },

  /**
   * Retrieves active workflows for an object.
   * @param {String} objId
   * return {de.elo.ix.client.WFDiagram[]}
   * @return {Promise} promise
   */
  getActiveWorkflows: function (objId) {
    var me = this,
        findInfo = new de.elo.ix.client.FindWorkflowInfo(),
        promise, promiseFindWorkflows, promiseCurrentUserId;

    if (objId) {
      findInfo.objId = objId;
    }

    findInfo.type = elo.CONST.WORKFLOW_TYPE.ACTIVE;

    promise = new Promise (function (resolve, reject) {
      if (!objId) {
        promiseCurrentUserId = me.getCurrentUserId();
        promiseCurrentUserId.then(function success(userId) {
          findInfo.ownerIds = [userId];

          promiseFindWorkflows = me.findWorkflows(findInfo);
          promiseFindWorkflows.then(function success1(workflows) {
            try {
              resolve(workflows);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        }, function error(err) {
          reject(err);
        });
      } else {
        promiseFindWorkflows = me.findWorkflows(findInfo);
        promiseFindWorkflows.then(function success(workflows) {
          try {
            resolve(workflows);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });

      }
    });
    return promise;
  },

  /**
   * Returns the node defined by the nodeId.
   * @param {de.elo.ix.client.WFDiagram} workflow The WFDiagram containing the workflow description
   * @param {String} id The ID of the node
   * @return {de.elo.ix.client.WFNode} The node or null, if no node was found with the ID
   */
  getNode: function (workflow, id) {
    var node, i;
    for (i = 0; i < workflow.nodes.length; i++) {
      node = workflow.nodes[i];
      if ((node.id == id) && (node.type != elo.CONST.WORKFLOW_NODE.TYPE_NOTHING)) {
        return node;
      }
    }
    return null;
  },

  /**
   * Returns the node for a node name.
   * If the node name is not unique, the first found node will be returned.
   * @param {de.elo.ix.client.WFDiagram} workflow The WFDiagram containing the workflow description
   * @param {String} name The name of the node
   * @param {String} cycleNo Cycle number
   * @return {de.elo.ix.client.WFNode} The node or null, if no node was found with the name
   */
  getNodeByName: function (workflow, name, cycleNo) {
    var me = this,
        node, i;

    if (!workflow) {
      throw "Workflow diagram is empty";
    }
    if (!name) {
      throw "Name is empty";
    }
    for (i = 0; i < workflow.nodes.length; i++) {
      node = workflow.nodes[i];
      if ((node.name == name || node.nameTranslationKey == name) && (node.type != elo.CONST.WORKFLOW_NODE.TYPE_NOTHING)) {
        if (!cycleNo || me.endsWith(node.name, "[[" + cycleNo + "]]")) {
          return node;
        }
      }
      if (me.startsWith(node.name, name + " [[" + cycleNo + "]]")) {
        return node;
      }
    }
    return null;
  },

  /**
   * Get node User
   * @param {de.elo.ix.client.WFDiagram} wfDiagram Workflow diagram
   * @param {String} nodeId Node ID
   * @param {Object} config Configuration
   * @param {Boolean} config.useSessionUserAlternatively
   * @return {String} Node user
   */
  getNodeUser: function (wfDiagram, nodeId, config) {
    var me = this,
        wfNode,
        nodeUser = "";

    config = config || {};

    if (wfDiagram && nodeId) {
      wfNode = me.getNode(wfDiagram, nodeId);
      nodeUser = String(wfNode.userName);
    }

    if (!nodeUser && config.useSessionUserAlternatively) {
      nodeUser = String(ixConnect.loginResult.user.name);
    }
    return nodeUser;
  },

  /**
   * Retrieves a list of nodes which are successors to the node with the spezified ID.
   * The returned nodes could be filtered by type.
   * @param {de.elo.ix.client.WFDiagram} workflow The WFDiagram containing the workflow description
   * @param {String} nodeId The ID of the node
   * @param {Number} filterType (optional) The number of the type (use de.elo.ix.client.WFNodeC.TYPE_* for the types)
   * @param {String} nodeName (optional) The Name of the node
   * @param {Boolean} acceptNoNodes (optional) Accept no nodes
   * @return {de.elo.ix.client.WFNode[]}
   */
  getSuccessorNodes: function (workflow, nodeId, filterType, nodeName, acceptNoNodes) {
    var me = this,
        assocs = workflow.matrix.assocs,
        succNodes = [];

    assocs.forEach(function (assoc) {
      var node;
      if (assoc.nodeFrom == nodeId) {
        node = me.getNode(workflow, assoc.nodeTo);
        if ((!filterType || filterType == node.type) &&
            (!nodeName || nodeName == node.name || nodeName == node.nameTranslationKey)) {
          succNodes.push(node);
        }
      }
    });
    console.info("succNodes", succNodes);
    if (succNodes.length == 0) {
      console.error("getSuccessorNodes not succNodes available", nodeName);
      if (!acceptNoNodes) {
        throw "DemoTests.js getSuccessorNodes not succNodes available for '" + nodeName + "'";
      }
    }

    return succNodes;
  },

  /**
   * Retrieves the IDs of the successors nodes
   * @param {de.elo.ix.client.WFNode[]} succNodes
   * @return {String[]} IDs of succNodes
   */
  getSuccessorNodesIds: function (succNodes) {
    var succNodesIds = [];

    succNodes.forEach(function (node) {
      succNodesIds.push(node.id);
    });
    console.info("succNodesIds", succNodesIds);
    return succNodesIds;
  },

  /**
   * Returns a specific workflow.
   * @param {String} flowId Flow ID
   * @param {Object} params (optional)
   * @param {Boolean} params.inclFinished (optional) If `true`, the workflows will be returned, even if it is already finished
   * return {de.elo.ix.client.WFDiagram}
   * @return {Promise} promise
   */
  getWorkflow: function (flowId, params) {
    var ix = elo.IX.ix(),
        promise, promiseWorkflow, promiseWorkflow1;

    promise = new Promise (function (resolve, reject) {
      try {
        promiseWorkflow = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.ACTIVE, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
        promiseWorkflow.then(function success(workflow) {
          try {
            resolve(workflow);
          } catch (ex) {
            if (params && (params.inclFinished === true)) {
              promiseWorkflow1 = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.FINISHED, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
              promiseWorkflow1.then(function success1(workflow1) {
                try {
                  resolve(workflow1);
                } catch (ex1) {
                  reject(ex1);
                }
              }, function error(err) {
                reject(err);
              });
            } else {
              reject(ex);
            }
          }
        }, function error(err) {
          reject(err);
        });
      } catch (ex) {
        if (params && (params.inclFinished === true)) {
          promiseWorkflow1 = ix.checkoutWorkFlow(flowId, elo.CONST.WORKFLOW_TYPE.FINISHED, elo.CONST.WORKFLOW.mbAll, elo.CONST.LOCK.NO);
          promiseWorkflow1.then(function success1(workflow1) {
            try {
              resolve(workflow1);
            } catch (ex1) {
              reject(ex1);
            }
          }, function error(err) {
            reject(err);
          });
        } else {
          reject(ex);
        }
        reject(ex);
      }
    });
    return promise;
  },

  /**
   * Processing dynadhocflow cycle user.
   * @param {String} flowId Flow ID
   * @param {String} processNodeName (optional) processing node
   */
  _processDynAdhocFlow: function (flowId, processNodeName) {
    var me = this,
        userNodes = [],
        workflow, currentUser,
        nodeName, nodeIdCheckUsers, nodeIdUserProcessing,
        succNodes, succNodesIds;

    workflow = me.getWorkflow(flowId);
    userNodes = me.getActiveUserNodes(workflow);
    if (userNodes.length == 1) {
      nodeIdCheckUsers = userNodes[0].id;
    }
    succNodes = me.getSuccessorNodes(workflow, nodeIdCheckUsers, null, "OK");
    succNodesIds = me.getSuccessorNodesIds(succNodes);
    me.forwardWorkflowTask(flowId, nodeIdCheckUsers, succNodesIds, "Unittest process cycle", true);

    // processing all users
    workflow = me.getWorkflow(flowId, { inclFinished: true });
    userNodes = me.getActiveUserNodes(workflow);
    if (userNodes.length == 1) {
      nodeIdUserProcessing = userNodes[0].id;
    }
    while (userNodes.length > 0) {
      nodeName = processNodeName;
      succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName, true);
      succNodesIds = me.getSuccessorNodesIds(succNodes);

      if (succNodesIds.length == 0) {
        nodeName = "Confirm";
        succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName);
        succNodesIds = me.getSuccessorNodesIds(succNodes);
      }

      // change node user
      currentUser = me.getCurrentUserName();
      me.changeNodeUser(flowId, userNodes[0], currentUser);
      workflow = me.getWorkflow(flowId);
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
      me.forwardWorkflowTask(flowId, nodeIdUserProcessing, succNodesIds, "Unittest process " + nodeName, true);

      //get next user or group
      workflow = me.getWorkflow(flowId, { inclFinished: true });
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
    }
  },

  /**
   * Processing active users nodes.
   * @param {de.elo.ix.client.WFDiagram} workflow The WFDiagram containing the workflow description
   * @param {de.elo.ix.client.WFNode} userNode
   * @param {String} flowId Flow ID
   * @param {String} processNodeName (optional) processing node
   * @return {Promise} promise
   */
  processActiveUserNode: function (workflow, userNode, flowId, processNodeName) {
    var me = this,
        userNodes = [],
        nodeName, succNodes, succNodesIds,
        currentUser,
        promise, promiseChangeNodeUser, promiseGetWorkflow, promiseForwardWorkflowTask, promiseProcessActiveUserNode;

    promise = new Promise (function (resolve, reject) {
      try {
        nodeName = processNodeName;
        succNodes = me.getSuccessorNodes(workflow, userNode.id, null, nodeName, true);
        succNodesIds = me.getSuccessorNodesIds(succNodes);

        if (succNodesIds.length > 0) {
          // change node user
          currentUser = me.getCurrentUserName();
          promiseChangeNodeUser = me.changeNodeUser(flowId, userNode, currentUser);
          promiseChangeNodeUser.then(function success(changeNodeUserResult) {
            promiseForwardWorkflowTask = me.forwardWorkflowTask(flowId, userNode.id, succNodesIds, "Unittest process " + nodeName, true);
            promiseForwardWorkflowTask.then(function success1(forwardWorkflowTaskResult) {
              //get next user or group
              promiseGetWorkflow = me.getWorkflow(flowId);
              promiseGetWorkflow.then(function success2(workflow1) {
                workflow = workflow1;
                userNodes = me.getActiveUserNodes(workflow);
                if (userNodes.length > 0) {
                  promiseProcessActiveUserNode = me.processActiveUserNode(workflow, userNodes[0], flowId, processNodeName);
                  promiseProcessActiveUserNode.then(function success4(processActiveUserNodeResult) {
                    resolve(processActiveUserNodeResult);
                  }, function error(err) {
                    reject(err);
                  });
                } else {
                  resolve({});
                }
              }, function error(err) {
                reject(err);
              });
            }, function error(err) {
              reject(err);
            });
          }, function error(err) {
            reject(err);
          });
        }
        resolve({});
      } catch (ex) {
        reject(ex);
      }
    });
    return promise;

/*
     // processing all users
     while (userNodes.length > 0) {
      nodeName = processNodeName;
      succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName, true);
      succNodesIds = me.getSuccessorNodesIds(succNodes);

      if (succNodesIds.length == 0) {
        nodeName = "Confirm";
        succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName);
        succNodesIds = me.getSuccessorNodesIds(succNodes);
      }

      // change node user
      currentUser = me.getCurrentUserName();
      me.changeNodeUser(flowId, userNodes[0], currentUser);
      workflow = me.getWorkflow(flowId);
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
      me.forwardWorkflowTask(flowId, nodeIdUserProcessing, succNodesIds, "Unittest process " + nodeName, true);

      //get next user or group
      workflow = me.getWorkflow(flowId, { inclFinished: true });
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
    }

*/

  },

  /**
   * Processing all users.
   * @param {String} flowId Flow ID
   * @param {String} processNodeName (optional) processing node
   * @return {Promise} promise
   */
  processAllUsers: function (flowId, processNodeName) {
    var me = this,
        userNodes = [],
        promise, promiseWorkflow, promiseProcessActiveUserNode;

    promise = new Promise (function (resolve, reject) {
      promiseWorkflow = me.getWorkflow(flowId);
      promiseWorkflow.then(function success(workflow) {
        try {
          userNodes = me.getActiveUserNodes(workflow);
          if (userNodes.length > 0) {
            promiseProcessActiveUserNode = me.processActiveUserNode(workflow, userNodes[0], flowId, processNodeName);
            promiseProcessActiveUserNode.then(function success1(processActiveUserNodeResult) {
              try {
                resolve(processActiveUserNodeResult);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });


          } else {
            resolve({});
          }
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

  /**
   * Processing dynadhocflow cycle user.
   * @param {String} flowId Flow ID
   * @param {String} processNodeName (optional) processing node
   * @return {Promise} promise
   */
  /*
  processDynAdhocFlow: function (flowId, processNodeName) {
    var me = this,
        userNodes = [],
        nodeIdCheckUsers,
        succNodes, succNodesIds,
        promise, promiseWorkflow, promiseForwardWorkflowTask, promiseProcessAllUsers;

    promise = new Promise (function (resolve, reject) {
      promiseWorkflow = me.getWorkflow(flowId);
      promiseWorkflow.then(function success(workflow) {
        try {
          userNodes = me.getActiveUserNodes(workflow);
          if (userNodes.length == 1) {
            nodeIdCheckUsers = userNodes[0].id;
          }
          succNodes = me.getSuccessorNodes(workflow, nodeIdCheckUsers, null, "OK");
          succNodesIds = me.getSuccessorNodesIds(succNodes);
          promiseForwardWorkflowTask = me.forwardWorkflowTask(flowId, nodeIdCheckUsers, succNodesIds, "Unittest process cycle", true);
          promiseForwardWorkflowTask.then(function success1(forwardWorkflowTaskResult) {
            try {
              promiseProcessAllUsers = me.processAllUsers(flowId, processNodeName);
              promiseProcessAllUsers.then(function success2(promiseProcessAllUsersResult) {
                try {
                  resolve(promiseProcessAllUsersResult);
                } catch (ex) {
                  reject(ex);
                }
              }, function error(err) {
                reject(err);
              });
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });

        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
*/
/*
    // TODO processing all users
    workflow = me.getWorkflow(flowId, { inclFinished: true });
    userNodes = me.getActiveUserNodes(workflow);
    if (userNodes.length == 1) {
      nodeIdUserProcessing = userNodes[0].id;
    }
    while (userNodes.length > 0) {
      nodeName = processNodeName;
      succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName, true);
      succNodesIds = me.getSuccessorNodesIds(succNodes);

      if (succNodesIds.length == 0) {
        nodeName = "Confirm";
        succNodes = me.getSuccessorNodes(workflow, nodeIdUserProcessing, null, nodeName);
        succNodesIds = me.getSuccessorNodesIds(succNodes);
      }

      // change node user
      currentUser = me.getCurrentUserName();
      me.changeNodeUser(flowId, userNodes[0], currentUser);
      workflow = me.getWorkflow(flowId);
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
      me.forwardWorkflowTask(flowId, nodeIdUserProcessing, succNodesIds, "Unittest process " + nodeName, true);

      //get next user or group
      workflow = me.getWorkflow(flowId, { inclFinished: true });
      userNodes = me.getActiveUserNodes(workflow);
      if (userNodes.length == 1) {
        nodeIdUserProcessing = userNodes[0].id;
      }
    }
  },
*/


  /**
   * Removes finished workflows.
   * @param {de.elo.ix.client.WFDiagram[]} workflows
   * @return {Promise} promise
   */
  removeFinishedWorkflows: function (workflows) {
    var ix = elo.IX.ix(),
        promise, promisesDeleteWorkFlows, promiseDeleteWorkflow;

    promise = new Promise (function (resolve, reject) {
      try {
        promisesDeleteWorkFlows = [];
        workflows.forEach(function (wf) {
          promiseDeleteWorkflow = ix.deleteWorkFlow(wf.id, elo.CONST.WORKFLOW_TYPE.FINISHED, elo.CONST.LOCK.NO);
          promiseDeleteWorkflow.then(function success(deleteWorkFlowResult) {
            try {
              resolve(deleteWorkFlowResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
          promisesDeleteWorkFlows.push(promiseDeleteWorkflow);
        });
        Promise.all(promisesDeleteWorkFlows).then(function success(allResult) {
          try {
            resolve(allResult);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });

      } catch (ex) {
        reject(ex);
      }
    });
    return promise;
  },

  /**
   * Removes active workflows.
   * @param {de.elo.ix.client.WFDiagram[]} workflows
   * @return {Promise} promise
   */
  removeActiveWorkflows: function (workflows) {
    var ix = elo.IX.ix(),
        promise, promisesDeleteWorkFlows, promiseDeleteWorkflow;

    promise = new Promise (function (resolve, reject) {
      try {
        promisesDeleteWorkFlows = [];
        workflows.forEach(function (wf) {
          promiseDeleteWorkflow = ix.deleteWorkFlow(wf.id, elo.CONST.WORKFLOW_TYPE.ACTIVE, elo.CONST.LOCK.FORCE);
          promiseDeleteWorkflow.then(function success(deleteWorkFlowResult) {
            try {
              resolve(deleteWorkFlowResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
          promisesDeleteWorkFlows.push(promiseDeleteWorkflow);
        });
        Promise.all(promisesDeleteWorkFlows).then(function success(allResult) {
          try {
            resolve(allResult);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });

      } catch (ex) {
        reject(ex);
      }
    });
    return promise;
  },

  /**
   * Starts a workflow.
   * @param {String} templFlowId Name or ID of the template which should be started
   * @param {String} flowName Name of the new workflow
   * @param {String} objId Object on which the workflow should be started
   * @param {Number} prio (optional) If specified, the workflow priority will be changed (0=high, 1=medium, 2=low)
   * return {Number} The ID, of the started workflow
   * @return {Promise} promise
   */
  startWorkflow: function (templFlowId, flowName, objId, prio) {
    var me = this,
        ix = elo.IX.ix(),
        promise, promiseFlowId, promisechangeWorkflowPriority;

    promise = new Promise (function (resolve, reject) {
      promiseFlowId = ix.startWorkFlow(templFlowId, flowName, objId);
      promiseFlowId.then(function success(flowId) {
        try {
          if (typeof prio !== "undefined") {
            promisechangeWorkflowPriority = me.changeWorkflowPriority(flowId, prio);
            promisechangeWorkflowPriority.then(function success1(changeWorkflowPriorityResult) {
              try {
                resolve(flowId);
              } catch (ex) {
                reject(ex);
              }
            }, function error(err) {
              reject(err);
            });
          } else {
            resolve(flowId);
          }
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },

  /**
   * Assume workflow task to current user
   * @param {String} flowId Flow ID
   * @param {String} nodeId The ID of the node
   */
  _takeWorkflowTask: function (flowId, nodeId) {
    var ix = elo.IX.ix(),
        me = this,
        currentUser;

    currentUser = me.getCurrentUserName();
    ix.takeWorkFlowNode(flowId, nodeId, currentUser, elo.CONST.TAKE_NODE.RESET_IN_USE_DATE, elo.CONST.LOCK.FORCE);
  },

  /**
   * Updates a bunch of wfmap data at once.
   * @param {Object} flowId
   * @param {Object} objId
   * @param {Object} mapData Key-value-pairs with key=field and value=new value
   * @return {Promise} promise
   */
  updateWfMapData: function (flowId, objId, mapData) {
    var ix = elo.IX.ix(),
        mapEntries = [],
        key, containsKey, i,
        promise, promiseMapData, promiseCheckinMap;

    promise = new Promise (function (resolve, reject) {
      promiseMapData = ix.checkoutMap(elo.CONST.MAP_CONFIG.DOMAIN_WORKFLOW_ACTIVE, flowId, null, elo.CONST.LOCK.NO);
      promiseMapData.then(function success(mapData1) {
        try {
          mapEntries = mapData1.items;
          for (key in mapData) {
            containsKey = false;
            for (i = 0; i < mapEntries.length; i++) {
              if (mapEntries[i].key == key) {
                containsKey = true;
                mapEntries[i].value = mapData[key];
              }
            }
            if (!containsKey) {
              mapEntries.push(new de.elo.ix.client.KeyValue(key, mapData[key]));
            }
          }
          promiseCheckinMap = ix.checkinMap(elo.CONST.MAP_CONFIG.DOMAIN_WORKFLOW_ACTIVE, flowId, objId, mapEntries, elo.CONST.LOCK.NO);
          promiseCheckinMap.then(function success1(checkinMapResult) {
            try {
              resolve(checkinMapResult);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Returns the value of an map entry field
   * @param {String} flowId wf id
   * @param {String} keyname Name of the map entry field
   * return {String} The field value
   * @return {Promise} promise
   */
  getWfMapValue: function (flowId, keyname) {
    var ix = elo.IX.ix(),
        data = {}, i, items,
        promise, promiseCheckOutMap;

    promise = new Promise (function (resolve, reject) {
      promiseCheckOutMap = ix.checkoutMap(elo.CONST.MAP_CONFIG.DOMAIN_WORKFLOW_ACTIVE, flowId, null, elo.CONST.LOCK.NO);
      promiseCheckOutMap.then(function success(mapData) {
        try {
          items = mapData.items;
          for (i = 0; i < items.length; i++) {
            data[items[i].key] = items[i].value;
          }
          resolve(data[keyname]);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });

    });
    return promise;
  },


  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#   UserUtils  #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Get name of current user
   * @return {String} username
   */
  getCurrentUserName: function () {
    var userName;

    userName = elo.IX.getUserName();
    return userName;
  },

  /**
   * Get ID of current user
   * return {String} ID
   * @return {Promise} promise
   */
  getCurrentUserId: function () {
    var me = this,
        promise, promiseUserInfo;

    promise = new Promise (function (resolve, reject) {
      promiseUserInfo = me.getUserInfo(me.getCurrentUserName());
      promiseUserInfo.then(function success(userInfo) {
        if (userInfo) {
          resolve (userInfo.id);
        }
        resolve(null);
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },
  /**
   * Checkout userfolder
   * @param {String|de.elo.ix.client.UserInfo} user The name, GUID or ID of the user (or an UserInfo object)
   * @return {de.elo.ix.client.Sord} sord
   */
  _getUserFolder: function (user) {
    var me = this,
        ix = elo.IX.ix(),
        userGuid = me.getUserInfo(user).guid;

    return ix.checkoutSord("OKEY:ELOUSERGUID=" + userGuid, elo.CONST.EDIT_INFO.mbSord, elo.CONST.LOCK.NO).sord;
  },

  /**
   * Checkout userfolder
   * @param {String|de.elo.ix.client.UserInfo} user The name, GUID or ID of the user (or an UserInfo object)
   * @return {de.elo.ix.client.Sord} sord
   */
  getUserFolder: function (user) {
    var me = this,
        ix = elo.IX.ix(),
        userGuid,
        promise, promiseGetUserInfo, promiseCheckoutSord;

    promise = new Promise (function (resolve, reject) {
      promiseGetUserInfo = me.getUserInfo(user);
      promiseGetUserInfo.then(function success(userInfo) {
        userGuid = userInfo.guid;
        promiseCheckoutSord = ix.checkoutSord("OKEY:ELOUSERGUID=" + userGuid, elo.CONST.EDIT_INFO.mbSord, elo.CONST.LOCK.NO);
        promiseCheckoutSord.then(function success1(userFolder) {
          try {
            resolve(userFolder.sord);
          } catch (ex) {
            reject(ex);
          }
        }, function error(err) {
          reject(err);
        });


      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Retrieves UserInfo objects.
   * @param {String[]} users The names, GUIDs or IDs of the users
   * @return {de.elo.ix.client.UserInfo[]} The retrieved UserInfo objects
   */
  _getUserInfos: function (users) {
    var ix = elo.IX.ix();

    return ix.checkoutUsers(users, elo.CONST.CHECKOUT_USERS.BY_IDS_RAW, elo.CONST.LOCK.NO);
  },

  /**
   * Retrieves UserInfo objects.
   * @param {String[]} users The names, GUIDs or IDs of the users
   * return {de.elo.ix.client.UserInfo[]} The retrieved UserInfo objects
   * @return {Promise} promise
   */
  getUserInfos: function (users) {
    var ix = elo.IX.ix(),
        promise, promiseCheckoutUsers;

    promise = new Promise (function (resolve, reject) {
      promiseCheckoutUsers = ix.checkoutUsers(users, elo.CONST.CHECKOUT_USERS.BY_IDS_RAW, elo.CONST.LOCK.NO);
      promiseCheckoutUsers.then(function success(UserInfos) {
        try {
          resolve(UserInfos);
        } catch (ex) {
          reject(ex);
        }
      }, function error(err) {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * Retrieves an UserInfo object.
   *
   * If the parameter is already an UnserInfo, it returns the object itself.
   * Therefore this function can be used to make sure you're dealing with an UserInfo and not just a user name.
   *
   * @param {String|de.elo.ix.client.UserInfo} user The name, GUID or ID of the user (or an UserInfo object)
   * return {de.elo.ix.client.UserInfo} The UserInfo object, if one was found
   * @return {Promise} promise
   */
  getUserInfo: function (user) {
    var me = this,
        promise, promiseGetUserInfos;

    promise = new Promise (function (resolve, reject) {
      try {
        if (user instanceof de.elo.ix.client.UserInfo) {
          resolve(user);
        } else {
          promiseGetUserInfos = me.getUserInfos([user]);
          promiseGetUserInfos.then(function success(userInfos) {
            try {
              resolve((userInfos && userInfos.length > 0) ? userInfos[0] : null);
            } catch (ex) {
              reject(ex);
            }
          }, function error(err) {
            reject(err);
          });

        }
      } catch (ex) {
        reject(ex);
      }

    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  TimerUtils  #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Set Timeout
   * @param {Number} timestamp
   * @return {Promise} promise
   */
  setTimeout: function (timestamp) {
    var promise;

    promise = new Promise (function (resolve, reject) {
      console.log("TIMEOUT START");
      window.setTimeout(function () {
        console.log("TIMEOUT END");
        resolve("TIMEOUT END");
      }, timestamp);

    });
    return promise;
  },

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#  DateUtils   #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++#              #+++++++++++++++++++++++++++++++++++++ //
  // ++++++++++++++++++++++++++++++++++++################+++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

  /**
   * Get Current date und time
   * @param {Number} offsetDays (optional) offset days to current date
   * @return {Object} {date: 'YYYYMMDD', time: 'hh:mm'}
   */
  getNowDateTime: function (offsetDays) {
    var nowDateTime = {},
        offsetDaysFromNow = 0,
        now, YYYY, MM, DD, hh, mm;

    now = new Date();
    if (offsetDays) {
      offsetDaysFromNow = now.setDate(now.getDate() + offsetDays);
      now = new Date(offsetDaysFromNow);
    }
    YYYY = String(now.getFullYear());
    MM = now.getMonth() + 1;
    if (MM < 10) {
      MM = "0" + MM;
    } else {
      MM = "" + MM;
    }
    DD = String(now.getDate());
    if (DD < 10) {
      DD = "0" + DD;
    } else {
      DD = "" + DD;
    }
    hh = String(now.getHours());
    if (hh < 10) {
      hh = "0" + hh;
    } else {
      hh = "" + hh;
    }
    mm = String(now.getMinutes());
    if (mm < 10) {
      mm = "0" + mm;
    } else {
      mm = "" + mm;
    }
    nowDateTime.date = "" + YYYY + MM + DD;
    nowDateTime.time = hh + ":" + mm;

    return nowDateTime;
  }

});



