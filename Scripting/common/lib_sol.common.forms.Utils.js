/*
 * sol.common.forms.Utils.initializeForm function will be executed when the page is loaded as long this script file is included.
 */
window.$initFrame = window.initFrame;
window.initFrame = function () {
  window.$initFrame && window.$initFrame();
  window.setTimeout(function () {
    sol.common.forms.Utils.initializeForm();
  }, 100);
};

/**
 * Helper functions for ELOwf forms
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.03.006
 *
 * @requires sol.common.ObjectUtils
 */

sol.define("sol.common.forms.Utils", {

  singleton: true,

  unitSuffix: "_UNIT",

  wfMapSavedFlag: "WF_MAP_FORM_SAVED",

  roundingFunctions: {

    CHF: function (decimal) {
      var roundedDecimal;

      roundedDecimal = decimal.times(20).toDecimalPlaces(0).dividedBy(20);

      return roundedDecimal;
    }
  },

  /**
   * Hides the tab bar if only one tab was added to the form.
   */
  hideTabBarIfOnlyOneTab: function () {
    var me = this, i, tabs, firstTabContainer = document.querySelector(".tabs");
    if (firstTabContainer) {
      tabs = firstTabContainer.querySelectorAll(".tabs > ul > li");
      if (tabs.length <= 1) {
        document.getElementById("elotable").className += " hideTabBar";
      } else {
        for (i in tabs) {
          tabs[i].onclick = me.scrollToTop;
        }
      }
    }
  },

  /**
   * Reset form layout if page content changes.
   */
  resetFormLayout: function () {
    var d = document.getElementById("elo_wf_form");
    if (d) {
      d.classList.add("hidden");
      setTimeout(function () {
        document.getElementById("elo_wf_form").classList.remove("hidden");
      }, 10);
    }
  },

  /**
   * Scroll to top of the page.
   */
  scrollToTop: function () {
    document.body.scrollTop = 0;
    sol.common.forms.Utils.resetFormLayout();
  },

  /**
   * Set main header if class is set.
   */
  setMainHeader: function () {
    var headTables, i, headTable, headerHeight, tabContainer;
    if (document.querySelector(".mainheader")) {
      headTables = document.querySelectorAll("#elotable .edittable");
      if (headTables.length >= 1) {
        for (i in headTables) {
          if (headTables[i].querySelector(".mainheader")) {
            headTable = headTables[i];
            headTable.className += " mainheadertable";
            headerHeight = headTable.offsetHeight;
            tabContainer = headTable.nextElementSibling;
            if (tabContainer) {
              tabContainer.style.marginTop = headerHeight - 3 + "px";
            }
            if (document.querySelector("#topnotification")) {
              headTable.className += " notificationheader";
            }
            break;
          }
        }
      }
    }
  },

  /**
   * Set responsive flag if class is set.
   */
  setResponsive: function () {
    var me = this, i, viewport, formElements, formElement;

    if (document.querySelector(".responsive")) {

      // Set mobile viewport meta info
      viewport = document.querySelector("meta[name=viewport]");
      if (viewport) {
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
      } else {
        viewport = document.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
        document.getElementsByTagName("head")[0].appendChild(viewport);
      }

      // Add class .elo-responsive to all relevant edittables
      formElements = document.querySelectorAll("#elotable .edittable");
      if (formElements.length >= 1) {
        for (i in formElements) {
          formElement = formElements[i];
          if (formElement.tagName && formElement.querySelector(".responsive")) {
            formElement.className += " elo-responsive";
          }
        }
      }

      // Add class .formlistheader to all relevant tr elements
      formElements = document.querySelectorAll("#elotable tr td.formlistheader:first-child");
      if (formElements.length >= 1) {
        for (i in formElements) {
          formElement = formElements[i];
          if (formElement.tagName) {
            formElement.parentNode.className += " formlistheader";
          }
        }
      }

      // Resize fix for Java Client
      if (/javafx/.test(navigator.userAgent.toLowerCase())) {
        window.onresize = me.resetFormLayout;
      }
    }
  },

  /**
   * Register table navigation
   */
  registerTableNavigation: function () {
    var me = this;
    document.addEventListener("keydown", me.navigateTable.bind(me), false);
  },

  keyCodeArrowLeft: 37,
  keyCodeArrowUp: 38,
  keyCodeArrowRight: 39,
  keyCodeArrowDown: 40,

  navigateTable: function (event) {
    var me = this,
        isArrowKey, field, fieldName, baseFieldName, fieldNameIndex, nextField,
        dynKwlCmp = document.getElementById("keywordlist");

    isArrowKey = me.isArrowKey(event.keyCode);
    if (!isArrowKey
          || (dynKwlCmp && dynKwlCmp.offsetLeft >= 0)) {
      // disable if dynKwl is opened
      return;
    }

    field = event.target;
    fieldName = field.name;
    fieldNameIndex = me.getFieldNameIndex(fieldName);
    if (fieldNameIndex == "") {
      return;
    }

    switch (event.keyCode) {
      case me.keyCodeArrowLeft:
        if ((typeof field.selectionStart != "number") || (field.selectionStart == 0)) {
          nextField = me.getNextWriteableHorizontalField(field, -1);
        }
        break;

      case me.keyCodeArrowUp:
        baseFieldName = me.getFieldNamePrefix(fieldName);
        nextField = me.getNextWriteableVerticalField(baseFieldName, fieldNameIndex, -1);
        break;

      case me.keyCodeArrowRight:
        if ((typeof field.selectionStart != "number") || (field.selectionStart == field.value.length)) {
          nextField = me.getNextWriteableHorizontalField(field, 1);
        }
        break;

      case me.keyCodeArrowDown:
        baseFieldName = me.getFieldNamePrefix(fieldName);
        nextField = me.getNextWriteableVerticalField(baseFieldName, fieldNameIndex, 1);
        break;

      default:
        break;
    }

    if (nextField) {
      nextField.focus();
      if (typeof nextField.selectionStart == "number") {
        nextField.selectionStart = nextField.value.length;
      }
      event.preventDefault();
    }
  },

  /**
   * @private
   * Returns the next writeable horizontal field
   * @param {HTMLElement} field Field
   * @param {HTMLElement} columnCount Column count
   * @return {HTMLElement} Next horizontal input field
   */
  getNextWriteableHorizontalField: function (field, columnCount) {
    var me = this;

    do {
      field = me.getNextHorizontalField(field, columnCount);
      if (!field) {
        return;
      }
    } while (field.readOnly);

    return field;
  },

  /**
   * @private
   * Returns the next horizontal field
   * @param {HTMLElement} field Field
   * @param {HTMLElement} columnCount Column count
   * @return {HTMLElement} Next horizontal input field
   */
  getNextHorizontalField: function (field, columnCount) {
    var me = this,
        fieldName, nextField, nodeList, i, nextNodeIndex;

    fieldName = field.name;
    nodeList = me.getInputsInRow(field);
    for (i = 0; i < nodeList.length; i++) {
      field = nodeList[i];
      if (field.name == fieldName) {
        nextNodeIndex = i + columnCount;
        if ((nextNodeIndex > -1) && (nextNodeIndex < nodeList.length)) {
          nextField = nodeList[nextNodeIndex];
          return nextField;
        }
      }
    }
  },

  /**
   * @private
   * Return the next writeable vertical input field
   * @param {String} baseFieldName Base field name
   * @param {String} fieldNameIndex Field name index
   * @param {String} rowCount Row count
   * @return {HTMLElement} Next vertical input field
   */
  getNextWriteableVerticalField: function (baseFieldName, fieldNameIndex, rowCount) {
    var me = this,
        field;

    do {
      field = me.getNextVerticalField(baseFieldName, fieldNameIndex, rowCount);
      if (!field) {
        return;
      }
      if (rowCount < 0) {
        rowCount--;
      } else {
        rowCount++;
      }
    } while (field.readOnly);

    return field;
  },

  /**
   * @private
   * Return the next vertical input field
   * @param {String} baseFieldName Base field name
   * @param {String} fieldNameIndex Field name index
   * @param {String} rowCount Row count
   * @return {HTMLElement} Next vertical input field
   */
  getNextVerticalField: function (baseFieldName, fieldNameIndex, rowCount) {
    var nextIndex, nextFieldName, nextField;
    nextIndex = fieldNameIndex + rowCount;
    if (nextIndex < 0) {
      return;
    }

    nextFieldName = baseFieldName + nextIndex;
    nextField = $var(nextFieldName);

    return nextField;
  },

  /**
   * Checks whether the pressed key is an arrow key
   * @param {Number} keyCode Key code;
   * @return {Boolean}
   */
  isArrowKey: function (keyCode) {
    var me = this,
        arrowKeyCodes, isArrowKey;

    arrowKeyCodes = [me.keyCodeArrowLeft, me.keyCodeArrowUp, me.keyCodeArrowRight, me.keyCodeArrowDown];
    isArrowKey = (arrowKeyCodes.indexOf(keyCode) > -1);
    return isArrowKey;
  },

  /**
   * Returns the parent table
   * @param {HTMLElement} element Element
   * @return {HTMLElement} Table
   */
  getParentTable: function (element) {
    element = element.parentNode;

    while (element) {
      if (element.id == "elotable") {
        return element;
      }
      element = element.parentNode;
    }
  },

  /**
   * Set CSS Classes .
   */
  setActionMode: function () {
    var mode = "",
        i, query, vars, pair, wfform;

    query = window.location.search.substring(1);
    vars = query.split("&");
    if (vars) {
      for (i = 0; i < vars.length; i++) {
        if (vars[i]) {
          pair = vars[i].split("=");
          if (pair[0] == "mode") {
            mode = pair[1];
            break;
          }
        }
      }
    }

    if (mode == "launchpad") {
      wfform = document.getElementById("elo_wf_form");
      if (wfform) {
        wfform.className += " actionMode hideMainHeader";
      }
    }
  },

  /**
   * Initializing actions after loading the form.
   */
  initializeForm: function () {
    var me = this,
        $saveClicked,
        $onDynListItemSelected,
        $sendDirty;

    if (me.formIsInitialized === true) {
      return;
    }

    me.formIsInitialized = true;

    me.hideTabBarIfOnlyOneTab();
    me.setActionMode();
    me.setMainHeader();
    me.setResponsive();
    me.registerTableNavigation();

    $saveClicked = window.saveClicked;
    window.saveClicked = function () {
      $update(me.wfMapSavedFlag, "1", true);
      return $saveClicked();
    };

    $onDynListItemSelected = window.onDynListItemSelected;
    window.onDynListItemSelected = function (item, name) {
      me.dynListItemSelected = true;
      $onDynListItemSelected.apply(this, arguments);
    };

    $sendDirty = elo.elowf.CommUtils.sendDirty;
    elo.elowf.CommUtils.sendDirty = function () {
      me.pageIsDirty = true;
      $sendDirty.apply(this, arguments);
    };

  },

  /**
	 * Initializes an index server connection and sets both elo.IX and elo.CONST.
	 *
	 * By default the relative url is used. If this url is not accesible for some reason the internal absolute url is tried instead.
	 *
	 * @param {Function} successCallback
   * @param {Function} failureCallback
   * @param {boolean} absoluteUrl defines wheather to use an absolute url or not. Defaults to false.
	 */
  initializeIxSession: function (successCallback, failureCallback, absoluteUrl) {
    var me = this,
        ixUrl, ixLib, ixUtils, ixUtilsUrl, ixServiceUrl,
        onload = function () {
          elo = elo || {};
          try {
            ixServiceUrl = ixUrl + "/ix";
            console.info("establishing IX connection: " + ixServiceUrl);
            elo.connFact = new de.elo.ix.client.IXConnFactory(ixServiceUrl, "ELO WF", "Business Solution");
            elo.connFact.sessOpts = elo.connFact.sessOpts || {};
            elo.connFact.sessOpts["ix.translateTerms"] = "true";
            elo.connFact.sessOpts["ix.startDocMaskWorkflows"] = "true";
            elo.connFact.connProps = elo.connFact.connProps || {};
            elo.connFact.connProps[elo.connFact.NB_OF_REVERSE_CNNS] = 0;

            elo.IX = elo.connFact.createFromTicket(ELO_PARAMS.ELO_TICKET);
            elo.IX.getLoginResult().clientInfo.language = me.getFormLanguage();
            elo.CONST = elo.IX.getCONST();

            elo.data = elo.data || {};
            elo.data.user = {};
            elo.data.user.id = elo.IX.getUserId();
            elo.data.user.name = elo.IX.getUserName();
          } catch (ex) {
            me.initializedIxSession = false;
            alert("error initializing ix connection: " + (ex && ex.msg ? ex.msg : ex));
            return;
          }

          if (successCallback) {
            successCallback();
          }
        };

    // define IX Url
    ixUrl = ELO_PARAMS.ELOIX_PATH.substring(0, ELO_PARAMS.ELOIX_PATH.lastIndexOf("/"));
    if (!absoluteUrl) {
      ixUrl = ixUrl.substring(ixUrl.indexOf("/ix"));
    }

    if (me.initializedIxSession && elo && elo.IX) {
      if (successCallback) {
        successCallback();
      }
      return;
    } else if (me.initializedIxSession && (typeof de !== "undefined") && de.elo && de.elo.ix && de.elo.ix.client) {
      onload();
    } else if (me.initializedIxSession) {
      window.setTimeout(function () {
        me.initializeIxSession(successCallback);
      }, 50);
      return;
    }

    me.initializedIxSession = true;


    ixLib = document.createElement("script");
    ixLib.type = "text/javascript";
    ixUtilsUrl = ixUrl + "/EloixClient-min.js";

    console.info("loading ix utils: " + ixUtilsUrl);
    ixLib.src = ixUtilsUrl;
    ixLib.onerror = function (event) {
      var src, message;
      src = (event && event.srcElement && event.srcElement.src) ? event.srcElement.src : "";
      message = "Error while loading IX library: " + src;
      if (!absoluteUrl) {
        console.info("Initializing session with absolute url failed. Using relative url instad.");
        me.initializedIxSession = false;
        me.initializeIxSession(successCallback, failureCallback, true);
      } else if (failureCallback) {
        failureCallback(message);
      } else {
        eloAlert(message, "Error");
      }
    };
    ixLib.onload = onload;

    if (!document.getElementById("sol_common_IxUtils")) {
      ixUtils = document.createElement("script");
      ixUtils.id = "sol_common_IxUtils";
      ixUtils.type = "text/javascript";
      ixUtils.src = "lib_sol.common.IxUtils";
      document.body.appendChild(ixUtils);
    }
    document.body.appendChild(ixLib);
  },

  /**
   * Registers an element for update.
   *
   * To do so, it calls the rule defined by `ruleName` with the wf objects objId (as `param1`).
   *
   * @since 1.05.000 this can be called without a `ruleName` to register the element for direct update (without using the job queue). The common_monitoring package hast to be installed.
   *
   * Update will only be registered, if the page has changed.
   * This only applies if the form was initialized using {@link #initializeForm}.
   * If not, the update will always be executed.
   *
   * @param {String} ruleName
   */
  registerUpdate: function (ruleName) {
    var me = this,
        req, url, rfName, rfParams, rfErrorMsg;

    if ((me.formIsInitialized !== true) || (me.pageIsDirty === true) || (me.dynListItemSelected === true)) {
      if (ELO_PARAMS.WF_MAP_COMMON_SKIP_UPDATE_REGISTRATION === "true") {
        console.info("Skip update registration: 'WF_MAP_COMMON_SKIP_UPDATE_REGISTRATION' is set to 'true'");
        return;
      }
      if (me.checkVersion(ELOWF_VERSION, "10.01.000")) {
        if (ruleName) {
          rfName = "RF_sol_common_service_ExecuteAsAction";
          rfParams = {
            action: ruleName,
            objId: ELO_PARAMS.ELO_OBJID,
            config: {}
          };
          rfErrorMsg = "Failed to call ELOas rule '" + ruleName + "' via '" + rfName + "'";
        } else {
          rfName = "RF_sol_common_monitoring_function_RegisterUpdate";
          rfParams = {
            objId: ELO_PARAMS.ELO_OBJID,
            registerFlowId: ELO_PARAMS.ELO_FLOWID,
            registerNodeId: ELO_PARAMS.ELO_NODEID
          };
          rfErrorMsg = "Failed to register update using '" + rfName + "'";
        }

        me.callRegisteredFunction(
          rfName,
          rfParams,
          function (succObj) {
            console.info("Registered update for '" + rfParams.objId + "'");
          },
          function (errObj) {
            console.error(rfErrorMsg + " : " + JSON.stringify(errObj));
          }
        );
      } else {
        req = new XMLHttpRequest();
        url = me.getAsBaseUrl() + "?cmd=get&name=" + ruleName + "&param1=" + ELO_PARAMS.ELO_OBJID + "&ticket=" + ELO_PARAMS.ELO_TICKET;
        req.open("GET", url, true);
        req.onreadystatechange = function () {
          if (req.readyState !== 4) {
            return;
          }
          if (req.status !== 200) {
            console.error("Failed to call ELOas rule '" + ruleName + "' via XMLHttpRequest: statusCode=" + req.status);
          }
        };
        req.send(null);
      }
    }
  },

  /**
   * Returns the ELOas base URL
   * @return {String} ELOas base URL
   */
  getAsBaseUrl: function () {
    var me = this,
        asUrl, formLocation, asLocation, asProxyUrl;

    asUrl = ELO_PARAMS.ELOAS_PATH;
    formLocation = window.location;

    if (!formLocation.port) {
      asLocation = me.getLocation(asUrl);
      if (asLocation.port) {
        asProxyUrl = formLocation.protocol + "//" + formLocation.host + asLocation.path;
        return asProxyUrl;
      }
    }

    return asUrl;
  },

  /**
   * Gets the location info from a given URL
   * @param {String} url URL
   * @return {Object} urlParts
   * @return {String} location.url Complete URL
   * @return {String} location.protocol Protocol
   * @return {String} location.hostName Host name
   * @return {String} location.port Port
   * @return {String} location.path Path
   */
  getLocation: function (url) {
    var location,
        parts, hostParts;

    location = { url: url };

    if (url) {
      parts = url.split("/");
      if ((parts.length > 2) && (parts[0].toLowerCase().indexOf("http") == 0) && !parts[1]) {
        location.protocol = parts[0];
        hostParts = parts[2].split(":");
        location.hostName = hostParts[0];
        if (hostParts.length > 1) {
          location.port = hostParts[1];
        }
        if (parts.length > 3) {
          parts.shift();
          parts.shift();
          parts.shift();
          location.path = "/" + parts.join("/");
        }
      }
    }

    return location;
  },

  /**
   * Returns the language of the form
   * @returns {String} Language
   */
  getFormLanguage: function () {
    return document.querySelector("input[name=lang]").getAttribute("value");
  },

  /**
   * Check wether mandatory fields exist
   * @param {Array} fieldNames
   */
  checkMandatoryFields: function (fieldNames) {
    var me = this,
        missingFields = [],
        i, fieldName, content;

    if (!fieldNames || (fieldNames.length == 0)) {
      return;
    }

    for (i = 0; i < fieldNames.length; i++) {
      fieldName = fieldNames[i];
      if (!me.fieldExists(fieldName)) {
        missingFields.push(fieldName);
      }
    }

    if (missingFields.length > 0) {
      content = "Missing fields:\r\n" + missingFields.join("\r\n");
      eloAlert(content, "Missing fields");
    }
  },

  /**
   * Checks wether a field exists
   * @param {String} fieldName
   * @return {Boolean}
   */
  fieldExists: function (fieldName) {
    if (!fieldName) {
      throw "Field name is empty";
    }
    return !!$var(fieldName);
  },

  /**
   * Disables the validation if cancel button is pressed
   *
   * ### Example:
   *     function nextClicked(id) {
   *       sol.common.forms.Utils.disableCancelButtonValidation(id, ["sol.common.wf.node.cancel"]);
   *       return true;
   *     }
   *
   * @param {String} successorNodeId Node ID of the successor node
   * @param {Array} cancelButtonTranslationKeys Cancel button translation key
   * @param {Object} params Parameters
   * @param {String} [params.mode=REMOVE_TABLE] Mode: `REMOVE_VALIDATION_ATTRIBUTES` deletes only the validation attributes
   * @return {Boolean}
   */
  disableCancelButtonValidation: function (successorNodeId, cancelButtonTranslationKeys, params) {
    var me = this,
        i, nextButtonIndex, pressedNextButtonTranslationKey, cancelButtonTranslationKey;

    params = params || {};

    if (!successorNodeId) {
      console.warn("Successor node ID is empty");
    }

    if (!cancelButtonTranslationKeys) {
      console.warn("Cancel button translation keys are empty");
      return;
    }

    if (!sol.common.ObjectUtils.isArray(cancelButtonTranslationKeys)) {
      console.warn("Cancel button translation keys must be an array");
      return;
    }

    nextButtonIndex = me.getNextButtonIndex(successorNodeId);
    if (!nextButtonIndex) {
      console.warn("Next button not found");
      return;
    }

    pressedNextButtonTranslationKey = ELO_PARAMS["KEY_NEXT_" + nextButtonIndex];

    for (i = 0; i < cancelButtonTranslationKeys.length; i++) {
      cancelButtonTranslationKey = cancelButtonTranslationKeys[i];
      if (pressedNextButtonTranslationKey == cancelButtonTranslationKey) {
        if (params && params.mode && (params.mode.indexOf("REMOVE_VALIDATION_ATT") == 0)) {
          me.removeValidationAttributes();
        } else {
          me.removeTables();
        }
        me.removeHiddenCheckboxes();
        me.setSuccessor(successorNodeId);
        return true;
      }
    }
    return false;
  },

  /**
   * @private
   * Deletes the validation attributes
   */
  removeValidationAttributes: function () {
    var inputs, i, input, eloverify;

    inputs = document.querySelectorAll("input");

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      eloverify = input.getAttribute("eloverify");
      if (eloverify) {
        eloverify = eloverify.replace("notemptyforward");
        eloverify = eloverify.replace(/min\:\d+/, "");
        eloverify = eloverify.replace(/max\:\d+/, "");
        input.setAttribute("eloverify", eloverify);
      }
    }
  },

  /**
   * Remove all tables within the form to avoid validation
   */
  removeTables: function () {
    var tables, table, i;
    tables = document.querySelectorAll("#elotable table");
    for (i = 0; i < tables.length; i++) {
      table = tables[i];
      table.parentNode.removeChild(table);
    }
  },

  /**
   * Remove all checkboxes within the form to avoid validation
   */
  removeHiddenCheckboxes: function () {
    var checkboxes, checkbox, i;
    checkboxes = document.querySelectorAll("input[name^='HIDDEN_'][value='CHECKBOX']");
    for (i = 0; i < checkboxes.length; i++) {
      checkbox = checkboxes[i];
      checkbox.parentNode.removeChild(checkbox);
    }
  },


  /**
   * Set successor node
   * @param {String} successorNodeId Successor node id
   */
  setSuccessor: function (successorNodeId) {
    var nextNodeElem;
    nextNodeElem = document.querySelector("input[name='NEXTNODE']");
    if (nextNodeElem) {
      nextNodeElem.setAttribute("value", successorNodeId);
    }
  },

  /**
   * Returns the translation key of the next button by a given nodeId
   * @param {String} nodeId
   * @return {String} Translation key
   */
  getNextButtonTranslationKey: function (nodeId) {
    var me = this,
        nextButtonIndex, nextButtonTranslationKey;

    nextButtonIndex = me.getNextButtonIndex(nodeId);
    if (!nextButtonIndex) {
      console.warn("Next button not found");
      return;
    }

    nextButtonTranslationKey = ELO_PARAMS["KEY_NEXT_" + nextButtonIndex];

    return nextButtonTranslationKey;
  },

  /**
   * Returns the index of the next button
   * @param {String} successorNodeId Node ID of the successor node
   * @return {Number} Index of the next button
   */
  getNextButtonIndex: function (successorNodeId) {
    var nextProp, nextPropParts, i, nodeId,
        maxButtonId = 100;
    for (i = 1; i < maxButtonId; i++) {
      nextProp = ELO_PARAMS["NEXT_" + i];
      if (!nextProp) {
        break;
      }
      nextPropParts = nextProp.split("\t");
      if (nextPropParts && (nextPropParts.length > 0)) {
        nodeId = nextPropParts[0].trim();
        if (nodeId == successorNodeId) {
          return i;
        }
      }
    }
  },

  /**
   * generates a user image url relative to the current form.
   * @param {String} username ELO Username
   * @param {String} userid ELO User id
   * @return {String}
   */
  getUserImageUrl: function (username, userid) {
    return "../social/api/feed/img/users/" + userid + "/" + username + "/" + new Date().getTime();
  },

  /**
   * Renders images for a given user set. Internally calls applyUserImage on each entry of the map.
   * @param {String} userNameMap Name of the map field that contains the username
   * @param {String} userIdMap Name of the field that contains the user id
   */
  applyUserImages: function (userNameMap, userIdMap) {
    var i = 1;

    while ($var(userNameMap + i)) {
      this.applyUserImage(userNameMap + i, userIdMap + i);
      i += 1;
    }
  },

  /**
   * Renders a user image
   * @param {String} userNameMap Name of the map field that contains the username
   * @param {String} userIdMap Name of the field that contains the user id
   */
  applyUserImage: function (userNameMap, userIdMap) {
    var img, cont;

    if ($val(userNameMap) && $val(userIdMap)) {
      img = img = sol.common.forms.Utils.getUserImageUrl($val(userNameMap), $val(userIdMap));
    } else {
      img = "";
    }

    cont = document.querySelector('[name="' + userNameMap + '"]');
    if (cont) {
      cont = cont.parentElement;
      cont.style.backgroundImage = img ? "url('" + img + "')" : "";
    }
  },

  /**
   * Returns the surrounding table
   * @param {HTMLElement} element HTML element
   * @return {HTMLElement}
   */
  getTable: function (element) {
    var me = this;
    if (!element) {
      throw "Element is empty";
    }
    return me.getParentByTagName(element, "TABLE");
  },

  /**
   * Returns the surrounding row
   * @param {HTMLElement} element HTML element
   * @return {HTMLElement}
   */
  getRow: function (element) {
    var me = this;
    if (!element) {
      throw "Element is empty";
    }
    return me.getParentByTagName(element, "TR");
  },

  /**
   * Returns the surrounding cell
   * @param {HTMLElement} element HTML element
   * @return {HTMLElement}
   */
  getCell: function (element) {
    var me = this;
    if (!element) {
      throw "Element is empty";
    }
    return me.getParentByTagName(element, "TD");
  },

  /**
   * Returns the template
   * @param {HTMLElement} element HTML element
   * @return {HTMLElement}
   */
  getTemplate: function (element) {
    var me = this;
    if (!element) {
      throw "Element is empty";
    }
    return me.getParentByTagName(element, "tbody");
  },

  /**
   * Returns a parent element by a given tag name
   * e.g. to find the surrounding table of an element
   * @param {HTMLElement} element HTML element.
   * @param {String} tagName Tag name of the wanted element
   * @return {HTMLElement}
   */
  getParentByTagName: function (element, tagName) {
    if (!element) {
      throw "Start element is empty";
    }
    if (!tagName) {
      throw "Tag name is empty";
    }
    do {
      element = element.parentElement;
      if (!element) {
        return;
      }
      if (element.nodeName.toLowerCase() == tagName.toLowerCase()) {
        return element;
      }
    } while (element);
  },

  /**
   * Returns the "JS add line" button
   * @param {String|HTMLElement} field Field
   * @return {HTMLElement}
   */
  getJsAddLineButton: function (field) {
    var me = this,
        element, editTable, jsAddLineButton;
    if (!field) {
      throw "Field is empty";
    }

    element = (typeof field == "string") ? $var(field) : field;

    if (!element) {
      return;
    }
    editTable = me.getTable(element);
    if (!editTable) {
      return;
    }
    jsAddLineButton = editTable.querySelector("input[name='JS_ADDLINE']");
    if (!jsAddLineButton) {
      throw "'JS add line button' not found";
    }
    return jsAddLineButton;
  },

  /**
   * Returns the "JS add line" button
   * @param {String} addLineId Add line ID
   * @return {HTMLElement}
   */
  getJsAddLineButtonById: function (addLineId) {
    var jsAddLineButton;

    if (!addLineId) {
      return;
    }

    jsAddLineButton = document.querySelector("input[name='JS_ADDLINE'][addlineid='" + addLineId + "']");

    if (!jsAddLineButton) {
      throw "'JS add line button' not found";
    }

    return jsAddLineButton;
  },

  /**
   * Adds a listener to an JsAddLineButton
   * @param {String} fieldName Field name within the JS add line table
   * @param {Function} func Function
   */
  addJsAddLineButtonListener: function (fieldName, func) {
    var me = this,
        jsAddLineButton;
    if (!fieldName) {
      throw "Field name is empty";
    }
    if (!func) {
      throw "Function is empty";
    }
    jsAddLineButton = me.getJsAddLineButton(fieldName);
    if (jsAddLineButton) {
      jsAddLineButton.addEventListener("click", func);
    }
  },

  /**
   * Registers an click handler to clear a new line
   * @param {String} columnName Column name
   * @param {String} notEmpty Previous line must not be empty
   */
  registerResetNewLineFunction: function (columnName, notEmpty) {
    var me = this;

    if (!columnName) {
      throw "The column name is empty";
    }
    if (!me.columnExists(columnName)) {
      return;
    }

    me.addJsAddLineButtonListener(columnName + "1", function () {
      me.resetNewLine(columnName, notEmpty);
    });
  },

  /**
   * Resets all input fields of a new line
   * @param {String} columnName Column name
   * @param {String} notEmpty Previous line must not be empty
   */
  resetNewLine: function (columnName, notEmpty) {
    var me = this,
        jsAddLineButton, lastInput, index;

    if (!columnName) {
      throw "The column name is empty";
    }
    if (!me.columnExists(columnName)) {
      return;
    }

    lastInput = me.getLastInput(columnName);
    if (notEmpty) {
      index = me.getFieldNameIndex(lastInput.name);
      if (!$val(columnName + (index - 1))) {
        jsAddLineButton = me.getJsAddLineButton(lastInput.name);
        $removeLine(jsAddLineButton, index);
        return;
      }
    }
    me.enableRow(lastInput, true);
  },

  /**
   * Adds a callback function to the event listener of an input field.
   * @param {string} event Name of the event.
   * @param {string} fieldKey Field key of the input field.
   * @param {object} ctx Exteution context.
   * @param {function} func Callback function.
   */
  addListener: function (event, fieldKey, ctx, func) {
    var field = $var(ctx.field(fieldKey)),
        handlerFct;

    if (!field) {
      return;
    }

    handlerFct = function () {
      func.apply(ctx, arguments);
    };

    if (field.addEventListener) { // Modern
      field.addEventListener(event, handlerFct, false);
    } else if (field.attachEvent) { // Internet Explorer
      field.attachEvent("on" + event, handlerFct);
    }
  },

  /**
   * Returns true, if the fieldname is a table field, otherwise false
   * @param {String} s the fieldname
   * @return {Boolean}
   */
  isTableField: function (s) {
    return (typeof s == "string")
      && !!s[1]
      && ((s = +(s[s.length - 1])) === s);
  },

  /**
   * Returns the field index
   * @param {String} fieldName Field name
   * @returns {String}
   */
  getFieldNameIndex: function (fieldName) {
    if (!fieldName) {
      return "";
    }
    var pos = fieldName.search(/\d+$/);
    if (pos > 0) {
      return parseInt(fieldName.substring(pos), 10);
    }
    return "";
  },

  /**
   * Returns the index number of the row
   * @param {HTMLElement} field Field
   * @return {String} Row index
   */
  getRowIndex: function (field) {
    var me = this,
        row, inputs, i, input, fieldName, index;

    if (!field) {
      throw "Field is empty";
    }

    row = me.getRow(field);
    if (!row) {
      throw "Row not found";
    }

    inputs = row.querySelectorAll("input");

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      fieldName = input.name;
      index = me.getFieldNameIndex(fieldName);
      if (index) {
        return index;
      }
    }
  },

  /**
   * Returns the field name without trailing numbers
   * @param {Object|String} source Source element or field name
   * @param {Object} params Parameters
   * @param {String} [params.replaceNumberBy=""] Replace the number by this string
   * @returns {String}
   */
  getFieldNamePrefix: function (source, params) {
    var me = this,
        fieldName;

    if (me.checkSource(source)) {
      fieldName = source.name;
    } else {
      fieldName = source;
    }

    params = params || {};
    params.replaceNumberBy = params.replaceNumberBy || "";

    if (!fieldName) {
      return "";
    }
    fieldName = fieldName.replace(/\d*$/, params.replaceNumberBy);

    return fieldName;
  },

  /**
   * Checks whether a column exists
   * @param {String} columnName Column name
   * @return {Boolean}
   */
  columnExists: function (columnName) {
    if (!columnName) {
      throw "The column name is empty";
    }

    return !!$var(columnName + "1");
  },

  /**
   * Return the last input field in the table
   * @param {String} columnName
   * @return {HTMLElement}
   */
  getLastInput: function (columnName) {
    var currentInput, lastInput,
        i = 1;

    if (!columnName) {
      throw "The column name is empty";
    }

    while (true) {
      currentInput = $var(columnName + i++);
      if (currentInput) {
        lastInput = currentInput;
      } else {
        return lastInput;
      }
    }
  },

  /**
   * Sets rows read-only
   * @param {String} indicatorColumnName Read-only indicator field
   * @param {Function} func Function that must return a boolean to determinate whether the row should be disabled
   */
  disableRowsByIndicatorField: function (indicatorColumnName, func) {
    var me = this;

    if (!indicatorColumnName) {
      throw "The indicator column name is empty";
    }
    if (!$var(indicatorColumnName + "1")) {
      return;
    }

    me.forEachRow(indicatorColumnName, function (rowIndex) {
      var indicatorElement, disable;
      disable = func.call(me, rowIndex);
      indicatorElement = $var(indicatorColumnName + rowIndex);
      me.enableRow(indicatorElement, !disable);
    });
  },


  /**
   * Enables/disables a row
   * @param {type} indicatorElement
   * @param {type} enable
   */
  enableRow: function (indicatorElement, enable) {
    var me = this,
        nodeList, j, row, removeLineButton;
    nodeList = me.getElementsInRow(indicatorElement);
    for (j = 0; j < nodeList.length; j++) {
      nodeList[j].disabled = !enable;
    }
    if (!enable) {
      row = me.getRow(indicatorElement);
      removeLineButton = row.querySelector(".jsRemoveLine");
      if (removeLineButton) {
        removeLineButton.parentNode.removeChild(removeLineButton);
      }
    }
  },

  /**
   * Returns the input fields and buttons in the row
   * @param {HTMLElement} element
   * @return {NodeList}
   */
  getElementsInRow: function (element) {
    var me = this,
        row, nodeList;
    if (!element) {
      throw "Element is empty";
    }
    row = me.getRow(element);
    if (!row) {
      throw "Row not found";
    }
    nodeList = row.querySelectorAll("input,button");
    return nodeList;
  },

  /**
   * Returns the input fields in the row
   * @param {HTMLElement} element
   * @return {NodeList}
   */
  getInputsInRow: function (element) {
    var me = this,
        row, nodeList;
    if (!element) {
      throw "Element is empty";
    }
    row = me.getRow(element);
    if (!row) {
      throw "Row not found";
    }
    nodeList = row.querySelectorAll("input");
    return nodeList;
  },

  /**
   * Returns the JS add line row by ID
   * @param {String} addLineId Add line ID
   * @param {String} lineNo Line number
   * @return {HTMLElement} row
   */
  getJsAddLineRowById: function (addLineId, lineNo) {
    var me = this,
        jsAddLineButton, inputs, index, row;

    jsAddLineButton = me.getJsAddLineButtonById(addLineId);

    if (!jsAddLineButton) {
      throw "Can't find JS add line button";
    }

    row = me.getParentByTagName(jsAddLineButton, "tr");

    while (true) {
      row = row.previousElementSibling;
      if (!row) {
        return;
      }

      inputs = row.querySelectorAll("input");
      if (inputs.length == 0) {
        continue;
      }
      index = me.getFieldNameIndex(inputs[0].name);

      if (index == lineNo) {
        return row;
      } else if (index < lineNo) {
        return;
      }
    }
  },

  /**
   * Iterates over a table.
   * @param {String} endOfTableIndicatorColumnName Name of a column to check if the line exists.
   * @param {Function} func Callback function for the iteration.
   * @param {Object} ctx Execution context.
   */
  forEachRow: function (endOfTableIndicatorColumnName, func, ctx) {
    var i = 1;

    if (!endOfTableIndicatorColumnName) {
      throw "The end of table indicator column name is empty.";
    }
    if (!func) {
      throw "The function parameter is emtpy.";
    }

    while ($var(endOfTableIndicatorColumnName + i)) {
      func.call(ctx, i++);
    }
  },

  /**
   * Calls the function `inputChanged` for fields changed by a dynamic keyword list
   * @param {Object} dynListItem Dynamic keyword list item
   */
  callInputChangedForDynKwlChanges: function (dynListItem) {
    var fieldName, fieldNameParts, prefix, field;
    for (fieldName in dynListItem) {
      fieldNameParts = fieldName.split("_");
      if (fieldNameParts && (fieldNameParts.length > 0)) {
        prefix = fieldNameParts[0];
        if (!prefix || (prefix.substr(0, 1) == "$")) {
          continue;
        }
        if ((prefix != "IX") && (prefix != "WF")) {
          fieldName = "IX_GRP_" + fieldName;
        }
      }
      field = $var(fieldName);
      if (field) {
        inputChanged($var(fieldName));
      }
    }
  },

  /**
   * Enables or disables forward buttons
   * @param {Boolean} [disable=true] Disable button
   */
  disableForwardButtons: function (disable) {
    var me = this,
        forwardButtons, i, forwardButton;
    forwardButtons = me.getForwardButtons();
    for (i = 0; i < forwardButtons.length; i++) {
      forwardButton = forwardButtons[i];
      forwardButton.disabled = (disable == false) ? false : true;
    }
  },

  /**
   * Returns forward buttons
   * @returns {NodeList}
   */
  getForwardButtons: function () {
    var forwardButtons;
    forwardButtons = document.querySelectorAll("button[name='NEXTNODE']");
    return forwardButtons;
  },

  /**
   * Returns a next button
   * @param {Object} params Parameters
   * @param {String} params.nextNodeTranslationKey Translation key of the next node
   * @return {HTMLElement} Forward button
   */
  getForwardButton: function (params) {
    var me = this,
        buttonIndex, forwardButtons, i, translationKey, forwardButton;

    params = params || {};

    if (params.nextNodeTranslationKey) {
      for (i = 1; i < 1000; i++) {
        translationKey = ELO_PARAMS["KEY_NEXT_" + i];
        if (!translationKey) {
          return;
        }
        if (translationKey == params.nextNodeTranslationKey) {
          buttonIndex = i - 1;
          break;
        }
      }
    }

    if (buttonIndex != undefined) {
      forwardButtons = me.getForwardButtons();
      if (forwardButtons && (buttonIndex < forwardButtons.length)) {
        forwardButton = forwardButtons[buttonIndex];
      }
    }

    return forwardButton;
  },

  /**
   * Adds a class to the ´body´ tag
   * @param {String} className
   */
  addBodyClass: function (className) {
    document.body.className += " " + className;
  },

  /**
   * Removes a class from the ´body´ tag
   * @param {String} className
   */
  removeBodyClass: function (className) {
    document.body.classList.remove(className);
  },

  /**
   * Returns an ISO formatted date
   * @param {String} fieldName Field name
   * @param {Object} params Parameters
   * @param {Boolean} params.startOfDay Start of day
   * @returns {String}
   */
  getIsoDate: function (fieldName, params) {
    var field, isoDate;

    params = params || {};

    if (!$val(fieldName)) {
      return "";
    }
    field = $var(fieldName);
    if (!field) {
      return;
    }
    isoDate = field.getAttribute("isodate") || "";
    if (params.startOfDay || (isoDate.length > 8)) {
      isoDate = isoDate.substr(0, 8) + "000000";
    }

    return isoDate;
  },

  /**
   * Sets an ISO date
   * @param {String} fieldName Field name
   * @param {String} isoDate in ISO format
   * @param {Object} params Parameters
   * @param {Boolean} params.callInputChanged If true the function ´inputChanged´ will be called
   */
  setIsoDate: function (fieldName, isoDate, params) {
    var localizedDate, field;
    params = params || {};
    params.callInputChanged = (typeof params.callInputChanged == "undefined") ? true : params.callInputChanged;
    field = $var(fieldName);
    if (!field) {
      return;
    }
    localizedDate = elo.wf.date.format(isoDate) || "";
    field.setAttribute("autovalidval", localizedDate);
    $update(fieldName, localizedDate);
    if (params.callInputChanged) {
      inputChanged($var(fieldName));
    }
  },

  /**
   * Copies an ISO date
   * @param {String} srcFieldName Source field name
   * @param {String} dstFieldName Destination field name
   * @param {Object} params Parameters
   * @param {Boolean} params.callInputChanged If true the function ´inputChanged´ will be called
   */
  copyIsoDate: function (srcFieldName, dstFieldName, params) {
    var me = this,
        value, isoDate;
    if (!$var(srcFieldName) || !$var(dstFieldName)) {
      return;
    }
    value = $val(srcFieldName);
    if (!value) {
      $update(dstFieldName, "");
      return;
    }
    isoDate = me.getIsoDate(srcFieldName);
    me.setIsoDate(dstFieldName, isoDate, params);
  },

  /**
   * Sets a default value if it's empty
   * @param {String} fieldName Field name
   * @param {String} defaultValue Default value
   */
  setDefaultValue: function (fieldName, defaultValue) {
    var value;
    value = $val(fieldName);
    if (!value) {
      $update(fieldName, defaultValue);
    }
  },

  /**
   * Checks if the specific field has been changed or the form is loaded
   * @param {Object} source Changed HTML element.
   * @param {Array} fieldNames Array of field names.
   * @return {undefined}
   */
  isFieldChangedOrFormLoaded: function (source, fieldNames) {
    var me = this;
    if (!me.checkSource(source)) {
      return true;
    }
    return me.isFieldChanged(source, fieldNames);
  },

  /**
   * Checks if the specific field has been changed
   * @param {Object} source Changed HTML element.
   * @param {Array} fieldNames Array of field names.
   * @return {undefined}
   */
  isFieldChanged: function (source, fieldNames) {
    var me = this;
    if (!source) {
      return false;
    }
    return fieldNames.some(function (fieldName) {
      var fieldBaseName = me.getBaseFieldName(source.name);
      return ((fieldBaseName == fieldName) || (fieldBaseName + me.unitSuffix == fieldName));
    });
  },

  /**
   * Checks if the changed input field es set
   * @param {Object} source Changed input field
   * @return {Boolean}
   */
  checkSource: function (source) {
    return (source && source.name);
  },

  /**
   * Returns the field name without unit suffix and trailing numbers
   * @param {Object|String} source Source element or field name
   * @returns {String}
   */
  getBaseFieldName: function (source) {
    var me = this,
        fieldName, unitSuffixRegExp;

    if (me.checkSource(source)) {
      fieldName = source.name;
    } else {
      fieldName = source;
    }

    if (!fieldName) {
      return "";
    }
    fieldName = fieldName.replace(/\d*$/g, "");
    unitSuffixRegExp = new RegExp(me.unitSuffix + "$");
    fieldName = fieldName.replace(unitSuffixRegExp, "");
    return fieldName;
  },

  /**
   * Sums all values of a given column
   * @param {string} columnName Name of the column
   * @return {Number}
   */
  sumItems: function (columnName) {
    var me = this,
        sum;
    sum = new Decimal(0);
    me.forEachRow(columnName, function (i) {
      var decimal;
      decimal = me.toDecimal(columnName + i);
      sum = sum.plus(decimal);
    });
    return sum;
  },

  /**
   * Returns a Decimal data type
   * @param {String|HTMLElement} field Field
   * @param {Object} params Parameters
   * @param {Boolean} params.silent Silent
   * @return {Decimal} Decimal
   */
  toDecimal: function (field, params) {
    var decimal, value;

    if (!field) {
      throw "Field is empty";
    }

    params = params || {};

    if (!(field instanceof Element)) {
      field = $var(field);
    }

    if (!field) {
      if (params.silent) {
        return;
      }
      throw "Field '" + field + "' not found.";
    }

    if (field.hasAttribute("decimal")) {
      value = field.getAttribute("decimal");
    } else {
      value = field.value;
      params.thousandsSeparator = ELO.Configuration.Amount.ThousandSep;
      params.decimalSeparator = ELO.Configuration.Amount.DecimalSep;
    }

    value = (!!value) ? value : "0";
    decimal = sol.common.DecimalUtils.toDecimal(value, params);
    return decimal;
  },

  /**
   * Write a Decimal into an input field
   * @param {String} fieldName Field name
   * @param {Decimal} decimal Decimal
   * @param {Object} params Parameters
   * @param {Boolean} params.silent Silent
   * @param {Boolean} params.callInputChanged If true the function ´inputChanged´ will be called
   * @param {Function} params.roundingCurrencyCode Rounding currency code
   */
  updateDecimal: function (fieldName, decimal, params) {
    var me = this,
        field, decimalPlaces;

    params = params || {};

    if (!decimal) {
      if (params.silent) {
        return;
      }
      throw "Decimal is emtpy";
    }
    if (!fieldName) {
      throw "Field name is empty";
    }

    field = $var(fieldName);
    if (!field) {
      if (params.silent) {
        return;
      }
      throw "Field '" + fieldName + "' not found.";
    }

    decimalPlaces = me.getDisplayDecimalPlaces(field);
    me.writeDecimalField(field, decimal, decimalPlaces, params);
  },

  /**
   * Parse to Decimal
   * @param {String} str Number as String
   * @return {Decimal} Decimal
   */
  parseDecimal: function (str) {
    var decimal;

    str = str || "";
    if (str == "null") {
      str = "0";
    }
    str = str.split(ELO.Configuration.Amount.ThousandSep).join("");
    str = str.replace(ELO.Configuration.Amount.DecimalSep, ".");

    decimal = new Decimal(str);

    return decimal;
  },

  /**
   * Normalize decimals
   * @param {HTMLElement} field Field
   * @param {Object} params Params
   */
  normalizeDecimal: function (field, params) {
    var me = this,
        decimalPlaces, decimal, fieldName, inputs, i, input;

    if (!field) {
      return;
    }

    if (!me.isNumeric(field)) {
      return;
    }

    fieldName = field.name;

    inputs = document.querySelectorAll("input[name='" + fieldName + "']");

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      input.removeAttribute("decimal");
    }

    if (field.value == "") {
      return;
    }

    decimal = me.toDecimal(field);

    me.writeDecimalField(field, decimal, decimalPlaces, params);
  },

  /**
   * Writes a Decimal
   * @private
   * @param {HTMLElement} field Field
   * @param {Decimal} decimal Decimal
   * @param {Number} decimalPlaces Decimal places
   * @param {Object} params Parameters
   * @param {Boolean} params.callInputChanged If true the function ´inputChanged´ will be called
   * @param {Function} params.roundingCurrencyCode Rounding currency code
   * @param {Function} params.roundingFunction Rounding function
   */
  writeDecimalField: function (field, decimal, decimalPlaces, params) {
    var me = this,
        value, inputs, i, input;

    params = params || {};

    inputs = document.querySelectorAll("input[name='" + field.name + "']");

    if (params.roundingCurrencyCode) {
      params.roundingFunction = me.roundingFunctions[params.roundingCurrencyCode.toUpperCase()];
    }

    if (params.roundingFunction) {
      decimal = params.roundingFunction.call(me, decimal);
    }

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      input.setAttribute("decimal", decimal.toString());
    }

    value = decimal.toFixed(decimalPlaces).toString();
    value = value.replace(".", ELO.Configuration.Amount.DecimalSep);
    if (value == "Infinity") {
      value = "";
    }
    $update(field.name, value);

    if (params.callInputChanged) {
      inputChanged(field);
    }
  },

  /**
   * Return display decimal decimalPlaces
   * @param {HTMLElement} field Field
   * @return {String}
   */
  getDisplayDecimalPlaces: function (field) {
    var eloverifyString, match, result;
    if (!field) {
      throw "Field is emtpy";
    }
    eloverifyString = field.getAttribute("eloverify");
    if (eloverifyString) {
      match = eloverifyString.match(/nk:(\d+)/);
      if (match && (match.length == 2)) {
        result = parseInt(match[1], 10);
        return result;
      }
    }
  },

  /**
   * Shows or hides columns
   * @param {Array} columnNames Column names
   * @param {Boolean} show Show columns
   * @param {Object} params Parameters
   */
  showColumns: function (columnNames, show, params) {
    var me = this,
        i, columnName;
    for (i = 0; i < columnNames.length; i++) {
      columnName = columnNames[i];
      me.showColumn(columnName, show, params);
    }
  },

  /**
   * Show or hides a column
   * @param {String} columnName Column name
   * @param {Boolean} show Show column
   * @param {Object} params Parameters
   * @param {Boolean} [params.clear=false] Clear fields
   * @param {Boolean} [params.numberOfHeaderLines=1] Number of header lines
   */
  showColumn: function (columnName, show, params) {
    var me = this,
        field, columnIndex, addButton, tr, td, input, i;

    if (!columnName) {
      throw "Column name is empty";
    }

    params = params || {};
    params.clear = (typeof params.clear == "undefined") ? false : true;
    params.numberOfHeaderLines = params.numberOfHeaderLines || 1;

    field = $var(columnName + "1");

    if (!field) {
      return;
    }

    field = $var(columnName + "1");
    columnIndex = me.getColumnIndex(field);

    if (columnIndex > -1) {
      tr = me.getParentByTagName(field, "tr");
      for (i = 0; i < params.numberOfHeaderLines; i++) {
        tr = tr.previousElementSibling;
      }

      while (tr) {
        addButton = tr.querySelector("input[type='button'][name='JS_ADDLINE']");
        if (addButton) {
          return;
        }
        td = tr.querySelector("*:nth-child(" + (columnIndex + 1) + ")");
        if (show) {
          td.style.display = "";
        } else {
          if (params.clear) {
            input = td.querySelector("input[type='text']");
            if (input) {
              $update(input.name, "");
            }
          }
          td.style.display = "none";
        }
        tr = tr.nextElementSibling;
      }
    }
  },

  /**
   * Returns the column index
   * @param {HTMLElement} field Field
   * @return {Number} Column index
   */
  getColumnIndex: function (field) {
    var me = this,
        index = 0,
        td;

    if (field) {
      td = me.getParentByTagName(field, "TD");

      while (true) {
        td = td.previousElementSibling;
        if (td) {
          index++;
        } else {
          return index;
        }
      }
    }

    return -1;
  },

  /**
   * Disables dependent fields
   * @param {Object} disableDependentFieldsConfig Configuration to disable dependent fields
   * @param {Object} changedInput Changed input field
   */
  disableDependentFields: function (disableDependentFieldsConfig, changedInput) {
    var me = this,
        i = 0,
        fieldsExist, disableFieldNames, srcFieldName, key, fieldName, field, index, disable;

    if (!disableDependentFieldsConfig) {
      return;
    }

    if (changedInput) {
      srcFieldName = me.getFieldNamePrefix(changedInput, { replaceNumberBy: "{i}" });
      disableFieldNames = disableDependentFieldsConfig[srcFieldName];
      if (!disableFieldNames) {
        return;
      }
      disable = !!$val(changedInput.name);
      index = me.getFieldNameIndex(changedInput.name);
      me.disableFields(disableFieldNames, index, disable);
    } else {
      do {
        i++;
        fieldsExist = false;
        for (key in disableDependentFieldsConfig) {
          fieldName = key.replace("{i}", i);
          field = $var(fieldName);
          if (field) {
            fieldsExist = true;
            if ($val(fieldName)) {
              disableFieldNames = disableDependentFieldsConfig[key];
              me.disableFields(disableFieldNames, i, true);
              break;
            }
          }
        }
      } while (fieldsExist);
    }
  },

  /**
   * Disable fields
   * @param {Array} fieldNames Field names
   * @param {Number} index Index
   * @param {Boolean} disable
   * @param {Object} params
   */
  disableFields: function (fieldNames, index, disable, params) {
    var me = this,
        i, fieldName;

    for (i = 0; i < fieldNames.length; i++) {
      fieldName = fieldNames[i];
      fieldName = fieldName.replace("{i}", index);
      me.disableField(fieldName, disable);
    }
  },

  /**
   * Disables a field
   * @param {String} fieldName Field name
   * @param {Boolean} disable If true then the field will be disabled
   * @param {Object} params Parameters
   * @return {Boolean} Field is changed
   */
  disableField: function (fieldName, disable, params) {
    var field, clear;

    params = params || {};
    clear = (typeof params.clear == "undefined") ? true : false;

    if (!fieldName) {
      throw "Field name is empty";
    }
    field = $var(fieldName);
    if (!field) {
      return false;
    }
    if (disable) {
      if (clear) {
        $update(fieldName, "");
      }
      field.setAttribute("readonly", "readonly");
      field.style.backgroundImage = "none";
    } else {
      field.removeAttribute("readonly");
      field.style.backgroundImage = "";
    }
    return true;
  },

  /**
   * Disable column
   * @param {String} columnName Column name
   * @param {Boolean} disable If true then the field will be disabled
   * @param {Object} params Parameters
   * @param {Boolean} params.clear Clear value
   */
  disableColumn: function (columnName, disable, params) {
    var me = this,
        i = 0,
        fieldName, result;

    do {
      i++;
      fieldName = columnName + i;
      result = me.disableField(fieldName, disable, params);

    } while (result);
  },

  /**
   * Ensures that a specific table row exists
   * @param {String} fieldName Field name
   */
  ensureRowExists: function (fieldName) {
    var me = this,
        field, firstFieldName, firstField, addButton;

    if (!fieldName) {
      throw "Field name is empty";
    }

    firstFieldName = me.getFieldNamePrefix(fieldName) + "1";
    firstField = $var(firstFieldName);
    if (!firstField) {
      console.warn("First field doesn't exist. fieldName=" + firstFieldName);
      return;
    }
    addButton = addButton || me.getJsAddLineButton(firstFieldName);

    if (!addButton) {
      console.warn("Addbutton not found. fieldName=" + firstFieldName);
      return;
    }

    field = $var(fieldName);

    while (!field) {
      $addLine(addButton, 1);
      field = $var(fieldName);
    }
  },

  /**
   * Finds a JS_ADDLINE button by a given field name
   * @param {String} fieldName Field name
   * @return {HTMLElement}
   */
  getAddLineButton: function (fieldName) {
    var me = this,
        tr, field, button;

    if (!fieldName) {
      throw "Field name is empty";
    }
    field = $var(fieldName);
    if (!field) {
      throw "Can't find field '" + fieldName + "'";
    }

    tr = me.getParentByTagName(field, "tr");
    while (true) {
      tr = tr.nextElementSibling;
      if (!tr) {
        return;
      }
      button = tr.querySelector("input[type='button'][name='JS_ADDLINE']");
      if (button) {
        return button;
      }
    }
  },

  /**
   * Clears remaining lines
   * @param {String} fieldName Field name
   */
  clearRemainingLines: function (fieldName) {
    var me = this,
        field, tr, inputs, i, button, input;

    if (!fieldName) {
      throw "Field name is empty";
    }
    field = $var(fieldName);
    if (!field) {
      return;
    }
    tr = me.getParentByTagName(field, "tr");
    while (true) {
      if (!tr) {
        return;
      }
      button = tr.querySelector("input[type='button'][name='JS_ADDLINE']");
      if (button) {
        return;
      }
      inputs = tr.querySelectorAll("input[type='text']");
      for (i = 0; i < inputs.length; i++) {
        input = inputs[i];
        $update(input.name, "");
      }
      tr = tr.nextElementSibling;
    }
  },

  /**
   * Returns true if the column is empty
   * @param {String} columnName Column name
   * @return {Boolean}
   */
  isColumnEmpty: function (columnName) {
    var i = 1,
        field;

    do {
      field = $var(columnName + i);
      if (field && $val(columnName + i)) {
        return false;
      }
      i++;
    } while (field);

    return true;
  },

  /**
   * Returns true if the row is empty
   * @param {String} columnName Column name
   * @return {Boolean}
   */
  isRowEmpty: function (columnName) {
    var me = this,
        field, tr, inputs, i, input;

    field = $var(columnName);

    if (!field) {
      return false;
    }

    tr = me.getParentByTagName(field, "tr");

    if (!tr) {
      return false;
    }

    inputs = tr.querySelectorAll("input");

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      if (input.value) {
        return false;
      }
    }

    return true;
  },

  /**
   * Shows or hides a row
   * @param {String} columnName Column name
   * @param {Function} callback Callback
   */
  showRows: function (columnName, callback) {
    var me = this,
        i = 1,
        field, result, tr;

    if (!columnName) {
      throw "Column name is empty";
    }

    do {
      field = $var(columnName + i);
      if (field) {
        result = (callback) ? callback(i) : true;
        tr = me.getParentByTagName(field, "tr");
        if (tr) {
          tr.setAttribute("style", result ? "" : "display:none;");
        }
      }
      i++;
    } while (field);
  },

  /**
   * Registers a click handler
   * @param {Object} params Parameters
   * @param {String} params.name Button name
   * @param {String} params.prefix Button name prefix
   * @param {Object} params.ctx Context
   * @param {Function} params.func Function
   */
  addClickListener: function (params) {
    var elements, i, element, handlerFunc;

    params = params || {};
    if (!params.name && !params.prefix) {
      throw "Name or prefix must be set";
    }

    if (!params.ctx) {
      throw "Context must be set";
    }

    if (!params.func) {
      throw "Function must be set";
    }

    handlerFunc = function () {
      params.func.apply(params.ctx, arguments);
    };

    if (params.prefix) {
      elements = document.querySelectorAll("input[name^='" + params.prefix + "']");
    } else {
      elements = document.querySelectorAll("input[name='" + params.name + "']");
    }

    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      element.addEventListener("click", handlerFunc, false);
    }
  },

  /**
   * Returns the number of lines
   * @param {String} indicatorColumnName Indicator column name
   * @return {Number} Number of lines
   */
  countLines: function (indicatorColumnName) {
    var me = this,
        max = 0;

    me.forEachRow(indicatorColumnName, function (lineIndex) {
      max = lineIndex;
    });

    return parseInt(max, 10);
  },

  /**
   * Calls the registered function of the given name.
   * As parameter a JSON object can be given.
   *
   * @param {String} fctName The name of the registered function to call.
   * @param {Object} paramObj The input data for the function, sent as Serialized String value of the Any object.
   *
   * @param {Function} success Success callback function. The argument value
   *  is the deserialized JSON object from the String value of the Any
   *  object that was returned from the registered function.
   * @param {Function} failure Failure callback function the error object will be given as parameter.
   */
  callRegisteredFunction: function (fctName, paramObj, success, failure) {
    var me = this,
        standardAppName, url, rfParams;

    if (!fctName) {
      throw "Function name is missing";
    }

    standardAppName = "sol.common.apps.BusinessSolution";
    url = me.getAppApiUrl(standardAppName) + "exec_registered_fct/" + encodeURIComponent(fctName);

    rfParams = { any: JSON.stringify(paramObj) };

    me.sendPost(url, rfParams, function (resp) {
      var respObj;
      try {
        respObj = JSON.parse(resp);
      } catch (e) {
        console.info("Could not parse JSON in responseText: " + resp);
        failure(e);
      }
      success(respObj);
    },
    failure, {
      addTicket: true,
      addCookieTicket: true
    });
  },

  /**
   * Sends a post request
   * @param {String} url URL
   * @param {Object} dataObj Data object
   * @param {Function} success Success callback function.
   * @param {Function} failure Failure callback function the error object will be given as parameter.
   * @param {Object} params Parameters
   * @param {Object} params.reqParamsObj Request params object
   * @param {Boolean} params.addTicket Add ticket
   */
  sendPost: function (url, dataObj, success, failure, params) {
    var me = this,
        xhr, data, reqParamsString;

    dataObj = dataObj || {};
    params = params || {};
    params.reqParamsObj = params.reqParamsObj || {};
    params.contentType = params.contentType || "application/x-www-form-urlencoded";

    if (params.addTicket) {
      params.reqParamsObj.ticket = ELO_PARAMS.ELO_TICKET;
    }

    reqParamsString = me.encodeParams(params.reqParamsObj);
    if (reqParamsString) {
      url += "?" + reqParamsString;
    }

    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (params.contentType) {
      xhr.setRequestHeader("Content-type", params.contentType);
    }

    data = me.encodeParams(dataObj);

    xhr.onload = function () {
      var resp;

      resp = xhr.responseText;

      if (xhr.status == 200) {
        success(resp);
      } else {
        failure(resp);
      }
    };

    xhr.send(data);
  },

  /**
   * Encodes parameters
   * @param {Object} params Parameters
   * @param {String} separator Separator
   * @return {String}
   */
  encodeParams: function (params, separator) {
    var parts = [],
        prop, paramsString;

    params = params || {};

    separator = separator || "&";

    for (prop in params) {
      if (params.hasOwnProperty(prop)) {
        parts.push(encodeURIComponent(prop) + "=" + encodeURIComponent(params[prop]));
      }
    }

    if (parts.length == 0) {
      return "";
    }

    paramsString = parts.join(separator);

    return paramsString;
  },

  /**
   * Returns the ELOwf URL
   * @return {String} ELOwf URL
   */
  getWfUrl: function () {
    var currentUrl, wfUrl;

    currentUrl = window.location.href;
    wfUrl = currentUrl.substr(0, currentUrl.lastIndexOf("/wf/"));

    return wfUrl;
  },

  /**
   * Returns the URL for a specific app
   * @param {String} appName App name
   * @return {String} ELOapp URL
   */
  getAppUrl: function (appName) {
    var me = this,
        wfUrl, appUrl;

    wfUrl = me.getWfUrl();
    appUrl = wfUrl + "/apps/app/" + appName + "/";

    return appUrl;
  },

  /**
   * Returns the URL for an app API
   * @param {String} appName App name
   * @return {String} ELOapp API URL
   */
  getAppApiUrl: function (appName) {
    var me = this,
        appUrl, appApiUrl;

    if (!appName) {
      throw "AppName is missing";
    }

    appUrl = me.getAppUrl(appName);

    appApiUrl = appUrl + "api/";

    return appApiUrl;
  },

  /**
   * Insert list
   * @param {String}labelName Label name
   * @param {Array} entries Entries
   * @param {String} entries[].text Text
   * @param {Object} entries[].params Parameters
   */
  showTemplateListWarning: function (labelName, entries) {
    var me = this,
        label, listElements, listElement, list, i, entry, listEntry, listEntryLink, entryTextElement,
        span, spanTextNode;

    label = $var(labelName);

    if (!label) {
      return;
    }

    listElements = label.getElementsByTagName("ul");

    for (i = 0; i < listElements.length; i++) {
      listElement = listElements[i];
      label.removeChild(listElement);
    }

    if (!entries || (entries.length == 0)) {
      me.hideTemplate(label);
      return;
    }

    list = document.createElement("ul");
    for (i = 0; i < entries.length; i++) {
      entry = entries[i];
      listEntry = document.createElement("li");
      if (entry.style) {
        listEntry.setAttribute("style", entry.style);
      }
      listEntryLink = document.createElement("a");


      if (entry.params) {
        if (entry.params.guid) {
          listEntryLink.setAttribute("sordGuid", entry.params.guid);
          listEntryLink.onclick = function () { // eslint-disable-line no-loop-func
            var sordGuid;
            sordGuid = this.getAttribute("sordGuid");
            me.gotoSord(sordGuid);
          };
        }
      }
      entryTextElement = document.createTextNode(entry.text);
      listEntryLink.appendChild(entryTextElement);
      listEntry.appendChild(listEntryLink);
      if (entry.span) {
        span = document.createElement("span");
        if (entry.span.style) {
          span.setAttribute("style", entry.span.style);
        }
        spanTextNode = document.createTextNode(entry.span.text);
        span.appendChild(spanTextNode);
        listEntry.appendChild(span);
      }
      list.appendChild(listEntry);
    }

    label.appendChild(list);

    me.showTemplate(label);
  },

  /**
   * Goto a sord
   * @param {String} guid GUID
   */
  gotoSord: function (guid) {
    if (!guid) {
      return;
    }
    var data = {};
    console.info("sendGoto: " + guid);
    data[api.constants.communication.DATA_GUID] = guid;
    api.communication.Parent.sendGoto(data);
  },

  /**
   * Hides a template
   * @param {HTMLElement} field Field
   */
  hideTemplate: function (field) {
    var me = this,
        template;

    if (!field) {
      return;
    }

    template = me.getTemplate(field);

    if (!template) {
      return;
    }

    template.style.display = "none";
  },

  /**
   * Shows/hides a template
   * @param {HTMLElement} field Field
   * @param {Boolean} [enabled=true]
   */
  showTemplate: function (field, enabled) {
    var me = this,
        template;

    enabled = (typeof enabled == "undefined") ? true : enabled;

    if (!field) {
      return;
    }

    template = me.getTemplate(field);

    if (!template) {
      return;
    }

    if (enabled) {
      template.style.display = "";
    } else {
      template.style.display = "none";
    }
  },

  /**
   * Checks the version of ELO components
   * @param {String} currentVersionString
   * @param {String} requiredVersionString
   * @return {Boolean} Return true if the current version is equal or higher then the required version
   */
  checkVersion: function (currentVersionString, requiredVersionString) {
    var result = true,
        currentRegex, requiredRegex, currentVersionMatch, requiredVersionMatch, currentPart, requiredPart;

    currentRegex = /([0-9]+(\\.[0-9]+)*)/g;
    requiredRegex = /([0-9]+(\\.[0-9]+)*)/g;
    currentVersionMatch = currentRegex.exec(currentVersionString);
    requiredVersionMatch = requiredRegex.exec(requiredVersionString);

    while (requiredVersionMatch !== null) {
      currentPart = (currentVersionMatch) ? parseInt(currentVersionMatch[0], 10) : 0;
      requiredPart = parseInt(requiredVersionMatch[0], 10);
      if (requiredPart > currentPart) {
        result = false;
        break;
      } else if (requiredPart < currentPart) {
        result = true;
        break;
      }
      currentVersionMatch = currentRegex.exec(currentVersionString);
      requiredVersionMatch = requiredRegex.exec(requiredVersionString);
    }

    return result;
  },

  /**
   * This creates a hidden field to write values to the sord.
   * If a field already exists the existing field will be updated.
   * @param {Object} cfg
   * @param {String} [cfg.type=GRP] GRP|MAP|WFMAP
   * @param {String} cfg.key
   * @param {String} value
   */
  setHiddenValue: function (cfg, value) {
    var field, input, form;

    switch (cfg.type) {
      case "MAP":
        field = "IX_MAP_" + cfg.key;
        break;
      case "WFMAP":
        field = "WF_MAP_" + cfg.key;
        break;
      default:
        field = "IX_GRP_" + cfg.key;
        break;
    }

    input = $var(field);

    if (!input) {
      form = document.getElementById("elo_wf_form");
      input = document.createElement("input");
      input.type = "hidden";
      input.name = field;
      form.append(input);
    }

    $update(field, value);
  },

  /**
   * Removes the field name prefix
   * @param {String} fieldName Field name
   * @return {String} Field name without prefix
   */
  removeFieldNamePrefix: function (fieldName) {
    if (!fieldName) {
      return "";
    }
    fieldName = fieldName.replace(/^(IX|WF)_(GRP|MAP|BLOB)_/, "");

    return fieldName;
  },

  /**
   * Returns a template Sord
   * @return {Object} Template sord
   */
  getTemplateSord: function () {
    var me = this,
        tplSord, value, name, shortName, inputs, i, input, dataType;

    tplSord = {
      objKeys: {},
      mapKeys: {}
    };

    inputs = document.querySelectorAll("input");

    for (i = 0; i < inputs.length; i++) {
      input = inputs[i];
      name = input.name;
      dataType = me.getInputDataType(input);
      if (dataType == "isodate") {
        value = me.getIsoDate(name);
      } else {
        value = $val(name);
      }

      if (name.indexOf("IX_GRP_") == 0) {
        shortName = name.substr(7);
        tplSord.objKeys[shortName] = value;
      } else if (name.indexOf("IX_MAP_") == 0) {
        shortName = name.substr(7);
        tplSord.mapKeys[shortName] = value;
      }
    }

    return tplSord;
  },

  /**
   * Updates values
   * @param {Object} updates Updates
   *     {
   *         objKeys: {
   *         },
   *         mapKeys: {
   *           "MYKEY": "myvalue"
   *         }
   *     }
   */
  updateValues: function (updates) {
    var me = this;

    if (!updates) {
      return;
    }

    me.writeUpdates(updates.objKeys, "IX_GRP_");
    me.writeUpdates(updates.mapKeys, "IX_MAP_");
  },

  /**
   * @private
   * @param {Object} entries Entries
   *     {
   *       "MYKEY": "myvalue"
   *     }
   * @param {String} prefix Prefix
   */
  writeUpdates: function (entries, prefix) {
    var me = this,
        value, dataType, key, fieldName, field;

    for (key in entries) {
      fieldName = prefix + key;
      value = entries[key];

      field = $var(fieldName);

      dataType = me.getInputDataType(field);
      if (dataType == "isodate") {
        me.setIsoDate(fieldName, value, { callInputChanged: false });
      } else {
        $update(fieldName, value);
      }
    }
  },

  /**
   * Returns the input type
   * @param {HTMLElement} input Input
   * @return {String} Data type
   */
  getInputDataType: function (input) {
    var inputDataType, eloVerify, eloVerifyElements;

    inputDataType = "text";

    if (!input) {
      throw "Input field is missing";
    }

    eloVerify = input.getAttribute("eloverify");
    if (eloVerify) {
      eloVerifyElements = eloVerify.split(" ");
    }

    if (eloVerifyElements && (eloVerifyElements.indexOf("date") > -1)) {
      inputDataType = "isodate";
    }

    return inputDataType;
  },

  /**
   * Sets a `changed` Flag
   * @param {HTMLElement} field Field
   */
  setFieldChanged: function (field) {
    if (!field) {
      return;
    }
    field.setAttribute("changed", "");
  },

  /**
   * Creates an easily editable field from a multiindex field value.
   * e.g. mi = MultiIndex("abc¶def¶xyz");
   *      mi.values() => ["abc", "def", "xyz"]
   *      mi.add("test") => ["abc", "def", "xyz", "test"]
   *      mi.remove("def") => ["abc", "xyz", "test"]
   *      mi.contains("abc") => true
   *      String(mi) => "abc¶xyz¶test"
   *      mi.save("IX_GRP_MYFIELD") => $updates MYFIELD with current String representation
   * @param {String|FormWrapper Field} f
   * @returns MultiIndex field
   */
  MultiIndex: function (f) {
    var a, iA;
    f || (f = "");
    try {
      a = (typeof f === "string" ? f : ((f || {}).value() || "")).split("¶");
    } catch (_e) {
      console.log("MultiIndex requires a string or FormWrapper field as constructor parameter.");
    }
    ((a.length === 1) && (a[0] === "") && (a = []));
    iA = {
      values: a.slice.bind(a),
      toString: function () {
        return a.reduce(function (s, val, i) {
          s += val;
          (i + 1 < a.length) && (s += "¶");
          return s;
        }, "");
      },
      valueOf: NaN,
      add: function (val) {
        return (!this.contains(val) && a.push(String(val))), a;
      },
      remove: function (val) {
        var i = a.indexOf(val), valExists = ~i;
        return (valExists && a.splice(i, 1)), a;
      },
      contains: function (val) {
        return !!~a.indexOf(val);
      },
      save: function (fieldName) {
        var val = String(this);
        fieldName
          ? (f.form ? f.form.fields[fieldName].set(val) : $update(fieldName, val))
          : ((f && f.set) ? f.set(val) : console.log("could not save. no field specified"));
      }
    };
    iA.toJSON = iA.toString;
    return iA;
  },

  /**
   * Returns the time zone from the URL
   * @return {String} Time zone
   */
  getTimeZoneFromUrl: function () {
    var me = this,
        urlParams, timeZone;

    urlParams = me.getUrlParams();

    timeZone = urlParams["timezone"];

    return timeZone;
  },

  /**
   * Returns the URL params
   * @return {Object} URL parameters
   */
  getUrlParams: function () {
    var params = {};

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return params;
  },

  /**
   * Checks whether a field is missing
   * @param {Array} fieldNames Field names
   */
  fieldIsMissing: function (fieldNames) {
    var i;

    if (!fieldNames) {
      return true;
    }

    for (i = 0; i < fieldNames.length; i++) {
      if (!$var(fieldNames[i])) {
        return true;
      }
    }

    return false;
  },

  /**
   * Moves a row after another row
   *
   * @param {String} rowToMoveFieldName Row to move field name
   * @param {String} dstRowFieldName Destination row field name
   * @param {Object} params Parameters
   * @param {String} params.identifyTemplateByFieldName Identify the template by a specific field name
   */
  moveRowAfter: function (rowToMoveFieldName, dstRowFieldName, params) {
    var me = this,
        rowToMoveField, dstRowField, rowToMove, dstRow, tbody, templateField, template;

    params = params || {};

    if (!rowToMoveFieldName) {
      throw "Row to move field name is empty";
    }

    if (!dstRowFieldName) {
      throw "Destination row field name is empty";
    }

    if (params.identifyTemplateByFieldName) {
      templateField = $var(params.identifyTemplateByFieldName);
      template = me.getTemplate(templateField);
      rowToMoveField = me.getFieldInTemplate(template, rowToMoveFieldName);
    } else {
      rowToMoveField = $var(rowToMoveFieldName);
    }

    if (!rowToMoveField) {
      throw "Can't find row to move field '" + rowToMoveFieldName + "'";
    }

    dstRowField = $var(dstRowFieldName);

    if (!dstRowField) {
      throw "Can't find destination row field '" + dstRowFieldName + "'";
    }

    rowToMove = me.getRow(rowToMoveField);

    dstRow = me.getRow(dstRowField);

    tbody = me.getParentByTagName(dstRow, "tbody");

    tbody.insertBefore(rowToMove, dstRow.nextSibling);
  },

  /**
   * Returns a field within a specific template
   * @param {HTMLElement} template Template
   * @param {HTMLElement} fieldName Field name
   */
  getFieldInTemplate: function (template, fieldName) {
    var field;

    if (!template) {
      throw "Template is empty";
    }

    if (!fieldName) {
      throw "Field name is empty";
    }

    field = template.querySelector("input[name='" + fieldName + "']");

    return field;
  },

  /**
   * Sets a label
   * @param {String} lblName Label name
   * @param {String} translationKey Translation key
   */
  setLabel: function (lblName, translationKey) {
    var me = this,
        label, text;

    if (!lblName) {
      throw "Field name is emtpy";
    }

    label = $var(lblName);

    if (!label) {
      throw "Label '" + lblName + "' not found";
    }

    text = me.getTranslation(translationKey);

    $update(lblName, text);
  },

  /**
   * Returns a translation
   * @param {String} translationKey Translation key
   * @return Translation
   */
  getTranslation: function (translationKey) {
    var translation = "";

    if (!translationKey) {
      throw "Translation key is empty";
    }

    if (elo && elo.locale && elo.locale.store) {
      translation = elo.locale.store[translationKey];
    }

    if (!translation) {
      console.info("Translation key '" + translationKey + "' not found");
      return translationKey;
    }

    return translation;
  },

  /**
   * Adds a validation attibute
   * @param {String} fieldName
   * @param {String} [validationAttribute=notemptyforward]
   */
  addValidation: function (fieldName, validationAttribute) {
    var field, eloverify;

    if (!fieldName) {
      throw "Field name is missing";
    }

    validationAttribute = validationAttribute || "notemptyforward";

    field = $var(fieldName);

    if (!field) {
      return;
    }

    eloverify = field.getAttribute("eloverify");
    eloverify += " " + validationAttribute;
    field.setAttribute("eloverify", eloverify);
  },

  /**
   * Removes a validation attibute
   * @param {String} fieldName
   * @param {String} [validationAttribute=notemptyforward]
   */
  removeValidation: function (fieldName, validationAttribute) {
    var field, eloverify;

    if (!fieldName) {
      throw "Field name is missing";
    }

    validationAttribute = validationAttribute || "notemptyforward";

    field = $var(fieldName);

    if (!field) {
      return;
    }

    eloverify = field.getAttribute("eloverify");
    eloverify = eloverify.replace(validationAttribute, "");
    field.setAttribute("eloverify", eloverify);
  },

  /**
   * Checks wether a field is numeric
   * @param {HTMLElement} field
   */
  isNumeric: function (field) {
    var types, i, type, eloverify;

    types = ["num", "amount"];

    if (!field) {
      throw "Field is missing";
    }

    eloverify = field.getAttribute("eloverify");

    if (!eloverify) {
      return false;
    }

    for (i = 0; i < types.length; i++) {
      type = types[i];
      if (eloverify.indexOf(type) > -1) {
        return true;
      }
    }

    return false;
  },

  /**
   * Removes a class from a specified field
   * @param {String} fieldName Field name
   * @param {String} className Class name
   */
  removeFieldClass: function (fieldName, className) {
    var me = this,
        field, td;

    if (!fieldName) {
      throw "Field name is empty";
    }

    field = $var(fieldName);

    if (!field || !className) {
      return;
    }

    td = me.getParentByTagName(field, "td");

    td.classList.remove(className);
  }
});
