
importPackage(Packages.de.elo.ix.client);

//@include lib_Class.js
//@include lib_sol.common.Config.js
//@include lib_sol.common.SordUtils.js
//@include lib_sol.common.DateUtils.js
//@include lib_sol.common.ix.ServiceBase.js
//@include lib_sol.checklist.Utils.js

var logger = sol.create("sol.Logger", { scope: "sol.checklist.ix.services.Checklist" });

/**
 * Provides service functions for the checklist module.
 *
 * The element used as checklist, has to define a `SOL_TYPE` field with the value from the checklist configuration defined in `checklist.solObjectType`.
 *
 * # Model
 * The model of the checklist is stored in the description of a sord as JSON string.
 *
 * A checklist contains an `items` property which holds an array of checklist items.
 *
 * Each checklist item has the following form:
 *
 *     {
 *       id: 23,
 *       text: "a label",
 *       notes: "a description",                      // optional
 *       checked: true,
 *       checkDate: "20160824113000",                 // only set, if checked=true
 *       checkUser: { id: "7", name: "mmustermann" }, // only set, if checked=true
 *       marked: false
 *     }
 *
 * # Results
 * All function (except {@link #RF_sol_checklist_service_ReadChecklist ReadChecklist}) return a standardized response format:
 *
 *     {
 *       status: "SUCCESS"        // possible values: SUCCESS|FAILURE|RECURRENCE
 *       item: {...}              // optional, e.g. added, removed, updated item
 *       error: "some.error.code" // only if 'status' is 'FAILURE'
 *     }
 *
 * ## Errorcodes
 *
 * |Code|Description|
 * |:------|:------|
 * |checklist.save|Error while saving checklist|
 * |checklist.item.invalid||
 * |checklist.item.notFound|Item not found|
 * |checklist.item.notMoved|Item not moved|
 * |checklist.missing.itemId|Missing property 'itemId'|
 * |checklist.missing.check|Missing property 'check'|
 * |checklist.missing.mark|Missing property 'mark'|
 * |checklist.missing.item.id|Edit item has not defined an 'id'|
 * |checklist.missing.fromIdx|Missing property 'fromIdx'|
 * |checklist.missing.toIdx|Missing property 'toIdx'|
 *
 * # Usage
 *
 * ## Edit checklist
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_EditChecklist", { objId: "4711",  checklistname: "checklist4711", checklistdesc: "Water cologne" });
 *
 *     // result //
 *     {
 *       status: "SUCCESS"
 *     }
 *
 * ## Read checklist
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_ReadChecklist", { objId: "4711" });
 *
 *     // result //
 *     {
 *       items: [ ... ],
 *       writable: true
 *     }
 *
 * ## Move an checklist item
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_MoveItem", {
 *       objId: "4711",
 *       fromIdx: 2,
 *       toIdx: 4
 *     });
 *
 *     // result (the added item) //
 *     {
 *       status: "SUCCESS"
 *     }
 *
 * ## Add checklist item
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_AddItem", {
 *       objId: "4711",
 *       item: {
 *         text: "a label",
 *         notes: "optional description"
 *       }
 *     });
 *
 *     // result (the added item) //
 *     {
 *       status: "SUCCESS",
 *       item: {
 *         id: 23,
 *         text: "a label",
 *         notes: "optional description",
 *         checked: false,
 *         marked: false
 *       }
 *     }
 *
 * ## Remove checklist item
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_RemoveItem", {
 *       objId: "4711",
 *       itemId: 23
 *     });
 *
 *     // result (including the removed item) //
 *     {
 *       status: "SUCCESS",
 *       item: {
 *         id: 23,
 *         text: "a label",
 *         notes: "optional description",
 *         checked: false,
 *         marked: false
 *       }
 *     }
 *
 * ## Edit checklist item
 * Only `text` and `notes` can be edited this way.
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_EditItem", {
 *       objId: "4711",
 *       item: {
 *         id: 23,
 *         text: "an edited label",
 *         notes: "edit"
 *       }
 *     });
 *
 *     // result //
 *     {
 *       status: "SUCCESS",
 *       item: {
 *         id: 23,
 *         text: "an edited label",
 *         notes: "edit",
 *         checked: false,
 *         marked: false
 *       }
 *     }
 *
 * ## Check checklist item
 * Check an item:
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_CheckItem", {
 *       objId: "4711",
 *       itemId: 23,
 *       check: true
 *     });
 *
 *     // result //
 *     {
 *       status: "SUCCESS",
 *       item: {
 *         id: 23,
 *         text: "a label",
 *         notes: "optional description",
 *         checked: true,
 *         checkDate: "20160824113000",
 *         checkUser: { id: "7", name: "mmustermann" },
 *         marked: false
 *       }
 *     }
 *
 * Uncheck an item:
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_CheckItem", {
 *       objId: "4711",
 *       itemId: 23,
 *       check: false
 *     });
 *
 *     // result //
 *     {
 *       status: "SUCCESS",
 *       item: {
 *         id: 23,
 *         text: "a label",
 *         notes: "optional description",
 *         checked: false,
 *         marked: false
 *       }
 *     }
 *
 * Uncheck again:
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_CheckItem", {
 *       objId: "4711",
 *       itemId: 23,
 *       check: false
 *     });
 *
 *     // result, item was not altered, but will be returned anyway (it might have been altered by another user) //
 *     {
 *       status: "RECURRENCE",
 *       item: {
 *         id: 23,
 *         text: "a label",
 *         notes: "optional description",
 *         checked: false,
 *         marked: false
 *       }
 *     }
 *
 * ## Mark checklist item
 * Mark an item:
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_MarkItem", {
 *       objId: "4711",
 *       itemId: 23,
 *       mark: true
 *     });
 *
 * Unmark an item:
 *
 *     sol.common.IxUtils.execute("RF_sol_checklist_service_MarkItem", {
 *       objId: "4711",
 *       itemId: 23,
 *       mark: false
 *     });
 *
 * Results equivalent to checking and unchecking.
 *
 * @author PZ, ELO Digital Office GmbH
 * @version 1.00.000
 *
 * @eloix
 * @requires moment.js
 * @requires sol.common.Config
 * @requires sol.common.SordUtils
 * @requires sol.common.DateUtils
 * @requires sol.common.ix.RfUtils
 * @requires sol.common.ix.ServiceBase
 */
sol.define("sol.checklist.ix.services.Checklist", {
  extend: "sol.common.ix.ServiceBase",

  requiredConfig: ["objId"],

  /**
   * @private
   * @property {de.elo.ix.client.SordZ}
   */
  sordZ: SordC.mbAllIndex,

  /**
   * @private
   * @property {Object}
   */
  STATUS: {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    RECURRENCE: "RECURRENCE"
  },

  initialize: function (config) {
    var me = this;
    me.$super("sol.common.ix.ServiceBase", "initialize", [config]);

    me.sord = ixConnect.ix().checkoutSord(me.objId, me.sordZ, LockC.NO);

    if (!sol.checklist.Utils.isChecklist(me.sord)) {
      throw "selected element is not a checklist";
    }
  },

  /**
   * Loads the checklist object from the description of a Sord.
   * @return {Object} The checklist
   */
  readChecklist: function () {
    var me = this,
        desc, checklist;

    try {
      desc = String(me.sord.desc);

      if (desc && (desc.length > 0)) {
        checklist = JSON.parse(desc);
      }
    } catch (ex) {
      me.logger.warn("error parsing checklist from sord description", ex);
    }

    if (!checklist || !checklist.items) {
      checklist = { items: [] };
    }

    checklist.writable = me.hasWriteAccess(me.sord);
    return checklist;
  },

  /**
   * Moves an item.
   * @return {Object} The checklist
   */
  moveItem: function () {
    var me = this,
        checklist, moved, success, status, error;

    if (typeof me.fromIdx === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.fromIdx");
    }

    if (typeof me.toIdx === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.toIdx");
    }

    checklist = me.readChecklist();

    moved = me.moveItemInArray(checklist.items, me.fromIdx, me.toIdx);
    if (!moved) {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.item.notMoved");
    }

    success = me.saveChecklist(checklist);
    status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
    error = (!success) ? "checklist.save" : null;

    return me.buildResponse(status, null, error);
  },

  /**
   * Adds an item to a checklist.
   * @return {Object}
   */
  addItem: function () {
    var me = this,
        checklist, newItem, success, status, error;

    if (!me.validateItem(me.item)) {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.item.invalid");
    }

    checklist = me.readChecklist();

    newItem = {
      id: sol.checklist.Utils.getNextId(checklist),
      text: me.item.text,
      checked: false,
      marked: false
    };

    if (me.item.notes) {
      newItem.notes = me.item.notes;
    }

    checklist.items.push(newItem);

    success = me.saveChecklist(checklist);
    status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
    error = (!success) ? "checklist.save" : null;

    return me.buildResponse(status, newItem, error);
  },

  /**
   * Removes an item from a checklist.
   * @return {Object}
   */
  removeItem: function () {
    var me = this,
        checklist, idx, removedItems, success, status, error, removedItem;

    if (typeof me.itemId === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.itemId");
    }

    checklist = me.readChecklist();
    idx = me.getItemIndex(checklist, me.itemId);

    if (typeof idx !== "undefined") {
      removedItems = checklist.items.splice(idx, 1);
      success = me.saveChecklist(checklist);
      status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
      error = (!success) ? "checklist.save" : null;
    } else {
      status = me.STATUS.FAILURE;
      error = "checklist.item.notFound";
    }

    removedItem = (success && removedItems && (removedItems.length === 1)) ? removedItems[0] : null;

    return me.buildResponse(status, removedItem, error);
  },

  /**
   * Edits an item of a checklist.
   * @return {Boolean}
   */
  editItem: function () {
    var me = this,
        checklist, idx, editedItem, success, status, error;

    if (!me.validateItem(me.item)) {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.item.invalid");
    }

    if (typeof me.item.id === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.item.id");
    }

    checklist = me.readChecklist();
    idx = me.getItemIndex(checklist, me.item.id);

    if (typeof idx !== "undefined") {
      me.mergeItem(checklist.items[idx], me.item);
      editedItem = checklist.items[idx];
      success = me.saveChecklist(checklist);
      status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
      error = (!success) ? "checklist.save" : null;
    } else {
      status = me.STATUS.FAILURE;
      error = "checklist.item.notFound";
    }

    return me.buildResponse(status, editedItem, error);
  },

  /**
   * Marks an item as checked/unchecked and handles the `checkUser` and `checkDate` attributes.
   * @return {Object}
   */
  checkItem: function () {
    var me = this,
        checklist, idx, checkedItem, dirty, success, status, error;

    if (typeof me.itemId === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.itemId");
    }

    if (typeof me.check === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.check");
    }

    if (!me.user) {
      me.user = ixConnect.loginResult.user;
      me.logger.debug(["use user from ixConnect: name={0}, id={1}", me.user.name, me.user.id]);
    }

    checklist = me.readChecklist();
    idx = me.getItemIndex(checklist, me.itemId);

    if (typeof idx !== "undefined") {
      checkedItem = checklist.items[idx];
      dirty = me.checkItemObject(checklist.items[idx], me.check, me.user);
      if (dirty) {
        success = me.saveChecklist(checklist);
        status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
        error = (!success) ? "checklist.save" : null;
      } else {
        status = me.STATUS.RECURRENCE;
      }
    } else {
      status = me.STATUS.FAILURE;
      error = "checklist.item.notFound";
    }

    return me.buildResponse(status, checkedItem, error);
  },

  /**
   * Marks an item as marked.
   * @return {Object}
   */
  markItem: function () {
    var me = this,
        checklist, idx, markedItem, success, status, error;

    if (typeof me.itemId === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.itemId");
    }

    if (typeof me.mark === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.mark");
    }

    checklist = me.readChecklist();
    idx = me.getItemIndex(checklist, me.itemId);

    if (typeof idx !== "undefined") {
      markedItem = checklist.items[idx];
      if (checklist.items[idx].marked !== me.mark) {
        checklist.items[idx].marked = me.mark;
        success = me.saveChecklist(checklist);
        status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
        error = (!success) ? "checklist.save" : null;
      } else {
        status = me.STATUS.RECURRENCE;
      }
    } else {
      status = me.STATUS.FAILURE;
      error = "checklist.item.notFound";
    }

    return me.buildResponse(status, markedItem, error);
  },

  /**
   * @private
   * Checks, if a sord was checked out with write access.
   * @param {de.elo.ix.client.Sord} sord
   * @return {Boolean}
   */
  hasWriteAccess: function (sord) {
    var flags, hasWriteAccess;

    flags = sord.access;
    hasWriteAccess = (flags & CONST.ACCESS.LUR_WRITE) === CONST.ACCESS.LUR_WRITE;

    return hasWriteAccess;
  },

  /**
   * @private
   * Checks if an item is valid.
   * @param {Object} item
   * @return {Boolean}
   */
  validateItem: function (item) {
    if (!item || !item.text) {
      return false;
    }
    return true;
  },

  /**
   * @private
   * Saves a checklist
   * @param {Object} checklist
   * @return {Boolean}
   */
  saveChecklist: function (checklist) {
    var me = this,
        success = false,
        desc;

    try {
      checklist.writable = undefined;
      desc = JSON.stringify(checklist, null, 2);
      me.sord.desc = desc;
      ixConnect.ix().checkinSord(me.sord, me.sordZ, LockC.NO);
      success = true;
    } catch (ex) {
      me.logger.warn("error saving checklist to sord description", ex);
    }
    return success;
  },

  /**
   * @private
   * Edits a checklist
   * @param {Object} checklist
   * @return {Boolean}
   */
  editChecklist: function () {
    var me = this,
        checklist, success, status, error;

    if (typeof me.checklistname === "undefined") {
      return me.buildResponse(me.STATUS.FAILURE, null, "checklist.missing.name");
    }

    checklist = me.readChecklist();


    if (me.checklistname) {
      me.sord.name = me.checklistname;
    }

    if (me.checklistdesc) {
      sol.common.SordUtils.setObjKeyValue(me.sord, "CHECKLIST_DESC", me.checklistdesc);
    }

    success = me.saveChecklist(checklist);
    status = (success) ? me.STATUS.SUCCESS : me.STATUS.FAILURE;
    error = (!success) ? "checklist.save" : null;

    return me.buildResponse(status, null, error);

  },

  /**
   * @private
   * Retrieves the index of an item by the ID.
   * @param {Object} checklist
   * @param {Number} id
   * @return {Number}
   */
  getItemIndex: function (checklist, id) {
    var i, idx;
    for (i = 0; i < checklist.items.length; i++) {
      if (checklist.items[i].id === id) {
        idx = i;
        break;
      }
    }
    return idx;
  },

  /**
   * @private
   * Merges an item to another.
   * @param {Object} dst Destination item
   * @param {Object} src Source item
   */
  mergeItem: function (dst, src) {
    if (!dst || !src) {
      return;
    }
    if (src.text) {
      dst.text = src.text;
    }
    if (!sol.common.StringUtils.isBlank(src.notes)) {
      dst.notes = src.notes;
    } else {
      dst.notes = undefined;
    }
  },

  /**
   * @private
   * Moves an element inside an array from one position to another.
   * @param {Object[]} items
   * @param {Number} fromIdx
   * @param {Number} toIdx
   * @return {Boolean}
   */
  moveItemInArray: function (items, fromIdx, toIdx) {
    if ((fromIdx < 0) || (fromIdx >= items.length)) {
      return false;
    }
    if (toIdx < 0) {
      toIdx = 0;
    }
    if (toIdx >= items.length) {
      toIdx = items.length - 1;
    }
    items.splice(toIdx, 0, items.splice(fromIdx, 1)[0]);
    return true;
  },

  /**
   * @private
   * Checks, or unchecks an item.
   * @param {Object} item
   * @param {Boolean} check
   * @param {de.elo.ix.client.UserInfo} user (optional) only required if `check` is `true`
   * @return {Boolean}
   */
  checkItemObject: function (item, check, user) {
    var me = this,
        edited = false;
    if ((check === true) && (item.checked !== true)) {
      item.checked = true;
      item.checkDate = sol.common.DateUtils.dateToIso(new Date());
      item.checkUser = me.createUser(user);
      edited = true;
    } else if ((check === false) && (item.checked === true)) {
      item.checked = false;
      item.checkDate = undefined;
      item.checkUser = undefined;
      edited = true;
    }
    return edited;
  },

  /**
   * @private
   * Creates a user representation.
   * @param {de.elo.ix.client.UserInfo} user
   * @return {Object} A user representation
   * @return {String} return.id The user id
   * @return {String} return.name The ELO user name
   */
  createUser: function (user) {
    var userObj;
    if (user) {
      userObj = {
        id: String(user.id),
        name: String(user.name)
      };
    }
    return userObj;
  },

  /**
   * @private
   * Builds the response object.
   * @param {String} status
   * @param {Object} item (optional)
   * @param {String} error (optional)
   * @return {Object}
   */
  buildResponse: function (status, item, error) {
    var response = { status: status };
    if (item) {
      response.item = item;
    }
    if (error) {
      response.error = error;
    }
    return response;
  }

});

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_ReadChecklist
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_ReadChecklist(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_ReadChecklist", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.readChecklist());

  logger.exit("RF_sol_checklist_service_ReadChecklist", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_EditChecklist
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_EditChecklist(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_EditChecklist", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.editChecklist());

  logger.exit("RF_sol_checklist_service_EditChecklist", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_MoveItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_MoveItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_MoveItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.moveItem());

  logger.exit("RF_sol_checklist_service_MoveItem", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_AddItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_AddItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_AddItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.addItem());

  logger.exit("RF_sol_checklist_service_AddItem", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_RemoveItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_RemoveItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_RemoveItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.removeItem());

  logger.exit("RF_sol_checklist_service_RemoveItem", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_EditItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_EditItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_EditItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.editItem());

  logger.exit("RF_sol_checklist_service_EditItem", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_CheckItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_CheckItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_CheckItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  params.user = ec.user;
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.checkItem());

  logger.exit("RF_sol_checklist_service_CheckItem", result);

  return result;
}

/**
 * @member sol.checklist.ix.services.Checklist
 * @method RF_sol_checklist_service_MarkItem
 * @static
 * @inheritdoc sol.common.ix.ServiceBase#RF_ServiceBaseName
 */
function RF_sol_checklist_service_MarkItem(ec, args) {
  var rfUtils = sol.common.ix.RfUtils,
      params, service, result;

  logger.enter("RF_sol_checklist_service_MarkItem", args);

  params = rfUtils.parseAndCheckParams(ec, arguments.callee.name, args, "objId");
  service = sol.create("sol.checklist.ix.services.Checklist", params);
  result = rfUtils.stringify(service.markItem());

  logger.exit("RF_sol_checklist_service_MarkItem", result);

  return result;
}
